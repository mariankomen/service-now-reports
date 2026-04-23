import axios from 'axios';

export type ConnectionPayload = {
  baseUrl: string;
  clientId: string;
  clientSecret: string;
};

type ConnectionResponse = {
  sys_id: string;
  baseUrl: string;
  clientId: string;
  clientSecret: string;
};

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  sys_id?: string;
  message?: string;
};
const BASE_URL = '/api/x_1955226_connecto/connector_api/credentials'; // your scripted API namespace

class AuthService{
    constructor(){

    }

    async getConnection(): Promise<ConnectionResponse> {
        const res = await axios.get(BASE_URL, {
            headers: {
                'X-UserToken': (window as any).g_ck || '',
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        if(res.statusText != 'OK'){
            throw new Error(`Get connection failed: ${res.status}`);
        }
        const response = res.data.result.data;
        if(res.data.result.success != true){
            throw new Error(`Get connection failed: ${response.result.message}`);
        }
        return {
            sys_id: response.sys_id,
            baseUrl: response.baseUrl,
            clientId: response.clientId,
            clientSecret: response.clientSecret
        }
    }
    async saveConnection(payload: ConnectionPayload): Promise<{ sys_id: string }> {
        const res = await axios.post(BASE_URL, payload, {
            headers: {
                'X-UserToken': (window as any).g_ck || '',
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        if(res.statusText != 'OK'){
            throw new Error(`Save connection failed: ${res.status}`);
        }
        const response = res.data;
        if(response.result.success != true){
            throw new Error(`Save connection failed: ${response.result.message}`);
        }
        return {
            sys_id: response.result.sys_id
        }
    }
}

export default new AuthService();