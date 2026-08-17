import axios from 'axios'

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    'http://localhost:8086/api',
})

api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem('ss_token') ||
      localStorage.getItem('token')

    if (token) {
      config.headers = config.headers || {}
      config.headers.Authorization = `Bearer ${token}`
    }

    console.log(
      'API REQUEST:',
      config.method?.toUpperCase(),
      config.baseURL + config.url
    )

    console.log(
      'JWT EXISTS:',
      !!token
    )

    console.log(
      'CONTENT TYPE:',
      config.headers?.['Content-Type'] ||
        config.headers?.['content-type'] ||
        'automatic'
    )

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default api