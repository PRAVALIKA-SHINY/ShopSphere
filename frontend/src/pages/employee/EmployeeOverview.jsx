import React, { useEffect, useState } from 'react'
import {
  Package,
  ShoppingCart,
  CreditCard,
  Truck,
  Boxes,
  AlertTriangle,
  IndianRupee,
  Clock3,
} from 'lucide-react'

import { dashboardApi } from '../../api/dashboardApi'
import Loader from '../../components/Loader'
import Price from '../../components/Price'

export default function EmployeeOverview() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true

    const loadDashboard = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await dashboardApi.employee()

        if (!mounted) return

        const dashboardData =
          response?.data?.data ?? response?.data ?? null

        setStats(dashboardData)
      } catch (error) {
        console.error(
          'Could not load employee dashboard:',
          error
        )

        if (!mounted) return

        setStats(null)
        setError(
          error?.response?.data?.message ||
            'Unable to load the employee dashboard.'
        )
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    loadDashboard()

    return () => {
      mounted = false
    }
  }, [])

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return <Loader label="Loading store overview…" />
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <span className="eyebrow">
            Overview
          </span>

          <h1 className="text-3xl sm:text-4xl font-display font-semibold mt-1">
            Employee Dashboard
          </h1>

          <p className="text-sm text-slate-500 mt-2">
            Here is a quick view of what is happening
            across ShopSphere today.
          </p>
        </div>

        <div className="dashboard-card p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
              <AlertTriangle size={20} />
            </div>

            <div>
              <h2 className="font-semibold text-slate-800">
                Unable to load dashboard
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                {error}
              </p>

              <button
                type="button"
                onClick={() => window.location.reload()}
                className="btn-primary mt-4"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // =========================================================
  // STATISTICS
  // =========================================================

  const cards = [
    {
      label: 'Total products',
      value:
        stats?.totalProducts ??
        stats?.myProducts ??
        0,
      icon: Package,
      tone: 'brand',
    },

    {
      label: 'Total orders',
      value: stats?.totalOrders ?? 0,
      icon: ShoppingCart,
      tone: 'sky',
    },

    {
      label: 'Paid orders',
      value: stats?.paidOrders ?? 0,
      icon: CreditCard,
      tone: 'mint',
    },

    {
      label: 'Cash on delivery',
      value: stats?.codOrders ?? 0,
      icon: Truck,
      tone: 'rose',
    },

    {
      label: 'Pending payments',
      value: stats?.pendingPayments ?? 0,
      icon: Clock3,
      tone: 'peach',
    },

    {
      label: 'Low stock',
      value: stats?.lowStockProducts ?? 0,
      icon: AlertTriangle,
      tone: 'rose',
    },
  ]

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="space-y-7">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div>
        <span className="eyebrow">
          Overview
        </span>

        <h1 className="text-3xl sm:text-4xl font-display font-semibold mt-1">
          Good morning,{' '}
          {stats?.employeeName || 'team'}.
        </h1>

        <p className="text-sm text-slate-500 mt-2">
          Here is a quick view of what is happening
          across ShopSphere today.
        </p>
      </div>


      {/* =====================================================
          STATISTICS
      ===================================================== */}

      <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">

        {cards.map((card) => {
          const Icon = card.icon

          const iconClasses =
            card.tone === 'brand'
              ? 'bg-brand-50 text-brand-600'
              : card.tone === 'mint'
                ? 'bg-mint-50 text-mint-500'
                : card.tone === 'rose'
                  ? 'bg-rose-50 text-rose-500'
                  : card.tone === 'sky'
                    ? 'bg-sky-50 text-sky-500'
                    : 'bg-peach-50 text-peach-300'

          return (
            <div
              key={card.label}
              className="dashboard-card p-5"
            >
              <div className="flex items-center justify-between">

                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconClasses}`}
                >
                  <Icon size={19} />
                </div>

                <span className="text-[10px] uppercase tracking-wider text-slate-400">
                  Live
                </span>

              </div>

              <p className="text-2xl font-bold mt-5">
                {card.value}
              </p>

              <p className="text-sm text-slate-500 mt-1">
                {card.label}
              </p>
            </div>
          )
        })}

      </div>


      {/* =====================================================
          LOWER SECTION
      ===================================================== */}

      <div className="grid lg:grid-cols-3 gap-5">

        {/* ===================================================
            SALES SNAPSHOT
        =================================================== */}

        <div className="dashboard-card p-6 lg:col-span-2">

          <div className="flex items-center justify-between mb-5">

            <div>
              <h2 className="text-xl font-display font-semibold">
                Sales snapshot
              </h2>

              <p className="text-xs text-slate-400 mt-1">
                Payment and order health
              </p>
            </div>

            <IndianRupee
              className="text-brand-500"
              size={21}
            />

          </div>


          <div className="grid sm:grid-cols-3 gap-4">

            <Metric
              label="Paid revenue"
              value={
                <Price
                  value={
                    stats?.paidRevenue ??
                    stats?.totalRevenue ??
                    0
                  }
                />
              }
            />

            <Metric
              label="Delivered"
              value={
                stats?.deliveredOrders ?? 0
              }
            />

            <Metric
              label="Placed"
              value={
                stats?.placedOrders ?? 0
              }
            />

          </div>

        </div>


        {/* ===================================================
            STOCK WATCH
        =================================================== */}

        <div className="dashboard-card p-6">

          <div className="flex items-center gap-2 mb-4">

            <Boxes
              size={19}
              className="text-brand-600"
            />

            <h2 className="text-xl font-display font-semibold">
              Stock watch
            </h2>

          </div>


          <p className="text-3xl font-bold">
            {stats?.lowStockProducts ?? 0}
          </p>

          <p className="text-sm text-slate-500 mt-1">
            products at or below 5 units
          </p>

          <p className="text-xs text-slate-400 mt-5">
            Review low-stock items from Products
            before they sell out.
          </p>

        </div>

      </div>

    </div>
  )
}


// =============================================================
// METRIC
// =============================================================

function Metric({ label, value }) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">

      <p className="text-xs text-slate-400">
        {label}
      </p>

      <p className="text-lg font-bold mt-1">
        {value}
      </p>

    </div>
  )
}