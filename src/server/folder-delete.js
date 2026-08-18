(function process(request, response) {
    try {
        var folderId = request.queryParams.folderId;

        if (!folderId) {
            response.setStatus(400);
            response.setBody({ success: false, error: 'Missing required param: folderId.' });
            return;
        }

        // ─── Check access — manager role required to delete ───────────────────
        var access = new x_1955226_connecto.AccessService();
        if (!access.canAccess(folderId, 'folder', 'manager')) {
            response.setStatus(403);
            response.setBody({ success: false, error: 'Access denied. Manager role required.' });
            return;
        }

        // ─── Find folder record ───────────────────────────────────────────────
        var gr = new GlideRecordSecure('x_1955226_connecto_folder');
        gr.addQuery('sys_id', folderId);
        gr.setLimit(1);
        gr.query();

        if (!gr.next()) {
            response.setStatus(404);
            response.setBody({ success: false, error: 'Folder not found.' });
            return;
        }

        // ─── Move reports inside this folder to root before deleting ──────────
        var reportsGR = new GlideRecordSecure('x_1955226_connecto_report');
        reportsGR.addQuery('folderid', folderId);
        reportsGR.query();
        while (reportsGR.next()) {
            reportsGR.folderid = 'root';
            reportsGR.update();
        }

        // ─── Delete all share records for this folder ─────────────────────────
        var shareGR = new GlideRecordSecure('x_1955226_connecto_share');
        shareGR.addQuery('item_id', folderId);
        shareGR.addQuery('item_type', 'folder');
        shareGR.deleteMultiple();

        // ─── Delete the folder ────────────────────────────────────────────────
        gr.deleteRecord();

        response.setStatus(200);
        response.setBody({ success: true });

    } catch (err) {
        response.setStatus(500);
        response.setBody({ success: false, message: err + '' });
    }
})(request, response);