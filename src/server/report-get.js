(function process(request, response) {
    try {
        var reportId = request.queryParams.reportId;

        if (!reportId) {
            response.setStatus(400);
            response.setBody({ success: false, error: 'Missing required param: reportId.' });
            return;
        }

        // ─── Check access before fetching data ────────────────────────────────
        var access = new x_1955226_connecto.AccessService();
        if (!access.canAccess(reportId, 'report', 'viewer')) {
            response.setStatus(403);
            response.setBody({ success: false, error: 'Access denied.' });
            return;
        }

        // ─── Fetch report record ──────────────────────────────────────────────
        var gr = new GlideRecordSecure('x_1955226_connecto_report');
        gr.addQuery('sys_id', reportId);
        gr.setLimit(1);
        gr.query();

        if (!gr.next()) {
            response.setStatus(404);
            response.setBody({ success: false, error: 'Report not found.' });
            return;
        }

        var report = {
            sys_id:                       gr.getUniqueValue(),
            name:                         gr.getValue('name'),
            folderId:                     gr.getValue('folderid'),
            owner:                        gr.getValue('owner'),
            ownerName:                    gr.getDisplayValue('owner'),
            is_public:                    gr.getValue('is_public') == '1',
            createdDate:                  gr.getValue('sys_created_on'),
            description:                  gr.getValue('description'),
            salesforceObject:             gr.getValue('sf_object_name'),
            serviceNowObject:             gr.getValue('sn_object_name'),
            columns:                      gr.getValue('columns'),
            showChart:                    gr.getValue('show_chart') == '1',
            chartType:                    gr.getValue('chart_type'),
            groupBy:                      gr.getValue('group_by'),
            filterQuery:                  gr.getValue('filter_query'),
            filterConditions:             gr.getValue('filter_conditions'),
            filterLogic:                  gr.getValue('filter_logic'),
            chartGroupBy:                 gr.getValue('chart_group_by'),
            chartSeriesBy:                gr.getValue('chart_series_by'),
            chartTitle:                   gr.getValue('chart_title'),
            chartMetric:                  gr.getValue('chart_metric'),
            chartValueField:              gr.getValue('chart_value_field'),
            showOnlyRecordsWithSalesforce: gr.getValue('show_only_with_sf_records') == '1',
            userRole:                     access.getRole(reportId, 'report'),
        };

        response.setStatus(200);
        response.setBody({ success: true, report: report });

    } catch (err) {
        response.setStatus(500);
        response.setBody({ success: false, message: err + '' });
    }
})(request, response);