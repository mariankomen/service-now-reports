import '@servicenow/sdk/global'
import { Table, StringColumn, Password2Column, ReferenceColumn } from '@servicenow/sdk/core'

export const x_1955226_connecto_connection = Table({
    name: 'x_1955226_connecto_connection',
    label: 'Connection',
    schema: {
        access_token: Password2Column({
            label: 'Access Token',
            maxLength: 1000,
        }),
        base_url: StringColumn({
            label: 'Base Url',
            maxLength: 240,
        }),
        client_id: Password2Column({
            label: 'Client Id',
            maxLength: 120,
        }),
        client_secret: Password2Column({
            label: 'Client Secret',
            maxLength: 120,
        }),
        instance_url: StringColumn({
            label: 'Instance URL',
            maxLength: 255,
        }),
        issued_at: StringColumn({
            label: 'Issued At',
            maxLength: 50,
        }),
        login_url: StringColumn({
            label: 'Login URL',
            maxLength: 255,
        }),
        refresh_token: Password2Column({
            label: 'Refresh Token',
            maxLength: 1000,
        }),
        user_id: ReferenceColumn({
            label: 'User Id',
            referenceTable: 'sys_user',
        }),
    },
    actions: ['create', 'read', 'update', 'delete'],
    allow_web_service_access: true,
    accessible_from: 'public',
    caller_access: 'tracking'
})