import { ApiClient } from '../api-client';

export type OAuthPayload = {
  clientId:     string;
  clientSecret: string;
  loginUrl:     string;   // https://login.salesforce.com or https://test.salesforce.com
  redirectUri:  string;
};

export type ConnectionStatus = {
  connected:     boolean;
  clientId?:     string;
  clientSecret?: string;
  loginUrl?:     string;
  instanceUrl?:  string;
};

class SalesforceAuthService {
  private api = new ApiClient({
    'X-UserToken': (window as any).g_ck || '',
  });

  private validateUrl     = '/api/x_1955226_connecto/x_1955226_connecto_connector_api/credentials/validate';
  private credentialsUrl  = '/api/x_1955226_connecto/x_1955226_connecto_connector_api/credentials';

  // ─── Build Salesforce OAuth authorization URL ─────────────────────────────
  buildAuthUrl(payload: OAuthPayload): string {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id:     payload.clientId,
      redirect_uri:  payload.redirectUri,
      scope:         'full api refresh_token offline_access',
      prompt:        'login',
    });
    return `${payload.loginUrl}/services/oauth2/authorize?${params.toString()}`;
  }

  // ─── Exchange OAuth code for tokens (via backend) ─────────────────────────
  async exchangeCode(code: string, payload: OAuthPayload): Promise<void> {
    const data = await this.api.post<any>(this.validateUrl, { code, ...payload });
    if (!data?.result?.success) {
      throw new Error(data?.result?.error || 'Token exchange failed.');
    }
  }

  // ─── Check if current user is connected ──────────────────────────────────
  async getConnectionStatus(): Promise<ConnectionStatus> {
    try {
      const data = await this.api.get<any>(this.credentialsUrl);
      const connection = data?.result?.data;
      if (!connection?.connected) return { connected: false };
      return {
        connected:    true,
        clientId:     connection.clientId,
        clientSecret: connection.clientSecret,
        loginUrl:     connection.baseUrl,
        instanceUrl:  connection.instanceUrl
      };
    } catch {
      return { connected: false };
    }
  }

  // ─── Disconnect — clears tokens by posting empty values ──────────────────
  async disconnect(): Promise<void> {
    await this.api.post<any>(this.credentialsUrl, {
      accessToken:  '',
      refreshToken: '',
      instanceUrl:  '',
      issuedAt:     '',
    });
  }
}

export default new SalesforceAuthService();