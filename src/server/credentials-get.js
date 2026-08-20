(function process(request, response) {
    // Password2 fields decrypt via the element; legacy plain-string columns don't,
    // so fall back to the raw value when decryption yields nothing
    function readSecret(gr, field) {
        var decrypted = '';
        try { decrypted = gr[field].getDecryptedValue(); } catch (e) {}
        return decrypted || gr.getValue(field) || '';
    }

    try {
        var userId = gs.getUserID();

        // ─── Find current user's connection record ────────────────────────────
        var gr = new GlideRecordSecure('x_1955226_connecto_connection');
        gr.addQuery('user_id', userId);
        gr.setLimit(1);
        gr.query();

        if (gr.next()) {
            response.setStatus(200);
            response.setBody({
                success: true,
                data: {
                    sys_id:      gr.getUniqueValue(),
                    clientId:    readSecret(gr, 'client_id'),
                    baseUrl:     gr.getValue('base_url'),
                    instanceUrl: gr.getValue('instance_url'),
                    loginUrl:    gr.getValue('login_url'),
                    connected:   !!readSecret(gr, 'access_token'),
                }
            });
        } else {
            // ─── No record found — user has not connected yet ─────────────────
            response.setStatus(200);
            response.setBody({ success: true, data: null, connected: false });
        }

    } catch (error) {
        response.setStatus(500);
        response.setBody({ success: false, message: error + '' });
    }
})(request, response);