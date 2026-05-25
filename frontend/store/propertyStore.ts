// frontend/src/store/propertyStore.ts
import { create } from 'zustand';
import { Property, PaginatedResponse } from '@/types';
import { apiService } from '@/services/api';
import toast from 'react-hot-toast';

interface PropertyState {
  properties: Property[];
  currentProperty: Property | null;
  similarProperties: Property[];
  favorites: Property[];
  isLoading: boolean;
  pagination: PaginatedResponse<any>['pagination'] | null;
  filters: PropertyFilters;
  fetchProperties: (filters?: PropertyFilters) => Promise<void>;
  fetchProperty: (id: string) => Promise<void>;
  fetchSimilarProperties: (id: string) => Promise<void>;
  createProperty: (data: FormData) => Promise<void>;
  updateProperty: (id: string, data: any) => Promise<void>;
  deleteProperty: (id: string) => Promise<void>;
  toggleFavorite: (propertyId: string) => Promise<void>;
  fetchFavorites: () => Promise<void>;
  setFilters: (filters: Partial<PropertyFilters>) => void;
  clearFilters: () => void;
}

interface PropertyFilters {
  search?: string;
  city?: string;
  propertyType?: string;
  listingType?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export const usePropertyStore = create<PropertyState>((set, get) => ({
  properties: [],
  currentProperty: null,
  similarProperties: [],
  favorites: [],
  isLoading: false,
  pagination: null,
  filters: {
    page: 1,
    limit: 12,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  },

  fetchProperties: async (filters = {}) => {
    set({ isLoading: true });
    try {
      const currentFilters = { ...get().filters, ...filters };
      const queryParams = new URLSearchParams(
        Object.entries(currentFilters).reduce((acc, [key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            acc[key] = String(value);
          }
          return acc;
        }, {} as Record<string, string>)
      );
      
      const response = await apiService.get<PaginatedResponse<Property>>(
        `/properties?${queryParams.toString()}`
      );
      
      set({
        properties: response.data.properties,
        pagination: response.data.pagination,
        filters: currentFilters,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      toast.error('Failed to fetch properties');
    }
  },

  fetchProperty: async (id: string) => {
    set({ isLoading: true });
    try {
      const response = await apiService.get(`/properties/${id}`);
      set({ currentProperty: response.data.data, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      toast.error('Failed to fetch property details');
    }
  },

  fetchSimilarProperties: async (id: string) => {
    try {
      const response = await apiService.get(`/properties/${id}/similar`);
      set({ similarProperties: response.data.data });
    } catch (error) {
      console.error('Failed to fetch similar properties:', error);
    }
  },

  createProperty: async (data: FormData) => {
    set({ isLoading: true });
    try {
      const response = await apiService.uploadMultiple('/properties', 
        Array.from(data.getAll('images')) as File[], 
        'images'
      );
      toast.success('Property created successfully!');
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      set({ isLoading: false });
      toast.error('Failed to create property');
      throw error;
    }
  },

  updateProperty: async (id: string, data: any) => {
    set({ isLoading: true });
    try {
      await apiService.put(`/properties/${id}`, data);
      toast.success('Property updated successfully!');
      set({ isLoading: false });
      get().fetchProperty(id);
    } catch (error) {
      set({ isLoading: false });
      toast.error('Failed to update property');
    }
  },

  deleteProperty: async (id: string) => {
    set({ isLoading: true });
    try {
      await apiService.delete(`/properties/${id}`);
      toast.success('Property deleted successfully!');
      set({ isLoading: false });
      get().fetchProperties();
    } catch (error) {
      set({ isLoading: false });
      toast.error('Failed to delete property');
    }
  },

  toggleFavorite: async (propertyId: string) => {
    try {
      await apiService.post(`/properties/${propertyId}/favorite`);
      get().fetchFavorites();
      toast.success('Favorite status updated');
    } catch (error) {
      toast.error('Failed to update favorite');
    }
  },

  fetchFavorites: async () => {
    try {
      const response = await apiService.get('/properties/user/favorites');
      set({ favorites: response.data.data });
    } catch (error) {
      console.error('Failed to fetch favorites:', error);
    }
  },

  setFilters: (filters: Partial<PropertyFilters>) => {
    set((state) => ({
      filters: { ...state.filters, ...filters, page: 1 },
    }));
    get().fetchProperties();
  },

  clearFilters: () => {
    set({
      filters: {
        page: 1,
        limit: 12,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      },
    });
    get().fetchProperties();
  },
}));