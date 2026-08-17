import api from './axios'

export const adminApi = {

  // ==============================
  // ADMIN OVERVIEW
  // ==============================
  getOverview: () => {
    return api.get('/admin/overview')
  },

  // ==============================
  // CUSTOMERS
  // ==============================
  customers: () => {
    return api.get('/admin/customers')
  },

  // ==============================
  // UPDATE CUSTOMER STATUS
  // ==============================
  updateCustomerStatus: (id, status) => {
    return api.patch(
      `/admin/customers/${id}/status`,
      null,
      {
        params: {
          status,
        },
      }
    )
  },

}

export default adminApi