import api from './axios'

export const orderApi = {

  // Customer checkout.
  create: (
    data
  ) =>
    api.post(
      '/orders',
      data
    ),

  // Customer orders.
  getMyOrders: (
    page = 0,
    size = 20
  ) =>
    api.get(
      `/orders/my-orders?page=${page}&size=${size}`
    ),

  // Alias used by CustomerDashboard.
  myOrders: (
    page = 0,
    size = 20
  ) =>
    api.get(
      `/orders/my-orders?page=${page}&size=${size}`
    ),

  // Get one customer order.
  getById: (
    id
  ) =>
    api.get(
      `/orders/${id}`
    ),

  // Customer cancellation.
  cancel: (
    id
  ) =>
    api.patch(
      `/orders/${id}/cancel`
    ),

  // Admin / employee orders.
  getAllAdmin: (
    page = 0,
    size = 10
  ) =>
    api.get(
      `/orders/admin/all?page=${page}&size=${size}`
    ),

  // Admin / employee orders by status.
  getByStatus: (
    status,
    page = 0,
    size = 10
  ) =>
    api.get(
      `/orders/admin/status/${status}?page=${page}&size=${size}`
    ),

  // Admin / employee status update.
  updateStatus: (
    id,
    status
  ) =>
    api.patch(
      `/orders/admin/${id}/status`,
      {
        status,
      }
    ),
}
