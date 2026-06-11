import axios from 'axios'

const base = import.meta.env.VITE_API_URL || ''

async function safe(fn) {
  try {
    return await fn()
  } catch (err) {
    const message = err.response?.data?.message || err.message || 'Request failed'
    return { success: false, error: message }
  }
}

export const loginUser = (email, password) =>
  safe(async () => {
    const { data } = await axios.post(`${base}/auth/login`, { email, password })
    return { success: true, data }
  })

export const registerUser = (userData) =>
  safe(async () => {
    const { data } = await axios.post(`${base}/auth/register`, userData)
    return { success: true, data }
  })

export const forgotPassword = (email) =>
  safe(async () => {
    const { data } = await axios.post(`${base}/auth/forgot-password`, { email })
    return { success: true, data }
  })

export const getProfile = (token) =>
  safe(async () => {
    const { data } = await axios.get(`${base}/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return { success: true, data }
  })

export const updateProfile = (token, userData) =>
  safe(async () => {
    const { data } = await axios.put(`${base}/auth/profile`, userData, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return { success: true, data }
  })
