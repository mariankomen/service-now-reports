(function process(request, response) {
    try {

        // ─── Flatten nested SF record into dot-notation keys ──────────────────
        function flattenSFRecord(obj, prefix) {
            var result = {};
            for (var key in obj) {
                if (key === 'attributes') continue;
                var val = obj[key];
                var fullKey = prefix ? prefix + '.' + key : key;
                if (val !== null && typeof val === 'object' && !Array.isArray(val)) {
                    var nested = flattenSFRecord(val, fullKey);
                    for (var nk in nested) result[nk] = nested[nk];
                } else {
                    result[fullKey] = val;
                }
            }
            return result;
        }

        // ─── Parse and validate request body ─────────────────────────────────
        var body = request.body.data;
        if (!body) {
            response.setStatus(400);
            response.setBody({ success: false, error: 'Request body is required.' });
            return;
        }

        var sfObjectName   = body.sfObjectName;
        var snObjectName   = body.snObjectName;
        var selectedFields = body.selectedFields || [];
        var filterQuery    = body.filterQuery    || '';
        var showOnlyWithSF = body.showOnlyRecordsWithSalesforce === true || body.showOnlyRecordsWithSalesforce === '1';

        // ─── Pagination params ────────────────────────────────────────────────
        var pageSize = parseInt(body.pageSize) || 200;
        var page     = parseInt(body.page)     || 1;
        var offset   = (page - 1) * pageSize;

        if (!sfObjectName || !snObjectName) {
            response.setStatus(400);
            response.setBody({ success: false, error: 'Missing required fields: sfObjectName, snObjectName.' });
            return;
        }

        if (!selectedFields.length) {
            response.setStatus(400);
            response.setBody({ success: false, error: 'Missing required field: selectedFields.' });
            return;
        }

        // ─── Split selected fields into SF and SN columns ─────────────────────
        var sfColumns = [];
        var snColumns = [];
        for (var f = 0; f < selectedFields.length; f++) {
            var field = selectedFields[f];
            if (field.indexOf('SF.') === 0) sfColumns.push(field.replace('SF.', ''));
            else if (field.indexOf('SN.') === 0) snColumns.push(field.replace('SN.', ''));
        }

        // ─── Always include join keys ─────────────────────────────────────────
        if (sfColumns.indexOf('Id') === -1 && sfColumns.indexOf('id') === -1) sfColumns.push('Id');
        if (snColumns.indexOf('sys_id') === -1) snColumns.push('sys_id');

        // ─── Security: block dangerous filter query patterns ──────────────────
        if (filterQuery) {
            var dangerous = ['javascript:', 'gs.', 'GlideRecord', 'GlideAggregate', 'eval(', '<script', '--'];
            for (var d = 0; d < dangerous.length; d++) {
                if (filterQuery.toLowerCase().indexOf(dangerous[d].toLowerCase()) !== -1) {
                    response.setStatus(400);
                    response.setBody({ success: false, error: 'Filter query contains disallowed patterns.' });
                    return;
                }
            }
        }

        // ─── Get total count for pagination metadata ──────────────────────────
        // ─── Get total count efficiently ──────────────────────────────────────────
        var countGA = new GlideAggregate(snObjectName);
        if (filterQuery) countGA.addEncodedQuery(filterQuery);
        countGA.addAggregate('COUNT');
        countGA.query();
        var totalCount = 0;
        if (countGA.next()) {
            totalCount = parseInt(countGA.getAggregate('COUNT')) || 0;
        }

        // ─── Query ServiceNow records with pagination ──────────────────────────
        var serviceNowGR = new GlideRecord(snObjectName);
        if (filterQuery) serviceNowGR.addEncodedQuery(filterQuery);
        serviceNowGR.chooseWindow(offset, offset + pageSize);
        serviceNowGR.query();

        var serviceNowData = [];
        while (serviceNowGR.next()) {
            var snRecord = {};
            for (var s = 0; s < snColumns.length; s++) {
                snRecord[snColumns[s]] = serviceNowGR.getDisplayValue(snColumns[s]);
            }
            serviceNowData.push(snRecord);
        }

        // ─── Get linked Salesforce records via junction object ────────────────
        var snIds = [];
        for (var n = 0; n < serviceNowData.length; n++) {
            snIds.push(serviceNowData[n].sys_id);
        }

        var sfService = new x_1955226_connecto.SalesforceRecordsService();
        var snIdToSfRecord = sfService.getLinkedRecords(sfObjectName, sfColumns, snIds);

        // ─── Build combined report rows ───────────────────────────────────────
        var reportData = [];
        for (var i = 0; i < serviceNowData.length; i++) {
            var snRecord = serviceNowData[i];

            if (showOnlyWithSF && !snIdToSfRecord.hasOwnProperty(snRecord.sys_id)) continue;

            var sfRecord = snIdToSfRecord[snRecord.sys_id] || {};
            var flatSF   = flattenSFRecord(sfRecord, '');

            var row = {};
            for (var sfKey in flatSF)   row['SF.' + sfKey] = flatSF[sfKey];
            for (var snKey in snRecord)  row['SN.' + snKey] = snRecord[snKey];

            reportData.push(row);
        }

        // ─── Pagination metadata ──────────────────────────────────────────────
        var totalPages = Math.ceil(totalCount / pageSize);
        var hasMore    = page < totalPages;

        response.setStatus(200);
        response.setBody({
            success:    true,
            data:       reportData,
            pagination: {
                page:       page,
                pageSize:   pageSize,
                total:      totalCount,
                totalPages: totalPages,
                hasMore:    hasMore,
            }
        });

    } catch (err) {
        response.setStatus(500);
        response.setBody({ success: false, message: err + '' });
    }
})(request, response);