import React, { useEffect, useState } from 'react'
import {
  Users,
  UserCog,
  Package,
  ShoppingBag,
  CreditCard,
  Banknote,
  Clock3,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Layers3,
  Tags,
  TrendingUp,
  RefreshCw,
} from 'lucide-react'

import dashboardApi from '../../api/dashboardApi'
import Price from '../../components/Price'
import Loader from '../../components/Loader'

export default function AdminOverview() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadDashboard = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await dashboardApi.admin()

      console.log('ADMIN DASHBOARD RESPONSE:', response)

      const responseData =
        response?.data?.data ||
        response?.data ||
        {}

      setData(responseData)
    } catch (err) {
      console.error('ADMIN DASHBOARD ERROR:', err)

      setError(
        err?.response?.data?.message ||
        'Unable to load admin dashboard.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboard()
  }, [])

  if (loading) {
    return (
      <div className="min-h-[500px] flex items-center justify-center">
        <Loader label="Loading admin dashboard..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto py-16 px-6">
        <div className="rounded-2xl border border-rose-100 bg-rose-50 p-6">
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center text-rose-500">
              <XCircle size={22} />
            </div>

            <div className="flex-1">
              <h2 className="text-lg font-semibold text-slate-800">
                Dashboard could not be loaded
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                {error}
              </p>

              <button
                onClick={loadDashboard}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-700"
              >
                <RefreshCw size={16} />
                Try again
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const totalCustomers = data?.totalCustomers ?? 0
  const totalEmployees = data?.totalEmployees ?? 0
  const totalProducts = data?.totalProducts ?? 0
  const activeProducts = data?.activeProducts ?? 0
  const inactiveProducts = data?.inactiveProducts ?? 0
  const lowStockProducts = data?.lowStockProducts ?? 0

  const totalOrders = data?.totalOrders ?? 0
  const placedOrders = data?.placedOrders ?? 0
  const pendingOrders = data?.pendingOrders ?? 0
  const completedOrders = data?.completedOrders ?? 0
  const deliveredOrders = data?.deliveredOrders ?? 0
  const cancelledOrders = data?.cancelledOrders ?? 0

  const paidOrders = data?.paidOrders ?? 0
  const codOrders = data?.codOrders ?? 0
  const pendingPayments = data?.pendingPayments ?? 0
  const failedPayments = data?.failedPayments ?? 0

  const totalCategories = data?.totalCategories ?? 0
  const totalBrands = data?.totalBrands ?? 0

  const totalRevenue = data?.totalRevenue ?? 0

  const recentOrders = Array.isArray(data?.recentOrders)
    ? data.recentOrders
    : []

  return (
    <div className="space-y-8">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">

        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-sky-500 font-semibold">
            ShopSphere Control Room
          </p>

          <h1 className="text-3xl md:text-4xl font-display font-semibold text-slate-800 mt-2">
            Admin Overview
          </h1>

          <p className="text-sm text-slate-500 mt-2">
            Monitor your store, catalogue, orders and payments from one place.
          </p>
        </div>

        <button
          onClick={loadDashboard}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
        >
          <RefreshCw size={16} />
          Refresh
        </button>

      </div>


      {/* =====================================================
          TOP STAT CARDS
      ===================================================== */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

        <StatCard
          icon={<Users size={21} />}
          label="Customers"
          value={totalCustomers}
          description="Registered customers"
          iconClass="bg-sky-50 text-sky-600"
        />

        <StatCard
          icon={<UserCog size={21} />}
          label="Employees"
          value={totalEmployees}
          description="Active store staff"
          iconClass="bg-rose-50 text-rose-500"
        />

        <StatCard
          icon={<Package size={21} />}
          label="Products"
          value={totalProducts}
          description={`${activeProducts} active products`}
          iconClass="bg-emerald-50 text-emerald-600"
        />

        <StatCard
          icon={<ShoppingBag size={21} />}
          label="Orders"
          value={totalOrders}
          description={`${completedOrders} completed`}
          iconClass="bg-amber-50 text-amber-600"
        />

      </div>


      {/* =====================================================
          REVENUE
      ===================================================== */}

      <div className="rounded-3xl bg-white border border-slate-100 shadow-sm p-6 md:p-7">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

          <div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <TrendingUp size={20} />
              </div>

              <div>
                <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                  Store Revenue
                </p>

                <h2 className="text-3xl font-semibold text-slate-800 mt-1">
                  <Price value={totalRevenue} />
                </h2>
              </div>
            </div>
          </div>

          <div className="flex gap-3 flex-wrap">

            <SmallStat
              label="Paid"
              value={paidOrders}
              icon={<CreditCard size={15} />}
            />

            <SmallStat
              label="COD"
              value={codOrders}
              icon={<Banknote size={15} />}
            />

            <SmallStat
              label="Pending"
              value={pendingPayments}
              icon={<Clock3 size={15} />}
            />

          </div>

        </div>

      </div>


      {/* =====================================================
          ORDER + CATALOGUE OVERVIEW
      ===================================================== */}

      <div className="grid lg:grid-cols-2 gap-6">

        {/* ORDERS */}

        <DashboardSection
          title="Order Overview"
          description="Current order activity"
        >

          <div className="grid grid-cols-2 gap-4">

            <Metric
              label="Placed"
              value={placedOrders}
              icon={<ShoppingBag size={18} />}
              className="bg-sky-50 text-sky-600"
            />

            <Metric
              label="Pending"
              value={pendingOrders}
              icon={<Clock3 size={18} />}
              className="bg-amber-50 text-amber-600"
            />

            <Metric
              label="Delivered"
              value={deliveredOrders}
              icon={<CheckCircle2 size={18} />}
              className="bg-emerald-50 text-emerald-600"
            />

            <Metric
              label="Cancelled"
              value={cancelledOrders}
              icon={<XCircle size={18} />}
              className="bg-rose-50 text-rose-500"
            />

          </div>

        </DashboardSection>


        {/* CATALOGUE */}

        <DashboardSection
          title="Catalogue Overview"
          description="Product and inventory health"
        >

          <div className="grid grid-cols-2 gap-4">

            <Metric
              label="Active"
              value={activeProducts}
              icon={<Package size={18} />}
              className="bg-emerald-50 text-emerald-600"
            />

            <Metric
              label="Inactive"
              value={inactiveProducts}
              icon={<Package size={18} />}
              className="bg-slate-100 text-slate-500"
            />

            <Metric
              label="Low Stock"
              value={lowStockProducts}
              icon={<AlertTriangle size={18} />}
              className="bg-amber-50 text-amber-600"
            />

            <Metric
              label="Categories"
              value={totalCategories}
              icon={<Layers3 size={18} />}
              className="bg-sky-50 text-sky-600"
            />

          </div>

        </DashboardSection>

      </div>


      {/* =====================================================
          PAYMENT OVERVIEW
      ===================================================== */}

      <DashboardSection
        title="Payment Overview"
        description="How customers are paying"
      >

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

          <PaymentCard
            title="Paid Orders"
            value={paidOrders}
            icon={<CreditCard size={20} />}
            className="bg-emerald-50 text-emerald-600"
          />

          <PaymentCard
            title="Cash on Delivery"
            value={codOrders}
            icon={<Banknote size={20} />}
            className="bg-sky-50 text-sky-600"
          />

          <PaymentCard
            title="Pending Payments"
            value={pendingPayments}
            icon={<Clock3 size={20} />}
            className="bg-amber-50 text-amber-600"
          />

          <PaymentCard
            title="Failed Payments"
            value={failedPayments}
            icon={<XCircle size={20} />}
            className="bg-rose-50 text-rose-500"
          />

        </div>

      </DashboardSection>


      {/* =====================================================
          STORE STRUCTURE
      ===================================================== */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        <StatCard
          icon={<Layers3 size={21} />}
          label="Categories"
          value={totalCategories}
          description="Product categories"
          iconClass="bg-sky-50 text-sky-600"
        />

        <StatCard
          icon={<Tags size={21} />}
          label="Brands"
          value={totalBrands}
          description="Available brands"
          iconClass="bg-rose-50 text-rose-500"
        />

        <StatCard
          icon={<AlertTriangle size={21} />}
          label="Low Stock"
          value={lowStockProducts}
          description="Products need attention"
          iconClass="bg-amber-50 text-amber-600"
        />

      </div>


      {/* =====================================================
          RECENT ORDERS
      ===================================================== */}

      <DashboardSection
        title="Recent Orders"
        description="Latest orders placed in your store"
      >

        {recentOrders.length === 0 ? (

          <div className="py-12 text-center">

            <ShoppingBag
              size={34}
              className="mx-auto text-slate-300"
            />

            <p className="font-medium text-slate-600 mt-3">
              No recent orders
            </p>

            <p className="text-sm text-slate-400 mt-1">
              New customer orders will appear here.
            </p>

          </div>

        ) : (

          <div className="space-y-3">

            {recentOrders.map((order, index) => {

              const orderNumber =
                order?.orderNumber ||
                `Order #${order?.id || index + 1}`

              const customerName =
                order?.customer?.name ||
                order?.customer?.email ||
                'Customer'

              return (
                <div
                  key={order?.id || index}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50/50 p-4"
                >

                  <div className="flex items-center gap-3">

                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-sky-600">
                      <ShoppingBag size={18} />
                    </div>

                    <div>

                      <p className="font-semibold text-sm text-slate-700">
                        {orderNumber}
                      </p>

                      <p className="text-xs text-slate-400 mt-1">
                        {customerName}
                      </p>

                    </div>

                  </div>


                  <div className="flex items-center gap-4">

                    <div className="text-right">

                      <p className="text-sm font-semibold text-slate-700">
                        <Price value={order?.totalAmount || 0} />
                      </p>

                      <p className="text-xs text-slate-400 mt-1">
                        {order?.paymentMethod || 'Payment'}
                      </p>

                    </div>

                    <StatusBadge status={order?.status} />

                  </div>

                </div>
              )
            })}

          </div>

        )}

      </DashboardSection>

    </div>
  )
}


/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  icon,
  label,
  value,
  description,
  iconClass,
}) {
  return (
    <div className="rounded-3xl bg-white border border-slate-100 shadow-sm p-5">

      <div className="flex items-start justify-between gap-4">

        <div>
          <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
            {label}
          </p>

          <p className="text-3xl font-semibold text-slate-800 mt-2">
            {value}
          </p>

          <p className="text-xs text-slate-400 mt-2">
            {description}
          </p>
        </div>

        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center ${iconClass}`}
        >
          {icon}
        </div>

      </div>

    </div>
  )
}


/* =========================================================
   SMALL STAT
========================================================= */

function SmallStat({
  label,
  value,
  icon,
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 min-w-[100px]">

      <div className="flex items-center gap-2 text-slate-400">
        {icon}

        <span className="text-xs font-medium">
          {label}
        </span>
      </div>

      <p className="text-lg font-semibold text-slate-700 mt-1">
        {value}
      </p>

    </div>
  )
}


/* =========================================================
   DASHBOARD SECTION
========================================================= */

function DashboardSection({
  title,
  description,
  children,
}) {
  return (
    <section className="rounded-3xl bg-white border border-slate-100 shadow-sm p-6">

      <div className="mb-5">

        <h2 className="text-lg font-semibold text-slate-800">
          {title}
        </h2>

        <p className="text-sm text-slate-400 mt-1">
          {description}
        </p>

      </div>

      {children}

    </section>
  )
}


/* =========================================================
   METRIC
========================================================= */

function Metric({
  label,
  value,
  icon,
  className,
}) {
  return (
    <div className="rounded-2xl border border-slate-100 p-4">

      <div className="flex items-center justify-between">

        <div
          className={`w-9 h-9 rounded-lg flex items-center justify-center ${className}`}
        >
          {icon}
        </div>

        <p className="text-2xl font-semibold text-slate-700">
          {value}
        </p>

      </div>

      <p className="text-sm text-slate-500 mt-3">
        {label}
      </p>

    </div>
  )
}


/* =========================================================
   PAYMENT CARD
========================================================= */

function PaymentCard({
  title,
  value,
  icon,
  className,
}) {
  return (
    <div className="rounded-2xl border border-slate-100 p-5">

      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center ${className}`}
      >
        {icon}
      </div>

      <p className="text-2xl font-semibold text-slate-700 mt-4">
        {value}
      </p>

      <p className="text-sm text-slate-500 mt-1">
        {title}
      </p>

    </div>
  )
}


/* =========================================================
   STATUS BADGE
========================================================= */

function StatusBadge({
  status,
}) {
  const normalized =
    String(status || '')
      .toUpperCase()

  let classes =
    'bg-slate-100 text-slate-500'

  if (
    normalized === 'DELIVERED' ||
    normalized === 'COMPLETED'
  ) {
    classes =
      'bg-emerald-50 text-emerald-600'
  } else if (
    normalized === 'CANCELLED' ||
    normalized === 'FAILED'
  ) {
    classes =
      'bg-rose-50 text-rose-500'
  } else if (
    normalized === 'PLACED' ||
    normalized === 'CONFIRMED' ||
    normalized === 'PROCESSING'
  ) {
    classes =
      'bg-sky-50 text-sky-600'
  }

  return (
    <span
      className={`px-3 py-1.5 rounded-full text-[11px] font-semibold ${classes}`}
    >
      {status || 'UNKNOWN'}
    </span>
  )
}