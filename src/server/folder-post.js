(function process(request, response) {
    try {
        var body = request.body.data;

        // ─── Validate required fields ─────────────────────────────────────────
        if (!body || !body.name) {
            response.setStatus(400);
            response.setBody({ success: false, error: 'Missing required field: name.' });
            return;
        }

        // ─── Create folder record ─────────────────────────────────────────────
        var gr = new GlideRecordSecure('x_1955226_connecto_folder');
        gr.initialize();
        gr.name             = body.name;
        gr.description      = body.description      || '';
        gr.owner            = gs.getUserID();
        gr.is_public        = body.is_public === true || body.is_public === 'true';
        gr.parent_folder_id = body.parent_folder_id || '';

        var sysId = gr.insert();

        response.setStatus(201);
        response.setBody({ success: true, sys_id: sysId });

    } catch (error) {
        response.setStatus(500);
        response.setBody({ success: false, message: error + '' });
    }
})(request, response);