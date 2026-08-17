import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({
  children,
  allowedRoles,
  loginPath = '/login',
}) {
  const {
    user,
    loading,
  } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    )
  }

  if (!user) {
    return (
      <Navigate
        to={loginPath}
        replace
      />
    )
  }

  if (
    allowedRoles &&
    !allowedRoles.includes(user.role)
  ) {
    return (
      <Navigate
        to="/"
        replace
      />
    )
  }

  return children
}