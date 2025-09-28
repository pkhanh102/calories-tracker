// src/App.js
import React from 'react';
import { Routes, Route }  from 'react-router-dom';

import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import GoalPage from './pages/GoalPage';
import LogFoodPage from './pages/LogFoodPage';
import SavedFoodsPage from './pages/SavedFoodsPage';
import Layout from './pages/Layout';
import FoodLogHistoryPage from './pages/FoodLogHistoryPage';

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Protected Routes under Layout */}
      <Route element={<Layout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path='/goals' element={<GoalPage />} />
        <Route path='/log-food' element={<LogFoodPage />} />
        <Route path='/saved-food' element={<SavedFoodsPage />} />
        <Route path='/food-log-history' element={<FoodLogHistoryPage />} />
      </Route>
    </Routes>
  );
}

export default App;