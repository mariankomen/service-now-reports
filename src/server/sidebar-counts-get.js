(function process(request, response) {
    try {
        var userId = gs.getUserID();
        var access = new x_1955226_connecto.AccessService();

        // ─── Queries mirror reports-get.js / folder-get.js so the badges ──────
        // always agree with what the corresponding list actually shows
        function reportGr() {
            var gr = new GlideRecordSecure('x_1955226_connecto_report');
            gr.addActiveQuery();
            return gr;
        }

        function folderGr() {
            var gr = new GlideRecordSecure('x_1955226_connecto_folder');
            gr.addActiveQuery();
            return gr;
        }

        // Access is per record, so counting means walking the result set
        function countAccessible(gr, itemType) {
            var total = 0;
            gr.query();
            while (gr.next()) {
                if (access.getRole(gr.getValue('sys_id'), itemType) !== null) total++;
            }
            return total;
        }

        function sharedItemIds(itemType) {
            var ids = [];
            var shareGR = new GlideRecordSecure('x_1955226_connecto_share');
            shareGR.addQuery('item_type', itemType);
            shareGR.addQuery('user_id', userId);
            shareGR.query();
            while (shareGR.next()) {
                ids.push(shareGR.getValue('item_id'));
            }
            return ids;
        }

        var counts = {};

        // ─── Reports ─────────────────────────────────────────────────────────
        counts.rootreports = countAccessible(reportGr(), 'report');

        var myReports = reportGr();
        myReports.addQuery('owner', userId);
        counts.createdbymereports = countAccessible(myReports, 'report');

        var privateReports = reportGr();
        privateReports.addQuery('owner', userId);
        privateReports.addQuery('is_public', false);
        counts.privatereports = countAccessible(privateReports, 'report');

        var publicReports = reportGr();
        publicReports.addQuery('is_public', true);
        counts.publicreports = countAccessible(publicReports, 'report');

        // ─── Shared reports: direct shares plus everything inside shared folders
        var sharedFolderIds = sharedItemIds('folder');
        var sharedReportIds = sharedItemIds('report');

        for (var f = 0; f < sharedFolderIds.length; f++) {
            var folderReports = reportGr();
            folderReports.addQuery('folderid', sharedFolderIds[f]);
            folderReports.query();
            while (folderReports.next()) {
                var reportId = folderReports.getValue('sys_id');
                if (sharedReportIds.indexOf(reportId) === -1) {
                    sharedReportIds.push(reportId);
                }
            }
        }

        if (sharedReportIds.length) {
            var sharedReports = reportGr();
            sharedReports.addQuery('sys_id', 'IN', sharedReportIds.join(','));
            counts.sharedwithmereports = countAccessible(sharedReports, 'report');
        } else {
            counts.sharedwithmereports = 0;
        }

        // ─── Favorites ───────────────────────────────────────────────────────
        var favoriteIds = [];
        var prefsGR = new GlideRecordSecure('x_1955226_connecto_user_prefs');
        prefsGR.addQuery('user_id', userId);
        prefsGR.setLimit(1);
        prefsGR.query();
        if (prefsGR.next()) {
            try {
                favoriteIds = JSON.parse(prefsGR.getValue('favorites') || '[]');
            } catch (e) {
                favoriteIds = [];
            }
        }

        if (favoriteIds.length) {
            var favoriteReports = reportGr();
            favoriteReports.addQuery('sys_id', 'IN', favoriteIds.join(','));
            counts.favorites = countAccessible(favoriteReports, 'report');
        } else {
            counts.favorites = 0;
        }

        // ─── Folders ─────────────────────────────────────────────────────────
        counts.rootfolders = countAccessible(folderGr(), 'folder');

        var myFolders = folderGr();
        myFolders.addQuery('owner', userId);
        counts.createdbymefolders = countAccessible(myFolders, 'folder');

        var publicFolders = folderGr();
        publicFolders.addQuery('is_public', true);
        counts.publicfolders = countAccessible(publicFolders, 'folder');

        if (sharedFolderIds.length) {
            var sharedFolders = folderGr();
            sharedFolders.addQuery('sys_id', 'IN', sharedFolderIds.join(','));
            counts.sharedwithmefolders = countAccessible(sharedFolders, 'folder');
        } else {
            counts.sharedwithmefolders = 0;
        }

        response.setStatus(200);
        response.setBody({ success: true, counts: counts });

    } catch (err) {
        response.setStatus(500);
        response.setBody({ success: false, message: err + '' });
    }
})(request, response);
