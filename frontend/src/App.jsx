import React from 'react'
import {
  Routes,
  Route,
  Navigate,
  Outlet,
} from 'react-router-dom'



import Home from './pages/Home'
import Shop from './pages/Shop'
import ProductDetails2 from './pages/ProductDetails2'
import Cart from './pages/Cart'
import Wishlist from './pages/Wishlist'
import Checkout from './pages/Checkout'
import OrderSuccess from './pages/OrderSuccess'

import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'

import Contact from './pages/Contact'
import About from './pages/About'
import NotFound from './pages/NotFound'

import EmployeeLogin from './pages/EmployeeLogin'
import AdminLogin from './pages/AdminLogin'

import CustomerDashboard from './pages/dashboard/CustomerDashboard'

import EmployeeLayout from './pages/employee/EmployeeLayout'
import EmployeeOverview from './pages/employee/EmployeeOverview'
import EmployeeProducts from './pages/employee/EmployeeProducts'
import EmployeeOrders from './pages/employee/EmployeeOrders'
import AddProduct from './pages/employee/AddProduct'
import EditProduct from './pages/employee/EditProduct'
import ProductDetails from './pages/employee/ProductDetails'

import AdminLayout from './pages/admin/AdminLayout'
import AdminOverview from './pages/admin/AdminOverview'
import AdminEmployees from './pages/admin/AdminEmployees'
import AdminCustomers from './pages/admin/AdminCustomers'
import AdminOrders from './pages/admin/AdminOrders'
import AdminCatalog from './pages/admin/AdminCatalog'

import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

export default function App() {
  return (
    <Routes>

      {/* Customer-facing pages */}
      <Route element={<CustomerLayout />}>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/shop"
          element={<Shop />}
        />

        <Route
          path="/product/:id"
          element={<ProductDetails2 />}
        />

        <Route
          path="/cart"
          element={<Cart />}
        />

        <Route
          path="/wishlist"
          element={<Wishlist />}
        />

        <Route
          path="/checkout"
          element={<Checkout />}
        />

        <Route
          path="/order-success"
          element={<OrderSuccess />}
        />

        <Route
          path="/about"
          element={<About />}
        />

        <Route
          path="/contact"
          element={<Contact />}
        />

        {/* Customer account */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute
              allowedRoles={['CUSTOMER']}
            >
              <CustomerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile/orders"
          element={
            <ProtectedRoute
              allowedRoles={['CUSTOMER']}
            >
              <CustomerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile/security"
          element={
            <ProtectedRoute
              allowedRoles={['CUSTOMER']}
            >
              <CustomerDashboard />
            </ProtectedRoute>
          }
        />

        {/* Keep old URLs working */}
        <Route
          path="/dashboard"
          element={
            <Navigate
              to="/profile"
              replace
            />
          }
        />

        <Route
          path="/account"
          element={
            <Navigate
              to="/profile"
              replace
            />
          }
        />

      </Route>

      {/* Customer authentication */}
      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />

      <Route
        path="/reset-password"
        element={<ResetPassword />}
      />

      {/* Staff authentication */}
      <Route
        path="/employee/login"
        element={<EmployeeLogin />}
      />

      <Route
        path="/admin/login"
        element={<AdminLogin />}
      />

      {/* Employee */}
      <Route
        path="/employee"
        element={
          <ProtectedRoute
            allowedRoles={['EMPLOYEE']}
            loginPath="/employee/login"
          >
            <EmployeeLayout />
          </ProtectedRoute>
        }
      >
        <Route
          index
          element={<EmployeeOverview />}
        />

        <Route
          path="overview"
          element={<EmployeeOverview />}
        />

        <Route
          path="products"
          element={<EmployeeProducts />}
        />

        <Route
          path="products/new"
          element={<AddProduct />}
        />

        <Route
          path="products/:id"
          element={<ProductDetails />}
        />

        <Route
          path="products/:id/edit"
          element={<EditProduct />}
        />

        <Route
          path="orders"
          element={<EmployeeOrders />}
        />
      </Route>

      {/* Super Admin */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute
            allowedRoles={['SUPER_ADMIN']}
            loginPath="/admin/login"
          >
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route
          index
          element={<AdminOverview />}
        />

        <Route
          path="overview"
          element={<AdminOverview />}
        />

        <Route
          path="employees"
          element={<AdminEmployees />}
        />

        <Route
          path="customers"
          element={<AdminCustomers />}
        />

        <Route
          path="catalog"
          element={<AdminCatalog />}
        />

        <Route
          path="orders"
          element={<AdminOrders />}
        />
      </Route>

      <Route
        path="*"
        element={<NotFound />}
      />

    </Routes>
  )
}

function CustomerLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-cream">

      <Navbar />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />

    </div>
  )
}