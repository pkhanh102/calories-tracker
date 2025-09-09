const express = require('express');
const router = express.Router();

const {
    handleCreateLog,
    handleGetLogsByDate,
    handleUpdateLog,
    handleDeleteLog,
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

// @route   PUT /api/logs/:id
// @desc    Update food logs 
// @access  Private
router.put('/:id', authMiddleware, handleUpdateLog);

// @route   DELETE /api/logs/:id
// @desc    Delete food logs 
// @access  Private
router.delete('/:id', authMiddleware, handleDeleteLog);

module.exports = router;
