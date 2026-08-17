import React, {
  useRef,
  useState,
} from 'react'

import {
  ImagePlus,
  X,
  UploadCloud,
  Star,
} from 'lucide-react'

import { productApi } from '../api/productApi'

export default function ImageUploader({
  value = [],
  onChange,
  max = 5,
}) {
  const inputRef =
    useRef(null)

  const [busy, setBusy] =
    useState(false)

  const [error, setError] =
    useState('')

  const [previews, setPreviews] =
    useState([])

  const choose = async (
    event
  ) => {
    const files = Array.from(
      event.target.files || []
    )

    event.target.value = ''

    if (!files.length) {
      return
    }

    setError('')

    if (
      value.length +
        files.length >
      max
    ) {
      setError(
        `You can add up to ${max} images.`
      )

      return
    }

    const invalid =
      files.find(
        (file) =>
          ![
            'image/jpeg',
            'image/png',
            'image/webp',
          ].includes(file.type) ||
          file.size >
            5 * 1024 * 1024
      )

    if (invalid) {
      setError(
        'Use JPG, PNG or WEBP images. Each image must be under 5 MB.'
      )

      return
    }

    const previewUrls =
      files.map((file) =>
        URL.createObjectURL(file)
      )

    setPreviews(
      previewUrls
    )

    setBusy(true)

    try {
      const response =
        await productApi.uploadImages(
          files
        )

      const urls =
        response.data.data || []

      onChange([
        ...value,
        ...urls,
      ])
    } catch (error) {
      setError(
        error.response?.data
          ?.message ||
          'Could not upload the selected images.'
      )
    } finally {
      previewUrls.forEach(
        (url) =>
          URL.revokeObjectURL(url)
      )

      setPreviews([])

      setBusy(false)
    }
  }

  const remove = (
    index
  ) => {
    onChange(
      value.filter(
        (_, i) =>
          i !== index
      )
    )
  }

  const setMain = (
    index
  ) => {
    if (index === 0) {
      return
    }

    const next = [
      ...value,
    ]

    const [item] =
      next.splice(
        index,
        1
      )

    next.unshift(item)

    onChange(next)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-3">
        <div>
          <label className="font-semibold text-sm text-ink">
            Product images
          </label>

          <p className="text-xs text-slate-500 mt-1">
            Upload up to {max}{' '}
            images. The first
            image is your main
            product image.
          </p>
        </div>

        <span className="text-xs text-slate-400">
          {value.length}/{max}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {value.map(
          (
            url,
            index
          ) => (
            <div
              key={`${url}-${index}`}
              className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 bg-slate-50 group"
            >
              <img
                src={url}
                alt={`Product ${
                  index + 1
                }`}
                className="w-full h-full object-cover"
              />

              {index ===
                0 && (
                <span className="absolute left-2 top-2 badge-soft bg-white/95 text-brand-700 shadow-sm">
                  <Star
                    size={11}
                    fill="currentColor"
                  />
                  Main
                </span>
              )}

              <div className="absolute inset-x-0 bottom-0 p-2 flex justify-between gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                <button
                  type="button"
                  onClick={() =>
                    setMain(index)
                  }
                  className="text-[11px] bg-white rounded-lg px-2 py-1 text-ink"
                >
                  Make main
                </button>

                <button
                  type="button"
                  onClick={() =>
                    remove(index)
                  }
                  className="w-7 h-7 rounded-lg bg-white text-red-500 flex items-center justify-center"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          )
        )}

        {value.length <
          max && (
          <button
            type="button"
            onClick={() =>
              inputRef.current?.click()
            }
            disabled={busy}
            className="aspect-square rounded-xl border-2 border-dashed border-brand-200 bg-brand-50 hover:bg-brand-100 text-brand-700 flex flex-col items-center justify-center gap-2 transition-colors disabled:opacity-60"
          >
            {busy ? (
              <UploadCloud
                className="animate-pulse"
                size={24}
              />
            ) : (
              <ImagePlus
                size={24}
              />
            )}

            <span className="text-xs font-semibold">
              {busy
                ? 'Uploading…'
                : 'Add image'}
            </span>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="hidden"
        onChange={choose}
      />

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
          {error}
        </p>
      )}

      {previews.length >
        0 && (
        <div className="flex gap-2 text-xs text-slate-500">
          Uploading{' '}
          {previews.length}{' '}
          image
          {previews.length >
          1
            ? 's'
            : ''}
          …
        </div>
      )}
    </div>
  )
}