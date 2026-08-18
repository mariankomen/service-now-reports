(function process(request, response) {
    try {
        var body = request.body.data;

        if (!body) {
            response.setStatus(400);
            response.setBody({ success: false, error: 'Request body is required.' });
            return;
        }

        // ─── Validate required fields ─────────────────────────────────────────
        var missed = [];
        if (!body.name)                missed.push('name');
        if (!body.salesforceObjectName) missed.push('salesforceObjectName');
        if (!body.serviceNowTableName)  missed.push('serviceNowTableName');

        if (missed.length > 0) {
            response.setStatus(400);
            response.setBody({ success: false, error: 'Missing required fields: ' + missed.join(', ') });
            return;
        }

        // ─── Create report record ─────────────────────────────────────────────
        var gr = new GlideRecordSecure('x_1955226_connecto_report');
        gr.initialize();
        gr.name           = body.name;
        gr.folderid       = body.folderid       || 'root';
        gr.description    = body.description    || '';
        gr.sf_object_name = body.salesforceObjectName;
        gr.sn_object_name = body.serviceNowTableName;
        gr.is_public      = body.isPublic === true || body.isPublic === 'true';
        gr.owner          = gs.getUserID();

        var sysId = gr.insert();

        response.setStatus(201);
        response.setBody({ success: true, sys_id: sysId });

    } catch (error) {
        response.setStatus(500);
        response.setBody({ success: false, message: error + '' });
    }
})(request, response);