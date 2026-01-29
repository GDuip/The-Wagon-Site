// server.js
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

// --- INITIALIZATION ---
const app = express();
const PORT = process.env.PORT || 8080;

// Get directory name in ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- MIDDLEWARE SETUP ---

// Security headers
app.use(helmet());

// Enable CORS for all routes (customize in production if needed)
app.use(cors());

// JSON and URL-encoded body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parsing
app.use(cookieParser());

// HTTP request logging (use 'tiny' for production, 'dev' for development)
app.use(morgan(process.env.NODE_ENV === 'production' ? 'tiny' : 'dev'));

// --- STATIC FILE SERVING ---
// Serve your HTML, CSS, JS files from a 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// --- API ROUTES ---

// Example API route to demonstrate functionality
app.get('/api/status', (req, res) => {
  res.status(200).json({
    status: 'online',
    timestamp: new Date().toISOString(),
    message: 'The Wagon is running.'
  });
});

// Example route using cookies
app.get('/api/track', (req, res) => {
  let visitCount = parseInt(req.cookies.visitCount, 10) || 0;
  visitCount++;
  
  res.cookie('visitCount', visitCount, { maxAge: 900000, httpOnly: true });
  res.json({ message: `This is visit #${visitCount}` });
});


// --- ERROR HANDLING ---

// 404 handler for routes not found
app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'Something went wrong on our end.'
  });
});

// --- SERVER START ---
app.listen(PORT, () => {
  console.log(`[SERVER] The Wagon Site is live on http://localhost:${PORT}`);
});
