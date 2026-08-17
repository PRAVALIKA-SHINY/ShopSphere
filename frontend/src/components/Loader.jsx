import React from 'react'

export default function Loader({
  label = 'Loading...',
}) {
  return (
    <div className="min-h-[300px] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-9 h-9 rounded-full border-4 border-slate-200 border-t-brand-500 animate-spin" />

        <p className="text-sm text-slate-500">
          {label}
        </p>
      </div>
    </div>
  )
}