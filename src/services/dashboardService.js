// src/services/dashboardService.js
import api from '../api';

export function fetchDashboardOverview() {
  return api.get('/dashboard/overview');
}
