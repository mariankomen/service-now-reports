(function process(request, response) {
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
                    clientId:    gr.getDecryptedValue('client_id'),
                    baseUrl:     gr.getValue('base_url'),
                    instanceUrl: gr.getValue('instance_url'),
                    loginUrl:    gr.getValue('login_url'),
                    connected:   !!gr.getValue('access_token'),
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