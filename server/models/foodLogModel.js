const pool = require('../db');

// Create a new food log
const createFoodLog = async (userId, data) => {
    const { saved_food_id, consumed_amount, meal_type, date } = data;
    
    const result = await pool.query(
        `INSERT INTO food_logs
        (user_id, saved_food_id, consumed_amount, meal_type, date)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *`,
        [userId, saved_food_id, consumed_amount, meal_type, date]
    );

    return result.rows[0];
}

// Get food logs for a specific user and date
const getFoodLogsByDate = async (userId, date) => {
    const result = await pool.query(
        `SELECT fl.*, sf.name, sf.base_amount, sf.unit,
                sf.calories, sf.protein, sf.carbs, sf.fats
        FROM food_logs fl
        JOIN saved_foods sf ON fl.saved_food_id = sf.id
        WHERE fl.user_id = $1 AND fl.date = $2
        ORDER BY fl.meal_type, fl.created_at`,
        [userId, date]
    );

    return result.rows;
};

module.exports = {
    createFoodLog,
    getFoodLogsByDate,
};