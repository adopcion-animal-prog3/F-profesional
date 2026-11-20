export const pickArray = (payload, keys = ['data']) => {
  if (Array.isArray(payload)) return payload

  const key = keys.find((name) => Array.isArray(payload?.[name]))
  return key ? payload[key] : []
}

export const normalizePetPayload = (payload) => {
  if (!payload || typeof payload !== 'object') return null
  if (payload.mascota) return payload.mascota
  if (payload.pet) return payload.pet
  if (payload.data && typeof payload.data === 'object') return payload.data
  return payload
}

const NETWORK_CODES = ['ERR_NETWORK', 'ECONNABORTED', 'ETIMEDOUT']

const STATUS_KINDS = [
  [(status) => status === 400 || status === 422, 'validation'],
  [(status) => status === 401, 'unauthorized'],
  [(status) => status === 403, 'forbidden'],
  [(status) => status === 404, 'notFound'],
  [(status) => status === 409, 'conflict'],
  [(status) => status === 429, 'tooMany'],
  [(status) => status >= 500, 'server']
]

export const getErrorKind = (error) => {
  const status = error?.response?.status
  const match = STATUS_KINDS.find(([matches]) => matches(status))
  if (match) return match[1]

  const isNetwork = !error?.response || NETWORK_CODES.includes(error?.code)
  return isNetwork ? 'network' : 'unexpected'
}

const isBrowserOffline = () => typeof navigator !== 'undefined' && navigator.onLine === false

export const isNetworkFailure = (error) =>
  error?.kind === 'network' ||
  error?.code === 'ERR_NETWORK' ||
  Boolean(error?.message?.includes('Network')) ||
  isBrowserOffline()

export const apiResult = (data, source = 'api') => ({ source, data })
