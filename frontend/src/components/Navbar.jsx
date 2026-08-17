import React, {
  useState,
} from 'react'

import {
  Link,
  useNavigate,
} from 'react-router-dom'

import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  LogOut,
} from 'lucide-react'

import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function Navbar() {

  const {
    user,
    logout,
  } = useAuth()

  const {
    cart,
    wishlistItems,
  } = useCart()

  const navigate = useNavigate()

  const [menuOpen, setMenuOpen] =
    useState(false)

  const [search, setSearch] =
    useState('')


  /*
   * =========================================================
   * CART ITEMS
   * =========================================================
   *
   * Backend returns the cart in this structure:
   *
   * {
   *   items: [
   *      {
   *        id: 1,
   *        quantity: 1,
   *        product: {...}
   *      }
   *   ]
   * }
   *
   * Always make sure we are working with an array.
   */

  const cartItems =
    Array.isArray(cart?.items)
      ? cart.items
      : []


  /*
   * =========================================================
   * TOTAL CART ITEM COUNT
   * =========================================================
   *
   * This counts QUANTITY, not just the number of products.
   *
   * Example:
   *
   * Sneakers      quantity 2
   * Earrings      quantity 1
   *
   * Badge = 3
   *
   * If both quantities are 1:
   *
   * Badge = 2
   */

  const cartCount =
    cartItems.reduce(
      (total, item) => {
        return (
          total +
          Number(item?.quantity || 0)
        )
      },
      0
    )


  /*
   * =========================================================
   * WISHLIST COUNT
   * =========================================================
   */

  const wishlistCount =
    Array.isArray(wishlistItems)
      ? wishlistItems.length
      : 0


  /*
   * =========================================================
   * SEARCH
   * =========================================================
   */

  const handleSearch = (event) => {

    event.preventDefault()

    const value =
      search.trim()

    if (!value) {
      return
    }

    navigate(
      `/shop?search=${encodeURIComponent(
        value
      )}`
    )

    setMenuOpen(false)
  }


  /*
   * =========================================================
   * LOGOUT
   * =========================================================
   */

  const handleLogout = () => {

    logout()

    setMenuOpen(false)

    navigate('/')
  }


  /*
   * =========================================================
   * CUSTOMER CHECK
   * =========================================================
   */

  const customer =
    user?.role === 'CUSTOMER'


  return (
    <>
      {/* =====================================================
          TOP NAVBAR
      ====================================================== */}

      <header
        className="
          sticky
          top-0
          z-50
          bg-white/95
          backdrop-blur
          border-b
          border-slate-100
        "
      >

        <div
          className="
            max-w-7xl
            mx-auto
            px-4
            sm:px-6
          "
        >

          <div
            className="
              h-20
              flex
              items-center
              gap-5
            "
          >

            {/* =================================================
                LOGO
            ================================================= */}

            <Link
              to="/shop"
              className="flex-shrink-0"
            >

              <span
                className="
                  text-2xl
                  font-display
                  font-bold
                  text-slate-800
                "
              >
                ShopSphere
              </span>

            </Link>


            {/* =================================================
                SEARCH
            ================================================= */}

            <form
              onSubmit={handleSearch}
              className="
                hidden
                md:flex
                flex-1
                max-w-xl
                mx-auto
              "
            >

              <div
                className="
                  w-full
                  flex
                  items-center
                  bg-slate-50
                  border
                  border-slate-200
                  rounded-full
                  px-4
                  py-2.5
                "
              >

                <Search
                  size={18}
                  className="text-slate-400"
                />

                <input
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                  placeholder="Search for products, brands and more"
                  className="
                    flex-1
                    bg-transparent
                    outline-none
                    px-3
                    text-sm
                    text-slate-700
                    placeholder:text-slate-400
                  "
                />

              </div>

            </form>


            {/* =================================================
                NAV LINKS
            ================================================= */}

            <nav
              className="
                hidden
                lg:flex
                items-center
                gap-6
                text-sm
                font-medium
                text-slate-600
              "
            >

              <Link
                to="/shop"
                className="hover:text-slate-900"
              >
                Shop
              </Link>

              <Link
                to="/about"
                className="hover:text-slate-900"
              >
                About
              </Link>

              <Link
                to="/contact"
                className="hover:text-slate-900"
              >
                Contact
              </Link>

            </nav>


            {/* =================================================
                RIGHT SIDE ICONS
            ================================================= */}

            <div
              className="
                flex
                items-center
                gap-1
                ml-auto
              "
            >

              {customer && (
                <>

                  {/* =================================================
                      WISHLIST
                  ================================================= */}

                  <Link
                    to="/wishlist"
                    title="Wishlist"
                    className="
                      relative
                      w-10
                      h-10
                      rounded-full
                      flex
                      items-center
                      justify-center
                      hover:bg-slate-50
                      transition
                    "
                  >

                    <Heart
                      size={20}
                      strokeWidth={1.8}
                    />

                    {wishlistCount > 0 && (
                      <span
                        className="
                          absolute
                          -top-1
                          -right-1
                          z-20
                          min-w-[20px]
                          h-[20px]
                          px-1
                          rounded-full
                          bg-rose-400
                          text-white
                          text-[10px]
                          font-bold
                          flex
                          items-center
                          justify-center
                          leading-none
                          border-2
                          border-white
                        "
                      >
                        {wishlistCount > 99
                          ? '99+'
                          : wishlistCount}
                      </span>
                    )}

                  </Link>


                  {/* =================================================
                      CART
                  ================================================= */}

                  <Link
                    to="/cart"
                    title={
                      cartCount > 0
                        ? `${cartCount} item${cartCount === 1 ? '' : 's'} in cart`
                        : 'Shopping Cart'
                    }
                    className="
                      relative
                      w-10
                      h-10
                      rounded-full
                      flex
                      items-center
                      justify-center
                      hover:bg-slate-50
                      transition
                    "
                  >

                    <ShoppingBag
                      size={20}
                      strokeWidth={1.8}
                    />


                    {/* CART BADGE */}

                    {cartCount > 0 && (
                      <span
                        className="
                          absolute
                          -top-1
                          -right-1
                          z-30
                          min-w-[21px]
                          h-[21px]
                          px-1
                          rounded-full
                          bg-slate-800
                          text-white
                          text-[10px]
                          font-bold
                          flex
                          items-center
                          justify-center
                          leading-none
                          border-2
                          border-white
                          shadow-sm
                        "
                      >
                        {cartCount > 99
                          ? '99+'
                          : cartCount}
                      </span>
                    )}

                  </Link>


                  {/* =================================================
                      LOGOUT
                  ================================================= */}

                  <button
                    type="button"
                    onClick={handleLogout}
                    title="Logout"
                    className="
                      w-10
                      h-10
                      rounded-full
                      flex
                      items-center
                      justify-center
                      hover:bg-rose-50
                      hover:text-rose-500
                      transition
                    "
                  >

                    <LogOut
                      size={19}
                      strokeWidth={1.8}
                    />

                  </button>

                </>
              )}


              {/* =================================================
                  PROFILE / LOGIN
              ================================================= */}

              <Link
                to={
                  user
                    ? user.role === 'CUSTOMER'
                      ? '/profile'
                      : user.role === 'EMPLOYEE'
                        ? '/employee'
                        : '/admin'
                    : '/login'
                }
                title="Profile"
                className="
                  w-10
                  h-10
                  rounded-full
                  flex
                  items-center
                  justify-center
                  hover:bg-slate-50
                  transition
                "
              >

                <User
                  size={20}
                  strokeWidth={1.8}
                />

              </Link>


              {/* =================================================
                  MOBILE MENU
              ================================================= */}

              <button
                type="button"
                onClick={() =>
                  setMenuOpen(
                    (current) => !current
                  )
                }
                className="
                  lg:hidden
                  w-10
                  h-10
                  rounded-full
                  flex
                  items-center
                  justify-center
                  hover:bg-slate-50
                "
              >

                {menuOpen ? (
                  <X size={20} />
                ) : (
                  <Menu size={20} />
                )}

              </button>

            </div>

          </div>


          {/* =====================================================
              MOBILE MENU
          ====================================================== */}

          {menuOpen && (
            <div
              className="
                lg:hidden
                pb-5
                border-t
                border-slate-100
                pt-4
                space-y-3
              "
            >

              {/* MOBILE SEARCH */}

              <form
                onSubmit={handleSearch}
                className="flex"
              >

                <input
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                  placeholder="Search products..."
                  className="input-field"
                />

              </form>


              <Link
                to="/shop"
                className="block py-2 text-sm"
                onClick={() =>
                  setMenuOpen(false)
                }
              >
                Shop
              </Link>


              <Link
                to="/about"
                className="block py-2 text-sm"
                onClick={() =>
                  setMenuOpen(false)
                }
              >
                About
              </Link>


              <Link
                to="/contact"
                className="block py-2 text-sm"
                onClick={() =>
                  setMenuOpen(false)
                }
              >
                Contact
              </Link>


              {customer && (
                <>

                  <Link
                    to="/wishlist"
                    className="
                      flex
                      items-center
                      justify-between
                      py-2
                      text-sm
                    "
                    onClick={() =>
                      setMenuOpen(false)
                    }
                  >

                    <span>
                      Wishlist
                    </span>

                    {wishlistCount > 0 && (
                      <span
                        className="
                          min-w-5
                          h-5
                          px-1.5
                          rounded-full
                          bg-rose-400
                          text-white
                          text-[10px]
                          font-bold
                          flex
                          items-center
                          justify-center
                        "
                      >
                        {wishlistCount}
                      </span>
                    )}

                  </Link>


                  <Link
                    to="/cart"
                    className="
                      flex
                      items-center
                      justify-between
                      py-2
                      text-sm
                    "
                    onClick={() =>
                      setMenuOpen(false)
                    }
                  >

                    <span>
                      Cart
                    </span>

                    {cartCount > 0 && (
                      <span
                        className="
                          min-w-5
                          h-5
                          px-1.5
                          rounded-full
                          bg-slate-800
                          text-white
                          text-[10px]
                          font-bold
                          flex
                          items-center
                          justify-center
                        "
                      >
                        {cartCount}
                      </span>
                    )}

                  </Link>


                  <Link
                    to="/profile"
                    className="block py-2 text-sm"
                    onClick={() =>
                      setMenuOpen(false)
                    }
                  >
                    My Profile
                  </Link>


                  <button
                    type="button"
                    onClick={handleLogout}
                    className="
                      text-sm
                      text-rose-500
                      py-2
                    "
                  >
                    Logout
                  </button>

                </>
              )}

            </div>
          )}

        </div>

      </header>


      {/* =====================================================
          BOTTOM-LEFT PROFILE BUTTON
      ====================================================== */}

      {customer && (
        <Link
          to="/profile"
          className="
            fixed
            left-6
            bottom-6
            z-40
            flex
            items-center
            gap-2
            px-5
            py-3
            rounded-full
            bg-white
            border
            border-slate-200
            shadow-lg
            text-slate-700
            hover:bg-slate-800
            hover:text-white
            transition-all
            duration-200
          "
          title="My Profile"
        >

          <User
            size={18}
          />

          <span
            className="
              text-sm
              font-medium
            "
          >
            Profile
          </span>

        </Link>
      )}
    </>
  )
}