
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'

import { cartApi } from '../api/cartApi'
import { wishlistApi } from '../api/wishlistApi'
import { useAuth } from './AuthContext'

const emptyCart = {
  items: [],
}

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const { user } = useAuth()

  const [cart, setCart] = useState(emptyCart)
  const [wishlistItems, setWishlistItems] = useState([])

  const loadCart = async () => {
    if (!user || user.role !== 'CUSTOMER') {
      setCart(emptyCart)
      return emptyCart
    }

    try {
      const response = await cartApi.get()

      const nextCart =
        response?.data?.data || emptyCart

      const normalizedCart = {
        items: Array.isArray(nextCart.items)
          ? nextCart.items
          : [],
      }

      setCart(normalizedCart)

      return normalizedCart
    } catch (error) {
      console.error('LOAD CART ERROR:', error)

      setCart(emptyCart)

      return emptyCart
    }
  }

  const loadWishlist = async () => {
    if (!user || user.role !== 'CUSTOMER') {
      setWishlistItems([])
      return []
    }

    try {
      const response = await wishlistApi.get()

      const items =
        response?.data?.data || []

      const nextItems =
        Array.isArray(items)
          ? items
          : []

      setWishlistItems(nextItems)

      return nextItems
    } catch (error) {
      console.error(
        'LOAD WISHLIST ERROR:',
        error
      )

      setWishlistItems([])

      return []
    }
  }

  useEffect(() => {
    if (user?.role === 'CUSTOMER') {
      loadCart()
      loadWishlist()
    } else {
      setCart(emptyCart)
      setWishlistItems([])
    }
  }, [user])

  const addToCart = async (
    productId,
    quantity = 1
  ) => {
    const response =
      await cartApi.add(
        productId,
        quantity
      )

    const nextCart =
      response?.data?.data ||
      emptyCart

    setCart({
      items: Array.isArray(
        nextCart.items
      )
        ? nextCart.items
        : [],
    })

    return response
  }

  const updateCartItem = async (
    itemId,
    quantity
  ) => {
    const response =
      await cartApi.update(
        itemId,
        quantity
      )

    const nextCart =
      response?.data?.data ||
      emptyCart

    setCart({
      items: Array.isArray(
        nextCart.items
      )
        ? nextCart.items
        : [],
    })

    return response
  }

  const removeFromCart = async (
    itemId
  ) => {
    const response =
      await cartApi.remove(
        itemId
      )

    const nextCart =
      response?.data?.data ||
      emptyCart

    setCart({
      items: Array.isArray(
        nextCart.items
      )
        ? nextCart.items
        : [],
    })

    return response
  }

  const clearCart = async () => {
    const response =
      await cartApi.clear()

    setCart(emptyCart)

    return response
  }

  const toggleWishlist = async (
    productId
  ) => {
    try {
      const response =
        await wishlistApi.toggle(
          productId
        )

      const nextItems =
        response?.data?.data

      if (Array.isArray(nextItems)) {
        setWishlistItems(nextItems)
      } else {
        await loadWishlist()
      }

      return response
    } catch (error) {
      console.error(
        'TOGGLE WISHLIST ERROR:',
        error
      )

      await loadWishlist()

      throw error
    }
  }

  const cartItems =
    Array.isArray(cart.items)
      ? cart.items
      : []

  const cartItemCount =
    cartItems.reduce(
      (total, item) =>
        total +
        Number(item?.quantity || 0),
      0
    )

  return (
    <CartContext.Provider
      value={{
        cart,
        cartItems,
        cartItemCount,

        wishlistItems,

        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,

        toggleWishlist,

        reloadCart: loadCart,
        refreshCart: loadCart,

        reloadWishlist: loadWishlist,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}

