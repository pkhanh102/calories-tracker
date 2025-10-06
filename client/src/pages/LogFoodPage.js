import React, { useEffect, useState } from "react";
import axios from 'axios';
import API_BASE from "../apiConfig";

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
                const res = await axios.get(`${API_BASE}/foods`, {
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
            await axios.post(`${API_BASE}/logs`, {
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
        <div className="p-6 max-w-xl mx-auto">
            <h2 className="text-2xl font-bold text-green-700 mb-6">Log Food</h2>
            <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded shadow-sm">
                
                <div>
                    <label className="block text-sm font-medium text-gray-700">Food: </label>
                    <select name="saved_food_id" value={form.saved_food_id} onChange={handleChange} required className="w-full mt-1 p-2 border-gray-300 rounded">
                        <option value="">-- Select Food --</option>
                        {savedFoods.map(food => (
                            <option key={food.id} value={food.id}>
                                {food.name} ({food.base_amount}{food.unit})
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Amount consumed: </label>
                    <input 
                        type="number"
                        name="consumed_amount"
                        value={form.consumed_amount}
                        onChange={handleChange}
                        required
                        className="w-full mt-1 p-2 border border-gray-300 rounded"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Meal Type: </label>
                    <select name="meal_type" value={form.meal_type} onChange={handleChange} className="w-full mt-1 p-2 border border-gray-300 rounded">
                        <option value="breakfast">Breakfast</option>
                        <option value="lunch">Lunch</option>
                        <option value="dinner">Dinner</option>
                        <option value="snack">Snack</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Date: </label><br />
                    <input
                        type="date"
                        name="date"
                        value={form.date}
                        onChange={handleChange}
                        required
                        className="w-full mt-1 p-2 border border-gray-300 rounded"
                    />
                </div>
                
                <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded w-full">Log Food</button>
            </form>
            
            {message && <p className={`mt-4 text-center font-medium ${message.startsWith('✅') ? 'text-green-600' : 'text-red-600'}`}>{message}</p>}
        </div>
    );
}

export default LogFoodPage