import { useState, useEffect } from "react";
import axios from "axios";
import { getBaseUrl } from "../utils/api";

const useVehicles = (page = 1, pageSize = 10) => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    maintenance: 0,
    inactive: 0,
  });

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${getBaseUrl()}/vehicles`, {
        params: {
          page,
          pageSize,
        },
      });
      
      if (response.data.success) {
        const result = response.data.result;
        
        // Handle both paginated and non-paginated responses
        if (result.items) {
          // Paginated response
          setVehicles(result.items);
          setTotalCount(result.totalCount || 0);
          setTotalPages(result.totalPages || 1);
        } else {
          // Non-paginated response (fallback)
          setVehicles(result);
          setTotalCount(result.length);
          setTotalPages(Math.ceil(result.length / pageSize));
        }

        // Calculate stats from all vehicles (not just current page)
        // For now, we'll calculate from current page data
        // In a real implementation, you might want to get stats separately
        const vehicleStats = (result.items || result).reduce(
          (acc, vehicle) => {
            acc.total++;
            switch (vehicle.status.toLowerCase()) {
              case "active":
                acc.active++;
                break;
              case "maintenance":
                acc.maintenance++;
                break;
              case "inactive":
                acc.inactive++;
                break;
            }
            return acc;
          },
          { total: 0, active: 0, maintenance: 0, inactive: 0 }
        );

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
  }, [page, pageSize]);

  return { 
    vehicles, 
    loading, 
    error, 
    stats, 
    totalCount, 
    totalPages, 
    refetchVehicles: fetchVehicles 
  };
};

export default useVehicles;
