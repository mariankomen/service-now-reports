(function process(request, response) {
    try {
        var body = request.body.data;

        if (!body || !body.id) {
            response.setStatus(400);
            response.setBody({ success: false, error: 'Missing required field: id.' });
            return;
        }

        // ─── Check access — editor role required to update ────────────────────
        var access = new x_1955226_connecto.AccessService();
        if (!access.canAccess(body.id, 'report', 'editor')) {
            response.setStatus(403);
            response.setBody({ success: false, error: 'Access denied. Editor role required.' });
            return;
        }

        // ─── Find report record ───────────────────────────────────────────────
        var gr = new GlideRecordSecure('x_1955226_connecto_report');
        gr.addQuery('sys_id', body.id);
        gr.setLimit(1);
        gr.query();

        if (!gr.next()) {
            response.setStatus(404);
            response.setBody({ success: false, error: 'Report with id ' + body.id + ' not found.' });
            return;
        }

        // ─── Update only provided fields ──────────────────────────────────────
        if (body.name)            gr.name             = body.name;
        if (body.description)     gr.description      = body.description;
        if (body.columns)         gr.columns          = body.columns;
        if (body.chartType)       gr.chart_type       = body.chartType;
        if (body.groupBy)         gr.group_by         = body.groupBy;
        if (body.filterQuery)     gr.filter_query     = body.filterQuery;
        if (body.chartGroupBy)    gr.chart_group_by   = body.chartGroupBy;
        if (body.folderid)        gr.folderid         = body.folderid;
        if (body.filterConditions) gr.filter_conditions = body.filterConditions;
        if (body.filterLogic !== undefined) gr.filter_logic = body.filterLogic;

        // ─── Handle boolean fields explicitly ─────────────────────────────────
        if (body.showChart != null) gr.show_chart = body.showChart ? '1' : '0';
        if (body.showOnlyRecordsWithSalesforce != null) {
            gr.show_only_with_sf_records = body.showOnlyRecordsWithSalesforce ? '1' : '0';
        }

        gr.update();

        response.setStatus(200);
        response.setBody({ success: true, sys_id: gr.getUniqueValue(), updated: true });

    } catch (error) {
        response.setStatus(500);
        response.setBody({ success: false, message: error + '' });
    }
})(request, response);