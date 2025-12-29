import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import type { GetServerSideProps } from 'next';
import Layout from 'components/layout';
import Button from 'components/button';
import TitleHero from 'components/title-hero';
import { getCMSById, getEventFromCMS } from 'helpers';
import { CMSContent } from 'types';
import { requireAdmin } from 'lib/admin-auth';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import GoogleIcon from '@mui/icons-material/Google';
import TableChartIcon from '@mui/icons-material/TableChart';
import EmailIcon from '@mui/icons-material/Email';
import AddIcon from '@mui/icons-material/Add';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

interface AdminPageProps {
  cms: string;
}

export default function AdminPage({ cms: stringifiedCMS }: AdminPageProps) {
  const cms: CMSContent = JSON.parse(stringifiedCMS);
  const event = getEventFromCMS(cms);
  const [connected, setConnected] = useState(false);
  const [sheets, setSheets] = useState<Array<{ id: string; name: string }>>([]);
  const [sheetId, setSheetId] = useState('');
  const [sheetName, setSheetName] = useState('Form Submissions');
  const [sheetMode, setSheetMode] = useState<'existing' | 'create'>('existing');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadingSheets, setLoadingSheets] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [authorized, setAuthorized] = useState<boolean | null>(null); // null = checking, true = authorized, false = denied
  
  type ConfigState = {
    sheetId: string;
    sheetName: string;
    ownerEmail: string;
    sheetMode: 'existing' | 'create';
  };

  const defaultConfig: ConfigState = {
    sheetId: '',
    sheetName: 'Form Submissions',
    ownerEmail: '',
    sheetMode: 'existing',
  };

  const DEFAULT_SHEET_NAME = defaultConfig.sheetName;

  const [initialConfig, setInitialConfig] = useState<ConfigState | null>(null);
  const [configLoaded, setConfigLoaded] = useState(false);

  async function loadSheets() {
    setLoadingSheets(true);
    try {
      const res = await fetch('/api/sheets/list');
      if (res.status === 403) {
        // Unauthorized - user doesn't have admin access
        setSheets([]);
        return;
      }
      if (!res.ok) throw new Error('Failed to load sheets');
      const data = await res.json();
      setSheets(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load sheets:', error);
      setSheets([]);
    } finally {
      setLoadingSheets(false);
    }
  }

  async function loadConfig() {
    try {
      const res = await fetch('/api/setup/config');
      if (res.status === 403) {
        // Unauthorized - user doesn't have admin access
        setConfigLoaded(true);
        return;
      }
      if (!res.ok) throw new Error('Failed to load config');
      const data = await res.json();
      const loadedSheetId = data.sheetId || '';
      const loadedSheetName = data.sheetName || defaultConfig.sheetName;
      const loadedOwnerEmail = data.ownerEmail || '';
      const loadedSheetMode = loadedSheetId ? 'existing' : 'create';
      
      if (loadedSheetId) {
        setSheetId(loadedSheetId);
        setSheetMode('existing');
      } else {
        setSheetMode('create');
      }
      setSheetName(loadedSheetName);
      setOwnerEmail(loadedOwnerEmail);
      setConfigLoaded(true);
    } catch (error) {
      console.error('Failed to load config:', error);
      setConfigLoaded(true);
    }
  }

  const checkConnection = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/status');
      if (!res.ok) throw new Error('Failed to check connection status');
      const data = await res.json();
      setConnected(data.connected);
      if (data.connected) {
        // Check admin access after connection
        try {
          const adminRes = await fetch('/api/auth/admin-check');
          if (adminRes.status === 403) {
            setAuthorized(false);
            setMessage({ type: 'error', text: 'Access denied. Only administrators can access this page.' });
            setLoading(false);
            return;
          }
          setAuthorized(true);
        } catch (error) {
          // If admin check fails, allow access (for backward compatibility)
          setAuthorized(true);
        }
        await loadSheets();
        await loadConfig();
      } else {
        // If not connected, check if admin emails are configured
        // If not configured, allow access (for initial setup)
        const adminEmails = process.env.ADMIN_EMAILS;
        setAuthorized(adminEmails ? false : true); // If no admin emails, allow (will check after connection)
        setInitialConfig(defaultConfig);
      }
    } catch (error) {
      console.error('Failed to check connection:', error);
      setInitialConfig(defaultConfig);
    } finally {
      setLoading(false);
    }
  }, [defaultConfig]);

  useEffect(() => {
    checkConnection();
    
    const params = new URLSearchParams(window.location.search);
    const success = params.get('success');
    const error = params.get('error');
    
    if (success) {
      setMessage({ type: 'success', text: 'Google account connected successfully!' });
      window.history.replaceState({}, '', '/admin');
    } else if (error && error !== 'unauthorized') {
      // Only show error if it's not "unauthorized" (that's handled by admin check)
      setMessage({ type: 'error', text: `Connection failed: ${error.replace(/_/g, ' ')}` });
      window.history.replaceState({}, '', '/admin');
    } else if (error === 'unauthorized') {
      // Clear unauthorized error from URL - admin check will handle it
      window.history.replaceState({}, '', '/admin');
    }
  }, [checkConnection]);

  // Sync initialConfig with form state after config loads
  useEffect(() => {
    if (configLoaded && !initialConfig) {
      const currentSheetId = sheetMode === 'existing' ? sheetId : '';
      const currentSheetName = sheetMode === 'create' 
        ? sheetName.trim() 
        : (sheets.find(s => s.id === sheetId)?.name || DEFAULT_SHEET_NAME);
      
      setInitialConfig({
        sheetId: currentSheetId,
        sheetName: currentSheetName,
        ownerEmail: ownerEmail.trim(),
        sheetMode: sheetMode,
      });
    }
  }, [configLoaded, sheetId, sheetName, ownerEmail, sheetMode, sheets, initialConfig, DEFAULT_SHEET_NAME]);

  function validateEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  async function saveConfig() {
    if (sheetMode === 'existing' && !sheetId) {
      setMessage({ type: 'error', text: 'Please select a Google Sheet' });
      return;
    }
    if (sheetMode === 'create' && !sheetName.trim()) {
      setMessage({ type: 'error', text: 'Please enter a name for the new sheet' });
      return;
    }
    const trimmedEmail = ownerEmail.trim();
    if (!trimmedEmail) {
      setMessage({ type: 'error', text: 'Please enter your email address' });
      return;
    }
    if (!validateEmail(trimmedEmail)) {
      setMessage({ type: 'error', text: 'Please enter a valid email address' });
      return;
    }

    setSaving(true);
    setMessage(null);
    
    try {
      let finalSheetId = sheetId;
      
      // If creating new sheet, create it first
      if (sheetMode === 'create') {
        const createRes = await fetch('/api/sheets/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: sheetName.trim() }),
        });
        
        if (!createRes.ok) {
          const error = await createRes.json();
          throw new Error(error.error || 'Failed to create sheet');
        }
        
        const createData = await createRes.json();
        finalSheetId = createData.sheetId;
      }
      
      // Save configuration
      const saveRes = await fetch('/api/setup/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          sheetId: finalSheetId, 
          sheetName: sheetMode === 'create' ? sheetName.trim() : undefined,
          ownerEmail: trimmedEmail
        }),
      });
      
      if (!saveRes.ok) {
        const error = await saveRes.json().catch(() => ({}));
        throw new Error(error.error || 'Failed to save configuration');
      }
      
      setMessage({ type: 'success', text: 'Configuration saved successfully!' });
      
      // If we created a new sheet, reload the sheets list and switch to existing mode
      if (sheetMode === 'create') {
        setSheetId(finalSheetId);
        setSheetMode('existing');
        await loadSheets();
      }
      
      // Update initial config to reflect saved state
      const savedSheetName = sheetMode === 'create' 
        ? sheetName.trim() 
        : (sheets.find(s => s.id === finalSheetId)?.name || defaultConfig.sheetName);
      
      setInitialConfig({
        sheetId: finalSheetId,
        sheetName: savedSheetName,
        ownerEmail: trimmedEmail,
        sheetMode: 'existing',
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save configuration. Please try again.';
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setSaving(false);
    }
  }

  function hasChanges(): boolean {
    if (!initialConfig) return false;
    
    const currentSheetId = sheetMode === 'existing' ? sheetId : '';
    const currentSheetName = sheetMode === 'create' 
      ? sheetName.trim() 
      : (sheets.find(s => s.id === sheetId)?.name || initialConfig.sheetName);
    const currentOwnerEmail = ownerEmail.trim();
    
    return (
      currentSheetId !== initialConfig.sheetId ||
      currentSheetName !== initialConfig.sheetName ||
      currentOwnerEmail !== initialConfig.ownerEmail ||
      sheetMode !== initialConfig.sheetMode
    );
  }

  if (loading) {
    return (
      <Layout event={event}>
        <TitleHero
          image="https://images.unsplash.com/photo-1557683316-973673baf926?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
          imageAlt="Admin dashboard"
          title="Admin"
        />
        <section style={{ 
          background: 'linear-gradient(180deg, rgb(255, 240, 245) 0%, rgb(251, 251, 251) 100%)',
          minHeight: '100vh',
          paddingTop: '4rem',
          paddingBottom: '4rem'
        }}>
          <div style={{ 
            textAlign: 'center', 
            padding: '4rem 2rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <CircularProgress size={40} />
            <p style={{ color: '#666', margin: 0 }}>Loading...</p>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout event={event}>
      <Head>
        <style>{`
          input[type="email"]::placeholder {
            color: #999 !important;
            opacity: 0.7;
          }
        `}</style>
      </Head>
      <TitleHero
        image="https://images.unsplash.com/photo-1557683316-973673baf926?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
        imageAlt="Admin dashboard"
        title="Admin"
      />
      <section style={{ 
        background: 'linear-gradient(180deg, rgb(255, 240, 245) 0%, rgb(251, 251, 251) 100%)',
        minHeight: '100vh',
        paddingTop: '4rem',
        paddingBottom: '4rem'
      }}>
        <div style={{ maxWidth: 700, margin: '0 auto', padding: '0 1.5rem' }}>

        {/* Show only error message if access denied */}
        {authorized === false ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '4rem 2rem',
            minHeight: '50vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div>
              <h2 style={{ 
                fontSize: '1.5rem', 
                color: '#d32f2f', 
                marginBottom: '1rem' 
              }}>
                Access Denied
              </h2>
              <p style={{ 
                color: '#666', 
                fontSize: '1rem',
                maxWidth: '500px',
                margin: '0 auto 2rem'
              }}>
                Only administrators can access this page. Please contact the site administrator if you believe this is an error.
              </p>
              <Button 
                variant="primary" 
                onClick={() => window.location.href = '/api/auth/google?force=true'}
              >
                Reconnect with Google
              </Button>
            </div>
          </div>
        ) : (
          <>
            {message && (
              <Alert 
                severity={message.type} 
                onClose={() => setMessage(null)}
                sx={{ marginBottom: '2rem' }}
              >
                {message.text}
              </Alert>
            )}
            
            {!connected ? (
          <div style={{ 
            marginTop: '2rem', 
            padding: '3rem 2rem', 
            border: '2px solid #e0e0e0', 
            borderRadius: '12px',
            textAlign: 'center',
            background: '#fafafa'
          }}>
            <GoogleIcon sx={{ fontSize: '3rem', color: '#4285F4', marginBottom: '1rem' }} />
            <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>
              Connect Google Account
            </h2>
            <p style={{ 
              marginBottom: '2rem', 
              color: '#666',
              lineHeight: '1.6',
              maxWidth: '400px',
              margin: '0 auto 2rem'
            }}>
              Connect your Google account to save form submissions directly to Google Sheets. 
              You&apos;ll only need to do this once.
            </p>
            <div style={{ display: 'inline-flex', alignItems: 'center' }}>
              <Button 
                variant="primary" 
                onClick={() => window.location.href = '/api/auth/google'}
              >
                <GoogleIcon sx={{ fontSize: '1.2rem', marginRight: '0.5rem', verticalAlign: 'middle' }} />
                Connect with Google
              </Button>
            </div>
          </div>
        ) : (
          <div style={{ marginTop: '2rem' }}>
            {/* Step 1: Connection Status */}
            <div style={{ 
              padding: '1.5rem', 
              background: 'linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%)',
              borderRadius: '12px', 
              marginBottom: '2.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              border: '1px solid #b8dac0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                <CheckCircleIcon sx={{ fontSize: '2rem', color: '#155724' }} />
                <div>
                  <p style={{ margin: 0, color: '#155724', fontWeight: 600, fontSize: '1rem' }}>
                    Google account connected
                  </p>
                  <p style={{ margin: '0.25rem 0 0', color: '#155724', fontSize: '0.875rem', opacity: 0.8 }}>
                    Your account is ready to use
                  </p>
                </div>
              </div>
              <Button 
                variant="secondary" 
                onClick={() => window.location.href = '/api/auth/google?force=true'}
                style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
              >
                Reconnect
              </Button>
            </div>

            {/* Step 2: Sheet Selection */}
            <div style={{ 
              marginBottom: '2rem',
              padding: '2rem',
              border: '1px solid #e0e0e0',
              borderRadius: '12px',
              background: '#fff'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <TableChartIcon sx={{ fontSize: '1.5rem', color: 'var(--color-primary)' }} />
                <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Google Sheet</h2>
              </div>
              
              {/* Mode Toggle */}
              <div style={{ 
                display: 'flex', 
                gap: '1rem', 
                marginBottom: '1.5rem',
                padding: '0.5rem',
                background: '#f5f5f5',
                borderRadius: '8px'
              }}>
                <label style={{ 
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  background: sheetMode === 'existing' ? '#fff' : 'transparent',
                  border: `2px solid ${sheetMode === 'existing' ? 'var(--color-primary)' : 'transparent'}`,
                  transition: 'all 0.2s'
                }}>
                  <input
                    type="radio"
                    name="sheetMode"
                    checked={sheetMode === 'existing'}
                    onChange={() => setSheetMode('existing')}
                    style={{ margin: 0, cursor: 'pointer' }}
                  />
                  <span style={{ fontWeight: 500 }}>Use Existing Sheet</span>
                </label>
                <label style={{ 
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  background: sheetMode === 'create' ? '#fff' : 'transparent',
                  border: `2px solid ${sheetMode === 'create' ? 'var(--color-primary)' : 'transparent'}`,
                  transition: 'all 0.2s'
                }}>
                  <input
                    type="radio"
                    name="sheetMode"
                    checked={sheetMode === 'create'}
                    onChange={() => setSheetMode('create')}
                    style={{ margin: 0, cursor: 'pointer' }}
                  />
                  <AddIcon sx={{ fontSize: '1.2rem', color: sheetMode === 'create' ? 'var(--color-primary)' : '#666' }} />
                  <span style={{ fontWeight: 500 }}>Create New Sheet</span>
                </label>
              </div>

              {loadingSheets && sheetMode === 'existing' ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#666' }}>
                  <CircularProgress size={20} />
                  <span>Loading your sheets...</span>
                </div>
              ) : sheetMode === 'existing' ? (
                <>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '0.75rem', 
                    fontWeight: 500,
                    color: '#333',
                    fontSize: '0.9375rem'
                  }}>
                    Choose a sheet to store form submissions:
                  </label>
                  <select 
                    value={sheetId} 
                    onChange={e => setSheetId(e.target.value)}
                    aria-label="Select a Google Sheet"
                    aria-required="true"
                    style={{ 
                      width: '100%', 
                      padding: '0.75rem', 
                      fontSize: '1rem',
                      border: '2px solid #e0e0e0',
                      borderRadius: '8px',
                      background: '#fff',
                      cursor: 'pointer',
                      transition: 'border-color 0.2s'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                    onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                  >
                    <option value="">Select a sheet...</option>
                    {sheets.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </>
              ) : (
                <>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '0.75rem', 
                    fontWeight: 500,
                    color: '#333',
                    fontSize: '0.9375rem'
                  }}>
                    Enter a name for the new sheet:
                  </label>
                  <input
                    type="text"
                    value={sheetName}
                    onChange={e => setSheetName(e.target.value)}
                    placeholder="Form Submissions"
                    aria-label="Name for the new Google Sheet"
                    aria-required="true"
                    style={{ 
                      width: '100%', 
                      padding: '0.75rem', 
                      fontSize: '1rem',
                      border: '2px solid #e0e0e0',
                      borderRadius: '8px',
                      transition: 'border-color 0.2s'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                    onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                  />
                  <p style={{ 
                    fontSize: '0.8125rem', 
                    color: '#666', 
                    marginTop: '0.5rem',
                    marginBottom: 0
                  }}>
                    A new Google Sheet will be created with this name.
                  </p>
                </>
              )}
            </div>
            
            {/* Step 3: Email Configuration */}
            <div style={{ 
              marginBottom: '2rem',
              padding: '2rem',
              border: '1px solid #e0e0e0',
              borderRadius: '12px',
              background: '#fff'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <EmailIcon sx={{ fontSize: '1.5rem', color: 'var(--color-primary)' }} />
                <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Notification Email</h2>
              </div>
              
              <label style={{ 
                display: 'block', 
                marginBottom: '0.75rem', 
                fontWeight: 500,
                color: '#333',
                fontSize: '0.9375rem'
              }}>
                Email address to receive form submission notifications:
              </label>
              <input
                type="email"
                value={ownerEmail}
                onChange={e => setOwnerEmail(e.target.value)}
                placeholder="your-email@example.com"
                aria-label="Email address for form submission notifications"
                aria-required="true"
                style={{ 
                  width: '100%', 
                  padding: '0.75rem',
                  fontSize: '1rem',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
              />
              <p style={{ 
                fontSize: '0.8125rem', 
                color: '#666', 
                marginTop: '0.5rem',
                marginBottom: 0
              }}>
                You&apos;ll receive an email notification for each form submission.
              </p>
            </div>
            
            {/* Save Button */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center',
              alignItems: 'center',
              gap: '0.75rem',
              marginTop: '2.5rem'
            }}>
              <Button 
                variant="primary" 
                onClick={saveConfig}
                disabled={
                  saving || 
                  loading ||
                  !initialConfig ||
                  !ownerEmail?.trim() || 
                  (sheetMode === 'existing' ? !sheetId : !sheetName?.trim()) ||
                  !hasChanges()
                }
              >
                {saving ? 'Saving...' : 'Save Configuration'}
              </Button>
              {saving && (
                <CircularProgress size={20} sx={{ color: 'var(--color-primary)' }} />
              )}
            </div>
          </div>
        )}
          </>
        )}
        </div>
      </section>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Always allow page to render - admin check happens client-side after OAuth connection
  return {
    props: {
      cms: JSON.stringify(getCMSById(process.env.EVENT_ID)),
    },
  };
};
