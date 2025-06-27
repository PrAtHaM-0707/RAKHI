import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const API_BASE_URL = 'https://rakhi.onrender.com/api';

// Helper to get auth token
const getToken = () => localStorage.getItem('token');

// Categories
export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      try {
        const headers = getToken() ? { Authorization: `Bearer ${getToken()}` } : {};
        const response = await axios.get(`${API_BASE_URL}/categories`, { headers });
        const data = response.data?.data || response.data;
        if (!Array.isArray(data)) {
          console.error('Categories API returned non-array data:', data);
          return [];
        }
        const validCategories = data.filter(
          (category): category is { _id: string; name?: string; description?: string } =>
            !!category && typeof category._id === 'string' && category._id !== 'undefined'
        );
       return validCategories;
      } catch (error: any) {
        console.error('Error fetching categories:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
        });
        throw new Error(error.response?.data?.error || 'Failed to fetch categories');
      }
    },
  });
};

// Products
export const useProducts = (page = 1, limit = 12, categoryFilter = '') => {
  return useQuery({
    queryKey: ['products', page, limit, categoryFilter], // Ensure stable query key
    queryFn: async () => {
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });
        if (categoryFilter && categoryFilter !== 'All') {
          params.append('category', categoryFilter); // Send category ID
        }
        const headers = getToken() ? { Authorization: `Bearer ${getToken()}` } : {};
        const response = await axios.get(`${API_BASE_URL}/products?${params}`, { headers });
        return response.data;
      } catch (error: any) {
        console.error('Error fetching products:', {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
        }); // Log detailed error
        throw new Error(error.response?.data?.error || 'Failed to fetch products');
      }
    },
    retry: 1, // Reduce retries to avoid spamming
    staleTime: 1000 * 60, // Cache for 1 minute
  });
};

// Site Settings
export const useSiteSettings = () => {
  return useQuery({
    queryKey: ['siteSettings'],
    queryFn: async () => {
      const headers = getToken() ? { Authorization: `Bearer ${getToken()}` } : {};
      const response = await axios.get(`${API_BASE_URL}/settings`, { headers });
      return response.data;
    },
    onError: (error: any) => {
      console.error('Error fetching site settings:', error);
    },
  });
};

// Admin Mutations
export const useAddProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (product) => {
      const formData = new FormData();
      Object.entries(product).forEach(([key, value]) => {
        if (key === 'images') {
          (value as File[]).forEach((file: File) => formData.append('images', file));
        } else if (key === 'specifications') {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, String(value));
        }
      });
      const response = await axios.post(`${API_BASE_URL}/products`, formData, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error: any) => {
      console.error('Add product error:', error.response?.data);
      throw new Error(error.response?.data?.error || 'Failed to add product');
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ _id, product }) => {
     if (!_id || _id === 'undefined') {
        throw new Error('Invalid product ID');
      }
      const formData = new FormData();
      Object.entries(product).forEach(([key, value]) => {
        if (key === 'images') {
          (value as File[]).forEach((file: File) => formData.append('images', file));
        } else if (key === 'specifications') {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, String(value));
        }
      });
      const response = await axios.put(`${API_BASE_URL}/products/${_id}`, formData, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error: any) => {
      console.error('Update product error:', error.response?.data); // Log detailed error
      throw new Error(error.response?.data?.error || 'Failed to update product');
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (_id) => {
      if (!_id || _id === 'undefined') {
        throw new Error('Invalid product ID');
      }
      const response = await axios.delete(`${API_BASE_URL}/products/${_id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error: any) => {
      console.error('Delete product error:', error.response?.data); // Log detailed error
      throw new Error(error.response?.data?.error || 'Failed to delete product');
    },
  });
};

export const useToggleStock = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (_id) => {
     if (!_id || _id === 'undefined') {
        throw new Error('Invalid product ID');
      }
      const response = await axios.patch(`${API_BASE_URL}/products/${_id}/toggle-stock`, {}, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error: any) => {
      console.error('Toggle stock error:', error.response?.data); // Log detailed error
      throw new Error(error.response?.data?.error || 'Failed to toggle stock');
    },
  });
};

export const useAddCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (category) => {
      const response = await axios.post(`${API_BASE_URL}/categories`, category, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      return response.data;
    },
    onSuccess: () => {
      // Force refetch by invalidating and removing cache
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.removeQueries({ queryKey: ['categories'] });
     
    },
    onError: (error: any) => {
      console.error('Error adding category:', error);
      throw new Error(error.response?.data?.error || 'Failed to add category');
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ _id, category }) => {
      if (!_id || _id === 'undefined') {
        throw new Error('Invalid category ID');
      }
      const response = await axios.put(`${API_BASE_URL}/categories/${_id}`, category, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: (error: any) => {
      throw new Error(error.response?.data?.error || 'Failed to update category');
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (_id) => {
      if (!_id || _id === 'undefined') {
        throw new Error('Invalid category ID');
      }
      const response = await axios.delete(`${API_BASE_URL}/categories/${_id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: (error: any) => {
      throw new Error(error.response?.data?.error || 'Failed to delete category');
    },
  });
};

export const useUpdateSettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (settings) => {
      const response = await axios.put(`${API_BASE_URL}/settings`, settings, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['siteSettings'] });
    },
    onError: (error: any) => {
      throw new Error(error.response?.data?.error || 'Failed to update settings');
    },
  });
};

export const useAdminLogin = () => {
  return useMutation({
    mutationFn: async (password) => {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, { password });
      return response.data;
    },
    onSuccess: (data) => {
      localStorage.setItem('token', data.token);
    },
    onError: (error: any) => {
      throw new Error(error.response?.data?.error || 'Failed to login');
    },
  });
};

export const defaultSiteSettings = {
  site_title: 'RakhiMart',
  site_description: 'Your favorite Rakhi store.',
  contact_phone: '1234567890',
  contact_email: 'support@rakhimart.com',
  delivery_charges: '50',
  free_delivery_minimum: '200',
};
