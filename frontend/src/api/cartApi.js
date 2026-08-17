import api from './axios'

export const cartApi = {

  // Get the customer's current cart.
  get: () =>
    api.get('/cart'),

  // Add a product.
  add: (
    productId,
    quantity = 1
  ) =>
    api.post(
      '/cart',
      {
        productId,
        quantity,
      }
    ),

  // Update using the CART ITEM ID.
  update: (
    itemId,
    quantity
  ) =>
    api.patch(
      `/cart/${itemId}`,
      {
        quantity,
      }
    ),

  // Remove using the CART ITEM ID.
  remove: (
    itemId
  ) =>
    api.delete(
      `/cart/${itemId}`
    ),

  // Clear the complete cart.
  clear: () =>
    api.delete('/cart'),
}