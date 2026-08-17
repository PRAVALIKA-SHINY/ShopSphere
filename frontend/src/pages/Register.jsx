import React, { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Sparkles } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    mobile: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  })

  const [show, setShow] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const strength = useMemo(() => {
    let score = 0

    if (form.password.length >= 8) score++
    if (/[A-Z]/.test(form.password)) score++
    if (/[0-9]/.test(form.password)) score++
    if (/[^A-Za-z0-9]/.test(form.password)) score++

    return score
  }, [form.password])

  const submit = async (e) => {
    e.preventDefault()

    setError('')

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    if (
      form.mobile &&
      !/^[0-9]{10}$/.test(form.mobile)
    ) {
      setError(
        'Please enter a valid 10-digit mobile number.'
      )
      return
    }

    if (
      form.pincode &&
      !/^[0-9]{6}$/.test(form.pincode)
    ) {
      setError(
        'Please enter a valid 6-digit pincode.'
      )
      return
    }

    setLoading(true)

    try {
      const response = await register(form)

      if (response.success) {
        navigate('/shop', { replace: true })
      } else {
        setError(
          response.message ||
            'Registration failed.'
        )
      }
    } catch (error) {
      console.error(
        'REGISTER PAGE ERROR:',
        error
      )

      setError(
        'Registration failed. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[84vh] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-brand-50 via-white to-rose-50">
      <div className="w-full max-w-2xl card p-7 md:p-10 border border-white/80 shadow-soft">

        <div className="text-center mb-7">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-brand-100 text-brand-600 flex items-center justify-center mb-3">
            <Sparkles size={22} />
          </div>

          <h1 className="text-3xl font-display font-semibold">
            Create your ShopSphere account
          </h1>

          <p className="text-gray-500 text-sm mt-1">
            A little chic, a little playful,
            completely yours.
          </p>
        </div>

        {error && (
          <div className="mb-5 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3">
            {error}
          </div>
        )}

        <form
          onSubmit={submit}
          className="grid sm:grid-cols-2 gap-4"
        >

          <input
            required
            placeholder="Full name"
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
            className="input-field"
          />

          <input
            required
            type="email"
            placeholder="Email address"
            value={form.email}
            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value,
              })
            }
            className="input-field"
          />

          <input
            placeholder="Mobile number"
            inputMode="numeric"
            maxLength={10}
            value={form.mobile}
            onChange={(e) =>
              setForm({
                ...form,
                mobile: e.target.value.replace(
                  /\D/g,
                  ''
                ),
              })
            }
            className="input-field"
          />

          <input
            placeholder="Pincode"
            inputMode="numeric"
            maxLength={6}
            value={form.pincode}
            onChange={(e) =>
              setForm({
                ...form,
                pincode: e.target.value.replace(
                  /\D/g,
                  ''
                ),
              })
            }
            className="input-field"
          />

          <div className="relative">
            <input
              required
              type={show ? 'text' : 'password'}
              minLength={8}
              placeholder="Password"
              value={form.password}
              onChange={(e) =>
                setForm({
                  ...form,
                  password: e.target.value,
                })
              }
              className="input-field pr-11"
            />

            <button
              type="button"
              onClick={() => setShow(!show)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {show ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>

          <input
            required
            type={show ? 'text' : 'password'}
            minLength={8}
            placeholder="Confirm password"
            value={form.confirmPassword}
            onChange={(e) =>
              setForm({
                ...form,
                confirmPassword: e.target.value,
              })
            }
            className="input-field"
          />

          <div className="sm:col-span-2 flex gap-1">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className={`h-1.5 flex-1 rounded-full ${
                  strength >= item
                    ? 'bg-brand-500'
                    : 'bg-brand-100'
                }`}
              />
            ))}
          </div>

          <input
            placeholder="Street address"
            value={form.address}
            onChange={(e) =>
              setForm({
                ...form,
                address: e.target.value,
              })
            }
            className="input-field sm:col-span-2"
          />

          <input
            placeholder="City"
            value={form.city}
            onChange={(e) =>
              setForm({
                ...form,
                city: e.target.value,
              })
            }
            className="input-field"
          />

          <input
            placeholder="State"
            value={form.state}
            onChange={(e) =>
              setForm({
                ...form,
                state: e.target.value,
              })
            }
            className="input-field"
          />

          <button
            type="submit"
            disabled={loading}
            className="btn-primary sm:col-span-2 mt-2"
          >
            {loading
              ? 'Creating your account…'
              : 'Create Account'}
          </button>

        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}

          <Link
            to="/login"
            className="text-brand-600 font-semibold"
          >
            Login
          </Link>
        </p>

      </div>
    </div>
  )
}