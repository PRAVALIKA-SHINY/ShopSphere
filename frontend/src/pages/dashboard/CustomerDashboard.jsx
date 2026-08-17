import React, {
  useEffect,
  useState,
} from 'react'

import {
  Link,
  useLocation,
  useNavigate,
} from 'react-router-dom'

import {
  Package,
  User,
  LockKeyhole,
  LogOut,
  ChevronRight,
  ShoppingBag,
  CheckCircle2,
  Clock3,
  XCircle,
  CreditCard,
  CircleDollarSign,
} from 'lucide-react'

import Price from '../../components/Price'
import Loader from '../../components/Loader'

import { useAuth } from '../../context/AuthContext'
import { orderApi } from '../../api/orderApi'
import { customerApi } from '../../api/customerApi'


export default function CustomerDashboard() {

  const {
    user,
    logout,
  } = useAuth()

  const navigate =
    useNavigate()

  const location =
    useLocation()


  const [orders, setOrders] =
    useState([])

  const [profile, setProfile] =
    useState(null)


  const [loading, setLoading] =
    useState(true)

  const [savingProfile, setSavingProfile] =
    useState(false)

  const [changingPassword, setChangingPassword] =
    useState(false)


  const [profileForm, setProfileForm] =
    useState({
      name: '',
      email: '',
      mobile: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
    })


  const [passwordForm, setPasswordForm] =
    useState({
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    })


  const [message, setMessage] =
    useState('')

  const [error, setError] =
    useState('')


  const currentSection =
    location.pathname.endsWith('/orders')
      ? 'orders'
      : location.pathname.endsWith('/security')
        ? 'security'
        : 'profile'


  // =========================================================
  // LOAD ACCOUNT DATA
  // =========================================================

  useEffect(() => {
    loadAccountData()
  }, [])


  const loadAccountData =
    async () => {

      setLoading(true)
      setError('')

      try {

        const [
          profileResponse,
          ordersResponse,
        ] = await Promise.all([
          customerApi.getProfile(),
          orderApi.getMyOrders(0, 20),
        ])


        const profileData =
          profileResponse?.data?.data

        const ordersData =
          ordersResponse?.data?.data


        setProfile(
          profileData || null
        )


        setProfileForm({
          name:
            profileData?.name || '',

          email:
            profileData?.email || '',

          mobile:
            profileData?.mobile || '',

          address:
            profileData?.address || '',

          city:
            profileData?.city || '',

          state:
            profileData?.state || '',

          pincode:
            profileData?.pincode || '',
        })


        setOrders(
          ordersData?.content || []
        )

      } catch (err) {

        console.error(
          'CUSTOMER ACCOUNT ERROR:',
          err
        )


        setError(
          err?.response?.data?.message ||
            'Unable to load your account.'
        )

      } finally {

        setLoading(false)
      }
    }


  // =========================================================
  // MESSAGE
  // =========================================================

  const showMessage =
    (text) => {

      setMessage(text)

      window.setTimeout(() => {
        setMessage('')
      }, 2500)
    }


  // =========================================================
  // SAVE PROFILE
  // =========================================================

  const saveProfile =
    async (event) => {

      event.preventDefault()

      setSavingProfile(true)
      setError('')
      setMessage('')


      try {

        const response =
          await customerApi.updateProfile(
            profileForm
          )


        const updatedProfile =
          response?.data?.data


        if (updatedProfile) {

          setProfile(
            updatedProfile
          )


          setProfileForm({

            name:
              updatedProfile.name || '',

            email:
              updatedProfile.email || '',

            mobile:
              updatedProfile.mobile || '',

            address:
              updatedProfile.address || '',

            city:
              updatedProfile.city || '',

            state:
              updatedProfile.state || '',

            pincode:
              updatedProfile.pincode || '',
          })
        }


        showMessage(
          'Profile updated successfully.'
        )

      } catch (err) {

        console.error(
          'PROFILE UPDATE ERROR:',
          err
        )


        setError(
          err?.response?.data?.message ||
            'Unable to update your profile.'
        )

      } finally {

        setSavingProfile(false)
      }
    }


  // =========================================================
  // CHANGE PASSWORD
  // =========================================================

  const changePassword =
    async (event) => {

      event.preventDefault()

      setError('')
      setMessage('')


      if (
        passwordForm.newPassword !==
        passwordForm.confirmPassword
      ) {

        setError(
          'New passwords do not match.'
        )

        return
      }


      if (
        passwordForm.newPassword.length < 8
      ) {

        setError(
          'New password must contain at least 8 characters.'
        )

        return
      }


      setChangingPassword(true)


      try {

        await customerApi.changePassword(
          passwordForm.oldPassword,
          passwordForm.newPassword
        )


        setPasswordForm({
          oldPassword: '',
          newPassword: '',
          confirmPassword: '',
        })


        showMessage(
          'Password changed successfully.'
        )

      } catch (err) {

        console.error(
          'PASSWORD CHANGE ERROR:',
          err
        )


        setError(
          err?.response?.data?.message ||
            'Unable to change password.'
        )

      } finally {

        setChangingPassword(false)
      }
    }


  // =========================================================
  // CANCEL ORDER
  // =========================================================

  const cancelOrder =
    async (orderId) => {

      const confirmed =
        window.confirm(
          'Are you sure you want to cancel this order?'
        )


      if (!confirmed) {
        return
      }


      try {

        await orderApi.cancel(
          orderId
        )


        const response =
          await orderApi.getMyOrders(
            0,
            20
          )


        setOrders(
          response?.data?.data?.content || []
        )


        showMessage(
          'Order cancelled successfully.'
        )

      } catch (err) {

        console.error(
          'CANCEL ORDER ERROR:',
          err
        )


        setError(
          err?.response?.data?.message ||
            'Unable to cancel the order.'
        )
      }
    }


  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout =
    () => {

      logout()

      navigate(
        '/',
        {
          replace: true,
        }
      )
    }


  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {

    return (
      <div className="min-h-[70vh] flex items-center justify-center">

        <Loader
          label="Loading your account…"
        />

      </div>
    )
  }


  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8 md:py-12">

      {/* =====================================================
          ACCOUNT HEADING
      ====================================================== */}

      <div className="mb-8">

        <span className="eyebrow">
          ShopSphere account
        </span>


        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mt-2">

          <div>

            <h1 className="text-3xl md:text-4xl font-display font-semibold text-ink">
              My Account
            </h1>


            <p className="text-sm text-slate-500 mt-2">

              Welcome back,{' '}

              <span className="font-semibold text-slate-700">

                {
                  profile?.name ||
                  user?.name ||
                  'Shopper'
                }

              </span>

              .

            </p>

          </div>


          <button
            type="button"
            onClick={handleLogout}
            className="self-start sm:self-auto inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-rose-500 transition"
          >

            <LogOut
              size={16}
            />

            Logout

          </button>

        </div>

      </div>


      {/* =====================================================
          MESSAGES
      ====================================================== */}

      {(message || error) && (

        <div
          className={`mb-6 rounded-2xl px-4 py-3 text-sm border ${
            error
              ? 'bg-rose-50 border-rose-100 text-rose-600'
              : 'bg-mint-50 border-mint-100 text-mint-500'
          }`}
        >

          {
            error ||
            message
          }

        </div>

      )}


      <div className="grid lg:grid-cols-[250px_1fr] gap-7">

        {/* ===================================================
            ACCOUNT NAVIGATION
        ==================================================== */}

        <aside>

          <div className="dashboard-card p-4 lg:sticky lg:top-28">

            <div className="px-3 py-3 mb-2">

              <p className="text-xs uppercase tracking-[0.18em] font-semibold text-slate-400">
                Account
              </p>


              <p className="text-sm font-semibold text-slate-700 mt-1 truncate">

                {
                  profile?.email ||
                  user?.email
                }

              </p>

            </div>


            <AccountLink
              to="/profile/orders"
              active={
                currentSection === 'orders'
              }
              icon={
                <Package
                  size={18}
                />
              }
              label="Orders"
            />


            <AccountLink
              to="/profile"
              active={
                currentSection === 'profile'
              }
              icon={
                <User
                  size={18}
                />
              }
              label="Profile"
            />


            <AccountLink
              to="/profile/security"
              active={
                currentSection === 'security'
              }
              icon={
                <LockKeyhole
                  size={18}
                />
              }
              label="Security"
            />


            <div className="border-t border-slate-100 mt-4 pt-4">

              <Link
                to="/shop"
                className="flex items-center justify-between gap-3 px-3 py-3 rounded-xl text-sm text-slate-600 hover:bg-brand-50 hover:text-brand-700 transition"
              >

                <span className="flex items-center gap-3">

                  <ShoppingBag
                    size={18}
                  />

                  Continue shopping

                </span>


                <ChevronRight
                  size={16}
                />

              </Link>

            </div>

          </div>

        </aside>


        {/* ===================================================
            ACCOUNT CONTENT
        ==================================================== */}

        <section className="min-w-0">

          {currentSection === 'orders' && (

            <OrdersSection
              orders={orders}
              onCancel={cancelOrder}
            />

          )}


          {currentSection === 'profile' && (

            <ProfileSection
              profileForm={profileForm}
              setProfileForm={
                setProfileForm
              }
              onSubmit={saveProfile}
              loading={savingProfile}
            />

          )}


          {currentSection === 'security' && (

            <SecuritySection
              passwordForm={passwordForm}
              setPasswordForm={
                setPasswordForm
              }
              onSubmit={changePassword}
              loading={changingPassword}
            />

          )}

        </section>

      </div>

    </div>
  )
}


/* =========================================================
   ACCOUNT LINK
========================================================= */

function AccountLink({
  to,
  active,
  icon,
  label,
}) {

  return (

    <Link
      to={to}
      className={`flex items-center justify-between gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition ${
        active
          ? 'bg-brand-50 text-brand-700'
          : 'text-slate-600 hover:bg-slate-50'
      }`}
    >

      <span className="flex items-center gap-3">

        {icon}

        {label}

      </span>


      <ChevronRight
        size={16}
      />

    </Link>
  )
}


/* =========================================================
   ORDERS SECTION
========================================================= */

function OrdersSection({
  orders,
  onCancel,
}) {

  return (

    <div>

      <div className="mb-6">

        <span className="eyebrow">
          Your purchases
        </span>


        <h2 className="text-2xl md:text-3xl font-display font-semibold mt-1">
          Orders
        </h2>


        <p className="text-sm text-slate-500 mt-1">
          View your recent purchases and
          track their status.
        </p>

      </div>


      {orders.length === 0 ? (

        <div className="dashboard-card p-10 md:p-14 text-center">

          <div className="mx-auto w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center">

            <ShoppingBag
              size={25}
            />

          </div>


          <h3 className="font-semibold text-slate-700 mt-4">
            No orders yet
          </h3>


          <p className="text-sm text-slate-400 mt-1">
            Your purchases will appear here.
          </p>


          <Link
            to="/shop"
            className="btn-primary mt-6"
          >
            Start shopping
          </Link>

        </div>

      ) : (

        <div className="space-y-4">

          {orders.map(
            (order) => (

              <OrderCard
                key={order.id}
                order={order}
                onCancel={onCancel}
              />

            )
          )}

        </div>

      )}

    </div>
  )
}


/* =========================================================
   ORDER CARD
========================================================= */

function OrderCard({
  order,
  onCancel,
}) {

  const canCancel = [
    'PLACED',
    'CONFIRMED',
  ].includes(
    order.status
  )


  const status =
    getOrderStatus(
      order.status
    )


  return (

    <div className="dashboard-card p-5 md:p-6">

      {/* ===================================================
          ORDER HEADER
      ==================================================== */}

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">

        <div>

          <p className="text-xs uppercase tracking-wider font-semibold text-slate-400">
            Order
          </p>


          <p className="font-semibold text-slate-800 mt-1">

            {
              order.orderNumber ||
              `#${order.id}`
            }

          </p>


          <p className="text-xs text-slate-400 mt-1">

            {
              order.createdAt
                ? new Date(
                    order.createdAt
                  ).toLocaleDateString(
                    'en-IN',
                    {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    }
                  )
                : '—'
            }

          </p>


          {/* =================================================
              PAYMENT INFORMATION
          ================================================== */}

          <div className="flex flex-wrap items-center gap-2 mt-3">

            {/* Payment method */}

            <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-slate-50 border border-slate-100 text-xs font-medium text-slate-600">

              <CreditCard
                size={13}
              />

              Payment:

              <span className="font-semibold">
                {
                  formatPaymentMethod(
                    order.paymentMethod
                  )
                }
              </span>

            </span>


            {/* Payment status */}

            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium ${getPaymentStatusClass(
                order.paymentStatus
              )}`}
            >

              <CircleDollarSign
                size={13}
              />

              {
                formatPaymentStatus(
                  order.paymentStatus
                )
              }

            </span>

          </div>

        </div>


        {/* =================================================
            ORDER STATUS + TOTAL
        ================================================== */}

        <div className="sm:text-right">

          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${status.className}`}
          >

            {status.icon}

            {
              order.status
            }

          </span>


          <p className="text-lg font-semibold text-slate-800 mt-2">

            <Price
              value={
                order.totalAmount || 0
              }
            />

          </p>

        </div>

      </div>


      {/* ===================================================
          ORDER ITEMS
      ==================================================== */}

      {order.items?.length > 0 && (

        <div className="mt-5 pt-5 border-t border-slate-100 space-y-3">

          {order.items.map(
            (item) => (

              <div
                key={item.id}
                className="flex items-center justify-between gap-4 text-sm"
              >

                <div className="min-w-0">

                  <p className="font-medium text-slate-700 truncate">

                    {
                      item.productName ||
                      item.product?.name ||
                      'Product'
                    }

                  </p>


                  <p className="text-xs text-slate-400 mt-1">

                    Quantity: {
                      item.quantity
                    }

                  </p>

                </div>


                <p className="font-semibold text-slate-700 flex-shrink-0">

                  <Price
                    value={
                      item.price || 0
                    }
                  />

                </p>

              </div>

            )
          )}

        </div>

      )}


      {/* ===================================================
          CANCEL ORDER
      ==================================================== */}

      {canCancel && (

        <div className="mt-5 pt-4 border-t border-slate-100">

          <button
            type="button"
            onClick={() =>
              onCancel(
                order.id
              )
            }
            className="text-sm font-semibold text-rose-500 hover:text-rose-600 hover:underline"
          >

            Cancel order

          </button>

        </div>

      )}

    </div>
  )
}


/* =========================================================
   PAYMENT METHOD FORMATTER
========================================================= */

function formatPaymentMethod(
  method
) {

  if (!method) {
    return 'Not available'
  }


  switch (method) {

    case 'CARD':
      return 'Card'

    case 'UPI':
      return 'UPI'

    case 'NET_BANKING':
      return 'Net Banking'

    case 'COD':
      return 'Cash on Delivery'

    default:

      return String(method)
        .replaceAll(
          '_',
          ' '
        )
        .replace(
          /\b\w/g,
          (letter) =>
            letter.toUpperCase()
        )
  }
}


/* =========================================================
   PAYMENT STATUS FORMATTER
========================================================= */

function formatPaymentStatus(
  status
) {

  if (!status) {
    return 'Payment Pending'
  }


  switch (status) {

    case 'PAID':
      return 'Paid'

    case 'FAILED':
      return 'Payment Failed'

    case 'PENDING':
      return 'Payment Pending'

    case 'CANCELLED':
      return 'Payment Cancelled'

    default:

      return String(status)
        .replaceAll(
          '_',
          ' '
        )
        .replace(
          /\b\w/g,
          (letter) =>
            letter.toUpperCase()
        )
  }
}


/* =========================================================
   PAYMENT STATUS STYLE
========================================================= */

function getPaymentStatusClass(
  status
) {

  switch (status) {

    case 'PAID':

      return (
        'bg-emerald-50 ' +
        'text-emerald-600 ' +
        'border border-emerald-100'
      )


    case 'FAILED':

      return (
        'bg-rose-50 ' +
        'text-rose-600 ' +
        'border border-rose-100'
      )


    case 'CANCELLED':

      return (
        'bg-rose-50 ' +
        'text-rose-600 ' +
        'border border-rose-100'
      )


    case 'PENDING':

      return (
        'bg-amber-50 ' +
        'text-amber-600 ' +
        'border border-amber-100'
      )


    default:

      return (
        'bg-slate-50 ' +
        'text-slate-600 ' +
        'border border-slate-200'
      )
  }
}


/* =========================================================
   ORDER STATUS
========================================================= */

function getOrderStatus(
  status
) {

  if (
    status === 'DELIVERED'
  ) {

    return {

      className:
        'bg-mint-50 text-mint-500 border border-mint-100',

      icon: (
        <CheckCircle2
          size={14}
        />
      ),

    }
  }


  if (
    status === 'CANCELLED'
  ) {

    return {

      className:
        'bg-rose-50 text-rose-500 border border-rose-100',

      icon: (
        <XCircle
          size={14}
        />
      ),

    }
  }


  if (
    status === 'PLACED' ||
    status === 'CONFIRMED' ||
    status === 'PROCESSING'
  ) {

    return {

      className:
        'bg-brand-50 text-brand-700 border border-brand-100',

      icon: (
        <Clock3
          size={14}
        />
      ),

    }
  }


  return {

    className:
      'bg-slate-50 text-slate-600 border border-slate-200',

    icon: (
      <Clock3
        size={14}
      />
    ),

  }
}


/* =========================================================
   PROFILE SECTION
========================================================= */

function ProfileSection({
  profileForm,
  setProfileForm,
  onSubmit,
  loading,
}) {

  return (

    <div>

      <div className="mb-6">

        <span className="eyebrow">
          Personal information
        </span>


        <h2 className="text-2xl md:text-3xl font-display font-semibold mt-1">
          Profile
        </h2>


        <p className="text-sm text-slate-500 mt-1">
          Manage the information connected
          to your ShopSphere account.
        </p>

      </div>


      <form
        onSubmit={onSubmit}
        className="dashboard-card p-6 md:p-8"
      >

        <div className="grid sm:grid-cols-2 gap-5">

          <div className="sm:col-span-2">

            <label className="field-label">
              Full name
            </label>


            <input
              className="input-field mt-2"
              value={
                profileForm.name
              }
              onChange={(event) =>
                setProfileForm({
                  ...profileForm,
                  name:
                    event.target.value,
                })
              }
              required
            />

          </div>


          <div>

            <label className="field-label">
              Email address
            </label>


            <input
              className="input-field mt-2 bg-slate-50"
              value={
                profileForm.email
              }
              disabled
            />


            <p className="text-xs text-slate-400 mt-2">
              Email cannot be changed here.
            </p>

          </div>


          <div>

            <label className="field-label">
              Mobile number
            </label>


            <input
              className="input-field mt-2"
              inputMode="numeric"
              maxLength={10}
              value={
                profileForm.mobile
              }
              onChange={(event) =>
                setProfileForm({
                  ...profileForm,
                  mobile:
                    event.target.value.replace(
                      /\D/g,
                      ''
                    ),
                })
              }
            />

          </div>


          <div className="sm:col-span-2">

            <label className="field-label">
              Street address
            </label>


            <input
              className="input-field mt-2"
              value={
                profileForm.address
              }
              onChange={(event) =>
                setProfileForm({
                  ...profileForm,
                  address:
                    event.target.value,
                })
              }
            />

          </div>


          <div>

            <label className="field-label">
              City
            </label>


            <input
              className="input-field mt-2"
              value={
                profileForm.city
              }
              onChange={(event) =>
                setProfileForm({
                  ...profileForm,
                  city:
                    event.target.value,
                })
              }
            />

          </div>


          <div>

            <label className="field-label">
              State
            </label>


            <input
              className="input-field mt-2"
              value={
                profileForm.state
              }
              onChange={(event) =>
                setProfileForm({
                  ...profileForm,
                  state:
                    event.target.value,
                })
              }
            />

          </div>


          <div>

            <label className="field-label">
              Pincode
            </label>


            <input
              className="input-field mt-2"
              inputMode="numeric"
              maxLength={6}
              value={
                profileForm.pincode
              }
              onChange={(event) =>
                setProfileForm({
                  ...profileForm,
                  pincode:
                    event.target.value.replace(
                      /\D/g,
                      ''
                    ),
                })
              }
            />

          </div>

        </div>


        <div className="mt-7 pt-6 border-t border-slate-100 flex justify-end">

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
          >

            {
              loading
                ? 'Saving…'
                : 'Save changes'
            }

          </button>

        </div>

      </form>

    </div>
  )
}


/* =========================================================
   SECURITY SECTION
========================================================= */

function SecuritySection({
  passwordForm,
  setPasswordForm,
  onSubmit,
  loading,
}) {

  return (

    <div>

      <div className="mb-6">

        <span className="eyebrow">
          Account protection
        </span>


        <h2 className="text-2xl md:text-3xl font-display font-semibold mt-1">
          Security
        </h2>


        <p className="text-sm text-slate-500 mt-1">
          Keep your ShopSphere account secure.
        </p>

      </div>


      <form
        onSubmit={onSubmit}
        className="dashboard-card p-6 md:p-8 max-w-2xl"
      >

        <div className="w-11 h-11 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-5">

          <LockKeyhole
            size={20}
          />

        </div>


        <h3 className="text-lg font-semibold text-slate-800">
          Change password
        </h3>


        <p className="text-sm text-slate-400 mt-1 mb-6">
          Choose a strong password that you
          don't use elsewhere.
        </p>


        <div className="space-y-5">

          <div>

            <label className="field-label">
              Current password
            </label>


            <input
              type="password"
              className="input-field mt-2"
              value={
                passwordForm.oldPassword
              }
              onChange={(event) =>
                setPasswordForm({
                  ...passwordForm,
                  oldPassword:
                    event.target.value,
                })
              }
              required
            />

          </div>


          <div>

            <label className="field-label">
              New password
            </label>


            <input
              type="password"
              className="input-field mt-2"
              minLength={8}
              value={
                passwordForm.newPassword
              }
              onChange={(event) =>
                setPasswordForm({
                  ...passwordForm,
                  newPassword:
                    event.target.value,
                })
              }
              required
            />


            <p className="text-xs text-slate-400 mt-2">
              Minimum 8 characters.
            </p>

          </div>


          <div>

            <label className="field-label">
              Confirm new password
            </label>


            <input
              type="password"
              className="input-field mt-2"
              minLength={8}
              value={
                passwordForm.confirmPassword
              }
              onChange={(event) =>
                setPasswordForm({
                  ...passwordForm,
                  confirmPassword:
                    event.target.value,
                })
              }
              required
            />

          </div>

        </div>


        <div className="mt-7 pt-6 border-t border-slate-100 flex justify-end">

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
          >

            {
              loading
                ? 'Updating…'
                : 'Update password'
            }

          </button>

        </div>

      </form>

    </div>
  )
}