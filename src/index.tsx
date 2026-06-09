import { useState, useEffect } from 'react'

export interface TwoFactorAuthProps {
    apiEndpoint: string
    onEnabled?: () => void
    onDisabled?: () => void
    onError?: (msg: string) => void
}

function apiFetch(endpoint: string, body: object) {
    return fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ format: 'json', ...body }),
    }).then(r => r.json())
}

export default function TwoFactorAuth({ apiEndpoint, onEnabled, onDisabled, onError }: TwoFactorAuthProps) {
    const [step, setStep]       = useState<'idle' | 'setup' | 'backup'>('idle')
    const [qrCode, setQrCode]   = useState('')
    const [secret, setSecret]   = useState('')
    const [code, setCode]       = useState('')
    const [enabled, setEnabled] = useState(false)
    const [loading, setLoading] = useState(false)
    const [statusLoading, setStatusLoading] = useState(true)
    const [backupCode, setBackupCode]       = useState('')
    const [copied, setCopied]               = useState(false)
    const [error, setError]                 = useState('')

    useEffect(() => {
        apiFetch(apiEndpoint, { method: 'get_2fa_status' }).then(d => {
            if (!d?.error) setEnabled(d?.data?.enabled ?? false)
            setStatusLoading(false)
        })
    }, [])

    const generateQR = async () => {
        setLoading(true)
        const d = await apiFetch(apiEndpoint, { method: 'generate_2fa_secret' })
        if (!d?.error && d?.data?.qr_code) {
            setQrCode(d.data.qr_code)
            setSecret(d.data.secret)
            setStep('setup')
        } else {
            onError?.('Failed to generate QR code')
        }
        setLoading(false)
    }

    const verifyCode = async () => {
        if (code.length !== 6) return
        setLoading(true)
        setError('')
        const d = await apiFetch(apiEndpoint, { method: 'verify_2fa_code', code, secret })
        if (!d?.error) {
            const bc = await apiFetch(apiEndpoint, { method: 'generate_backup_codes' })
            setEnabled(true)
            setCode('')
            if (!bc?.error && bc?.data?.codes) {
                setBackupCode(bc.data.codes[0])
                setStep('backup')
            } else {
                setStep('idle')
                onEnabled?.()
            }
        } else {
            setError('Invalid code. Please check your authenticator app.')
        }
        setLoading(false)
    }

    const disable2FA = async () => {
        if (!window.confirm('Are you sure you want to disable 2FA?')) return
        setLoading(true)
        const d = await apiFetch(apiEndpoint, { method: 'disable_2fa' })
        if (!d?.error) {
            setEnabled(false)
            onDisabled?.()
        } else {
            onError?.('Failed to disable 2FA')
        }
        setLoading(false)
    }

    const copy = () => {
        navigator.clipboard.writeText(backupCode)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    if (statusLoading) return <p style={{ color: '#888' }}>Loading...</p>

    return (
        <div style={{ padding: '24px', border: '1px solid #eee', borderRadius: '8px', maxWidth: '480px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>Two-Factor Authentication</h2>
            <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>
                Secure your account with Google Authenticator or any TOTP app.
            </p>

            {/* Status */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <span style={{ fontSize: '14px' }}>Status:</span>
                <span style={{
                    padding: '2px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 'bold',
                    background: enabled ? '#d1fae5' : '#fee2e2',
                    color: enabled ? '#065f46' : '#991b1b'
                }}>
                    {enabled ? 'ENABLED' : 'DISABLED'}
                </span>
                {enabled && step === 'idle' && (
                    <button onClick={disable2FA} disabled={loading}
                        style={{ marginLeft: 'auto', padding: '6px 14px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                        {loading ? 'Removing...' : 'Remove 2FA'}
                    </button>
                )}
            </div>

            {/* Setup button */}
            {step === 'idle' && !enabled && (
                <button onClick={generateQR} disabled={loading}
                    style={{ padding: '8px 18px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                    {loading ? 'Loading...' : 'Setup Authenticator'}
                </button>
            )}

            {/* QR step */}
            {step === 'setup' && (
                <div>
                    <p style={{ fontSize: '14px', marginBottom: '8px' }}>1. Install Google Authenticator or any TOTP app</p>
                    <p style={{ fontSize: '14px', marginBottom: '12px' }}>2. Scan this QR code:</p>
                    <img src={qrCode} alt="QR Code" style={{ width: '180px', height: '180px', marginBottom: '12px' }} />
                    <p style={{ fontSize: '12px', color: '#888', marginBottom: '16px' }}>
                        Manual code: <code style={{ background: '#f3f4f6', padding: '2px 6px', borderRadius: '4px' }}>{secret}</code>
                    </p>
                    <p style={{ fontSize: '14px', marginBottom: '8px' }}>3. Enter the 6-digit code:</p>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        <input type="text" maxLength={6} placeholder="000000" value={code}
                            onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
                            style={{ width: '120px', textAlign: 'center', fontSize: '18px', letterSpacing: '6px', padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px' }}
                            autoFocus />
                        <button onClick={verifyCode} disabled={loading || code.length !== 6}
                            style={{ padding: '8px 18px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                            {loading ? 'Verifying...' : 'Verify & Enable'}
                        </button>
                        <button onClick={() => { setStep('idle'); setCode('') }}
                            style={{ padding: '8px 18px', background: '#fff', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '6px', cursor: 'pointer' }}>
                            Cancel
                        </button>
                    </div>
                    {error && <p style={{ color: '#ef4444', fontSize: '13px', marginTop: '8px' }}>{error}</p>}
                </div>
            )}

            {/* Backup code */}
            {step === 'backup' && (
                <div>
                    <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#065f46', marginBottom: '8px' }}>✅ 2FA Enabled! Save Your Backup Code</p>
                    <p style={{ fontSize: '13px', color: '#666', marginBottom: '12px' }}>
                        Use this code if you lose access to your authenticator app. Works until 2FA is disabled.
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#f9fafb', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px' }}>
                        <span style={{ fontFamily: 'monospace', fontSize: '20px', fontWeight: 'bold', letterSpacing: '4px' }}>{backupCode}</span>
                        <button onClick={copy}
                            style={{ marginLeft: 'auto', padding: '6px 14px', background: '#fff', border: '1px solid #4f46e5', color: '#4f46e5', borderRadius: '6px', cursor: 'pointer' }}>
                            {copied ? 'Copied!' : 'Copy'}
                        </button>
                    </div>
                    <button onClick={() => setStep('idle')}
                        style={{ padding: '8px 18px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                        Done
                    </button>
                </div>
            )}
        </div>
    )
}
