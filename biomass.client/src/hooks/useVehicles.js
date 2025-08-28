import { useState, useEffect } from 'react';
import axios from 'axios';

const useVehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    maintenance: 0,
    inactive: 0
  });

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://localhost:7084/api/vehicles');
      if (response.data.success) {
        setVehicles(response.data.result);
        
        // Calculate stats
        const vehicleStats = response.data.result.reduce((acc, vehicle) => {
          acc.total++;
          switch (vehicle.status.toLowerCase()) {
            case 'active':
              acc.active++;
              break;
            case 'maintenance':
              acc.maintenance++;
              break;
            case 'inactive':
              acc.inactive++;
              break;
          }
          return acc;
        }, { total: 0, active: 0, maintenance: 0, inactive: 0 });
        
        setStats(vehicleStats);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  return { vehicles, loading, error, stats, refetchVehicles: fetchVehicles };
};

export default useVehicles;