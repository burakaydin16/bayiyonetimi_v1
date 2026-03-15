
const API_URL = import.meta.env.VITE_API_URL || 'https://api.nisanaydin.com.tr/api';

export const api = {
  async post(endpoint: string, data: any) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      let errorMessage = 'Bir hata oluştu';
      const clonedResponse = response.clone();
      try {
        const errorData = await clonedResponse.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch (e) {
        errorMessage = await response.text() || errorMessage;
      }
      throw new Error(errorMessage);
    }

    return response.json();
  },

  async get(endpoint: string) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    });

    if (!response.ok) {
      let errorMessage = 'Bir hata oluştu';
      const clonedResponse = response.clone();
      try {
        const errorData = await clonedResponse.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch (e) {
        errorMessage = await response.text() || errorMessage;
      }
      throw new Error(errorMessage);
    }

    return response.json();
  },

  async put(endpoint: string, data: any) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      let errorMessage = 'Bir hata oluştu';
      const clonedResponse = response.clone();
      try {
        const errorData = await clonedResponse.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch (e) {
        errorMessage = await response.text() || errorMessage;
      }
      throw new Error(errorMessage);
    }

    return response.json();
  },

  async delete(endpoint: string) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    });

    if (!response.ok) {
      let errorMessage = 'Bir hata oluştu';
      const clonedResponse = response.clone();
      try {
        const errorData = await clonedResponse.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch (e) {
        errorMessage = await response.text() || errorMessage;
      }
      throw new Error(errorMessage);
    }

    if (response.status === 204) return null;
    return response.json();
  }
};

