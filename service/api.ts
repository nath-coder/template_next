import axios from 'axios';
import { Customer, ApiResponse } from '@/lib/types';

// Configuración de axios para usar nuestras API routes internas
const api = axios.create({
    baseURL: '/api', // Usar las API routes de Next.js
    timeout: 10000,
});

// Headers para requests legacy (fallback)
const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5NzViZTQ3NjFjYzI2MzJhOWQxZDc4ZSIsImVtYWlsIjoiZGlhbmFAZ21haWwuY29tIiwibmFtZSI6IkRpYW5hUHJpbmNlIiwiaWF0IjoxNzY5MzI0MjAxfQ.Rr8QTcPvZguQOyVXdy_Z-z6wSUBMnZ3WdzBzoA5kcUU`
};

// === CUSTOMERS API ===
export const customersApi = {
    // Obtener todos los customers
    getCustomers: async (query?: string): Promise<Customer[]> => {
        try {
            const params = query ? { search: query } : {};
            const response = await api.get<Customer[]>('/customers', { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching customers:', error);
            throw new Error('Failed to fetch customers');
        }
    },

    // Obtener un customer por ID
    getCustomerById: async (id: string): Promise<Customer> => {
        try {
            const response = await api.get<Customer>(`/customers/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching customer:', error);
            throw new Error('Failed to fetch customer');
        }
    },

    // Crear un nuevo customer
    createCustomer: async (customerData: Omit<Customer, '_id'>): Promise<Customer> => {
        try {
            const response = await api.post<Customer>('/customers', customerData);
            return response.data;
        } catch (error) {
            console.error('Error creating customer:', error);
            throw new Error('Failed to create customer');
        }
    },

    // Actualizar un customer
    updateCustomer: async (id: string, customerData: Partial<Omit<Customer, '_id'>>): Promise<Customer> => {
        try {
            const response = await api.put<Customer>(`/customers/${id}`, customerData);
            return response.data;
        } catch (error) {
            console.error('Error updating customer:', error);
            throw new Error('Failed to update customer');
        }
    },

    // Eliminar un customer
    deleteCustomer: async (id: string): Promise<void> => {
        try {
            await api.delete(`/customers/${id}`);
        } catch (error) {
            console.error('Error deleting customer:', error);
            throw new Error('Failed to delete customer');
        }
    },
};

export const fetchCardData= async()=>{
    try{
        const [getCustomerCount,getInvoicesCount,getInvoicesStatusCount]= await Promise.all([
             fetch(`${process.env.BACKEND_URL}/customer/count`,{headers}),
             fetch(`${process.env.BACKEND_URL}/invoices/count`,{headers}),
             fetch(`${process.env.BACKEND_URL}/invoices/status-count`,{headers})
        ])
        const resultCustomerCount= await getCustomerCount.json();
        const resultInvoicesCount= await getInvoicesCount.json();
        const resultInvoicesStatusCount= await getInvoicesStatusCount.json();

        const numberOfInvoices= Number(resultInvoicesCount ?? '0');
        const numberOfCustomers= Number (resultCustomerCount ?? '0');
        const totalPaidInvoices= resultInvoicesStatusCount.paid ?? 0;
        const totalPendingInvoices= resultInvoicesStatusCount.pending ?? 0;
        return [
            numberOfInvoices,
            numberOfCustomers,
            totalPaidInvoices,
            totalPendingInvoices
        ];
    }catch(error){
        console.log('Error :>>',error);
        throw new Error('Failed to fetch card data');
    }
}