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
                    connecto_connection_create_acl: {
                        table: 'sys_security_acl'
                        id: '93e6f341b0e84ffaa6def7826082c9ed'
                    }
                    connecto_connection_delete_acl: {
                        table: 'sys_security_acl'
                        id: 'f9d0f6eb423846cb8f5d9564756cf10a'
                    }
                    connecto_connection_read_acl: {
                        table: 'sys_security_acl'
                        id: 'b4e3809b78304be99c03cf44a6c951e7'
                    }
                    connecto_connection_write_acl: {
                        table: 'sys_security_acl'
                        id: '4aaba885dbed45519bba49822a1760ee'
                    }
                    connecto_folder_create_acl: {
                        table: 'sys_security_acl'
                        id: 'ec2ded9a7873420eafd084bec5ddd875'
                    }
                    connecto_folder_delete_acl: {
                        table: 'sys_security_acl'
                        id: '035c185d60ab46b09f65166175ea5b57'
                    }
                    connecto_folder_read_acl: {
                        table: 'sys_security_acl'
                        id: 'dddf406d336f4bd5a47d84a5d899662f'
                    }
                    connecto_folder_write_acl: {
                        table: 'sys_security_acl'
                        id: 'ac4231dd4ecb4be4bb26a032e9c3e42f'
                    }
                    connecto_report_create_acl: {
                        table: 'sys_security_acl'
                        id: '194a5f54c92d408aa83cf54535b8ed1a'
                    }
                    connecto_report_delete_acl: {
                        table: 'sys_security_acl'
                        id: 'b0dfc1e21b634f459d089993e488f2dc'
                    }
                    connecto_report_read_acl: {
                        table: 'sys_security_acl'
                        id: 'e30cf1d6bcb1457cb4e0776adb87ebfe'
                    }
                    connecto_report_write_acl: {
                        table: 'sys_security_acl'
                        id: 'd42030dbc91e430ead5e3caa488a8af2'
                    }
                    connecto_share_create_acl: {
                        table: 'sys_security_acl'
                        id: 'c3c0906477bb487da7d8e5381b745eba'
                    }
                    connecto_share_delete_acl: {
                        table: 'sys_security_acl'
                        id: '1d43163edf67414faf8684c036cb52e3'
                    }
                    connecto_share_read_acl: {
                        table: 'sys_security_acl'
                        id: '3daa174e42a44af4aeceb071b74a2437'
                    }
                    connecto_share_write_acl: {
                        table: 'sys_security_acl'
                        id: '0c9c88d09c50469487742f4dedb79f2e'
                    }
                    connecto_user_prefs_create_acl: {
                        table: 'sys_security_acl'
                        id: '8b626d74881d41048395b5a77c3e3d4b'
                    }
                    connecto_user_prefs_delete_acl: {
                        table: 'sys_security_acl'
                        id: 'fc26ba233f7f4dbbb4be66086ba6606a'
                    }
                    connecto_user_prefs_read_acl: {
                        table: 'sys_security_acl'
                        id: 'fe2280644ccc4dcb92f48915baf06442'
                    }
                    connecto_user_prefs_write_acl: {
                        table: 'sys_security_acl'
                        id: 'a4d36559bfa14a2eb6db07d1f8f91f2a'
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
                    report_builder_endpoint_ui_page_execute_acl: {
                        table: 'sys_security_acl'
                        id: '4167acbdbb0742759d66e9717bde9acf'
                    }
                    report_builder_endpoint_ui_page_read_acl: {
                        table: 'sys_security_acl'
                        id: '37899dee7b114788a9ead94e5219728c'
                    }
                    report_builder_ui_page_execute_acl: {
                        table: 'sys_security_acl'
                        id: '96a4e1e38a414791bc8a28dbc9db815d'
                    }
                    report_builder_ui_page_read_acl: {
                        table: 'sys_security_acl'
                        id: '25d784a47a0c452f987c57c353ba4ab8'
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
                    salesforce_integration_rest_endpoint_acl: {
                        table: 'sys_security_acl'
                        id: '103d050022af404b905c5708e26d4e42'
                    }
                    salesforce_record_service_script_include: {
                        table: 'sys_script_include'
                        id: '15394b73cf594458b0f7b5dbc9c6b036'
                    }
                    servicenow_reference_search_get_route: {
                        table: 'sys_ws_operation'
                        id: 'f9816ec00fae49db918c876f348f6236'
                    }
                    servicenow_tables_get_route: {
                        table: 'sys_ws_operation'
                        id: '0347d16090034830b527ca1fb4e4239a'
                    }
                    sf_fields_get_route: {
                        table: 'sys_ws_operation'
                        id: 'f4a616e3cd634cb58f12ab62f46f98c7'
                    }
                    sf_reference_search_get_route: {
                        table: 'sys_ws_operation'
                        id: '6fb1fd97de6d40ea8e68d37b52005bba'
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
                    sidebar_counts_get_route: {
                        table: 'sys_ws_operation'
                        id: '41e27da3bd7e4f4887ce0374b8009a60'
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
                    'src_server_salesforce-reference-search-get_js': {
                        table: 'sys_module'
                        id: '7d68a5d253134d22b454b9e24099e407'
                    }
                    'src_server_service-now-tables-get_js': {
                        table: 'sys_module'
                        id: '8f5460f0d47740eb831e6366a94c4a03'
                    }
                    'src_server_servicenow-reference-search-get_js': {
                        table: 'sys_module'
                        id: '0bef1c943ef34deb961a4aca977c7073'
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
                    'src_server_sidebar-counts-get_js': {
                        table: 'sys_module'
                        id: '8336121594174c329d831ebd86711005'
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
                    x_1955226_connecto_privacy_module: {
                        table: 'sys_app_module'
                        id: '4f972859f0c44ae3a502f142b5d1cc34'
                    }
                    x_1955226_connecto_support_module: {
                        table: 'sys_app_module'
                        id: '56a000103c844a3b8ff80e4331bfc272'
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
                        table: 'sys_dictionary'
                        id: '0070097d1705499dad80153fa3467b8f'
                        key: {
                            name: 'x_1955226_connecto_report'
                            element: 'chart_series_by'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '04e491d8f88f4e48b268d8069f421765'
                        key: {
                            sys_security_acl: '1d43163edf67414faf8684c036cb52e3'
                            sys_user_role: {
                                id: '7d8e9fa66a76491fa77bfec7e3dd0046'
                                key: {
                                    name: 'x_1955226_connecto.peeklogic_reports_user'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '05578b6e201e4bccbe69ef7eafbb738c'
                        key: {
                            name: 'x_1955226_connecto_share'
                            element: 'role'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '056d4092d03e41fa887af7a46ca1b708'
                        key: {
                            name: 'x_1955226_connecto_report'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_page'
                        id: '07590f4661bc4c61abdf5a19797b5c66'
                        key: {
                            endpoint: 'x_1955226_connecto_report_builder.do'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '090dcfc945474373b1be049b404aef06'
                        key: {
                            name: 'x_1955226_connecto_folder'
                            element: 'is_public'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '0cb508730a174effa112b17f93feffb6'
                        key: {
                            sys_security_acl: '37899dee7b114788a9ead94e5219728c'
                            sys_user_role: {
                                id: '7d8e9fa66a76491fa77bfec7e3dd0046'
                                key: {
                                    name: 'x_1955226_connecto.peeklogic_reports_user'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '11afe0bc7831487ca18b7efac0471c1b'
                        key: {
                            sys_security_acl: 'fc26ba233f7f4dbbb4be66086ba6606a'
                            sys_user_role: {
                                id: '7d8e9fa66a76491fa77bfec7e3dd0046'
                                key: {
                                    name: 'x_1955226_connecto.peeklogic_reports_user'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '156bfb3bf4df4e48a11cfd551252ef4a'
                        key: {
                            name: 'x_1955226_connecto_report'
                            element: 'description'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '156c33da13284f9ab1023227f935419c'
                        key: {
                            name: 'x_1955226_connecto_folder'
                            element: 'owner'
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
                        table: 'sys_documentation'
                        id: '1c2129db9df4452aa14f03e791e9c6a8'
                        key: {
                            name: 'x_1955226_connecto_report'
                            element: 'is_public'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '1df04cc8270346b0b96ea51c26955b5c'
                        key: {
                            name: 'x_1955226_connecto_folder'
                            element: 'description'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '1e2ed700af2246d18963d40fa8161dec'
                        key: {
                            name: 'x_1955226_connecto_report'
                            element: 'columns'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '211fb95754bb4e6ea6571d61f3e1f29e'
                        key: {
                            name: 'x_1955226_connecto_connection'
                            element: 'user_id'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '21c178c1a77e4aae8ddb0fc1fddf8312'
                        key: {
                            name: 'x_1955226_connecto_folder'
                            element: 'owner'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '24754e8ab6394d0ca701064af17ff223'
                        key: {
                            name: 'x_1955226_connecto_share'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '24ba59da8a27437c9038ef3e924d0e37'
                        key: {
                            name: 'x_1955226_connecto_share'
                            element: 'item_type'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '27191deed6bc4b49b0f4e43f8d690164'
                        key: {
                            name: 'x_1955226_connecto_connection'
                            element: 'client_secret'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '2788dc3cefbe4bd3b17fdc631ceab29b'
                        key: {
                            name: 'x_1955226_connecto_report'
                            element: 'chart_value_field'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '284cfbc7d44443f4b135995ccba69ea6'
                        key: {
                            name: 'x_1955226_connecto_report'
                            element: 'folderid'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '2876f6edcfcb43d680dd46b0558d3b66'
                        key: {
                            name: 'x_1955226_connecto_report'
                            element: 'chart_type'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '2883670cc0434727a0bafd73eebf1478'
                        key: {
                            sys_security_acl: 'c3c0906477bb487da7d8e5381b745eba'
                            sys_user_role: {
                                id: '7d8e9fa66a76491fa77bfec7e3dd0046'
                                key: {
                                    name: 'x_1955226_connecto.peeklogic_reports_user'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '290aea4b58bf41fa96abf55948db61b8'
                        key: {
                            name: 'x_1955226_connecto_user_prefs'
                            element: 'user_id'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '2bad29ac5dfb4129aa8591a907195ba9'
                        key: {
                            name: 'x_1955226_connecto_user_prefs'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '2c1c754fcbe449269c4c6df55ef43833'
                        key: {
                            name: 'x_1955226_connecto_report'
                            element: 'show_chart'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '2e1a57e204ae4baebbae625657342690'
                        key: {
                            name: 'x_1955226_connecto_user_prefs'
                            element: 'user_id'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '2ea908fe70de4e59ba372e4592497072'
                        key: {
                            name: 'x_1955226_connecto_folder'
                            element: 'parent_folder_id'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: '2fa2783e477b47ef8dd976be555525bf'
                        key: {
                            name: 'x_1955226_connecto_folder'
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
                        table: 'sys_documentation'
                        id: '3204cc716aa74ef997b85d47e84f7f1f'
                        key: {
                            name: 'x_1955226_connecto_report'
                            element: 'owner'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '32a242785ae743a78c72e3b3ed629888'
                        key: {
                            name: 'x_1955226_connecto_report'
                            element: 'sf_object_name'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '35445f24e6a542b59d5dabdafa767871'
                        key: {
                            name: 'x_1955226_connecto_report'
                            element: 'is_public'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '35988eb6755a446c8d9abc51698dea20'
                        key: {
                            name: 'x_1955226_connecto_report'
                            element: 'show_chart'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '378546c7add446249c971915796e4c23'
                        key: {
                            name: 'x_1955226_connecto_share'
                            element: 'item_type'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '38223bc069ab4a089246375d7ffacd51'
                        key: {
                            name: 'x_1955226_connecto_folder'
                            element: 'name'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '38ab4f8441c442e49fb125ab29eb8a2a'
                        key: {
                            sys_security_acl: 'b4e3809b78304be99c03cf44a6c951e7'
                            sys_user_role: {
                                id: '7d8e9fa66a76491fa77bfec7e3dd0046'
                                key: {
                                    name: 'x_1955226_connecto.peeklogic_reports_user'
                                }
                            }
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
                        table: 'sys_documentation'
                        id: '3cb9cd9d48e04ea291d88d6381e54ca4'
                        key: {
                            name: 'x_1955226_connecto_report'
                            element: 'filter_logic'
                            language: 'en'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: '3d105b73f829468d967c6b153552a6b8'
                        key: {
                            name: 'x_1955226_connecto_folder'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '3e2d67e8ec9e4eed99df16b310ea0989'
                        key: {
                            sys_security_acl: 'ac4231dd4ecb4be4bb26a032e9c3e42f'
                            sys_user_role: {
                                id: '7d8e9fa66a76491fa77bfec7e3dd0046'
                                key: {
                                    name: 'x_1955226_connecto.peeklogic_reports_user'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '4479124d198f42a09cde48b305e97ea0'
                        key: {
                            name: 'x_1955226_connecto_connection'
                            element: 'base_url'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '4540c643f4284caeb64e59c4f32eae67'
                        key: {
                            name: 'x_1955226_connecto_report'
                            element: 'group_by'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '45b0f7f4bf414625a4a47d30959ea142'
                        key: {
                            name: 'x_1955226_connecto_report'
                            element: 'shared_with'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '46a0f87d426d4fa2baf3d8a80eb9dd2e'
                        key: {
                            name: 'x_1955226_connecto_connection'
                            element: 'client_id'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '46cd4df4dbc940a890238d2a3d1efec3'
                        key: {
                            name: 'x_1955226_connecto_report'
                            element: 'filter_conditions'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '47c75048100d4b29b9361a5856f4e392'
                        key: {
                            sys_security_acl: 'd42030dbc91e430ead5e3caa488a8af2'
                            sys_user_role: {
                                id: '7d8e9fa66a76491fa77bfec7e3dd0046'
                                key: {
                                    name: 'x_1955226_connecto.peeklogic_reports_user'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '4a751056bdd84c889d22efb303c4f0ca'
                        key: {
                            name: 'x_1955226_connecto_connection'
                            element: 'refresh_token'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '4b7c97241c0a4cf18bcd2d6ea35ceee7'
                        key: {
                            sys_security_acl: '4aaba885dbed45519bba49822a1760ee'
                            sys_user_role: {
                                id: '7d8e9fa66a76491fa77bfec7e3dd0046'
                                key: {
                                    name: 'x_1955226_connecto.peeklogic_reports_user'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: '4c6ee1cafa3647bdb218202cd8cf3ecb'
                        key: {
                            name: 'x_1955226_connecto_share'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '4ee8301aeaf547d091028655acdb57e3'
                        key: {
                            name: 'x_1955226_connecto_report'
                            element: 'name'
                            language: 'en'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: '527a17a7dbeb42d9818aba9757b0d7e0'
                        key: {
                            name: 'x_1955226_connecto_user_prefs'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '568db8c4c0464d2ca327265c04a6886e'
                        key: {
                            name: 'x_1955226_connecto_folder'
                            element: 'is_public'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '599b44c99e45474c95ac984df747daa6'
                        key: {
                            name: 'x_1955226_connecto_report'
                            element: 'filter_logic'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '59ad463a5bd9468cb71401bde609ec86'
                        key: {
                            sys_security_acl: '25d784a47a0c452f987c57c353ba4ab8'
                            sys_user_role: {
                                id: '7d8e9fa66a76491fa77bfec7e3dd0046'
                                key: {
                                    name: 'x_1955226_connecto.peeklogic_reports_user'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '5aef68e97ef1499784bd002b1cf12a54'
                        key: {
                            name: 'x_1955226_connecto_share'
                            element: 'item_id'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '5faf4de34955441d83c747ea6253a2b7'
                        key: {
                            name: 'x_1955226_connecto_folder'
                            element: 'parent_folder_id'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '61ab2553d1fd4f9e9d13360a717dbc79'
                        key: {
                            name: 'x_1955226_connecto_report'
                            element: 'sn_object_name'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '61cc5579721146a29a8c101f3a5412fd'
                        key: {
                            name: 'x_1955226_connecto_report'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '622553fa8ece4f489aea05217e12354e'
                        key: {
                            name: 'x_1955226_connecto_report'
                            element: 'chart_title'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '62504d99bcbb469583b72a0b575930b4'
                        key: {
                            name: 'x_1955226_connecto_share'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '65e1d732a80948b58396bd7b46cad9f9'
                        key: {
                            sys_security_acl: 'fe2280644ccc4dcb92f48915baf06442'
                            sys_user_role: {
                                id: '7d8e9fa66a76491fa77bfec7e3dd0046'
                                key: {
                                    name: 'x_1955226_connecto.peeklogic_reports_user'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '684caf3bb0c040639a36518fad7a4b19'
                        key: {
                            name: 'x_1955226_connecto_connection'
                            element: 'issued_at'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '692714f59a4547f69a3649e18441d6a5'
                        key: {
                            name: 'x_1955226_connecto_user_prefs'
                            element: 'favorites'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '6a41cf2d238f46f2b12149d3e67d37be'
                        key: {
                            name: 'x_1955226_connecto_folder'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '6cfa98c59a4340c699cfe12c54c41751'
                        key: {
                            name: 'x_1955226_connecto_report'
                            element: 'description'
                            language: 'en'
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
                        table: 'sys_documentation'
                        id: '7020efa0dedd4a57848a960f0b5de680'
                        key: {
                            name: 'x_1955226_connecto_report'
                            element: 'chart_value_field'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '71c7039a7fdd4c09a562cc5bb2d713a2'
                        key: {
                            name: 'x_1955226_connecto_connection'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '7471c1fe3d6147cbb247240015ae2878'
                        key: {
                            name: 'x_1955226_connecto_connection'
                            element: 'access_token'
                            language: 'en'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: '75471f8a43d54e238fb4ced23f4af5e1'
                        key: {
                            name: 'x_1955226_connecto_share'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '799d2d70f3a5492aacd0d52d8d4e3980'
                        key: {
                            name: 'x_1955226_connecto_report'
                            element: 'sn_object_name'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '79c027aa27d7410f8af737bb42796f1a'
                        key: {
                            name: 'x_1955226_connecto_share'
                            element: 'item_id'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '7c0995a45ed649b1a809ca1ca8651dbf'
                        key: {
                            sys_security_acl: 'dddf406d336f4bd5a47d84a5d899662f'
                            sys_user_role: {
                                id: '7d8e9fa66a76491fa77bfec7e3dd0046'
                                key: {
                                    name: 'x_1955226_connecto.peeklogic_reports_user'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_user_role'
                        id: '7d8e9fa66a76491fa77bfec7e3dd0046'
                        key: {
                            name: 'x_1955226_connecto.peeklogic_reports_user'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '7f45ce8be9d34430a1872694762a230d'
                        key: {
                            name: 'x_1955226_connecto_folder'
                            element: 'name'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '808e12f0cc4e4e87a36cdf8da82ef51f'
                        key: {
                            name: 'x_1955226_connecto_folder'
                            element: 'shared_with'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '82bfcefceb8448178a0e853312598966'
                        key: {
                            name: 'x_1955226_connecto_report'
                            element: 'chart_group_by'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '848fa9c5688d4bcd84379f40a6b76486'
                        key: {
                            name: 'x_1955226_connecto_report'
                            element: 'shared_with'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '86f878a90abd4a65a6045d3f9754768f'
                        key: {
                            sys_security_acl: 'a4d36559bfa14a2eb6db07d1f8f91f2a'
                            sys_user_role: {
                                id: '7d8e9fa66a76491fa77bfec7e3dd0046'
                                key: {
                                    name: 'x_1955226_connecto.peeklogic_reports_user'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '882c28d0a7fd4675b942795bc90a07ec'
                        key: {
                            name: 'x_1955226_connecto_report'
                            element: 'show_only_with_sf_records'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '884ecb8bd80841898f7a85b4f8ad6952'
                        key: {
                            name: 'x_1955226_connecto_report'
                            element: 'chart_metric'
                            language: 'en'
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
                        table: 'sys_documentation'
                        id: '8b0bd353351e46029d36c4ef9bf8e483'
                        key: {
                            name: 'x_1955226_connecto_folder'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '917e1689201c43c28c35c59fa68b8965'
                        key: {
                            name: 'x_1955226_connecto_connection'
                            element: 'instance_url'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '91bedf854e8c459591dc94dc9d1f6966'
                        key: {
                            name: 'x_1955226_connecto_connection'
                            element: 'access_token'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '92bfb6430b124a36b4c7aa38655f2283'
                        key: {
                            name: 'x_1955226_connecto_user_prefs'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '93b27fc3a1cd4abd827113a54e36ea4f'
                        key: {
                            name: 'x_1955226_connecto_report'
                            element: 'chart_metric'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '94de7455edff46fb85ebffd1d69a88c5'
                        key: {
                            name: 'x_1955226_connecto_report'
                            element: 'columns'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '9637e61033a840b19407430c9e5c4d2c'
                        key: {
                            name: 'x_1955226_connecto_report'
                            element: 'chart_title'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '9695244aeff34bab9e66bb244b4f8078'
                        key: {
                            name: 'x_1955226_connecto_connection'
                            element: 'refresh_token'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '9ab3a542089447f0a063c2c30e66029c'
                        key: {
                            name: 'x_1955226_connecto_report'
                            element: 'chart_group_by'
                        }
                    },
                    {
                        table: 'sys_ui_page'
                        id: '9b5af5dce174498a90e867dfd6a564a8'
                        deleted: true
                        key: {
                            endpoint: 'x_1955226_connecto_incident_manager.do'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '9dc3035d788c4656819d12165796d8da'
                        key: {
                            sys_security_acl: '8b626d74881d41048395b5a77c3e3d4b'
                            sys_user_role: {
                                id: '7d8e9fa66a76491fa77bfec7e3dd0046'
                                key: {
                                    name: 'x_1955226_connecto.peeklogic_reports_user'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '9eb75a4d00324a83b331cfc2ebe8343d'
                        key: {
                            name: 'x_1955226_connecto_report'
                            element: 'folderid'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'a2c7858a5a6f4f30ba7c54e423921d2a'
                        key: {
                            name: 'x_1955226_connecto_connection'
                            element: 'issued_at'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: 'acf863e7fc3641ab84ea77cdd3ddda73'
                        key: {
                            name: 'x_1955226_connecto_user_prefs'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'ad296be92ff8493fa1d053c7ac2f0a87'
                        key: {
                            name: 'x_1955226_connecto_connection'
                            element: 'login_url'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'ae27e35a3ca947ec90545c5c2350e20a'
                        key: {
                            name: 'x_1955226_connecto_connection'
                            element: 'instance_url'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'b0ee0d49e85348b4b6cdbe7122eb4ae3'
                        key: {
                            sys_security_acl: '035c185d60ab46b09f65166175ea5b57'
                            sys_user_role: {
                                id: '7d8e9fa66a76491fa77bfec7e3dd0046'
                                key: {
                                    name: 'x_1955226_connecto.peeklogic_reports_user'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'b2da7bbe22cc4be6a42849f2adee9677'
                        key: {
                            name: 'x_1955226_connecto_report'
                            element: 'filter_conditions'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'b3968500e2fe48dd843aeeb436deb4e7'
                        key: {
                            sys_security_acl: '3daa174e42a44af4aeceb071b74a2437'
                            sys_user_role: {
                                id: '7d8e9fa66a76491fa77bfec7e3dd0046'
                                key: {
                                    name: 'x_1955226_connecto.peeklogic_reports_user'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'b82f03746808492484a107d8f0712cf1'
                        key: {
                            name: 'x_1955226_connecto_folder'
                            element: 'description'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'bda668038e874f218ce013496788c3fe'
                        key: {
                            name: 'x_1955226_connecto_connection'
                            element: 'client_id'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'bfbe88846eb7451ebf1d896733697dea'
                        key: {
                            name: 'x_1955226_connecto_connection'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'c0035052bbc4453986e12079f1c3b961'
                        key: {
                            name: 'x_1955226_connecto_connection'
                            element: 'login_url'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'c0d2919c2f324ac1994ab38e5bc164a7'
                        key: {
                            name: 'x_1955226_connecto_report'
                            element: 'filter_query'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'c0e3fdb09cdb43e7b75e8f792e10d953'
                        key: {
                            name: 'x_1955226_connecto_connection'
                            element: 'user_id'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'c189943bcb0f4d5991025a5bedd93b8f'
                        key: {
                            sys_security_acl: 'e30cf1d6bcb1457cb4e0776adb87ebfe'
                            sys_user_role: {
                                id: '7d8e9fa66a76491fa77bfec7e3dd0046'
                                key: {
                                    name: 'x_1955226_connecto.peeklogic_reports_user'
                                }
                            }
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
                        table: 'sys_documentation'
                        id: 'c3df78ff275e4b2fa1fb825e902724c6'
                        key: {
                            name: 'x_1955226_connecto_share'
                            element: 'user_id'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'c3eba0910ba64292b75e7217ba41edc9'
                        key: {
                            sys_security_acl: 'ec2ded9a7873420eafd084bec5ddd875'
                            sys_user_role: {
                                id: '7d8e9fa66a76491fa77bfec7e3dd0046'
                                key: {
                                    name: 'x_1955226_connecto.peeklogic_reports_user'
                                }
                            }
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: 'c3ef971ac30141899cd47f04921e2b22'
                        key: {
                            name: 'x_1955226_connecto_connection'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'c7542c9ef35a4de9a621a1e76212cc51'
                        key: {
                            sys_security_acl: '194a5f54c92d408aa83cf54535b8ed1a'
                            sys_user_role: {
                                id: '7d8e9fa66a76491fa77bfec7e3dd0046'
                                key: {
                                    name: 'x_1955226_connecto.peeklogic_reports_user'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: 'c7e8a31b100047d9bbe80545e217f5e7'
                        key: {
                            name: 'x_1955226_connecto_report'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'ce4f83589773441fa45b3522091b7bc0'
                        key: {
                            name: 'x_1955226_connecto_report'
                            element: 'show_only_with_sf_records'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'd031a294c60d4818b06888c6df183b3b'
                        key: {
                            sys_security_acl: '0c9c88d09c50469487742f4dedb79f2e'
                            sys_user_role: {
                                id: '7d8e9fa66a76491fa77bfec7e3dd0046'
                                key: {
                                    name: 'x_1955226_connecto.peeklogic_reports_user'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'd077d3f81ea94e3a9a10f514e8efcddf'
                        key: {
                            name: 'x_1955226_connecto_connection'
                            element: 'base_url'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'd0d90f87914c4c0d8b2490eaf5e117a6'
                        key: {
                            name: 'x_1955226_connecto_report'
                            element: 'owner'
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
                        table: 'sys_documentation'
                        id: 'd47f5c7bbef6422f9bb2395367502fe0'
                        key: {
                            name: 'x_1955226_connecto_folder'
                            element: 'shared_with'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'd8da0167092143aea9e6c1491179993d'
                        key: {
                            name: 'x_1955226_connecto_report'
                            element: 'group_by'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'd9bb3c02f7fd42deb2dd06b66cc4fa60'
                        key: {
                            sys_security_acl: 'b0dfc1e21b634f459d089993e488f2dc'
                            sys_user_role: {
                                id: '7d8e9fa66a76491fa77bfec7e3dd0046'
                                key: {
                                    name: 'x_1955226_connecto.peeklogic_reports_user'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'deefe09994ad4ba1bb40d4bc21ebdc67'
                        key: {
                            name: 'x_1955226_connecto_report'
                            element: 'chart_series_by'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: 'df9b500c196949bfbd7636a652a483eb'
                        key: {
                            name: 'x_1955226_connecto_connection'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'dfe838e20dca477e9b7c1602d912323c'
                        key: {
                            sys_security_acl: 'f9d0f6eb423846cb8f5d9564756cf10a'
                            sys_user_role: {
                                id: '7d8e9fa66a76491fa77bfec7e3dd0046'
                                key: {
                                    name: 'x_1955226_connecto.peeklogic_reports_user'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'e00a83fa0fa0487f9957be1f64f92f1e'
                        key: {
                            name: 'x_1955226_connecto_connection'
                            element: 'client_secret'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'e3568077534d4fd1a84cb36261d2723c'
                        key: {
                            sys_security_acl: '96a4e1e38a414791bc8a28dbc9db815d'
                            sys_user_role: {
                                id: '7d8e9fa66a76491fa77bfec7e3dd0046'
                                key: {
                                    name: 'x_1955226_connecto.peeklogic_reports_user'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'e4220ecd74c8404c8a2ff812379fa2ef'
                        key: {
                            name: 'x_1955226_connecto_share'
                            element: 'user_id'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'e42771aeb8124a2d89755c7dde967187'
                        key: {
                            sys_security_acl: '4167acbdbb0742759d66e9717bde9acf'
                            sys_user_role: {
                                id: '7d8e9fa66a76491fa77bfec7e3dd0046'
                                key: {
                                    name: 'x_1955226_connecto.peeklogic_reports_user'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'e498308f8172485c8d59a9c00d443255'
                        key: {
                            name: 'x_1955226_connecto_report'
                            element: 'sf_object_name'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ux_lib_asset'
                        id: 'ec82d4199bc5481e871374d5556bff1a'
                        key: {
                            name: 'x_1955226_connecto/html2canvas'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'ee0aad4c819d4de1954beaa227b78e52'
                        key: {
                            name: 'x_1955226_connecto_report'
                            element: 'chart_type'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'f01015ddd5664ac8a4d9734716397203'
                        key: {
                            name: 'x_1955226_connecto_share'
                            element: 'role'
                            language: 'en'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: 'f2e02863f7c4486e9aefb2b1279f3a12'
                        key: {
                            name: 'x_1955226_connecto_report'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'f4c6d9ffda28498b91054835ae4aa789'
                        key: {
                            name: 'x_1955226_connecto_user_prefs'
                            element: 'favorites'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'f7d1a1d0f8ee4f8e84fe10a82919a284'
                        key: {
                            sys_security_acl: '103d050022af404b905c5708e26d4e42'
                            sys_user_role: {
                                id: '7d8e9fa66a76491fa77bfec7e3dd0046'
                                key: {
                                    name: 'x_1955226_connecto.peeklogic_reports_user'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'fbd32f8255a1459d987645a9039ffde3'
                        key: {
                            name: 'x_1955226_connecto_report'
                            element: 'name'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'fc7c41ee73584b388a01843ca580d43c'
                        key: {
                            name: 'x_1955226_connecto_report'
                            element: 'filter_query'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'ff7d1de0f21043978e3119a31f456107'
                        key: {
                            sys_security_acl: '93e6f341b0e84ffaa6def7826082c9ed'
                            sys_user_role: {
                                id: '7d8e9fa66a76491fa77bfec7e3dd0046'
                                key: {
                                    name: 'x_1955226_connecto.peeklogic_reports_user'
                                }
                            }
                        }
                    },
                ]
            }
        }
    }
}
