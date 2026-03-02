import api from './api';

export interface Tool {
  id: string;
  name: string;
  category: string;
  monthly_cost: number;
  currency: string;
  licenses_total: number;
  licenses_used: number;
  renewal_date: string;
  contract_type: string;
  status: string;
}

export const toolService = {
  getAll: async () => {
    const response = await api.get('/tools');
    return response.data;
  },

  create: async (data: Omit<Tool, 'id'>) => {
    const response = await api.post('/tools', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Tool>) => {
    const response = await api.put(`/tools/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/tools/${id}`);
    return response.data;
  },
};