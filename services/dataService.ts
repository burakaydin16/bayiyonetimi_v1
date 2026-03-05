import { api } from './apiService';
import { Customer, Product, Transaction } from '../types';

export const DataService = {
    // --- Products ---
    getProducts: async (): Promise<Product[]> => {
        try {
            return await api.get('/products');
        } catch (error) {
            console.error('Error fetching products:', error);
            return [];
        }
    },

    saveProduct: async (product: Partial<Product>): Promise<Product | false> => {
        try {
            if (product.id) {
                return await api.put(`/products/${product.id}`, product);
            } else {
                return await api.post('/products', product);
            }
        } catch (error) {
            console.error('Error saving product:', error);
            return false;
        }
    },

    deleteProduct: async (id: string): Promise<void> => {
        try {
            await api.delete(`/products/${id}`);
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    },

    // --- Customers ---
    getCustomers: async (): Promise<Customer[]> => {
        try {
            return await api.get('/customers');
        } catch (error) {
            console.error('Error fetching customers:', error);
            return [];
        }
    },

    saveCustomer: async (customer: Partial<Customer>): Promise<Customer | false> => {
        try {
            if (customer.id) {
                return await api.put(`/customers/${customer.id}`, customer);
            } else {
                return await api.post('/customers', customer);
            }
        } catch (error) {
            console.error('Error saving customer:', error);
            return false;
        }
    },

    deleteCustomer: async (id: string): Promise<void> => {
        try {
            await api.delete(`/customers/${id}`);
        } catch (error) {
            console.error('Error deleting customer:', error);
        }
    },

    // --- Transactions ---
    getTransactions: async (): Promise<Transaction[]> => {
        try {
            return await api.get('/transactions');
        } catch (error) {
            console.error('Error fetching transactions:', error);
            return [];
        }
    },

    getTransactionsByCustomer: async (customerId: string): Promise<Transaction[]> => {
        try {
            return await api.get(`/transactions/customer/${customerId}`);
        } catch (error) {
            console.error('Error fetching transactions by customer:', error);
            return [];
        }
    },

    processTransaction: async (transaction: Partial<Transaction>): Promise<Transaction> => {
        return await api.post('/transactions/process', transaction);
    },

    cancelTransaction: async (id: string): Promise<void> => {
        try {
            await api.delete(`/transactions/${id}`);
        } catch (error) {
            console.error('Error cancelling transaction:', error);
            throw error;
        }
    }
};
