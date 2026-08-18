(function process(request, response) {
    try {
        var sysId = request.queryParams.sysId;

        if (!sysId) {
            response.setStatus(400);
            response.setBody({ success: false, error: 'Missing required param: sysId.' });
            return;
        }

        // ─── Find share record ────────────────────────────────────────────────
        var gr = new GlideRecordSecure('x_1955226_connecto_share');
        gr.addQuery('sys_id', sysId);
        gr.setLimit(1);
        gr.query();

        if (!gr.next()) {
            response.setStatus(404);
            response.setBody({ success: false, error: 'Share record not found.' });
            return;
        }

        // ─── Check access — must be manager or owner of the item ─────────────
        var itemId   = gr.getValue('item_id');
        var itemType = gr.getValue('item_type');
        var access   = new x_1955226_connecto.AccessService();

        if (!access.canAccess(itemId, itemType, 'manager')) {
            response.setStatus(403);
            response.setBody({ success: false, error: 'Access denied. Manager role required.' });
            return;
        }

        gr.deleteRecord();

        response.setStatus(200);
        response.setBody({ success: true });

    } catch (err) {
        response.setStatus(500);
        response.setBody({ success: false, message: err + '' });
    }
})(request, response);