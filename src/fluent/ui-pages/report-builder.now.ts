import '@servicenow/sdk/global'
import { Acl, UiPage } from '@servicenow/sdk/core'
import { peeklogicReportsUserRole } from '../security/roles.now'
import incidentPage from '../../client/index.html'

const aclRoles = [peeklogicReportsUserRole]

// ─── UI Page ACLs ─────────────────────────────────────────────────────────────
Acl({
    $id: Now.ID['report_builder_ui_page_read_acl'],
    type: 'ui_page',
    name: 'x_1955226_connecto_report_builder',
    operation: 'read',
    roles: aclRoles,
})

Acl({
    $id: Now.ID['report_builder_ui_page_execute_acl'],
    type: 'ui_page',
    name: 'x_1955226_connecto_report_builder',
    operation: 'execute',
    roles: aclRoles,
})

Acl({
    $id: Now.ID['report_builder_endpoint_ui_page_read_acl'],
    type: 'ui_page',
    name: 'x_1955226_connecto_report_builder.do',
    operation: 'read',
    roles: aclRoles,
})

Acl({
    $id: Now.ID['report_builder_endpoint_ui_page_execute_acl'],
    type: 'ui_page',
    name: 'x_1955226_connecto_report_builder.do',
    operation: 'execute',
    roles: aclRoles,
})

// ─── UI Page ──────────────────────────────────────────────────────────────────
UiPage({
    $id: Now.ID['report-builder'],
    endpoint: 'x_1955226_connecto_report_builder.do',
    description: 'Peeklogic Report Builder',
    category: 'general',
    html: incidentPage,
    direct: true,
})