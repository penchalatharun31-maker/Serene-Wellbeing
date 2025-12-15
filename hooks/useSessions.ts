import { useState, useEffect } from 'react';
import { sessionService } from '../services/session.service';

export const useSessions = (type: 'user' | 'expert' = 'user', status?: string) => {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
  });

  const fetchSessions = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);

      const response =
        type === 'user'
          ? await sessionService.getUserSessions({ status, page })
          : await sessionService.getExpertSessions({ status, page });

      setSessions(response.sessions);
      setPagination({
        page: response.page,
        pages: response.pages,
        total: response.total,
      });
    } catch (err: any) {
      setError(err.message || 'Failed to load sessions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [type, status]);

  return { sessions, loading, error, pagination, refetch: fetchSessions };
};

export const useUpcomingSessions = () => {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await sessionService.getUpcomingSessions();
        setSessions(response.sessions);
      } catch (err: any) {
        setError(err.message || 'Failed to load upcoming sessions');
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  return { sessions, loading, error };
};
