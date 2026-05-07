import { api } from './api';
import { goto } from '$app/navigation';

export interface User {
  id: string;
  email: string;
  displayName: string;
  role?: string;
}

class AuthStore {
  user = $state<User | null>(null);
  loading = $state<boolean>(true);

  constructor() {
    this.refresh();
  }

  async refresh(): Promise<void> {
    this.loading = true;
    try {
      const res = await api.get<User>('/me');
      if (res.ok && res.data) {
        this.user = res.data;
      } else {
        this.user = null;
      }
    } catch {
      this.user = null;
    } finally {
      this.loading = false;
    }
  }

  async login(email: string, password: string): Promise<boolean> {
    this.loading = true;
    try {
      const res = await api.post<User>('/admin/login', { email, password });
      if (res.ok && res.data) {
        this.user = res.data;
        await this.refresh(); // Refresh to get full user data
        return true;
      }
      return false;
    } catch {
      return false;
    } finally {
      this.loading = false;
    }
  }

  async logout(): Promise<void> {
    try {
      await api.post('/admin/logout');
      this.user = null;
      goto('/');
    } catch {
      this.user = null;
      goto('/');
    }
  }

  setUser(user: User | null): void {
    this.user = user;
  }

  get isLoggedIn(): boolean {
    return this.user !== null;
  }

  get isAdmin(): boolean {
    return this.user?.role === 'admin';
  }
}

export const auth = new AuthStore();