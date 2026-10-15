import '@servicenow/sdk/global'
import { Table, StringColumn, BooleanColumn, ReferenceColumn, ListColumn } from '@servicenow/sdk/core'

export const x_peekl_snreports_folder = Table({
    name: 'x_peekl_snreports_folder',
    label: 'Folder',
    schema: {
        description: StringColumn({
            label: 'Description',
            maxLength: 120,
        }),
        is_public: BooleanColumn({
            label: 'Is Public',
            defaultValue: true,
        }),
        name: StringColumn({
            label: 'Name',
            maxLength: 40,
        }),
        owner: ReferenceColumn({
            label: 'owner',
            referenceTable: 'sys_user',
        }),
        parent_folder_id: ReferenceColumn({
            label: 'Parent Folder Id',
            referenceTable: 'x_peekl_snreports_folder',
        }),
        shared_with: ListColumn({
            label: 'shared_with',
            reference: 'sys_user',
        }),
    },
    actions: ['create', 'read', 'update', 'delete'],
    allow_web_service_access: true,
    accessible_from: 'public',
    caller_access: 'tracking'
})