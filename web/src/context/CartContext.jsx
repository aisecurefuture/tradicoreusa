import { createContext, useContext, useReducer, useEffect } from 'react'
import { storage } from '../utils/storage'

const CartContext = createContext(null)

const STORAGE_KEY = 'tc_cart'

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const existing = state.find(item => item.id === action.product.id)
      if (existing) {
        return state.map(item =>
          item.id === action.product.id
            ? { ...item, qty: item.qty + action.qty }
            : item
        )
      }
      return [...state, { ...action.product, qty: action.qty }]
    }
    case 'REMOVE':
      return state.filter(item => item.id !== action.id)
    case 'UPDATE_QTY':
      return state.map(item =>
        item.id === action.id ? { ...item, qty: Math.max(1, action.qty) } : item
      )
    case 'CLEAR':
      return []
    case 'LOAD':
      return action.items
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [cartItems, dispatch] = useReducer(cartReducer, [], () => {
    return storage.get(STORAGE_KEY, [])
  })

  useEffect(() => {
    storage.set(STORAGE_KEY, cartItems)
  }, [cartItems])

  const addToCart = (product, qty = 1) => {
    dispatch({ type: 'ADD', product, qty })
  }

  const removeFromCart = (id) => {
    dispatch({ type: 'REMOVE', id })
  }

  const updateQuantity = (id, qty) => {
    dispatch({ type: 'UPDATE_QTY', id, qty })
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR' })
  }

  const cartTotal = cartItems.reduce((sum, item) => sum + (item.price || 0) * item.qty, 0)
  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0)

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
