import React from 'react'
import {
  Link,
  useLocation,
  useNavigate,
} from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function DashboardShell({
  title,
  subtitle,
  children,
  links = [],
  type,
}) {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout } = useAuth()

  const adminLinks = [
    {
      to: '/admin/overview',
      label: 'Overview',
    },
    {
      to: '/admin/employees',
      label: 'Employees',
    },
    {
      to: '/admin/customers',
      label: 'Customers',
    },
    {
      to: '/admin/catalog',
      label: 'Products',
    },
    {
      to: '/admin/orders',
      label: 'Orders',
    },
  ]

  const employeeLinks = [
    {
      to: '/employee/overview',
      label: 'Overview',
    },
    {
      to: '/employee/products',
      label: 'Products',
    },
    {
      to: '/employee/products/new',
      label: 'Add Product',
    },
    {
      to: '/employee/orders',
      label: 'Orders',
    },
  ]

  const navigation =
    type === 'admin'
      ? adminLinks
      : type === 'employee'
        ? employeeLinks
        : links

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-slate-50">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        <div className="flex flex-col lg:flex-row gap-8">

          {/* =====================================================
              SIDEBAR
          ===================================================== */}
          <aside className="lg:w-60 flex-shrink-0">

            <div className="dashboard-card p-4 sticky top-6">

              <div className="mb-4 px-4">
                <p className="text-xs uppercase tracking-widest text-slate-400">
                  {type === 'admin'
                    ? 'Admin'
                    : type === 'employee'
                      ? 'Employee'
                      : 'Dashboard'}
                </p>
              </div>

              <nav className="space-y-1">

                {navigation.map((link) => {

                  const active =
                    location.pathname === link.to ||
                    (
                      link.to !== '/admin/overview' &&
                      link.to !== '/employee/overview' &&
                      location.pathname.startsWith(
                        `${link.to}/`
                      )
                    )

                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      className={`
                        block rounded-xl px-4 py-3
                        text-sm transition
                        ${
                          active
                            ? 'bg-slate-100 text-slate-900 font-semibold'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        }
                      `}
                    >
                      {link.label}
                    </Link>
                  )
                })}

              </nav>

            </div>

          </aside>


          {/* =====================================================
              MAIN CONTENT
          ===================================================== */}
          <main className="flex-1 min-w-0">

            {/* =================================================
                TOP HEADER
            ================================================= */}
            <div className="mb-7">

              <div className="flex items-start justify-between gap-4">

                {/* TITLE */}
                <div className="min-w-0">

                  {title && (
                    <h1 className="text-3xl font-display font-semibold text-slate-800">
                      {title}
                    </h1>
                  )}

                  {subtitle && (
                    <p className="text-sm text-slate-500 mt-2">
                      {subtitle}
                    </p>
                  )}

                </div>


                {/* LOGOUT BUTTON */}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="
                    flex-shrink-0
                    inline-flex
                    items-center
                    gap-2
                    px-3
                    py-2
                    rounded-xl
                    bg-rose-50
                    text-rose-600
                    border
                    border-rose-100
                    hover:bg-rose-100
                    hover:text-rose-700
                    transition
                    text-sm
                    font-medium
                  "
                  title="Logout"
                >
                  <LogOut size={16} />

                  <span className="hidden sm:inline">
                    Logout
                  </span>
                </button>

              </div>

            </div>


            {/* =================================================
                PAGE CONTENT
            ================================================= */}
            {children}

          </main>

        </div>

      </div>

    </div>
  )
}