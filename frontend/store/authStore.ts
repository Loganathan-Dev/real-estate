// frontend/src/store/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';
import { apiService } from '@/services/api';
import toast from 'react-hot-toast';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  fetchUser: () => Promise<void>;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  phone?: string;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const response = await apiService.post('/auth/login', { email, password });
          const { user, token } = response.data;
          localStorage.setItem('token', token);
          set({ user, token, isLoading: false });
          toast.success('Logged in successfully!');
        } catch (error: any) {
          set({ isLoading: false });
          toast.error(error.response?.data?.error || 'Login failed');
          throw error;
        }
      },

      register: async (data: RegisterData) => {
        set({ isLoading: true });
        try {
          const response = await apiService.post('/auth/register', data);
          const { user, token } = response.data;
          localStorage.setItem('token', token);
          set({ user, token, isLoading: false });
          toast.success('Registered successfully!');
        } catch (error: any) {
          set({ isLoading: false });
          toast.error(error.response?.data?.error || 'Registration failed');
          throw error;
        }
      },

      logout: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null });
        toast.success('Logged out successfully');
        window.location.href = '/';
      },

      fetchUser: async () => {
        try {
          const response = await apiService.get('/auth/me');
          set({ user: response.data });
        } catch (error) {
          console.error('Failed to fetch user:', error);
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);