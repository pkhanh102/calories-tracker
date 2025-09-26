import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_BASE from "../apiConfig";

function LoginPage() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [message, setMessage] = useState('');
    const navigate = useNavigate();

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

            const token = res.data.token;

            // Save token to localStorage
            localStorage.setItem('token', token);

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