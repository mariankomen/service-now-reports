(function process(request, response) {
    try {
        var folderType = ('' + (request.queryParams.type || '')).toLowerCase().replace(/\s/g, '');
        var folderId   = request.queryParams.folderId;
        var userId     = gs.getUserID();

        // ─── Build query based on type or folderId ────────────────────────────
        var gr = new GlideRecordSecure('x_1955226_connecto_report');
        gr.addActiveQuery();

        if (folderId) {
            // ─── Reports inside a specific folder ─────────────────────────────
            gr.addQuery('folderid', folderId);

        } else if (folderType === 'createdbymereports') {
            gr.addQuery('owner', userId);

        } else if (folderType === 'sharedwithmereports') {
            // ─── Direct report shares ─────────────────────────────────────────
            var sharedIds = [];

            var shareGR = new GlideRecordSecure('x_1955226_connecto_share');
            shareGR.addQuery('item_type', 'report');
            shareGR.addQuery('user_id', userId);
            shareGR.query();
            while (shareGR.next()) {
                sharedIds.push(shareGR.getValue('item_id'));
            }

            // ─── Folder shares — include all reports inside shared folders ────
            var folderShareGR = new GlideRecordSecure('x_1955226_connecto_share');
            folderShareGR.addQuery('item_type', 'folder');
            folderShareGR.addQuery('user_id', userId);
            folderShareGR.query();
            while (folderShareGR.next()) {
                var sharedFolderId = folderShareGR.getValue('item_id');
                var folderReportsGR = new GlideRecordSecure('x_1955226_connecto_report');
                folderReportsGR.addQuery('folderid', sharedFolderId);
                folderReportsGR.addActiveQuery();
                folderReportsGR.query();
                while (folderReportsGR.next()) {
                    var reportId = folderReportsGR.getValue('sys_id');
                    if (sharedIds.indexOf(reportId) === -1) {
                        sharedIds.push(reportId);
                    }
                }
            }

            if (sharedIds.length === 0) {
                response.setStatus(200);
                response.setBody({ success: true, reports: [] });
                return;
            }

            gr.addQuery('sys_id', 'IN', sharedIds.join(','));

        } else if (folderType === 'publicreports') {
            gr.addQuery('is_public', true);

        } else if (folderType === 'favorites') {
            // ─── Get current user's favorite report IDs ───────────────────────
            var prefsGR = new GlideRecordSecure('x_1955226_connecto_user_prefs');
            prefsGR.addQuery('user_id', userId);
            prefsGR.setLimit(1);
            prefsGR.query();

            if (!prefsGR.next()) {
                response.setStatus(200);
                response.setBody({ success: true, reports: [] });
                return;
            }

            var favoriteIds = [];
            try { favoriteIds = JSON.parse(prefsGR.getValue('favorites') || '[]'); } catch(e) { favoriteIds = []; }

            if (favoriteIds.length === 0) {
                response.setStatus(200);
                response.setBody({ success: true, reports: [] });
                return;
            }

            gr.addQuery('sys_id', 'IN', favoriteIds.join(','));
        }else if (folderType === 'privatereports') {
            // ─── Reports owned by current user that are not public ────────────────
            gr.addQuery('owner', userId);
            gr.addQuery('is_public', false);
        }

        gr.query();

        // ─── Build reports array ──────────────────────────────────────────────
        var reports = [];
        while (gr.next()) {
            reports.push({
                sys_id:           gr.getValue('sys_id'),
                name:             gr.getValue('name'),
                owner:            gr.getValue('owner'),
                folderid:         gr.getValue('folderid'),
                is_public:        gr.getValue('is_public') == '1',
                createdDate:      gr.getValue('sys_created_on'),
                description:      gr.getValue('description'),
                salesforceObject: gr.getValue('sf_object_name'),
                serviceNowObject: gr.getValue('sn_object_name'),
            });
        }

        // ─── Filter by access and assign userRole in one pass ─────────────────
        var access = new x_1955226_connecto.AccessService();
        var accessible = [];
        for (var i = 0; i < reports.length; i++) {
            var role = access.getRole(reports[i].sys_id, 'report');
            if (role !== null) {
                reports[i].userRole = role;
                accessible.push(reports[i]);
            }
        }

        response.setStatus(200);
        response.setBody({ success: true, reports: accessible });

    } catch (err) {
        response.setStatus(500);
        response.setBody({ success: false, message: err + '' });
    }
})(request, response);