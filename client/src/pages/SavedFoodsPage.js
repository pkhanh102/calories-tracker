import React, { useState, useEffect} from "react";
import axios from "axios";
import API_BASE from "../apiConfig";

function SavedFoodsPage() {
    const [foods, setFoods] = useState([]);
    const [error, setError] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editingFood, setEditingFood] = useState({});

    const [newFood, setNewFood] = useState({
        name: '',
        base_amount: '',
        unit: 'g',
        calories: '',
        protein: '',
        carbs: '',
        fats: ''
    });

    useEffect(() => {
        fetchSavedFoods();
    }, []);

    const fetchSavedFoods = async () => {
        try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`${API_BASE}/foods`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setFoods(res.data);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch saved foods.');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewFood(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddFood = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('token');
            await axios.post(`${API_BASE}/foods`, newFood, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Reset form
            setNewFood({
                name: '',
                base_amount: '',
                unit: 'g',
                calories: '',
                protein: '',
                carbs: '',
                fats: ''
            });

            // Refresh food list
            fetchSavedFoods();
        } catch (err) {
            console.error('Failed to add food: ', err);
        }
    };  

    const handleEditClick = (food) => {
        setEditingId(food.id);
        setEditingFood({ ...food });
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditingFood((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSaveEdit = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${API_BASE}/foods/${editingId}`, editingFood, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setEditingId(null);
            setEditingFood({});
            fetchSavedFoods(); // Refresh list
        } catch (err) {
            console.error('Failed to update food: ', err);
            setError('Failed to update food.');
        }
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditingFood({});
    }

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_BASE}/foods/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Refresh list after delete
            fetchSavedFoods();
        } catch (err) {
            console.error('Failed to delete food: ', err);
            setError('Failed to delete food.');
        }
    };

    const confirmDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this food?')) {
            handleDelete(id);
        }
    };
 
    return (
        <div style={{ padding: '2rem' }}>
            {/* Add Food Form */}
            <div style={{ marginBottom: '2rem', maxWidth: '400px'}}>
                <h2>Add New Saved Food</h2>
                <form onSubmit={handleAddFood}>
                    <label>
                        Food Name:
                        <input name="name" value={newFood.name} onChange={handleInputChange} placeholder="e.g. Banana" required />
                    </label><br />

                    <label>
                        Base Amount:
                        <input name="base_amount" type="number" value={newFood.base_amount} onChange={handleInputChange} placeholder="e.g. 100" required />
                    </label><br />

                    <label>
                        Unit:
                        <input name="unit" value={newFood.unit} onChange={handleInputChange} placeholder="e.g. g or ml" required />
                    </label><br />

                    <label>
                        Calories:
                        <input name="calories" type="number" value={newFood.calories} onChange={handleInputChange} required />
                    </label><br />

                    <label>
                        Protein (g):
                        <input name="protein" type="number" value={newFood.protein} onChange={handleInputChange} required />
                    </label><br />

                    <label>
                        Carbs (g):
                        <input name="carbs" type="number" value={newFood.carbs} onChange={handleInputChange} required />
                    </label><br />

                    <label>
                        Fats (g):
                        <input name="fats" type="number" value={newFood.fats} onChange={handleInputChange} required />
                    </label><br />

                    <button type="submit" style={{ marginTop: '1rem' }}>Add Food</button>
                </form>
            </div>

            {/* Saved Food Table */}
            <h2>Saved Foods</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {foods.length === 0 ? (
                <p>No saved foods yet.</p>
            ) : (
                <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%' }}>
                    <thead style={{ background: '#f0f0f0' }}>
                        <tr>
                            <th>Name</th>
                            <th>Base</th>
                            <th>Unit</th>
                            <th>Calories</th>
                            <th>Protein</th>
                            <th>Carbs</th>
                            <th>Fats</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {foods.map((food) => (
                            <tr key={food.id}>
                                {editingId === food.id ? (
                                    <>
                                        <td><input name="name" value={editingFood.name} onChange={handleEditChange} /></td>
                                        <td><input name="base_amount" type="number" value={editingFood.base_amount} onChange={handleEditChange} /></td>
                                        <td><input name="unit" value={editingFood.unit} onChange={handleEditChange} /></td>
                                        <td><input name="calories" type="number" value={editingFood.calories} onChange={handleEditChange} /></td>
                                        <td><input name="protein" type="number" value={editingFood.protein} onChange={handleEditChange} /></td>
                                        <td><input name="carbs" type="number" value={editingFood.carbs} onChange={handleEditChange} /></td>
                                        <td><input name="fats" type="number" value={editingFood.fats} onChange={handleEditChange} /></td>
                                        <td>
                                            <button onClick={handleSaveEdit}>Save</button>
                                            <button onClick={handleCancelEdit}>Cancel</button>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td>{food.name}</td>
                                        <td>{food.base_amount}</td>
                                        <td>{food.unit}</td>
                                        <td>{food.calories}</td>
                                        <td>{food.protein}</td>
                                        <td>{food.carbs}</td>
                                        <td>{food.fats}</td>
                                        <td>
                                            <button onClick={() => handleEditClick(food)}>Edit</button>{' '}
                                            <button onClick={() => confirmDelete(food.id)} style={{ color: 'red' }}>Delete</button>{' '}
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default SavedFoodsPage