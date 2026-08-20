import '@servicenow/sdk/global'
import { ApplicationMenu, Record } from '@servicenow/sdk/core'
import { peeklogicReportsUserRole } from '../security/roles.now'

export const peeklogicAppMenu = ApplicationMenu({
    $id: Now.ID['x_1955226_connecto_app_menu'],
    title: 'Peeklogic Reports',
    hint: 'Salesforce & ServiceNow Reports',
    description: 'Configure & View Reports',
    active: true,
    order: 100,
    roles: [peeklogicReportsUserRole],

})

Record({
    $id: Now.ID['x_1955226_connecto_app_connect'],
    table: 'sys_app_module',
    data: {
        title: 'Connection',
        application: peeklogicAppMenu,
        link_type: 'DIRECT',
        active: true,
        order: 100,
        query: 'x_1955226_connecto_report_builder.do?tab=connection',
        window_name: '_blank'
    },
    roles: [peeklogicReportsUserRole]

})
Record({
    $id: Now.ID['x_1955226_connecto_app_module'],
    table: 'sys_app_module',
    data: {
        title: 'Reports',
        application: peeklogicAppMenu,
        link_type: 'DIRECT',
        active: true,
        order: 100,
        query: 'x_1955226_connecto_report_builder.do?tab=main',
        window_name: '_blank'
    },
    roles: [peeklogicReportsUserRole]

})

Record({
    $id: Now.ID['x_1955226_connecto_support_module'],
    table: 'sys_app_module',
    data: {
        title: 'Contact Support',
        application: peeklogicAppMenu,
        link_type: 'DIRECT',
        active: true,
        order: 110,
        query: 'x_1955226_connecto_report_builder.do?tab=support',
        window_name: '_blank'
    },
    roles: [peeklogicReportsUserRole]

})

Record({
    $id: Now.ID['x_1955226_connecto_privacy_module'],
    table: 'sys_app_module',
    data: {
        title: 'App Privacy Policy',
        application: peeklogicAppMenu,
        link_type: 'DIRECT',
        active: true,
        order: 120,
        query: 'x_1955226_connecto_report_builder.do?tab=privacy',
        window_name: '_blank'
    },
    roles: [peeklogicReportsUserRole]

})