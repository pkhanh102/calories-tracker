const express = require('express');
const router = express.Router();

const { handleGetSummary } = require('../controllers/summaryController');
const authMiddleware = require('../middleware/authMiddleware');

// GET /api/summary?date=YYYY-MM-DD
router.get('/', authMiddleware, handleGetSummary);

module.exports = router;