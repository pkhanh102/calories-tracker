import React, { useState, useEffect} from "react";
import axios from "axios";

function SavedFoodsPage() {
    const [foods, setFoods] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchFood = async () => {
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

        fetchFood();
    }, []);

    return (
        <div style={{ padding: '2rem' }}>
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