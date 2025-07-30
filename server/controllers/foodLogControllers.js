const { createFoodLog, getFoodLogsByDate } = require('../models/foodLogModel');

// POST /api/logs
const handleCreateLog = async (req, res) => {
    try {
        const userId = req.user.id;
        const { saved_food_id, consumed_amount, meal_type, date } = req.body;

        
        if (!saved_food_id || !consumed_amount || !meal_type || !date) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const newLog = await createFoodLog(userId, { saved_food_id, consumed_amount, meal_type, date, });

        res.status(201).json(newLog);

    } catch (err) {
        console.error('Error creating food logs:', err);
        res.status(500).json({ message: 'Server error creating log' });
    }
};

// GET /api/logs?date=YYYY-MM-DD
const handleGetLogsByDate = async (req, res) => {
    try {
        const userId = req.user.id;
        const date = req.query.date;

        if (!date) {
            return res.status(400).json({ message: 'Date query parameter is required' });
        }

        const logs = await getFoodLogsByDate(userId, date);

        // Calculate nutrients for each log
        const enhancedLogs = logs.map(log => {
            const ratio = parseFloat(log.consumed_amount) / parseFloat(log.base_amount);

            return {
                ...log,
                calculated_calories: parseFloat((ratio * log.calories).toFixed(1)),
                calculated_protein: parseFloat((ratio * log.protein).toFixed(1)),
                calculated_carbs: parseFloat((ratio * log.carbs).toFixed(1)),
                calculated_fats: parseFloat((ratio * log.fats).toFixed(1)),
            }
        })

        res.status(200).json(enhancedLogs);

    } catch (err) {
        console.error('Error fetching food logs:', err);
        res.status(500).json({ message: 'Server error fetching log' });
    }
};

module.exports = {
    handleCreateLog,
    handleGetLogsByDate,
}