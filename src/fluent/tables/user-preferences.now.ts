import '@servicenow/sdk/global'
import { Table, StringColumn, ReferenceColumn } from '@servicenow/sdk/core'

export const x_1955226_connecto_user_prefs = Table({
    name: 'x_1955226_connecto_user_prefs',
    label: 'User Preferences',
    schema: {
        favorites: StringColumn({
            label: 'favorites',
            maxLength: 4000,
        }),
        user_id: ReferenceColumn({
            label: 'User',
            referenceTable: 'sys_user',
        }),
    },
    actions: ['create', 'read', 'update', 'delete'],
    allow_web_service_access: true,
    accessible_from: 'public',
    caller_access: 'tracking'
})