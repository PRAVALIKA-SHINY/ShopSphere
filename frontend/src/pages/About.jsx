import React from 'react'
import {
  Heart,
  ShieldCheck,
  Sparkles,
  Truck,
} from 'lucide-react'

export default function About() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">

      <section className="text-center max-w-3xl mx-auto">
        <span className="eyebrow">
          About ShopSphere
        </span>

        <h1 className="text-4xl sm:text-5xl font-display font-semibold text-slate-800 mt-3">
          Shopping made simple, beautiful and reliable.
        </h1>

        <p className="text-slate-500 leading-7 mt-5">
          ShopSphere is a modern mock e-commerce
          experience designed to make discovering
          products, managing your bag and placing
          orders feel effortless.
        </p>
      </section>

      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-12">
        <div className="dashboard-card p-6 text-center">
          <Sparkles
            size={26}
            className="mx-auto text-brand-600"
          />

          <h3 className="font-semibold text-slate-800 mt-4">
            Curated
          </h3>

          <p className="text-sm text-slate-500 mt-2">
            Products presented in a clean and easy-to-browse catalogue.
          </p>
        </div>

        <div className="dashboard-card p-6 text-center">
          <ShieldCheck
            size={26}
            className="mx-auto text-emerald-600"
          />

          <h3 className="font-semibold text-slate-800 mt-4">
            Secure
          </h3>

          <p className="text-sm text-slate-500 mt-2">
            A structured shopping experience with protected accounts.
          </p>
        </div>

        <div className="dashboard-card p-6 text-center">
          <Truck
            size={26}
            className="mx-auto text-sky-600"
          />

          <h3 className="font-semibold text-slate-800 mt-4">
            Convenient
          </h3>

          <p className="text-sm text-slate-500 mt-2">
            Simple checkout and clear order information.
          </p>
        </div>

        <div className="dashboard-card p-6 text-center">
          <Heart
            size={26}
            className="mx-auto text-rose-500"
          />

          <h3 className="font-semibold text-slate-800 mt-4">
            Customer first
          </h3>

          <p className="text-sm text-slate-500 mt-2">
            Designed around a friendly and comfortable shopping journey.
          </p>
        </div>
      </section>

      <section className="dashboard-card p-8 sm:p-10 mt-12">
        <h2 className="text-2xl font-display font-semibold text-slate-800">
          Our approach
        </h2>

        <p className="text-slate-600 leading-7 mt-4">
          ShopSphere combines a customer storefront
          with dedicated employee and administrator
          areas. Customers can browse products, manage
          their wishlist, add products to their bag,
          place mock orders and leave reviews.
        </p>

        <p className="text-slate-600 leading-7 mt-4">
          Employees can manage catalogue products and
          orders, while administrators have broader
          management capabilities for customers,
          employees and the catalogue.
        </p>
      </section>
    </div>
  )
}