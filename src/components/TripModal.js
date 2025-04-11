import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

function TripModal({ trip, onClose, onDelete }) {
  const { darkMode } = useTheme();
  
  if (!trip) return null;
  
  const modalStyles = {
    // Estilos base que se aplicarán independientemente del tema
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: darkMode ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    },
    modal: {
      backgroundColor: darkMode ? '#3a3a3a' : 'white',
      borderRadius: '12px',
      boxShadow: darkMode ? '0 5px 20px rgba(0, 0, 0, 0.4)' : '0 5px 20px rgba(0, 0, 0, 0.2)',
      padding: '0',
      width: '90%',
      maxWidth: '500px',
      maxHeight: '90vh',
      overflow: 'auto',
      position: 'relative',
    },
    header: {
      padding: '20px',
      borderBottom: darkMode ? '1px solid #555' : '1px solid #f0f0f0',
      backgroundColor: darkMode ? '#4a4a4a' : '#f8f9fa',
      borderTopLeftRadius: '12px',
      borderTopRightRadius: '12px',
    },
    title: {
      fontSize: '20px',
      fontWeight: '600',
      margin: '0',
      color: darkMode ? '#f0f0f0' : '#333',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    content: {
      padding: '20px',
      backgroundColor: darkMode ? '#3a3a3a' : 'white',
    },
    detailRow: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '15px',
      gap: '15px',
    },
    detailLabel: {
      minWidth: '120px',
      fontWeight: '600',
      color: darkMode ? '#a5d6ff' : '#4285f4',
      backgroundColor: darkMode ? '#3a4a62' : '#f0f7ff',
      padding: '8px 10px',
      borderRadius: '6px',
      display: 'inline-block',
    },
    detailValue: {
      color: darkMode ? '#ffffff' : '#333',
      flex: '1',
      padding: '8px 12px',
      backgroundColor: darkMode ? '#4a4a4a' : '#f5f5f5',
      borderRadius: '6px',
    },
    footer: {
      padding: '15px 20px',
      borderTop: darkMode ? '1px solid #555' : '1px solid #f0f0f0',
      backgroundColor: darkMode ? '#4a4a4a' : 'white',
      display: 'flex',
      justifyContent: 'flex-end',
    },
    closeButton: {
      backgroundColor: '#4285f4',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      padding: '8px 16px',
      cursor: 'pointer',
      fontWeight: '500',
      transition: 'background-color 0.3s',
    },
    editButton: {
      backgroundColor: '#34a853',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      padding: '8px 16px',
      cursor: 'pointer',
      fontWeight: '500',
      marginRight: '10px',
      textDecoration: 'none',
      display: 'inline-block',
      transition: 'background-color 0.3s',
    },
    closeIcon: {
      position: 'absolute',
      top: '15px',
      right: '15px',
      cursor: 'pointer',
      fontSize: '20px',
      color: darkMode ? '#aaa' : '#666',
      background: 'none',
      border: 'none',
      padding: '5px',
    },
    deleteButton: {
      backgroundColor: '#ea4335',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      padding: '8px 16px',
      cursor: 'pointer',
      fontWeight: '500',
      marginRight: '10px',
      transition: 'background-color 0.3s',
    }
  };

  // Formatear fechas para mostrarlas de manera legible
  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return 'No disponible';
    
    const date = new Date(dateTimeString);
    return date.toLocaleString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div style={modalStyles.overlay} onClick={onClose}>
      <div style={modalStyles.modal} onClick={(e) => e.stopPropagation()}>
        <button style={modalStyles.closeIcon} onClick={onClose} aria-label="Cerrar">
          ✕
        </button>
        
        <div style={modalStyles.header}>
          <h3 style={modalStyles.title}>
            <span role="img" aria-label="Tren">🚄</span> 
            {trip.service || 'Servicio'} {trip.trainNumber}
          </h3>
        </div>
        
        <div style={modalStyles.content}>
          <div style={modalStyles.detailRow}>
            <span style={modalStyles.detailLabel}>Servicio:</span>
            <span style={modalStyles.detailValue}>{trip.service || 'No especificado'}</span>
          </div>
          
          <div style={modalStyles.detailRow}>
            <span style={modalStyles.detailLabel}>Origen:</span>
            <span style={modalStyles.detailValue}>{trip.origin}</span>
          </div>
          
          <div style={modalStyles.detailRow}>
            <span style={modalStyles.detailLabel}>Destino:</span>
            <span style={modalStyles.detailValue}>{trip.destination}</span>
          </div>
          
          <div style={modalStyles.detailRow}>
            <span style={modalStyles.detailLabel}>Tren:</span>
            <span style={modalStyles.detailValue}>{trip.trainNumber}</span>
          </div>
          
          <div style={modalStyles.detailRow}>
            <span style={modalStyles.detailLabel}>Vehículo:</span>
            <span style={modalStyles.detailValue}>{trip.vehicle || 'No especificado'}</span>
          </div>
          
          <div style={modalStyles.detailRow}>
            <span style={modalStyles.detailLabel}>Rama:</span>
            <span style={modalStyles.detailValue}>{trip.branch || 'No especificada'}</span>
          </div>
          
          <div style={modalStyles.detailRow}>
            <span style={modalStyles.detailLabel}>Salida:</span>
            <span style={modalStyles.detailValue}>
              {formatDateTime(trip.departureTime)}
            </span>
          </div>
          
          <div style={modalStyles.detailRow}>
            <span style={modalStyles.detailLabel}>Llegada:</span>
            <span style={modalStyles.detailValue}>
              {formatDateTime(trip.arrivalTime)}
            </span>
          </div>
          
          <div style={modalStyles.detailRow}>
            <span style={modalStyles.detailLabel}>Kilómetros:</span>
            <span style={modalStyles.detailValue}>{trip.kilometers}</span>
          </div>
        </div>
        
        <div style={{...modalStyles.footer, justifyContent: 'space-between'}}>
          <div>
            {onDelete && (
              <button 
                style={modalStyles.deleteButton}
                onClick={() => {
                  if (window.confirm('¿Estás seguro de que deseas eliminar este trayecto?')) {
                    onDelete(trip.id);
                    onClose();
                  }
                }}
              >
                Eliminar
              </button>
            )}
          </div>
          <div style={{display: 'flex', gap: '10px'}}>
            <Link 
              to={`/edit-trip/${trip.id}`} 
              style={modalStyles.editButton}
            >
              Editar
            </Link>
            <button style={modalStyles.closeButton} onClick={onClose}>
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TripModal;