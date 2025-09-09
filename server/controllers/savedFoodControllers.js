const {
    createSavedFood,
    getSavedFoodsByUser,
    updateSavedFood,
    deleteSavedFood
} = require('../models/savedFoodModel');

// POST /api/foods
const handleCreateFood = async (req, res) => {
    try {
        const userId = req.user.id; // comes from JWT middleware
        const { name, base_amount, unit, calories, protein, carbs, fats } = req.body;

        if (!name || !base_amount || !unit || calories == null || protein == null || carbs == null || fats == null) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const newFood = await createSavedFood(userId, { name, base_amount, unit, calories, protein, carbs, fats, });
        res.status(201).json(newFood);

    } catch(err) {
        console.error('Error creating saved food:', err);
        res.status(500).json({ message: 'Server error creating food' });
    }
};

// GET /api/foods
const handleGetFood = async (req, res) => {
    try {
        const userId = req.user.id;

        const foods = await getSavedFoodsByUser(userId);
        res.status(200).json(foods);

    } catch(err) {
        console.error('Error getting saved foods:', err);
        res.status(500).json({ message: 'Server error fetching foods' });
    }
}

// PUT /api/foods
const handleUpdateFood = async (req, res) => {
    try {
        const userId = req.user.id;
        const foodId = req.params.id;
        const { name, base_amount, unit, calories, protein, carbs, fats } = req.body;

        if (!name || !base_amount || !unit || calories == null || protein == null || carbs == null || fats == null) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const updatedFood = await updateSavedFood(foodId, userId, {
            name,
            base_amount,
            unit,
            calories,
            protein,
            carbs,
            fats,
        });
        res.status(200).json(updatedFood);

    } catch(err) {
        console.error('Error updating saved food:', err);
        res.status(500).json({ message: 'Server error updating food' });
    }
};

// DELETE /api/foods
const handleDeleteFood = async (req, res) => {
    try {
        const userId = req.user.id;
        const foodId = req.params.id;

        const deletedFood = await deleteSavedFood(foodId, userId);

        if (!deletedFood) {
            return res.status(404).json({ message: 'Food not found or not owned by user' });
        }

        res.status(200).json(deletedFood);
        
    } catch(err) {
        console.error('Error deleting saved food:', err);
        res.status(500).json({ message: 'Server error deleting food' });
    }
}; 

module.exports = {
    handleCreateFood,
    handleGetFood,
    handleUpdateFood,
    handleDeleteFood,
}