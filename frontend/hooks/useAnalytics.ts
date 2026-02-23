import { useState, useEffect } from 'react';
import { analyticsService } from '../services/analytics.service';

export const useUserAnalytics = (period = '30d') => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await analyticsService.getUserAnalytics(period);
        setAnalytics(response.analytics);
      } catch (err: any) {
        setError(err.message || 'Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [period]);

  return { analytics, loading, error };
};

export const useExpertAnalytics = (period = '30d') => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await analyticsService.getExpertAnalytics(period);
        setAnalytics(response.analytics);
      } catch (err: any) {
        setError(err.message || 'Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [period]);

  return { analytics, loading, error };
};
