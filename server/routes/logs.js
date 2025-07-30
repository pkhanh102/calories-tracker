const express = require('express');
const router = express.Router();

const {
    handleCreateLog,
    handleGetLogsByDate,
} = require('../controllers/foodLogControllers');

const authMiddleware = require('../middleware/authMiddleware');

// @route   POST /api/logs
// @desc    Log a food entry for a specific date and meal
// @access  Private
router.post('/', authMiddleware, handleCreateLog);

// @route   GET /api/logs?date=YYYY-MM-DD
// @desc    Get food logs by date
// @access  Private
router.get('/', authMiddleware, handleGetLogsByDate);

module.exports = router
