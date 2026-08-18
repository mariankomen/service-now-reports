(function process(request, response) {
    try {
        var body = request.body.data;

        if (!body) {
            response.setStatus(400);
            response.setBody({ success: false, error: 'Request body is required.' });
            return;
        }

        var userId = gs.getUserID();

        // ─── Find existing connection record for current user ─────────────────
        var gr = new GlideRecordSecure('x_1955226_connecto_connection');
        gr.addQuery('user_id', userId);
        gr.setLimit(1);
        gr.query();

        if (gr.next()) {
            // ─── Update existing record ───────────────────────────────────────
            if (body.baseUrl)      gr.base_url      = body.baseUrl;
            if (body.clientId)     gr.client_id     = body.clientId;
            if (body.clientSecret) gr.client_secret = body.clientSecret;
            if (body.loginUrl)     gr.login_url     = body.loginUrl;
            if (body.accessToken)  gr.access_token  = body.accessToken;
            if (body.refreshToken) gr.refresh_token = body.refreshToken;
            if (body.instanceUrl)  gr.instance_url  = body.instanceUrl;
            if (body.issuedAt)     gr.issued_at     = body.issuedAt;

            gr.update();

            response.setStatus(200);
            response.setBody({ success: true, sys_id: gr.getUniqueValue(), updated: true });
        } else {
            // ─── Create new record ────────────────────────────────────────────
            gr.initialize();
            gr.user_id       = userId;
            gr.base_url      = body.baseUrl      || '';
            gr.client_id     = body.clientId     || '';
            gr.client_secret = body.clientSecret || '';
            gr.login_url     = body.loginUrl     || 'https://login.salesforce.com';
            gr.access_token  = body.accessToken  || '';
            gr.refresh_token = body.refreshToken || '';
            gr.instance_url  = body.instanceUrl  || '';
            gr.issued_at     = body.issuedAt     || '';

            var sysId = gr.insert();

            response.setStatus(201);
            response.setBody({ success: true, sys_id: sysId, created: true });
        }

    } catch (error) {
        response.setStatus(500);
        response.setBody({ success: false, message: error + '' });
    }
})(request, response);