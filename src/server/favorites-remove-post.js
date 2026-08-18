(function process(request, response) {
    try {
        var body    = request.body.data;
        var reportId = body && body.reportId;

        if (!reportId) {
            response.setStatus(400);
            response.setBody({ success: false, error: 'Missing required field: reportId.' });
            return;
        }

        var userId = gs.getUserID();

        // ─── Find current user's preferences record ───────────────────────────
        var gr = new GlideRecordSecure('x_1955226_connecto_user_prefs');
        gr.addQuery('user_id', userId);
        gr.setLimit(1);
        gr.query();

        if (!gr.next()) {
            response.setStatus(404);
            response.setBody({ success: false, error: 'No preferences record found for current user.' });
            return;
        }

        // ─── Remove report from favorites array ───────────────────────────────
        var favorites = [];
        try { favorites = JSON.parse(gr.getValue('favorites') || '[]'); } catch(e) { favorites = []; }

        var index = favorites.indexOf(reportId);
        if (index === -1) {
            response.setStatus(404);
            response.setBody({ success: false, error: 'Report not found in favorites.' });
            return;
        }

        favorites.splice(index, 1);
        gr.favorites = JSON.stringify(favorites);
        gr.update();

        response.setStatus(200);
        response.setBody({ success: true });

    } catch (err) {
        response.setStatus(500);
        response.setBody({ success: false, message: err + '' });
    }
})(request, response);