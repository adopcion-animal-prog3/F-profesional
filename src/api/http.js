import axios from 'axios'
import { getAuthorizationHeader } from '../auth/session'
import { buildPetPayload } from '../utils/petForm'
import { apiResult, getErrorKind, normalizePetPayload, pickArray } from './normalizers'

const apiErrorMessages = {
  validation: 'Revisá los datos ingresados e intentá nuevamente.',
  unauthorized: 'Tu sesión venció o no es válida. Iniciá sesión nuevamente.',
  forbidden: 'No tenés permisos para realizar esta acción.',
  notFound: 'No encontramos el recurso solicitado. Puede haber sido eliminado.',
  conflict: 'Ya existe una cuenta registrada con ese correo.',
  tooMany: 'Hiciste muchos intentos. Esperá un minuto y pedí un código nuevo.',
  network: 'No se pudo conectar con el servidor. Revisá tu conexión e intentá nuevamente.',
  server: 'El servidor tuvo un problema. Intentá nuevamente más tarde.',
  unexpected: 'Ocurrió un error inesperado. Intentá nuevamente.'
}

const normalizeApiError = (error) => {
  const kind = getErrorKind(error)
  const normalizedError = new Error(apiErrorMessages[kind])
  normalizedError.name = 'ApiError'
  normalizedError.status = error?.response?.status
  normalizedError.kind = kind
  normalizedError.code = error?.code
  return normalizedError
}

export const getApiErrorMessage = (error, context = 'general') => {
  if (context === 'login' && error?.kind === 'unauthorized') {
    return 'El correo o la contraseña no son correctos.'
  }

  if (context === 'verify' && error?.kind === 'validation') {
    return 'El código no es correcto o ya venció. Revisalo o pedí uno nuevo.'
  }

  if (context === 'login' && error?.kind === 'forbidden') {
    return 'Esta es una cuenta de adoptante. Ingresá desde el portal de adopción.'
  }

  if (error?.kind && apiErrorMessages[error.kind]) return apiErrorMessages[error.kind]
  if (error?.isAxiosError) return apiErrorMessages[getErrorKind(error)]
  if (error?.message && !/network error|timeout|failed to fetch/i.test(error.message)) {
    return error.message
  }

  return apiErrorMessages.unexpected
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
  (error) => Promise.reject(normalizeApiError(error))
)

const rethrowNotFound = (message) => (error) => {
  if (error?.status === 404) throw new Error(message)
  throw error
}

const petPath = (petId) => `/api/mascotas/${petId}`
const historyPath = (petId) => `/api/mascotas/${encodeURIComponent(petId)}/historial`
const clinicalRecordPath = (recordId) => `/api/historial/${encodeURIComponent(recordId)}`

const buildClinicalPayload = (recordData) => ({
  descripcion: recordData.descripcion.trim(),
  veterinario: recordData.veterinario?.trim() || null
})

export const apiHealthCheck = () => apiClient.get('/health')
export const apiLogin = (credentials) => apiClient.post('/api/auth/login', credentials)
export const apiRegister = (userData) => apiClient.post('/api/auth/register', userData)
export const apiVerifyCode = (payload) => apiClient.post('/api/auth/verify', payload)
export const apiResendCode = (email) => apiClient.post('/api/auth/resend-code', { email })
export const apiCreatePet = async (petData) => apiClient.post('/api/mascotas', buildPetPayload(petData))

export const apiGetPets = async () =>
  apiResult(pickArray((await apiClient.get('/api/mascotas')).data, ['mascotas', 'data']))

export const apiGetSolicitudes = async () => {
  const response = await apiClient.get('/api/solicitudes')
  return apiResult(pickArray(response.data, ['solicitudes', 'data']))
}

export const apiUpdateSolicitudStatus = (solicitudId, estado) =>
  apiClient.put(`/api/solicitudes/${solicitudId}`, { estado })

const petLookupResult = (pet, source = 'api') => ({ source, data: pet || null, notFound: !pet })

export const apiGetPetById = async (petId) => {
  try {
    return petLookupResult(normalizePetPayload((await apiClient.get(petPath(petId))).data))
  } catch (error) {
    if (error?.status === 404) return petLookupResult(null)
    throw error
  }
}

export const apiGetPetHistory = async (petId) => {
  const response = await apiClient.get(historyPath(petId))
  return pickArray(response.data, ['historial', 'history', 'data'])
}

export const apiCreatePetHistory = async (petId, recordData) => {
  const response = await apiClient.post(historyPath(petId), buildClinicalPayload(recordData))
  return response.data
}

export const apiUpdateClinicalHistory = async (recordId, recordData) => {
  const response = await apiClient.put(clinicalRecordPath(recordId), {
    fecha_registro: recordData.fecha_registro,
    ...buildClinicalPayload(recordData)
  })
  return response.data
}

export const apiDeleteClinicalHistory = async (recordId) => {
  const response = await apiClient.delete(clinicalRecordPath(recordId))
  return response.data
}

export const apiUpdatePetById = (petId, petData) =>
  apiClient.put(petPath(petId), buildPetPayload(petData))
    .then((response) => apiResult(normalizePetPayload(response.data)))
    .catch(rethrowNotFound('La mascota no existe.'))

export const apiDeletePetById = (petId) =>
  apiClient.delete(petPath(petId))
    .then((response) => apiResult(response.data ?? { deleted: true }))
    .catch(rethrowNotFound('La mascota no existe.'))

export default apiClient
