(function process(request, response) {
    try {
        // ─── Validate request params ──────────────────────────────────────────
        var objectName = request.queryParams.object;
        if (!objectName) {
            response.setStatus(400);
            response.setBody({ success: false, error: 'Missing required param: object' });
            return;
        }

        // ─── Get current user's access token ─────────────────────────────────
        var authService = new x_1955226_connecto.SalesforceAuthService();
        var tokenResult = authService.getAccessToken();

        if (!tokenResult.success || !tokenResult.token) {
            response.setStatus(401);
            response.setBody({ success: false, error: tokenResult.error || 'Not authenticated with Salesforce.' });
            return;
        }

        // ─── Call Salesforce describe API ─────────────────────────────────────
        var endpoint = tokenResult.baseUrl + '/services/data/v60.0/sobjects/' + objectName + '/describe';

        var req = new sn_ws.RESTMessageV2();
        req.setEndpoint(endpoint);
        req.setHttpMethod('GET');
        req.setRequestHeader('Authorization', 'Bearer ' + tokenResult.token);
        req.setRequestHeader('Accept', 'application/json');

        var res = req.execute();
        var status = res.getStatusCode();
        var body = res.getBody();

        var parsed;
        try { parsed = JSON.parse(body); } catch(e) { parsed = null; }

        if (status < 200 || status >= 300) {
            gs.error('Salesforce fields request failed. Status=' + status + ' Body=' + body);
            response.setStatus(status);
            response.setBody({ success: false, error: 'Salesforce sobjects request failed', salesforce: parsed || body });
            return;
        }

        // ─── Map fields ───────────────────────────────────────────────────────
        var allFields = parsed && parsed.fields ? parsed.fields : [];
        var filteredFields = allFields.map(function(el) {
            return {
                label:            el.label,
                apiname:          el.name,
                type:             el.type,
                referenceTo:      el.referenceTo || [],
                relationshipName: el.relationshipName || null
            };
        });

        response.setStatus(200);
        response.setBody({
            success: true,
            fields:   filteredFields,
            total:    allFields.length,
            filtered: filteredFields.length
        });

    } catch (e) {
        response.setStatus(500);
        response.setBody({ success: false, message: e + '' });
    }
})(request, response);