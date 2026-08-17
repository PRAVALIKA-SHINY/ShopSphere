import React, { useState } from 'react'
import {
  Link,
  useNavigate,
} from 'react-router-dom'
import {
  Briefcase,
  Eye,
  EyeOff,
  ShieldCheck,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function EmployeeLogin() {
  const { login, logout } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    email: '',
    password: '',
  })

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [show, setShow] = useState(false)

  const submit = async (e) => {
    e.preventDefault()

    setError('')
    setLoading(true)

    const response = await login(
      form.email,
      form.password
    )

    setLoading(false)

    if (response.success) {
      if (
        !['EMPLOYEE', 'SUPER_ADMIN'].includes(
          response.data.role
        )
      ) {
        logout()
        setError(
          'This page is for employee accounts.'
        )
        return
      }

      navigate(
        response.data.role === 'SUPER_ADMIN'
          ? '/admin'
          : '/employee'
      )
    } else {
      setError(response.message)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-mint-50 via-white to-brand-50 px-4 py-10 flex items-center">
      <div className="w-full max-w-5xl mx-auto bg-white rounded-3xl shadow-lift border border-slate-100 overflow-hidden grid md:grid-cols-2">

        <div className="p-8 sm:p-12 bg-mint-50 flex flex-col justify-between">
          <div>
            <span className="eyebrow">
              ShopSphere staff
            </span>

            <div className="w-14 h-14 rounded-2xl bg-white text-brand-600 flex items-center justify-center mt-5 shadow-card">
              <Briefcase size={26} />
            </div>

            <h1 className="text-4xl font-display font-semibold mt-6">
              Welcome to your
              <br />
              work space.
            </h1>

            <p className="text-slate-500 mt-4 max-w-sm leading-7">
              Manage products, monitor orders and
              keep the store running smoothly.
            </p>
          </div>

          <div className="mt-10 flex items-center gap-3 text-sm text-slate-500">
            <ShieldCheck
              size={18}
              className="text-mint-500"
            />
            Your account access is controlled by the
            Super Admin.
          </div>
        </div>

        <div className="p-7 sm:p-12">
          <Link
            to="/login"
            className="text-xs font-semibold text-brand-700 hover:underline"
          >
            ← Customer login
          </Link>

          <h2 className="text-3xl font-display font-semibold mt-7">
            Employee Login
          </h2>

          <p className="text-slate-500 mt-2">
            Use the credentials provided by your admin.
          </p>

          {error && (
            <div className="mt-6 rounded-xl bg-rose-50 border border-rose-100 text-red-600 text-sm px-4 py-3">
              {error}
            </div>
          )}

          <form
            onSubmit={submit}
            className="mt-7 space-y-5"
          >
            <div>
              <label className="field-label">
                Employee email
              </label>

              <input
                className="input-field mt-2"
                type="email"
                required
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value,
                  })
                }
                placeholder="employee@example.com"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="field-label">
                  Password
                </label>

                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-brand-700"
                >
                  Forgot password?
                </Link>
              </div>

              <div className="relative mt-2">
                <input
                  className="input-field pr-12"
                  type={
                    show ? 'text' : 'password'
                  }
                  required
                  value={form.password}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      password: e.target.value,
                    })
                  }
                  placeholder="Enter your password"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShow(!show)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {show ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            <button
              disabled={loading}
              className="btn-primary w-full h-12"
            >
              {loading
                ? 'Signing in…'
                : 'Login'}
            </button>
          </form>

          <p className="text-xs text-slate-400 mt-7 leading-5">
            Employee accounts are created and activated
            by the Super Admin. If your account is
            inactive, contact the administrator.
          </p>

          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <Link
              to="/admin/login"
              className="text-sm text-brand-700 font-semibold"
            >
              Admin Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}