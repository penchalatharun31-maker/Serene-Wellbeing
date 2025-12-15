import { useState, useEffect } from 'react';
import { expertService, Expert, ExpertFilters } from '../services/expert.service';

export const useExperts = (filters?: ExpertFilters) => {
  const [experts, setExperts] = useState<Expert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
  });

  useEffect(() => {
    const fetchExperts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await expertService.getExperts(filters);
        setExperts(response.experts);
        setPagination({
          page: response.page,
          pages: response.pages,
          total: response.total,
        });
      } catch (err: any) {
        setError(err.message || 'Failed to load experts');
      } finally {
        setLoading(false);
      }
    };

    fetchExperts();
  }, [JSON.stringify(filters)]);

  return { experts, loading, error, pagination };
};

export const useExpert = (id: string) => {
  const [expert, setExpert] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExpert = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await expertService.getExpertById(id);
        setExpert(response.expert);
        setReviews(response.reviews || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load expert');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchExpert();
    }
  }, [id]);

  return { expert, reviews, loading, error };
};
