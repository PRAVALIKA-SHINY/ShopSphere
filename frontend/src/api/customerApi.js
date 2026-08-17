import api from './axios'

export const customerApi = {

  // Customer profile.
  getProfile: () =>
    api.get('/customers/profile'),

  updateProfile: (
    data
  ) =>
    api.put(
      '/customers/profile',
      data
    ),

  changePassword: (
    oldPassword,
    newPassword
  ) =>
    api.patch(
      '/customers/change-password',
      {
        oldPassword,
        newPassword,
      }
    ),

  deleteProfile: () =>
    api.delete(
      '/customers/profile'
    ),

  // Admin customer endpoints.
  getAll: () =>
    api.get('/admin/customers'),

  getById: (
    id
  ) =>
    api.get(
      `/admin/customers/${id}`
    ),

  updateStatus: (
    id,
    status
  ) =>
    api.patch(
      `/admin/customers/${id}/status`,
      {
        status,
      }
    ),

  delete: (
    id
  ) =>
    api.delete(
      `/admin/customers/${id}`
    ),
}