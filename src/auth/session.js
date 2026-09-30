const TOKEN_KEY = 'auth_token'
const USER_KEY = 'auth_user'

const getStorage = () => {
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage
  }

  if (typeof localStorage !== 'undefined') {
    return localStorage
  }

  return null
}

const safeParse = (value) => {
  if (!value) return null

  try {
    return JSON.parse(value)
  } catch (error) {
    return null
  }
}

export const getStoredToken = () => {
  const storage = getStorage()
  return storage ? storage.getItem(TOKEN_KEY) : null
}

export const getStoredUser = () => {
  const storage = getStorage()
  return storage ? safeParse(storage.getItem(USER_KEY)) : null
}

export const isAuthenticated = () => Boolean(getStoredToken())

export const saveSession = (token, user) => {
  const storage = getStorage()

  if (!storage) return

  if (!token) {
    clearSession()
    return
  }

  storage.setItem(TOKEN_KEY, token)

  if (user && typeof user === 'object') {
    const publicUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role || null
    }

    storage.setItem(USER_KEY, JSON.stringify(publicUser))
  } else {
    storage.removeItem(USER_KEY)
  }
}

export const clearSession = () => {
  const storage = getStorage()

  if (!storage) return

  storage.removeItem(TOKEN_KEY)
  storage.removeItem(USER_KEY)
}

export const getSession = () => ({
  token: getStoredToken(),
  user: getStoredUser()
})

export const getAuthorizationHeader = () => {
  const token = getStoredToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}
