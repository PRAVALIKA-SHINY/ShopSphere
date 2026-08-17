import React from 'react'
import {
  Link,
} from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-100 bg-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-display font-bold text-slate-800">
              ShopSphere
            </h3>

            <p className="text-sm text-slate-500 mt-3 leading-6">
              Everyday shopping made
              simple, beautiful and
              reliable.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-slate-800">
              Shop
            </h4>

            <div className="mt-3 space-y-2 text-sm text-slate-500">
              <Link
                to="/shop"
                className="block hover:text-slate-800"
              >
                All products
              </Link>

              <Link
                to="/wishlist"
                className="block hover:text-slate-800"
              >
                Wishlist
              </Link>

              <Link
                to="/cart"
                className="block hover:text-slate-800"
              >
                Shopping bag
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-slate-800">
              Company
            </h4>

            <div className="mt-3 space-y-2 text-sm text-slate-500">
              <Link
                to="/about"
                className="block hover:text-slate-800"
              >
                About us
              </Link>

              <Link
                to="/contact"
                className="block hover:text-slate-800"
              >
                Contact
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-slate-800">
              Account
            </h4>

            <div className="mt-3 space-y-2 text-sm text-slate-500">
              <Link
                to="/login"
                className="block hover:text-slate-800"
              >
                Customer login
              </Link>

              <Link
                to="/employee/login"
                className="block hover:text-slate-800"
              >
                Employee login
              </Link>

              <Link
                to="/admin/login"
                className="block hover:text-slate-800"
              >
                Admin login
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-100 text-xs text-slate-400">
          © {new Date().getFullYear()}{' '}
          ShopSphere. All rights
          reserved.
        </div>
      </div>
    </footer>
  )
}