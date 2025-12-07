import app from "./app.js";
import dotenv from "dotenv";
import http from "http";
import https from "https";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import trieService from "./services/search.service.js";
import { initServer } from './WebRTC/index.js'

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Try to load SSL certificates for HTTPS
let server;
try {
    const sslKeyPath = path.join(__dirname, 'ssl', 'key.pem');
    const sslCertPath = path.join(__dirname, 'ssl', 'cert.pem');
    
    if (fs.existsSync(sslKeyPath) && fs.existsSync(sslCertPath)) {
        const privateKey = fs.readFileSync(sslKeyPath, 'utf8');
        const certificate = fs.readFileSync(sslCertPath, 'utf8');
        const credentials = { key: privateKey, cert: certificate };
        
        server = https.createServer(credentials, app);
        console.log("🔒 HTTPS server initialized with mkcert certificates");
    } else {
        console.log("⚠️  SSL certificates not found.");
        console.log("💡 Run: bash setup-mkcert.sh");
        console.log("📡 Starting HTTP server");
        server = http.createServer(app);
    }
} catch (error) {
    console.error("❌ Error loading SSL certificates:", error.message);
    console.log("📡 Falling back to HTTP server");
    server = http.createServer(app);
}

const PORT = process.env.PORT || 3000;

server.listen(PORT, "0.0.0.0", () => {
    initServer(server);
    trieService.initialize();
    const protocol = server instanceof https.Server ? 'https' : 'http';
    console.log(`\n🚀 Server running on ${protocol}://0.0.0.0:${PORT}`);
    console.log(`🌐 Local: ${protocol}://localhost:${PORT}`);
    console.log(`🌐 Network: ${protocol}://192.168.1.50:${PORT}\n`);
});
