import { useState, useEffect } from 'react'
import { getProducts, getProduct, getSpecies, getSpeciesDetail } from '../api/products'

export function useProducts(categorySlug, filters = {}) {
  const [products, setProducts] = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    getProducts(categorySlug, filters).then(res => {
      if (cancelled) return
      if (res.success) setProducts(res.data)
      else setError(res.error)
      setLoading(false)
    })
    return () => { cancelled = true }
  }, [categorySlug, JSON.stringify(filters)])

  return { products, loading, error }
}

export function useProduct(slug) {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    getProduct(slug).then(res => {
      if (res.success) setProduct(res.data)
      else setError(res.error)
      setLoading(false)
    })
  }, [slug])

  return { product, loading, error }
}

export function useSpeciesList() {
  const [species, setSpecies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    getSpecies().then(res => {
      if (res.success) setSpecies(res.data)
      else setError(res.error)
      setLoading(false)
    })
  }, [])

  return { species, loading, error }
}

export function useSpeciesDetail(slug) {
  const [species, setSpecies] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    getSpeciesDetail(slug).then(res => {
      if (res.success) setSpecies(res.data)
      else setError(res.error)
      setLoading(false)
    })
  }, [slug])

  return { species, loading, error }
}
