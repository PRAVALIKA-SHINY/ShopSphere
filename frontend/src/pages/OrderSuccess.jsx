import React from 'react'
import { Link, useLocation } from 'react-router-dom'

import {
  CheckCircle2,
  Package,
  ShoppingBag,
} from 'lucide-react'

import Price from '../components/Price'

export default function OrderSuccess() {
  const location = useLocation()

  const order =
    location.state?.order || null

  const orderNumber =
    order?.orderNumber ||
    order?.orderCode ||
    order?.id ||
    'Your order'

  const total =
    order?.totalAmount ??
    order?.total ??
    0

  const paymentMethod =
    order?.paymentMethod ||
    order?.paymentType ||
    null

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">

      <div className="dashboard-card p-8 sm:p-12 text-center">

        {/* SUCCESS ICON */}

        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle2
            size={34}
          />
        </div>

        {/* TITLE */}

        <p className="eyebrow mt-6">
          Order confirmed
        </p>

        <h1 className="text-3xl font-display font-semibold text-slate-800 mt-2">
          Thank you for your order!
        </h1>

        <p className="text-sm text-slate-500 mt-3 leading-6">
          Your order has been successfully placed.
          We've saved your order details for you.
        </p>

        {/* ORDER INFORMATION */}

        <div className="bg-slate-50 rounded-2xl p-5 mt-7 text-left">

          {/* ORDER NUMBER */}

          <div className="flex items-center gap-3">

            <Package
              size={20}
              className="text-brand-600"
            />

            <div>

              <p className="text-xs text-slate-400">
                Order number
              </p>

              <p className="font-semibold text-slate-800">
                #{orderNumber}
              </p>

            </div>

          </div>

          {/* TOTAL */}

          {Number(total) > 0 && (
            <div className="flex justify-between mt-5 pt-4 border-t border-slate-200">

              <span className="text-sm text-slate-500">
                Total
              </span>

              <span className="font-bold text-slate-800">
                <Price
                  value={total}
                />
              </span>

            </div>
          )}

          {/* PAYMENT METHOD */}

          {paymentMethod && (
            <div className="flex justify-between mt-3">

              <span className="text-sm text-slate-500">
                Payment method
              </span>

              <span className="text-sm font-semibold text-slate-700 uppercase">
                {String(
                  paymentMethod
                )
                  .replace(
                    /_/g,
                    ' '
                  )}
              </span>

            </div>
          )}

        </div>

        {/* BUTTONS */}

        <div className="flex flex-col sm:flex-row gap-3 mt-8">

          {/* FIXED ORDERS LINK */}

          <Link
            to="/profile/orders"
            className="btn-primary flex-1 justify-center"
          >
            View my orders
          </Link>

          {/* CONTINUE SHOPPING */}

          <Link
            to="/shop"
            className="flex-1 h-11 rounded-xl border border-slate-200 text-slate-700 font-semibold flex items-center justify-center gap-2 hover:bg-slate-50 transition"
          >

            <ShoppingBag
              size={17}
            />

            Continue shopping

          </Link>

        </div>

      </div>

    </div>
  )
}