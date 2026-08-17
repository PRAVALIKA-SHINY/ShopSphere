import React, { useState } from 'react'
import {
  Link,
  useNavigate,
  useSearchParams,
} from 'react-router-dom'
import { authApi } from '../api/authApi'

export default function ResetPassword() {
  const [params] = useSearchParams()

  const [token, setToken] = useState(
    params.get('token') || ''
  )

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()

    setError('')

    if (password !== confirm) {
      return setError(
        'Passwords do not match'
      )
    }

    setLoading(true)

    try {
      await authApi.resetPassword({
        token,
        newPassword: password,
      })

      setMessage(
        'Password reset successfully. You can now log in.'
      )

      setTimeout(
        () => navigate('/login'),
        1400
      )
    } catch (error) {
      setError(
        error.response?.data?.message ||
          'Reset failed'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[84vh] flex items-center justify-center px-4 py-16 bg-gradient-to-b from-brand-50 to-white">
      <div className="card w-full max-w-md p-8">
        <h1 className="text-3xl font-display font-semibold">
          Set a new password
        </h1>

        <p className="text-sm text-gray-500 mt-2 mb-6">
          This reset flow is intentionally mock-only
          for ShopSphere.
        </p>

        {error && (
          <div className="bg-red-50 text-red-600 rounded-xl p-3 text-sm mb-4">
            {error}
          </div>
        )}

        {message && (
          <div className="bg-green-50 text-green-700 rounded-xl p-3 text-sm mb-4">
            {message}
          </div>
        )}

        <form
          onSubmit={submit}
          className="space-y-4"
        >
          <textarea
            className="input-field min-h-24 resize-none"
            required
            placeholder="Paste reset token"
            value={token}
            onChange={(e) =>
              setToken(e.target.value)
            }
          />

          <input
            className="input-field"
            type="password"
            minLength={8}
            required
            placeholder="New password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

          <input
            className="input-field"
            type="password"
            minLength={8}
            required
            placeholder="Confirm new password"
            value={confirm}
            onChange={(e) =>
              setConfirm(e.target.value)
            }
          />

          <button
            className="btn-primary w-full"
            disabled={loading}
          >
            {loading
              ? 'Resetting…'
              : 'Reset Password'}
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