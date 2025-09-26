import React, { useState, useEffect} from "react";
import axios from "axios";

function SavedFoodsPage() {
    const [foods, setFoods] = useState([]);
    const [error, setError] = useState('');

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
                const res = await axios.get('http://localhost:4000/api/foods', {
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
            await axios.post('http://localhost:4000/api/foods', newFood, {
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

    return (
        <div style={{ padding: '2rem' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h2>Add New Saved Food</h2>
                <form onSubmit={handleAddFood}>
                    <input name="name" value={newFood.name} onChange={handleInputChange} placeholder="Food name" required /><br />
                    <input name="base_amount" type="number" value={newFood.base_amount} onChange={handleInputChange} placeholder="Base amount (e.g. 100g)" required /><br />
                    <input name="unit" value={newFood.unit} onChange={handleInputChange} placeholder="Unit (e.g. g, ml)" required /><br />
                    <input name="calories" type="number" value={newFood.calories} onChange={handleInputChange} placeholder="Calories" required /><br />
                    <input name="protein" type="number" value={newFood.protein} onChange={handleInputChange} placeholder="Protein (g)" required /><br />
                    <input name="carbs" type="number" value={newFood.carbs} onChange={handleInputChange} placeholder="Carbs (g)" required /><br />
                    <input name="fats" type="number" value={newFood.fats} onChange={handleInputChange} placeholder="Fats" required /><br />
                    <button type="submit">Add Food</button><br />
                </form>
            </div>

            <h2>Saved Foods</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {foods.length === 0 ? (
                <p>No saved foods yet.</p>
            ) : (
                <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%' }}>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Base Amount</th>
                            <th>Unit</th>
                            <th>Calories</th>
                            <th>Protein</th>
                            <th>Carbs</th>
                            <th>Fats</th>
                        </tr>
                    </thead>
                    <tbody>
                        {foods.map((food) => (
                            <tr key={food.id}>
                                <td>{food.name}</td>
                                <td>{food.base_amount}</td>
                                <td>{food.unit}</td>
                                <td>{food.calories}</td>
                                <td>{food.protein}</td>
                                <td>{food.carbs}</td>
                                <td>{food.fats}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default SavedFoodsPage