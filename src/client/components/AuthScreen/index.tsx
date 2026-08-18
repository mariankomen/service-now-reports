import React, { useState, useEffect, useRef } from 'react';
import { BsFillCloudyFill } from 'react-icons/bs';
import { AiOutlineCheckCircle, AiOutlineDisconnect, AiOutlineLink } from 'react-icons/ai';
import { warnToast, successToast, errorToast } from '../../utils/toast';
import LoadingSpinner from '../LoadingSpinner';
import SalesforceAuthService from '../../services/Salesforce';

interface AuthScreenProps {
  onAuthorized: () => void;
}

const REDIRECT_URI = window.location.href.split('?')[0];

const LOGIN_URLS = [
  { label: 'Production', value: 'https://login.salesforce.com' },
  { label: 'Sandbox',    value: 'https://test.salesforce.com'  },
];

const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthorized }) => {
  const [isLoading, setIsLoading]             = useState(false);
  const [activeTab, setActiveTab]             = useState('connection');
  const [clientId, setClientId]               = useState('');
  const [clientSecret, setClientSecret]       = useState('');
  const [loginUrl, setLoginUrl]               = useState('https://login.salesforce.com');
  const [isAuthorized, setIsAuthorized]       = useState(false);
  const [instanceUrl, setInstanceUrl]         = useState('');
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  const codeProcessed = useRef(false);

  // ─── On mount ────────────────────────────────────────────────────────────────
  useEffect(() => {
    const init = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');

      if (code) {
        if (codeProcessed.current) return;
        codeProcessed.current = true;
        setIsLoading(true);
        await handleOAuthCallback(code);
        return;
      }

      setIsLoading(true);
      try {
        const status = await SalesforceAuthService.getConnectionStatus();
        setIsAuthorized(status.connected);
        if (status.connected) {
          setInstanceUrl(status.instanceUrl || '');
          successToast('Connected to Salesforce.');
          onAuthorized();
        } else {
          if (status.clientId) setClientId(status.clientId);
          if (status.loginUrl) setLoginUrl(status.loginUrl);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, []);

  // ─── Exchange OAuth code ──────────────────────────────────────────────────
  const handleOAuthCallback = async (code: string) => {
    const saved = sessionStorage.getItem('sf_oauth_pending');
    if (!saved) {
      errorToast('OAuth session expired. Please try again.');
      setIsLoading(false);
      window.history.replaceState({}, document.title, window.location.pathname);
      return;
    }

    const { clientId, clientSecret, loginUrl } = JSON.parse(saved);
    sessionStorage.removeItem('sf_oauth_pending');

    try {
      await SalesforceAuthService.exchangeCode(code, {
        clientId,
        clientSecret,
        loginUrl,
        redirectUri: REDIRECT_URI,
      });

      window.history.replaceState({}, document.title, window.location.pathname);
      successToast('Connected to Salesforce successfully!');
      setIsAuthorized(true);
      onAuthorized();
    } catch (err: any) {
      errorToast(err?.message || 'Failed to connect to Salesforce.');
      window.history.replaceState({}, document.title, window.location.pathname);
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Connect ──────────────────────────────────────────────────────────────
  const handleConnect = () => {
    if (!clientId)     return warnToast('Please enter Client ID');
    if (!clientSecret) return warnToast('Please enter Client Secret');

    sessionStorage.setItem('sf_oauth_pending', JSON.stringify({ clientId, clientSecret, loginUrl }));

    const authUrl = SalesforceAuthService.buildAuthUrl({
      clientId,
      clientSecret,
      loginUrl,
      redirectUri: REDIRECT_URI,
    });

    window.open(authUrl);
  };

  // ─── Disconnect ───────────────────────────────────────────────────────────
  const handleDisconnect = async () => {
    setIsDisconnecting(true);
    try {
      await SalesforceAuthService.disconnect();
      setIsAuthorized(false);
      setClientId('');
      setClientSecret('');
      setInstanceUrl('');
      setLoginUrl('https://login.salesforce.com');
      successToast('Disconnected from Salesforce.');
    } catch (err: any) {
      errorToast(err?.message || 'Failed to disconnect.');
    } finally {
      setIsDisconnecting(false);
    }
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div style={{ width: '100%', fontFamily: 'sans-serif', display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', width: '60%', justifyContent: 'center' }}>
        <div style={{ background: '#0da2df', width: '100%', display: 'flex', alignItems: 'center', flexDirection: 'column', borderRadius: '5px' }}>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center', color: '#fff' }}>
            <BsFillCloudyFill size={24} />
            <p style={{ color: '#fff', fontSize: '18px', fontWeight: 100 }}>
              Peeklogic ServiceNow Reports
            </p>
          </div>
          <p style={{ fontSize: '12px', marginTop: 0, color: '#fff', fontWeight: 100 }}>
            Connect and synchronise data with Salesforce
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', width: '60%', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', position: 'relative' }}>
        {isLoading && <LoadingSpinner size="xlarge" />}

        {/* ── Tabs ── */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
          {['Connection', 'Settings', 'Support'].map(tab => (
            <div
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase())}
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

        <div style={{ display: 'flex', justifyContent: 'flex-start', width: '100%' }}>
          {activeTab === 'connection' && (
            <div style={tabEntryStyle}>

              {isAuthorized ? (
                // ── Connected state ─────────────────────────────────────────
                <div>
                  {/* ── Status badge ── */}
                  <div style={connectedBadgeStyle}>
                    <AiOutlineCheckCircle size={20} color="#006644" />
                    <span style={{ fontSize: 15, fontWeight: 600, color: '#006644' }}>
                      Connected to Salesforce
                    </span>
                  </div>

                  {/* ── Connection details ── */}
                  <div style={infoCardStyle}>
                    <div style={infoRowStyle}>
                      <span style={infoLabelStyle}>Environment</span>
                      <span style={infoValueStyle}>
                        {loginUrl === 'https://test.salesforce.com' ? 'Sandbox' : 'Production'}
                      </span>
                    </div>
                    {clientId && (
                      <div style={infoRowStyle}>
                        <span style={infoLabelStyle}>Client ID</span>
                        <span style={infoValueStyle}>
                          {clientId.slice(0, 12)}•••••••••••••
                        </span>
                      </div>
                    )}
                    {instanceUrl && (
                      <div style={{ ...infoRowStyle, borderBottom: 'none' }}>
                        <span style={infoLabelStyle}>Instance URL</span>
                        <a
                          href={instanceUrl}
                          target="_blank"
                          rel="noreferrer"
                          style={{ fontSize: 12, color: '#0052CC', display: 'flex', alignItems: 'center', gap: 4 }}
                        >
                          <AiOutlineLink size={13} />
                          {instanceUrl.replace('https://', '')}
                        </a>
                      </div>
                    )}
                  </div>

                  {/* ── Actions ── */}
                  <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                    <button style={reconnectBtnStyle} onClick={() => setIsAuthorized(false)}>
                      Reconnect
                    </button>
                    <button style={disconnectBtnStyle} onClick={handleDisconnect} disabled={isDisconnecting}>
                      <AiOutlineDisconnect size={14} />
                      {isDisconnecting ? 'Disconnecting...' : 'Disconnect'}
                    </button>
                  </div>
                </div>
              ) : (
                // ── Not connected state ─────────────────────────────────────
                <div>
                  <p style={{ fontSize: '16px', fontWeight: 600, color: '#172B4D' }}>Connect to Salesforce</p>
                  <p style={{ fontSize: '13px', color: '#6B778C', marginTop: 0 }}>
                    Enter your Connected App credentials. You'll be redirected to Salesforce to log in.
                  </p>

                  <div style={fieldStyle}>
                    <label style={labelStyle}>Environment</label>
                    <select value={loginUrl} onChange={e => setLoginUrl(e.target.value)} style={inputStyle}>
                      {LOGIN_URLS.map(o => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  </div>

                  <div style={fieldStyle}>
                    <label style={labelStyle}>Client ID (Consumer Key)</label>
                    <input
                      type="text"
                      value={clientId}
                      onChange={e => setClientId(e.target.value)}
                      style={inputStyle}
                      placeholder="Enter your Connected App Consumer Key"
                    />
                  </div>

                  <div style={fieldStyle}>
                    <label style={labelStyle}>Client Secret (Consumer Secret)</label>
                    <input
                      type="password"
                      value={clientSecret}
                      onChange={e => setClientSecret(e.target.value)}
                      style={inputStyle}
                      placeholder="Enter your Connected App Consumer Secret"
                    />
                  </div>

                  <button style={buttonStyle} onClick={handleConnect} disabled={isLoading}>
                    Connect with Salesforce →
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && <div style={{ padding: 20 }}>Settings</div>}
          {activeTab === 'support'  && <div style={{ padding: 20 }}>Support</div>}
        </div>
      </div>
    </div>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const tabStyle: React.CSSProperties           = { flex: 1, textAlign: 'center', padding: '12px 0', cursor: 'pointer', fontSize: 13, fontWeight: 400 };
const tabEntryStyle: React.CSSProperties      = { width: '100%', padding: '12px 0', paddingRight: '25%', fontSize: 13, fontWeight: 400 };
const fieldStyle: React.CSSProperties         = { marginBottom: '15px' };
const labelStyle: React.CSSProperties         = { display: 'block', fontSize: '12px', fontWeight: 600, color: '#42526E', marginBottom: '4px' };
const inputStyle: React.CSSProperties         = { width: '100%', padding: '8px 6px', borderRadius: '3px', border: '1px solid #DFE1E6', backgroundColor: '#FAFBFC', fontSize: '14px', boxSizing: 'border-box' };
const buttonStyle: React.CSSProperties        = { padding: '10px 20px', background: '#0052CC', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', fontWeight: 600 };
const connectedBadgeStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 10, backgroundColor: '#E3FCEF', border: '1px solid #ABF5D1', borderRadius: 6, padding: '12px 16px', marginBottom: 16 };
const infoCardStyle: React.CSSProperties      = { backgroundColor: '#FAFBFC', border: '1px solid #EBECF0', borderRadius: 6, padding: '4px 16px' };
const infoRowStyle: React.CSSProperties       = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #F4F5F7' };
const infoLabelStyle: React.CSSProperties     = { fontSize: 12, fontWeight: 600, color: '#6B778C' };
const infoValueStyle: React.CSSProperties     = { fontSize: 12, color: '#172B4D', fontWeight: 500 };
const reconnectBtnStyle: React.CSSProperties  = { padding: '8px 16px', backgroundColor: 'white', color: '#0052CC', border: '1px solid #0052CC', borderRadius: 4, cursor: 'pointer', fontSize: 13, fontWeight: 500 };
const disconnectBtnStyle: React.CSSProperties = { padding: '8px 16px', backgroundColor: 'white', color: '#DE350B', border: '1px solid #DE350B', borderRadius: 4, cursor: 'pointer', fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 };

export default AuthScreen;