// frontend/src/store/propertyStore.ts
import { create } from 'zustand';
import { Property, PaginatedResponse } from '@/types';
import { apiService } from '@/services/api';
import toast from 'react-hot-toast';

interface PropertyState {
  properties: Property[];
  favorites: Property[];
  isLoading: boolean;
  totalPages: number;
  currentPage: number;
  
  fetchProperties: (page?: number, filters?: any) => Promise<void>;
  fetchFavorites: () => Promise<void>;
  toggleFavorite: (propertyId: string) => Promise<void>;
  searchProperties: (query: string) => Promise<void>;
}

export const usePropertyStore = create<PropertyState>((set, get) => ({
  properties: [],
  favorites: [],
  isLoading: false,
  totalPages: 1,
  currentPage: 1,

  fetchProperties: async (page = 1, filters = {}) => {
    set({ isLoading: true });
    try {
      const response = await apiService.get<PaginatedResponse<Property>>(`/properties?page=${page}`, filters);
      set({ 
        properties: response.data, 
        totalPages: response.totalPages,
        currentPage: response.page,
        isLoading: false 
      });
    } catch (error) {
      set({ isLoading: false });
      toast.error('Failed to fetch properties');
    }
  },

  fetchFavorites: async () => {
    set({ isLoading: true });
    try {
      const response = await apiService.get<Property[]>('/favorites');
      set({ favorites: response, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      toast.error('Failed to fetch favorites');
    }
  },

  toggleFavorite: async (propertyId: string) => {
    try {
      const isFavorite = get().favorites.some(fav => fav.id === propertyId);
      if (isFavorite) {
        await apiService.delete(`/favorites/${propertyId}`);
        set({ favorites: get().favorites.filter(fav => fav.id !== propertyId) });
        toast.success('Removed from favorites');
      } else {
        const response = await apiService.post<Property>(`/favorites/${propertyId}`, {});
        set({ favorites: [...get().favorites, response] });
        toast.success('Added to favorites');
      }
    } catch (error) {
      toast.error('Failed to update favorites');
    }
  },

  searchProperties: async (query: string) => {
    set({ isLoading: true });
    try {
      const response = await apiService.get<PaginatedResponse<Property>>(`/properties/search?q=${query}`);
      set({ properties: response.data, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      toast.error('Search failed');
    }
  },
}));