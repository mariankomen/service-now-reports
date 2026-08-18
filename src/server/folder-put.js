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
        if (!access.canAccess(body.id, 'folder', 'editor')) {
            response.setStatus(403);
            response.setBody({ success: false, error: 'Access denied. Editor role required.' });
            return;
        }

        // ─── Find folder record ───────────────────────────────────────────────
        var gr = new GlideRecordSecure('x_1955226_connecto_folder');
        gr.addQuery('sys_id', body.id);
        gr.setLimit(1);
        gr.query();

        if (!gr.next()) {
            response.setStatus(404);
            response.setBody({ success: false, error: 'Folder not found.' });
            return;
        }

        // ─── Update only provided fields ──────────────────────────────────────
        if (body.name)          gr.name        = body.name;
        if (body.description)   gr.description = body.description;
        if (body.is_public != null) gr.is_public = body.is_public === true || body.is_public === 'true';

        gr.update();

        response.setStatus(200);
        response.setBody({ success: true, sys_id: gr.getUniqueValue() });

    } catch (err) {
        response.setStatus(500);
        response.setBody({ success: false, message: err + '' });
    }
})(request, response);