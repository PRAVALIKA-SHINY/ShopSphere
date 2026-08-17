import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      <div className="text-center max-w-lg">

        <div className="text-8xl font-display font-bold text-brand-100">
          404
        </div>

        <h1 className="text-3xl font-display font-semibold text-slate-800 mt-4">
          Page not found
        </h1>

        <p className="text-slate-500 mt-3 leading-6">
          The page you're looking for doesn't exist
          or may have been moved.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-3 mt-7">
          <Link
            to="/"
            className="btn-primary flex items-center justify-center gap-2"
          >
            <ArrowLeft size={17} />
            Back home
          </Link>

          <Link
            to="/shop"
            className="h-11 px-5 rounded-xl border border-slate-200 text-slate-700 font-semibold flex items-center justify-center gap-2 hover:bg-slate-50"
          >
            <Search size={17} />
            Browse products
          </Link>
        </div>
      </div>
    </div>
  )
}