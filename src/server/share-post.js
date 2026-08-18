(function process(request, response) {
    try {
        var body = request.body.data;

        if (!body) {
            response.setStatus(400);
            response.setBody({ success: false, error: 'Request body is required.' });
            return;
        }

        var itemId   = body.itemId;
        var itemType = body.itemType;
        var userId   = body.userId;
        var role     = body.role;

        if (!itemId || !itemType || !userId || !role) {
            response.setStatus(400);
            response.setBody({ success: false, error: 'Missing required fields: itemId, itemType, userId, role.' });
            return;
        }

        // ─── Check access — manager role required to share ────────────────────
        var access = new x_1955226_connecto.AccessService();
        if (!access.canAccess(itemId, itemType, 'manager')) {
            response.setStatus(403);
            response.setBody({ success: false, error: 'Access denied. Manager role required.' });
            return;
        }

        // ─── Prevent duplicate share records for same user + item ─────────────
        var existing = new GlideRecordSecure('x_1955226_connecto_share');
        existing.addQuery('item_id', itemId);
        existing.addQuery('item_type', itemType);
        existing.addQuery('user_id', userId);
        existing.setLimit(1);
        existing.query();

        if (existing.next()) {
            response.setStatus(409);
            response.setBody({ success: false, error: 'User already has access to this item.' });
            return;
        }

        // ─── Create share record ──────────────────────────────────────────────
        var gr = new GlideRecordSecure('x_1955226_connecto_share');
        gr.initialize();
        gr.item_id   = itemId;
        gr.item_type = itemType;
        gr.user_id   = userId;
        gr.role      = role;
        var sysId = gr.insert();

        response.setStatus(201);
        response.setBody({ success: true, sys_id: sysId });

    } catch (err) {
        response.setStatus(500);
        response.setBody({ success: false, message: err + '' });
    }
})(request, response);