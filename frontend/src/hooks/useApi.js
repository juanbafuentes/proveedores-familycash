import { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:8080';

export const useApi = () => {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [user, setUser] = useState(null);

    const login = async (nif, proveedorId, password) => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nif, proveedorId: parseInt(proveedorId), password })
            });

            if (!response.ok) throw new Error('Error de autenticación');

            const data = await response.text(); // El backend devuelve el token como texto plano
            localStorage.setItem('token', data);
            setToken(data);
            return true;
        } catch (error) {
            console.error('Login error:', error);
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    const fetchWithAuth = async (endpoint, options = {}) => {
        const headers = {
            ...options.headers,
            'Authorization': `Bearer ${token}`,
            'X-Entorno': 'prod' // Cambiamos a 'prod' para usar los datos reales de LU_PRO
        };

        const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });
        if (response.status === 401) logout();
        return response;
    };

    return { token, login, logout, fetchWithAuth };
};
