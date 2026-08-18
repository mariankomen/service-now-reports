import '@servicenow/sdk/global'
import { Table, StringColumn, BooleanColumn, ReferenceColumn, ListColumn } from '@servicenow/sdk/core'

export const x_1955226_connecto_report = Table({
    name: 'x_1955226_connecto_report',
    label: 'Report',
    schema: {
        chart_group_by: StringColumn({
            label: 'Chart Group By',
            maxLength: 40,
        }),
        chart_type: StringColumn({
            label: 'Chart Type',
            maxLength: 40,
        }),
        columns: StringColumn({
            label: 'Columns',
            maxLength: 12000,
        }),
        description: StringColumn({
            label: 'description',
            maxLength: 80,
        }),
        filter_conditions: StringColumn({
            label: 'Filter Conditions',
            maxLength: 4000,
        }),
        filter_logic: StringColumn({
            label: 'Filter Logic',
            maxLength: 500,
        }),
        filter_query: StringColumn({
            label: 'Filter Query',
            maxLength: 200,
        }),
        folderid: StringColumn({
            label: 'folderid',
            maxLength: 80,
        }),
        group_by: StringColumn({
            label: 'Group By',
            maxLength: 440,
        }),
        is_public: BooleanColumn({
            label: 'Is Public',
            defaultValue: true,
        }),
        name: StringColumn({
            label: 'name',
            maxLength: 40,
        }),
        owner: ReferenceColumn({
            label: 'owner',
            referenceTable: 'sys_user',
        }),
        sf_object_name: StringColumn({
            label: 'SF Object Name',
            maxLength: 120,
        }),
        shared_with: ListColumn({
            label: 'shared with',
            reference: 'sys_user',
        }),
        show_chart: BooleanColumn({
            label: 'Show Chart',
        }),
        show_only_with_sf_records: BooleanColumn({
            label: 'Show Only With SF Records',
        }),
        sn_object_name: StringColumn({
            label: 'SN Object Name',
            maxLength: 120,
        }),
    },
    actions: ['create', 'read', 'update', 'delete'],
    allow_web_service_access: true,
    accessible_from: 'public',
    caller_access: 'tracking'
})