# HTTPS Setup Guide

## SSL Certificates Generated ✓

Self-signed SSL certificates have been created in the `ssl/` directory for development.

## Starting the Server

The server now automatically uses HTTPS if certificates are found:

```bash
npm run dev
```

You should see:
```
🔒 HTTPS server initialized
🚀 Server running on https://0.0.0.0:3000
🌐 Local: https://localhost:3000
🌐 Network: https://192.168.1.50:3000
```

## Browser Security Warning

Since these are self-signed certificates, your browser will show a security warning. This is normal for development.

### How to bypass the warning:

**Chrome/Edge:**
1. Click "Advanced"
2. Click "Proceed to 192.168.1.50 (unsafe)"

**Firefox:**
1. Click "Advanced"
2. Click "Accept the Risk and Continue"

**Safari:**
1. Click "Show Details"
2. Click "visit this website"
3. Confirm

## Cookie Settings

With HTTPS enabled, cookies are now set with:
- `secure: true` - Only sent over HTTPS
- `sameSite: 'none'` - Allows cross-origin requests
- `httpOnly: true` - Not accessible via JavaScript

## Frontend Configuration

The frontend is now configured to use HTTPS:
- API: `https://192.168.1.50:3000`
- Socket.IO: `https://192.168.1.50:3000`

## Regenerating Certificates

If you need to regenerate the certificates (e.g., for a different IP):

```bash
./generate-ssl-cert.sh
```

Or manually:
```bash
openssl req -x509 -newkey rsa:4096 -keyout ssl/key.pem -out ssl/cert.pem -days 365 -nodes -subj "/C=US/ST=State/L=City/O=Organization/CN=192.168.1.50"
```

## Production Deployment

For production, use proper SSL certificates from:
- Let's Encrypt (free)
- Your hosting provider
- Commercial SSL certificate provider

Replace the self-signed certificates with production ones in the `ssl/` directory.
