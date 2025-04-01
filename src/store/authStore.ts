import { create } from 'zustand';
import { User, Role, UserRole } from '../types/auth';
import { authApi } from '../services/api';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
  initAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  isLoading: true,
  error: null,
  setAuth: (token: string, user: User) => {
    localStorage.setItem('token', token);
    set({ user, token, isAuthenticated: true, error: null });
  },
  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false });
    window.location.href = '/login';
  },
  initAuth: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ isLoading: false, isAuthenticated: false });
      return;
    }

    try {
      const response = await authApi.validateToken();
      set({ user: response.user, isAuthenticated: true, error: null });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      localStorage.removeItem('token');
      set({ user: null, token: null, isAuthenticated: false, error: 'Session expired' });
    } finally {
      set({ isLoading: false });
    }
  }
}));

export const getDashboardPath = (roles: UserRole[]): string => {
  if (!roles || roles.length === 0) return '/login';
  
  const role = roles[0].name;
  const paths: Record<Role, string> = {
    ADMIN: '/admin',
    TRAVAILLEUR: '/travailleur',
    PORTEURDEPROJET: '/projet',
    FOURNISSEUR: '/fournisseur'
  };
  return paths[role] || '/login';
};