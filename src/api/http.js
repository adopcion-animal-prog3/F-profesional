import axios from 'axios'
import { getAuthorizationHeader } from '../auth/session'

const demoPets = [
  {
    id: 1,
    name: 'Luna',
    species: 'Perro',
    breed: 'Mestizo',
    age: '2 años',
    gender: 'Hembra',
    status: 'Disponible',
    location: 'Córdoba',
    description: 'Muy sociable, ideal para vivir con familias activas.'
  },
  {
    id: 2,
    name: 'Milo',
    species: 'Gato',
    breed: 'Siamés',
    age: '1 año',
    gender: 'Macho',
    status: 'En tratamiento',
    location: 'Mendoza',
    description: 'Cariñoso y tranquilo, aprende rápido a convivir con otros animales.'
  },
  {
    id: 3,
    name: 'Nube',
    species: 'Conejo',
    breed: 'Mini Lop',
    age: '10 meses',
    gender: 'Hembra',
    status: 'Disponible',
    location: 'Buenos Aires',
    description: 'Dócil y fácil de manejar, perfecto para hogares tranquilos.'
  }
]

const normalizePetsPayload = (payload) => {
  if (Array.isArray(payload)) return payload
  if (payload && Array.isArray(payload.mascotas)) return payload.mascotas
  if (payload && Array.isArray(payload.data)) return payload.data
  return []
}

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
export const apiGetPets = async () => {
  try {
    const response = await apiClient.get('/api/mascotas')

    return {
      source: 'api',
      data: normalizePetsPayload(response.data)
    }
  } catch (error) {
    const isOffline =
      typeof navigator !== 'undefined' && !navigator.onLine

    const isNetworkFailure =
      error?.code === 'ERR_NETWORK' ||
      error?.message?.includes('Network') ||
      isOffline

    if (isNetworkFailure) {
      return {
        source: 'demo',
        data: demoPets
      }
    }

    throw error
  }
}

export default apiClient
