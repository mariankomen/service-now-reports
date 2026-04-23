import '@servicenow/sdk/global'
import { UiPage } from '@servicenow/sdk/core'
import incidentPage from '../../client/index.html'

UiPage({
    $id: Now.ID['report-builder'],
    endpoint: 'x_1955226_connecto_report_builder.do',
    description: 'Peeklogic Report Builder',
    category: 'general',
    html: incidentPage,
    direct: true,
})
