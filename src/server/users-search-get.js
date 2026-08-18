(function process(request, response) {
    try {
        var query  = request.queryParams.q || '';
        var userId = gs.getUserID();

        // ─── Search users by name or email, exclude current user ──────────────
        var gr = new GlideRecordSecure('sys_user');
        gr.addActiveQuery();
        gr.addQuery('sys_id', '!=', userId);

        var qc = gr.addQuery('name', 'CONTAINS', query);
        qc.addOrCondition('email', 'CONTAINS', query);

        gr.setLimit(10);
        gr.orderBy('name');
        gr.query();

        var users = [];
        while (gr.next()) {
            users.push({
                sys_id: gr.getUniqueValue(),
                name:   gr.getValue('name'),
                email:  gr.getValue('email'),
                avatar: gr.getValue('photo'),
            });
        }

        response.setStatus(200);
        response.setBody({ success: true, users: users });

    } catch (err) {
        response.setStatus(500);
        response.setBody({ success: false, message: err + '' });
    }
})(request, response);