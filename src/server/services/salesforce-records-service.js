var SalesforceRecordsService = Class.create();
SalesforceRecordsService.prototype = {
    initialize: function() {},

    getLinkedRecords: function(objectName, fields, serviceNowRecordsSet) {
        // ─── Guard: nothing to query ──────────────────────────────────────────
        if (!serviceNowRecordsSet || serviceNowRecordsSet.length === 0) {
            return {};
        }

        // ─── Step 1: get junction records ─────────────────────────────────────
        // Fields come from trusted internal config — not user input
        var junctionQuery =
            "SELECT Id, Name, pl_servicenow__SN_Object_Id__c " +
            "FROM pl_servicenow__Peeklogic_Object_Connect__c " +
            "WHERE pl_servicenow__SN_Object_Id__c IN ('" + serviceNowRecordsSet.join("','") + "')";

        var junctionRecords = this.query(junctionQuery);
        if (!junctionRecords.length) return {};

        // ─── Build SF ID → SN ID map ──────────────────────────────────────────
        var sfIdToSnIdMap = {};
        var salesforceIds = [];
        for (var i = 0; i < junctionRecords.length; i++) {
            var jr = junctionRecords[i];
            sfIdToSnIdMap[jr.Name] = jr.pl_servicenow__SN_Object_Id__c;
            salesforceIds.push(jr.Name);
        }

        // ─── Step 2: get Salesforce records ───────────────────────────────────
        var sfQuery =
            "SELECT " + fields.join(', ') + " " +
            "FROM " + objectName + " " +
            "WHERE Id IN ('" + salesforceIds.join("','") + "') " +
            "LIMIT 50000";

        var salesforceRecords = this.query(sfQuery);

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

    query: function(queryString) {
        var service = new x_1955226_connecto.SalesforceAuthService();
        var tokenResult = service.getAccessToken();

        if (!tokenResult.success || !tokenResult.token) {
            throw new Error('Failed to get Salesforce access token: ' + (tokenResult.error || 'Unknown error'));
        }

        var endpoint = tokenResult.baseUrl + '/services/data/v60.0/query?q=' + encodeURIComponent(queryString);

        var req = new sn_ws.RESTMessageV2();
        req.setEndpoint(endpoint);
        req.setHttpMethod('GET');
        req.setRequestHeader('Content-Type', 'application/json');
        req.setRequestHeader('Authorization', 'Bearer ' + tokenResult.token);

        var res = req.execute();
        var status = res.getStatusCode();
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

        return parsed.records;
    },

    type: 'SalesforceRecordsService'
};