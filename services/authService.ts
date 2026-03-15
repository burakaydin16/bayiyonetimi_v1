
import { api } from './apiService';

const SUPER_ADMIN_API_URL = import.meta.env.VITE_SUPER_ADMIN_API_URL || import.meta.env.VITE_API_URL || 'https://api.nisanaydin.com.tr/api';

export const authService = {
    login: async (tenantRef: string, email: string, password: string) => {
        const data = await api.post('/auth/login', { tenant_ref: tenantRef, email, password });
        if (data.token) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('tenantRef', data.tenantRef || tenantRef);
            localStorage.setItem('tenantName', data.tenantName || '');
            if (data.user) {
                localStorage.setItem('user', JSON.stringify(data.user));
            }
        }
        return data;
    },

    registerTenant: async (name: string, username: string, email: string, password: string) => {
        return await api.post('/auth/register-tenant', { name, username, email, password });
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('tenantRef');
        localStorage.removeItem('tenantName');
        localStorage.removeItem('user');
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    },

    getUser: () => {
        const u = localStorage.getItem('user');
        return u ? JSON.parse(u) : null;
    },

    getRole: (): string => {
        const u = localStorage.getItem('user');
        if (!u) return '';
        return JSON.parse(u).role || '';
    },

    changePassword: async (oldPassword: string, newPassword: string) => {
        return await api.post('/auth/change-password', {
            old_password: oldPassword,
            new_password: newPassword
        });
    },

    superAdminLogin: async (username: string, password: string) => {
        const response = await fetch(`${SUPER_ADMIN_API_URL}/auth/super-admin-login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            throw new Error(err.message || err || 'Giriş başarısız.');
        }
        const data = await response.json();
        if (data.token) {
            localStorage.setItem('superAdminToken', data.token);
        }
        return data;
    },

    superAdminLogout: () => {
        localStorage.removeItem('superAdminToken');
    },

    isSuperAdminAuthenticated: () => {
        return !!localStorage.getItem('superAdminToken');
    },
};
