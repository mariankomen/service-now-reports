import '@servicenow/sdk/global'
import { ScriptInclude } from '@servicenow/sdk/core'

ScriptInclude({
    $id: Now.ID['salesforce_auth_service_script_include'],
    name: 'SalesforceAuthService',
    apiName: 'x_1955226_connecto.SalesforceAuthService',
    clientCallable: false,
    accessibleFrom: 'public',
    script: Now.include('../../server/services/salesforce-auth-service.js')
})

