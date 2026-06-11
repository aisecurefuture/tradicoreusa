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

export const createOrder = (orderData, token) =>
  safe(async () => {
    const { data } = await axios.post(`${base}/orders`, orderData, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return { success: true, data }
  })

export const getOrders = (token) =>
  safe(async () => {
    const { data } = await axios.get(`${base}/orders`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return { success: true, data }
  })

export const getOrder = (id, token) =>
  safe(async () => {
    const { data } = await axios.get(`${base}/orders/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return { success: true, data }
  })

// Stub: process payment through selected gateway
export const processPayment = async (gateway, orderData) => {
  // TODO: integrate Stripe SDK (ACH + card) and PayPal SDK
  console.log('[processPayment] gateway:', gateway, 'payload:', orderData)
  await new Promise(resolve => setTimeout(resolve, 800))
  return { success: true, data: { orderId: `TC-${Date.now()}`, gateway, status: 'pending' } }
}
