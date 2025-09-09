const express = require('express');
const router = express.Router();

const {
    handleSetGoal,
    handleGetGoal,
} = require('../controllers/nutritionGoalController');

const authMiddleware = require('../middleware/authMiddleware');

// Set or update goal
router.post('/', authMiddleware, handleSetGoal);

// Get current goal
router.get('/', authMiddleware, handleGetGoal);

module.exports = router;