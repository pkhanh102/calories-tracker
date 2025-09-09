const {
    upsertNutritionGoal,
    getNutritionGoalByUserId,
} = require('../models/nutritionGoalModel');

// POST /api/goals -> Create or update nutrition goal
const handleSetGoal = async (req, res) => {
    try {
        const userId = req.user.id;
        const { calories_goal, protein_percent, carb_percent, fat_percent } = req.body;

        // Validate required fields
        if (calories_goal == null || protein_percent == null || carb_percent == null || fat_percent == null) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const total = protein_percent + carb_percent + fat_percent;
        if (total != 100) {
            return res.status(400).json({ message: 'Protein, carb, and fat percentages must be total 100%' });
        }

        const saved = await upsertNutritionGoal(userId, {calories_goal, protein_percent, carb_percent, fat_percent,});

        res.status(200).json(saved);

    } catch (err) {
        console.error('Error saving goal:', err);
        res.status(500).json({ message: 'Server error saving goal' });
    }
};

// GET /api/goals -> Fetch goal
const handleGetGoal = async (req, res) => {
    try {
        const userId = req.user.id;

        const goal = await getNutritionGoalByUserId(userId);

        if (!goal) {
            return res.status(404).json({ message: 'No nutrition goal found for user' });
        }

        res.status(200).json(goal);
    } catch (err) {
        console.error('Error fetching goal:', err);
        res.status(500).json({ message: 'Server error fetching goal' });
    }
};

module.exports = {
    handleGetGoal,
    handleSetGoal,
}