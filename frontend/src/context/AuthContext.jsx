import React, {
  createContext,
  useContext,
  useState,
} from 'react'

import { authApi } from '../api/authApi'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const storedUser =
        localStorage.getItem('ss_user')

      if (!storedUser) {
        return null
      }

      return JSON.parse(storedUser)
    } catch (error) {
      console.error(
        'Could not restore user:',
        error
      )

      localStorage.removeItem('ss_user')
      localStorage.removeItem('ss_token')

      return null
    }
  })

  const [loading, setLoading] = useState(false)

  const login = async (
    email,
    password
  ) => {
    setLoading(true)

    try {
      const cleanEmail =
        String(email ?? '').trim()

      const cleanPassword =
        String(password ?? '')

      if (!cleanEmail) {
        return {
          success: false,
          message: 'Email is required.',
        }
      }

      if (!cleanPassword) {
        return {
          success: false,
          message: 'Password is required.',
        }
      }

      const response =
        await authApi.login(
          cleanEmail,
          cleanPassword
        )

      const data =
        response?.data?.data

      if (!data) {
        return {
          success: false,
          message:
            response?.data?.message ||
            'Server returned an invalid login response.',
        }
      }

      if (
        !data.token ||
        typeof data.token !== 'string'
      ) {
        return {
          success: false,
          message:
            'Server returned an invalid authentication token.',
        }
      }

      localStorage.setItem(
        'ss_token',
        data.token
      )

      localStorage.setItem(
        'ss_user',
        JSON.stringify(data)
      )

      setUser(data)

      return {
        success: true,
        data,
      }
    } catch (error) {
      console.error(
        'LOGIN ERROR:',
        error
      )

      return {
        success: false,
        message:
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          'Login failed.',
      }
    } finally {
      setLoading(false)
    }
  }

  const register = async (
    payload
  ) => {
    setLoading(true)

    try {
      const response =
        await authApi.register(
          payload
        )

      const data =
        response?.data?.data

      if (!data) {
        return {
          success: false,
          message:
            response?.data?.message ||
            'Invalid registration response.',
        }
      }

      if (
        data.token &&
        typeof data.token === 'string'
      ) {
        localStorage.setItem(
          'ss_token',
          data.token
        )

        localStorage.setItem(
          'ss_user',
          JSON.stringify(data)
        )

        setUser(data)
      }

      return {
        success: true,
        data,
      }
    } catch (error) {
      console.error(
        'REGISTER ERROR:',
        error
      )

      return {
        success: false,
        message:
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          'Registration failed.',
      }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem(
      'ss_token'
    )

    localStorage.removeItem(
      'ss_user'
    )

    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}