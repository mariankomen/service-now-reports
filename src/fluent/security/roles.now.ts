import '@servicenow/sdk/global'
import { Role } from '@servicenow/sdk/core'

export const peeklogicReportsUserRole = Role({
    $id: Now.ID['peeklogic_reports_user_role'],
    name: 'x_peekl_snreports.peeklogic_reports_user',
    description: 'Peeklogic ServiceNow Reports — access to reports UI, REST API, and app data.',
    grantable: true,
})