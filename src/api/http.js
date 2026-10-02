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

const normalizePetPayload = (payload) => {
  if (!payload || typeof payload !== 'object') return null

  if (payload.mascota) return payload.mascota
  if (payload.pet) return payload.pet
  if (payload.data && typeof payload.data === 'object') return payload.data

  return payload
}

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
export const apiCreatePet = async (petData) => {
  const payload = {
    name: petData.name?.trim(),
    species: petData.species?.trim(),
    breed: petData.breed?.trim(),
    age: Number(petData.age),
    gender: petData.gender?.trim(),
    status: petData.status?.trim() || 'Disponible',
    location: petData.location?.trim(),
    description: petData.description?.trim()
  }

  return apiClient.post('/api/mascotas', payload)
}

export const apiGetPets = async () => {
  try {
    const response = await apiClient.get('/api/mascotas')

    return {
      source: 'api',
      data: normalizePetsPayload(response.data)
    }
  } catch (error) {
    const isOffline = typeof navigator !== 'undefined' && !navigator.onLine
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

export const apiGetPetById = async (petId) => {
  try {
    const response = await apiClient.get(`/api/mascotas/${petId}`)
    const pet = normalizePetPayload(response.data)

    return {
      source: 'api',
      data: pet,
      notFound: !pet
    }
  } catch (error) {
    const isOffline = typeof navigator !== 'undefined' && !navigator.onLine
    const isNetworkFailure =
      error?.code === 'ERR_NETWORK' ||
      error?.message?.includes('Network') ||
      isOffline

    if (isNetworkFailure) {
      const pet = demoPets.find((item) => String(item.id) === String(petId))

      return {
        source: 'demo',
        data: pet || null,
        notFound: !pet
      }
    }

    if (error?.response?.status === 404) {
      return {
        source: 'api',
        data: null,
        notFound: true
      }
    }

    throw error
  }
}

export const apiUpdatePetById = async (petId, petData) => {
  const payload = {
    name: petData.name?.trim(),
    species: petData.species?.trim(),
    breed: petData.breed?.trim(),
    age: Number(petData.age),
    gender: petData.gender?.trim(),
    status: petData.status?.trim() || 'Disponible',
    location: petData.location?.trim(),
    description: petData.description?.trim()
  }

  try {
    const response = await apiClient.put(`/api/mascotas/${petId}`, payload)
    return {
      source: 'api',
      data: normalizePetPayload(response.data)
    }
  } catch (error) {
    const isOffline = typeof navigator !== 'undefined' && !navigator.onLine
    const isNetworkFailure =
      error?.code === 'ERR_NETWORK' ||
      error?.message?.includes('Network') ||
      isOffline

    if (isNetworkFailure) {
      const petIndex = demoPets.findIndex((item) => String(item.id) === String(petId))

      if (petIndex === -1) {
        throw new Error('La mascota no existe para actualizarla.')
      }

      const updatedPet = {
        ...demoPets[petIndex],
        ...payload,
        id: Number(petId)
      }

      demoPets[petIndex] = updatedPet

      return {
        source: 'demo',
        data: updatedPet
      }
    }

    if (error?.response?.status === 404) {
      throw new Error('La mascota no existe.')
    }

    throw error
  }
}

export default apiClient
