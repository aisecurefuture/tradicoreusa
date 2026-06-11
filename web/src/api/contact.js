// Stubs — replace with real axios calls when backend is ready

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export const submitContactForm = async (data) => {
  try {
    await delay(600)
    console.log('[submitContactForm]', data)
    return { success: true, data: { message: 'Your message has been received.' } }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

export const submitQuoteRequest = async (data) => {
  try {
    await delay(600)
    console.log('[submitQuoteRequest]', data)
    return { success: true, data: { message: 'Quote request received. We will contact you within 1 business day.' } }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

export const submitNotifyRequest = async (email) => {
  try {
    await delay(400)
    console.log('[submitNotifyRequest]', email)
    return { success: true, data: { message: 'You\'re on the list!' } }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

export const submitTradeInquiry = async (data) => {
  try {
    await delay(600)
    console.log('[submitTradeInquiry]', data)
    return { success: true, data: { message: 'Trade account application received.' } }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

export const submitDistributorInquiry = async (data) => {
  try {
    await delay(600)
    console.log('[submitDistributorInquiry]', data)
    return { success: true, data: { message: 'Distributor inquiry received.' } }
  } catch (err) {
    return { success: false, error: err.message }
  }
}
