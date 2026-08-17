import React, {
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  useNavigate,
  useParams,
} from 'react-router-dom'

import {
  ArrowLeft,
  Heart,
  ImageOff,
  Minus,
  Plus,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Star,
  Truck,
} from 'lucide-react'

import Price from '../components/Price'
import Loader from '../components/Loader'
import ProductCard from '../components/ProductCard'

import { productApi } from '../api/productApi'
import { reviewApi } from '../api/reviewApi'

import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

import api from '../api/axios'


export default function ProductDetails2() {
  const { id } = useParams()
  const navigate = useNavigate()

  const { user } = useAuth()

  const {
    addToCart,
    toggleWishlist,
    wishlistItems,
  } = useCart()

  const [product, setProduct] =
    useState(null)

  const [related, setRelated] =
    useState([])

  const [reviews, setReviews] =
    useState([])

  const [loading, setLoading] =
    useState(true)

  const [reviewLoading, setReviewLoading] =
    useState(false)

  const [qty, setQty] =
    useState(1)

  const [activeImg, setActiveImg] =
    useState(0)

  const [msg, setMsg] =
    useState('')

  const [reviewForm, setReviewForm] =
    useState({
      rating: 5,
      comment: '',
    })


  // Build the backend URL used by product images.

  const backendBaseUrl = useMemo(() => {
    return (
      api?.defaults?.baseURL ||
      'http://localhost:8086/api'
    ).replace(
      /\/api\/?$/,
      ''
    )
  }, [])


  // Convert backend image paths into usable browser URLs.

  const getImageUrl = (image) => {
    if (
      !image ||
      typeof image !== 'string'
    ) {
      return ''
    }

    const value =
      image.trim()

    if (!value) {
      return ''
    }

    if (
      value.startsWith('http://') ||
      value.startsWith('https://') ||
      value.startsWith('data:')
    ) {
      return value
    }

    if (value.startsWith('/')) {
      return `${backendBaseUrl}${value}`
    }

    return `${backendBaseUrl}/${value}`
  }


  // Safely extract data from the ApiResponse wrapper.

  const extractData = (response) => {
    return (
      response?.data?.data ??
      response?.data ??
      null
    )
  }


  // Extract an array from either a normal array or Spring Page response.

  const extractList = (value) => {
    if (Array.isArray(value)) {
      return value
    }

    if (
      Array.isArray(value?.content)
    ) {
      return value.content
    }

    return []
  }


  // Load product, related products and reviews.

  const loadProduct = async () => {
    if (!id) {
      return
    }

    setLoading(true)
    setMsg('')

    try {
      const response =
        await productApi.getById(id)

      const productData =
        extractData(response)

      if (!productData) {
        throw new Error(
          'Product information was not returned.'
        )
      }

      setProduct(productData)
      setActiveImg(0)
      setQty(1)

      // Load related products.

      const categoryId =
        productData?.category?.id ??
        productData?.categoryId

      if (categoryId) {
        try {
          const relatedResponse =
            await productApi.getByCategory(
              categoryId,
              0,
              8
            )

          const relatedData =
            extractData(
              relatedResponse
            )

          const relatedProducts =
            extractList(
              relatedData
            )

          setRelated(
            relatedProducts.filter(
              (item) =>
                String(item?.id) !==
                String(productData?.id)
            )
          )
        } catch (error) {
          console.warn(
            'Could not load related products:',
            error
          )

          setRelated([])
        }
      } else {
        setRelated([])
      }

      // Load customer reviews.

      try {
        const reviewResponse =
          await reviewApi.getByProduct(
            id,
            0,
            20
          )

        const reviewData =
          extractData(
            reviewResponse
          )

        setReviews(
          extractList(reviewData)
        )
      } catch (error) {
        console.warn(
          'Could not load reviews:',
          error
        )

        setReviews([])
      }
    } catch (error) {
      console.error(
        'Could not load product:',
        error
      )

      setProduct(null)
    } finally {
      setLoading(false)
    }
  }


  useEffect(() => {
    loadProduct()
  }, [id])


  // Redirect customer to login while remembering the product page.

  const redirectToLogin = () => {
    navigate('/login', {
      state: {
        from: `/product/${id}`,
      },
    })
  }


  // Determine whether the current product is already in wishlist.

  const isWishlisted = useMemo(() => {
    if (!Array.isArray(wishlistItems)) {
      return false
    }

    return wishlistItems.some(
      (item) => {
        const wishlistProduct =
          item?.product ?? item

        return (
          String(
            wishlistProduct?.id
          ) === String(product?.id)
        )
      }
    )
  }, [
    wishlistItems,
    product?.id,
  ])


  // Calculate displayed price after discount.

  const price =
    Number(product?.price ?? 0)

  const discount =
    Number(product?.discount ?? 0)

  const effectivePrice =
    price *
    (1 - discount / 100)


  // Convert product images into a clean array.

  const images =
    Array.isArray(product?.images)
      ? product.images.filter(
          (image) =>
            typeof image === 'string' &&
            image.trim() !== ''
        )
      : []


  const currentImage =
    images[activeImg] ?? ''


  // Determine product stock and availability.

  const stock =
    Number(product?.stock ?? 0)

  const status =
    String(
      product?.status ?? ''
    ).toUpperCase()

  const unavailable =
    stock <= 0 ||
    status === 'OUT_OF_STOCK' ||
    status === 'INACTIVE' ||
    status === 'DISCONTINUED'


  // Parse specifications without assuming a specific backend format.

  const specifications = useMemo(() => {
    const raw =
      product?.specifications

    if (
      raw === null ||
      raw === undefined
    ) {
      return null
    }

    if (
      typeof raw === 'object'
    ) {
      return raw
    }

    if (
      typeof raw !== 'string'
    ) {
      return String(raw)
    }

    const trimmed =
      raw.trim()

    if (!trimmed) {
      return null
    }

    try {
      const parsed =
        JSON.parse(trimmed)

      return parsed
    } catch {
      return trimmed
    }
  }, [
    product?.specifications,
  ])


  // Add selected quantity to the customer's cart.

  const handleAddToCart = async () => {
    if (!user) {
      redirectToLogin()
      return
    }

    const role =
      String(
        user?.role ?? ''
      ).toUpperCase()

    if (role !== 'CUSTOMER') {
      setMsg(
        'Please login with a customer account to add items to your bag.'
      )

      return
    }

    if (unavailable) {
      setMsg(
        'This product is currently unavailable.'
      )

      return
    }

    try {
      await addToCart(
        product.id,
        qty
      )

      setMsg(
        'Added to bag successfully!'
      )

      window.setTimeout(() => {
        setMsg('')
      }, 2500)
    } catch (error) {
      console.error(
        'Could not add product to bag:',
        error
      )

      const backendMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error

      setMsg(
        backendMessage ||
        'Could not add product to bag.'
      )
    }
  }


  // Add or remove the product from wishlist.

  const handleWishlist = async () => {
    if (!user) {
      redirectToLogin()
      return
    }

    const role =
      String(
        user?.role ?? ''
      ).toUpperCase()

    if (role !== 'CUSTOMER') {
      setMsg(
        'Please login with a customer account to use your wishlist.'
      )

      return
    }

    try {
      await toggleWishlist(
        product.id
      )

      setMsg(
        isWishlisted
          ? 'Removed from wishlist.'
          : 'Added to wishlist.'
      )

      window.setTimeout(() => {
        setMsg('')
      }, 2000)
    } catch (error) {
      console.error(
        'Could not update wishlist:',
        error
      )

      setMsg(
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        'Could not update wishlist.'
      )
    }
  }


  // Decrease product quantity.

  const decreaseQty = () => {
    setQty(
      (current) =>
        Math.max(
          1,
          current - 1
        )
    )
  }


  // Increase product quantity without exceeding stock.

  const increaseQty = () => {
    setQty(
      (current) =>
        Math.min(
          stock || 1,
          current + 1
        )
    )
  }


  // Submit a customer review.

  const submitReview = async (
    event
  ) => {
    event.preventDefault()

    if (!user) {
      redirectToLogin()
      return
    }

    const role =
      String(
        user?.role ?? ''
      ).toUpperCase()

    if (role !== 'CUSTOMER') {
      setMsg(
        'Please login with a customer account to submit a review.'
      )

      return
    }

    const comment =
      reviewForm.comment.trim()

    if (!comment) {
      setMsg(
        'Please enter a review comment.'
      )

      return
    }

    setReviewLoading(true)
    setMsg('')

    try {
      await reviewApi.add(
        product.id,
        Number(
          reviewForm.rating
        ),
        comment
      )

      setReviewForm({
        rating: 5,
        comment: '',
      })

      setMsg(
        'Review submitted successfully!'
      )

      await loadProduct()

      window.setTimeout(() => {
        setMsg('')
      }, 2500)
    } catch (error) {
      console.error(
        'Could not submit review:',
        error
      )

      setMsg(
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        'Could not submit review.'
      )
    } finally {
      setReviewLoading(false)
    }
  }


  // Safely display customer name regardless of DTO shape.

  const getReviewCustomerName = (
    review
  ) => {
    return (
      review?.customer?.name ||
      review?.customerName ||
      review?.user?.name ||
      review?.userName ||
      'Customer'
    )
  }


  // Safely display review comment.

  const getReviewComment = (
    review
  ) => {
    return (
      review?.comment ||
      ''
    )
  }


  // Safely display review date.

  const getReviewDate = (
    review
  ) => {
    const value =
      review?.createdAt ||
      review?.updatedAt

    if (!value) {
      return ''
    }

    try {
      return new Date(
        value
      ).toLocaleDateString(
        'en-IN',
        {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }
      )
    } catch {
      return ''
    }
  }


  // Render product specifications.

  const renderSpecifications = () => {
    if (!specifications) {
      return (
        <div className="text-sm text-slate-500">
          No specifications available
          for this product.
        </div>
      )
    }

    if (
      typeof specifications ===
      'string'
    ) {
      return (
        <div className="whitespace-pre-line text-sm leading-7 text-slate-600">
          {specifications}
        </div>
      )
    }

    if (
      Array.isArray(specifications)
    ) {
      return (
        <div className="space-y-3">
          {specifications.map(
            (item, index) => (
              <div
                key={index}
                className="rounded-xl bg-slate-50 border border-slate-100 px-4 py-3"
              >
                <span className="text-sm text-slate-600">
                  {typeof item ===
                  'object'
                    ? JSON.stringify(
                        item
                      )
                    : String(item)}
                </span>
              </div>
            )
          )}
        </div>
      )
    }

    return (
      <div className="overflow-hidden rounded-xl border border-slate-100">
        {Object.entries(
          specifications
        ).map(
          ([key, value]) => (
            <div
              key={key}
              className="grid sm:grid-cols-[180px_1fr] border-b last:border-b-0 border-slate-100"
            >
              <div className="bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
                {formatSpecificationKey(
                  key
                )}
              </div>

              <div className="px-4 py-3 text-sm text-slate-600">
                {typeof value ===
                'object'
                  ? JSON.stringify(
                      value
                    )
                  : String(value)}
              </div>
            </div>
          )
        )}
      </div>
    )
  }


  // Loading state.

  if (loading) {
    return (
      <Loader
        label="Loading product..."
      />
    )
  }


  // Product-not-found state.

  if (!product) {
    return (
      <div className="max-w-xl mx-auto px-6 py-24">
        <div className="dashboard-card p-10 text-center">

          <h1 className="text-xl font-semibold text-slate-800">
            Product not found
          </h1>

          <p className="text-sm text-slate-500 mt-2">
            This product may have been
            removed or is no longer
            available.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate('/shop')
            }
            className="btn-primary mt-6"
          >
            Back to Shop
          </button>

        </div>
      </div>
    )
  }


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

      {/* Back navigation */}

      <div className="mb-6">
        <button
          type="button"
          onClick={() => {
            if (
              window.history.length >
              1
            ) {
              navigate(-1)
            } else {
              navigate('/shop')
            }
          }}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-brand-600 transition"
        >
          <ArrowLeft
            size={17}
          />

          Back
        </button>
      </div>


      {/* Main product section */}

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">

        {/* Product images */}

        <div>

          <div className="rounded-2xl overflow-hidden bg-slate-50 aspect-[3/4] border border-slate-100 flex items-center justify-center">

            {currentImage ? (
              <img
                src={getImageUrl(
                  currentImage
                )}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(event) => {
                  event.currentTarget.style.display =
                    'none'
                }}
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-slate-300">

                <ImageOff
                  size={48}
                />

                <p className="text-sm mt-3">
                  No image available
                </p>

              </div>
            )}

          </div>


          {images.length > 1 && (
            <div className="flex gap-3 mt-4 overflow-x-auto pb-1">

              {images.map(
                (
                  image,
                  index
                ) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() =>
                      setActiveImg(
                        index
                      )
                    }
                    className={`
                      w-16
                      h-16
                      flex-shrink-0
                      rounded-xl
                      overflow-hidden
                      border-2
                      ${
                        activeImg ===
                        index
                          ? 'border-brand-500'
                          : 'border-transparent'
                      }
                    `}
                  >
                    <img
                      src={getImageUrl(
                        image
                      )}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                )
              )}

            </div>
          )}

        </div>


        {/* Product information */}

        <div className="flex flex-col">

          {/* Brand */}

          {(product?.brand?.name ||
            product?.brandName) && (
            <p className="text-xs uppercase tracking-[0.16em] text-brand-600 font-semibold">
              {product.brand?.name ||
                product.brandName}
            </p>
          )}


          {/* Product name */}

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-semibold text-slate-800 mt-2 leading-tight">
            {product.name}
          </h1>


          {/* Rating */}

          <div className="flex items-center gap-2 mt-3">

            <div className="flex">
              {Array.from({
                length: 5,
              }).map(
                (_, index) => {
                  const average =
                    Number(
                      product.averageRating ??
                        0
                    )

                  return (
                    <Star
                      key={index}
                      size={17}
                      className={
                        index <
                        Math.round(
                          average
                        )
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-slate-200'
                      }
                    />
                  )
                }
              )}
            </div>

            <span className="text-sm text-slate-500">
              {Number(
                product.averageRating ??
                  0
              ).toFixed(1)}

              {' '}

              (
              {Number(
                product.reviewCount ??
                  reviews.length ??
                  0
              )}

              {' '}
              reviews)
            </span>

          </div>


          {/* Price */}

          <div className="flex items-center flex-wrap gap-3 mt-6">

            <span className="text-3xl font-bold text-brand-700">
              <Price
                value={
                  effectivePrice
                }
              />
            </span>

            {discount > 0 && (
              <>
                <span className="text-lg text-slate-400 line-through">
                  <Price
                    value={price}
                  />
                </span>

                <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-500 text-xs font-bold">
                  {discount}% OFF
                </span>
              </>
            )}

          </div>


          {/* Description */}

          <p className="text-slate-600 leading-7 mt-6">
            {product.description ||
              'No description available for this product.'}
          </p>


          {/* Stock */}

          <div className="mt-5">

            {stock > 0 &&
            status === 'ACTIVE' ? (
              <span className="text-sm font-semibold text-emerald-600">
                In stock • {stock}{' '}
                available
              </span>
            ) : status ===
              'DISCONTINUED' ? (
              <span className="text-sm font-semibold text-red-500">
                Discontinued
              </span>
            ) : (
              <span className="text-sm font-semibold text-red-500">
                Currently unavailable
              </span>
            )}

          </div>


          {/* Quantity and actions */}

          <div className="flex flex-wrap items-center gap-3 mt-7">

            <div className="flex items-center border border-slate-200 rounded-full h-12">

              <button
                type="button"
                onClick={
                  decreaseQty
                }
                disabled={
                  qty <= 1
                }
                className="w-11 h-11 flex items-center justify-center text-slate-600 hover:text-brand-600 disabled:opacity-40"
              >
                <Minus
                  size={16}
                />
              </button>

              <span className="w-10 text-center font-semibold text-slate-700">
                {qty}
              </span>

              <button
                type="button"
                onClick={
                  increaseQty
                }
                disabled={
                  unavailable ||
                  qty >= stock
                }
                className="w-11 h-11 flex items-center justify-center text-slate-600 hover:text-brand-600 disabled:opacity-40"
              >
                <Plus
                  size={16}
                />
              </button>

            </div>


            <button
              type="button"
              onClick={
                handleAddToCart
              }
              disabled={
                unavailable
              }
              className="btn-primary flex-1 min-w-[180px] h-12 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <ShoppingBag
                size={18}
              />

              {stock === 0 ||
              status ===
                'OUT_OF_STOCK'
                ? 'Sold Out'
                : status ===
                    'INACTIVE' ||
                  status ===
                    'DISCONTINUED'
                ? 'Unavailable'
                : 'Add to Bag'}
            </button>


            <button
              type="button"
              onClick={
                handleWishlist
              }
              className={`
                w-12
                h-12
                rounded-full
                border
                flex
                items-center
                justify-center
                transition
                ${
                  isWishlisted
                    ? 'bg-rose-50 text-rose-500 border-rose-200'
                    : 'border-slate-200 text-slate-500 hover:border-brand-300 hover:text-brand-600'
                }
              `}
              aria-label="Wishlist"
            >
              <Heart
                size={19}
                fill={
                  isWishlisted
                    ? 'currentColor'
                    : 'none'
                }
              />
            </button>

          </div>


          {/* Action message */}

          {msg && (
            <div className="mt-4 rounded-xl bg-brand-50 border border-brand-100 text-brand-700 px-4 py-3 text-sm">
              {msg}
            </div>
          )}


          {/* Service features */}

          <div className="grid grid-cols-3 gap-3 mt-8 border-t border-slate-100 pt-6">

            <div className="flex flex-col items-center text-center gap-2 text-xs text-slate-500">
              <Truck
                size={20}
                className="text-brand-600"
              />
              Fast delivery
            </div>

            <div className="flex flex-col items-center text-center gap-2 text-xs text-slate-500">
              <RotateCcw
                size={20}
                className="text-brand-600"
              />
              Easy returns
            </div>

            <div className="flex flex-col items-center text-center gap-2 text-xs text-slate-500">
              <ShieldCheck
                size={20}
                className="text-brand-600"
              />
              Secure checkout
            </div>

          </div>

        </div>

      </div>


      {/* Specifications */}

      <section className="mt-16">

        <div className="border-b border-slate-100 pb-3 mb-6">
          <h2 className="text-2xl font-display font-semibold text-slate-800">
            Specifications
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Product details and specifications
          </p>
        </div>

        {renderSpecifications()}

      </section>


      {/* Reviews */}

      <section className="mt-16 max-w-4xl">

        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-2xl font-display font-semibold text-slate-800">
            Customer Reviews
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            See what customers think about
            this product.
          </p>
        </div>


        {/* Review form */}

        {String(
          user?.role ?? ''
        ).toUpperCase() ===
          'CUSTOMER' && (
          <form
            onSubmit={
              submitReview
            }
            className="dashboard-card p-5 mt-5 mb-8"
          >

            <h3 className="font-semibold text-slate-800 mb-3">
              Share your experience
            </h3>


            {/* Rating selector */}

            <div className="flex items-center gap-1 mb-4">

              {[1, 2, 3, 4, 5].map(
                (number) => (
                  <button
                    type="button"
                    key={number}
                    onClick={() =>
                      setReviewForm(
                        (current) => ({
                          ...current,
                          rating:
                            number,
                        })
                      )
                    }
                    aria-label={`Rate ${number} stars`}
                  >
                    <Star
                      size={22}
                      className={
                        number <=
                        reviewForm.rating
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-slate-300'
                      }
                    />
                  </button>
                )
              )}

            </div>


            {/* Review comment */}

            <textarea
              value={
                reviewForm.comment
              }
              onChange={(
                event
              ) =>
                setReviewForm(
                  (current) => ({
                    ...current,
                    comment:
                      event.target
                        .value,
                  })
                )
              }
              placeholder="Share your thoughts on this product..."
              className="input-field mb-3"
              rows={4}
              maxLength={1000}
              required
            />


            <div className="flex items-center justify-between gap-4">

              <span className="text-xs text-slate-400">
                {
                  reviewForm
                    .comment
                    .length
                }
                /1000
              </span>

              <button
                type="submit"
                disabled={
                  reviewLoading
                }
                className="btn-primary !py-2.5 !px-6 text-sm disabled:opacity-50"
              >
                {reviewLoading
                  ? 'Submitting...'
                  : 'Submit Review'}
              </button>

            </div>

          </form>
        )}


        {/* Login prompt for guests */}

        {!user && (
          <div className="dashboard-card p-5 mt-5 mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

            <div>
              <h3 className="font-semibold text-slate-800">
                Have you used this
                product?
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                Login to share your
                experience with other
                customers.
              </p>
            </div>

            <button
              type="button"
              onClick={
                redirectToLogin
              }
              className="btn-secondary whitespace-nowrap"
            >
              Login to Review
            </button>

          </div>
        )}


        {/* Reviews list */}

        <div className="space-y-5 mt-6">

          {reviews.length ===
            0 && (
            <div className="dashboard-card p-8 text-center">

              <div className="flex justify-center mb-3">
                <Star
                  size={28}
                  className="text-slate-200"
                />
              </div>

              <p className="text-sm text-slate-500">
                No reviews yet.
                Be the first to
                review this
                product!
              </p>

            </div>
          )}


          {reviews.map(
            (review, index) => {
              const rating =
                Number(
                  review?.rating ??
                    0
                )

              const customerName =
                getReviewCustomerName(
                  review
                )

              const comment =
                getReviewComment(
                  review
                )

              const date =
                getReviewDate(
                  review
                )

              return (
                <div
                  key={
                    review?.id ??
                    `${customerName}-${index}`
                  }
                  className="border-b border-slate-100 pb-5"
                >

                  <div className="flex flex-wrap items-center gap-3">

                    <span className="font-semibold text-slate-800 text-sm">
                      {customerName}
                    </span>

                    <div className="flex">
                      {Array.from(
                        {
                          length: 5,
                        }
                      ).map(
                        (_, starIndex) => (
                          <Star
                            key={
                              starIndex
                            }
                            size={13}
                            className={
                              starIndex <
                              rating
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-slate-200'
                            }
                          />
                        )
                      )}
                    </div>

                    {date && (
                      <span className="text-xs text-slate-400">
                        {date}
                      </span>
                    )}

                  </div>


                  {comment && (
                    <p className="text-sm text-slate-600 mt-2 leading-6 whitespace-pre-line">
                      {comment}
                    </p>
                  )}

                </div>
              )
            }
          )}

        </div>

      </section>


      {/* Related products */}

      {related.length > 0 && (
        <section className="mt-16">

          <h2 className="text-2xl font-display font-semibold text-slate-800 mb-6">
            You May Also Like
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">

            {related.map(
              (item) => (
                <ProductCard
                  key={item.id}
                  product={item}
                />
              )
            )}

          </div>

        </section>
      )}

    </div>
  )
}


// Make specification keys readable.

function formatSpecificationKey(
  key
) {
  return String(key)
    .replace(
      /([a-z])([A-Z])/g,
      '$1 $2'
    )
    .replace(
      /[_-]+/g,
      ' '
    )
    .replace(
      /\b\w/g,
      (letter) =>
        letter.toUpperCase()
    )
}