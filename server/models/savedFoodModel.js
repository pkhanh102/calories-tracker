const pool = require('../db') // connect to PSQL

// Create a new saved food item 
const createSavedFood = async (userId, foodData) =>  {
    const { name, base_amount, unit, calories, protein, carbs, fats } = foodData;

    const result = await pool.query(
        `INSERT INTO saved_foods
        (user_id, name, base_amount, unit, calories, protein, carbs, fats)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *`,
        [userId, name, base_amount, unit, calories, protein, carbs, fats]
    );

    return result.rows[0];
};

const getSavedFoodsByUser = async (userId) => {
    const result = await pool.query(
        `SELECT * FROM saved_foods WHERE user_id = $1 ORDER BY created_at DESC`,
        [userId]
    );

    return result.rows;
}

// Update a saved food by id
const updateSavedFood = async (foodId, userId, updatedData) => {
    const { name, base_amount, unit, calories, protein, carbs, fats } = updatedData;

    const result = await pool.query(
        `UPDATE saved_foods
        SET name = $1, base_amount = $2, unit = $3,
            calories = $4, protein = $5, carbs = $6, fats = $7
        WHERE id = $8 and user_id = $9
        RETURNING *`,
        [name, base_amount, unit, calories, protein, carbs, fats, foodId, userId]
    );

    return result.rows[0];
};

// Delete a saved food by id
const deleteSavedFood = async (foodId, userId) => {
    const result = await pool.query(
        `DELETE FROM saved_foods WHERE id = $1 AND user_id = $2 RETURNING *`,
        [foodId, userId]
    );

    return result.rows[0];
};

module.exports = {
    createSavedFood,
    getSavedFoodsByUser,
    updateSavedFood,
    deleteSavedFood,
}