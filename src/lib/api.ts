/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';

// Change this to use the API prefix
const API_URL = '/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle authentication errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Unauthorized, clear local storage and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API functions
export const login = async (email: string, password: string) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const register = async (firstName: string, lastName: string, email: string, password: string) => {
  const response = await api.post('/auth/register', { firstName, lastName, email, password });
  return response.data;
};

// Tasks API functions
export const getTasks = async () => {
  const response = await api.get('/tasks');
  return response.data;
};

export const getTask = async (id: string) => {
  const response = await api.get(`/tasks/${id}`);
  return response.data;
};

export const createTask = async (task: any) => {
  const response = await api.post('/tasks', task);
  return response.data;
};

export const updateTask = async (id: string, task: any) => {
  const response = await api.patch(`/tasks/${id}`, task);
  return response.data;
};

export const deleteTask = async (id: string) => {
  const response = await api.delete(`/tasks/${id}`);
  return response.data;
};

// Notes API functions
export const getNotes = async () => {
  const response = await api.get('/notes');
  return response.data;
};

export const getNote = async (id: string) => {
  const response = await api.get(`/notes/${id}`);
  return response.data;
};

export const createNote = async (note: any) => {
  const response = await api.post('/notes', note);
  return response.data;
};

export const updateNote = async (id: string, note: any) => {
  const response = await api.patch(`/notes/${id}`, note);
  return response.data;
};

export const deleteNote = async (id: string) => {
  const response = await api.delete(`/notes/${id}`);
  return response.data;
};

// Events API functions
export const getEvents = async () => {
  const response = await api.get('/events');
  return response.data;
};

export const getEventsByMonth = async (date: Date) => {
  const response = await api.get(`/events/month?date=${date.toISOString()}`);
  return response.data;
};

export const getEvent = async (id: string) => {
  const response = await api.get(`/events/${id}`);
  return response.data;
};

export const createEvent = async (event: any) => {
  const response = await api.post('/events', event);
  return response.data;
};

export const updateEvent = async (id: string, event: any) => {
  const response = await api.patch(`/events/${id}`, event);
  return response.data;
};

export const deleteEvent = async (id: string) => {
  const response = await api.delete(`/events/${id}`);
  return response.data;
};

export default api;
