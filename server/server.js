// ───────────────────────────────────────────────
// Server Setup for Calorie Tracker API
// ───────────────────────────────────────────────

// Load environment variables from .env
require('dotenv').config();

// Core dependencies
const express = require('express');
const cors = require('cors');

// Initialize app
const app = express();
const PORT = process.env.PORT || 4000;

// ───────────────────────────────────────────────
// Middleware
// ───────────────────────────────────────────────

// Enable CORS for cross-origin requests (frontend <-> backend)
app.use(cors());

// Parse JSON bodies in requests
app.use(express.json());

// ───────────────────────────────────────────────
// API Routes
// ───────────────────────────────────────────────

// Auth routes (register, login)
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Saved foods routes (CRUD)
const foodsRoutes = require('./routes/foods');
app.use('/api/foods', foodsRoutes);

// Food logs routes (log by date/meal)
const logRoutes = require('./routes/logs');
app.use('/api/logs', logRoutes);

// ───────────────────────────────────────────────
// Start Server
// ───────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});