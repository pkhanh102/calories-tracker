import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import dayjs from 'dayjs';

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
                const res = await axios.get(`http://localhost:4000/api/summary?date=${today}`, {
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

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    if (loading) return <p style={{ padding: '2rem' }}>Loading...</p>;

    return (
        <div style={{ padding: '2rem' }}>
            <h2>Dashboard</h2>
            <button onClick={handleLogout}>Logout</button>
            <hr />

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
        </div>
    );
}

export default DashboardPage;