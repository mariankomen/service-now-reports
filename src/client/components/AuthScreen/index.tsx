import React, { useState, useEffect } from 'react';
import { BsFillCloudyFill } from "react-icons/bs";
import { warnToast, successToast, errorToast, infoToast } from '../../utils/toast';
import LoadingSpinner from '../LoadingSpinner';
import authService from '../../services/ServiceNow';
import SalesforceAuthService from '../../services/Salesforce';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

interface AuthScreenProps {
    onAuthorized: () => void
}
const AuthScreen: React.FC<AuthScreenProps> = ({onAuthorized}) => {
    const [isLoading, setIsLoading] = useState(false)
    const [activeTab, setActiveTab] = useState('connection')
    const [clientId, setClientId] = useState('')
    const [clientSecret, setClientSecret] = useState('')
    const [baseUrl, setBaseUrl] = useState('')

    useEffect(() => {
        const checkSavedAuth = async () => {
            setIsLoading(true);
            try{
                const savedCredentials = await authService.getConnection();
                if(!savedCredentials) return;

                setClientId(savedCredentials.clientId);
                setClientSecret(savedCredentials.clientSecret);
                setBaseUrl(savedCredentials.baseUrl);

                const valid = await SalesforceAuthService.validateConnection(savedCredentials);
                if (valid) {
                    successToast("Authenticated automatically");
                    onAuthorized();
                } else {
                    errorToast("Saved credentials are invalid");
                }
            }catch(err: unknown){
                console.error(err)
            }finally{
                setIsLoading(false);
            }
            
        }
        checkSavedAuth();
    }, []);

    const handleConnect = async () => {
        if (!clientId) return warnToast("Please enter Client Id");
        if (!clientSecret) return warnToast("Please enter Client Secret");
        if (!baseUrl) return warnToast("Please enter Salesforce Base URL");

        setIsLoading(true);

        const payload = {
            clientId,
            clientSecret,
            baseUrl
        }
        try{
            const tokenObject = await SalesforceAuthService.getAccessToken(payload);
            if(tokenObject.token){
                successToast('Credentials validated successfully.')
                await authService.saveConnection(payload);
                successToast('Credentials saved.')
                onAuthorized();
            }
        }catch(err: any){
            errorToast(err.message || 'Unknown error')
        }finally{
            setIsLoading(false)
        }
    }
    return (
        <div style={{width: "100%", fontFamily: "sans-serif", display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center'}}>
            <div style={{display: 'flex', width: '60%' , justifyContent: 'center'}}>
                <div style={{background: '#0da2df', width: '100%', display: 'flex', alignItems: 'center', flexDirection: 'column', borderRadius: '5px'}}>
                    <div style={{display: 'flex', gap: '6px', alignItems: 'center', color: '#fff'}}>
                        <BsFillCloudyFill size="24"/>
                        <p style={{color: '#fff', fontSize: '18px', fontWeight: '100'}}>
                            Peeklogic ServiceNow Reports
                        </p>
                    </div>
                    
                    <p style={{fontSize: '12px', marginTop: 0, color: '#fff', fontWeight: '100'}}>Connect and synchronise data with salesforce</p>
                </div>
            </div>

            
            <div style={{display: 'flex', width: '60%' , justifyContent: 'center', alignItems: 'center', flexDirection: 'column', position: 'relative'}}>
                {isLoading ?
                    <LoadingSpinner size="xlarge" />
                    : (
                    <div></div>)}
                <div style={{display: 'flex',  justifyContent: 'center', alignItems: 'center', width: '100%'}}>
                    {['Connection', 'Settings', 'Support'].map(tab => (
                        <div
                            key={tab}
                            onClick={() => setActiveTab(tab.toLowerCase() as 'connection' | 'settings' | 'support')}
                            style={{
                                ...tabStyle,
                                color: activeTab === tab.toLowerCase() ? '#0052cc' : '#42526E',
                                borderBottom: activeTab === tab.toLowerCase() ? '2px solid #0052cc' : 'none',
                                background: activeTab === tab.toLowerCase() ? 'rgb(240 244 251)' : '#fff',
                            }}
                        >
                            {tab}
                        </div>
                    ))}
                </div>
                
                <div style={{display: 'flex', justifyContent: 'flex-start', width: '100%'}}>
                    {activeTab === 'connection' && (
                        <div style={tabEntryStyle}>
                            <p style={{fontSize: '16px'}}>Connect to Salesforce</p>
                            <div style={fieldStyle}>
                                <label style={labelStyle}>Salesforce Base URL</label>
                                <input 
                                autoFocus
                                type="text"
                                value={baseUrl}
                                onChange={(e) => setBaseUrl(e.target.value)}
                                required
                                style={inputStyle}
                                placeholder='Enter your Salesforce organization base url.'
                                />
                            </div>
                            <div style={fieldStyle}>
                                <label style={labelStyle}>Client Id (Consumer Key)</label>
                                <input 
                                autoFocus
                                type="password"
                                value={clientId}
                                onChange={(e) => setClientId(e.target.value)}
                                required
                                style={inputStyle}
                                />
                            </div>
                            <div style={fieldStyle}>
                                <label style={labelStyle}>Client Secret (Consumer Secret)</label>
                                <input 
                                autoFocus
                                type="password"
                                value={clientSecret}
                                onChange={(e) => setClientSecret(e.target.value)}
                                required
                                style={inputStyle}
                                />
                            </div>
                            
                            <div>
                                <button style={buttonStyle} onClick={handleConnect} disabled={isLoading}>Connect</button>
                            </div>
                        </div>
                    )}
                    {activeTab === 'settings' && (
                        <div>settings</div>
                    )}
                    {activeTab === 'support' && (
                        <div>support</div>
                    )}
                    

                </div>
            </div>
            
        </div>
    )
}
const tabStyle: React.CSSProperties = { flex: 1, textAlign: 'center', padding: '12px 0', cursor: 'pointer', fontSize: 13, fontWeight: 400 };
const tabEntryStyle: React.CSSProperties = { width: '100%', padding: '12px 0', paddingRight: '25%', cursor: 'pointer', fontSize: 13, fontWeight: 400 };
const fieldStyle: React.CSSProperties = { marginBottom: '15px' };
const labelStyle: React.CSSProperties = { display: 'block', fontSize: '12px', fontWeight: 600, color: '#42526E', marginBottom: '4px' };
const inputStyle: React.CSSProperties = { width: '100%', padding: '8px 6px', borderRadius: '3px', border: '1px solid #DFE1E6', backgroundColor: '#FAFBFC', fontSize: '14px', boxSizing: 'border-box' };
const buttonStyle: React.CSSProperties = { padding: '8px 16px', background: 'rgb(122 232 100)', border: 'none', borderRadius: '3px' };

export default AuthScreen;