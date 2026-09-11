(function process(request, response) {
    try {
        // ─── Query params (Scripted REST may hand back arrays) ────────────────
        function param(name) {
            var value = request.queryParams[name];
            if (Array.isArray(value)) value = value[0];
            return value ? String(value) : '';
        }

        var term     = param('term').replace(/^\s+|\s+$/g, '');
        var recordId = param('id');

        // Object names end up inside SOQL, so only plain API names are accepted
        var objects = [];
        var requested = param('objects').split(',');
        for (var o = 0; o < requested.length && objects.length < 5; o++) {
            var objectName = requested[o].replace(/^\s+|\s+$/g, '');
            if (/^[A-Za-z][A-Za-z0-9_]*$/.test(objectName)) objects.push(objectName);
        }

        if (!objects.length) {
            response.setStatus(400);
            response.setBody({ success: false, error: 'Missing required param: objects.' });
            return;
        }

        var MAX_RESULTS = 10;

        // ─── Token: skip the per-call validation, recover on 401 instead ──────
        var auth = new x_1955226_connecto.SalesforceAuthService();
        var tokenResult = auth.getStoredToken();
        if (!tokenResult.success) tokenResult = auth.getAccessToken();
        if (!tokenResult.success || !tokenResult.token) {
            response.setStatus(401);
            response.setBody({ success: false, error: tokenResult.error || 'Not authenticated with Salesforce.' });
            return;
        }

        var API_VERSION = 'v60.0';

        function postBatch(payload) {
            var req = new sn_ws.RESTMessageV2();
            req.setEndpoint(tokenResult.baseUrl + '/services/data/' + API_VERSION + '/composite/batch');
            req.setHttpMethod('POST');
            req.setRequestHeader('Authorization', 'Bearer ' + tokenResult.token);
            req.setRequestHeader('Content-Type', 'application/json');
            req.setRequestHeader('Accept', 'application/json');
            req.setRequestBody(payload);

            var res  = req.execute();
            var body = null;
            try { body = JSON.parse(res.getBody()); } catch (parseErr) { body = null; }
            return { status: res.getStatusCode(), body: body };
        }

        // ─── Several Salesforce calls in one round trip (Composite Batch) ─────
        // Salesforce runs the sub-requests itself, so they no longer queue up
        // behind each other on the ServiceNow side
        function sendBatch(subRequests) {
            var payload = JSON.stringify({ batchRequests: subRequests });
            var res = postBatch(payload);

            if (res.status === 401) {
                // Stored token expired — validate / refresh once and retry
                tokenResult = auth.getAccessToken();
                if (!tokenResult.success || !tokenResult.token) {
                    throw new Error('Not authenticated with Salesforce.');
                }
                res = postBatch(payload);
            }

            if (res.status < 200 || res.status >= 300) {
                throw new Error('Salesforce batch request failed (HTTP ' + res.status + ')');
            }
            return (res.body && res.body.results) || [];
        }

        // ─── Describe metadata is stable, so it is cached for the session ─────
        var session = gs.getSession();

        function readMeta(name) {
            try {
                var raw = session.getClientData('x_1955226_connecto.sfmeta.' + name);
                return raw ? JSON.parse(raw) : null;
            } catch (cacheErr) {
                return null;
            }
        }

        function writeMeta(name, meta) {
            try {
                session.putClientData('x_1955226_connecto.sfmeta.' + name, JSON.stringify(meta));
            } catch (cacheErr) {
                // Caching is an optimisation only
            }
        }

        // The name field differs per object (Name, CaseNumber, Subject, ...)
        function summarize(described) {
            var fields = described.fields || [];
            var nameField = null;
            var hasDeveloperName = false;
            for (var i = 0; i < fields.length; i++) {
                if (!nameField && fields[i].nameField) nameField = fields[i];
                if (fields[i].name === 'DeveloperName') hasDeveloperName = true;
            }
            return {
                name:             described.name,
                label:            described.label,
                keyPrefix:        described.keyPrefix,
                nameField:        nameField ? nameField.name : '',
                filterable:       !!nameField && nameField.filterable !== false,
                sortable:         !!nameField && nameField.sortable !== false,
                hasDeveloperName: hasDeveloperName
            };
        }

        var metaByObject = {};
        var missing = [];
        for (var m = 0; m < objects.length; m++) {
            var cached = readMeta(objects[m]);
            if (cached) metaByObject[objects[m]] = cached;
            else missing.push(objects[m]);
        }

        if (missing.length) {
            var describeRequests = [];
            for (var dr = 0; dr < missing.length; dr++) {
                describeRequests.push({ method: 'GET', url: API_VERSION + '/sobjects/' + missing[dr] + '/describe' });
            }
            var describeResults = sendBatch(describeRequests);
            for (var ds = 0; ds < missing.length; ds++) {
                var item = describeResults[ds];
                // The connected user may not have access to every referenced object
                if (!item || item.statusCode !== 200 || !item.result) continue;
                var meta = summarize(item.result);
                metaByObject[missing[ds]] = meta;
                writeMeta(missing[ds], meta);
            }
        }

        var available = [];
        for (var a = 0; a < objects.length; a++) {
            if (metaByObject[objects[a]] && metaByObject[objects[a]].nameField) {
                available.push(metaByObject[objects[a]]);
            }
        }

        // Backslash first, then the quote, then the LIKE wildcards
        function escapeLike(value) {
            return value
                .replace(/\\/g, '\\\\')
                .replace(/'/g, "\\'")
                .replace(/%/g, '\\%')
                .replace(/_/g, '\\_');
        }

        // ─── Build every query up front and send them together ────────────────
        var queries = [];

        if (recordId) {
            // Resolve one saved Id — its key prefix tells which object it belongs to
            if (/^[A-Za-z0-9]{15}([A-Za-z0-9]{3})?$/.test(recordId)) {
                var prefix = recordId.substring(0, 3);
                for (var k = 0; k < available.length; k++) {
                    var owner = available[k];
                    if (owner.keyPrefix !== prefix) continue;
                    var columns = 'Id, ' + owner.nameField + (owner.hasDeveloperName ? ', DeveloperName' : '');
                    queries.push({
                        meta: owner,
                        soql: 'SELECT ' + columns + ' FROM ' + owner.name + " WHERE Id = '" + recordId + "' LIMIT 1"
                    });
                    break;
                }
            }
        } else {
            var searchable = [];
            for (var s = 0; s < available.length; s++) {
                if (available[s].filterable) searchable.push(available[s]);
            }

            for (var si = 0; si < searchable.length; si++) {
                var info = searchable[si];

                // The overall limit is split between the objects of a polymorphic
                // lookup, e.g. 5 + 5 for Group/User or 4 + 3 + 3 for three objects
                var share = Math.floor(MAX_RESULTS / searchable.length) +
                    (si < MAX_RESULTS % searchable.length ? 1 : 0);
                if (share < 1) continue;

                // LIKE '_%' demands at least one character. Role-based Groups come back
                // with an empty Name, yet "Name != null" still matches them in SOQL and
                // sorts them to the top — LIKE is what reliably leaves them out.
                var pattern = term ? '%' + escapeLike(term) + '%' : '_%';
                var soql = 'SELECT Id, ' + info.nameField + ' FROM ' + info.name +
                    ' WHERE ' + info.nameField + " LIKE '" + pattern + "'";
                if (info.sortable) soql += ' ORDER BY ' + info.nameField;
                soql += ' LIMIT ' + share;

                queries.push({ meta: info, soql: soql });
            }
        }

        var records = [];
        var polymorphic = available.length > 1;

        if (queries.length) {
            var queryRequests = [];
            for (var q = 0; q < queries.length; q++) {
                queryRequests.push({ method: 'GET', url: API_VERSION + '/query?q=' + encodeURIComponent(queries[q].soql) });
            }

            var queryResults = sendBatch(queryRequests);
            var perObject = [];
            for (var qr = 0; qr < queries.length; qr++) {
                var result = queryResults[qr];
                var bucket = [];
                // Some referenced objects are not queryable by this user
                if (result && result.statusCode === 200 && result.result) {
                    var rows = result.result.records || [];
                    var source = queries[qr].meta;
                    for (var r = 0; r < rows.length; r++) {
                        var row  = rows[r];
                        // The name is shown exactly as stored; the record Id itself is never
                        // used as a label — the object label is the last resort
                        var name = row[source.nameField] ? String(row[source.nameField])
                                 : row.DeveloperName ? String(row.DeveloperName) : '';
                        bucket.push({
                            id:    row.Id,
                            label: !name ? source.label : (polymorphic ? name + ' (' + source.label + ')' : name)
                        });
                    }
                }
                perObject.push(bucket);
            }

            // Each query already carries its object's share of the limit, so the
            // records are simply listed object by object, never interleaved
            for (var g = 0; g < perObject.length; g++) {
                for (var n = 0; n < perObject[g].length && records.length < MAX_RESULTS; n++) {
                    records.push(perObject[g][n]);
                }
            }
        }

        response.setStatus(200);
        response.setBody({ success: true, records: records });

    } catch (err) {
        response.setStatus(500);
        response.setBody({ success: false, message: err + '' });
    }
})(request, response);
