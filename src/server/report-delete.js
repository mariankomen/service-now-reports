(function process(request, response) {
    try {
        var reportId = request.queryParams.reportId;

        if (!reportId) {
            response.setStatus(400);
            response.setBody({ success: false, error: 'Missing required param: reportId.' });
            return;
        }

        // ─── Check access — manager role required to delete ───────────────────
        var access = new x_1955226_connecto.AccessService();
        if (!access.canAccess(reportId, 'report', 'manager')) {
            response.setStatus(403);
            response.setBody({ success: false, error: 'Access denied. Manager role required.' });
            return;
        }

        // ─── Find report record ───────────────────────────────────────────────
        var gr = new GlideRecordSecure('x_1955226_connecto_report');
        gr.addQuery('sys_id', reportId);
        gr.setLimit(1);
        gr.query();

        if (!gr.next()) {
            response.setStatus(404);
            response.setBody({ success: false, error: 'Report not found.' });
            return;
        }

        // ─── Delete all share records for this report ─────────────────────────
        var shareGR = new GlideRecordSecure('x_1955226_connecto_share');
        shareGR.addQuery('item_id', reportId);
        shareGR.addQuery('item_type', 'report');
        shareGR.deleteMultiple();

        // ─── Delete the report ────────────────────────────────────────────────
        gr.deleteRecord();

        response.setStatus(200);
        response.setBody({ success: true });

    } catch (err) {
        response.setStatus(500);
        response.setBody({ success: false, message: err + '' });
    }
})(request, response);