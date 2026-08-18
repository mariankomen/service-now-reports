(function process(request, response) {
    try {
        var userId = gs.getUserID();

        // ─── Find current user's preferences record ───────────────────────────
        var gr = new GlideRecordSecure('x_1955226_connecto_user_prefs');
        gr.addQuery('user_id', userId);
        gr.setLimit(1);
        gr.query();

        // ─── Parse favorites array, default to empty if missing/invalid ───────
        var favorites = [];
        if (gr.next()) {
            try {
                favorites = JSON.parse(gr.getValue('favorites') || '[]');
            } catch(e) {
                favorites = [];
            }
        }

        response.setStatus(200);
        response.setBody({ success: true, favorites: favorites });

    } catch (err) {
        response.setStatus(500);
        response.setBody({ success: false, message: err + '' });
    }
})(request, response);