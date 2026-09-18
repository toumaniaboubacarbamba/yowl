import axios, { type InternalAxiosRequestConfig } from 'axios'

// Instance Axios configurée pour l'API Laravel Backend
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Intercepteur pour injecter automatiquement le Token Bearer Sanctum
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('yowl_token')
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, (error: unknown) => {
  return Promise.reject(error)
})

export default api
