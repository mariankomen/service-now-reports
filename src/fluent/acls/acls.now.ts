import '@servicenow/sdk/global'
import { Acl } from '@servicenow/sdk/core'
import { peeklogicReportsUserRole } from '../security/roles.now'

const aclRoles = [peeklogicReportsUserRole]

// ─── Connection ───────────────────────────────────────────────────────────────
Acl({ $id: Now.ID['connecto_connection_create_acl'], type: 'record', table: 'x_1955226_connecto_connection', operation: 'create', roles: aclRoles })
Acl({ $id: Now.ID['connecto_connection_read_acl'],   type: 'record', table: 'x_1955226_connecto_connection', operation: 'read',   roles: aclRoles })
Acl({ $id: Now.ID['connecto_connection_write_acl'],  type: 'record', table: 'x_1955226_connecto_connection', operation: 'write',  roles: aclRoles })
Acl({ $id: Now.ID['connecto_connection_delete_acl'], type: 'record', table: 'x_1955226_connecto_connection', operation: 'delete', roles: aclRoles })

// ─── Folder ───────────────────────────────────────────────────────────────────
Acl({ $id: Now.ID['connecto_folder_create_acl'], type: 'record', table: 'x_1955226_connecto_folder', operation: 'create', roles: aclRoles })
Acl({ $id: Now.ID['connecto_folder_read_acl'],   type: 'record', table: 'x_1955226_connecto_folder', operation: 'read',   roles: aclRoles })
Acl({ $id: Now.ID['connecto_folder_write_acl'],  type: 'record', table: 'x_1955226_connecto_folder', operation: 'write',  roles: aclRoles })
Acl({ $id: Now.ID['connecto_folder_delete_acl'], type: 'record', table: 'x_1955226_connecto_folder', operation: 'delete', roles: aclRoles })

// ─── Report ───────────────────────────────────────────────────────────────────
Acl({ $id: Now.ID['connecto_report_create_acl'], type: 'record', table: 'x_1955226_connecto_report', operation: 'create', roles: aclRoles })
Acl({ $id: Now.ID['connecto_report_read_acl'],   type: 'record', table: 'x_1955226_connecto_report', operation: 'read',   roles: aclRoles })
Acl({ $id: Now.ID['connecto_report_write_acl'],  type: 'record', table: 'x_1955226_connecto_report', operation: 'write',  roles: aclRoles })
Acl({ $id: Now.ID['connecto_report_delete_acl'], type: 'record', table: 'x_1955226_connecto_report', operation: 'delete', roles: aclRoles })

// ─── Share ────────────────────────────────────────────────────────────────────
Acl({ $id: Now.ID['connecto_share_create_acl'], type: 'record', table: 'x_1955226_connecto_share', operation: 'create', roles: aclRoles })
Acl({ $id: Now.ID['connecto_share_read_acl'],   type: 'record', table: 'x_1955226_connecto_share', operation: 'read',   roles: aclRoles })
Acl({ $id: Now.ID['connecto_share_write_acl'],  type: 'record', table: 'x_1955226_connecto_share', operation: 'write',  roles: aclRoles })
Acl({ $id: Now.ID['connecto_share_delete_acl'], type: 'record', table: 'x_1955226_connecto_share', operation: 'delete', roles: aclRoles })

// ─── User Preferences ─────────────────────────────────────────────────────────
Acl({ $id: Now.ID['connecto_user_prefs_create_acl'], type: 'record', table: 'x_1955226_connecto_user_prefs', operation: 'create', roles: aclRoles })
Acl({ $id: Now.ID['connecto_user_prefs_read_acl'],   type: 'record', table: 'x_1955226_connecto_user_prefs', operation: 'read',   roles: aclRoles })
Acl({ $id: Now.ID['connecto_user_prefs_write_acl'],  type: 'record', table: 'x_1955226_connecto_user_prefs', operation: 'write',  roles: aclRoles })
Acl({ $id: Now.ID['connecto_user_prefs_delete_acl'], type: 'record', table: 'x_1955226_connecto_user_prefs', operation: 'delete', roles: aclRoles })