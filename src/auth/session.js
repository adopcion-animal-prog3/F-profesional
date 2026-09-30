const TOKEN_KEY = 'auth_token'
const USER_KEY = 'auth_user'

const safeParse = (value) => {
  if (!value) return null

  try {
    return JSON.parse(value)
  } catch (error) {
    return null
  }
}

export const getStoredToken = () => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(TOKEN_KEY)
}

export const getStoredUser = () => {
  if (typeof window === 'undefined') return null
  return safeParse(localStorage.getItem(USER_KEY))
}

export const isAuthenticated = () => Boolean(getStoredToken())

export const saveSession = (token, user) => {
  if (typeof window === 'undefined') return

  if (!token) {
    clearSession()
    return
  }

  localStorage.setItem(TOKEN_KEY, token)

  if (user && typeof user === 'object') {
    const publicUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role || null
    }

    localStorage.setItem(USER_KEY, JSON.stringify(publicUser))
  } else {
    localStorage.removeItem(USER_KEY)
  }
}

export const clearSession = () => {
  if (typeof window === 'undefined') return

  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export const getSession = () => ({
  token: getStoredToken(),
  user: getStoredUser()
})

export const getAuthorizationHeader = () => {
  const token = getStoredToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}
