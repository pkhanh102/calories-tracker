import React from 'react';
import { Link, Outlet } from 'react-router-dom';

function Layout() {
    return (
        <div>
            <nav style={{ background: '#eee', padding: '1rem' }}>
                <Link to="/" style={{ marginRight: '1rem' }}>Dashboard</Link>
                <Link to="/log-food" style={{ marginRight: '1rem' }}>Log Food</Link>
                <Link to="/saved-food" style={{ marginRight: '1rem' }}>Saved Foods</Link>
                <Link to="/goals" style={{ marginRight: '1rem' }}>Nutrition Goal</Link>
                <Link to="/food-log-history" style={{ marginRight: '1rem' }}>View Logs</Link>
                <Link to="/logout">Logout</Link>
            </nav>
            <main style={{ padding: '2rem' }}>
                <Outlet />
            </main>
        </div>
    );
}

export default Layout;