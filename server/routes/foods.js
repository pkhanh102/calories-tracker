const express = require('express');
const router = express.Router();

const {
    handleCreateFood,
    handleUpdateFood,
    handleGetFood,
    handleDeleteFood,
} = require('../controllers/savedFoodControllers');

const authMiddleware = require('../middleware/authMiddleware');

// @route   POST /api/foods
// @desc    Create a new saved food
// @access  Private
router.post('/', authMiddleware, handleCreateFood);

// @route   GET /api/foods
// @desc    Get all saved foods for the logged-in user
// @access  Private
router.get('/', authMiddleware, handleGetFood);

// @route   PUT /api/foods/:id
// @desc    Update a saved foods
// @access  Private
router.put('/:id', authMiddleware, handleUpdateFood);

// @route   DELETE /api/foods/:id
// @desc    Delete a saved foods
// @access  Private
router.delete('/:id', authMiddleware, handleDeleteFood);

module.exports = router;
