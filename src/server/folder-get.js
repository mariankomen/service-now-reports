(function process(request, response) {
    try {
        var folderType = ('' + (request.queryParams.type || '')).toLowerCase().replace(/\s/g, '');
        var folderId   = '' + (request.queryParams.folderId || '');
        var userId     = gs.getUserID();

        // ─── Build query based on type or folderId ────────────────────────────
        var gr = new GlideRecordSecure('x_1955226_connecto_folder');
        gr.addActiveQuery();

        if (folderId) {
            // Load contents of a specific folder
            gr.addQuery('parent_folder_id', folderId);

        } else if (folderType === 'createdbymefolders') {
            gr.addQuery('owner', userId);

        } else if (folderType === 'sharedwithmefolders') {
            // ─── Get folder IDs shared directly with current user ─────────────
            var sharedIds = [];
            var shareGR = new GlideRecordSecure('x_1955226_connecto_share');
            shareGR.addQuery('item_type', 'folder');
            shareGR.addQuery('user_id', userId);
            shareGR.query();
            while (shareGR.next()) {
                sharedIds.push(shareGR.getValue('item_id'));
            }

            if (sharedIds.length === 0) {
                response.setStatus(200);
                response.setBody({ success: true, folders: [] });
                return;
            }

            gr.addQuery('sys_id', 'IN', sharedIds.join(','));

        } else if (folderType === 'publicfolders') {
            gr.addQuery('is_public', true);
        }

        gr.query();

        // ─── Build folders array ──────────────────────────────────────────────
        var folders = [];
        while (gr.next()) {
            folders.push({
                sys_id:           gr.getValue('sys_id'),
                name:             gr.getValue('name'),
                parent_folder_id: gr.getValue('parent_folder_id'),
                uniqueid:         gr.getValue('uniqueid'),
                owner:            gr.getValue('owner'),
                is_public:        gr.getValue('is_public') == '1',
                createdDate:      gr.getValue('sys_created_on'),
                description:      gr.getValue('description'),
            });
        }

        // ─── Filter by access and add userRole in one pass ────────────────────
        var access = new x_1955226_connecto.AccessService();
        var accessible = [];
        for (var i = 0; i < folders.length; i++) {
            var role = access.getRole(folders[i].sys_id, 'folder');
            if (role !== null) {
                folders[i].userRole = role;
                accessible.push(folders[i]);
            }
        }

        response.setStatus(200);
        response.setBody({ success: true, folders: accessible });

    } catch (err) {
        response.setStatus(500);
        response.setBody({ success: false, message: err + '' });
    }
})(request, response);