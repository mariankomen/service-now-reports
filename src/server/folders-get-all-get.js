(function process(request, response) {
    try {
        // ─── Get all folders current user has access to ───────────────────────
        var gr = new GlideRecordSecure('x_1955226_connecto_folder');
        gr.query();

        var folders = [];
        while (gr.next()) {
            folders.push({
                sys_id:           gr.getValue('sys_id'),
                name:             gr.getValue('name'),
                parent_folder_id: gr.getValue('parent_folder_id'),
                uniqueid:         gr.getValue('uniqueid'),
                owner:            gr.getValue('owner'),
                is_public:        gr.getValue('is_public') == '1',
                description:      gr.getValue('description'),
                createdDate:      gr.getValue('sys_created_on'),
            });
        }

        // ─── Filter by access and assign userRole in one pass ─────────────────
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