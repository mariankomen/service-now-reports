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

        // ─── Guard against unknown tables before touching GlideRecord ─────────
        var tableGr = new GlideRecord('sys_db_object');
        tableGr.addQuery('name', table);
        tableGr.setLimit(1);
        tableGr.query();
        if (!tableGr.next()) {
            response.setStatus(404);
            response.setBody({ success: false, error: 'Table ' + table + ' not found.' });
            return;
        }

        // ─── Find the display element, walking up the table hierarchy ────────
        function getDisplayElement(startTable) {
            var current = startTable;
            for (var depth = 0; current && depth < 10; depth++) {
                var dict = new GlideRecord('sys_dictionary');
                dict.addQuery('name', current);
                dict.addQuery('display', true);
                dict.setLimit(1);
                dict.query();
                if (dict.next()) return dict.getValue('element');

                var obj = new GlideRecord('sys_db_object');
                obj.addQuery('name', current);
                obj.setLimit(1);
                obj.query();
                if (!obj.next()) return '';

                var superId = obj.getValue('super_class');
                if (!superId) return '';

                var parent = new GlideRecord('sys_db_object');
                if (!parent.get(superId)) return '';
                current = parent.getValue('name');
            }
            return '';
        }

        var gr = new GlideRecordSecure(table);

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

        // ─── Search by display value ─────────────────────────────────────────
        var displayElement = getDisplayElement(table);
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

        gr.setLimit(20);
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
