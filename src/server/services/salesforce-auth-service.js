var SalesforceAuthService = Class.create();
SalesforceAuthService.prototype = {
    initialize: function() {},

    // ─── Get valid access token for current user ───────────────────────────────
    // Flow: check stored token → validate → refresh if expired → error if no refresh token
    getAccessToken: function() {
        try {
            var connection = this._getConnection();
            if (!connection.success) {
                return this._error('No connection found for current user.');
            }

            var data = connection.data;

            // ─── Try stored access token first ────────────────────────────────
            if (data.accessToken) {
                var baseUrl = data.instanceUrl || data.baseUrl;
                var isValid = this._validateToken(data.accessToken, baseUrl);

                if (isValid) {
                    return {
                        success: true,
                        token:   data.accessToken,
                        baseUrl: baseUrl
                    };
                }

                // Token expired — fall through to refresh
                gs.info('SalesforceAuthService: access token expired, attempting refresh.');
            }

            // ─── Try refresh token ────────────────────────────────────────────
            if (data.refreshToken) {
                return this._refreshToken(data);
            }

            return this._error('No token available. Please reconnect.');

        } catch (e) {
            return this._error(e + '');
        }
    },

    // ─── Stored access token, without the validation round trip ──────────────
    // For latency-sensitive callers that fall back to getAccessToken() on HTTP 401
    getStoredToken: function() {
        try {
            var connection = this._getConnection();
            if (!connection.success || !connection.data.accessToken) {
                return { success: false, token: '', baseUrl: '' };
            }
            return {
                success: true,
                token:   connection.data.accessToken,
                baseUrl: connection.data.instanceUrl || connection.data.baseUrl
            };
        } catch (e) {
            return { success: false, token: '', baseUrl: '' };
        }
    },

    // ─── Validate token with a lightweight Salesforce API call ────────────────
    // Uses /limits endpoint — fast, no business data fetched
    _validateToken: function(token, baseUrl) {
        try {
            var req = new sn_ws.RESTMessageV2();
            req.setEndpoint(baseUrl + '/services/data/v60.0/limits');
            req.setHttpMethod('GET');
            req.setRequestHeader('Authorization', 'Bearer ' + token);
            req.setRequestHeader('Accept', 'application/json');

            var res = req.execute();
            return res.getStatusCode() === 200;
        } catch (e) {
            gs.warn('SalesforceAuthService: token validation failed: ' + e);
            return false;
        }
    },

    // ─── Refresh access token using stored refresh token ──────────────────────
    _refreshToken: function(data) {
        try {
            // Use stored login_url if available, fallback to production
            var loginUrl = data.loginUrl || 'https://login.salesforce.com';

            var req = new sn_ws.RESTMessageV2();
            req.setEndpoint(loginUrl + '/services/oauth2/token');
            req.setHttpMethod('POST');
            req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            req.setRequestBody(
                'grant_type=refresh_token' +
                '&refresh_token=' + encodeURIComponent(data.refreshToken) +
                '&client_id=' + encodeURIComponent(data.clientId) +
                '&client_secret=' + encodeURIComponent(data.clientSecret)
            );

            var res = req.execute();
            var parsed = JSON.parse(res.getBody());

            if (!parsed.access_token) {
                return this._error('Token refresh failed: ' + (parsed.error_description || 'Unknown error'));
            }

            // ─── Persist new access token ─────────────────────────────────────
            var gr = new GlideRecordSecure('x_1955226_connecto_connection');
            gr.addQuery('user_id', gs.getUserID());
            gr.setLimit(1);
            gr.query();
            if (gr.next()) {
                gr.access_token = parsed.access_token;
                gr.issued_at    = parsed.issued_at || '';
                gr.update();
            }

            gs.info('SalesforceAuthService: token refreshed successfully.');

            return {
                success: true,
                token:   parsed.access_token,
                baseUrl: data.instanceUrl || data.baseUrl
            };
        } catch (e) {
            return this._error('Token refresh exception: ' + e);
        }
    },

    // ─── Load current user's connection record from DB ────────────────────────
    _getConnection: function() {
        var gr = new GlideRecordSecure('x_1955226_connecto_connection');
        gr.addQuery('user_id', gs.getUserID());
        gr.setLimit(1);
        gr.query();

        if (!gr.next()) {
            return { success: false, message: 'Connection not configured for current user.' };
        }

        return {
            success: true,
            data: {
                sys_id:       gr.getUniqueValue(),
                baseUrl:      gr.getValue('base_url'),
                instanceUrl:  gr.getValue('instance_url'),
                loginUrl:     gr.getValue('login_url'),
                accessToken:  this._readSecret(gr, 'access_token'),
                refreshToken: this._readSecret(gr, 'refresh_token'),
                clientId:     this._readSecret(gr, 'client_id'),
                clientSecret: this._readSecret(gr, 'client_secret'),
            }
        };
    },

    // ─── Read a credential field ──────────────────────────────────────────────
    // Password2 fields decrypt via the element; legacy plain-string columns
    // don't, so fall back to the raw value when decryption yields nothing
    _readSecret: function(gr, field) {
        var decrypted = '';
        try { decrypted = gr[field].getDecryptedValue(); } catch (e) {}
        return decrypted || gr.getValue(field) || '';
    },

    // ─── Standard error response ──────────────────────────────────────────────
    _error: function(message) {
        gs.error('SalesforceAuthService: ' + message);
        return { success: false, token: '', baseUrl: '', error: message };
    },

    type: 'SalesforceAuthService'
};