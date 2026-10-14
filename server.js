/*  ============================================
    Lightweight dev server for the portfolio.
    Zero dependencies — uses Node.js built-ins.
    
    Usage:  node server.js
    Then open:  http://localhost:3000
    Admin:      http://localhost:3000/admin.html
    ============================================ */

const http = require('http');
const fs   = require('fs');
const path = require('path');

const PORT = 3000;
const ROOT = __dirname;
const DATA_FILE = path.join(ROOT, 'data.json');

// MIME type map
const MIME = {
    '.html': 'text/html',
    '.css':  'text/css',
    '.js':   'application/javascript',
    '.json': 'application/json',
    '.png':  'image/png',
    '.jpg':  'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif':  'image/gif',
    '.svg':  'image/svg+xml',
    '.ico':  'image/x-icon',
    '.webp': 'image/webp',
    '.woff': 'font/woff',
    '.woff2':'font/woff2',
};

const server = http.createServer((req, res) => {
    // ---- CORS headers (for local dev) ----
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        return res.end();
    }

    // ---- POST /api/save  —  save data.json ----
    if (req.method === 'POST' && req.url === '/api/save') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            try {
                // Validate JSON
                const parsed = JSON.parse(body);
                const pretty = JSON.stringify(parsed, null, 4);

                fs.writeFile(DATA_FILE, pretty, 'utf8', (err) => {
                    if (err) {
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        return res.end(JSON.stringify({ error: 'Failed to write data.json' }));
                    }
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true, message: 'data.json saved!' }));
                    console.log(`  ✔ data.json updated at ${new Date().toLocaleTimeString()}`);
                });
            } catch (e) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid JSON' }));
            }
        });
        return;
    }

    // ---- POST /api/upload-image  — save image to /images directory ----
    if (req.method === 'POST' && req.url === '/api/upload-image') {
        const chunks = [];
        req.on('data', chunk => chunks.push(chunk));
        req.on('end', () => {
            try {
                const buffer = Buffer.concat(chunks);
                const contentType = req.headers['content-type'] || '';
                
                let fileBuffer = buffer;
                let filename = 'profile_' + Date.now() + '.jpg';

                if (contentType.includes('multipart/form-data')) {
                    const boundaryMatch = contentType.match(/boundary=(?:"([^"]+)"|([^;]+))/);
                    if (boundaryMatch) {
                        const boundary = '--' + (boundaryMatch[1] || boundaryMatch[2]);
                        const parts = buffer.toString('binary').split(boundary);
                        for (let part of parts) {
                            if (part.includes('filename=')) {
                                const match = part.match(/filename="([^"]+)"/);
                                if (match && match[1]) {
                                    const ext = path.extname(match[1]) || '.jpg';
                                    filename = 'profile_' + Date.now() + ext;
                                }
                                
                                const headerEnd = part.indexOf('\r\n\r\n');
                                if (headerEnd !== -1) {
                                    const bodyString = part.substring(headerEnd + 4, part.lastIndexOf('\r\n'));
                                    fileBuffer = Buffer.from(bodyString, 'binary');
                                    break;
                                }
                            }
                        }
                    }
                }

                const imagesDir = path.join(ROOT, 'images');
                if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true });

                const targetPath = path.join(imagesDir, filename);
                fs.writeFile(targetPath, fileBuffer, (err) => {
                    if (err) {
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        return res.end(JSON.stringify({ error: 'Failed to save image' }));
                    }
                    const relativePath = 'images/' + filename;
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true, path: relativePath }));
                    console.log(`  ✔ Uploaded photo saved to ${relativePath}`);
                });
            } catch (e) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: e.message }));
            }
        });
        return;
    }

    // ---- GET  —  serve static files ----
    let urlPath = req.url.split('?')[0];
    if (urlPath === '/') urlPath = '/index.html';
    else if (urlPath === '/admin') urlPath = '/admin.html';
    let filePath = path.join(ROOT, urlPath);

    // Security: prevent directory traversal
    if (!filePath.startsWith(ROOT)) {
        res.writeHead(403);
        return res.end('Forbidden');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('404 — Not Found');
            } else {
                res.writeHead(500);
                res.end('Server Error');
            }
            return;
        }

        // No-cache for data.json so edits show up immediately
        if (filePath.endsWith('data.json')) {
            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        }

        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
    });
});

server.listen(PORT, () => {
    console.log('');
    console.log('  ┌──────────────────────────────────────────┐');
    console.log(`  │   Portfolio server running on port ${PORT}     │`);
    console.log('  │                                          │');
    console.log(`  │   Site:   http://localhost:${PORT}          │`);
    console.log(`  │   Admin:  http://localhost:${PORT}/admin    │`);
    console.log('  │                                          │');
    console.log('  │   Press Ctrl+C to stop                   │');
    console.log('  └──────────────────────────────────────────┘');
    console.log('');
});
