// src/hooks/useAuth.js
import { useState, useEffect } from 'react';
import { getCurrentUser, logout } from '../services/authService';

export function useAuth() {
  const [admin, setAdmin]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    getCurrentUser()
      .then(resp => {
        setAdmin(resp.data.data.admin);
      })
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { admin, loading, error, logout };
}
