
import { api } from './apiService';

export const authService = {
    login: async (tenantName: string, email: string, password: string) => {
        const data = await api.post('/auth/login', { tenant_name: tenantName, email, password });
        if (data.token) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('tenantName', tenantName);
        }
        return data;
    },

    registerTenant: async (name: string, email: string, password: string) => {
        return await api.post('/auth/register-tenant', { name, email, password });
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('tenantName');
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    },

    changePassword: async (oldPassword: string, newPassword: string) => {
        return await api.post('/auth/change-password', {
            old_password: oldPassword,
            new_password: newPassword
        });
    }
};
