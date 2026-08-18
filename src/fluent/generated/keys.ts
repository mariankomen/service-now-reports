import '@servicenow/sdk/global'

declare global {
    namespace Now {
        namespace Internal {
            interface Keys extends KeysRegistry {
                explicit: {
                    bom_json: {
                        table: 'sys_module'
                        id: '68c45ebcf1084d258a268d3367dc6e5b'
                    }
                    connector_api: {
                        table: 'sys_ws_definition'
                        id: 'd3a1a257142b4f08a7a79dc3ccd18d1a'
                    }
                    credentials_get_route: {
                        table: 'sys_ws_operation'
                        id: 'a449c3311a06408daa956fd244c75c9b'
                    }
                    credentials_post_route: {
                        table: 'sys_ws_operation'
                        id: '5d42a79a1f144cb5aa08f9431d5d3700'
                    }
                    credentials_validate_post_route: {
                        table: 'sys_ws_operation'
                        id: 'd261ce0751ae473c8566de62d48d0b45'
                    }
                    folder_all_get_route: {
                        table: 'sys_ws_operation'
                        id: '5598836a6523421f968fa5d033eeec96'
                    }
                    folder_delete_route: {
                        table: 'sys_ws_operation'
                        id: '522251bf45b94c0980c5799d9e8fd4cf'
                    }
                    folder_post_route: {
                        table: 'sys_ws_operation'
                        id: '9b859d99235f4b658c913cbaf955585f'
                    }
                    folder_put_route: {
                        table: 'sys_ws_operation'
                        id: 'd24b241d6f504dbdb1618a1d826b0744'
                    }
                    folders_filter_get_route: {
                        table: 'sys_ws_operation'
                        id: 'b84c8121e3c849c7af2d44ba65c74b7f'
                    }
                    'node_modules/react-toastify/dist/ReactToastify.css': {
                        table: 'sys_ux_theme_asset'
                        id: '2d6f864251594168b78b901b45275770'
                        deleted: true
                    }
                    package_json: {
                        table: 'sys_module'
                        id: '5844968aa3304b85952d457061751811'
                    }
                    report_data_get_route: {
                        table: 'sys_ws_operation'
                        id: '89bf50291224484aa26700f58ce11a07'
                    }
                    report_delete_route: {
                        table: 'sys_ws_operation'
                        id: '90465b4374be41b7bb460c51f5df3bdf'
                    }
                    report_get_route: {
                        table: 'sys_ws_operation'
                        id: '734e9f2e85e44515b7a50bf86e9e88d5'
                    }
                    report_post_route: {
                        table: 'sys_ws_operation'
                        id: '095efcfa8f4d4a4981ce3b11cc18cabb'
                    }
                    report_put_route: {
                        table: 'sys_ws_operation'
                        id: 'c5584f63971d4ea09e1af071e1304b5d'
                    }
                    reports_get_route: {
                        table: 'sys_ws_operation'
                        id: '0b68a69ad107409485cf2a582aaa35cb'
                    }
                    salesforce_auth_service_script_include: {
                        table: 'sys_script_include'
                        id: '4f6cf52008924a3fb6820780fd1b40b2'
                    }
                    salesforce_describe_get_route: {
                        table: 'sys_ws_operation'
                        id: '8291087c22f44e7b8e08f6b6053934b2'
                    }
                    salesforce_record_service_script_include: {
                        table: 'sys_script_include'
                        id: '15394b73cf594458b0f7b5dbc9c6b036'
                    }
                    servicenow_tables_get_route: {
                        table: 'sys_ws_operation'
                        id: '0347d16090034830b527ca1fb4e4239a'
                    }
                    sf_fields_get_route: {
                        table: 'sys_ws_operation'
                        id: 'f4a616e3cd634cb58f12ab62f46f98c7'
                    }
                    share_delete_route: {
                        table: 'sys_ws_operation'
                        id: 'fa57dac9f2164c63845ae0cc76829234'
                    }
                    share_get_route: {
                        table: 'sys_ws_operation'
                        id: '6f96ca732f244c8aa4c90e245be0eaa6'
                    }
                    share_post_route: {
                        table: 'sys_ws_operation'
                        id: 'fe652bd240b849439ab7b01a4a221a59'
                    }
                    share_put_route: {
                        table: 'sys_ws_operation'
                        id: '093bb9a5fe6d4df1a1121a4773511fa9'
                    }
                    sharing_service_script_include: {
                        table: 'sys_script_include'
                        id: '94e3477bf8f44c0fba657ad59156f917'
                    }
                    'src_server_auth-credentials-post_js': {
                        table: 'sys_module'
                        id: 'd393c6dcd23e42f3ae0df099aa4f1ce2'
                    }
                    'src_server_auth-credentials-validate-post_js': {
                        table: 'sys_module'
                        id: '4f457a5fac7f4aacb3726428c673fccf'
                    }
                    'src_server_credentials-get_js': {
                        table: 'sys_module'
                        id: '8cafc043fce1419fb16014f28d98d525'
                    }
                    'src_server_favorites-delete_js': {
                        table: 'sys_module'
                        id: 'ca6fc3699d49446a85a3be739ee0e019'
                        deleted: true
                    }
                    'src_server_favorites-get_js': {
                        table: 'sys_module'
                        id: '68b345721416401d892770869c9070dc'
                    }
                    'src_server_favorites-post_js': {
                        table: 'sys_module'
                        id: '62c9d5e7295145a89e5f478b73962ce2'
                    }
                    'src_server_favorites-remove-post_js': {
                        table: 'sys_module'
                        id: '30504cfd4d674778ace42da6624dd8df'
                    }
                    'src_server_folder-delete_js': {
                        table: 'sys_module'
                        id: '3da4e127f4bf40a591f457b3232adcc2'
                    }
                    'src_server_folder-get_js': {
                        table: 'sys_module'
                        id: '28e0df74b54a44c7addeaf877739bde2'
                    }
                    'src_server_folder-post_js': {
                        table: 'sys_module'
                        id: '585c8bbc40ba4b54b6b532cb627886d4'
                    }
                    'src_server_folder-put_js': {
                        table: 'sys_module'
                        id: 'ed112818f0554cec831ef4e3d02546bc'
                    }
                    'src_server_folders-get-all-get_js': {
                        table: 'sys_module'
                        id: '7adf86b7767c4539a9baad762deaa3e1'
                    }
                    'src_server_report-data-get_js': {
                        table: 'sys_module'
                        id: 'fed775a1964d44b29cfd77bad13c4c8c'
                        deleted: true
                    }
                    'src_server_report-data-post_js': {
                        table: 'sys_module'
                        id: '991ddfa39c1340b6863e5e5898500dd3'
                    }
                    'src_server_report-delete_js': {
                        table: 'sys_module'
                        id: '7b9643081f5a47c8849cdaee92393a68'
                    }
                    'src_server_report-get_js': {
                        table: 'sys_module'
                        id: 'ae77a07d1eec49edb9f4901d630f37d6'
                    }
                    'src_server_report-post_js': {
                        table: 'sys_module'
                        id: '332f810e618a49b8a8a67076ee85325a'
                    }
                    'src_server_report-put_js': {
                        table: 'sys_module'
                        id: '415c21c4f5654ecbbb57948751c85fb5'
                    }
                    'src_server_reports-get_js': {
                        table: 'sys_module'
                        id: '9397a78191bb4d69aebfc957e8dedc11'
                    }
                    'src_server_salesforce-object-details-get_js': {
                        table: 'sys_module'
                        id: '9739fac8107f42ffa4fc9e526c0d29da'
                    }
                    'src_server_salesforce-object-fields-get_js': {
                        table: 'sys_module'
                        id: 'e20770193a654daf965c5f5b53809110'
                    }
                    'src_server_service-now-tables-get_js': {
                        table: 'sys_module'
                        id: '8f5460f0d47740eb831e6366a94c4a03'
                    }
                    'src_server_services_access-service_js': {
                        table: 'sys_module'
                        id: '26812ef2fefd44f9aee39d54ec632ed6'
                    }
                    'src_server_services_salesforce-auth-service_js': {
                        table: 'sys_module'
                        id: '0e513c74654d49b3b022a588ebed258c'
                    }
                    'src_server_services_salesforce-records-service_js': {
                        table: 'sys_module'
                        id: '6f9cec3d468845248629e592a539cc33'
                    }
                    'src_server_share-delete_js': {
                        table: 'sys_module'
                        id: '196c13b91ca747e6a7601d7240679879'
                    }
                    'src_server_share-get_js': {
                        table: 'sys_module'
                        id: 'ed75915f83164ddaa38bbf4724ec3d35'
                    }
                    'src_server_share-post_js': {
                        table: 'sys_module'
                        id: '1e0e5fcfd59f452fbbf4c5bf0733e78c'
                    }
                    'src_server_share-put_js': {
                        table: 'sys_module'
                        id: 'd6b8db40e86b4f608a4d715f9b1f8a9c'
                    }
                    'src_server_users-search-get_js': {
                        table: 'sys_module'
                        id: 'f2de94b3966f4841bd7a8f4ecbf52e98'
                    }
                    user_prefs_delete_route: {
                        table: 'sys_ws_operation'
                        id: 'b8bbc8d6deae40f69b80bdc4a20665b3'
                        deleted: true
                    }
                    user_prefs_get_route: {
                        table: 'sys_ws_operation'
                        id: '78e9eb3244df49d886a7f5fc13a35f24'
                    }
                    user_prefs_post_route: {
                        table: 'sys_ws_operation'
                        id: 'dbf0b0a60c2a470ab4b872033e8c2d58'
                    }
                    user_prefs_remove_route: {
                        table: 'sys_ws_operation'
                        id: 'ddfddae87759444b80855ab076957de6'
                    }
                    users_search_get_route: {
                        table: 'sys_ws_operation'
                        id: 'b08b3ee86a8c401889765cb05c1b75ff'
                    }
                    x_1955226_connecto_app_connect: {
                        table: 'sys_app_module'
                        id: 'd8fae69304394e0f86a1408639ceba3f'
                    }
                    x_1955226_connecto_app_menu: {
                        table: 'sys_app_application'
                        id: 'f4249d23a58d40c09a025deeff7efce6'
                    }
                    x_1955226_connecto_app_module: {
                        table: 'sys_app_module'
                        id: 'f731da5588d84c08ab066d1a02a722e8'
                    }
                    x_peekl_salesfor_0_app_menu: {
                        table: 'sys_app_application'
                        id: 'bbb2922bbba643ec8ea9e7e84b441a4b'
                        deleted: true
                    }
                    x_peekl_salesfor_0_app_module: {
                        table: 'sys_app_module'
                        id: '7d19b30118a44350958ef5c4e3312cfe'
                        deleted: true
                    }
                }
                composite: [
                    {
                        table: 'sys_ui_page'
                        id: '07590f4661bc4c61abdf5a19797b5c66'
                        key: {
                            endpoint: 'x_1955226_connecto_report_builder.do'
                        }
                    },
                    {
                        table: 'sys_ux_lib_asset'
                        id: '1956bf99772f4c0fbf980bbffc3b12ea'
                        key: {
                            name: 'x_1955226_connecto/main.js.map'
                        }
                    },
                    {
                        table: 'sys_ux_lib_asset'
                        id: '31fa9b79fbb347759eb4c2e0ec2d53ea'
                        key: {
                            name: 'x_1955226_connecto/index.es'
                        }
                    },
                    {
                        table: 'sys_ux_lib_asset'
                        id: '3a618ccb7d284a149b4524a9bc732255'
                        key: {
                            name: 'x_1955226_connecto/html2canvas.js.map'
                        }
                    },
                    {
                        table: 'sys_ux_lib_asset'
                        id: '70063954d9224b6bb28928e2a73fc0c1'
                        key: {
                            name: 'x_1955226_connecto/purify.es'
                        }
                    },
                    {
                        table: 'sys_ux_lib_asset'
                        id: '89517da4e76e4013a54e13c68a0f7b4a'
                        key: {
                            name: 'x_1955226_connecto/main'
                        }
                    },
                    {
                        table: 'sys_ui_page'
                        id: '9b5af5dce174498a90e867dfd6a564a8'
                        key: {
                            endpoint: 'x_1955226_connecto_incident_manager.do'
                        }
                    },
                    {
                        table: 'sys_ux_lib_asset'
                        id: 'c2f62e387ce6433d9418377206bce858'
                        key: {
                            name: 'x_1955226_connecto/purify.es.js.map'
                        }
                    },
                    {
                        table: 'sys_ux_lib_asset'
                        id: 'd26d4747897e455594b9c561c7975497'
                        key: {
                            name: 'x_1955226_connecto/index.es.js.map'
                        }
                    },
                    {
                        table: 'sys_ux_lib_asset'
                        id: 'ec82d4199bc5481e871374d5556bff1a'
                        key: {
                            name: 'x_1955226_connecto/html2canvas'
                        }
                    },
                ]
            }
        }
    }
}
