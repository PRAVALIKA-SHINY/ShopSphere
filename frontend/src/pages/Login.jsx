import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Eye,
  EyeOff,
  ShieldCheck,
  Briefcase,
  ShoppingBag,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Login() {
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

    try {
      const response = await login(
        form.email,
        form.password
      )

      if (response.success) {
        if (response.data?.role !== 'CUSTOMER') {
          logout()

          setError(
            'This page is for customer accounts. Please use Employee Login or Admin Login.'
          )

          return
        }

        navigate('/shop', { replace: true })
      } else {
        setError(
          response.message ||
            'Login failed.'
        )
      }
    } catch (error) {
      console.error(
        'LOGIN PAGE ERROR:',
        error
      )

      setError(
        'Login failed. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-40px)] bg-gradient-to-br from-brand-50 via-white to-rose-50 px-4 py-10 md:py-16 flex items-center">

      <div className="w-full max-w-5xl mx-auto bg-white rounded-3xl border border-slate-100 shadow-lift overflow-hidden grid md:grid-cols-[0.9fr_1.1fr]">

        <div className="hidden md:flex bg-brand-50 p-10 lg:p-14 flex-col justify-between">

          <div>
            <span className="eyebrow">
              ShopSphere
            </span>

            <h1 className="text-4xl lg:text-5xl font-display font-semibold leading-tight mt-4">
              Good things are
              <br />
              waiting for you.
            </h1>

            <p className="text-slate-500 mt-5 leading-7 max-w-sm">
              Sign in to keep your wishlist, bag and
              orders in one beautifully simple place.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-10">

            <Feature
              icon={<ShoppingBag size={18} />}
              text="Easy shopping"
            />

            <Feature
              icon={<ShieldCheck size={18} />}
              text="Safe mock checkout"
            />

            <Feature
              icon={<Briefcase size={18} />}
              text="Order tracking"
            />

          </div>

        </div>

        <div className="p-7 sm:p-10 lg:p-14">

          <div className="md:hidden text-center mb-8">
            <span className="eyebrow">
              ShopSphere
            </span>
          </div>

          <h2 className="text-3xl font-display font-semibold text-ink">
            Welcome back
          </h2>

          <p className="text-slate-500 mt-2">
            Login to continue to your account.
          </p>

          {error && (
            <div className="mt-6 rounded-xl bg-rose-50 border border-rose-100 text-red-600 text-sm px-4 py-3 leading-5">
              {error}
            </div>
          )}

          <form
            onSubmit={submit}
            className="mt-7 space-y-5"
          >

            <div>
              <label className="field-label">
                Email address
              </label>

              <input
                autoComplete="email"
                type="email"
                required
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value,
                  })
                }
                className="input-field mt-2"
                placeholder="you@example.com"
              />
            </div>

            <div>

              <div className="flex items-center justify-between">

                <label className="field-label">
                  Password
                </label>

                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-brand-700 hover:underline"
                >
                  Forgot password?
                </Link>

              </div>

              <div className="relative mt-2">

                <input
                  autoComplete="current-password"
                  type={show ? 'text' : 'password'}
                  required
                  value={form.password}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      password: e.target.value,
                    })
                  }
                  className="input-field pr-12"
                  placeholder="Enter your password"
                />

                <button
                  type="button"
                  onClick={() => setShow(!show)}
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
              type="submit"
              disabled={loading}
              className="btn-primary w-full h-12"
            >
              {loading
                ? 'Signing you in…'
                : 'Login'}
            </button>

          </form>

          <p className="text-center text-sm text-slate-500 mt-7">
            New to ShopSphere?{' '}

            <Link
              to="/register"
              className="font-semibold text-brand-700"
            >
              Create an account
            </Link>
          </p>

          <div className="mt-8 pt-6 border-t border-slate-100">

            <p className="text-xs text-center text-slate-400 mb-3">
              Staff access
            </p>

            <div className="grid grid-cols-2 gap-3">

              <Link
                to="/employee/login"
                className="btn-secondary !py-2.5 text-sm"
              >
                Employee Login
              </Link>

              <Link
                to="/admin/login"
                className="btn-secondary !py-2.5 text-sm"
              >
                Admin Login
              </Link>

            </div>

          </div>

        </div>

      </div>

    </div>
  )
}

function Feature({ icon, text }) {
  return (
    <div className="rounded-xl bg-white/70 border border-white p-3 text-center text-xs text-slate-600">

      <div className="mx-auto w-8 h-8 rounded-lg bg-white flex items-center justify-center text-brand-600 mb-2">
        {icon}
      </div>

      {text}

    </div>
  )
}