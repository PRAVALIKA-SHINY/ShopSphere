import React, {
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  useNavigate,
} from 'react-router-dom'

import {
  ArrowLeft,
  ShieldCheck,
  Truck,
  WalletCards,
} from 'lucide-react'

import Price from '../components/Price'
import { orderApi } from '../api/orderApi'
import { customerApi } from '../api/customerApi'
import { useCart } from '../context/CartContext'
import api from '../api/axios'

export default function Checkout() {

  const navigate = useNavigate()

  const {
    cartItems,
    refreshCart,
  } = useCart()

  const items =
    Array.isArray(cartItems)
      ? cartItems
      : []

  const [form, setForm] =
    useState({
      shippingAddress: '',
      shippingCity: '',
      shippingState: '',
      shippingPincode: '',
      shippingMobile: '',
      paymentMethod: 'CARD',
      paymentReference: '',
      cardNumber: '',
      cardExpiry: '',
      cardCvv: '',
    })

  const [error, setError] =
    useState('')

  const [loading, setLoading] =
    useState(false)

  const backendBaseUrl =
    (
      api?.defaults?.baseURL ||
      'http://localhost:8086/api'
    ).replace(
      /\/api\/?$/,
      ''
    )

  // Convert backend image paths into usable browser URLs.
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
      /^(https?:|data:|blob:)/i.test(
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

  // Load the customer's saved address.
  useEffect(() => {

    let active = true

    customerApi
      .getProfile()
      .then((response) => {

        if (!active) {
          return
        }

        const profile =
          response?.data?.data ||
          {}

        setForm((current) => ({
          ...current,

          shippingAddress:
            profile.address ||
            '',

          shippingCity:
            profile.city ||
            '',

          shippingState:
            profile.state ||
            '',

          shippingPincode:
            profile.pincode ||
            '',

          shippingMobile:
            profile.mobile ||
            '',
        }))
      })
      .catch((requestError) => {

        console.warn(
          'Could not load customer profile:',
          requestError
        )
      })

    return () => {
      active = false
    }

  }, [])

  // Calculate the discounted product price.
  const effective = (
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

  // Calculate subtotal.
  const subtotal =
    useMemo(() => {

      return items.reduce(
        (
          sum,
          item
        ) => {

          return (
            sum +
            effective(
              item.product
            ) *
            Number(
              item.quantity || 0
            )
          )
        },
        0
      )

    }, [items])

  // Free shipping above ₹999.
  const shipping =
    subtotal >= 999 ||
    subtotal === 0
      ? 0
      : 79

  const total =
    subtotal +
    shipping

  // Update a checkout field.
  const updateForm = (
    field,
    value
  ) => {

    setForm(
      (current) => ({
        ...current,
        [field]: value,
      })
    )
  }

  // Extract the most useful backend error message.
  const getErrorMessage = (
    requestError
  ) => {

    const responseData =
      requestError?.response?.data

    if (
      typeof responseData === 'string' &&
      responseData.trim()
    ) {
      return responseData
    }

    if (
      responseData?.message
    ) {
      return responseData.message
    }

    if (
      responseData?.error
    ) {
      return responseData.error
    }

    if (
      responseData?.errors &&
      typeof responseData.errors === 'object'
    ) {

      const firstError =
        Object.values(
          responseData.errors
        )[0]

      if (firstError) {
        return String(firstError)
      }
    }

    if (
      requestError?.message
    ) {
      return requestError.message
    }

    return 'Could not place order. Please try again.'
  }

  // Submit the order.
  const submit = async (
    event
  ) => {

    event.preventDefault()

    setError('')

    // Make sure the cart is not empty.
    if (!items.length) {

      setError(
        'Your bag is empty.'
      )

      return
    }

    // Validate address fields.
    if (
      !form.shippingAddress.trim()
    ) {

      setError(
        'Please enter your street address.'
      )

      return
    }

    if (
      !form.shippingCity.trim()
    ) {

      setError(
        'Please enter your city.'
      )

      return
    }

    if (
      !form.shippingState.trim()
    ) {

      setError(
        'Please enter your state.'
      )

      return
    }

    if (
      form.shippingPincode.length !== 6
    ) {

      setError(
        'Please enter a valid 6-digit pincode.'
      )

      return
    }

    if (
      form.shippingMobile.length !== 10
    ) {

      setError(
        'Please enter a valid 10-digit mobile number.'
      )

      return
    }

    // Validate payment information.
    if (
      form.paymentMethod === 'CARD'
    ) {

      if (
        !form.cardNumber.trim()
      ) {

        setError(
          'Please enter the mock card number.'
        )

        return
      }

      if (
        !form.cardExpiry.trim()
      ) {

        setError(
          'Please enter the card expiry.'
        )

        return
      }

      if (
        !form.cardCvv.trim()
      ) {

        setError(
          'Please enter the card CVV.'
        )

        return
      }
    }

    if (
      form.paymentMethod === 'UPI' &&
      !form.paymentReference.trim()
    ) {

      setError(
        'Please enter a mock UPI ID.'
      )

      return
    }

    if (
      form.paymentMethod === 'NETBANKING' &&
      !form.paymentReference.trim()
    ) {

      setError(
        'Please select a mock bank.'
      )

      return
    }

    setLoading(true)

    try {

      // Build the exact payload expected by PlaceOrderRequest.
      const payload = {

        shippingAddress:
          form.shippingAddress.trim(),

        shippingCity:
          form.shippingCity.trim(),

        shippingState:
          form.shippingState.trim(),

        shippingPincode:
          form.shippingPincode.trim(),

        shippingMobile:
          form.shippingMobile.trim(),

        paymentMethod:
          form.paymentMethod,

        paymentReference:
          form.paymentMethod === 'COD'
            ? ''
            : form.paymentMethod === 'CARD'
              ? form.cardNumber.trim()
              : form.paymentReference.trim(),

        cardNumber:
          form.cardNumber.trim(),

        cardExpiry:
          form.cardExpiry.trim(),

        cardCvv:
          form.cardCvv.trim(),
      }

      console.log(
        'PLACING ORDER:',
        payload
      )

      const response =
        await orderApi.create(
          payload
        )

      console.log(
        'ORDER RESPONSE:',
        response
      )

      const order =
        response?.data?.data

      // If the backend returns no order because
      // serialization failed, show a useful message
      // instead of navigating with undefined data.
      if (!order) {

        throw new Error(
          'Order was created but the server did not return the order details.'
        )
      }

      // Refresh the cart after successful order.
      await refreshCart()
        .catch((refreshError) => {

          console.warn(
            'Could not refresh cart after order:',
            refreshError
          )
        })

      // Navigate to success page.
      navigate(
        '/order-success',
        {
          replace: true,
          state: {
            order,
          },
        }
      )

    } catch (
      requestError
    ) {

      console.error(
        'PLACE ORDER ERROR:',
        requestError
      )

      console.error(
        'PLACE ORDER RESPONSE:',
        requestError?.response?.data
      )

      setError(
        getErrorMessage(
          requestError
        )
      )

    } finally {

      setLoading(false)
    }
  }

  // Empty-cart screen.
  if (!items.length) {

    return (
      <div className="max-w-xl mx-auto px-6 py-16 text-center">

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

        <p className="text-xl font-display">
          Your bag is empty.
        </p>

        <button
          type="button"
          onClick={() =>
            navigate('/shop')
          }
          className="text-brand-700 font-semibold mt-3 inline-block"
        >
          Continue shopping
        </button>

      </div>
    )
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8">

      <div className="mb-7">

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

          Back to bag

        </button>

        <span className="eyebrow block">
          Checkout
        </span>

        <h1 className="text-3xl font-display font-semibold mt-1">
          Complete your order
        </h1>

        <p className="text-xs text-slate-400 mt-2">
          This is a mock payment flow. No real payment is processed or charged.
        </p>

      </div>

      {error && (

        <div className="rounded-xl bg-rose-50 border border-rose-100 text-red-600 px-4 py-3 text-sm mb-5">

          {error}

        </div>

      )}

      <form
        onSubmit={submit}
        className="grid lg:grid-cols-[1fr_390px] gap-6"
      >

        <div className="space-y-5">

          <section className="dashboard-card p-6">

            <div className="flex items-center gap-3 mb-5">

              <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">

                <Truck
                  size={18}
                />

              </div>

              <div>

                <h2 className="font-semibold">
                  Delivery address
                </h2>

                <p className="text-xs text-slate-400">
                  Where should we send your order?
                </p>

              </div>

            </div>

            <div className="grid sm:grid-cols-2 gap-4">

              <input
                required
                className="input-field sm:col-span-2"
                placeholder="Street address"
                value={
                  form.shippingAddress
                }
                onChange={(event) =>
                  updateForm(
                    'shippingAddress',
                    event.target.value
                  )
                }
              />

              <input
                required
                className="input-field"
                placeholder="City"
                value={
                  form.shippingCity
                }
                onChange={(event) =>
                  updateForm(
                    'shippingCity',
                    event.target.value
                  )
                }
              />

              <input
                required
                className="input-field"
                placeholder="State"
                value={
                  form.shippingState
                }
                onChange={(event) =>
                  updateForm(
                    'shippingState',
                    event.target.value
                  )
                }
              />

              <input
                required
                className="input-field"
                inputMode="numeric"
                maxLength={6}
                placeholder="Pincode"
                value={
                  form.shippingPincode
                }
                onChange={(event) =>
                  updateForm(
                    'shippingPincode',
                    event.target.value
                      .replace(/\D/g, '')
                      .slice(0, 6)
                  )
                }
              />

              <input
                required
                className="input-field"
                inputMode="numeric"
                maxLength={10}
                placeholder="Mobile number"
                value={
                  form.shippingMobile
                }
                onChange={(event) =>
                  updateForm(
                    'shippingMobile',
                    event.target.value
                      .replace(/\D/g, '')
                      .slice(0, 10)
                  )
                }
              />

            </div>

          </section>

          <section className="dashboard-card p-6">

            <div className="flex items-center gap-3 mb-5">

              <div className="w-9 h-9 rounded-xl bg-mint-50 text-mint-500 flex items-center justify-center">

                <WalletCards
                  size={18}
                />

              </div>

              <div>

                <h2 className="font-semibold">
                  Payment method
                </h2>

                <p className="text-xs text-slate-400">
                  Choose a simulated payment option.
                </p>

              </div>

            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">

              {[
                'CARD',
                'UPI',
                'NETBANKING',
                'COD',
              ].map(
                (method) => (

                  <button
                    type="button"
                    key={method}
                    onClick={() =>
                      updateForm(
                        'paymentMethod',
                        method
                      )
                    }
                    className={`rounded-xl border px-3 py-3 text-xs font-semibold ${
                      form.paymentMethod === method
                        ? 'bg-brand-50 border-brand-300 text-brand-700'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >

                    {method.replace(
                      '_',
                      ' '
                    )}

                  </button>

                )
              )}

            </div>

            {form.paymentMethod === 'CARD' && (

              <div className="grid sm:grid-cols-2 gap-4 mt-5">

                <input
                  required
                  className="input-field sm:col-span-2"
                  placeholder="Mock card number"
                  value={
                    form.cardNumber
                  }
                  onChange={(event) =>
                    updateForm(
                      'cardNumber',
                      event.target.value
                    )
                  }
                />

                <input
                  required
                  className="input-field"
                  placeholder="MM/YY"
                  value={
                    form.cardExpiry
                  }
                  onChange={(event) =>
                    updateForm(
                      'cardExpiry',
                      event.target.value
                    )
                  }
                />

                <input
                  required
                  className="input-field"
                  placeholder="CVV"
                  value={
                    form.cardCvv
                  }
                  onChange={(event) =>
                    updateForm(
                      'cardCvv',
                      event.target.value
                    )
                  }
                />

                <p className="sm:col-span-2 text-xs text-slate-400">
                  Use any mock card details. A number ending in 0000 intentionally fails.
                </p>

              </div>

            )}

            {form.paymentMethod === 'UPI' && (

              <div className="mt-5">

                <input
                  required
                  className="input-field w-full"
                  placeholder="Mock UPI ID, e.g. demo@upi"
                  value={
                    form.paymentReference
                  }
                  onChange={(event) =>
                    updateForm(
                      'paymentReference',
                      event.target.value
                    )
                  }
                />

              </div>

            )}

            {form.paymentMethod === 'NETBANKING' && (

              <div className="mt-5">

                <select
                  required
                  className="input-field w-full"
                  value={
                    form.paymentReference
                  }
                  onChange={(event) =>
                    updateForm(
                      'paymentReference',
                      event.target.value
                    )
                  }
                >

                  <option value="">
                    Select a mock bank
                  </option>

                  <option value="HDFC">
                    HDFC Bank
                  </option>

                  <option value="ICICI">
                    ICICI Bank
                  </option>

                  <option value="SBI">
                    State Bank of India
                  </option>

                  <option value="AXIS">
                    Axis Bank
                  </option>

                </select>

              </div>

            )}

            {form.paymentMethod === 'COD' && (

              <div className="mt-5 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-500">

                Cash on delivery selected. You will pay when the order is delivered.

              </div>

            )}

          </section>

        </div>

        <aside className="dashboard-card p-6 h-fit lg:sticky lg:top-28">

          <h2 className="font-display text-xl font-semibold">
            Order summary
          </h2>

          <div className="mt-5 space-y-3">

            {items.map(
              (item) => (

                <div
                  key={item.id}
                  className="flex gap-3"
                >

                  <img
                    src={getImageUrl(
                      item.product?.images?.[0]
                    )}
                    alt={
                      item.product?.name ||
                      'Product'
                    }
                    className="w-14 h-16 rounded-lg object-cover bg-slate-50"
                  />

                  <div className="min-w-0 flex-1">

                    <p className="text-sm font-semibold truncate">

                      {
                        item.product?.name ||
                        'Product'
                      }

                    </p>

                    <p className="text-xs text-slate-400 mt-1">

                      Qty {item.quantity}

                    </p>

                  </div>

                  <p className="text-sm font-semibold">

                    <Price
                      value={
                        effective(
                          item.product
                        ) *
                        Number(
                          item.quantity || 0
                        )
                      }
                    />

                  </p>

                </div>

              )
            )}

          </div>

          <div className="border-t border-slate-100 mt-5 pt-4 space-y-2 text-sm">

            <div className="flex justify-between text-slate-500">

              <span>
                Subtotal
              </span>

              <Price
                value={subtotal}
              />

            </div>

            <div className="flex justify-between text-slate-500">

              <span>
                Shipping
              </span>

              {shipping === 0
                ? 'Free'
                : (
                  <Price
                    value={shipping}
                  />
                )}

            </div>

            <div className="flex justify-between text-lg font-bold border-t border-slate-100 pt-3 mt-3">

              <span>
                Total
              </span>

              <Price
                value={total}
              />

            </div>

          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full mt-6 h-12 disabled:opacity-60"
          >

            {loading
              ? 'Placing order…'
              : 'Place order'}

          </button>

          <div className="flex gap-2 items-start text-xs text-slate-400 mt-4">

            <ShieldCheck
              size={15}
              className="text-mint-500 shrink-0"
            />

            Mock payment only. No real card or bank transaction is made.

          </div>

        </aside>

      </form>

    </div>
  )
}

