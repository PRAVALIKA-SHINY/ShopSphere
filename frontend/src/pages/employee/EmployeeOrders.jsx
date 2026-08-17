import React, { useEffect, useState } from 'react'
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

export default function EmployeeOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('ALL')
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true)

    try {
      const response =
        await orderApi.getAllAdmin(0, 100)

      setOrders(
        response.data.data.content || []
      )
    } catch (error) {
      setError(
        error.response?.data?.message ||
          'Could not load orders'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const update = async (
    id,
    status
  ) => {
    try {
      await orderApi.updateStatus(
        id,
        status
      )

      await load()
    } catch (error) {
      setError(
        error.response?.data?.message ||
          'Invalid order status change'
      )
    }
  }

  if (loading) {
    return (
      <Loader label="Loading orders…" />
    )
  }

  const shown = orders.filter(
    (order) => {
      const matchesStatus =
        filter === 'ALL' ||
        order.status === filter

      const searchText = `
        ${order.orderNumber || ''}
        ${order.customer?.name || ''}
        ${order.paymentMethod || ''}
      `.toLowerCase()

      const matchesSearch =
        searchText.includes(
          query.toLowerCase()
        )

      return (
        matchesStatus &&
        matchesSearch
      )
    }
  )

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <span className="eyebrow">
          Operations
        </span>

        <h1 className="text-3xl font-display font-semibold mt-1">
          Orders
        </h1>

        <p className="text-sm text-slate-500 mt-2">
          Review customer orders and move them through the fulfilment flow.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl bg-rose-50 border border-rose-100 text-red-600 px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="dashboard-card p-4 flex flex-col sm:flex-row gap-3">

        <div className="flex items-center gap-3 flex-1 border border-slate-200 rounded-xl px-3">
          <Search
            size={17}
            className="text-slate-400"
          />

          <input
            value={query}
            onChange={(event) =>
              setQuery(event.target.value)
            }
            className="w-full py-2.5 outline-none text-sm bg-transparent"
            placeholder="Search order number or customer"
          />
        </div>

        <select
          value={filter}
          onChange={(event) =>
            setFilter(event.target.value)
          }
          className="input-field sm:w-52 !py-2.5"
        >
          <option value="ALL">
            All statuses
          </option>

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

      {/* Empty */}
      {shown.length === 0 ? (
        <div className="dashboard-card py-16 text-center">

          <ShoppingCart
            size={34}
            className="mx-auto text-slate-300"
          />

          <p className="font-semibold mt-3">
            No orders found
          </p>

          <p className="text-sm text-slate-400 mt-1">
            Try changing the search or status filter.
          </p>

        </div>
      ) : (
        <div className="space-y-4">

          {shown.map((order) => (
            <div
              key={order.id}
              className="dashboard-card p-5"
            >

              {/* Top */}
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">

                <div>
                  <div className="flex flex-wrap items-center gap-2">

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
                      'Customer'}

                    {' • '}

                    {order.customer?.email ||
                      ''}

                    {' • '}

                    {order.createdAt
                      ? new Date(
                          order.createdAt
                        ).toLocaleString()
                      : ''}
                  </p>
                </div>

                <div className="text-left lg:text-right">
                  <p className="font-bold">
                    <Price
                      value={
                        order.totalAmount
                      }
                    />
                  </p>

                  <p className="text-xs text-slate-400">
                    {order.items?.length ||
                      0}{' '}
                    line items
                  </p>
                </div>

              </div>

              {/* Bottom */}
              <div className="mt-4 border-t border-slate-100 pt-4 flex flex-col md:flex-row md:items-center gap-3">

                <div className="flex-1 space-y-1">

                  {(order.items || [])
                    .slice(0, 3)
                    .map((item) => (
                      <p
                        key={item.id}
                        className="text-sm text-slate-600"
                      >
                        {item.productName ||
                          item.product?.name ||
                          'Product'}{' '}
                        × {item.quantity}
                      </p>
                    ))}

                </div>

                <div className="flex items-center gap-2">

                  <span className="text-xs text-slate-400">
                    Update status
                  </span>

                  <select
                    value={order.status}
                    onChange={(event) =>
                      update(
                        order.id,
                        event.target.value
                      )
                    }
                    className="input-field !w-auto !py-2 text-sm"
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
            </div>
          ))}

        </div>
      )}
    </div>
  )
}