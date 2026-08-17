import React, { useEffect, useMemo, useState } from 'react'
import {
  Search,
  UserCheck,
  UserX,
  Trash2,
} from 'lucide-react'

import { adminApi } from '../../api/adminApi'
import Loader from '../../components/Loader'

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [msg, setMsg] = useState('')

  // =========================================================
  // LOAD CUSTOMERS
  // =========================================================

  const loadCustomers = async () => {
    try {
      setLoading(true)
      setMsg('')

      const response = await adminApi.customers()

      console.log('CUSTOMERS RESPONSE:', response.data)

      /*
       * Expected backend response:
       *
       * {
       *   success: true,
       *   message: "Customers fetched",
       *   data: [...]
       * }
       *
       * Some APIs may return:
       *
       * data.content
       *
       * so we support both.
       */

      const responseData = response.data?.data

      if (Array.isArray(responseData)) {
        setCustomers(responseData)
      } else if (Array.isArray(responseData?.content)) {
        setCustomers(responseData.content)
      } else {
        setCustomers([])
      }
    } catch (error) {
      console.error(
        'ADMIN CUSTOMERS ERROR:',
        error
      )

      console.error(
        'BACKEND RESPONSE:',
        error.response?.data
      )

      setCustomers([])

      setMsg(
        error.response?.data?.message ||
          'Could not load customers'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCustomers()
  }, [])

  // =========================================================
  // SEARCH
  // =========================================================

  const shownCustomers = useMemo(() => {
    const search = query.trim().toLowerCase()

    if (!search) {
      return customers
    }

    return customers.filter((customer) => {
      const name =
        customer.name?.toLowerCase() || ''

      const email =
        customer.email?.toLowerCase() || ''

      const mobile =
        customer.mobile?.toLowerCase() || ''

      return (
        name.includes(search) ||
        email.includes(search) ||
        mobile.includes(search)
      )
    })
  }, [customers, query])

  // =========================================================
  // UPDATE CUSTOMER STATUS
  // =========================================================

  const toggleStatus = async (customer) => {
    const nextStatus =
      customer.status === 'ACTIVE'
        ? 'INACTIVE'
        : 'ACTIVE'

    try {
      setMsg('')

      await adminApi.updateCustomerStatus(
        customer.id,
        nextStatus
      )

      setMsg(
        `Customer ${
          nextStatus === 'ACTIVE'
            ? 'activated'
            : 'deactivated'
        } successfully`
      )

      await loadCustomers()
    } catch (error) {
      console.error(
        'CUSTOMER STATUS ERROR:',
        error
      )

      console.error(
        'BACKEND RESPONSE:',
        error.response?.data
      )

      setMsg(
        error.response?.data?.message ||
          'Could not update customer status'
      )
    }
  }

  // =========================================================
  // DELETE / DEACTIVATE CUSTOMER
  // =========================================================

  const removeCustomer = async (customer) => {
    const confirmed = window.confirm(
      `Deactivate ${customer.name}?`
    )

    if (!confirmed) {
      return
    }

    try {
      setMsg('')

      /*
       * We use the same status endpoint because
       * your backend currently supports deactivation
       * through:
       *
       * PATCH /api/admin/customers/{id}/status
       */

      await adminApi.updateCustomerStatus(
        customer.id,
        'INACTIVE'
      )

      setMsg('Customer deactivated successfully')

      await loadCustomers()
    } catch (error) {
      console.error(
        'CUSTOMER DEACTIVATE ERROR:',
        error
      )

      console.error(
        'BACKEND RESPONSE:',
        error.response?.data
      )

      setMsg(
        error.response?.data?.message ||
          'Could not deactivate customer'
      )
    }
  }

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <Loader label="Loading customers…" />
    )
  }

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="space-y-6">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div>
        <span className="eyebrow">
          People
        </span>

        <h1 className="text-3xl font-display font-semibold mt-1">
          Customers
        </h1>

        <p className="text-sm text-slate-500 mt-2">
          View customers and manage their account
          status.
        </p>
      </div>

      {/* =====================================================
          MESSAGE
      ===================================================== */}

      {msg && (
        <div
          className="
            rounded-xl
            bg-mint-50
            border
            border-mint-100
            text-mint-500
            px-4
            py-3
            text-sm
          "
        >
          {msg}
        </div>
      )}

      {/* =====================================================
          SEARCH
      ===================================================== */}

      <div className="dashboard-card p-3 flex items-center gap-3">

        <Search
          size={18}
          className="text-slate-400 flex-shrink-0"
        />

        <input
          type="text"
          className="w-full outline-none text-sm bg-transparent"
          placeholder="Search by name, email or mobile…"
          value={query}
          onChange={(e) =>
            setQuery(e.target.value)
          }
        />

        <span className="text-xs text-slate-400 whitespace-nowrap">
          {shownCustomers.length}
        </span>

      </div>

      {/* =====================================================
          CUSTOMER LIST
      ===================================================== */}

      <div className="space-y-3">

        {/* ---------------------------------------------------
            NO CUSTOMERS AT ALL
        --------------------------------------------------- */}

        {customers.length === 0 && (
          <div className="dashboard-card p-10 text-center">

            <div className="mx-auto w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">
              <Search
                size={20}
                className="text-slate-400"
              />
            </div>

            <h2 className="font-semibold text-slate-700 mt-4">
              No customers found
            </h2>

            <p className="text-sm text-slate-400 mt-2">
              There are currently no customers
              registered.
            </p>

          </div>
        )}

        {/* ---------------------------------------------------
            SEARCH RETURNED ZERO RESULTS
        --------------------------------------------------- */}

        {customers.length > 0 &&
          shownCustomers.length === 0 && (
            <div className="dashboard-card p-10 text-center">

              <div className="mx-auto w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">
                <Search
                  size={20}
                  className="text-slate-400"
                />
              </div>

              <h2 className="font-semibold text-slate-700 mt-4">
                No customers found
              </h2>

              <p className="text-sm text-slate-400 mt-2">
                No customer matches "{query}".
              </p>

              <button
                type="button"
                onClick={() => setQuery('')}
                className="btn-secondary mt-4"
              >
                Clear search
              </button>

            </div>
          )}

        {/* ---------------------------------------------------
            CUSTOMER CARDS
        --------------------------------------------------- */}

        {shownCustomers.map((customer) => (
          <div
            key={customer.id}
            className="dashboard-card p-5"
          >

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">

              {/* CUSTOMER INFORMATION */}

              <div className="min-w-0">

                <div className="flex items-center gap-2">

                  <h2 className="font-semibold text-slate-800">
                    {customer.name ||
                      'Unnamed Customer'}
                  </h2>

                  <span className="text-xs text-slate-400">
                    #{customer.id}
                  </span>

                </div>

                <p className="text-sm text-slate-500 mt-1">
                  {customer.email ||
                    'No email'}
                </p>

                <p className="text-sm text-slate-500 mt-1">
                  {customer.mobile ||
                    'No phone'}
                </p>

                {/* ADDRESS */}

                {(customer.address ||
                  customer.city ||
                  customer.state ||
                  customer.pincode) && (
                  <p className="text-xs text-slate-400 mt-2">
                    {[
                      customer.address,
                      customer.city,
                      customer.state,
                      customer.pincode,
                    ]
                      .filter(Boolean)
                      .join(', ')}
                  </p>
                )}

                {/* STATUS */}

                <span
                  className={`
                    inline-flex
                    items-center
                    rounded-full
                    px-3
                    py-1
                    text-xs
                    font-medium
                    mt-3
                    ${
                      customer.status ===
                      'ACTIVE'
                        ? 'bg-mint-50 text-mint-500'
                        : 'bg-slate-100 text-slate-500'
                    }
                  `}
                >
                  {customer.status ||
                    'UNKNOWN'}
                </span>

              </div>

              {/* ACTIONS */}

              <div className="flex flex-wrap items-center gap-2">

                {/* ACTIVATE / DEACTIVATE */}

                <button
                  type="button"
                  onClick={() =>
                    toggleStatus(customer)
                  }
                  className="btn-secondary !px-3 !py-2"
                >

                  {customer.status ===
                  'ACTIVE' ? (
                    <>
                      <UserX size={15} />
                      Deactivate
                    </>
                  ) : (
                    <>
                      <UserCheck size={15} />
                      Activate
                    </>
                  )}

                </button>

                {/* DELETE / DEACTIVATE ICON */}

                <button
                  type="button"
                  onClick={() =>
                    removeCustomer(customer)
                  }
                  title="Deactivate customer"
                  className="
                    w-10
                    h-10
                    rounded-xl
                    bg-rose-50
                    text-red-500
                    flex
                    items-center
                    justify-center
                    hover:bg-rose-100
                  "
                >
                  <Trash2 size={15} />
                </button>

              </div>

            </div>

          </div>
        ))}

      </div>

    </div>
  )
}