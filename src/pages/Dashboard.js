import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import TripModal from '../components/TripModal';

function Dashboard() {
  const [trips, setTrips] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTrip, setSelectedTrip] = useState(null);
  const { currentUser } = useAuth();

  async function handleDeleteTrip(tripId) {
    try {
      // Eliminar el trayecto de Firestore
      await deleteDoc(doc(db, 'trips', tripId));
      
      // Actualizar el estado local eliminando el trayecto
      setTrips(trips.filter(trip => trip.id !== tripId));
    } catch (error) {
      setError('Error al eliminar el trayecto: ' + error.message);
    }
  }

  // Función para avanzar un día en la fecha seleccionada
  const goToNextDay = () => {
    const nextDay = new Date(selectedDate);
    nextDay.setDate(nextDay.getDate() + 1);
    setSelectedDate(nextDay);
  };

  // Función para retroceder un día en la fecha seleccionada
  const goToPreviousDay = () => {
    const previousDay = new Date(selectedDate);
    previousDay.setDate(previousDay.getDate() - 1);
    setSelectedDate(previousDay);
  };

  // Función para formatear la fecha en formato legible
  const formatDate = (date) => {
    return date.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  // Función para verificar si una fecha es del mismo día que otra
  const isSameDay = (date1, date2) => {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  };

  // Efecto para cargar los trayectos desde Firestore
  useEffect(() => {
    async function fetchTrips() {
      try {
        const tripsRef = collection(db, 'trips');
        const q = query(tripsRef, where('userId', '==', currentUser.uid));
        const querySnapshot = await getDocs(q);
        
        const tripsData = [];
        querySnapshot.forEach((doc) => {
          tripsData.push({
            id: doc.id,
            ...doc.data()
          });
        });
        
        // Ordenar por hora de salida (departureTime) en lugar de por fecha de creación
        tripsData.sort((a, b) => {
          // Si ambos tienen departureTime, ordenar por departureTime
          if (a.departureTime && b.departureTime) {
            return new Date(a.departureTime) - new Date(b.departureTime);
          }
          // Si solo uno tiene departureTime, priorizar el que tiene departureTime
          else if (a.departureTime) return -1;
          else if (b.departureTime) return 1;
          // Si ninguno tiene departureTime, ordenar por createdAt como fallback
          else return b.createdAt - a.createdAt;
        });
        
        setTrips(tripsData);
        setLoading(false);
      } catch (error) {
        setError('Error al cargar los trayectos: ' + error.message);
        setLoading(false);
      }
    }

    fetchTrips();
  }, [currentUser]);

  // Efecto para filtrar los trayectos según la fecha seleccionada
  useEffect(() => {
    if (trips.length > 0) {
      const filtered = trips.filter(trip => {
        // Si el trayecto tiene departureTime, usamos esa fecha para filtrar
        if (trip.departureTime) {
          const tripDate = new Date(trip.departureTime);
          return isSameDay(tripDate, selectedDate);
        }
        // Si no tiene departureTime pero tiene createdAt, usamos esa fecha
        else if (trip.createdAt) {
          const tripDate = new Date(trip.createdAt.toDate());
          return isSameDay(tripDate, selectedDate);
        }
        return false;
      });
      setFilteredTrips(filtered);
    } else {
      setFilteredTrips([]);
    }
  }, [trips, selectedDate]);

  if (loading) return <div>Cargando...</div>;

  // Función para abrir el modal con los detalles del trayecto
  const openTripDetails = (trip) => {
    setSelectedTrip(trip);
  };

  // Función para cerrar el modal
  const closeTripDetails = () => {
    setSelectedTrip(null);
  };

  const dashboardStyles = {
    container: {
      maxWidth: '1000px',
      margin: '0 auto',
      padding: '30px',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '30px',
    },
    dateNavigation: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: '20px',
      gap: '15px',
    },
    dateDisplay: {
      fontSize: '18px',
      fontWeight: '500',
      color: '#333',
      textTransform: 'capitalize',
    },
    navButton: {
      backgroundColor: '#4285f4',
      color: 'white',
      border: 'none',
      borderRadius: '50%',
      width: '36px',
      height: '36px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'pointer',
      fontSize: '18px',
      transition: 'background-color 0.3s',
    },
    calendarButton: {
      backgroundColor: '#4285f4',
      color: 'white',
      border: 'none',
      borderRadius: '50%',
      width: '36px',
      height: '36px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'pointer',
      fontSize: '18px',
      transition: 'background-color 0.3s',
    },
    calendarContainer: {
      position: 'relative',
    },
    title: {
      fontSize: '28px',
      fontWeight: '600',
      color: '#333',
      margin: '0',
    },
    addButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '10px 16px',
      backgroundColor: '#4285f4',
      color: 'white',
      borderRadius: '8px',
      textDecoration: 'none',
      fontWeight: '500',
      transition: 'all 0.3s ease',
    },
    tripsList: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: '20px',
      marginTop: '20px',
    },
    tripCard: {
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      cursor: 'pointer',
    },
    tripCardHover: {
      transform: 'translateY(-5px)',
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)',
    },
    tripHeader: {
      padding: '16px',
      borderBottom: '1px solid #f0f0f0',
      backgroundColor: '#f8f9fa',
    },
    tripTitle: {
      fontSize: '18px',
      fontWeight: '600',
      margin: '0',
      color: '#333',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    tripDetails: {
      padding: '16px',
    },
    detailRow: {
      display: 'flex',
      alignItems: 'flex-start',
      marginBottom: '10px',
    },
    detailLabel: {
      minWidth: '100px',
      fontWeight: '500',
      color: '#666',
    },
    detailValue: {
      color: '#333',
      flex: '1',
    },
    tripActions: {
      padding: '16px',
      borderTop: '1px solid #f0f0f0',
      display: 'flex',
      justifyContent: 'flex-end',
    },
    deleteButton: {
      backgroundColor: '#ea4335',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      padding: '8px 16px',
      cursor: 'pointer',
      fontWeight: '500',
      transition: 'background-color 0.3s',
    },
    emptyState: {
      textAlign: 'center',
      padding: '40px 20px',
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
      marginTop: '20px',
    },
    emptyStateText: {
      fontSize: '16px',
      color: '#666',
      marginBottom: '20px',
    },
  };

  return (
    <div style={dashboardStyles.container} className="dashboard-container">
      <div style={dashboardStyles.header}>
        <h2 style={dashboardStyles.title}>Mis Trenes</h2>
        <Link to="/create-trip" style={dashboardStyles.addButton}>
          <span>+</span> Registrar Nuevo Tren
        </Link>
      </div>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      <div style={dashboardStyles.dateNavigation}>
        <button 
          style={dashboardStyles.navButton} 
          onClick={goToPreviousDay}
          aria-label="Día anterior"
        >
          ←
        </button>
        <div style={dashboardStyles.calendarContainer}>
          <DatePicker
            selected={selectedDate}
            onChange={date => setSelectedDate(date)}
            customInput={
              <button 
                style={dashboardStyles.calendarButton}
                aria-label="Abrir calendario"
              >
                📅
              </button>
            }
            locale="es"
            dateFormat="dd/MM/yyyy"
            popperPlacement="bottom"
            popperModifiers={{
              preventOverflow: {
                enabled: true,
                escapeWithReference: false,
                boundariesElement: 'viewport'
              }
            }}
          />
        </div>
        <span style={dashboardStyles.dateDisplay}>
          {formatDate(selectedDate)}
        </span>
        <button 
          style={dashboardStyles.navButton} 
          onClick={goToNextDay}
          aria-label="Día siguiente"
        >
          →
        </button>
      </div>
      
      {filteredTrips.length === 0 ? (
        <div style={dashboardStyles.emptyState}>
          <p style={dashboardStyles.emptyStateText}>No hay trayectos registrados para esta fecha. ¡Registra un nuevo trayecto!</p>
          <Link to="/create-trip" className="btn btn-primary">
            Registrar Trayecto
          </Link>
        </div>
      ) : (
        <div style={dashboardStyles.tripsList}>
          {filteredTrips.map((trip) => (
            <div 
              key={trip.id} 
              style={dashboardStyles.tripCard} 
              onClick={() => openTripDetails(trip)}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = dashboardStyles.tripCardHover.transform;
                e.currentTarget.style.boxShadow = dashboardStyles.tripCardHover.boxShadow;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = dashboardStyles.tripCard.boxShadow;
              }}
            >
              <div style={dashboardStyles.tripHeader}>
                <h3 style={dashboardStyles.tripTitle}>
                  <span role="img" aria-label="Tren">🚄</span> 
                  {trip.service && <span style={{marginRight: '5px', fontSize: '14px', backgroundColor: '#f0f7ff', color: '#4285f4', padding: '2px 6px', borderRadius: '4px'}}>{trip.service}</span>}
                  {trip.trainNumber}
                </h3>
              </div>
              
              <div style={dashboardStyles.tripDetails}>
                <div style={dashboardStyles.detailRow}>
                  <span style={dashboardStyles.detailLabel}>Trayecto:</span>
                  <span style={dashboardStyles.detailValue}>
                    {trip.origin} → {trip.destination}
                  </span>
                </div>
                
                <div style={dashboardStyles.detailRow}>
                  <span style={dashboardStyles.detailLabel}>Horario:</span>
                  <span style={dashboardStyles.detailValue}>
                    {trip.departureTime ? new Date(trip.departureTime).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : 'No disponible'} - 
                    {trip.arrivalTime ? new Date(trip.arrivalTime).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : 'No disponible'}
                  </span>
                </div>
              </div>
              
              <div style={{...dashboardStyles.tripActions, justifyContent: 'center'}}>
                <span style={{
                  color: '#4285f4',
                  fontWeight: '500',
                  fontSize: '14px'
                }}>
                  Haz clic para ver detalles
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Modal para mostrar detalles del trayecto */}
      {selectedTrip && (
        <TripModal 
          trip={selectedTrip} 
          onClose={closeTripDetails} 
          onDelete={handleDeleteTrip}
        />
      )}
    </div>
  );
}

export default Dashboard;