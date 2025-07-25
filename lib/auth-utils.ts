/**
 * Utility functions for handling authentication and API requests
 */

/**
 * Get the stored authentication token
 */
export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('authToken')
}

/**
 * Get the stored user data
 */
export const getStoredUser = () => {
  if (typeof window === 'undefined') return null
  try {
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  } catch (error) {
    console.error('Error parsing stored user data:', error)
    return null
  }
}

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false
  return localStorage.getItem('isAuthenticated') === 'true'
}

/**
 * Get headers for authenticated API requests
 */
export const getAuthHeaders = () => {
  const token = getAuthToken()
  console.log('Getting auth headers, token:', token ? 'present' : 'missing')
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  }
}

/**
 * Clear all authentication data
 */
export const clearAuthData = () => {
  if (typeof window === 'undefined') return
  localStorage.removeItem('user')
  localStorage.removeItem('isAuthenticated')
  localStorage.removeItem('authToken')
}