import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="nav">
      <div className="nav-container">
        <div className="logo">
          <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
            <h2>Registro de Trenes</h2>
          </Link>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button 
            onClick={toggleTheme} 
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              fontSize: '20px',
              cursor: 'pointer',
              marginRight: '15px',
              padding: '5px',
            }}
            aria-label={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
          <div className="menu-icon" onClick={toggleMenu}>
            ☰
          </div>
        </div>
        <div className={`nav-links ${menuOpen ? 'active' : ''}`}>
          {currentUser ? (
            <>
              <Link to="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link>
              <Link to="/create-trip" onClick={() => setMenuOpen(false)}>Registrar Trayecto</Link>
              <Link to="/statistics" onClick={() => setMenuOpen(false)}>Estadísticas</Link>
              <a href="#" onClick={() => {handleLogout(); setMenuOpen(false);}}>Cerrar Sesión</a>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)}>Iniciar Sesión</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)}>Registrarse</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;