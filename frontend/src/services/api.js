import axios from 'axios';
import { logger } from './logger';

const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor
api.interceptors.request.use(
    (config) => {
        logger.info(`API Request: ${config.method.toUpperCase()} ${config.url}`);
        return config;
    },
    (error) => {
        logger.error('API Request Error:', error);
        return Promise.reject(error);
    }
);

// Response Interceptor
api.interceptors.response.use(
    (response) => {
        logger.info(`API Response: ${response.status} ${response.config.url}`);
        return response;
    },
    (error) => {
        logger.error(`API Response Error: ${error.response?.status || 'Network Error'}`, error.message);
        return Promise.reject(error);
    }
);

export const getSectorAnalysis = async () => {
    try {
        const response = await api.get('/sector-analysis');
        return response.data;
    } catch (error) {
        // Logging handled by interceptor
        throw error;
    }
};

export const analyzeStock = async (ticker) => {
    try {
        const response = await api.get(`/analyze/${ticker}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const checkHealth = async () => {
    try {
        const response = await api.get('/health');
        return response.data;
    } catch (error) {
        return null;
    }
};

export default api;
