var AccessService = Class.create();
AccessService.prototype = {
    initialize: function() {
        this.userId = gs.getUserID();
        gs.info('AccessService.initialize: userId=' + this.userId);
    },

    getRole: function(itemId, itemType) {
        var itemTypeStr = '' + itemType;
        var table = itemTypeStr === 'report'
            ? 'x_1955226_connecto_report'
            : 'x_1955226_connecto_folder';

        gs.info('AccessService.getRole: START itemId=' + itemId + ' itemType=' + itemType + ' userId=' + this.userId);

        // ─── Load item ────────────────────────────────────────────────────────
        var item = new GlideRecord(table);
        item.addQuery('sys_id', itemId);
        item.setLimit(1);
        item.query();

        if (!item.next()) {
            gs.info('AccessService.getRole: item NOT FOUND in table=' + table);
            return null;
        }

        gs.info('AccessService.getRole: item FOUND name=' + item.getValue('name'));
        gs.info('AccessService.getRole: owner=' + item.getValue('owner') + ' userId=' + this.userId + ' match=' + (item.getValue('owner') === this.userId));

        // ─── Owner check ──────────────────────────────────────────────────────
        if (item.getValue('owner') === this.userId) {
            gs.info('AccessService.getRole: returning owner');
            return 'owner';
        }

        // ─── Public check ─────────────────────────────────────────────────────
        gs.info('AccessService.getRole: is_public=' + item.getValue('is_public'));
        if (item.getValue('is_public') == '1') {
            gs.info('AccessService.getRole: returning viewer (public)');
            return 'viewer';
        }

        // ─── Direct share check ───────────────────────────────────────────────
        var directRole = this._getShareRole(itemId, itemType);
        gs.info('AccessService.getRole: directRole=' + directRole);
        if (directRole) return directRole;

        // ─── Parent folder check (reports only) ───────────────────────────────
        if (itemType === 'report') {
            var folderId = item.getValue('folderid');
            gs.info('AccessService.getRole: folderId=' + folderId);
            if (folderId && folderId.length === 32) {
                var folderRole = this._getFolderRole(folderId);
                gs.info('AccessService.getRole: folderRole=' + folderRole);
                return folderRole;
            }
        }

        gs.info('AccessService.getRole: returning null');
        return null;
    },

    _getShareRole: function(itemId, itemType) {
        gs.info('AccessService._getShareRole: itemId=' + itemId + ' itemType=' + itemType + ' userId=' + this.userId);
        var share = new GlideRecord('x_1955226_connecto_share');
        share.addQuery('item_id', itemId);
        share.addQuery('item_type', itemType);
        share.addQuery('user_id', this.userId);
        share.setLimit(1);
        share.query();
        var role = share.next() ? share.getValue('role') : null;
        gs.info('AccessService._getShareRole: role=' + role);
        return role;
    },

    _getFolderRole: function(folderId) {
        // ─── Check folder share record ────────────────────────────────────────
        var folderRole = this._getShareRole(folderId, 'folder');
        if (folderRole) return folderRole;

        // ─── Check folder ownership and public ────────────────────────────────
        var folder = new GlideRecord('x_1955226_connecto_folder');
        folder.addQuery('sys_id', folderId);
        folder.setLimit(1);
        folder.query();

        if (!folder.next()) {
            gs.info('AccessService._getFolderRole: folder NOT FOUND folderId=' + folderId);
            return null;
        }

        gs.info('AccessService._getFolderRole: folder owner=' + folder.getValue('owner') + ' userId=' + this.userId);
        if (folder.getValue('owner') === this.userId) return 'owner';
        if (folder.getValue('is_public') == '1') return 'viewer';

        return null;
    },

    canAccess: function(itemId, itemType, requiredRole) {
        var role = this.getRole(itemId, itemType);
        gs.info('AccessService.canAccess: role=' + role + ' requiredRole=' + requiredRole + ' result=' + (role && this._roleLevel(role) >= this._roleLevel(requiredRole)));
        if (!role) return false;
        return this._roleLevel(role) >= this._roleLevel(requiredRole);
    },

    // ─── Note: makes one getRole call per item — acceptable for typical list sizes
    filterAccessible: function(items, itemType) {
        var self = this;
        return items.filter(function(item) {
            return self.getRole(item.sys_id, itemType) !== null;
        });
    },

    _roleLevel: function(role) {
        var levels = { viewer: 1, editor: 2, manager: 3, owner: 4 };
        return levels[role] || 0;
    },

    type: 'AccessService'
};