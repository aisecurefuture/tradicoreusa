import { mouldingProducts, getProductsByCategory, getProductBySlug } from '../data/mockData'
import { speciesList, getSpeciesBySlug } from '../data/speciesData'

// When backend is ready, swap these mock implementations for real axios calls.
// All return { success: true, data } or { success: false, error }.

export const getProducts = async (categorySlug, filters = {}) => {
  try {
    await delay(200)
    let products = categorySlug
      ? getProductsByCategory(categorySlug)
      : mouldingProducts

    if (filters.material) {
      products = products.filter(p => p.material === filters.material)
    }
    if (filters.finish) {
      products = products.filter(p => p.finish === filters.finish)
    }
    if (filters.sort === 'price_asc') {
      products = [...products].sort((a, b) => a.price - b.price)
    } else if (filters.sort === 'price_desc') {
      products = [...products].sort((a, b) => b.price - a.price)
    } else if (filters.sort === 'name_asc') {
      products = [...products].sort((a, b) => a.name.localeCompare(b.name))
    }
    return { success: true, data: products }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

export const getProduct = async (slug) => {
  try {
    await delay(150)
    const product = getProductBySlug(slug)
    if (!product) return { success: false, error: 'Product not found' }
    return { success: true, data: product }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

export const getSpecies = async () => {
  try {
    await delay(150)
    return { success: true, data: speciesList }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

export const getSpeciesDetail = async (slug) => {
  try {
    await delay(150)
    const species = getSpeciesBySlug(slug)
    if (!species) return { success: false, error: 'Species not found' }
    return { success: true, data: species }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

export const searchProducts = async (query) => {
  try {
    await delay(200)
    const q = query.toLowerCase()
    const results = [
      ...mouldingProducts.filter(p =>
        p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)
      ),
      ...speciesList.filter(s =>
        s.name.toLowerCase().includes(q) || s.tradeName.toLowerCase().includes(q)
      ),
    ]
    return { success: true, data: results }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
