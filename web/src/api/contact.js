import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

async function safe(fn) {
  try {
    const { data } = await fn()
    return { success: true, data }
  } catch (err) {
    const message = err.response?.data?.error || err.message || 'Request failed'
    return { success: false, error: message }
  }
}

export const submitContactForm   = (data) => safe(() => api.post('/contact', data))
export const submitQuoteRequest  = (data) => safe(() => api.post('/quote', data))
export const submitNotifyRequest = (email) => safe(() => api.post('/notify', { email }))
export const submitTradeInquiry  = (data) => safe(() => api.post('/trade', data))
export const submitDistributorInquiry = (data) => safe(() => api.post('/trade', data))
