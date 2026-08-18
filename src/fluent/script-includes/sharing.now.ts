import '@servicenow/sdk/global'
import { ScriptInclude } from '@servicenow/sdk/core'

ScriptInclude({
    $id: Now.ID['sharing_service_script_include'],
    name: 'AccessService',
    apiName: 'x_1955226_connecto.AccessService',
    clientCallable: false,
    accessibleFrom: 'public',
    script: Now.include('../../server/services/access-service.js')
})

