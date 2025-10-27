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

// Update an existing food log by ID
const updateFoodLog = async (logId, userId, updatedData) => {
    const { consumed_amount, meal_type, date } = updatedData
    
    const result = await pool.query(
        `UPDATE food_logs
        SET consumed_amount = $1,
            meal_type = $2,
            date = $3
        WHERE id = $4 AND user_id = $5
        RETURNING *`,
        [consumed_amount, meal_type, date, logId, userId]
    );

    return result.rows[0]; // May be null if not found or unauthorized
};

// Delete a food log by ID
const deletedFoodLog = async (logId, userId) => {
    const result = await pool.query(
        `DELETE FROM food_logs
        WHERE id = $1 AND user_id = $2
        RETURNING *`,
        [logId, userId]
    );

    return result.rows[0];
};

const get7DayMacrosByUserId = async (userId) => {
    const query = `
        SELECT
            TO_CHAR(fl.date, 'YYYY-MM-DD') AS date,
            SUM((fl.consumed_amount / sf.base_amount) * sf.calories) AS total_calories,
            SUM((fl.consumed_amount / sf.base_amount) * sf.protein) AS total_protein,
            SUM((fl.consumed_amount / sf.base_amount) * sf.carbs) AS total_carbs,
            SUM((fl.consumed_amount / sf.base_amount) * sf.fats) AS total_fats
        FROM food_logs fl
        JOIN saved_foods sf ON fl.saved_food_id = sf.id
        WHERE fl.user_id = $1 AND fl.date >= CURRENT_DATE - INTERVAL '6 days'
        GROUP BY fl.date
        ORDER BY fl.date ASC;
    `;
    const { rows } = await pool.query(query, [userId]);
    return rows;
};

module.exports = {
    createFoodLog,
    getFoodLogsByDate,
    updateFoodLog,
    deletedFoodLog,
    get7DayMacrosByUserId,
};