import React from 'react'
import {
  Link,
  useNavigate,
} from 'react-router-dom'

import {
  ArrowLeft,
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from 'lucide-react'

import Price from '../components/Price'
import { formatINR } from '../utils/currency'
import { useCart } from '../context/CartContext'

export default function Cart() {

  const navigate =
    useNavigate()

  const {
    cartItems,
    updateCartItem,
    removeFromCart,
  } = useCart()

  const items =
    Array.isArray(cartItems)
      ? cartItems
      : []

  const backendBaseUrl =
    'http://localhost:8086'

  const getImageUrl = (
    image
  ) => {

    if (
      !image ||
      typeof image !== 'string'
    ) {
      return ''
    }

    if (
      /^(https?:|data:)/i.test(
        image
      )
    ) {
      return image
    }

    return `${backendBaseUrl}/${image.replace(
      /^\//,
      ''
    )}`
  }

  const getEffectivePrice = (
    product
  ) => {

    const price =
      Number(
        product?.price || 0
      )

    const discount =
      Number(
        product?.discount || 0
      )

    return price *
      (
        1 -
        discount / 100
      )
  }

  const subtotal =
    items.reduce(
      (
        sum,
        item
      ) =>
        sum +
        getEffectivePrice(
          item.product
        ) *
        Number(
          item.quantity || 0
        ),
      0
    )

  const shipping =
    subtotal >= 999 ||
    subtotal === 0
      ? 0
      : 79

  const total =
    subtotal +
    shipping

  const handleQuantity = async (
    item,
    quantity
  ) => {

    try {

      await updateCartItem(
        item.id,
        quantity
      )

    } catch (error) {

      console.error(
        'Could not update cart item:',
        error
      )
    }
  }

  const handleRemove = async (
    itemId
  ) => {

    try {

      await removeFromCart(
        itemId
      )

    } catch (error) {

      console.error(
        'Could not remove cart item:',
        error
      )
    }
  }

  if (items.length === 0) {

    return (
      <div className="max-w-3xl mx-auto px-6 py-16 text-center">

        <button
          type="button"
          onClick={() =>
            navigate(-1)
          }
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 mb-10"
        >
          <ArrowLeft
            size={16}
          />

          Back
        </button>

        <ShoppingBag
          size={48}
          className="mx-auto text-brand-300 mb-4"
        />

        <h1 className="text-2xl font-display font-semibold text-gray-800 mb-2">
          Your bag is empty
        </h1>

        <p className="text-gray-500 mb-6">
          Looks like you haven't added anything yet.
        </p>

        <Link
          to="/shop"
          className="btn-primary"
        >
          Start Shopping
        </Link>

      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">

      <button
        type="button"
        onClick={() =>
          navigate(-1)
        }
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 mb-5"
      >
        <ArrowLeft
          size={16}
        />

        Back
      </button>

      <h1 className="section-title mb-8">
        Your Bag
      </h1>

      <div className="grid md:grid-cols-3 gap-10">

        <div className="md:col-span-2 space-y-5">

          {items.map(
            (item) => {

              const product =
                item.product

              return (
                <div
                  key={item.id}
                  className="card p-4 flex gap-4"
                >

                  <Link
                    to={`/product/${product?.id}`}
                    className="w-24 h-28 rounded-lg overflow-hidden bg-brand-50 shrink-0"
                  >

                    <img
                      src={getImageUrl(
                        product?.images?.[0]
                      )}
                      alt={
                        product?.name ||
                        'Product'
                      }
                      className="w-full h-full object-cover"
                    />

                  </Link>

                  <div className="flex-1 flex flex-col justify-between min-w-0">

                    <div>

                      <Link
                        to={`/product/${product?.id}`}
                        className="font-medium text-gray-800 hover:text-brand-600"
                      >
                        {
                          product?.name ||
                          'Product'
                        }
                      </Link>

                      <p className="text-sm text-gray-500 mt-1">
                        <Price
                          value={getEffectivePrice(
                            product
                          )}
                        />{' '}
                        each
                      </p>

                    </div>

                    <div className="flex items-center justify-between gap-4 mt-4">

                      <div className="flex items-center border border-brand-200 rounded-full">

                        <button
                          type="button"
                          disabled={
                            Number(
                              item.quantity
                            ) <= 1
                          }
                          onClick={() =>
                            handleQuantity(
                              item,
                              Math.max(
                                1,
                                Number(
                                  item.quantity
                                ) - 1
                              )
                            )
                          }
                          className="p-2 text-brand-600 disabled:opacity-40"
                        >
                          <Minus
                            size={14}
                          />
                        </button>

                        <span className="px-3 text-sm font-medium">
                          {
                            item.quantity
                          }
                        </span>

                        <button
                          type="button"
                          disabled={
                            Number(
                              item.quantity
                            ) >=
                            Number(
                              product?.stock ||
                              0
                            )
                          }
                          onClick={() =>
                            handleQuantity(
                              item,
                              Number(
                                item.quantity
                              ) + 1
                            )
                          }
                          className="p-2 text-brand-600 disabled:opacity-40"
                        >
                          <Plus
                            size={14}
                          />
                        </button>

                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          handleRemove(
                            item.id
                          )
                        }
                        className="text-gray-400 hover:text-red-500"
                      >
                        <Trash2
                          size={18}
                        />
                      </button>

                    </div>

                  </div>

                </div>
              )
            }
          )}

        </div>

        <div className="card p-6 h-fit sticky top-24">

          <h2 className="font-semibold text-gray-800 mb-4">
            Order Summary
          </h2>

          <div className="space-y-2 text-sm text-gray-600">

            <div className="flex justify-between">
              <span>
                Subtotal
              </span>

              <Price
                value={subtotal}
              />
            </div>

            <div className="flex justify-between">

              <span>
                Shipping
              </span>

              <span>
                {shipping === 0
                  ? 'Free'
                  : formatINR(
                      shipping
                    )}
              </span>

            </div>

          </div>

          <div className="border-t border-brand-100 mt-4 pt-4 flex justify-between font-semibold text-gray-800">

            <span>
              Total
            </span>

            <Price
              value={total}
            />

          </div>

          <button
            type="button"
            onClick={() =>
              navigate('/checkout')
            }
            className="btn-primary w-full mt-6 flex items-center justify-center gap-2"
          >
            Checkout

            <ArrowRight
              size={16}
            />
          </button>

        </div>

      </div>

    </div>
  )
}