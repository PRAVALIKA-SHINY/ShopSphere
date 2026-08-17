import api from './axios'

const dashboardApi = {
  // =========================================================
  // ADMIN DASHBOARD
  // =========================================================
  admin: () => {
    return api.get('/dashboard/admin')
  },

  // =========================================================
  // EMPLOYEE DASHBOARD
  // =========================================================
  
  employee: () => {
    return api.get('/dashboard/employee')
  },

  // =========================================================
  // CUSTOMER DASHBOARD
  // =========================================================
 
  customer: (customerId) => {
    if (!customerId) {
      return Promise.reject(
        new Error('Customer ID is required')
      )
    }

    return api.get(`/dashboard/customer/${customerId}`)
  },
}

export default dashboardApi

export { dashboardApi }