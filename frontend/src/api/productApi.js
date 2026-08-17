import api from './axios'

export const productApi = {

  // Get customer products

  getAll: (page = 0, size = 100, sort = '') => {

    const params = new URLSearchParams({
      page: String(page),
      size: String(size)
    })

    if (sort) {
      params.append('sort', sort)
    }

    return api.get(`/products?${params.toString()}`)
  },


  // Get employee/admin manageable products

  getManageable: (page = 0, size = 100, sort = '') => {

    const params = new URLSearchParams({
      page: String(page),
      size: String(size)
    })

    if (sort) {
      params.append('sort', sort)
    }

    return api.get(`/products/manage?${params.toString()}`)
  },


  // Get single product

  getById: (id) => {
    return api.get(`/products/${id}`)
  },


  // Get product by code

  getByCode: (code) => {
    return api.get(
      `/products/code/${encodeURIComponent(code)}`
    )
  },


  // Create product

  create: (data) => {
    return api.post('/products', data)
  },


  // Update complete product

  update: (id, data) => {
    return api.put(`/products/${id}`, data)
  },


  // Update stock

  updateStock: (id, stock) => {

    return api.patch(
      `/products/${id}/stock`,
      {
        stock: Number(stock)
      }
    )
  },


  // Update discount

  updateDiscount: (id, discount) => {

    return api.patch(
      `/products/${id}/discount`,
      {
        discount: Number(discount)
      }
    )
  },


  // Activate product

  activate: (id) => {
    return api.patch(`/products/${id}/activate`)
  },


  // Deactivate product

  deactivate: (id) => {
    return api.patch(`/products/${id}/deactivate`)
  },


  // Delete product
  // Backend currently performs a soft delete

  delete: (id) => {
    return api.delete(`/products/${id}`)
  },


  // Get products by category

  getByCategory: (
    categoryId,
    page = 0,
    size = 100,
    sort = ''
  ) => {

    const params = new URLSearchParams({
      page: String(page),
      size: String(size)
    })

    if (sort) {
      params.append('sort', sort)
    }

    return api.get(
      `/products/category/${categoryId}?${params.toString()}`
    )
  },


  // Get products by brand

  getByBrand: (
    brandId,
    page = 0,
    size = 100,
    sort = ''
  ) => {

    const params = new URLSearchParams({
      page: String(page),
      size: String(size)
    })

    if (sort) {
      params.append('sort', sort)
    }

    return api.get(
      `/products/brand/${brandId}?${params.toString()}`
    )
  },


  // Search products

  search: (
    keyword,
    page = 0,
    size = 100,
    sort = ''
  ) => {

    const params = new URLSearchParams({
      keyword,
      page: String(page),
      size: String(size)
    })

    if (sort) {
      params.append('sort', sort)
    }

    return api.get(
      `/products/search?${params.toString()}`
    )
  },


  // Filter products

  filter: ({
    categoryId = null,
    brandId = null,
    minPrice = null,
    maxPrice = null,
    page = 0,
    size = 100,
    sort = ''
  } = {}) => {

    const params = new URLSearchParams({
      page: String(page),
      size: String(size)
    })

    if (categoryId != null) {
      params.append('categoryId', String(categoryId))
    }

    if (brandId != null) {
      params.append('brandId', String(brandId))
    }

    if (minPrice != null) {
      params.append('minPrice', String(minPrice))
    }

    if (maxPrice != null) {
      params.append('maxPrice', String(maxPrice))
    }

    if (sort) {
      params.append('sort', sort)
    }

    return api.get(
      `/products/filter?${params.toString()}`
    )
  },


  // Get products created by employee

  getByEmployee: (
    employeeId,
    page = 0,
    size = 100
  ) => {

    const params = new URLSearchParams({
      page: String(page),
      size: String(size)
    })

    return api.get(
      `/products/employee/${employeeId}?${params.toString()}`
    )
  },


 uploadImages: async (files) => {
  const formData = new FormData()

  files.forEach((file) => {
    formData.append('files', file)
  })

  return api.post(
    '/products/upload-images',
    formData
  )
},

    
   
}