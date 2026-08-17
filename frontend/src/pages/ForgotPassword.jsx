import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { authApi } from '../api/authApi'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [token, setToken] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()

    setLoading(true)
    setMessage('')
    setToken('')

    try {
      const response = await authApi.forgotPassword({
        email,
      })

      setMessage(
        response.data.message ||
          response.data.data?.message
      )

      setToken(
        response.data.data?.resetToken || ''
      )
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          'Unable to request reset'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[84vh] flex items-center justify-center px-4 py-16 bg-gradient-to-b from-brand-50 to-white">
      <div className="card w-full max-w-md p-8">
        <h1 className="text-3xl font-display font-semibold">
          Forgot password?
        </h1>

        <p className="text-sm text-gray-500 mt-2 mb-6">
          Enter your email and we'll create a mock
          reset token for this development project.
        </p>

        {message && (
          <div className="rounded-2xl bg-brand-50 text-brand-700 text-sm p-4 mb-4">
            {message}

            {token && (
              <div className="mt-3">
                <div className="text-xs uppercase tracking-wider text-gray-500 mb-1">
                  Mock reset token
                </div>

                <code className="block break-all bg-white border border-brand-100 rounded-xl p-3 text-xs">
                  {token}
                </code>

                <Link
                  to={`/reset-password?token=${encodeURIComponent(token)}`}
                  className="inline-block mt-3 font-semibold underline"
                >
                  Continue to reset password
                </Link>
              </div>
            )}
          </div>
        )}

        <form
          onSubmit={submit}
          className="space-y-4"
        >
          <input
            className="input-field"
            type="email"
            required
            placeholder="Email address"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

          <button
            className="btn-primary w-full"
            disabled={loading}
          >
            {loading
              ? 'Generating token…'
              : 'Generate Reset Token'}
          </button>
        </form>

        <p className="text-center text-sm mt-6">
          <Link
            to="/login"
            className="text-brand-600 font-medium"
          >
            Back to login
          </Link>
        </p>
      </div>
    </div>
  )
}