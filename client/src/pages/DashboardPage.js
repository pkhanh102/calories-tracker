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

    if (loading) return <p style={{ padding: '2rem' }}>Loading...</p>;

    return (
        <div style={{ padding: '2rem' }}>
            <h2>Dashboard</h2>

            <h3>Today's Nutrition Summary</h3>
            { summary ? (
                <div>
                    <p>Calories: {summary.totals.calories} / {summary.goals.calories_goal} kcal</p>
                    <p>Protein: {summary.totals.protein}g / {summary.goals.protein_goal_g}g</p>
                    <p>Carbs: {summary.totals.carbs}g / {summary.goals.carb_goal_g}g</p>
                    <p>Fats: {summary.totals.fats}g / {summary.goals.fat_goal_g}g</p>
                </div>
            ) : (
                <p>No summary available</p>
            )}

            <hr />
            <h3>Today's Log</h3>
            {['breakfast', 'lunch', 'dinner', 'snack'].map(meal => (
                <div key={meal} style={{ marginBottom: '1rem' }}>
                    <h4 style={{ textTransform: 'capitalize' }}>{meal}</h4>
                    {summary.by_meal[meal] && summary.by_meal[meal].length > 0 ? (
                        <ul>
                            {summary.by_meal[meal].map(item => (
                                <li key={item.id}>
                                    {item.name} - {item.consumed_amount}{item.unit} →
                                    {item.calculated_calories} kcal |
                                    {item.calculated_protein}g P /
                                    {item.calculated_carbs}g C /
                                    {item.calculated_fats}g F
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No items logged.</p>
                    )}
                </div>
            ))}
         </div>
    );
}

export default DashboardPage;