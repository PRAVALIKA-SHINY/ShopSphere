import React, {
  useEffect,
  useState,
} from 'react'

import { useNavigate } from 'react-router-dom'

import {
  Eye,
  Pencil,
  Package,
  Power,
  RefreshCw,
  X,
} from 'lucide-react'

import Price from '../../components/Price'
import Loader from '../../components/Loader'

import { productApi } from '../../api/productApi'
import { categoryApi } from '../../api/categoryApi'
import { brandApi } from '../../api/brandApi'


export default function EmployeeProducts() {
  const navigate = useNavigate()

  // =========================================================
  // PRODUCTS
  // =========================================================

  const [products, setProducts] = useState([])

  const [loading, setLoading] = useState(true)

  const [refreshing, setRefreshing] =
    useState(false)

  // =========================================================
  // CATEGORY + BRAND LOOKUPS
  // =========================================================

  const [categories, setCategories] =
    useState([])

  const [brands, setBrands] =
    useState([])

  // =========================================================
  // MESSAGES
  // =========================================================

  const [error, setError] = useState('')

  const [success, setSuccess] =
    useState('')

  // =========================================================
  // FILTER
  // =========================================================

  const [statusFilter, setStatusFilter] =
    useState('ALL')

  // =========================================================
  // STOCK MODAL
  // =========================================================

  const [stockModal, setStockModal] =
    useState(null)

  const [stockValue, setStockValue] =
    useState('')

  const [stockSaving, setStockSaving] =
    useState(false)

  // =========================================================
  // STATUS CHANGE
  // =========================================================

  const [statusChangingId, setStatusChangingId] =
    useState(null)


  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    loadProducts()
    loadReferenceData()
  }, [])


  // =========================================================
  // EXTRACT PRODUCT LIST
  // =========================================================

  const extractProducts = (response) => {
    const data =
      response?.data?.data

    if (Array.isArray(data)) {
      return data
    }

    if (Array.isArray(data?.content)) {
      return data.content
    }

    if (
      Array.isArray(
        response?.data?.content
      )
    ) {
      return response.data.content
    }

    if (Array.isArray(response?.data)) {
      return response.data
    }

    return []
  }


  // =========================================================
  // EXTRACT NORMAL LIST
  // =========================================================

  const extractList = (response) => {
    const data =
      response?.data?.data ??
      response?.data

    if (Array.isArray(data)) {
      return data
    }

    if (Array.isArray(data?.content)) {
      return data.content
    }

    if (Array.isArray(data?.items)) {
      return data.items
    }

    return []
  }


  // =========================================================
  // LOAD CATEGORIES + BRANDS
  // =========================================================
  //
  // ProductResponse contains:
  //
  // categoryId
  // brandId
  //
  // So we load the actual category and brand lists
  // and match those IDs to their names.
  //
  // =========================================================

  const loadReferenceData = async () => {
    try {
      const [
        categoryResponse,
        brandResponse,
      ] = await Promise.all([
        categoryApi.getAll(),
        brandApi.getAll(),
      ])

      const categoryList =
        extractList(categoryResponse)

      const brandList =
        extractList(brandResponse)

      setCategories(categoryList)

      setBrands(brandList)

    } catch (err) {
      console.error(
        'Could not load categories and brands:',
        err
      )

      // Do not stop the product page if
      // lookup data fails.
    }
  }


  // =========================================================
  // LOAD PRODUCTS
  // =========================================================

  const loadProducts = async () => {
    try {
      setLoading(true)
      setError('')

      const response =
        await productApi.getManageable(
          0,
          100
        )

      const productList =
        extractProducts(response)

      setProducts(productList)

    } catch (err) {
      console.error(
        'Could not load products:',
        err
      )

      setError(
        err?.response?.data?.message ||
        'Could not load products.'
      )

    } finally {
      setLoading(false)
    }
  }


  // =========================================================
  // REFRESH
  // =========================================================

  const handleRefresh = async () => {
    try {
      setRefreshing(true)

      setError('')
      setSuccess('')

      await Promise.all([
        loadProducts(),
        loadReferenceData(),
      ])

    } catch (err) {
      console.error(
        'Could not refresh products:',
        err
      )

      setError(
        err?.response?.data?.message ||
        'Could not refresh products.'
      )

    } finally {
      setRefreshing(false)
    }
  }


  // =========================================================
  // GET PRODUCT STATUS
  // =========================================================

  const getProductStatus = (product) => {
    const status =
      String(
        product?.status || ''
      ).toUpperCase()

    if (status === 'INACTIVE') {
      return 'INACTIVE'
    }

    if (status === 'DISCONTINUED') {
      return 'DISCONTINUED'
    }

    if (
      Number(
        product?.stock ?? 0
      ) === 0
    ) {
      return 'OUT_OF_STOCK'
    }

    return 'ACTIVE'
  }


  // =========================================================
  // STATUS LABEL
  // =========================================================

  const getStatusLabel = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'Active'

      case 'OUT_OF_STOCK':
        return 'Out of Stock'

      case 'INACTIVE':
        return 'Inactive'

      case 'DISCONTINUED':
        return 'Discontinued'

      default:
        return status
    }
  }


  // =========================================================
  // STATUS CSS
  // =========================================================

  const getStatusClasses = (status) => {
    switch (status) {
      case 'ACTIVE':
        return (
          'bg-emerald-50 ' +
          'text-emerald-700 ' +
          'border-emerald-100'
        )

      case 'OUT_OF_STOCK':
        return (
          'bg-amber-50 ' +
          'text-amber-700 ' +
          'border-amber-100'
        )

      case 'INACTIVE':
        return (
          'bg-slate-100 ' +
          'text-slate-600 ' +
          'border-slate-200'
        )

      case 'DISCONTINUED':
        return (
          'bg-rose-50 ' +
          'text-rose-700 ' +
          'border-rose-100'
        )

      default:
        return (
          'bg-slate-100 ' +
          'text-slate-600 ' +
          'border-slate-200'
        )
    }
  }


  // =========================================================
  // GET CATEGORY NAME
  // =========================================================

  const getCategoryName = (product) => {
    if (!product) {
      return '—'
    }

    // If backend sends a string
    if (
      typeof product.category ===
      'string'
    ) {
      return product.category
    }

    // If backend sends category object
    if (
      product.category?.name
    ) {
      return product.category.name
    }

    // If backend sends categoryName
    if (
      product.categoryName
    ) {
      return product.categoryName
    }

    // If backend sends nested categoryName
    if (
      product.category?.categoryName
    ) {
      return product.category.categoryName
    }

    // Current backend response:
    // categoryId
    const categoryId =
      product.categoryId ??
      product.category?.id

    if (categoryId != null) {
      const category =
        categories.find(
          (item) =>
            String(item?.id) ===
            String(categoryId)
        )

      if (category?.name) {
        return category.name
      }
    }

    return '—'
  }


  // =========================================================
  // GET BRAND NAME
  // =========================================================

  const getBrandName = (product) => {
    if (!product) {
      return '—'
    }

    // If backend sends a string
    if (
      typeof product.brand ===
      'string'
    ) {
      return product.brand
    }

    // If backend sends brand object
    if (
      product.brand?.name
    ) {
      return product.brand.name
    }

    // If backend sends brandName
    if (
      product.brandName
    ) {
      return product.brandName
    }

    // If backend sends nested brandName
    if (
      product.brand?.brandName
    ) {
      return product.brand.brandName
    }

    // Current backend response:
    // brandId
    const brandId =
      product.brandId ??
      product.brand?.id

    if (brandId != null) {
      const brand =
        brands.find(
          (item) =>
            String(item?.id) ===
            String(brandId)
        )

      if (brand?.name) {
        return brand.name
      }
    }

    return '—'
  }


  // =========================================================
  // PRODUCT IMAGE
  // =========================================================

  const getImageUrl = (product) => {
    const images =
      Array.isArray(product?.images)
        ? product.images
        : []

    const firstImage =
      images.find(
        (image) =>
          typeof image === 'string' &&
          image.trim() !== ''
      )

    if (!firstImage) {
      return (
        'https://images.unsplash.com/' +
        'photo-1445205170230-053b83016050' +
        '?w=400'
      )
    }

    if (
      firstImage.startsWith(
        'http://'
      ) ||
      firstImage.startsWith(
        'https://'
      ) ||
      firstImage.startsWith(
        'data:'
      )
    ) {
      return firstImage
    }

    if (
      firstImage.startsWith('/')
    ) {
      return (
        `http://localhost:8086${firstImage}`
      )
    }

    return (
      `http://localhost:8086/${firstImage}`
    )
  }


  // =========================================================
  // OPEN STOCK MODAL
  // =========================================================

  const openStockModal = (product) => {
    setStockModal(product)

    setStockValue(
      String(
        product?.stock ?? 0
      )
    )

    setError('')
    setSuccess('')
  }


  // =========================================================
  // CLOSE STOCK MODAL
  // =========================================================

  const closeStockModal = () => {
    if (stockSaving) {
      return
    }

    setStockModal(null)
    setStockValue('')
  }


  // =========================================================
  // UPDATE STOCK
  // =========================================================

  const handleStockUpdate = async () => {
    if (!stockModal) {
      return
    }

    const newStock =
      Number(stockValue)

    if (
      !Number.isInteger(
        newStock
      ) ||
      newStock < 0
    ) {
      setError(
        'Stock must be a whole number greater than or equal to 0.'
      )

      return
    }

    try {
      setStockSaving(true)

      setError('')
      setSuccess('')

      await productApi.updateStock(
        stockModal.id,
        newStock
      )

      setProducts(
        (currentProducts) =>
          currentProducts.map(
            (product) => {
              if (
                product.id !==
                stockModal.id
              ) {
                return product
              }

              const currentStatus =
                String(
                  product.status || ''
                ).toUpperCase()

              let newStatus =
                product.status

              if (
                currentStatus ===
                  'ACTIVE' ||
                currentStatus ===
                  'OUT_OF_STOCK'
              ) {
                newStatus =
                  newStock > 0
                    ? 'ACTIVE'
                    : 'OUT_OF_STOCK'
              }

              return {
                ...product,
                stock: newStock,
                status: newStatus,
              }
            }
          )
      )

      setSuccess(
        `${
          stockModal.name ||
          'Product'
        } stock updated successfully.`
      )

      setStockModal(null)
      setStockValue('')

    } catch (err) {
      console.error(
        'Could not update stock:',
        err
      )

      setError(
        err?.response?.data?.message ||
        'Could not update stock.'
      )

    } finally {
      setStockSaving(false)
    }
  }


  // =========================================================
  // ACTIVATE / DEACTIVATE
  // =========================================================

  const handleToggleStatus =
    async (product) => {
      const status =
        getProductStatus(product)

      if (
        status ===
        'DISCONTINUED'
      ) {
        return
      }

      const isInactive =
        status === 'INACTIVE'

      const actionText =
        isInactive
          ? 'activate'
          : 'deactivate'

      const confirmed =
        window.confirm(
          `Are you sure you want to ${actionText} "${product.name}"?`
        )

      if (!confirmed) {
        return
      }

      try {
        setStatusChangingId(
          product.id
        )

        setError('')
        setSuccess('')

        if (isInactive) {
          await productApi.activate(
            product.id
          )

          setProducts(
            (currentProducts) =>
              currentProducts.map(
                (item) => {
                  if (
                    item.id !==
                    product.id
                  ) {
                    return item
                  }

                  const stock =
                    Number(
                      item.stock ?? 0
                    )

                  return {
                    ...item,
                    status:
                      stock > 0
                        ? 'ACTIVE'
                        : 'OUT_OF_STOCK',
                  }
                }
              )
          )

          setSuccess(
            `${product.name} has been activated successfully.`
          )

        } else {
          await productApi.deactivate(
            product.id
          )

          setProducts(
            (currentProducts) =>
              currentProducts.map(
                (item) =>
                  item.id ===
                  product.id
                    ? {
                        ...item,
                        status:
                          'INACTIVE',
                      }
                    : item
              )
          )

          setSuccess(
            `${product.name} has been deactivated successfully.`
          )
        }

      } catch (err) {
        console.error(
          `Could not ${actionText} product:`,
          err
        )

        setError(
          err?.response?.data?.message ||
          `Could not ${actionText} product.`
        )

      } finally {
        setStatusChangingId(
          null
        )
      }
    }


  // =========================================================
  // FILTERED PRODUCTS
  // =========================================================

  const filteredProducts =
    products.filter(
      (product) => {
        const status =
          getProductStatus(
            product
          )

        if (
          statusFilter ===
          'ALL'
        ) {
          return true
        }

        return (
          status ===
          statusFilter
        )
      }
    )


  // =========================================================
  // STATISTICS
  // =========================================================

  const totalProducts =
    products.length

  const activeProducts =
    products.filter(
      (product) =>
        getProductStatus(
          product
        ) === 'ACTIVE'
    ).length

  const outOfStockProducts =
    products.filter(
      (product) =>
        getProductStatus(
          product
        ) === 'OUT_OF_STOCK'
    ).length

  const inactiveProducts =
    products.filter(
      (product) =>
        getProductStatus(
          product
        ) === 'INACTIVE'
    ).length


  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <Loader
        label="Loading products..."
      />
    )
  }


  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="max-w-7xl mx-auto space-y-7">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>

          <p className="text-xs uppercase tracking-[0.18em] text-slate-400 font-semibold">
            Catalogue
          </p>

          <h1 className="text-3xl font-semibold text-slate-800 mt-1">
            Products
          </h1>

          <p className="text-sm text-slate-500 mt-2">
            Manage products, inventory,
            prices and availability.
          </p>

        </div>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={refreshing}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
        >

          <RefreshCw
            size={16}
            className={
              refreshing
                ? 'animate-spin'
                : ''
            }
          />

          Refresh

        </button>

      </div>


      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <div className="rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-600">
          {error}
        </div>
      )}


      {/* =====================================================
          SUCCESS
      ===================================================== */}

      {success && (
        <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {success}
        </div>
      )}


      {/* =====================================================
          STATISTICS
      ===================================================== */}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

        <div className="bg-white border border-slate-100 rounded-2xl p-5">

          <p className="text-xs uppercase tracking-wider text-slate-400">
            Total Products
          </p>

          <p className="text-2xl font-semibold text-slate-800 mt-2">
            {totalProducts}
          </p>

        </div>


        <div className="bg-white border border-slate-100 rounded-2xl p-5">

          <p className="text-xs uppercase tracking-wider text-slate-400">
            Active
          </p>

          <p className="text-2xl font-semibold text-emerald-600 mt-2">
            {activeProducts}
          </p>

        </div>


        <div className="bg-white border border-slate-100 rounded-2xl p-5">

          <p className="text-xs uppercase tracking-wider text-slate-400">
            Out of Stock
          </p>

          <p className="text-2xl font-semibold text-amber-600 mt-2">
            {outOfStockProducts}
          </p>

        </div>


        <div className="bg-white border border-slate-100 rounded-2xl p-5">

          <p className="text-xs uppercase tracking-wider text-slate-400">
            Inactive
          </p>

          <p className="text-2xl font-semibold text-slate-600 mt-2">
            {inactiveProducts}
          </p>

        </div>

      </div>


      {/* =====================================================
          STATUS FILTERS
      ===================================================== */}

      <div className="flex flex-wrap gap-2">

        {[
          ['ALL', 'All Status'],
          ['ACTIVE', 'Active'],
          [
            'OUT_OF_STOCK',
            'Out of Stock',
          ],
          [
            'INACTIVE',
            'Inactive',
          ],
          [
            'DISCONTINUED',
            'Discontinued',
          ],
        ].map(
          ([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() =>
                setStatusFilter(
                  value
                )
              }
              className={`
                px-4 py-2 rounded-xl
                text-sm font-medium
                border transition
                ${
                  statusFilter ===
                  value
                    ? 'bg-slate-800 text-white border-slate-800'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }
              `}
            >
              {label}
            </button>
          )
        )}

      </div>


      {/* =====================================================
          PRODUCT CATALOGUE
      ===================================================== */}

      <section className="bg-white border border-slate-100 rounded-2xl overflow-hidden">

        <div className="px-6 py-5 border-b border-slate-100">

          <h2 className="font-semibold text-slate-800">
            Product Catalogue
          </h2>

          <p className="text-sm text-slate-400 mt-1">
            Showing{' '}
            {filteredProducts.length}{' '}
            of{' '}
            {products.length}{' '}
            products
          </p>

        </div>


        {filteredProducts.length ===
        0 ? (

          <div className="py-16 text-center">

            <Package
              size={38}
              className="mx-auto text-slate-300"
            />

            <p className="font-medium text-slate-600 mt-4">
              No products found
            </p>

            <p className="text-sm text-slate-400 mt-1">
              Try changing the filter.
            </p>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full min-w-[1150px]">

              <thead>

                <tr className="bg-slate-50 border-b border-slate-100">

                  <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-slate-400 font-semibold">
                    Product
                  </th>

                  <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-slate-400 font-semibold">
                    Category
                  </th>

                  {/* NEW BRAND COLUMN */}

                  <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-slate-400 font-semibold">
                    Brand
                  </th>

                  <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-slate-400 font-semibold">
                    Price
                  </th>

                  <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-slate-400 font-semibold">
                    Stock
                  </th>

                  <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-slate-400 font-semibold">
                    Status
                  </th>

                  <th className="text-right px-6 py-4 text-xs uppercase tracking-wider text-slate-400 font-semibold">
                    Actions
                  </th>

                </tr>

              </thead>


              <tbody className="divide-y divide-slate-100">

                {filteredProducts.map(
                  (product) => {

                    const status =
                      getProductStatus(
                        product
                      )

                    const image =
                      getImageUrl(
                        product
                      )

                    const originalPrice =
                      Number(
                        product?.price ||
                        0
                      )

                    const discount =
                      Number(
                        product?.discount ||
                        0
                      )

                    const finalPrice =
                      originalPrice *
                      (
                        1 -
                        discount /
                          100
                      )

                    const changing =
                      statusChangingId ===
                      product.id


                    return (
                      <tr
                        key={
                          product.id
                        }
                        className="hover:bg-slate-50/70 transition"
                      >

                        {/* =================================================
                            PRODUCT
                        ================================================= */}

                        <td className="px-6 py-4">

                          <div className="flex items-center gap-3">

                            <img
                              src={image}
                              alt={
                                product.name ||
                                'Product'
                              }
                              className="w-12 h-12 rounded-xl object-cover bg-slate-100 border border-slate-100"
                              onError={(
                                event
                              ) => {
                                event.currentTarget.src =
                                  'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400'
                              }}
                            />

                            <div className="min-w-0">

                              <p className="font-semibold text-slate-800 truncate max-w-[220px]">
                                {product.name ||
                                  'Unnamed Product'}
                              </p>

                              <p className="text-xs text-slate-400 mt-1">
                                {product.code ||
                                  `#${product.id}`}
                              </p>

                            </div>

                          </div>

                        </td>


                        {/* =================================================
                            CATEGORY
                        ================================================= */}

                        <td className="px-6 py-4">

                          <span className="text-sm text-slate-600">
                            {getCategoryName(
                              product
                            )}
                          </span>

                        </td>


                        {/* =================================================
                            BRAND
                        ================================================= */}

                        <td className="px-6 py-4">

                          <span className="text-sm font-medium text-slate-700">
                            {getBrandName(
                              product
                            )}
                          </span>

                        </td>


                        {/* =================================================
                            PRICE
                        ================================================= */}

                        <td className="px-6 py-4">

                          <div>

                            <p className="text-sm font-semibold text-slate-800">

                              <Price
                                value={
                                  finalPrice
                                }
                              />

                            </p>

                            {discount >
                              0 && (
                              <p className="text-xs text-slate-400 mt-1">
                                {
                                  discount
                                }
                                % discount
                              </p>
                            )}

                          </div>

                        </td>


                        {/* =================================================
                            STOCK
                        ================================================= */}

                        <td className="px-6 py-4">

                          <span
                            className={`
                              text-sm font-semibold
                              ${
                                Number(
                                  product?.stock ??
                                    0
                                ) === 0
                                  ? 'text-amber-600'
                                  : 'text-slate-700'
                              }
                            `}
                          >
                            {product?.stock ??
                              0}
                          </span>

                        </td>


                        {/* =================================================
                            STATUS
                        ================================================= */}

                        <td className="px-6 py-4">

                          <span
                            className={`
                              inline-flex
                              items-center
                              px-3 py-1.5
                              rounded-full
                              border
                              text-xs
                              font-semibold
                              ${getStatusClasses(
                                status
                              )}
                            `}
                          >
                            {getStatusLabel(
                              status
                            )}
                          </span>

                        </td>


                        {/* =================================================
                            ACTIONS
                        ================================================= */}

                        <td className="px-6 py-4">

                          <div className="flex justify-end items-center gap-2">

                            {/* VIEW */}

                            <button
                              type="button"
                              title="View Product"
                              onClick={() =>
                                navigate(
                                  `/employee/products/${product.id}`
                                )
                              }
                              className="w-9 h-9 rounded-lg border border-slate-200 bg-white text-slate-500 flex items-center justify-center hover:bg-slate-100 hover:text-slate-800 transition"
                            >
                              <Eye
                                size={16}
                              />
                            </button>


                            {/* EDIT */}

                            <button
                              type="button"
                              title="Edit Product"
                              onClick={() =>
                                navigate(
                                  `/employee/products/${product.id}/edit`
                                )
                              }
                              className="w-9 h-9 rounded-lg border border-slate-200 bg-white text-slate-500 flex items-center justify-center hover:bg-slate-100 hover:text-slate-800 transition"
                            >
                              <Pencil
                                size={16}
                              />
                            </button>


                            {/* STOCK */}

                            <button
                              type="button"
                              title="Update Stock"
                              onClick={() =>
                                openStockModal(
                                  product
                                )
                              }
                              className="w-9 h-9 rounded-lg border border-slate-200 bg-white text-slate-500 flex items-center justify-center hover:bg-slate-100 hover:text-slate-800 transition"
                            >
                              <Package
                                size={16}
                              />
                            </button>


                            {/* ACTIVATE / DEACTIVATE */}

                            <button
                              type="button"
                              title={
                                status ===
                                'INACTIVE'
                                  ? 'Activate Product'
                                  : status ===
                                    'DISCONTINUED'
                                  ? 'Discontinued Product'
                                  : 'Deactivate Product'
                              }
                              disabled={
                                changing ||
                                status ===
                                  'DISCONTINUED'
                              }
                              onClick={() =>
                                handleToggleStatus(
                                  product
                                )
                              }
                              className={`
                                w-9 h-9 rounded-lg
                                border bg-white
                                flex items-center
                                justify-center
                                transition
                                disabled:opacity-30
                                disabled:cursor-not-allowed
                                ${
                                  status ===
                                  'INACTIVE'
                                    ? 'border-emerald-100 text-emerald-500 hover:bg-emerald-50'
                                    : 'border-rose-100 text-rose-500 hover:bg-rose-50'
                                }
                              `}
                            >

                              <Power
                                size={16}
                                className={
                                  changing
                                    ? 'animate-pulse'
                                    : ''
                                }
                              />

                            </button>

                          </div>

                        </td>

                      </tr>
                    )
                  }
                )}

              </tbody>

            </table>

          </div>

        )}

      </section>


      {/* =====================================================
          STOCK MODAL
      ===================================================== */}

      {stockModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

          <button
            type="button"
            aria-label="Close"
            onClick={
              closeStockModal
            }
            className="absolute inset-0 bg-slate-900/40"
          />


          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl p-6">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                  Inventory
                </p>

                <h3 className="text-xl font-semibold text-slate-800 mt-1">
                  Update Stock
                </h3>

              </div>


              <button
                type="button"
                onClick={
                  closeStockModal
                }
                disabled={
                  stockSaving
                }
                className="w-9 h-9 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200 disabled:opacity-50"
              >
                <X size={17} />
              </button>

            </div>


            <div className="mt-6">

              <div className="rounded-xl bg-slate-50 border border-slate-100 p-4">

                <p className="font-semibold text-slate-800">
                  {
                    stockModal.name
                  }
                </p>

                <p className="text-xs text-slate-400 mt-1">
                  Product code:{' '}
                  {
                    stockModal.code ||
                    stockModal.id
                  }
                </p>


                <div className="flex items-center gap-3 mt-3">

                  <span className="text-sm text-slate-500">
                    Current stock:
                  </span>

                  <span className="font-semibold text-slate-800">
                    {
                      stockModal.stock ??
                      0
                    }
                  </span>

                </div>

              </div>


              <div className="mt-5">

                <label className="block text-sm font-medium text-slate-700 mb-2">
                  New Stock
                </label>

                <input
                  type="number"
                  min="0"
                  step="1"
                  value={
                    stockValue
                  }
                  onChange={(
                    event
                  ) =>
                    setStockValue(
                      event.target.value
                    )
                  }
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                  placeholder="Enter stock quantity"
                  autoFocus
                />


                {Number(
                  stockValue
                ) > 0 &&
                  Number(
                    stockModal.stock ||
                      0
                  ) === 0 && (
                    <p className="text-xs text-emerald-600 mt-2">
                      Stock will become available and the product will return to Active.
                    </p>
                  )}


                {Number(
                  stockValue
                ) === 0 && (
                  <p className="text-xs text-amber-600 mt-2">
                    Stock is 0, so the product will remain Out of Stock.
                  </p>
                )}

              </div>

            </div>


            <div className="flex justify-end gap-3 mt-7">

              <button
                type="button"
                onClick={
                  closeStockModal
                }
                disabled={
                  stockSaving
                }
                className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>


              <button
                type="button"
                onClick={
                  handleStockUpdate
                }
                disabled={
                  stockSaving ||
                  stockValue === ''
                }
                className="px-5 py-2.5 rounded-xl bg-slate-800 text-white text-sm font-medium hover:bg-slate-700 disabled:opacity-50"
              >
                {stockSaving
                  ? 'Updating...'
                  : 'Update Stock'}
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  )
}