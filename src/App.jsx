import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import AdminPanel from './components/AdminPanel';
import TaskBoard from './components/TaskBoard';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  // Pre-warm the backend server on app load (wakes Render from sleep)
  useEffect(() => {
    const API_BASE = window.location.hostname === 'localhost'
      ? 'http://localhost:5000'
      : 'https://backend-multi-role-based-login-2.onrender.com';
    fetch(`${API_BASE}/health`).catch(() => { });
  }, []);

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar theme="colored" />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Both User and Admin can access the basic Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Only Admin can access the Admin Panel */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminPanel />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <TaskBoard />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  )
}

export default App
