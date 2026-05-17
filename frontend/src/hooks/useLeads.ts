import { useState, useEffect, useCallback } from 'react';
import { Lead, LeadFilters, PaginationMeta } from '../types';
import { leadsService } from '../services/leads';
import { useDebounce } from './useDebounce';
import toast from 'react-hot-toast';

export function useLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<LeadFilters>({ sortBy: '-createdAt', page: 1 });

  const debouncedSearch = useDebounce(filters.search, 400);

  const fetchLeads = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await leadsService.getAll({ ...filters, search: debouncedSearch });
      setLeads(result.leads);
      setMeta(result.meta);
    } catch {
      toast.error('Failed to load leads');
    } finally {
      setIsLoading(false);
    }
  }, [filters, debouncedSearch]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const updateFilter = (updates: Partial<LeadFilters>) => {
    setFilters((prev) => ({ ...prev, ...updates, page: 1 }));
  };

  const setPage = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const deleteLead = async (id: string) => {
    try {
      await leadsService.delete(id);
      toast.success('Lead deleted');
      fetchLeads();
    } catch {
      toast.error('Failed to delete lead');
    }
  };

  return { leads, meta, isLoading, filters, updateFilter, setPage, deleteLead, refetch: fetchLeads };
}
