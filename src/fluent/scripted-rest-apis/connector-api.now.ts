import '@servicenow/sdk/global'
import { Acl, RestApi } from '@servicenow/sdk/core'
import { peeklogicReportsUserRole } from '../security/roles.now'

const salesforceIntegrationRestEndpointAcl = Acl({
    $id: Now.ID['salesforce_integration_rest_endpoint_acl'],
    name: 'Salesforce Integration REST Endpoint',
    type: 'rest_endpoint',
    operation: 'execute',
    roles: [peeklogicReportsUserRole],
})

RestApi({
    $id: Now.ID['connector_api'],
    name: 'connector_api',
    serviceId: 'x_1955226_connecto_connector_api',
    shortDescription: 'API for Salesforce integration - authentication and task type configuration',
    routes: [
        {
            $id: Now.ID['credentials_post_route'],
            path: '/credentials',
            method: 'POST',
            script: Now.include('../../server/auth-credentials-post.js'),
            shortDescription: 'Credentials POST',
            enforceAcl: [salesforceIntegrationRestEndpointAcl]
        },
        {
            $id: Now.ID['credentials_validate_post_route'],
            path: '/credentials/validate',
            method: 'POST',
            script: Now.include('../../server/auth-credentials-validate-post.js'),
            shortDescription: 'Validate SF Credentials POST',
            enforceAcl: [salesforceIntegrationRestEndpointAcl]
        },
        {
            $id: Now.ID['folder_post_route'],
            path: '/folder',
            method: 'POST',
            script: Now.include('../../server/folder-post.js'),
            shortDescription: 'Folder POST',
            enforceAcl: [salesforceIntegrationRestEndpointAcl]
        },
        {
            $id: Now.ID['folder_all_get_route'],
            path: '/folder',
            method: 'GET',
            script: Now.include('../../server/folders-get-all-get.js'),
            shortDescription: 'Folder GET All',
            enforceAcl: [salesforceIntegrationRestEndpointAcl]
        },
        {
            $id: Now.ID['credentials_get_route'],
            path: '/credentials',
            method: 'GET',
            script: Now.include('../../server/credentials-get.js'),
            shortDescription: 'credentials GET',
            enforceAcl: [salesforceIntegrationRestEndpointAcl]
        },
        {
            $id: Now.ID['folders_filter_get_route'],
            path: '/folders',
            method: 'GET',
            script: Now.include('../../server/folder-get.js'),
            shortDescription: 'Folders Sharing GET',
            enforceAcl: [salesforceIntegrationRestEndpointAcl]
        },
        {
            $id: Now.ID['reports_get_route'],
            path: '/reports',
            method: 'GET',
            script: Now.include('../../server/reports-get.js'),
            shortDescription: 'Reports GET',
            enforceAcl: [salesforceIntegrationRestEndpointAcl]
        },
        {
            $id: Now.ID['report_post_route'],
            path: '/report',
            method: 'POST',
            script: Now.include('../../server/report-post.js'),
            shortDescription: 'Report POST',
            enforceAcl: [salesforceIntegrationRestEndpointAcl]
        },
        {
            $id: Now.ID['salesforce_describe_get_route'],
            path: '/salesforce/describe',
            method: 'GET',
            script: Now.include('../../server/salesforce-object-details-get.js'),
            shortDescription: 'SF Sobject GET',
            enforceAcl: [salesforceIntegrationRestEndpointAcl]
        },
        {
            $id: Now.ID['servicenow_tables_get_route'],
            path: '/servicenow/tables',
            method: 'GET',
            script: Now.include('../../server/service-now-tables-get.js'),
            shortDescription: 'SN Tables GET',
            enforceAcl: [salesforceIntegrationRestEndpointAcl]
        },
        {
            $id: Now.ID['sf_fields_get_route'],
            path: '/salesforce/fields',
            method: 'GET',
            script: Now.include('../../server/salesforce-object-fields-get.js'),
            shortDescription: 'SF Fields GET',
            enforceAcl: [salesforceIntegrationRestEndpointAcl]
        },
        {
            $id: Now.ID['servicenow_reference_search_get_route'],
            path: '/servicenow/reference/search',
            method: 'GET',
            script: Now.include('../../server/servicenow-reference-search-get.js'),
            shortDescription: 'SN Reference Search GET',
            enforceAcl: [salesforceIntegrationRestEndpointAcl]
        },
        {
            $id: Now.ID['report_get_route'],
            path: '/report',
            method: 'GET',
            script: Now.include('../../server/report-get.js'),
            shortDescription: 'Report Single GET',
            enforceAcl: [salesforceIntegrationRestEndpointAcl]
        },
        {
            $id: Now.ID['report_put_route'],
            path: '/report',
            method: 'PUT',
            script: Now.include('../../server/report-put.js'),
            shortDescription: 'Report Single PUT',
            enforceAcl: [salesforceIntegrationRestEndpointAcl]
        },
        {
            $id: Now.ID['report_data_get_route'],
            path: '/report/data',
            method: 'POST',
            script: Now.include('../../server/report-data-post.js'),
            shortDescription: 'POST Report Data',
            enforceAcl: [salesforceIntegrationRestEndpointAcl]
        },
        {
            $id: Now.ID['users_search_get_route'],
            path: '/users/search',
            method: 'GET',
            script: Now.include('../../server/users-search-get.js'),
            shortDescription: 'GET Users Search',
            enforceAcl: [salesforceIntegrationRestEndpointAcl]
        },
        {
            $id: Now.ID['share_get_route'],
            path: '/share',
            method: 'GET',
            script: Now.include('../../server/share-get.js'),
            shortDescription: 'GET Share',
            enforceAcl: [salesforceIntegrationRestEndpointAcl]
        },
        {
            $id: Now.ID['share_post_route'],
            path: '/share',
            method: 'POST',
            script: Now.include('../../server/share-post.js'),
            shortDescription: 'POST Share',
            enforceAcl: [salesforceIntegrationRestEndpointAcl]
        },
        {
            $id: Now.ID['share_put_route'],
            path: '/share',
            method: 'PUT',
            script: Now.include('../../server/share-put.js'),
            shortDescription: 'PUT Share',
            enforceAcl: [salesforceIntegrationRestEndpointAcl]
        },
        {
            $id: Now.ID['share_delete_route'],
            path: '/share',
            method: 'DELETE',
            script: Now.include('../../server/share-delete.js'),
            shortDescription: 'DELETE Share',
            enforceAcl: [salesforceIntegrationRestEndpointAcl]
        },
        {
            $id: Now.ID['user_prefs_post_route'],
            path: '/user-prefs/favorites',
            method: 'POST',
            script: Now.include('../../server/favorites-post.js'),
            shortDescription: 'User Favorites, POST',
            enforceAcl: [salesforceIntegrationRestEndpointAcl]
        },
        {
            $id: Now.ID['user_prefs_remove_route'],
            path: '/user-prefs/favorites/remove',
            method: 'POST',
            script: Now.include('../../server/favorites-remove-post.js'),
            shortDescription: 'User Favorites, remove',
            enforceAcl: [salesforceIntegrationRestEndpointAcl]
        },
        {
            $id: Now.ID['user_prefs_get_route'],
            path: '/user-prefs',
            method: 'GET',
            script: Now.include('../../server/favorites-get.js'),
            shortDescription: 'User Favorites, GET',
            enforceAcl: [salesforceIntegrationRestEndpointAcl]
        },
        {
            $id: Now.ID['folder_put_route'],
            path: '/folder',
            method: 'PUT',
            script: Now.include('../../server/folder-put.js'),
            shortDescription: 'Folder Update',
            enforceAcl: [salesforceIntegrationRestEndpointAcl]
        },
        {
            $id: Now.ID['folder_delete_route'],
            path: '/folder',
            method: 'DELETE',
            script: Now.include('../../server/folder-delete.js'),
            shortDescription: 'Folder Delete',
            enforceAcl: [salesforceIntegrationRestEndpointAcl]
        },
        {
            $id: Now.ID['report_delete_route'],
            path: '/report',
            method: 'DELETE',
            script: Now.include('../../server/report-delete.js'),
            shortDescription: 'Report Delete',
            enforceAcl: [salesforceIntegrationRestEndpointAcl]
        },
    ]
})