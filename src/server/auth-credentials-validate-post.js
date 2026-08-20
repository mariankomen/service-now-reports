(function process(request, response) {
    try {
        var body = request.body.data;

        if (!body) {
            response.setStatus(400);
            response.setBody({ success: false, error: 'Request body is required.' });
            return;
        }

        var userId = gs.getUserID();

        // ─── OAuth code exchange ───────────────────────────────────────────────
        // Called after Salesforce redirects back with ?code=xxx
        if (body.code) {
            if (!body.clientId || !body.clientSecret || !body.redirectUri) {
                response.setStatus(400);
                response.setBody({ success: false, error: 'Missing required fields: clientId, clientSecret, redirectUri.' });
                return;
            }

            var loginUrl = body.loginUrl || 'https://login.salesforce.com';

            // ─── Exchange authorization code for tokens ────────────────────────
            var req = new sn_ws.RESTMessageV2();
            req.setEndpoint(loginUrl + '/services/oauth2/token');
            req.setHttpMethod('POST');
            req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            var tokenBody =
                'grant_type=authorization_code' +
                '&code='          + encodeURIComponent(body.code) +
                '&client_id='     + encodeURIComponent(body.clientId) +
                '&client_secret=' + encodeURIComponent(body.clientSecret) +
                '&redirect_uri='  + encodeURIComponent(body.redirectUri);

            // PKCE — required by Salesforce when the authorize request carried a code_challenge
            if (body.codeVerifier) {
                tokenBody += '&code_verifier=' + encodeURIComponent(body.codeVerifier);
            }

            req.setRequestBody(tokenBody);

            var res = req.execute();
            var resStatus = res.getStatusCode();
            var parsed = JSON.parse(res.getBody());

            if (resStatus < 200 || resStatus >= 300) {
                response.setStatus(400);
                response.setBody({ success: false, error: parsed.error_description || 'Token exchange failed.' });
                return;
            }

            // ─── Upsert connection record for current user ────────────────────
            var gr = new GlideRecordSecure('x_1955226_connecto_connection');
            gr.addQuery('user_id', userId);
            gr.setLimit(1);
            gr.query();

            var isNew = !gr.next();
            if (isNew) gr.initialize();

            gr.user_id       = userId;
            gr.client_id     = body.clientId;
            gr.client_secret = body.clientSecret;
            gr.login_url     = loginUrl;                   // ← save login URL for token refresh
            gr.base_url      = parsed.instance_url || '';
            gr.instance_url  = parsed.instance_url || '';
            gr.access_token  = parsed.access_token || '';
            gr.refresh_token = parsed.refresh_token || '';
            gr.issued_at     = parsed.issued_at || '';

            if (isNew) {
                gr.insert();
            } else {
                gr.update();
            }

            response.setStatus(200);
            response.setBody({ success: true, connected: true });
            return;
        }

        response.setStatus(400);
        response.setBody({ success: false, error: 'Missing required fields.' });

    } catch (error) {
        response.setStatus(500);
        response.setBody({ success: false, message: error + '' });
    }
})(request, response);