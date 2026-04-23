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
                    'node_modules/react-toastify/dist/ReactToastify.css': {
                        table: 'sys_ux_theme_asset'
                        id: '2d6f864251594168b78b901b45275770'
                        deleted: true
                    }
                    package_json: {
                        table: 'sys_module'
                        id: '5844968aa3304b85952d457061751811'
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
                ]
            }
        }
    }
}
