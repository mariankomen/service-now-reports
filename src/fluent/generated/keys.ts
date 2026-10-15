import '@servicenow/sdk/global'

declare global {
    namespace Now {
        namespace Internal {
            interface Keys extends KeysRegistry {
                explicit: {
                    bom_json: {
                        table: 'sys_module'
                        id: '725d24d3c22b4477805d16117801ffc0'
                    }
                    connecto_connection_create_acl: {
                        table: 'sys_security_acl'
                        id: '107c33d9afb740df9b218b12b859d50b'
                    }
                    connecto_connection_delete_acl: {
                        table: 'sys_security_acl'
                        id: '92e3d37a59b94f3dbbb86e14167b7332'
                    }
                    connecto_connection_read_acl: {
                        table: 'sys_security_acl'
                        id: '8264507435d24d07bfdfc4467407ece4'
                    }
                    connecto_connection_write_acl: {
                        table: 'sys_security_acl'
                        id: 'f5d4e9261b2e437c935b02d1c526c0ef'
                    }
                    connecto_folder_create_acl: {
                        table: 'sys_security_acl'
                        id: '616132ff609d47c7b94b1b778a82f4f4'
                    }
                    connecto_folder_delete_acl: {
                        table: 'sys_security_acl'
                        id: 'c31efce055b44dc7901f10c1f81b1a2b'
                    }
                    connecto_folder_read_acl: {
                        table: 'sys_security_acl'
                        id: '95f39d1b4baa4c92ad575389de269296'
                    }
                    connecto_folder_write_acl: {
                        table: 'sys_security_acl'
                        id: 'e48fa12d52264287b797510da2127f99'
                    }
                    connecto_report_create_acl: {
                        table: 'sys_security_acl'
                        id: '5f7962ffeecf4d829d788e33e2720015'
                    }
                    connecto_report_delete_acl: {
                        table: 'sys_security_acl'
                        id: '49fca26f725143a59735220301cf8b46'
                    }
                    connecto_report_read_acl: {
                        table: 'sys_security_acl'
                        id: '606e82c9c4e04c73902386cd08af40ad'
                    }
                    connecto_report_write_acl: {
                        table: 'sys_security_acl'
                        id: 'a7d44067618445639f5836b5c58e9273'
                    }
                    connecto_share_create_acl: {
                        table: 'sys_security_acl'
                        id: 'b2ca64b7a17246848837d44e8015d59a'
                    }
                    connecto_share_delete_acl: {
                        table: 'sys_security_acl'
                        id: '7b3b734ece504c9e82e86bdc0e148931'
                    }
                    connecto_share_read_acl: {
                        table: 'sys_security_acl'
                        id: 'bfd56d043e4047d096a178549148a25d'
                    }
                    connecto_share_write_acl: {
                        table: 'sys_security_acl'
                        id: 'ef5ac1d4ad344fd8aabba7654e8f72e2'
                    }
                    connecto_user_prefs_create_acl: {
                        table: 'sys_security_acl'
                        id: '5173c1c8059246379e3d86687bbc7b08'
                    }
                    connecto_user_prefs_delete_acl: {
                        table: 'sys_security_acl'
                        id: '3c79836b084742bb83562498b4ecbd4c'
                    }
                    connecto_user_prefs_read_acl: {
                        table: 'sys_security_acl'
                        id: 'd36a94eeaebc4250939b4371672b1fce'
                    }
                    connecto_user_prefs_write_acl: {
                        table: 'sys_security_acl'
                        id: '4b0e9e837bef4d77b1d805a1172e04d3'
                    }
                    connector_api: {
                        table: 'sys_ws_definition'
                        id: 'b2503a4989684915a72832624a12fab3'
                    }
                    credentials_get_route: {
                        table: 'sys_ws_operation'
                        id: '0c81918439494d31b80c5542c3321d7e'
                    }
                    credentials_post_route: {
                        table: 'sys_ws_operation'
                        id: 'bdbb9e7d637a406a90ae2b4434e01814'
                    }
                    credentials_validate_post_route: {
                        table: 'sys_ws_operation'
                        id: '92a0b02ef151475cb79cd6ad12aeef9b'
                    }
                    folder_all_get_route: {
                        table: 'sys_ws_operation'
                        id: '68ddf69d311445eba0de07ed26ee58d8'
                    }
                    folder_delete_route: {
                        table: 'sys_ws_operation'
                        id: '922c2803297c4af8a983610772673720'
                    }
                    folder_post_route: {
                        table: 'sys_ws_operation'
                        id: 'edb84f27d8a5464a9d1fcff8f97f3b0b'
                    }
                    folder_put_route: {
                        table: 'sys_ws_operation'
                        id: 'cbd907c53d4f4104b0e2e896fa806eeb'
                    }
                    folders_filter_get_route: {
                        table: 'sys_ws_operation'
                        id: '13b2decc85804e879e8f1a216a305fa3'
                    }
                    package_json: {
                        table: 'sys_module'
                        id: 'e7394b88a49b493fbb0e4a7fe36f647f'
                    }
                    report_builder_endpoint_ui_page_execute_acl: {
                        table: 'sys_security_acl'
                        id: '028d4bdefd1d43bea2b415aa1efa0b65'
                    }
                    report_builder_endpoint_ui_page_read_acl: {
                        table: 'sys_security_acl'
                        id: '0abbedc1134640c1b4dea4630bbc7293'
                    }
                    report_builder_ui_page_execute_acl: {
                        table: 'sys_security_acl'
                        id: '5138d5f7c01945ed9be92d5341edb58f'
                    }
                    report_builder_ui_page_read_acl: {
                        table: 'sys_security_acl'
                        id: 'd79ccf70f8884f44933626afa3c5f1a8'
                    }
                    report_data_get_route: {
                        table: 'sys_ws_operation'
                        id: '0df28aa627194066bb5daec2a0a5d1a4'
                    }
                    report_delete_route: {
                        table: 'sys_ws_operation'
                        id: 'b9ed3640c4fd482d8630dd2d2fa1d8ac'
                    }
                    report_get_route: {
                        table: 'sys_ws_operation'
                        id: 'a9730baa90024b378d04e38ba97ed78b'
                    }
                    report_post_route: {
                        table: 'sys_ws_operation'
                        id: '0c3eb03043c74e4e80a87453e8cf7d4b'
                    }
                    report_put_route: {
                        table: 'sys_ws_operation'
                        id: 'c36b62aede2b4614aaa95b0c0f3cd95c'
                    }
                    reports_get_route: {
                        table: 'sys_ws_operation'
                        id: '7706f10072de44fdbf04fb2016bd0564'
                    }
                    salesforce_auth_service_script_include: {
                        table: 'sys_script_include'
                        id: 'b350d342cfc649e5981f837ae3e3d6ed'
                    }
                    salesforce_describe_get_route: {
                        table: 'sys_ws_operation'
                        id: 'f9bab4d37af84619851417aaa547f023'
                    }
                    salesforce_integration_rest_endpoint_acl: {
                        table: 'sys_security_acl'
                        id: '673868d06ea94f5cafb75d97b38f094b'
                    }
                    salesforce_record_service_script_include: {
                        table: 'sys_script_include'
                        id: '0548aeb229d04c7e81a203d2ca826308'
                    }
                    servicenow_reference_search_get_route: {
                        table: 'sys_ws_operation'
                        id: '5a3cf719b34a41cbbe4726a33ba05d70'
                    }
                    servicenow_tables_get_route: {
                        table: 'sys_ws_operation'
                        id: '97c5b35673234547a3e99db23572067c'
                    }
                    sf_fields_get_route: {
                        table: 'sys_ws_operation'
                        id: 'ab294968dce94589837cec345d9024b1'
                    }
                    sf_reference_search_get_route: {
                        table: 'sys_ws_operation'
                        id: '6f6d5887d146438bad864ec6018c3a11'
                    }
                    share_delete_route: {
                        table: 'sys_ws_operation'
                        id: 'cb9a8e8da026478ab629d9cbc9f1edfc'
                    }
                    share_get_route: {
                        table: 'sys_ws_operation'
                        id: 'd1bead8d1e8d48e5a3610211a139af67'
                    }
                    share_post_route: {
                        table: 'sys_ws_operation'
                        id: '688216f6d10a4643ba2f6422e6c6c851'
                    }
                    share_put_route: {
                        table: 'sys_ws_operation'
                        id: 'f51ac1ea1e5d420392df0dc004b39836'
                    }
                    sharing_service_script_include: {
                        table: 'sys_script_include'
                        id: '12d12bcbeebe46e98beb8e3bf74bd2a9'
                    }
                    sidebar_counts_get_route: {
                        table: 'sys_ws_operation'
                        id: '40467b9d79754343b6ee88711903b35f'
                    }
                    'src_server_auth-credentials-post_js': {
                        table: 'sys_module'
                        id: '31d8d2686f0e476a887e95d9438a7704'
                    }
                    'src_server_auth-credentials-validate-post_js': {
                        table: 'sys_module'
                        id: 'bf5db4ac2de4452587452ff0888dc1d9'
                    }
                    'src_server_credentials-get_js': {
                        table: 'sys_module'
                        id: 'a3690c8aad6440e48a2496c11ebbbf4c'
                    }
                    'src_server_favorites-get_js': {
                        table: 'sys_module'
                        id: '2849f34994af4c90a53f8336ce465234'
                    }
                    'src_server_favorites-post_js': {
                        table: 'sys_module'
                        id: '92bb698eeef648f69afc32147b0baa35'
                    }
                    'src_server_favorites-remove-post_js': {
                        table: 'sys_module'
                        id: 'cad3ee1adb054eae8023580bcad1e1b9'
                    }
                    'src_server_folder-delete_js': {
                        table: 'sys_module'
                        id: '0d944906190e4e64bf55ca5bd95015b4'
                    }
                    'src_server_folder-get_js': {
                        table: 'sys_module'
                        id: '520b94f8159d42968fb4e31bad4967e7'
                    }
                    'src_server_folder-post_js': {
                        table: 'sys_module'
                        id: 'ee755333072c4ec59b5486ab5c9b7bc3'
                    }
                    'src_server_folder-put_js': {
                        table: 'sys_module'
                        id: '48ef4381acc4452e995cf0bb6412e46b'
                    }
                    'src_server_folders-get-all-get_js': {
                        table: 'sys_module'
                        id: '4e8244dabd334ee78fe38544c06c8f11'
                    }
                    'src_server_report-data-post_js': {
                        table: 'sys_module'
                        id: '22c46ee389724ae8b063828bfd855e45'
                    }
                    'src_server_report-delete_js': {
                        table: 'sys_module'
                        id: '2b21ef91022242b781675fbf12f72cb0'
                    }
                    'src_server_report-get_js': {
                        table: 'sys_module'
                        id: 'a57492e0c4d943ef82a12d75e9decfc4'
                    }
                    'src_server_report-post_js': {
                        table: 'sys_module'
                        id: '721ef548e37e4065b5486feac75e2d73'
                    }
                    'src_server_report-put_js': {
                        table: 'sys_module'
                        id: '1993c136d3fe4970813d920f124072ca'
                    }
                    'src_server_reports-get_js': {
                        table: 'sys_module'
                        id: '37359ba30d8f424590f3d356cfff34ca'
                    }
                    'src_server_salesforce-object-details-get_js': {
                        table: 'sys_module'
                        id: '8cf05d033a3e4ac98b781a326118554d'
                    }
                    'src_server_salesforce-object-fields-get_js': {
                        table: 'sys_module'
                        id: '982071421aa04915b1c3c6106692b769'
                    }
                    'src_server_salesforce-reference-search-get_js': {
                        table: 'sys_module'
                        id: '776d9883a05243b887100a80d6b8c33c'
                    }
                    'src_server_service-now-tables-get_js': {
                        table: 'sys_module'
                        id: 'fc6f5dede0ca43129ec82b74a2b6d88d'
                    }
                    'src_server_servicenow-reference-search-get_js': {
                        table: 'sys_module'
                        id: '45725b39888642768c99e32048708493'
                    }
                    'src_server_services_access-service_js': {
                        table: 'sys_module'
                        id: 'eb8fd117d13c4bd5888625998bf0b6b2'
                    }
                    'src_server_services_salesforce-auth-service_js': {
                        table: 'sys_module'
                        id: 'adea49bd00b443bea48ce6d7e07fcb93'
                    }
                    'src_server_services_salesforce-records-service_js': {
                        table: 'sys_module'
                        id: '273e76c383d54161bbbbd5982b346445'
                    }
                    'src_server_share-delete_js': {
                        table: 'sys_module'
                        id: '455b8d2a1e7047d6820bd75ba0fd2e4d'
                    }
                    'src_server_share-get_js': {
                        table: 'sys_module'
                        id: 'c0d0c35c08bd4ac9b71c42492d5ed226'
                    }
                    'src_server_share-post_js': {
                        table: 'sys_module'
                        id: '4e820e5ba4a74294bcd3248f0d0586d6'
                    }
                    'src_server_share-put_js': {
                        table: 'sys_module'
                        id: '289bd682a32e4b238e0938ca089bba4a'
                    }
                    'src_server_sidebar-counts-get_js': {
                        table: 'sys_module'
                        id: 'f3a06240e19b467082a8d0380ef6c763'
                    }
                    'src_server_users-search-get_js': {
                        table: 'sys_module'
                        id: '4e61c081f1f9464db57b2fb6cbddf094'
                    }
                    user_prefs_get_route: {
                        table: 'sys_ws_operation'
                        id: '8f9cd7dbdba24239a182387e49c740e7'
                    }
                    user_prefs_post_route: {
                        table: 'sys_ws_operation'
                        id: '0afbe8b81f84463c8acc9944aa57cd48'
                    }
                    user_prefs_remove_route: {
                        table: 'sys_ws_operation'
                        id: '995431c3d0224defb99930a5024ef62c'
                    }
                    users_search_get_route: {
                        table: 'sys_ws_operation'
                        id: 'f2faa9b4409a443187bd9fa7afbf4536'
                    }
                    x_peekl_snreports_app_connect: {
                        table: 'sys_app_module'
                        id: '850fd45b9f2f4b129213876bbb02e6a7'
                    }
                    x_peekl_snreports_app_menu: {
                        table: 'sys_app_application'
                        id: '3f05c43a9ee242aca7595ac349945b69'
                    }
                    x_peekl_snreports_app_module: {
                        table: 'sys_app_module'
                        id: 'ae719162c2664e14bb9bc292c125de64'
                    }
                    x_peekl_snreports_privacy_module: {
                        table: 'sys_app_module'
                        id: '137d8db7de474db49263d3d018122b88'
                    }
                    x_peekl_snreports_support_module: {
                        table: 'sys_app_module'
                        id: 'd9647dfd00cc474cb84353085432e558'
                    }
                }
                composite: [
                    {
                        table: 'sys_documentation'
                        id: '0150fdf91db840ee9c0ed2f6b282dff1'
                        key: {
                            name: 'x_peekl_snreports_user_prefs'
                            element: 'favorites'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ux_lib_asset'
                        id: '02318e1789c145f59e292bc76577a564'
                        key: {
                            name: 'x_peekl_snreports/main.js.map'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '0360bdd82e53419390b71fc33fa607b9'
                        key: {
                            name: 'x_peekl_snreports_folder'
                            element: 'name'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '041115718ecb4c4ab0050aa7b77250ec'
                        key: {
                            name: 'x_peekl_snreports_report'
                            element: 'chart_value_field'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '0b5ca5945d0a4c84a30e78c06d5a6ebd'
                        key: {
                            name: 'x_peekl_snreports_connection'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '0bf90c4f5fa6441c8416d0ba1daa8b51'
                        key: {
                            sys_security_acl: '5138d5f7c01945ed9be92d5341edb58f'
                            sys_user_role: {
                                id: '52a3bf6c0bb84cc09455a6b2875ac1ad'
                                key: {
                                    name: 'x_peekl_snreports.peeklogic_reports_user'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '0c2fa742764c483388d752bcf387ef09'
                        key: {
                            sys_security_acl: 'f5d4e9261b2e437c935b02d1c526c0ef'
                            sys_user_role: {
                                id: '52a3bf6c0bb84cc09455a6b2875ac1ad'
                                key: {
                                    name: 'x_peekl_snreports.peeklogic_reports_user'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '0cc249e60fee447fbc3c75a152ba82d8'
                        key: {
                            name: 'x_peekl_snreports_connection'
                            element: 'refresh_token'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '0e5c1705291949689af96e7850a37e03'
                        key: {
                            name: 'x_peekl_snreports_connection'
                            element: 'login_url'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '1014c389bb174538bae772622136d658'
                        key: {
                            name: 'x_peekl_snreports_user_prefs'
                            element: 'user_id'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '11246c9e7b3046a7b900f346fbbe86b2'
                        key: {
                            name: 'x_peekl_snreports_folder'
                            element: 'parent_folder_id'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '126d2896ff47405b9b0dbf329b736aa6'
                        key: {
                            name: 'x_peekl_snreports_connection'
                            element: 'user_id'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '14255e02185f44b0983e1a4df040f35e'
                        key: {
                            name: 'x_peekl_snreports_report'
                            element: 'show_only_with_sf_records'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '149a2c64d375463b8c53133720ecb8e3'
                        key: {
                            name: 'x_peekl_snreports_report'
                            element: 'name'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '170f31d3028340a7ab3f1a3864a91461'
                        key: {
                            name: 'x_peekl_snreports_report'
                            element: 'filter_query'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '18041c1fd349474c9d8f00c8174e1cad'
                        key: {
                            name: 'x_peekl_snreports_report'
                            element: 'sn_object_name'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '1a8a0f86af894e76a1bbf92f0ccbca5a'
                        key: {
                            name: 'x_peekl_snreports_folder'
                            element: 'description'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '1b7d12976b1d494f96d598e3f1ca6d02'
                        key: {
                            name: 'x_peekl_snreports_report'
                            element: 'chart_value_field'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '1b8e44c9f7f44d84968a129d4a293ad7'
                        key: {
                            name: 'x_peekl_snreports_connection'
                            element: 'login_url'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '1d37ab7ff6a9485caa5b7d34af961827'
                        key: {
                            name: 'x_peekl_snreports_connection'
                            element: 'user_id'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ux_lib_asset'
                        id: '1d43833946f844bd8f69ca75f2cbabfb'
                        key: {
                            name: 'x_peekl_snreports/index.es'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '1dd1e9a3fdd04362b2e8d3a79013c485'
                        key: {
                            name: 'x_peekl_snreports_share'
                            element: 'item_type'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '21a81bc687d949fdb05f00ee6a2effda'
                        key: {
                            name: 'x_peekl_snreports_share'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '23c257a830c4451685a3f36d84abd294'
                        key: {
                            sys_security_acl: '4b0e9e837bef4d77b1d805a1172e04d3'
                            sys_user_role: {
                                id: '52a3bf6c0bb84cc09455a6b2875ac1ad'
                                key: {
                                    name: 'x_peekl_snreports.peeklogic_reports_user'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '240a20309e124dee9bf52d023ca46786'
                        key: {
                            name: 'x_peekl_snreports_report'
                            element: 'columns'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '254010de0a944a258bd2b8655d116b23'
                        key: {
                            name: 'x_peekl_snreports_report'
                            element: 'is_public'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '2687d96704334e2aad0edc6b633afeeb'
                        key: {
                            sys_security_acl: 'c31efce055b44dc7901f10c1f81b1a2b'
                            sys_user_role: {
                                id: '52a3bf6c0bb84cc09455a6b2875ac1ad'
                                key: {
                                    name: 'x_peekl_snreports.peeklogic_reports_user'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '286fc535a5a247a2bd47b538a5985c06'
                        key: {
                            sys_security_acl: '95f39d1b4baa4c92ad575389de269296'
                            sys_user_role: {
                                id: '52a3bf6c0bb84cc09455a6b2875ac1ad'
                                key: {
                                    name: 'x_peekl_snreports.peeklogic_reports_user'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '286ff3ebabb548beb4354fef2093e029'
                        key: {
                            name: 'x_peekl_snreports_report'
                            element: 'owner'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '2b0f105c15cb41999171f136b8481d1b'
                        key: {
                            name: 'x_peekl_snreports_report'
                            element: 'chart_group_by'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ux_lib_asset'
                        id: '2bdc9a8b31de41d2b197a65ca6d0a59f'
                        key: {
                            name: 'x_peekl_snreports/purify.es'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '2d6bf8a3592a4118a4d81a224a34ff47'
                        key: {
                            name: 'x_peekl_snreports_folder'
                            element: 'is_public'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '2fd248c83b49434c9cb5fc55505b19ac'
                        key: {
                            name: 'x_peekl_snreports_report'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '3025f643bf214b67b8beab79fcc149a8'
                        key: {
                            sys_security_acl: '616132ff609d47c7b94b1b778a82f4f4'
                            sys_user_role: {
                                id: '52a3bf6c0bb84cc09455a6b2875ac1ad'
                                key: {
                                    name: 'x_peekl_snreports.peeklogic_reports_user'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '33db76c8ed454ff2ae772a818ce12e55'
                        key: {
                            name: 'x_peekl_snreports_report'
                            element: 'show_chart'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '366bc737d216452db2692250b3628696'
                        key: {
                            sys_security_acl: '5173c1c8059246379e3d86687bbc7b08'
                            sys_user_role: {
                                id: '52a3bf6c0bb84cc09455a6b2875ac1ad'
                                key: {
                                    name: 'x_peekl_snreports.peeklogic_reports_user'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '3ab19644e8964b6ca81f8456e21365c1'
                        key: {
                            name: 'x_peekl_snreports_report'
                            element: 'sn_object_name'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '3d40c83e8c954a1691b5308537557535'
                        key: {
                            name: 'x_peekl_snreports_report'
                            element: 'folderid'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '3e0545d8599b4a2786a74d01102177a7'
                        key: {
                            name: 'x_peekl_snreports_folder'
                            element: 'is_public'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '41e5982b702c4805a598e2cb5dd5fec2'
                        key: {
                            sys_security_acl: 'ef5ac1d4ad344fd8aabba7654e8f72e2'
                            sys_user_role: {
                                id: '52a3bf6c0bb84cc09455a6b2875ac1ad'
                                key: {
                                    name: 'x_peekl_snreports.peeklogic_reports_user'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '42133b849f8c4fbab5a04da4e28adfd1'
                        key: {
                            sys_security_acl: '606e82c9c4e04c73902386cd08af40ad'
                            sys_user_role: {
                                id: '52a3bf6c0bb84cc09455a6b2875ac1ad'
                                key: {
                                    name: 'x_peekl_snreports.peeklogic_reports_user'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '42166c4a627f4beab2dcf1faa1685e19'
                        key: {
                            name: 'x_peekl_snreports_folder'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '42f5519d3d2e45fba69a2ce33ed61e8b'
                        key: {
                            name: 'x_peekl_snreports_report'
                            element: 'sf_object_name'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '4371dc882483488a8af0c89aca048ed1'
                        key: {
                            name: 'x_peekl_snreports_report'
                            element: 'group_by'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '44d588d46674460a9e41addc7601c0c8'
                        key: {
                            name: 'x_peekl_snreports_connection'
                            element: 'refresh_token'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '4b47e5fd4d844abbab048dec4652fb3b'
                        key: {
                            name: 'x_peekl_snreports_connection'
                            element: 'access_token'
                        }
                    },
                    {
                        table: 'sys_ux_lib_asset'
                        id: '4c97262178cd43b3963218f576c60fc3'
                        key: {
                            name: 'x_peekl_snreports/index.es.js.map'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '5295642130ae4cd989dd822d73749896'
                        key: {
                            name: 'x_peekl_snreports_report'
                            element: 'filter_conditions'
                        }
                    },
                    {
                        table: 'sys_user_role'
                        id: '52a3bf6c0bb84cc09455a6b2875ac1ad'
                        key: {
                            name: 'x_peekl_snreports.peeklogic_reports_user'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '52b76667d4ff4e81926de82a7c3b9b05'
                        key: {
                            name: 'x_peekl_snreports_folder'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '556f25a38d27476880dff4b1eba2f5b1'
                        key: {
                            name: 'x_peekl_snreports_report'
                            element: 'group_by'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '57364255cab84edc99fc8f784808be25'
                        key: {
                            name: 'x_peekl_snreports_report'
                            element: 'description'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: '597be01bf33b43cc871162a787a4e7cd'
                        key: {
                            name: 'x_peekl_snreports_folder'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '5d24c599b9784192a91d532d53966c9d'
                        key: {
                            sys_security_acl: '3c79836b084742bb83562498b4ecbd4c'
                            sys_user_role: {
                                id: '52a3bf6c0bb84cc09455a6b2875ac1ad'
                                key: {
                                    name: 'x_peekl_snreports.peeklogic_reports_user'
                                }
                            }
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: '5f66edb019c2459db1e3185684a679cb'
                        key: {
                            name: 'x_peekl_snreports_share'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '63f225bd9a2c411e973ee4a0f59a3ed6'
                        key: {
                            name: 'x_peekl_snreports_share'
                            element: 'role'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '647b8b967aaa4bd999dc1c4b465e9107'
                        key: {
                            name: 'x_peekl_snreports_connection'
                            element: 'base_url'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '64868e4c9fa64f029d66cd8979e96561'
                        key: {
                            name: 'x_peekl_snreports_connection'
                            element: 'instance_url'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '649fe2c48e004314ac1e399e1e75c4a9'
                        key: {
                            sys_security_acl: 'a7d44067618445639f5836b5c58e9273'
                            sys_user_role: {
                                id: '52a3bf6c0bb84cc09455a6b2875ac1ad'
                                key: {
                                    name: 'x_peekl_snreports.peeklogic_reports_user'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '6630c4debf824fadb648e95085390806'
                        key: {
                            name: 'x_peekl_snreports_user_prefs'
                            element: 'user_id'
                            language: 'en'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: '6b0dd8885d9645bd921764db03085f71'
                        key: {
                            name: 'x_peekl_snreports_connection'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '6b8b3f6e6dbf43a1be448d859c460e44'
                        key: {
                            name: 'x_peekl_snreports_connection'
                            element: 'issued_at'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '6d1cb6b6ad7f4d41bee7b670d950b64b'
                        key: {
                            sys_security_acl: '0abbedc1134640c1b4dea4630bbc7293'
                            sys_user_role: {
                                id: '52a3bf6c0bb84cc09455a6b2875ac1ad'
                                key: {
                                    name: 'x_peekl_snreports.peeklogic_reports_user'
                                }
                            }
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: '73aa0a99919643b2bc68089cdf7c45a9'
                        key: {
                            name: 'x_peekl_snreports_folder'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '7548308c769346499c505f68f6ead89b'
                        key: {
                            name: 'x_peekl_snreports_connection'
                            element: 'issued_at'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '75fc2b19ef564c24b3d8128b48c77195'
                        key: {
                            sys_security_acl: 'b2ca64b7a17246848837d44e8015d59a'
                            sys_user_role: {
                                id: '52a3bf6c0bb84cc09455a6b2875ac1ad'
                                key: {
                                    name: 'x_peekl_snreports.peeklogic_reports_user'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '77589dda73bf46e7ba2883eb581ae001'
                        key: {
                            name: 'x_peekl_snreports_connection'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '7774e8efec15497f96d9c27fd1582058'
                        key: {
                            name: 'x_peekl_snreports_share'
                            element: 'item_id'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '799fa8cb0e874c769b36c7ecaf524b2e'
                        key: {
                            sys_security_acl: '5f7962ffeecf4d829d788e33e2720015'
                            sys_user_role: {
                                id: '52a3bf6c0bb84cc09455a6b2875ac1ad'
                                key: {
                                    name: 'x_peekl_snreports.peeklogic_reports_user'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_ux_lib_asset'
                        id: '7a0c11c303b5454d95e8af65259e1a27'
                        key: {
                            name: 'x_peekl_snreports/html2canvas.js.map'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: '7bfaede042ca4d4c95d484be1daf89ca'
                        key: {
                            name: 'x_peekl_snreports_share'
                        }
                    },
                    {
                        table: 'sys_ux_lib_asset'
                        id: '7cfd607011e742bc88b7e102233de588'
                        key: {
                            name: 'x_peekl_snreports/html2canvas'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '7f0f22da56784b9baee3a9fa080ec30d'
                        key: {
                            name: 'x_peekl_snreports_share'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '7f32b59088724a908225113e953d2ea5'
                        key: {
                            sys_security_acl: '7b3b734ece504c9e82e86bdc0e148931'
                            sys_user_role: {
                                id: '52a3bf6c0bb84cc09455a6b2875ac1ad'
                                key: {
                                    name: 'x_peekl_snreports.peeklogic_reports_user'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '7fe356a8f2144ea18f9b08ba0290ae8f'
                        key: {
                            sys_security_acl: 'd79ccf70f8884f44933626afa3c5f1a8'
                            sys_user_role: {
                                id: '52a3bf6c0bb84cc09455a6b2875ac1ad'
                                key: {
                                    name: 'x_peekl_snreports.peeklogic_reports_user'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '822bfc003412470ba4a50a60e15836f6'
                        key: {
                            sys_security_acl: '673868d06ea94f5cafb75d97b38f094b'
                            sys_user_role: {
                                id: '52a3bf6c0bb84cc09455a6b2875ac1ad'
                                key: {
                                    name: 'x_peekl_snreports.peeklogic_reports_user'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '846ec163b13548618d3b37b32b7c287b'
                        key: {
                            name: 'x_peekl_snreports_share'
                            element: 'item_type'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '84e277e5c00a4a6cba8ee988542ea15d'
                        key: {
                            name: 'x_peekl_snreports_share'
                            element: 'item_id'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '853831c1411846db9e5c86a7f324e31d'
                        key: {
                            name: 'x_peekl_snreports_folder'
                            element: 'description'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '8cc8dcb3e98d41d7bc5125314eb06e32'
                        key: {
                            name: 'x_peekl_snreports_report'
                            element: 'chart_metric'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '8d6844d153c84e80a55ad84606f3fcbe'
                        key: {
                            name: 'x_peekl_snreports_report'
                            element: 'filter_logic'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '8dbf855f2ec844f0aff2f2897ceb17d7'
                        key: {
                            name: 'x_peekl_snreports_folder'
                            element: 'name'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '9183fb0d63414f54a296af957b406f71'
                        key: {
                            sys_security_acl: '028d4bdefd1d43bea2b415aa1efa0b65'
                            sys_user_role: {
                                id: '52a3bf6c0bb84cc09455a6b2875ac1ad'
                                key: {
                                    name: 'x_peekl_snreports.peeklogic_reports_user'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '92bfcdc7fb2c49fd8f82c0a060e32b6b'
                        key: {
                            sys_security_acl: '92e3d37a59b94f3dbbb86e14167b7332'
                            sys_user_role: {
                                id: '52a3bf6c0bb84cc09455a6b2875ac1ad'
                                key: {
                                    name: 'x_peekl_snreports.peeklogic_reports_user'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '94d95cad604c4fbc8306d7864de0c97b'
                        key: {
                            name: 'x_peekl_snreports_report'
                            element: 'chart_series_by'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '9620c32085784f43adb873ea9c66d474'
                        key: {
                            name: 'x_peekl_snreports_folder'
                            element: 'owner'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: '9791fede760e4947ac0cd745f279d909'
                        key: {
                            name: 'x_peekl_snreports_connection'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '9821dab59bbe4c33ae569b6ede6d06f7'
                        key: {
                            name: 'x_peekl_snreports_report'
                            element: 'description'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '988c923c23ef436a98536b0d5b97d2a0'
                        key: {
                            name: 'x_peekl_snreports_report'
                            element: 'owner'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '999c89eda4564856ba7bd5a71b5270d9'
                        key: {
                            sys_security_acl: 'e48fa12d52264287b797510da2127f99'
                            sys_user_role: {
                                id: '52a3bf6c0bb84cc09455a6b2875ac1ad'
                                key: {
                                    name: 'x_peekl_snreports.peeklogic_reports_user'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '9c029aa857ba423ca16cbe9e64ee8eaa'
                        key: {
                            name: 'x_peekl_snreports_connection'
                            element: 'client_secret'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '9e44641b18fc46c1b3efc4a71eaa13a1'
                        key: {
                            sys_security_acl: '107c33d9afb740df9b218b12b859d50b'
                            sys_user_role: {
                                id: '52a3bf6c0bb84cc09455a6b2875ac1ad'
                                key: {
                                    name: 'x_peekl_snreports.peeklogic_reports_user'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '9e626cea3eee4d7b9349d62c71bd7af3'
                        key: {
                            name: 'x_peekl_snreports_report'
                            element: 'filter_logic'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: 'a5bfe33d74e849828feabdd11faff20c'
                        key: {
                            name: 'x_peekl_snreports_report'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'abe4b9e0182e4f82bc33ad5edb5999e2'
                        key: {
                            name: 'x_peekl_snreports_folder'
                            element: 'shared_with'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'b06371ff36b34b75a24a69bc419babb9'
                        key: {
                            name: 'x_peekl_snreports_report'
                            element: 'shared_with'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'b0b67c2e430e402e91a7167f5e6d9d77'
                        key: {
                            name: 'x_peekl_snreports_report'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: 'b19173ae55f24e66b6a91566b7e8f000'
                        key: {
                            name: 'x_peekl_snreports_user_prefs'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'b3405aee254e493e813d67cd0c17afa6'
                        key: {
                            name: 'x_peekl_snreports_share'
                            element: 'role'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'b3f8e883310a4deb8ac958bef1f0682d'
                        key: {
                            name: 'x_peekl_snreports_user_prefs'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'b9dcb08403aa447cb2cc84eb6853d86b'
                        key: {
                            name: 'x_peekl_snreports_report'
                            element: 'chart_title'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'be65af9548804ce7988e1022971f7576'
                        key: {
                            name: 'x_peekl_snreports_report'
                            element: 'chart_series_by'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'c608b5e0fc3c44c6ab37dc3b811a0898'
                        key: {
                            name: 'x_peekl_snreports_report'
                            element: 'sf_object_name'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'c6917cdb83db4e7ca8bcc5da53c90816'
                        key: {
                            sys_security_acl: '8264507435d24d07bfdfc4467407ece4'
                            sys_user_role: {
                                id: '52a3bf6c0bb84cc09455a6b2875ac1ad'
                                key: {
                                    name: 'x_peekl_snreports.peeklogic_reports_user'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'c6fe2c14500e4c7aa1721e462a86eec6'
                        key: {
                            name: 'x_peekl_snreports_report'
                            element: 'is_public'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'c8e7acc2cc824dcbb5157dad5da89e36'
                        key: {
                            name: 'x_peekl_snreports_connection'
                            element: 'client_id'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'c905ce3f85dc4b76a1ee0e374b879b88'
                        key: {
                            sys_security_acl: 'd36a94eeaebc4250939b4371672b1fce'
                            sys_user_role: {
                                id: '52a3bf6c0bb84cc09455a6b2875ac1ad'
                                key: {
                                    name: 'x_peekl_snreports.peeklogic_reports_user'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'cb4e7a86dd4d4d128edaa57d8d581660'
                        key: {
                            name: 'x_peekl_snreports_report'
                            element: 'chart_title'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'cb9d36259a424305bd0125dbd4464cb8'
                        key: {
                            name: 'x_peekl_snreports_report'
                            element: 'name'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'cc6500edb9c64561bfff95c372fa0407'
                        key: {
                            name: 'x_peekl_snreports_share'
                            element: 'user_id'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: 'cceac2e93fad40eb9d02191c263fe8fb'
                        key: {
                            name: 'x_peekl_snreports_user_prefs'
                        }
                    },
                    {
                        table: 'sys_ux_lib_asset'
                        id: 'cdfed253b2cb4b62be3c210e327038c8'
                        key: {
                            name: 'x_peekl_snreports/main'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: 'ce7525bb70ac479abb70c92792119d6a'
                        key: {
                            name: 'x_peekl_snreports_report'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'cfd1632a76ea437da80c07f6dd5b6264'
                        key: {
                            name: 'x_peekl_snreports_connection'
                            element: 'client_id'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'd03a1f2949c74f4986d4664831c2119c'
                        key: {
                            name: 'x_peekl_snreports_report'
                            element: 'shared_with'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'd3b2a827cc5e4cb08480df9c6ea7f59c'
                        key: {
                            name: 'x_peekl_snreports_connection'
                            element: 'base_url'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'd43786ee95f9409790aa1651dd7b8587'
                        key: {
                            name: 'x_peekl_snreports_user_prefs'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'd5b1cb894d434addb3673278245d8ca7'
                        key: {
                            name: 'x_peekl_snreports_report'
                            element: 'chart_group_by'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'd7cafe3fad3b495d8b16c0c81f9e64f5'
                        key: {
                            name: 'x_peekl_snreports_folder'
                            element: 'shared_with'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'd7d2196a09d8482d8f428fdcb8531d52'
                        key: {
                            name: 'x_peekl_snreports_report'
                            element: 'chart_metric'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'db502fc3542346bb9a0b9694b4f7379e'
                        key: {
                            name: 'x_peekl_snreports_report'
                            element: 'chart_type'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'db8304b95ab54734875d53cd2584cc3f'
                        key: {
                            name: 'x_peekl_snreports_user_prefs'
                            element: 'favorites'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'dc449fc1bf7b4e5da27cc37425438750'
                        key: {
                            name: 'x_peekl_snreports_folder'
                            element: 'owner'
                        }
                    },
                    {
                        table: 'sys_ui_page'
                        id: 'dd358d1f7b6a4d00aa064bac2b9e9263'
                        key: {
                            endpoint: 'x_peekl_snreports_report_builder.do'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'dd67523f2cad418ab87281bec9f636ae'
                        key: {
                            sys_security_acl: 'bfd56d043e4047d096a178549148a25d'
                            sys_user_role: {
                                id: '52a3bf6c0bb84cc09455a6b2875ac1ad'
                                key: {
                                    name: 'x_peekl_snreports.peeklogic_reports_user'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_ux_lib_asset'
                        id: 'e0d5f368367146028799111bbc0d8c0d'
                        key: {
                            name: 'x_peekl_snreports/purify.es.js.map'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'e30d81d89df04effac3aecb4bd5ceae5'
                        key: {
                            name: 'x_peekl_snreports_report'
                            element: 'filter_query'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'e5b5993ddb9e41bfa582c0ab955bac54'
                        key: {
                            name: 'x_peekl_snreports_report'
                            element: 'columns'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'e7075dfd514f4b099d8c429b8cb9b80a'
                        key: {
                            name: 'x_peekl_snreports_connection'
                            element: 'instance_url'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'e8a49a24bd1c4437a62ebe2561e96608'
                        key: {
                            name: 'x_peekl_snreports_folder'
                            element: 'parent_folder_id'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'ecbd00ed29be44a4965dbef855cae994'
                        key: {
                            name: 'x_peekl_snreports_share'
                            element: 'user_id'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'ed7f24ce305a4fbaa428dca64edbb9ad'
                        key: {
                            name: 'x_peekl_snreports_report'
                            element: 'filter_conditions'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'edbb8eb805f14740bab806e68f4683de'
                        key: {
                            sys_security_acl: '49fca26f725143a59735220301cf8b46'
                            sys_user_role: {
                                id: '52a3bf6c0bb84cc09455a6b2875ac1ad'
                                key: {
                                    name: 'x_peekl_snreports.peeklogic_reports_user'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'ede9df3d1552426493201597fa76552f'
                        key: {
                            name: 'x_peekl_snreports_report'
                            element: 'show_only_with_sf_records'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'f0ba41b0e7e04a4f81004ed0e3f02972'
                        key: {
                            name: 'x_peekl_snreports_report'
                            element: 'show_chart'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'f0eefab9befd4508bd106c3fec9dbde8'
                        key: {
                            name: 'x_peekl_snreports_connection'
                            element: 'client_secret'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'f1a37ceeb24f406d9163b850902f1af9'
                        key: {
                            name: 'x_peekl_snreports_report'
                            element: 'chart_type'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'f3027a286106481a86e82709ace4a462'
                        key: {
                            name: 'x_peekl_snreports_connection'
                            element: 'access_token'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'fe6368596fab4ebe826901a373a0d057'
                        key: {
                            name: 'x_peekl_snreports_report'
                            element: 'folderid'
                        }
                    },
                ]
            }
        }
    }
}
