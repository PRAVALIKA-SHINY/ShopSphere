import React from 'react'
import {
  Link,
} from 'react-router-dom'

import {
  Heart,
  ShoppingBag,
  Star,
} from 'lucide-react'

import Price from './Price'

import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import api from '../api/axios'

export default function ProductCard({
  product,
}) {

  const { user } =
    useAuth()

  const {
    addToCart,
    toggleWishlist,
    wishlistItems,
  } = useCart()

  /*
   * ---------------------------------------------------------
   * PRODUCT SAFETY CHECK
   * ---------------------------------------------------------
   */

  if (!product) {
    return null
  }

  /*
   * ---------------------------------------------------------
   * BACKEND BASE URL
   * ---------------------------------------------------------
   *
   * Axios:
   *
   * http://localhost:8086/api
   *
   * We need:
   *
   * http://localhost:8086
   *
   * for uploaded product images.
   */

  const backendBaseUrl =
    (
      api?.defaults?.baseURL ||
      'http://localhost:8086/api'
    ).replace(
      /\/api\/?$/,
      ''
    )

  /*
   * ---------------------------------------------------------
   * FALLBACK IMAGE
   * ---------------------------------------------------------
   */

  const fallbackImage =
    'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&auto=format&fit=crop'

  /*
   * ---------------------------------------------------------
   * GET IMAGE URL
   * ---------------------------------------------------------
   *
   * Supports:
   *
   * 1. https://example.com/image.jpg
   * 2. /uploads/products/image.jpg
   * 3. uploads/products/image.jpg
   * 4. /api/uploads/products/image.jpg
   * 5. api/uploads/products/image.jpg
   * 6. data:image/...
   * 7. blob:...
   */

  const getImageUrl = (
    image
  ) => {

    if (
      !image ||
      typeof image !== 'string'
    ) {
      return ''
    }

    const trimmedImage =
      image.trim()

    if (!trimmedImage) {
      return ''
    }

    /*
     * Already a complete URL.
     */

    if (
      /^(https?:|data:|blob:)/i.test(
        trimmedImage
      )
    ) {
      return trimmedImage
    }

    /*
     * If backend returns:
     *
     * /api/...
     *
     * keep /api because the backend may expose
     * the image through that route.
     */

    if (
      trimmedImage.startsWith('/api/')
    ) {
      return `${backendBaseUrl}${trimmedImage}`
    }

    /*
     * If backend returns:
     *
     * api/...
     */

    if (
      trimmedImage.startsWith('api/')
    ) {
      return `${backendBaseUrl}/${trimmedImage}`
    }

    /*
     * If backend returns:
     *
     * /uploads/...
     */

    if (
      trimmedImage.startsWith('/')
    ) {
      return `${backendBaseUrl}${trimmedImage}`
    }

    /*
     * Normal relative path:
     *
     * uploads/...
     */

    return `${backendBaseUrl}/${trimmedImage}`
  }

  /*
   * ---------------------------------------------------------
   * GET PRODUCT IMAGES
   * ---------------------------------------------------------
   *
   * Your backend normally uses:
   *
   * product.images
   *
   * But this also supports imageUrls/imageUrl/image
   * in case the API response uses another field.
   */

  let productImages = []

  if (
    Array.isArray(product.images)
  ) {

    productImages =
      product.images

  } else if (
    Array.isArray(product.imageUrls)
  ) {

    productImages =
      product.imageUrls

  } else if (
    product.imageUrl
  ) {

    productImages = [
      product.imageUrl,
    ]

  } else if (
    product.image
  ) {

    productImages = [
      product.image,
    ]

  }

  /*
   * Find the first valid image.
   */

  const image =
    productImages.length > 0
      ? getImageUrl(
          productImages[0]
        )
      : ''

  /*
   * ---------------------------------------------------------
   * WISHLIST CHECK
   * ---------------------------------------------------------
   */

  const isWishlisted =
    Array.isArray(
      wishlistItems
    ) &&
    wishlistItems.some(
      (item) => {

        /*
         * Normal backend structure:
         *
         * item.product.id
         */

        if (
          item?.product?.id != null
        ) {

          return (
            Number(
              item.product.id
            ) ===
            Number(
              product.id
            )
          )

        }

        /*
         * Defensive support if the wishlist
         * contains the product directly.
         */

        if (
          item?.id != null
        ) {

          return (
            Number(
              item.id
            ) ===
            Number(
              product.id
            )
          )

        }

        return false
      }
    )

  /*
   * ---------------------------------------------------------
   * PRICE
   * ---------------------------------------------------------
   */

  const originalPrice =
    Number(
      product.price || 0
    )

  const discount =
    Number(
      product.discount || 0
    )

  const effectivePrice =
    originalPrice *
    (
      1 -
      discount / 100
    )

  /*
   * ---------------------------------------------------------
   * PRODUCT STATUS
   * ---------------------------------------------------------
   */

  const stock =
    Number(
      product.stock || 0
    )

  const unavailable =
    stock <= 0 ||
    product.status ===
      'INACTIVE' ||
    product.status ===
      'DISCONTINUED' ||
    product.active ===
      false

  /*
   * ---------------------------------------------------------
   * ADD TO CART
   * ---------------------------------------------------------
   */

  const handleAdd = async (
    event
  ) => {

    event.preventDefault()

    event.stopPropagation()

    if (
      !user ||
      user.role !==
        'CUSTOMER'
    ) {
      return
    }

    if (unavailable) {
      return
    }

    try {

      await addToCart(
        product.id,
        1
      )

    } catch (error) {

      console.error(
        'ADD TO CART ERROR:',
        error
      )
    }
  }

  /*
   * ---------------------------------------------------------
   * TOGGLE WISHLIST
   * ---------------------------------------------------------
   */

  const handleWishlist =
    async (
      event
    ) => {

      event.preventDefault()

      event.stopPropagation()

      if (
        !user ||
        user.role !==
          'CUSTOMER'
      ) {
        return
      }

      try {

        await toggleWishlist(
          product.id
        )

      } catch (error) {

        console.error(
          'TOGGLE WISHLIST ERROR:',
          error
        )
      }
    }

  /*
   * ---------------------------------------------------------
   * IMAGE ERROR
   * ---------------------------------------------------------
   *
   * If the backend image cannot be loaded,
   * use the fallback image.
   */

  const handleImageError = (
    event
  ) => {

    if (
      event.currentTarget.dataset
        .fallbackApplied ===
      'true'
    ) {
      return
    }

    event.currentTarget.dataset
      .fallbackApplied =
      'true'

    event.currentTarget.src =
      fallbackImage
  }

  /*
   * ---------------------------------------------------------
   * RENDER
   * ---------------------------------------------------------
   */

  return (
    <Link
      to={`/product/${product.id}`}
      className="group block"
    >

      {/* PRODUCT IMAGE */}

      <div
        className="
          relative
          rounded-xl2
          overflow-hidden
          bg-slate-50
          aspect-[3/4]
          shadow-card
        "
      >

        <img
          src={
            image ||
            fallbackImage
          }
          alt={
            product.name ||
            'Product'
          }
          onError={
            handleImageError
          }
          loading="lazy"
          className="
            w-full
            h-full
            object-cover
            group-hover:scale-105
            transition-transform
            duration-500
          "
        />

        {/* SOLD OUT */}

        {stock <= 0 && (

          <span
            className="
              absolute
              top-3
              left-3
              badge-soft
              bg-slate-900/80
              text-white
            "
          >
            Sold out
          </span>

        )}

        {/* DISCOUNT */}

        {discount > 0 &&
          stock > 0 && (

            <span
              className="
                absolute
                top-3
                left-3
                badge-soft
                bg-rose-100
                text-rose-600
              "
            >
              -{discount}%
            </span>

          )}

        {/* WISHLIST BUTTON */}

        {user?.role ===
          'CUSTOMER' && (

          <button
            type="button"
            onClick={
              handleWishlist
            }
            aria-label={
              isWishlisted
                ? 'Remove from wishlist'
                : 'Add to wishlist'
            }
            className={`
              absolute
              top-3
              right-3
              w-9
              h-9
              rounded-full
              flex
              items-center
              justify-center
              backdrop-blur-md
              transition-colors
              ${
                isWishlisted
                  ? 'bg-rose-400 text-white'
                  : 'bg-white/90 text-slate-500 hover:text-rose-400'
              }
            `}
          >

            <Heart
              size={16}
              fill={
                isWishlisted
                  ? 'currentColor'
                  : 'none'
              }
            />

          </button>

        )}

        {/* ADD TO CART */}

        {user?.role ===
          'CUSTOMER' &&
          !unavailable && (

          <div
            className="
              absolute
              inset-x-0
              bottom-0
              p-3
              opacity-0
              group-hover:opacity-100
              transition-opacity
              duration-300
            "
          >

            <button
              type="button"
              onClick={
                handleAdd
              }
              className="
                w-full
                bg-white/95
                text-slate-700
                rounded-full
                py-2
                text-sm
                font-medium
                flex
                items-center
                justify-center
                gap-2
                shadow-md
                hover:bg-slate-800
                hover:text-white
                transition-colors
              "
            >

              <ShoppingBag
                size={15}
              />

              Add to Bag

            </button>

          </div>

        )}

      </div>

      {/* PRODUCT INFORMATION */}

      <div
        className="
          mt-3
          px-0.5
        "
      >

        {/* PRODUCT NAME */}

        <h3
          className="
            text-sm
            font-medium
            text-slate-800
            truncate
          "
        >
          {
            product.name ||
            'Product'
          }
        </h3>

        {/* RATING */}

        <div
          className="
            flex
            items-center
            gap-1
            mt-1
          "
        >

          <Star
            size={13}
            className="
              text-amber-400
              fill-amber-400
            "
          />

          <span
            className="
              text-xs
              text-slate-500
            "
          >

            {
              Number(
                product.averageRating ||
                  0
              ).toFixed(1)
            }

            {' '}

            (
            {
              product.reviewCount ||
              0
            }
            )

          </span>

        </div>

        {/* PRICE */}

        <div
          className="
            flex
            items-baseline
            gap-2
            mt-1
          "
        >

          <span
            className="
              text-base
              font-semibold
              text-slate-800
            "
          >

            <Price
              value={
                effectivePrice
              }
            />

          </span>

          {/* ORIGINAL PRICE */}

          {discount > 0 && (

            <span
              className="
                text-xs
                text-slate-400
                line-through
              "
            >

              <Price
                value={
                  originalPrice
                }
              />

            </span>

          )}

        </div>

      </div>

    </Link>
  )
}