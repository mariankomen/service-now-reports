import '@servicenow/sdk/global'
import { ScriptInclude } from '@servicenow/sdk/core'

ScriptInclude({
    $id: Now.ID['salesforce_record_service_script_include'],
    name: 'SalesforceRecordsService',
    apiName: 'x_1955226_connecto.SalesforceRecordsService',
    clientCallable: false,
    accessibleFrom: 'public',
    script: Now.include('../../server/services/salesforce-records-service.js')
})

