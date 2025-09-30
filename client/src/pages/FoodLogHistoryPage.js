import React, { useEffect, useState } from "react";
import axios from "axios";
import API_BASE from "../apiConfig";

function FoodLogHistoryPage() {
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState('');
  const [editingLogId, setEditingLogId] = useState(null);
  const [editingAmount, setEditingAmount] = useState('');

  const fetchSummary = async (selectedDate) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE}/summary?date=${selectedDate}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSummary(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch summary data.');
    }
  };

  useEffect(() => {
    fetchSummary(date);
  }, [date]);

  const handleDeleteLog = async (logId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE}/logs/${logId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchSummary(date); // refresh after deletion
    } catch (err) {
      console.error('Failed to delete log:', err);
      alert('Error deleting log.');
    }
  };

  const startEdit = (item) => {
    setEditingLogId(item.id);
    setEditingAmount(item.consumed_amount);
  };

  const cancelEdit = () => {
    setEditingLogId(null);
    setEditingAmount('');
  };

  const handleUpdateLog = async (logId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_BASE}/logs/${logId}`, {
        consumed_amount: editingAmount
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      cancelEdit();
      fetchSummary(date);
    } catch (err) {
      console.error('Failed to update log:', err);
      alert('Error updating log.');
    }
  };

  const meals = ['breakfast', 'lunch', 'dinner', 'snack'];

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Food Log History</h2>

      <label>Select date: </label>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {summary ? (
        <>
          <h3>Daily Totals</h3>
          <p>
            Calories: {summary.totals.calories}
            {summary.goals ? ` / ${summary.goals.calories_goal} kcal` : ''}
          </p>
          <p>
            Protein: {summary.totals.protein}g
            {summary.goals ? ` / ${summary.goals.protein_goal_g}g` : ''}
          </p>
          <p>
            Carbs: {summary.totals.carbs}g
            {summary.goals ? ` / ${summary.goals.carb_goal_g}g` : ''}
          </p>
          <p>
            Fats: {summary.totals.fats}g
            {summary.goals ? ` / ${summary.goals.fat_goal_g}g` : ''}
          </p>

          <hr />

          {meals.map((meal) => (
            <div key={meal} style={{ marginBottom: '1.5rem' }}>
              <h4>{meal.toUpperCase()}</h4>
              {summary.by_meal[meal] && summary.by_meal[meal].length > 0 ? (
                <ul>
                  {summary.by_meal[meal].map((item) => (
                    <li key={item.id}>
                      {item.name} - {item.consumed_amount}{item.unit} →   
                      {item.calculated_calories} kcal | 
                      {item.calculated_protein}g P / 
                      {item.calculated_carbs}g C / 
                      {item.calculated_fats}g F &nbsp;

                      {editingLogId === item.id ? (
                        <>
                          <input 
                            type="number"
                            value={editingAmount}
                            onChange={(e) => setEditingAmount(e.target.value)}
                            style={{ width: '80px' }}
                          />
                          <button onClick={() => handleUpdateLog(item.id)}>Save</button>
                          <button onClick={() => cancelEdit()}>Cancel</button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => startEdit(item)}>Edit</button>
                          <button onClick={() => handleDeleteLog(item.id)} style={{ color: 'red', marginLeft: '0.5rem' }}>Delete</button>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No entries.</p>
              )}
            </div>
          ))}
        </>
      ) : (
        <p>Loading summary...</p>
      )}
    </div>
  );
}


export default FoodLogHistoryPage;