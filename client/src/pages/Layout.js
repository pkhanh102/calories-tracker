import React, { useContext } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

function Layout() {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();
 
    const handleLogout = () => {
        logout();
        navigate('/login')
    };

    return (
        <div>
            <nav style={{ background: '#eee', padding: '1rem' }}>
                <Link to="/" style={{ marginRight: '1rem' }}>Dashboard</Link>
                <Link to="/log-food" style={{ marginRight: '1rem' }}>Log Food</Link>
                <Link to="/saved-food" style={{ marginRight: '1rem' }}>Saved Foods</Link>
                <Link to="/goals" style={{ marginRight: '1rem' }}>Nutrition Goal</Link>
                <Link to="/history" style={{ marginRight: '1rem' }}>View Logs</Link>
                <button onClick={handleLogout} style={{ marginLeft: '1rem' }}>Logout</button>
            </nav>
            <main style={{ padding: '2rem' }}>
                <Outlet />
            </main>
        </div>
    );
}

export default Layout;