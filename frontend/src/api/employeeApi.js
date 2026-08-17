import api from './axios'

export const employeeApi = {

  getAll: (page = 0, size = 100) =>
    api.get('/admin/employees', {
      params: {
        page,
        size,
      },
    }),

  create: (data) =>
    api.post('/admin/employees', data),

  update: (id, data) =>
    api.put(`/admin/employees/${id}`, data),

  updateStatus: (id, status) =>
    api.patch(
      `/admin/employees/${id}/status`,
      null,
      {
        params: {
          status,
        },
      }
    ),

  delete: (id) =>
    api.delete(`/admin/employees/${id}`),
}

export default employeeApi