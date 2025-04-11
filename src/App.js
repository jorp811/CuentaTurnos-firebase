import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateTrip from './pages/CreateTrip';
import EditTrip from './pages/EditTrip';
import Statistics from './pages/Statistics';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <div className="app">
          <Navbar />
          <div className="container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            <Route 
              path="/dashboard" 
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/create-trip" 
              element={
                <PrivateRoute>
                  <CreateTrip />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/statistics" 
              element={
                <PrivateRoute>
                  <Statistics />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/edit-trip/:tripId" 
              element={
                <PrivateRoute>
                  <EditTrip />
                </PrivateRoute>
              } 
            />
            </Routes>
          </div>
        </div>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;