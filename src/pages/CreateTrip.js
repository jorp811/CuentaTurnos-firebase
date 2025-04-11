import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { STATIONS } from '../constants/stations';
import { SERVICES } from '../constants/services';
import { VEHICLES } from '../constants/vehicles';
import { BRANCHES } from '../constants/branches';

function CreateTrip() {
  const [service, setService] = useState('');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [arrivalTime, setArrivalTime] = useState('');
  const [trainNumber, setTrainNumber] = useState('');
  const [kilometers, setKilometers] = useState('');
  const [vehicle, setVehicle] = useState('');
  const [branch, setBranch] = useState('');
  const [vehicle2, setVehicle2] = useState('');
  const [branch2, setBranch2] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    // Verificar si se ha seleccionado un vehículo2 sin rama2 o viceversa
    if ((vehicle2 && !branch2) || (!vehicle2 && branch2)) {
      setError('Debe seleccionar tanto el vehículo como la rama, o dejar ambos vacíos');
      return;
    }
    
    // Verificar si la combinación de vehículo2 y rama2 es igual a la de vehículo y rama
    if (vehicle2 && branch2 && vehicle === vehicle2 && branch === branch2) {
      setError('No se puede registrar la misma combinación de vehículo y rama dos veces');
      return;
    }

    try {
      setError('');
      setLoading(true);
      
      // Crear un nuevo trayecto en Firestore
      await addDoc(collection(db, 'trips'), {
        service: service,
        origin: origin,
        destination: destination,
        departureTime: departureTime,
        arrivalTime: arrivalTime,
        trainNumber: trainNumber,
        kilometers: parseFloat(kilometers) || 0,
        vehicle: vehicle,
        branch: branch,
        vehicle2: vehicle2,
        branch2: branch2,
        userId: currentUser.uid,
        createdAt: serverTimestamp()
      });
      
      navigate('/dashboard');
    } catch (error) {
      setError('Error al registrar el trayecto: ' + error.message);
    }

    setLoading(false);
  }

  return (
    <div className="create-trip-container">
      <h2>Registrar Nuevo Trayecto</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Servicio</label>
          <select
            value={service}
            onChange={(e) => setService(e.target.value)}
            required
            className="form-select"
          >
            <option value="">Seleccione un servicio</option>
            {SERVICES.map((service, index) => (
              <option key={index} value={service}>
                {service}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Número de Tren</label>
          <input
            type="text"
            value={trainNumber}
            onChange={(e) => setTrainNumber(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Origen</label>
          <select
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            required
            className="form-select"
          >
            <option value="">Seleccione una estación</option>
            {STATIONS.map((station, index) => (
              <option key={index} value={station}>
                {station}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Destino</label>
          <select
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            required
            className="form-select"
          >
            <option value="">Seleccione una estación</option>
            {STATIONS.map((station, index) => (
              <option key={index} value={station}>
                {station}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Hora de Salida</label>
          <input
            type="datetime-local"
            value={departureTime}
            onChange={(e) => setDepartureTime(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Hora de Llegada</label>
          <input
            type="datetime-local"
            value={arrivalTime}
            onChange={(e) => setArrivalTime(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Kilómetros</label>
          <input
            type="number"
            step="0.1"
            value={kilometers}
            onChange={(e) => setKilometers(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <div style={{ display: 'flex', gap: '15px' }}>
            <div style={{ flex: '1' }}>
              <label>Vehículo</label>
              <select
                value={vehicle}
                onChange={(e) => {
                  setVehicle(e.target.value);
                  setBranch(''); // Resetear la rama al cambiar el vehículo
                }}
                required
                className="form-select"
              >
                <option value="">Seleccione un vehículo</option>
                {VEHICLES.map((vehicle, index) => (
                  <option key={index} value={vehicle}>
                    {vehicle}
                  </option>
                ))}
              </select>
            </div>
            
            <div style={{ flex: '1' }}>
              <label>Rama</label>
              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                required
                className="form-select"
                disabled={!vehicle} // Deshabilitar si no hay vehículo seleccionado
              >
                <option value="">Seleccione una rama</option>
                {vehicle && BRANCHES[vehicle] && BRANCHES[vehicle].map((branchOption, index) => (
                  <option key={index} value={branchOption}>
                    {branchOption}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {/* Segunda fila de vehículo y rama (aparece cuando la primera está completa) */}
        {vehicle && branch && (
          <div className="form-group">
            <div style={{ display: 'flex', gap: '15px' }}>
              <div style={{ flex: '1' }}>
                <label>Vehículo 2</label>
                <select
                  value={vehicle2}
                  onChange={(e) => {
                    setVehicle2(e.target.value);
                    setBranch2(''); // Resetear la rama al cambiar el vehículo
                  }}
                  className="form-select"
                >
                  <option value="">Seleccione un vehículo</option>
                  {VEHICLES.map((vehicleOption, index) => (
                    <option key={index} value={vehicleOption}>
                      {vehicleOption}
                    </option>
                  ))}
                </select>
              </div>
              
              <div style={{ flex: '1' }}>
                <label>Rama 2</label>
                <select
                  value={branch2}
                  onChange={(e) => setBranch2(e.target.value)}
                  className="form-select"
                  disabled={!vehicle2} // Deshabilitar si no hay vehículo seleccionado
                >
                  <option value="">Seleccione una rama</option>
                  {vehicle2 && BRANCHES[vehicle2] && BRANCHES[vehicle2].map((branchOption, index) => (
                    <option key={index} value={branchOption}>
                      {branchOption}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}


        <button disabled={loading} type="submit" className="btn btn-primary">
          Registrar Trayecto
        </button>
      </form>
    </div>
  );
}

export default CreateTrip;