import React, { useContext, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_BASE from "../apiConfig";
import AuthContext from '../context/AuthContext';

function LoginPage() {
    const { login } = useContext(AuthContext)
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post(`${API_BASE}/auth/login`, formData);
            login(res.data.token);
            // Redirect to dashboard
            navigate('/');
        } catch (err) {
            console.error(err);
            setMessage('❌ Login failed. Check your email and password.');
        }
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label><br />
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <br />
                <div>
                    <label>Password:</label><br />
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <br />
                <button type='submit'>Login</button>
            </form>

            <br />
            {message && <p>{message}</p>}
            
            <p>
                Don't have an account? <a href='/register'>Create one!</a>
            </p>
        </div>
    );
}

export default LoginPage;