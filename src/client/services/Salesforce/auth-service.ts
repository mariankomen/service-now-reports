import axios, { AxiosError } from 'axios';
import type { ConnectionPayload } from "../ServiceNow/auth-service";

class SalesforceAuthService{

    async validateConnection(payload: ConnectionPayload) : Promise<boolean>{
        try{
            const res = await this.getAccessToken(payload);
            return !!res.token;
        }catch(err: unknown){
            return false;
        }
    }
    async getAccessToken(payload: ConnectionPayload): Promise<{ token: string }> {
        if(!payload.baseUrl){
            throw new Error('Missing required params "baseUrl"');
        }
        if(!payload.clientId){
            throw new Error('Missing required params "clientId"');
        }
        if(!payload.clientSecret){
            throw new Error('Missing required params "clientSecret"');
        }
        const endpoint = `${payload.baseUrl}/services/oauth2/token`;
        const body = new URLSearchParams();
        body.append('grant_type', 'client_credentials');
        body.append('client_id', payload.clientId);
        body.append('client_secret', payload.clientSecret);

        try{
            const res = await axios.post(endpoint, body, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
            return {
                token: res.data.access_token
            }
        }catch(err: unknown){
            if (axios.isAxiosError(err)) {
                throw new Error(`Failed to obtain Salesforce Access Token. Error: ${err.message}, status: ${err.response?.status}`)
            } else if (err instanceof Error) {
                throw new Error(`Failed to obtain Salesforce Access Token. Error: ${err.message}`);
            } else {
                throw new Error('Failed to obtain Salesforce Access Token. Unkown error: ' + err);
            }
        }
        
    }
}

export default new SalesforceAuthService();