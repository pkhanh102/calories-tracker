const express = require('express');
const router = express.Router();

const { handleGetSummary, handleGet7DaySummary } = require('../controllers/summaryController');
const authMiddleware = require('../middleware/authMiddleware');

// GET /api/summary?date=YYYY-MM-DD
router.get('/', authMiddleware, handleGetSummary);

router.get('/7days', authMiddleware, handleGet7DaySummary);

module.exports = router;