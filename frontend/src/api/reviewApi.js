import api from './axios'

export const reviewApi = {
  getByProduct: (
    productId,
    page = 0,
    size = 20
  ) =>
    api.get(
      `/reviews/product/${productId}?page=${page}&size=${size}`
    ),

  add: (
    productId,
    rating,
    comment
  ) =>
    api.post('/reviews', {
      productId,
      rating,
      comment,
    }),

  delete: (id) =>
    api.delete(`/reviews/${id}`),
}