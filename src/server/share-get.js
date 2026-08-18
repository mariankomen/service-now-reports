(function process(request, response) {
    try {
        var itemId   = request.queryParams.itemId;
        var itemType = request.queryParams.itemType;

        if (!itemId || !itemType) {
            response.setStatus(400);
            response.setBody({ success: false, error: 'Missing required params: itemId, itemType.' });
            return;
        }

        // ─── Check access — viewer role required to see shares ────────────────
        var access = new x_1955226_connecto.AccessService();
        var role = access.getRole(itemId, itemType);
        gs.info('share-get: itemId=' + itemId + ' itemType=' + itemType + ' role=' + role);
        if (!access.canAccess(itemId, itemType, 'viewer')) {
            response.setStatus(403);
            response.setBody({ success: false, error: 'Access denied.' });
            return;
        }

        // ─── Fetch share records ──────────────────────────────────────────────
        var gr = new GlideRecordSecure('x_1955226_connecto_share');
        gr.addQuery('item_id', itemId);
        gr.addQuery('item_type', itemType);
        gr.query();

        var shares = [];
        while (gr.next()) {
            // ─── Safely get user email via reference ──────────────────────────
            var userEmail = '';
            try {
                var userRef = gr.getElement('user_id').getRefRecord();
                if (userRef && !userRef.isNewRecord()) {
                    userEmail = userRef.getValue('email') || '';
                }
            } catch(e) { userEmail = ''; }

            shares.push({
                sys_id:     gr.getValue('sys_id'),
                item_id:    gr.getValue('item_id'),
                item_type:  gr.getValue('item_type'),
                role:       gr.getValue('role'),
                user_id:    gr.getValue('user_id'),
                user_name:  gr.getDisplayValue('user_id'),
                user_email: userEmail,
            });
        }

        response.setStatus(200);
        response.setBody({ success: true, shares: shares });

    } catch (err) {
        response.setStatus(500);
        response.setBody({ success: false, message: err + '' });
    }
})(request, response);