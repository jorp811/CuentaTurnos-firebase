import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Registrar los componentes necesarios para Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Statistics() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('daily'); // 'daily', 'monthly', 'yearly'
  const { currentUser } = useAuth();

  // Datos para los gráficos
  const [dailyData, setDailyData] = useState({
    labels: [],
    datasets: [{
      label: 'Kilómetros por día',
      data: [],
      borderColor: 'rgb(75, 192, 192)',
      backgroundColor: 'rgba(75, 192, 192, 0.5)',
    }]
  });

  const [monthlyData, setMonthlyData] = useState({
    labels: [],
    datasets: [{
      label: 'Kilómetros por mes',
      data: [],
      borderColor: 'rgb(53, 162, 235)',
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    }]
  });

  const [yearlyData, setYearlyData] = useState({
    labels: [],
    datasets: [{
      label: 'Kilómetros por año',
      data: [],
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    }]
  });

  // Opciones para los gráficos
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Estadísticas de Kilómetros Recorridos',
      },
    },
  };

  // Función para agrupar los trayectos por día
  const groupTripsByDay = (trips) => {
    const grouped = {};
    
    trips.forEach(trip => {
      let date;
      if (trip.departureTime) {
        date = new Date(trip.departureTime).toLocaleDateString();
      } else if (trip.createdAt) {
        date = new Date(trip.createdAt.toDate()).toLocaleDateString();
      } else {
        return; // Saltar si no hay fecha
      }
      
      if (!grouped[date]) {
        grouped[date] = 0;
      }
      grouped[date] += trip.kilometers || 0;
    });
    
    // Ordenar por fecha
    const sortedDates = Object.keys(grouped).sort((a, b) => new Date(a) - new Date(b));
    
    return {
      labels: sortedDates,
      datasets: [{
        label: 'Kilómetros por día',
        data: sortedDates.map(date => grouped[date]),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      }]
    };
  };

  // Función para agrupar los trayectos por mes
  const groupTripsByMonth = (trips) => {
    const grouped = {};
    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    
    trips.forEach(trip => {
      let date;
      if (trip.departureTime) {
        date = new Date(trip.departureTime);
      } else if (trip.createdAt) {
        date = new Date(trip.createdAt.toDate());
      } else {
        return; // Saltar si no hay fecha
      }
      
      const monthYear = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
      
      if (!grouped[monthYear]) {
        grouped[monthYear] = 0;
      }
      grouped[monthYear] += trip.kilometers || 0;
    });
    
    // Ordenar por fecha
    const sortedMonths = Object.keys(grouped).sort((a, b) => {
      const [monthA, yearA] = a.split(' ');
      const [monthB, yearB] = b.split(' ');
      const indexA = monthNames.indexOf(monthA) + (parseInt(yearA) * 12);
      const indexB = monthNames.indexOf(monthB) + (parseInt(yearB) * 12);
      return indexA - indexB;
    });
    
    return {
      labels: sortedMonths,
      datasets: [{
        label: 'Kilómetros por mes',
        data: sortedMonths.map(month => grouped[month]),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      }]
    };
  };

  // Función para agrupar los trayectos por año
  const groupTripsByYear = (trips) => {
    const grouped = {};
    
    trips.forEach(trip => {
      let date;
      if (trip.departureTime) {
        date = new Date(trip.departureTime);
      } else if (trip.createdAt) {
        date = new Date(trip.createdAt.toDate());
      } else {
        return; // Saltar si no hay fecha
      }
      
      const year = date.getFullYear().toString();
      
      if (!grouped[year]) {
        grouped[year] = 0;
      }
      grouped[year] += trip.kilometers || 0;
    });
    
    // Ordenar por año
    const sortedYears = Object.keys(grouped).sort();
    
    return {
      labels: sortedYears,
      datasets: [{
        label: 'Kilómetros por año',
        data: sortedYears.map(year => grouped[year]),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      }]
    };
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
        
        setTrips(tripsData);
        setLoading(false);
      } catch (error) {
        setError('Error al cargar los trayectos: ' + error.message);
        setLoading(false);
      }
    }

    fetchTrips();
  }, [currentUser]);

  // Efecto para procesar los datos cuando se cargan los trayectos
  useEffect(() => {
    if (trips.length > 0) {
      setDailyData(groupTripsByDay(trips));
      setMonthlyData(groupTripsByMonth(trips));
      setYearlyData(groupTripsByYear(trips));
    }
  }, [trips]);

  // Estilos para la página
  const statisticsStyles = {
    container: {
      maxWidth: '1000px',
      margin: '0 auto',
      padding: '30px',
    },
    header: {
      marginBottom: '30px',
    },
    title: {
      fontSize: '28px',
      fontWeight: '600',
      color: '#333',
      margin: '0 0 20px 0',
    },
    tabs: {
      display: 'flex',
      borderBottom: '1px solid #e0e0e0',
      marginBottom: '20px',
    },
    tab: {
      padding: '10px 20px',
      cursor: 'pointer',
      fontWeight: '500',
      color: '#666',
      borderBottom: '2px solid transparent',
      transition: 'all 0.3s ease',
    },
    activeTab: {
      color: '#4285f4',
      borderBottom: '2px solid #4285f4',
    },
    chartContainer: {
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      padding: '20px',
      marginTop: '20px',
    },
    summaryContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '20px',
    },
    summaryCard: {
      flex: '1',
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      padding: '20px',
      margin: '0 10px',
      textAlign: 'center',
    },
    summaryTitle: {
      fontSize: '16px',
      color: '#666',
      marginBottom: '10px',
    },
    summaryValue: {
      fontSize: '24px',
      fontWeight: '600',
      color: '#333',
    },
  };

  // Calcular estadísticas totales
  const calculateTotals = () => {
    const totalKilometers = trips.reduce((sum, trip) => sum + (trip.kilometers || 0), 0);
    const totalTrips = trips.length;
    const averagePerTrip = totalTrips > 0 ? (totalKilometers / totalTrips).toFixed(2) : 0;
    
    return { totalKilometers, totalTrips, averagePerTrip };
  };

  const { totalKilometers, totalTrips, averagePerTrip } = calculateTotals();

  if (loading) return <div>Cargando...</div>;

  return (
    <div style={statisticsStyles.container} className="statistics-container">
      <div style={statisticsStyles.header}>
        <h2 style={statisticsStyles.title}>Estadísticas de Kilómetros</h2>
      </div>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      <div style={statisticsStyles.summaryContainer}>
        <div style={statisticsStyles.summaryCard}>
          <div style={statisticsStyles.summaryTitle}>Total Kilómetros</div>
          <div style={statisticsStyles.summaryValue}>{totalKilometers.toFixed(2)} km</div>
        </div>
        <div style={statisticsStyles.summaryCard}>
          <div style={statisticsStyles.summaryTitle}>Total Trayectos</div>
          <div style={statisticsStyles.summaryValue}>{totalTrips}</div>
        </div>
        <div style={statisticsStyles.summaryCard}>
          <div style={statisticsStyles.summaryTitle}>Promedio por Trayecto</div>
          <div style={statisticsStyles.summaryValue}>{averagePerTrip} km</div>
        </div>
      </div>
      
      <div style={statisticsStyles.tabs}>
        <div 
          style={{
            ...statisticsStyles.tab,
            ...(activeTab === 'daily' ? statisticsStyles.activeTab : {})
          }}
          onClick={() => setActiveTab('daily')}
        >
          Diario
        </div>
        <div 
          style={{
            ...statisticsStyles.tab,
            ...(activeTab === 'monthly' ? statisticsStyles.activeTab : {})
          }}
          onClick={() => setActiveTab('monthly')}
        >
          Mensual
        </div>
        <div 
          style={{
            ...statisticsStyles.tab,
            ...(activeTab === 'yearly' ? statisticsStyles.activeTab : {})
          }}
          onClick={() => setActiveTab('yearly')}
        >
          Anual
        </div>
      </div>
      
      <div style={statisticsStyles.chartContainer}>
        {activeTab === 'daily' && (
          <Line options={options} data={dailyData} />
        )}
        {activeTab === 'monthly' && (
          <Bar options={options} data={monthlyData} />
        )}
        {activeTab === 'yearly' && (
          <Bar options={options} data={yearlyData} />
        )}
      </div>
    </div>
  );
}

export default Statistics;