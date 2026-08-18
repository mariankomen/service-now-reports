(function process(request, response) {
    try {
        var body = request.body.data;

        if (!body || !body.reportId) {
            response.setStatus(400);
            response.setBody({ success: false, error: 'Missing required field: reportId.' });
            return;
        }

        var userId   = gs.getUserID();
        var reportId = body.reportId;

        // ─── Find existing prefs record for current user ──────────────────────
        var gr = new GlideRecordSecure('x_1955226_connecto_user_prefs');
        gr.addQuery('user_id', userId);
        gr.setLimit(1);
        gr.query();

        if (gr.next()) {
            // ─── Add to existing favorites if not already present ─────────────
            var favorites = [];
            try { favorites = JSON.parse(gr.getValue('favorites') || '[]'); } catch(e) { favorites = []; }

            if (favorites.indexOf(reportId) === -1) {
                favorites.push(reportId);
                gr.favorites = JSON.stringify(favorites);
                gr.update();
            }
        } else {
            // ─── Create new prefs record with this report as first favorite ───
            gr.initialize();
            gr.user_id   = userId;
            gr.favorites = JSON.stringify([reportId]);
            gr.insert();
        }

        response.setStatus(200);
        response.setBody({ success: true });

    } catch (err) {
        response.setStatus(500);
        response.setBody({ success: false, message: err + '' });
    }
})(request, response);