import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiService } from '@/services/api';
import toast from 'react-hot-toast';

// Define types locally or import from @/types
interface User {
  id: string;
  email: string;
  name?: string;
  role?: 'user' | 'admin';
}

interface LoginResponse {
  user: User;
  token: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string, name?: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          // Add type assertion here
          const response = await apiService.post<LoginResponse>('/auth/login', { email, password });
          const { user, token } = response; // Note: response is the data directly, not response.data
          localStorage.setItem('token', token);
          set({ user, token, isLoading: false });
          toast.success('Logged in successfully!');
        } catch (error: any) {
          set({ isLoading: false });
          toast.error(error.message || 'Login failed');
        }
      },

      logout: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null });
        toast.success('Logged out successfully!');
      },

      register: async (email: string, password: string, name?: string) => {
        set({ isLoading: true });
        try {
          const response = await apiService.post<LoginResponse>('/auth/register', { email, password, name });
          const { user, token } = response; // Note: response is the data directly
          localStorage.setItem('token', token);
          set({ user, token, isLoading: false });
          toast.success('Registered successfully!');
        } catch (error: any) {
          set({ isLoading: false });
          toast.error(error.message || 'Registration failed');
        }
      },
    }),
    {
      name: 'auth-storage',
      getStorage: () => localStorage,
    }
  )
);