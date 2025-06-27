// src/hooks/useDashboard.js
import { useState, useEffect, useCallback } from 'react';
import { fetchDashboardOverview } from '../services/dashboardService';

export function useDashboard() {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  // função de fetch reutilizável
  const load = useCallback(() => {
    setLoading(true);
    fetchDashboardOverview()
      .then(resp => setOverview(resp.data))
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  // busca inicial
  useEffect(() => {
    load();
  }, [load]);

  // refetch quando um checkin é criado
  useEffect(() => {
    window.addEventListener('checkin', load);
    return () => window.removeEventListener('checkin', load);
  }, [load]);

  return { overview, loading, error };
}
