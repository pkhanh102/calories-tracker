const pool = require('../db');

// Create or update a user nutrition goal 
const upsertNutritionGoal = async (userId, data) => {
    const { calories_goal, protein_percent, carb_percent, fat_percent } = data;
    
    const result = await pool.query(
        `INSERT INTO nutrition_goals
            (user_id, calories_goal, protein_percent, carb_percent, fat_percent)
        VALUES
            ($1, $2, $3, $4, $5)
        ON CONFLICT (user_id)
        DO UPDATE SET
            calories_goal = EXCLUDED.calories_goal,
            protein_percent = EXCLUDED.protein_percent,
            carb_percent = EXCLUDED.carb_percent,
            fat_percent = EXCLUDED.fat_percent,
            updated_at = CURRENT_TIMESTAMP
        RETURNING *`,
        [userId, calories_goal, protein_percent, carb_percent, fat_percent]
    );

    return result.rows[0];
};

// Fetch a user nutrition goal
const getNutritionGoalByUserId = async (userId) => {
    const result = await pool.query(
        `SELECT * FROM nutrition_goals WHERE user_id = $1`,
        [userId]
    );
    return result.rows[0];
};

module.exports = {
    upsertNutritionGoal,
    getNutritionGoalByUserId,
}