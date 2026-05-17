import api from './api';
import { Lead, LeadFormData, LeadFilters, ApiResponse, PaginationMeta } from '../types';

export const leadsService = {
  getAll: async (filters: LeadFilters): Promise<{ leads: Lead[]; meta: PaginationMeta }> => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.source) params.append('source', filters.source);
    if (filters.search) params.append('search', filters.search);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.page) params.append('page', String(filters.page));
    params.append('limit', '10');

    const res = await api.get<ApiResponse<Lead[]>>(`/leads?${params.toString()}`);
    return { leads: res.data.data ?? [], meta: res.data.meta! };
  },

  getOne: async (id: string): Promise<Lead> => {
    const res = await api.get<ApiResponse<Lead>>(`/leads/${id}`);
    return res.data.data!;
  },

  create: async (data: LeadFormData): Promise<Lead> => {
    const res = await api.post<ApiResponse<Lead>>('/leads', data);
    return res.data.data!;
  },

  update: async (id: string, data: Partial<LeadFormData>): Promise<Lead> => {
    const res = await api.patch<ApiResponse<Lead>>(`/leads/${id}`, data);
    return res.data.data!;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/leads/${id}`);
  },

  exportCSV: (filters: LeadFilters): void => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.source) params.append('source', filters.source);
    if (filters.search) params.append('search', filters.search);
    const token = localStorage.getItem('token');
    window.open(`/api/leads/export/csv?${params.toString()}&token=${token}`, '_blank');
  },

  getStats: async () => {
    const res = await api.get('/leads/stats');
    return res.data.data;
  },
};
