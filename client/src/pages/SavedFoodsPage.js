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
        <div className="p-6 max-w-5xl mx-auto">
            {/* Add Food Form */}
            <div className="mb-10 bg-white p-6 rounded shadow max-w-md">
                <h2 className="text-2xl font-bold text-green-700 mb-6">Add New Saved Food</h2>
                <form onSubmit={handleAddFood} className="space-y-4">
                    {['name', 'base_amount', 'unit', 'calories', 'protein', 'carbs', 'fats'].map((field, index) => (
                        <div key={index}>
                            <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                                {field.replace('_', ' ')};
                            </label>
                            <input 
                                type={field === 'name' || field === 'unit' ?  'text' : 'number'}
                                name={field}
                                value={newFood[field]}
                                onChange={handleInputChange}
                                required
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                        </div>
                    ))}
                    <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded">Add Food</button>
                </form>
            </div>

            {/* Saved Food Table */}
            <h2 className="text-2xl font-bold text-green-700 mb-4">Saved Foods</h2>
            {error && <p className="text-red-600 mb-4">{error}</p>}

            {foods.length === 0 ? (
                <p className="text-gray-500">No saved foods yet.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-300 text-sm text-left">
                        <thead className="bg-gray-100 text-gray-700">
                            <tr>
                                <th className="px-4 py-2">Name</th>
                                <th className="px-4 py-2">Base</th>
                                <th className="px-4 py-2">Unit</th>
                                <th className="px-4 py-2">Calories</th>
                                <th className="px-4 py-2">Protein</th>
                                <th className="px-4 py-2">Carbs</th>
                                <th className="px-4 py-2">Fats</th>
                                <th className="px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {foods.map((food) => (
                                <tr key={food.id} className="border-t border-gray-200">
                                    {editingId === food.id ? (
                                        <>
                                            {['name', 'base_amount', 'unit', 'calories', 'protein', 'carbs', 'fats'].map((field, index) => (
                                                <td key={index} className="px-4 py-2">
                                                    <input
                                                        name={field}
                                                        value={editingFood[field]}
                                                        type={field === 'name' || field === 'unit' ? 'text' : 'number'}
                                                        onChange={handleEditChange}
                                                        className="w-full p-1 border border-gray-300 rounded"
                                                    />
                                                </td>
                                            ))}
                                            <td className="px-4 py-2">
                                                <div className="space-x-2">
                                                    <button onClick={handleSaveEdit} className="text-green-600 hover:underline">Save</button>
                                                    <button onClick={handleCancelEdit} className="text-gray-500 hover:underline">Cancel</button>
                                                </div>
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td className="px-4 py-2">{food.name}</td>
                                            <td className="px-4 py-2">{food.base_amount}</td>
                                            <td className="px-4 py-2">{food.unit}</td>
                                            <td className="px-4 py-2">{food.calories}</td>
                                            <td className="px-4 py-2">{food.protein}</td>
                                            <td className="px-4 py-2">{food.carbs}</td>
                                            <td className="px-4 py-2">{food.fats}</td>
                                            <td className="px-4 py-2 space-x-2">
                                                <button onClick={() => handleEditClick(food)} className="text-blue-600 hover:underline">Edit</button>
                                                <button onClick={() => confirmDelete(food.id)} className="text-red-600 hover:underline">Delete</button>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default SavedFoodsPage