import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { currentUser } = useAuth();

  return (
    <div className="home-container">
      <div className="card">
        <h1>Bienvenido a Registro de Trayectos</h1>
        <p>Una aplicación para registrar tus trayectos en tren diarios.</p>
        
        {currentUser ? (
          <div className="action-buttons">
            <Link to="/dashboard">
              <button className="btn btn-primary">Ir al Dashboard</button>
            </Link>
            <Link to="/create-trip">
              <button className="btn btn-primary" style={{ marginLeft: '10px' }}>Registrar Trayecto</button>
            </Link>
          </div>
        ) : (
          <div className="action-buttons">
            <Link to="/login">
              <button className="btn btn-primary">Iniciar Sesión</button>
            </Link>
            <Link to="/register">
              <button className="btn btn-primary" style={{ marginLeft: '10px' }}>Registrarse</button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;