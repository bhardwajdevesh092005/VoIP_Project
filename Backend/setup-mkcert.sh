#!/bin/bash

echo "🔐 Setting up mkcert for trusted local certificates"
echo ""

# Check if mkcert is installed
if ! command -v mkcert &> /dev/null
then
    echo "📦 mkcert not found. Installing..."
    
    # Detect OS and install mkcert
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        if command -v apt-get &> /dev/null; then
            echo "Installing mkcert via apt..."
            sudo apt update
            sudo apt install -y libnss3-tools
            wget https://github.com/FiloSottile/mkcert/releases/download/v1.4.4/mkcert-v1.4.4-linux-amd64
            chmod +x mkcert-v1.4.4-linux-amd64
            sudo mv mkcert-v1.4.4-linux-amd64 /usr/local/bin/mkcert
        elif command -v yum &> /dev/null; then
            echo "Installing mkcert via yum..."
            sudo yum install -y nss-tools
            wget https://github.com/FiloSottile/mkcert/releases/download/v1.4.4/mkcert-v1.4.4-linux-amd64
            chmod +x mkcert-v1.4.4-linux-amd64
            sudo mv mkcert-v1.4.4-linux-amd64 /usr/local/bin/mkcert
        else
            echo "❌ Unsupported Linux distribution"
            exit 1
        fi
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        if command -v brew &> /dev/null; then
            echo "Installing mkcert via Homebrew..."
            brew install mkcert
        else
            echo "❌ Please install Homebrew first: https://brew.sh"
            exit 1
        fi
    else
        echo "❌ Unsupported operating system"
        exit 1
    fi
fi

echo "✅ mkcert is installed"
echo ""

# Install local CA
echo "📜 Installing local Certificate Authority..."
mkcert -install

# Create ssl directory
mkdir -p ssl

# Generate certificates
echo ""
echo "🔑 Generating certificates for localhost and 192.168.1.50..."
cd ssl
mkcert localhost 127.0.0.1 192.168.1.50 ::1

# Rename files to match server expectations
mv localhost+3.pem cert.pem
mv localhost+3-key.pem key.pem

echo ""
echo "✅ Setup complete!"
echo ""
echo "📁 Certificates created in ssl/ directory:"
echo "   - cert.pem (Certificate)"
echo "   - key.pem (Private Key)"
echo ""
echo "🎉 Your browser will now trust these certificates!"
echo ""
echo "Next steps:"
echo "1. Start your backend: npm run dev"
echo "2. Access via: https://192.168.1.50:3000"
echo "3. No security warnings! 🎊"
