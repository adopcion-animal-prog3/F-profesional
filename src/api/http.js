import axios from 'axios'
import { getAuthorizationHeader } from '../auth/session'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

apiClient.interceptors.request.use((config) => {
  const authHeader = getAuthorizationHeader()

  if (authHeader.Authorization) {
    config.headers.Authorization = authHeader.Authorization
  }

  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'Error de comunicación con el backend.'

    return Promise.reject(new Error(message))
  }
)

export const apiHealthCheck = () => apiClient.get('/health')
export const apiLogin = (credentials) => apiClient.post('/api/auth/login', credentials)
export const apiRegister = (userData) => apiClient.post('/api/auth/register', userData)

export default apiClient
