import api from './axios'

export const authApi = {
  login: (email, password) =>
    api.post('/auth/login', {
      email,
      password,
    }),

  register: (data) =>
    api.post('/auth/register', data),

  forgotPassword: (email) =>
    api.post('/auth/forgot-password', {
      email,
    }),

  resetPassword: (token, password) =>
    api.post('/auth/reset-password', {
      token,
      password,
    }),

  me: () =>
    api.get('/auth/me'),
}