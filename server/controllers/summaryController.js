const { getFoodLogsByDate } = require('../models/foodLogModel');
const { getNutritionGoalByUserId } = require('../models/nutritionGoalModel');

const handleGetSummary = async (req, res) => {
    try {
        const userId = req.user.id;
        const date = req.query.date;

        if (!date) {
            return res.status(400).json({ message: 'Date query parameter is required' });
        }

        const logs = await getFoodLogsByDate(userId, date);
        const goal = await getNutritionGoalByUserId(userId);

        // Default zero totals
        let totals = {
            calories: 0,
            protein: 0,
            carbs: 0,
            fats: 0
        };

        const byMeal = {
            breakfast: [],
            lunch: [],
            dinner: [],
            snack: []
        };

        logs.forEach(log => {
            const ratio = parseFloat(log.consumed_amount) / parseFloat(log.base_amount);
            const calculated = {
                ...log,
                calculated_calories: +(ratio * log.calories).toFixed(1),
                calculated_protein: +(ratio * log.protein).toFixed(1),
                calculated_carbs: +(ratio * log.carbs).toFixed(1),
                calculated_fats: +(ratio * log.fats).toFixed(1),
            };

            // Add to meal group
            if (byMeal[log.meal_type]) {
                byMeal[log.meal_type].push(calculated);
            }

            // Sum totals
            totals.calories += calculated.calculated_calories;
            totals.protein += calculated.calculated_protein;
            totals.carbs += calculated.calculated_carbs;
            totals.fats += calculated.calculated_fats;
        });

        // Round totals
        totals = {
            calories: +totals.calories.toFixed(1),
            protein: +totals.protein.toFixed(1),
            carbs: +totals.carbs.toFixed(1),
            fats: +totals.fats.toFixed(1)
        };

        // Compute goal grams if goal exists
        const goals = goal ? {
            calories_goal: goal.calories_goal,
            protein_goal_g: +(goal.calories_goal * goal.protein_percent / 100 / 4).toFixed(1),
            carb_goal_g: +(goal.calories_goal * goal.carb_percent / 100 / 4).toFixed(1),
            fat_goal_g: +(goal.calories_goal * goal.fat_percent / 100 / 9).toFixed(1)
        } : null;

        res.status(200).json({ totals, goals, by_meal: byMeal });

    } catch (err) {
        console.error('Error generating summary:', err);
        res.status(500).json({ message: 'Server error generating summary' });
    }
};

module.exports = { handleGetSummary };