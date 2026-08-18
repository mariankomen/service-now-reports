(function process(request, response) {
    try {
        var body = request.body.data;

        if (!body) {
            response.setStatus(400);
            response.setBody({ success: false, error: 'Request body is required.' });
            return;
        }

        var sysId = body.sysId;
        var role  = body.role;

        if (!sysId || !role) {
            response.setStatus(400);
            response.setBody({ success: false, error: 'Missing required fields: sysId, role.' });
            return;
        }

        // ─── Validate role value ──────────────────────────────────────────────
        var validRoles = ['viewer', 'editor', 'manager'];
        if (validRoles.indexOf(role) === -1) {
            response.setStatus(400);
            response.setBody({ success: false, error: 'Invalid role. Must be viewer, editor or manager.' });
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

        // ─── Check access — manager role required to update share ─────────────
        var itemId   = gr.getValue('item_id');
        var itemType = gr.getValue('item_type');
        var access   = new x_1955226_connecto.AccessService();

        if (!access.canAccess(itemId, itemType, 'manager')) {
            response.setStatus(403);
            response.setBody({ success: false, error: 'Access denied. Manager role required.' });
            return;
        }

        // ─── Update role ──────────────────────────────────────────────────────
        gr.role = role;
        gr.update();

        response.setStatus(200);
        response.setBody({ success: true, sys_id: sysId, role: role });

    } catch (err) {
        response.setStatus(500);
        response.setBody({ success: false, message: err + '' });
    }
})(request, response);