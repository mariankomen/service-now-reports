(function process(request, response) {
    try {
        var excludePrefixes = [
            'sys_', 'v_', 'cmn_', 'sn_', 'ua_', 'oa_', 'sc_cat_',
            'wf_', 'pa_', 'ml_', 'lx_', 'sa_', 'svc_', 'ah_',
            'asmt_', 'vtb_', 'canvas_', 'p_', 'pkg_', 'ts_',
            'x_snc_', 'oauth_', 'sp_', 'sn_hr_', 'sn_esig_'
        ];

        var gr = new GlideRecord('sys_db_object');
        gr.addQuery('name', 'NOT LIKE', 'sys_%');
        gr.orderBy('label');
        gr.query();

        var tables = [];
        while (gr.next()) {
            var name  = gr.getValue('name') || '';
            var label = gr.getValue('label') || '';

            if (!name || !label) continue;

            // ─── Skip tables matching excluded prefixes ────────────────────────
            var excluded = false;
            for (var i = 0; i < excludePrefixes.length; i++) {
                if (name.indexOf(excludePrefixes[i]) === 0) {
                    excluded = true;
                    break;
                }
            }
            if (excluded) continue;

            tables.push({
                name:   name,
                label:  label,
                sys_id: gr.getUniqueValue(),
            });
        }

        response.setStatus(200);
        response.setBody({ success: true, total: tables.length, tables: tables });

    } catch (e) {
        response.setStatus(500);
        response.setBody({ success: false, message: e + '' });
    }
})(request, response);