import '@servicenow/sdk/global'
import { Role } from '@servicenow/sdk/core'

export const peeklogicReportsUserRole = Role({
    $id: Now.ID['peeklogic_reports_user_role'],
    name: 'x_1955226_connecto.peeklogic_reports_user',
    description: 'Peeklogic ServiceNow Reports — access to reports UI, REST API, and app data.',
    grantable: true,
})