import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import dayjs from 'dayjs';
import API_BASE from "../apiConfig";

function DashboardPage() {
    const navigate = useNavigate();
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchSummary = async () => {
            try {
                const today = dayjs().format('YYYY-MM-DD');
                const res = await axios.get(`${API_BASE}/summary?date=${today}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setSummary(res.data);
                setLoading(false);
            } catch (err) {
                console.error('Failed to fetch summary:', err);
                setLoading(false);
            }
        };

        fetchSummary();
    }, [navigate]);

    if (loading) return <p className='p-6 text-gray=600'>Loading...</p>;

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-green-700 mb-6">Dashboard</h2>

            <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Today's Nutrition Summary</h3>
                {summary ? (
                    <div className="space-y-1 text-gray-700">
                        <p>Calories: <strong>{summary.totals.calories}</strong> / {summary.goals.calories_goal} kcal</p>
                        <p>Protein: <strong>{summary.totals.protein}g</strong> / {summary.goals.protein_goal_g}g</p>
                        <p>Carbs: <strong>{summary.totals.carbs}g</strong> / {summary.goals.carb_goal_g}g</p>
                        <p>Fats: <strong>{summary.totals.fats}g</strong> / {summary.goals.fat_goal_g}g</p>
                    </div>
                ) : (
                    <p className="text-gray-500">No summary available.</p>
                )}
            </div>

            <hr className="border-gray-300 mb-6" />

            <h3 className="text-xl font-semibold text-gray-800 mb-4">Today's Log</h3>
            {summary?.by_meal ? (
                ['breakfast', 'lunch', 'dinner', 'snack'].map(meal => (
                    <div key={meal} className="mb-6">
                        <h4 className="text-lg font-medium text-green-600 mb-2">
                            {meal.charAt(0).toUpperCase() + meal.slice(1)}
                        </h4>
                        {summary.by_meal[meal] && summary.by_meal[meal].length > 0 ? (
                            <ul className="space-y-1 list-disc list-inside text-gray-700">
                                {summary.by_meal[meal].map(item => (
                                    <li key={item.id}>
                                        <span className="font-medium">{item.name}</span> - {item.consumed_amount}{item.unit} →
                                        {item.calculated_calories} kcal |
                                        {item.calculated_protein}g P /
                                        {item.calculated_carbs}g C /
                                        {item.calculated_fats}g F
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500">No items logged.</p>
                        )}
                    </div>
                ))
            ) : (
                <p className="text-gray-500">Loading log data...</p>
            )}
        </div>
    );
}

export default DashboardPage;