(function process(request, response) {
    try {
        var table  = request.queryParams.table;
        var term   = request.queryParams.term  || '';
        var sysId  = request.queryParams.sys_id || '';

        table = Array.isArray(table) ? table[0] : table;
        term  = Array.isArray(term)  ? term[0]  : term;
        sysId = Array.isArray(sysId) ? sysId[0] : sysId;

        if (!table) {
            response.setStatus(400);
            response.setBody({ success: false, error: 'Missing required param: table.' });
            return;
        }

        // ─── Guard against unknown tables before querying ─────────────────────
        var gr = new GlideRecordSecure(table);
        if (!gr.isValid()) {
            response.setStatus(404);
            response.setBody({ success: false, error: 'Table ' + table + ' not found.' });
            return;
        }

        // ─── Resolve a single record — used to label an already saved value ──
        if (sysId) {
            if (!gr.get(sysId)) {
                response.setStatus(200);
                response.setBody({ success: true, records: [] });
                return;
            }
            response.setStatus(200);
            response.setBody({
                success: true,
                records: [{ sys_id: gr.getUniqueValue(), label: gr.getDisplayValue() || gr.getUniqueValue() }]
            });
            return;
        }

        // ─── Search by display value (display field is resolved through the
        //     table hierarchy by the platform) ────────────────────────────────
        var displayElement = gr.getDisplayName();
        if (!displayElement) {
            try {
                if (gr.isValidField('name')) displayElement = 'name';
            } catch (fieldErr) {
                displayElement = '';
            }
        }

        if (term && displayElement) {
            gr.addQuery(displayElement, 'CONTAINS', term);
        }
        if (displayElement) gr.orderBy(displayElement);

        gr.setLimit(10);
        gr.query();

        var records = [];
        while (gr.next()) {
            records.push({
                sys_id: gr.getUniqueValue(),
                label:  gr.getDisplayValue() || gr.getUniqueValue()
            });
        }

        response.setStatus(200);
        response.setBody({ success: true, records: records });

    } catch (err) {
        response.setStatus(500);
        response.setBody({ success: false, message: err + '' });
    }
})(request, response);
