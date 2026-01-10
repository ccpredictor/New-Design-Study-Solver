
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

const DIST_DIR = path.join(__dirname, 'dist');
import fs from 'fs';

if (!fs.existsSync(DIST_DIR)) {
    console.error('CRITICAL ERROR: "dist" directory not found. The application was not built.');
    console.error('Make sure "npm run build" runs before starting the server.');
    // Do not exit, try to serve anyway to keep container alive for logs, but it will fail 404
} else {
    console.log(`Serving static files from ${DIST_DIR}`);
}

// Serve static files from the 'dist' directory
app.use(express.static(DIST_DIR));

// Handle SPA routing: serve index.html for all non-static requests
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
