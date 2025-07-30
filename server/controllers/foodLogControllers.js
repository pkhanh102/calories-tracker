const { createFoodLog, getFoodLogsByDate, updateFoodLog, deletedFoodLog, } = require('../models/foodLogModel');

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

// PUT /api/logs/:id
const handleUpdateLog = async (req, res) => {
    try {
        const userId = req.user.id;
        const logId = req.params.id;
        const { consumed_amount, meal_type, date } = req.body;
        
        if (!consumed_amount || !meal_type || !date) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const updatedLog = await updateFoodLog(logId, userId, { consumed_amount, meal_type, date, });

        if (!updatedLog) {
            return res.status(400).json({ message: 'Log not found or not authorized' });
        }

        res.status(200).json(updatedLog);
        
    } catch (err) {
        console.error('Error updating food log:', err);
        return res.status(500).json({ message: 'Server error updating log' });
    }
};

// DELETE /api/logs/:id
const handleDeleteLog = async (req, res) => {
    try {
        const userId = req.user.id;
        const logId = req.params.id;

        const deletedLog = await deletedFoodLog(logId, userId);

        if (!deletedLog) {
            return res.status(404).json({ message: 'Log not found or not authorized' })
        }

        res.status(200).json(deletedLog)
    } catch (err) {
        console.error('Error deleting food log:', err);
        res.status(500).json({ message: 'Server error deleting log' });
    }
};

module.exports = {
    handleCreateLog,
    handleGetLogsByDate,
    handleUpdateLog,
    handleDeleteLog,
}