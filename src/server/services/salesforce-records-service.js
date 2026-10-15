var SalesforceRecordsService = Class.create();
SalesforceRecordsService.prototype = {
    // SOQL goes in the GET query string; Salesforce rejects URIs over ~16K chars.
    // An encoded quoted sys_id or SF Id takes up to ~40 chars, so 300 ids per
    // IN clause stays well under the limit
    ID_CHUNK_SIZE: 300,

    QUERY_PATH: '/services/data/v60.0/query?q=',

    initialize: function() {
        this._auth  = null;
        this._token = null;
    },

    getLinkedRecords: function(objectName, fields, serviceNowRecordsSet) {
        // ─── Guard: nothing to query ──────────────────────────────────────────
        if (!serviceNowRecordsSet || serviceNowRecordsSet.length === 0) {
            return {};
        }

        // ─── Step 1: get junction records ─────────────────────────────────────
        // Fields come from trusted internal config — not user input
        var junctionQueries = this._chunk(serviceNowRecordsSet, this.ID_CHUNK_SIZE).map(function(ids) {
            return "SELECT Id, Name, pl_servicenow__SN_Object_Id__c " +
                   "FROM pl_servicenow__Peeklogic_Object_Connect__c " +
                   "WHERE pl_servicenow__SN_Object_Id__c IN ('" + ids.join("','") + "')";
        });
        var junctionRecords = this.queryAll(junctionQueries);
        if (!junctionRecords.length) return {};

        // ─── Build SF ID → SN ID map ──────────────────────────────────────────
        var sfIdToSnIdMap = {};
        var salesforceIds = [];
        for (var i = 0; i < junctionRecords.length; i++) {
            var jr = junctionRecords[i];
            if (!sfIdToSnIdMap.hasOwnProperty(jr.Name)) salesforceIds.push(jr.Name);
            sfIdToSnIdMap[jr.Name] = jr.pl_servicenow__SN_Object_Id__c;
        }

        // ─── Step 2: get Salesforce records ───────────────────────────────────
        var recordQueries = this._chunk(salesforceIds, this.ID_CHUNK_SIZE).map(function(ids) {
            return "SELECT " + fields.join(', ') + " " +
                   "FROM " + objectName + " " +
                   "WHERE Id IN ('" + ids.join("','") + "')";
        });
        var salesforceRecords = this.queryAll(recordQueries);

        // ─── Build SN ID → SF record map ──────────────────────────────────────
        var snIdToSfRecordMap = {};
        for (var j = 0; j < salesforceRecords.length; j++) {
            var record = salesforceRecords[j];
            if (sfIdToSnIdMap.hasOwnProperty(record.Id)) {
                snIdToSfRecordMap[sfIdToSnIdMap[record.Id]] = record;
            }
        }

        return snIdToSfRecordMap;
    },

    // ─── Run one SOQL query, reading every result page ────────────────────────
    query: function(queryString) {
        return this.queryAll([queryString]);
    },

    // ─── Run several SOQL queries concurrently ────────────────────────────────
    // Every request is sent before any response is awaited, so a batch costs
    // about one round trip instead of one per query. Further result pages
    // (nextRecordsUrl) are rare and read one after another.
    queryAll: function(queries) {
        var token = this._getToken(false);
        var self = this;

        var pending = queries.map(function(q) {
            var path = self.QUERY_PATH + encodeURIComponent(q);
            return { path: path, call: self._start(token, path) };
        });

        var records = [];
        for (var i = 0; i < pending.length; i++) {
            var parsed = this._finish(pending[i].call, pending[i].path);
            records = records.concat(parsed.records);

            while (parsed.done === false && parsed.nextRecordsUrl) {
                parsed = this._get(parsed.nextRecordsUrl);
                records = records.concat(parsed.records);
            }
        }
        return records;
    },

    // ─── Single GET with the cached token ─────────────────────────────────────
    _get: function(path) {
        return this._finish(this._start(this._getToken(false), path), path);
    },

    _start: function(token, path) {
        var req = new sn_ws.RESTMessageV2();
        req.setEndpoint(token.baseUrl + path);
        req.setHttpMethod('GET');
        req.setRequestHeader('Content-Type', 'application/json');
        req.setRequestHeader('Authorization', 'Bearer ' + token.token);

        return { res: req.executeAsync(), token: token };
    },

    // ─── Wait for a response and parse it ─────────────────────────────────────
    // The stored token is used without a validation round trip; only a 401
    // triggers a validate/refresh and a single retry
    _finish: function(call, path, isRetry) {
        var res = call.res;
        res.waitForResponse(60);

        var status = res.getStatusCode();
        if (status === 401 && !isRetry) {
            // Concurrent requests all fail with the same expired token; only the
            // first one refreshes it, the rest reuse the new token
            var fresh = this._token && this._token.token !== call.token.token
                ? this._token
                : this._getToken(true);
            return this._finish(this._start(fresh, path), path, true);
        }

        var body = res.getBody();
        var parsed;
        try {
            parsed = JSON.parse(body);
        } catch (e) {
            throw new Error('Invalid JSON response: ' + body);
        }

        if (status < 200 || status >= 300) {
            throw new Error('Salesforce query failed. HTTP ' + status + ': ' + body);
        }
        if (!parsed.records) {
            throw new Error('No records returned from Salesforce query.');
        }

        return parsed;
    },

    _getToken: function(forceRefresh) {
        if (this._token && !forceRefresh) return this._token;
        if (!this._auth) this._auth = new x_peekl_snreports.SalesforceAuthService();

        var result = forceRefresh ? { success: false } : this._auth.getStoredToken();
        if (!result.success || !result.token) {
            // Validates the stored token and refreshes it when expired
            result = this._auth.getAccessToken();
        }
        if (!result.success || !result.token) {
            throw new Error('Failed to get Salesforce access token: ' + (result.error || 'Unknown error'));
        }

        this._token = result;
        return this._token;
    },

    _chunk: function(list, size) {
        var chunks = [];
        for (var i = 0; i < list.length; i += size) {
            chunks.push(list.slice(i, i + size));
        }
        return chunks;
    },

    type: 'SalesforceRecordsService'
};
