import React, {
  useEffect,
  useState,
} from 'react'

import {
  Search,
  ShoppingCart,
} from 'lucide-react'

import { orderApi } from '../../api/orderApi'
import Price from '../../components/Price'
import Loader from '../../components/Loader'

const statuses = [
  'PLACED',
  'CONFIRMED',
  'PROCESSING',
  'SHIPPED',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
  'CANCELLED',
]

export default function AdminOrders() {
  const [orders, setOrders] =
    useState([])

  const [loading, setLoading] =
    useState(true)

  const [filter, setFilter] =
    useState('ALL')

  const [query, setQuery] =
    useState('')

  const [error, setError] =
    useState('')

  const load = () => {
    setLoading(true)

    orderApi
      .getAllAdmin(0, 100)
      .then((r) =>
        setOrders(
          r.data.data.content || []
        )
      )
      .catch((e) =>
        setError(
          e.response?.data?.message ||
            'Could not load orders'
        )
      )
      .finally(() =>
        setLoading(false)
      )
  }

  useEffect(load, [])

  const update = async (
    id,
    status
  ) => {
    try {
      await orderApi.updateStatus(
        id,
        status
      )

      load()
    } catch (e) {
      setError(
        e.response?.data?.message ||
          'Could not update order'
      )
    }
  }

  if (loading) {
    return (
      <Loader label="Loading orders…" />
    )
  }

  const shown = orders.filter(
    (order) =>
      (filter === 'ALL' ||
        order.status === filter) &&
      `${order.orderNumber} ${
        order.customer?.name || ''
      }`
        .toLowerCase()
        .includes(query.toLowerCase())
  )

  return (
    <div className="space-y-6">

      <div>

        <span className="eyebrow">
          Order management
        </span>

        <h1 className="text-3xl font-display font-semibold mt-1">
          All orders
        </h1>

        <p className="text-sm text-slate-500 mt-2">
          Monitor payment method, payment state
          and fulfilment status.
        </p>

      </div>

      {error && (
        <div className="rounded-xl bg-rose-50 text-red-600 px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <div className="dashboard-card p-4 flex flex-col sm:flex-row gap-3">

        <div className="flex items-center gap-3 flex-1 border border-slate-200 rounded-xl px-3">

          <Search
            size={17}
            className="text-slate-400"
          />

          <input
            className="w-full outline-none py-2.5 text-sm"
            value={query}
            onChange={(e) =>
              setQuery(e.target.value)
            }
            placeholder="Search order or customer"
          />

        </div>

        <select
          className="input-field sm:w-52 !py-2.5"
          value={filter}
          onChange={(e) =>
            setFilter(e.target.value)
          }
        >

          <option>ALL</option>

          {statuses.map((status) => (
            <option
              key={status}
              value={status}
            >
              {status}
            </option>
          ))}

        </select>

      </div>

      {shown.length === 0 ? (

        <div className="dashboard-card py-16 text-center">

          <ShoppingCart
            className="mx-auto text-slate-300"
            size={34}
          />

          <p className="font-semibold mt-3">
            No orders found
          </p>

        </div>

      ) : (

        <div className="space-y-4">

          {shown.map((order) => (
            <div
              key={order.id}
              className="dashboard-card p-5"
            >

              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">

                <div>

                  <div className="flex flex-wrap gap-2 items-center">

                    <p className="font-semibold">
                      {order.orderNumber}
                    </p>

                    <span
                      className={`badge-soft ${
                        order.paymentStatus ===
                        'PAID'
                          ? 'bg-mint-50 text-mint-500'
                          : order.paymentStatus ===
                            'FAILED'
                          ? 'bg-rose-50 text-red-500'
                          : 'bg-peach-50 text-slate-600'
                      }`}
                    >
                      {order.paymentStatus}
                    </span>

                    <span className="badge-soft bg-brand-50 text-brand-700">
                      {order.paymentMethod ||
                        'COD'}
                    </span>

                  </div>

                  <p className="text-xs text-slate-400 mt-1">
                    {order.customer?.name ||
                      'Customer'}{' '}
                    •{' '}
                    {new Date(
                      order.createdAt
                    ).toLocaleString()}
                  </p>

                </div>

                <div className="md:text-right">

                  <p className="font-bold">
                    <Price
                      value={
                        order.totalAmount
                      }
                    />
                  </p>

                  <p className="text-xs text-slate-400 mt-1">
                    {order.items?.length || 0}{' '}
                    items
                  </p>

                </div>

              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col md:flex-row gap-4 md:items-center">

                <div className="flex-1">

                  {(order.items || [])
                    .slice(0, 4)
                    .map((item) => (
                      <p
                        key={item.id}
                        className="text-sm text-slate-600"
                      >
                        {item.productName} ×{' '}
                        {item.quantity}
                      </p>
                    ))}

                </div>

                <select
                  value={order.status}
                  onChange={(e) =>
                    update(
                      order.id,
                      e.target.value
                    )
                  }
                  className="input-field md:w-56 !py-2.5 text-sm"
                >

                  {statuses.map(
                    (status) => (
                      <option
                        key={status}
                        value={status}
                      >
                        {status}
                      </option>
                    )
                  )}

                </select>

              </div>

            </div>
          ))}

        </div>

      )}

    </div>
  )
}