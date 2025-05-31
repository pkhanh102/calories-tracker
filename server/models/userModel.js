const db = require('../db')

const findUserByEmail = async (email) => {
    const result = await db.query(`SELECT * FROM users WHERE email = $1`, [email]);
    return result.rows[0];
};

const createUser = async (email, hashedPassword) => {
    const result = await db.query(
        `INSERT INTO users (email, password)
        VALUES ($1, $2)
        RETURNING id, email`,
        [email, hashedPassword]
    );
    return result.rows[0];
};

module.exports = { findUserByEmail, createUser };