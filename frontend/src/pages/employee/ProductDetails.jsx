import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Box,
  Edit3,
  ChevronLeft,
  ChevronRight,
  Star
} from 'lucide-react'

import { productApi } from '../../api/productApi'
import api from '../../api/axios'
import Loader from '../../components/Loader'
import Price from '../../components/Price'

export default function ProductDetails() {
  const navigate = useNavigate()
  const { id } = useParams()

  const [product, setProduct] = useState(null)
  const [categoryName, setCategoryName] = useState('')
  const [brandName, setBrandName] = useState('')

  const [selectedImage, setSelectedImage] = useState(0)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [imageError, setImageError] = useState({})

  const backendBaseUrl = useMemo(() => {
    const baseUrl =
      api?.defaults?.baseURL ||
      'http://localhost:8086/api'

    return baseUrl.replace(/\/api\/?$/, '')
  }, [])

  const getImageUrl = (image) => {
    if (!image) {
      return ''
    }

    if (typeof image !== 'string') {
      if (typeof image === 'object') {
        return getImageUrl(
          image.url ||
          image.imageUrl ||
          image.path ||
          image.src ||
          ''
        )
      }

      return ''
    }

    if (
      image.startsWith('http://') ||
      image.startsWith('https://') ||
      image.startsWith('data:')
    ) {
      return image
    }

    if (image.startsWith('/')) {
      return `${backendBaseUrl}${image}`
    }

    return `${backendBaseUrl}/${image}`
  }

  const getResponseData = (response) => {
    const outerData = response?.data

    if (outerData?.data !== undefined) {
      return outerData.data
    }

    return outerData
  }

  const extractName = (value) => {
    if (!value) {
      return ''
    }

    if (typeof value === 'string') {
      return value
    }

    return (
      value.name ||
      value.categoryName ||
      value.brandName ||
      value.title ||
      ''
    )
  }

  const extractList = (response) => {
    const data = getResponseData(response)

    if (Array.isArray(data)) {
      return data
    }

    if (Array.isArray(data?.content)) {
      return data.content
    }

    if (Array.isArray(data?.data)) {
      return data.data
    }

    if (Array.isArray(data?.items)) {
      return data.items
    }

    if (Array.isArray(data?.categories)) {
      return data.categories
    }

    if (Array.isArray(data?.brands)) {
      return data.brands
    }

    return []
  }

  const fetchCategoryName = async (categoryId) => {
    if (!categoryId) {
      return
    }

    try {
      const response =
        await api.get(`/categories/${categoryId}`)

      const data = getResponseData(response)

      const name = extractName(data)

      if (name) {
        setCategoryName(name)
        return
      }
    } catch (err) {
      console.warn(
        'Could not fetch category by ID:',
        categoryId,
        err
      )
    }

    try {
      const response =
        await api.get('/categories')

      const list = extractList(response)

      const category = list.find(
        (item) =>
          String(item?.id) === String(categoryId)
      )

      if (category) {
        setCategoryName(
          extractName(category)
        )
      }
    } catch (err) {
      console.warn(
        'Could not fetch categories:',
        err
      )
    }
  }

  const fetchBrandName = async (brandId) => {
    if (!brandId) {
      return
    }

    try {
      const response =
        await api.get(`/brands/${brandId}`)

      const data = getResponseData(response)

      const name = extractName(data)

      if (name) {
        setBrandName(name)
        return
      }
    } catch (err) {
      console.warn(
        'Could not fetch brand by ID:',
        brandId,
        err
      )
    }

    try {
      const response =
        await api.get('/brands')

      const list = extractList(response)

      const brand = list.find(
        (item) =>
          String(item?.id) === String(brandId)
      )

      if (brand) {
        setBrandName(
          extractName(brand)
        )
      }
    } catch (err) {
      console.warn(
        'Could not fetch brands:',
        err
      )
    }
  }

  useEffect(() => {
    let mounted = true

    const loadProduct = async () => {
      try {
        setLoading(true)
        setError('')

        const response =
          await productApi.getById(id)

        console.log(
          'PRODUCT DETAILS RESPONSE:',
          response
        )

        const data =
          response?.data?.data ||
          response?.data

        console.log(
          'PRODUCT DETAILS DATA:',
          data
        )

        if (!mounted) {
          return
        }

        if (!data) {
          throw new Error(
            'Product data was not returned.'
          )
        }

        setProduct(data)
        setSelectedImage(0)
        setImageError({})

        if (data.categoryId) {
          fetchCategoryName(
            data.categoryId
          )
        }

        if (data.brandId) {
          fetchBrandName(
            data.brandId
          )
        }
      } catch (err) {
        console.error(
          'Could not load product:',
          err
        )

        if (mounted) {
          setError(
            err?.response?.data?.message ||
            err?.message ||
            'Could not load product.'
          )
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    if (id) {
      loadProduct()
    }

    return () => {
      mounted = false
    }
  }, [id])

  const images = useMemo(() => {
    if (!product?.images) {
      return []
    }

    if (!Array.isArray(product.images)) {
      return []
    }

    return product.images
      .map((image) => {
        if (typeof image === 'string') {
          return image
        }

        if (typeof image === 'object') {
          return (
            image.url ||
            image.imageUrl ||
            image.path ||
            image.src ||
            ''
          )
        }

        return ''
      })
      .filter(
        (image) =>
          typeof image === 'string' &&
          image.trim() !== ''
      )
  }, [product])

  useEffect(() => {
    if (
      selectedImage >= images.length &&
      images.length > 0
    ) {
      setSelectedImage(0)
    }
  }, [images, selectedImage])

  const currentImage =
    images[selectedImage] ||
    images[0] ||
    ''

  const discountedPrice = useMemo(() => {
    if (!product) {
      return 0
    }

    const price =
      Number(product.price || 0)

    const discount =
      Number(product.discount || 0)

    return price * (1 - discount / 100)
  }, [product])

  const getStatusLabel = () => {
    if (!product) {
      return ''
    }

    if (
      product.status ===
      'DISCONTINUED'
    ) {
      return 'Discontinued'
    }

    if (
      product.status ===
      'INACTIVE'
    ) {
      return 'Inactive'
    }

    if (
      product.status ===
        'OUT_OF_STOCK' ||
      Number(product.stock || 0) === 0
    ) {
      return 'Out of Stock'
    }

    return 'Active'
  }

  const getStatusClasses = () => {
    const status = getStatusLabel()

    if (status === 'Active') {
      return 'bg-emerald-50 text-emerald-700 border-emerald-100'
    }

    if (status === 'Out of Stock') {
      return 'bg-amber-50 text-amber-700 border-amber-100'
    }

    if (status === 'Inactive') {
      return 'bg-slate-100 text-slate-600 border-slate-200'
    }

    if (status === 'Discontinued') {
      return 'bg-rose-50 text-rose-700 border-rose-100'
    }

    return 'bg-slate-100 text-slate-600 border-slate-200'
  }

  const previousImage = () => {
    if (images.length <= 1) {
      return
    }

    setSelectedImage((current) => {
      if (current === 0) {
        return images.length - 1
      }

      return current - 1
    })
  }

  const nextImage = () => {
    if (images.length <= 1) {
      return
    }

    setSelectedImage((current) => {
      if (current === images.length - 1) {
        return 0
      }

      return current + 1
    })
  }

  const handleThumbnailError = (index) => {
    setImageError((current) => ({
      ...current,
      [index]: true
    }))
  }

  if (loading) {
    return (
      <Loader label="Loading product..." />
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="rounded-2xl border border-rose-100 bg-rose-50 px-5 py-4 text-sm text-rose-600">
          {error}
        </div>

        <button
          type="button"
          onClick={() =>
            navigate('/employee/products')
          }
          className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 text-white text-sm font-medium hover:bg-slate-700"
        >
          <ArrowLeft size={16} />
          Back to Products
        </button>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="rounded-2xl border border-slate-200 bg-white px-5 py-10 text-center">
          <p className="text-slate-600 font-medium">
            Product not found.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate('/employee/products')
            }
            className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 text-white text-sm font-medium hover:bg-slate-700"
          >
            <ArrowLeft size={16} />
            Back to Products
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-7">

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div className="flex items-center gap-4">

          <button
            type="button"
            onClick={() =>
              navigate('/employee/products')
            }
            className="w-12 h-12 rounded-xl border border-slate-200 bg-white text-slate-500 flex items-center justify-center hover:bg-slate-50 hover:text-slate-800 transition"
            title="Back"
          >
            <ArrowLeft size={20} />
          </button>

          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400 font-semibold">
              Catalogue
            </p>

            <h1 className="text-3xl font-semibold text-slate-800 mt-1">
              Product Details
            </h1>
          </div>

        </div>

        <button
          type="button"
          onClick={() =>
            navigate(
              `/employee/products/${product.id}/edit`
            )
          }
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-800 text-white text-sm font-semibold hover:bg-slate-700 transition"
        >
          <Edit3 size={17} />
          Edit Product
        </button>

      </div>

      <section className="bg-white border border-slate-100 rounded-2xl overflow-hidden">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">

          <div className="p-6 md:p-8 bg-slate-50/50">

            <div className="relative">

              <div className="w-full aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-100 flex items-center justify-center">

                {currentImage ? (
                  <img
                    src={getImageUrl(currentImage)}
                    alt={product.name}
                    className="w-full h-full object-contain"
                    onError={(event) => {
                      event.currentTarget.style.display =
                        'none'
                    }}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-300">
                    <Box size={48} />

                    <p className="text-sm mt-3">
                      No image available
                    </p>
                  </div>
                )}

              </div>

              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={previousImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/95 shadow-md border border-slate-200 text-slate-600 flex items-center justify-center hover:bg-white hover:text-slate-900 transition"
                    title="Previous image"
                  >
                    <ChevronLeft size={20} />
                  </button>

                  <button
                    type="button"
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/95 shadow-md border border-slate-200 text-slate-600 flex items-center justify-center hover:bg-white hover:text-slate-900 transition"
                    title="Next image"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}

            </div>

            {images.length > 0 && (
              <div className="mt-5">

                <div className="flex items-center justify-between mb-3">

                  <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                    Product Images
                  </p>

                  <p className="text-xs text-slate-400">
                    {selectedImage + 1} / {images.length}
                  </p>

                </div>

                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">

                  {images.map((image, index) => (

                    <button
                      key={`${image}-${index}`}
                      type="button"
                      onClick={() =>
                        setSelectedImage(index)
                      }
                      className={`
                        flex-shrink-0
                        w-20 h-20
                        rounded-xl
                        overflow-hidden
                        bg-white
                        border-2
                        transition
                        ${
                          selectedImage === index
                            ? 'border-slate-800 ring-2 ring-slate-200'
                            : 'border-slate-200 hover:border-slate-400'
                        }
                      `}
                    >

                      {!imageError[index] ? (
                        <img
                          src={getImageUrl(image)}
                          alt={`${product.name} ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={() =>
                            handleThumbnailError(index)
                          }
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                          <Box size={22} />
                        </div>
                      )}

                    </button>

                  ))}

                </div>

              </div>
            )}

          </div>

          <div className="p-6 md:p-8 lg:p-10">

            <div className="flex items-start justify-between gap-4">

              <div>

                <p className="text-xs font-medium text-slate-400 tracking-wide">
                  {product.code ||
                    `#${product.id}`}
                </p>

                <h2 className="text-3xl md:text-4xl font-semibold text-slate-800 mt-3 leading-tight">
                  {product.name}
                </h2>

              </div>

              <span
                className={`
                  flex-shrink-0
                  inline-flex items-center
                  px-3 py-1.5
                  rounded-full
                  border
                  text-xs
                  font-semibold
                  ${getStatusClasses()}
                `}
              >
                {getStatusLabel()}
              </span>

            </div>

            {product.description && (
              <div className="mt-7">

                <p className="text-sm leading-7 text-slate-500 whitespace-pre-line">
                  {product.description}
                </p>

              </div>
            )}

            <div className="mt-8">

              <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                Price
              </p>

              <div className="flex items-center gap-3 mt-2 flex-wrap">

                <p className="text-3xl font-semibold text-slate-800">
                  <Price
                    value={discountedPrice}
                  />
                </p>

                {Number(
                  product.discount || 0
                ) > 0 && (
                  <span className="text-sm text-slate-400">
                    {product.discount}% off
                  </span>
                )}

              </div>

              {Number(
                product.discount || 0
              ) > 0 && (
                <p className="text-sm text-slate-400 mt-1 line-through">
                  <Price
                    value={Number(
                      product.price || 0
                    )}
                  />
                </p>
              )}

            </div>

            <div className="mt-8 rounded-2xl bg-slate-50 border border-slate-100 p-5">

              <div className="flex items-center gap-4">

                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-slate-500 border border-slate-100">
                  <Box size={22} />
                </div>

                <div>

                  <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                    Current Stock
                  </p>

                  <p className="text-2xl font-semibold text-slate-800 mt-1">
                    {product.stock ?? 0}
                  </p>

                </div>

              </div>

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">

              <div>

                <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                  Category
                </p>

                <p className="text-sm font-medium text-slate-700 mt-2">
                  {categoryName ||
                    product.category?.name ||
                    product.categoryName ||
                    '—'}
                </p>

              </div>

              <div>

                <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                  Brand
                </p>

                <p className="text-sm font-medium text-slate-700 mt-2">
                  {brandName ||
                    product.brand?.name ||
                    product.brandName ||
                    '—'}
                </p>

              </div>

            </div>

            {(product.averageRating !==
              undefined ||
              product.reviewCount !==
                undefined) && (
              <div className="flex items-center gap-3 mt-7">

                <div className="flex items-center gap-1 text-amber-500">

                  <Star
                    size={17}
                    fill="currentColor"
                  />

                  <span className="text-sm font-semibold">
                    {Number(
                      product.averageRating ||
                        0
                    ).toFixed(1)}
                  </span>

                </div>

                <span className="text-sm text-slate-400">
                  {product.reviewCount ||
                    0}{' '}
                  reviews
                </span>

              </div>
            )}

          </div>

        </div>

      </section>

      <section className="bg-white border border-slate-100 rounded-2xl p-6 md:p-8">

        <h2 className="text-xl font-semibold text-slate-800">
          Specifications
        </h2>

        {product.specifications ? (
          <div className="mt-5 rounded-xl bg-slate-50 border border-slate-100 p-5">

            <p className="text-sm text-slate-600 whitespace-pre-line leading-7">
              {typeof product.specifications ===
              'string'
                ? product.specifications
                : JSON.stringify(
                    product.specifications,
                    null,
                    2
                  )}
            </p>

          </div>
        ) : (
          <p className="text-sm text-slate-400 mt-4">
            No specifications available.
          </p>
        )}

      </section>

    </div>
  )
}