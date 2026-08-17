import React from 'react'
import { Link } from 'react-router-dom'
import {
  Heart,
  ShoppingBag,
} from 'lucide-react'

import ProductCard from '../components/ProductCard'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function Wishlist() {

  const { user } =
    useAuth()

  const {
    wishlistItems,
  } = useCart()

  /*
   * Always work with an array.
   */

  const items =
    Array.isArray(wishlistItems)
      ? wishlistItems
      : []

  

  const products =
    items
      .map(
        (item) => {

          if (
            !item ||
            item.productId == null
          ) {
            return null
          }

          return {

            /*
             * REAL PRODUCT ID
             */
            id:
              item.productId,

            /*
             * PRODUCT CODE
             */
            code:
              item.productCode ||
              '',

            /*
             * PRODUCT NAME
             */
            name:
              item.productName ||
              'Product',

            /*
             * DESCRIPTION
             */
            description:
              item.description ||
              '',

            /*
             * PRICE
             */
            price:
              Number(
                item.price || 0
              ),

            /*
             * DISCOUNT
             */
            discount:
              Number(
                item.discount || 0
              ),

            /*
             * STOCK
             */
            stock:
              Number(
                item.stock || 0
              ),

            /*
             * PRODUCT IMAGES
             */
            images:
              Array.isArray(
                item.images
              )
                ? item.images
                : [],

            /*
             * STATUS
             */
            status:
              item.status,

            /*
             * ACTIVE FLAG
             */
            active:
              item.active,

            /*
             * RATING
             */
            averageRating:
              Number(
                item.averageRating || 0
              ),

            /*
             * REVIEW COUNT
             */
            reviewCount:
              Number(
                item.reviewCount || 0
              ),

                categoryId:
              item.categoryId,

            brandId:
              item.brandId,

            createdById:
              item.createdById,

            specifications:
              item.specifications,

            createdAt:
              item.createdAt,

            updatedAt:
              item.updatedAt,
          }
        }
      )
      .filter(Boolean)

  /*
   * ---------------------------------------------------------
   * CUSTOMER LOGIN CHECK
   * ---------------------------------------------------------
   */

  if (
    !user ||
    user.role !== 'CUSTOMER'
  ) {

    return (
      <div
        className="
          max-w-xl
          mx-auto
          px-6
          py-24
          text-center
        "
      >

        <div
          className="
            dashboard-card
            p-10
          "
        >

          <Heart
            size={42}
            className="
              mx-auto
              text-brand-500
            "
          />

          <h1
            className="
              text-2xl
              font-display
              font-semibold
              text-slate-800
              mt-5
            "
          >
            Your wishlist
          </h1>

          <p
            className="
              text-sm
              text-slate-500
              mt-2
            "
          >
            Login as a customer to view
            your wishlist.
          </p>

          <Link
            to="/login"
            className="
              btn-primary
              inline-flex
              mt-6
            "
          >
            Login
          </Link>

        </div>

      </div>
    )
  }

  /*
   * ---------------------------------------------------------
   * PAGE
   * ---------------------------------------------------------
   */

  return (
    <div
      className="
        max-w-7xl
        mx-auto
        px-4
        sm:px-6
        py-10
      "
    >

      {/* HEADER */}

      <div className="mb-8">

        <span className="eyebrow">
          Saved for later
        </span>

        <h1
          className="
            text-3xl
            font-display
            font-semibold
            text-slate-800
            mt-1
          "
        >
          My Wishlist
        </h1>

        <p
          className="
            text-sm
            text-slate-500
            mt-2
          "
        >
          {products.length} saved items
        </p>

      </div>

      {/* EMPTY WISHLIST */}

      {products.length === 0 ? (

        <div
          className="
            dashboard-card
            p-12
            text-center
          "
        >

          <Heart
            size={42}
            className="
              mx-auto
              text-slate-300
            "
          />

          <h2
            className="
              text-xl
              font-semibold
              text-slate-800
              mt-4
            "
          >
            Your wishlist is empty
          </h2>

          <p
            className="
              text-sm
              text-slate-500
              mt-2
            "
          >
            Save products you love and find
            them here whenever you're ready.
          </p>

          <Link
            to="/shop"
            className="
              btn-primary
              inline-flex
              mt-6
              items-center
              gap-2
            "
          >

            <ShoppingBag
              size={17}
            />

            Start shopping

          </Link>

        </div>

      ) : (

        /* PRODUCT GRID */

        <div
          className="
            grid
            grid-cols-2
            sm:grid-cols-3
            lg:grid-cols-4
            gap-5
          "
        >

          {products.map(
            (product) => (

              <ProductCard
                key={
                  product.id
                }
                product={
                  product
                }
              />

            )
          )}

        </div>

      )}

    </div>
  )
}