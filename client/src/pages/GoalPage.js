import React, { useEffect, useState } from "react";
import axios from 'axios';

function GoalPage() {
    const [goals, setGoals] = useState({
        calories_goal: '',
        protein_percent: '',
        carb_percent: '',
        fat_percent: ''
    });

    const [message, setMessage] = useState('');

    // Fetch existing goal
    useEffect(() => {
        const fetchGoals = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:4000/api/goals', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setGoals(res.data)
            } catch (err) {
                console.error(err);
                setMessage('⚠️ Failed to fetch goals');
            }
        };

        fetchGoals();
    }, []);


    const handleChange = (e) => {
        setGoals((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate macro %
        const totalPercent = 
            Number(goals.protein_percent) +
            Number(goals.carb_percent) +
            Number(goals.fat_percent);
        if (totalPercent !== 100) {
            setMessage('⚠️ Macronutrient percentages must total 100%');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:4000/api/goals', {
                calories_goal: Number(goals.calories_goal),
                protein_percent: Number(goals.protein_percent),
                carb_percent: Number(goals.carb_percent),
                fat_percent: Number(goals.fat_percent),
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage('✅ Goals updated successfully!');
        } catch (err) {
            console.error(err);
            setMessage('❌ Failed to update goals');
        }
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h2>SetNutritionGoal</h2>
            <form onSubmit={handleSubmit}>
                <label>Daily Calories:</label><br />
                <input
                    type="number"
                    name="calories_goal"
                    value={goals.calories_goal}
                    onChange={handleChange}
                    required
                /><br /><br />

                <label>Protein %:</label><br />
                <input
                    type="number"
                    name="protein_percent"
                    value={goals.protein_percent}
                    onChange={handleChange}
                    required
                /><br /><br />

                <label>Carb %:</label><br />
                <input
                    type="number"
                    name="carb_percent"
                    value={goals.carb_percent}
                    onChange={handleChange}
                    required
                /><br /><br />

                <label>Fat %:</label><br />
                <input
                    type="number"
                    name="fat_percent"
                    value={goals.fat_percent}
                    onChange={handleChange}
                    required
                /><br /><br />

                <button type="submit">Update Goals</button>
            </form>

            <br />
            {message && <p>{message}</p>}
        </div>
    );
}


export default GoalPage;