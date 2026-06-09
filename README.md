# react-2fa-totp

A reusable Two-Factor Authentication (2FA) component for React and Next.js apps.

## Features

- QR code based setup
- Works with Google Authenticator, Microsoft Authenticator, any TOTP app
- Backup code generation
- Enable / Disable 2FA
- No external UI dependencies

## Installation

```bash
npm install github:mubeen3011/react-2fa-totp

- Create your settings page app/settings/page.tsx:
"use client"
import TwoFactorAuth from 'react-2fa-totp'

export default function SettingsPage() {
    return (
        <TwoFactorAuth
            apiEndpoint="/api/2fa"
            onEnabled={() => console.log('2FA Enabled')}
            onDisabled={() => console.log('2FA Disabled')}
            onError={(msg) => console.log('Error:', msg)}
        />
    )
}

-Create app/api/2fa/route.ts in your Next.js project:


import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    const body = await request.json()
    const method = body.method

    if (method === 'get_2fa_status') {
        // Check from DB if 2FA is enabled for this user
        return NextResponse.json({ data: { enabled: false } })
    }

    if (method === 'generate_2fa_secret') {
        // Generate TOTP secret and QR code, save secret to DB
        return NextResponse.json({
            data: {
                secret: 'YOUR_GENERATED_SECRET',
                qr_code: 'YOUR_QR_CODE_BASE64_IMAGE',
            }
        })
    }

    if (method === 'verify_2fa_code') {
        // Verify 6-digit code during setup, enable 2FA in DB
        const { code, secret } = body
        return NextResponse.json({ data: { message: 'verified' } })
    }

    if (method === 'generate_backup_codes') {
        // Generate 1 permanent backup code, save hash to DB
        return NextResponse.json({ data: { codes: ['XXXX-XXXX'] } })
    }

    if (method === 'disable_2fa') {
        // Disable 2FA in DB, delete backup codes
        return NextResponse.json({ data: { message: 'disabled' } })
    }

    if (method === 'verify_totp_login') {
        // Verify 6-digit code at login time
        const { code } = body
        return NextResponse.json({ data: { message: 'login verified' } })
    }

    if (method === 'verify_backup_code') {
        // Verify backup code at login time
        const { code } = body
        return NextResponse.json({ data: { message: 'backup code accepted' } })
    }

    return NextResponse.json({ error: true, message: 'Unknown method' })
}


