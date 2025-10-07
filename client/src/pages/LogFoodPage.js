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
        <div className="min-h-screen bg-gray-50 p-6 flex items-start justify-center">
            <div className="w-full max-w-md">
                <h2 className="text-2xl font-bold text-green-700 mb-4 text-center">Log Food</h2>

                <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow max-w-md">
                    {/* Food dropdown */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Food</label>
                        <select
                        name="saved_food_id"
                        value={form.saved_food_id}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded"
                        >
                        <option value="">-- Select Food --</option>
                        {savedFoods.map(food => (
                            <option key={food.id} value={food.id}>
                            {food.name} ({food.base_amount}{food.unit})
                            </option>
                        ))}
                        </select>
                    </div>

                    {/* Amount consumed */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Amount Consumed</label>
                        <input
                        type="number"
                        name="consumed_amount"
                        value={form.consumed_amount}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>

                    {/* Meal type */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Meal Type</label>
                        <select
                        name="meal_type"
                        value={form.meal_type}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        >
                        <option value="breakfast">Breakfast</option>
                        <option value="lunch">Lunch</option>
                        <option value="dinner">Dinner</option>
                        <option value="snack">Snack</option>
                        </select>
                    </div>

                    {/* Date */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                        <input
                        type="date"
                        name="date"
                        value={form.date}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="mb-2">
                        <button
                        type="submit"
                        className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
                        >
                        Log Food
                        </button>
                    </div>

                    {/* Message */}
                    {message && (
                        <p className={`text-center font-medium ${message.startsWith('✅') ? 'text-green-600' : 'text-red-600'}`}>
                        {message}
                        </p>
                    )}
                    </form>
            </div>
        </div>
    );
}

export default LogFoodPage