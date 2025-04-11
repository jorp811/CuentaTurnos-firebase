import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }) {
  // Verificar si hay una preferencia guardada en localStorage
  const savedTheme = localStorage.getItem('theme');
  const [darkMode, setDarkMode] = useState(savedTheme === 'dark');

  // Función para cambiar entre modo claro y oscuro
  const toggleTheme = () => {
    setDarkMode(prevMode => !prevMode);
  };

  // Guardar la preferencia en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
    // Aplicar clase al body para estilos globales
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  const value = {
    darkMode,
    toggleTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}