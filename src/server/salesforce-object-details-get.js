(function process(request, response) {
    try {
        // ─── Get current user's access token ─────────────────────────────────
        var authService  = new x_1955226_connecto.SalesforceAuthService();
        var tokenResult  = authService.getAccessToken();

        if (!tokenResult.success || !tokenResult.token) {
            response.setStatus(401);
            response.setBody({ success: false, error: tokenResult.error || 'Not authenticated with Salesforce.' });
            return;
        }

        // ─── Call Salesforce sobjects list API ────────────────────────────────
        var endpoint = tokenResult.baseUrl + '/services/data/v60.0/sobjects';

        var req = new sn_ws.RESTMessageV2();
        req.setEndpoint(endpoint);
        req.setHttpMethod('GET');
        req.setRequestHeader('Authorization', 'Bearer ' + tokenResult.token);
        req.setRequestHeader('Accept', 'application/json');

        var res    = req.execute();
        var status = res.getStatusCode();
        var body   = res.getBody();

        var parsed;
        try { parsed = JSON.parse(body); } catch(e) { parsed = null; }

        if (status < 200 || status >= 300) {
            gs.error('Salesforce sobjects list failed. Status=' + status + ' Body=' + body);
            response.setStatus(status);
            response.setBody({ success: false, error: 'Salesforce sobjects request failed', salesforce: parsed || body });
            return;
        }

        // ─── Filter to queryable, layoutable, non-custom-setting objects ──────
        var allSobjects = parsed && parsed.sobjects ? parsed.sobjects : [];
        var filteredSobjects = allSobjects
            .filter(function(obj) {
                return obj.customSetting === false &&
                       obj.queryable    === true   &&
                       obj.layoutable   === true;
            })
            .map(function(el) {
                return {
                    label:   el.label,
                    apiname: el.name
                };
            });

        response.setStatus(200);
        response.setBody({
            success:  true,
            sobjects: filteredSobjects,
            total:    allSobjects.length,
            filtered: filteredSobjects.length
        });

    } catch (e) {
        response.setStatus(500);
        response.setBody({ success: false, message: e + '' });
    }
})(request, response);