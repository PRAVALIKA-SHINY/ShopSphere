import api from './axios'

export const wishlistApi = {

  // Get customer's wishlist
  get: () =>
    api.get('/wishlist'),

  // Add product to wishlist
  add: (productId) =>
    api.post(`/wishlist/${productId}`),

  // Remove product from wishlist
  remove: (productId) =>
    api.delete(`/wishlist/${productId}`),

  // Toggle product in wishlist
  toggle: (productId) =>
    api.post(`/wishlist/${productId}/toggle`),
}