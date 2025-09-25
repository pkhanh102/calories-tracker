import React, { useEffect, useState } from "react";
import axios from 'axios';

function LogFoodPage() {
    const [savedFoods, setSavedFoods] = useState([]);
    const [form, setForm] = useState({
        saved_food_id: '',
        consumed_amount: '',
        meal_type: 'breakfast',
        date: new Date().toISOString().split('T')[0]
    });
    const [message, setMessage] = useState('');

    const token = localStorage.getItem('token');

    // Fetch saved foods on mount
    useEffect(() => {
        const fetchFood = async () => {
            try {
                const res = await axios.get('http://localhost:4000/api/foods', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setSavedFoods(res.data);
            } catch (err) {
                console.error('Error fetching foods:', err);
            }
        };
        fetchFood();
    }, [token]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:4000/api/logs', {
                saved_food_id: form.saved_food_id,
                consumed_amount: form.consumed_amount,
                meal_type: form.meal_type,
                date: form.date
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage('✅ Food log created!');
            setForm({
                saved_food_id: '',
                consumed_amount: '',
                meal_type: 'breakfast',
                date: new Date().toISOString().split('T')[0]
            });
        } catch (err) {
            console.error('Log error:', err);
            setMessage('❌ Failed to log food. Try again.');
        }
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h2>Log Food</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Food:</label><br />
                    <select name="saved_food_id" value={form.saved_food_id} onChange={handleChange} required>
                        <option value="">-- Select Food --</option>
                        {savedFoods.map(food => (
                            <option key={food.id} value={food.id}>
                                {food.name} ({food.base_amount}{food.unit})
                            </option>
                        ))}
                    </select>
                </div>
                <br />

                <div>
                    <label>Amount consumed:</label><br />
                    <input 
                        type="number"
                        name="consumed_amount"
                        value={form.consumed_amount}
                        onChange={handleChange}
                        required
                    />
                </div>
                <br />

                <div>
                    <label>Meal Type:</label><br />
                    <select name="meal_type" value={form.meal_type} onChange={handleChange}>
                        <option value="breakfast">Breakfast</option>
                        <option value="lunch">Lunch</option>
                        <option value="dinner">Dinner</option>
                        <option value="snack">Snack</option>
                    </select>
                </div>
                <br />

                <div>
                    <label>Date:</label><br />
                    <input
                        type="date"
                        name="date"
                        value={form.date}
                        onChange={handleChange}
                        required
                    />
                </div>
                <br />
                
                <button type="submit">Log Food</button>
            </form>
            <br />
            {message && <p>{message}</p>}
        </div>
    );
}

export default LogFoodPage