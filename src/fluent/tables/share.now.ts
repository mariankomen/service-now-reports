import '@servicenow/sdk/global'
import { Table, StringColumn, ReferenceColumn } from '@servicenow/sdk/core'

export const x_1955226_connecto_share = Table({
    name: 'x_1955226_connecto_share',
    label: 'Share',
    schema: {
        item_id: StringColumn({
            label: 'Item ID',
            maxLength: 100,
        }),
        item_type: StringColumn({
            label: 'Item Type',
            maxLength: 20,
        }),
        role: StringColumn({
            label: 'Role',
            maxLength: 20,
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