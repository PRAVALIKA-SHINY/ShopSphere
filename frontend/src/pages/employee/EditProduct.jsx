import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Save,
  Upload,
  X,
  Trash2,
  Plus,
  Power
} from 'lucide-react'

import Price from '../../components/Price'
import { productApi } from '../../api/productApi'
import { categoryApi } from '../../api/categoryApi'
import { brandApi } from '../../api/brandApi'
import Loader from '../../components/Loader'

const MAX_IMAGES = 5
const MAX_FILE_SIZE = 5 * 1024 * 1024

const emptyForm = {
  code: '',
  name: '',
  description: '',
  price: '',
  discount: '0',
  stock: '0',
  categoryId: '',
  brandId: '',
  specifications: ''
}

const getImageUrl = (image) => {
  if (!image) {
    return ''
  }

  if (typeof image === 'string') {
    return image
  }

  if (typeof image === 'object') {
    return (
      image.url ||
      image.imageUrl ||
      image.path ||
      image.src ||
      ''
    )
  }

  return ''
}

export default function EditProduct() {
  const { id } = useParams()
  const navigate = useNavigate()

  const fileInputRef = useRef(null)

  const [form, setForm] = useState(emptyForm)
  const [product, setProduct] = useState(null)

  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])

  // Images already saved in database
  const [existingImages, setExistingImages] = useState([])

  // New images selected from computer
  const [newImages, setNewImages] = useState([])

  // Manually entered image URLs
  const [imageUrls, setImageUrls] = useState([])

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [statusLoading, setStatusLoading] = useState(false)

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Load product and options
  useEffect(() => {
    loadProduct()
    loadOptions()

    return () => {
      newImages.forEach((image) => {
        if (image?.preview) {
          URL.revokeObjectURL(image.preview)
        }
      })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  // Load product
  const loadProduct = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await productApi.getById(id)

      const data = response?.data?.data

      if (!data) {
        throw new Error('Product not found')
      }

      console.log('PRODUCT FROM BACKEND:', data)

      setProduct(data)

      setForm({
        code: data.code || '',
        name: data.name || '',
        description: data.description || '',
        price: data.price ?? '',
        discount: data.discount ?? 0,
        stock: data.stock ?? 0,

        categoryId:
          data.categoryId != null
            ? String(data.categoryId)
            : '',

        brandId:
          data.brandId != null
            ? String(data.brandId)
            : '',

        specifications:
          typeof data.specifications === 'string'
            ? data.specifications
            : data.specifications
              ? JSON.stringify(
                  data.specifications,
                  null,
                  2
                )
              : ''
      })

      // Normalize existing images
      const backendImages = Array.isArray(data.images)
        ? data.images
            .map(getImageUrl)
            .filter(Boolean)
        : []

      setExistingImages(backendImages)
    } catch (err) {
      console.error(
        'Could not load product:',
        err
      )

      setError(
        err?.response?.data?.message ||
          err?.message ||
          'Could not load product.'
      )
    } finally {
      setLoading(false)
    }
  }

  // Load categories and brands
  const loadOptions = async () => {
    try {
      const [
        categoryResponse,
        brandResponse
      ] = await Promise.all([
        categoryApi.getAll(),
        brandApi.getAll()
      ])

      const categoryData =
        categoryResponse?.data?.data

      const brandData =
        brandResponse?.data?.data

      setCategories(
        Array.isArray(categoryData)
          ? categoryData
          : categoryData?.content || []
      )

      setBrands(
        Array.isArray(brandData)
          ? brandData
          : brandData?.content || []
      )
    } catch (err) {
      console.error(
        'Could not load options:',
        err
      )

      setError(
        err?.response?.data?.message ||
          'Could not load categories and brands.'
      )
    }
  }

  // Form change
  const handleChange = (event) => {
    const {
      name,
      value
    } = event.target

    setForm((current) => ({
      ...current,
      [name]: value
    }))
  }

  // Total image count
  const totalImageCount =
    existingImages.length +
    newImages.length +
    imageUrls.filter(
      (url) => url.trim() !== ''
    ).length

  // Remaining image slots
  const remainingImageSlots =
    Math.max(
      0,
      MAX_IMAGES - totalImageCount
    )

  // Open file selector
  const openFileSelector = () => {
    if (remainingImageSlots <= 0) {
      setError(
        `You can upload a maximum of ${MAX_IMAGES} images.`
      )
      return
    }

    fileInputRef.current?.click()
  }

  // Handle selected image files
  const handleImageFiles = (files) => {
    const selectedFiles = Array.from(files || [])

    if (!selectedFiles.length) {
      return
    }

    setError('')
    setSuccess('')

    const availableSlots =
      MAX_IMAGES -
      existingImages.length -
      newImages.length -
      imageUrls.filter(
        (url) => url.trim() !== ''
      ).length

    if (availableSlots <= 0) {
      setError(
        `You can upload a maximum of ${MAX_IMAGES} images.`
      )
      return
    }

    const filesToProcess =
      selectedFiles.slice(
        0,
        availableSlots
      )

    const validFiles = []
    const invalidFiles = []

    filesToProcess.forEach((file) => {
      const isImage =
        file.type === 'image/jpeg' ||
        file.type === 'image/jpg' ||
        file.type === 'image/png' ||
        file.type === 'image/webp'

      const isUnderLimit =
        file.size <= MAX_FILE_SIZE

      if (
        isImage &&
        isUnderLimit
      ) {
        validFiles.push(file)
      } else {
        invalidFiles.push(file)
      }
    })

    if (invalidFiles.length > 0) {
      setError(
        'Only JPG, PNG or WEBP images up to 5 MB are allowed.'
      )
    }

    if (
      selectedFiles.length >
      availableSlots
    ) {
      setError(
        `Only ${availableSlots} image slot${
          availableSlots === 1 ? '' : 's'
        } remaining.`
      )
    }

    const previews = validFiles.map(
      (file) => ({
        file,
        preview: URL.createObjectURL(file)
      })
    )

    setNewImages((current) => [
      ...current,
      ...previews
    ])
  }

  // File input change
  const handleImageUpload = (event) => {
    handleImageFiles(
      event.target.files
    )

    event.target.value = ''
  }

  // Drag over
  const handleDragOver = (event) => {
    event.preventDefault()
    event.stopPropagation()
  }

  // Drop images
  const handleDrop = (event) => {
    event.preventDefault()
    event.stopPropagation()

    handleImageFiles(
      event.dataTransfer.files
    )
  }

  // Remove existing image
  const removeExistingImage = (index) => {
    setExistingImages((current) =>
      current.filter(
        (_, i) => i !== index
      )
    )
  }

  // Remove new image
  const removeNewImage = (index) => {
    setNewImages((current) => {
      const image = current[index]

      if (image?.preview) {
        URL.revokeObjectURL(
          image.preview
        )
      }

      return current.filter(
        (_, i) => i !== index
      )
    })
  }

  // Add image URL
  const addImageUrl = () => {
    if (
      totalImageCount >=
      MAX_IMAGES
    ) {
      setError(
        `You can add a maximum of ${MAX_IMAGES} images.`
      )
      return
    }

    setError('')

    setImageUrls((current) => [
      ...current,
      ''
    ])
  }

  // Update image URL
  const updateImageUrl = (
    index,
    value
  ) => {
    setImageUrls((current) =>
      current.map(
        (url, i) =>
          i === index
            ? value
            : url
      )
    )
  }

  // Remove image URL
  const removeImageUrl = (
    index
  ) => {
    setImageUrls((current) =>
      current.filter(
        (_, i) => i !== index
      )
    )
  }

  // Validate form
  const validate = () => {
    if (!form.name.trim()) {
      return 'Product name is required.'
    }

    if (
      !form.price ||
      Number(form.price) <= 0
    ) {
      return 'Please enter a valid price.'
    }

    if (
      Number(form.discount) < 0 ||
      Number(form.discount) > 100
    ) {
      return 'Discount must be between 0 and 100.'
    }

    if (
      Number(form.stock) < 0
    ) {
      return 'Stock cannot be negative.'
    }

    if (!form.categoryId) {
      return 'Please select a category.'
    }

    if (!form.brandId) {
      return 'Please select a brand.'
    }

    return ''
  }

  // Activate product
  const handleActivate = async () => {
    if (!product) {
      return
    }

    try {
      setStatusLoading(true)
      setError('')
      setSuccess('')

      await productApi.activate(
        product.id
      )

      setProduct((current) => ({
        ...current,
        active: true,
        status: 'ACTIVE'
      }))

      setSuccess(
        'Product activated successfully.'
      )
    } catch (err) {
      console.error(
        'Could not activate product:',
        err
      )

      setError(
        err?.response?.data?.message ||
          'Could not activate product.'
      )
    } finally {
      setStatusLoading(false)
    }
  }

  // Deactivate product
  const handleDeactivate = async () => {
    if (!product) {
      return
    }

    const confirmed =
      window.confirm(
        `Are you sure you want to deactivate "${product.name}"?`
      )

    if (!confirmed) {
      return
    }

    try {
      setStatusLoading(true)
      setError('')
      setSuccess('')

      await productApi.deactivate(
        product.id
      )

      setProduct((current) => ({
        ...current,
        active: false,
        status: 'INACTIVE'
      }))

      setSuccess(
        'Product deactivated successfully.'
      )
    } catch (err) {
      console.error(
        'Could not deactivate product:',
        err
      )

      setError(
        err?.response?.data?.message ||
          'Could not deactivate product.'
      )
    } finally {
      setStatusLoading(false)
    }
  }

  // Submit product changes
  const handleSubmit = async (event) => {
    event.preventDefault()

    setError('')
    setSuccess('')

    const validationError =
      validate()

    if (validationError) {
      setError(validationError)
      return
    }

    try {
      setSaving(true)

      // Upload new image files
      let uploadedImageUrls = []

      if (newImages.length > 0) {
        setSuccess(
          'Uploading product images...'
        )

        const files =
          newImages.map(
            (image) => image.file
          )

        const uploadResponse =
          await productApi.uploadImages(
            files
          )

        const uploadedData =
          uploadResponse?.data?.data

        if (
          !Array.isArray(
            uploadedData
          )
        ) {
          throw new Error(
            'Image upload did not return image URLs.'
          )
        }

        uploadedImageUrls =
          uploadedData
            .map(getImageUrl)
            .filter(Boolean)
      }

      // Add manually entered URLs
      const additionalUrls =
        imageUrls
          .map((url) =>
            url.trim()
          )
          .filter(Boolean)

      // Build final image list
      const finalImages = [
        ...existingImages,
        ...uploadedImageUrls,
        ...additionalUrls
      ].slice(
        0,
        MAX_IMAGES
      )

      // Build update request
      const request = {
        code:
          form.code.trim(),

        name:
          form.name.trim(),

        description:
          form.description.trim(),

        price:
          Number(form.price),

        discount:
          Number(
            form.discount || 0
          ),

        stock:
          Number(
            form.stock || 0
          ),

        categoryId:
          Number(
            form.categoryId
          ),

        brandId:
          Number(
            form.brandId
          ),

        specifications:
          form.specifications.trim(),

        images:
          finalImages
      }

      console.log(
        'PRODUCT UPDATE REQUEST:',
        request
      )

      setSuccess(
        'Saving product...'
      )

      await productApi.update(
        id,
        request
      )

      // Cleanup previews
      newImages.forEach(
        (image) => {
          if (image?.preview) {
            URL.revokeObjectURL(
              image.preview
            )
          }
        }
      )

      setNewImages([])
      setImageUrls([])

      setSuccess(
        'Product updated successfully.'
      )

      setTimeout(() => {
        navigate(
          '/employee/products'
        )
      }, 900)
    } catch (err) {
      console.error(
        'Could not update product:',
        err
      )

      console.error(
        'Backend response:',
        err?.response?.data
      )

      setError(
        err?.response?.data?.message ||
          err?.message ||
          'Could not update product.'
      )
    } finally {
      setSaving(false)
    }
  }

  // Loading state
  if (loading) {
    return (
      <Loader
        label="Loading product..."
      />
    )
  }

  // Product not found
  if (!product) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center">
        <h2 className="text-xl font-semibold text-slate-800">
          Product not found
        </h2>

        <p className="text-sm text-slate-400 mt-2">
          The product may have been removed
          or is no longer available.
        </p>

        <Link
          to="/employee/products"
          className="inline-flex mt-5 px-5 py-2.5 rounded-xl bg-slate-800 text-white text-sm"
        >
          Back to Products
        </Link>
      </div>
    )
  }

  // Product status
  const isActive =
    product.active !== false &&
    product.status !== 'INACTIVE' &&
    product.status !== 'DISCONTINUED'

  // Price preview
  const previewPrice =
    Number(form.price || 0) *
    (
      1 -
      Number(form.discount || 0) /
        100
    )

  return (
    <div className="max-w-5xl mx-auto space-y-7">

      {/* Header */}
      <div className="flex items-center gap-4">

        <Link
          to="/employee/products"
          className="w-10 h-10 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:bg-slate-50"
        >
          <ArrowLeft size={18} />
        </Link>

        <div className="min-w-0 flex-1">

          <p className="text-xs uppercase tracking-[0.18em] text-slate-400 font-semibold">
            Catalogue
          </p>

          <h1 className="text-3xl font-semibold text-slate-800 mt-1">
            Edit Product
          </h1>

          <p className="text-sm text-slate-500 mt-1 truncate">
            Editing {product.name}
          </p>

        </div>

        <div className="flex items-center gap-2">

          {isActive ? (
            <button
              type="button"
              onClick={
                handleDeactivate
              }
              disabled={
                statusLoading ||
                saving
              }
              className="px-4 py-2.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-600 text-sm font-medium flex items-center gap-2 hover:bg-rose-100 disabled:opacity-50"
            >
              <Power size={16} />

              {statusLoading
                ? 'Updating...'
                : 'Deactivate'}
            </button>
          ) : (
            <button
              type="button"
              onClick={
                handleActivate
              }
              disabled={
                statusLoading ||
                saving
              }
              className="px-4 py-2.5 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-600 text-sm font-medium flex items-center gap-2 hover:bg-emerald-100 disabled:opacity-50"
            >
              <Power size={16} />

              {statusLoading
                ? 'Updating...'
                : 'Activate'}
            </button>
          )}

        </div>

      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-600">
          {error}
        </div>
      )}

      {/* Success */}
      {success && (
        <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {success}
        </div>
      )}

      {/* Product preview */}
      <div className="bg-white border border-slate-100 rounded-2xl p-5">

        <div className="flex items-center gap-4">

          {existingImages[0] ? (
            <img
              src={
                existingImages[0]
              }
              alt={product.name}
              className="w-20 h-20 rounded-xl object-cover bg-slate-100"
            />
          ) : newImages[0]?.preview ? (
            <img
              src={
                newImages[0].preview
              }
              alt={product.name}
              className="w-20 h-20 rounded-xl object-cover bg-slate-100"
            />
          ) : (
            <div className="w-20 h-20 rounded-xl bg-slate-100 flex items-center justify-center">
              <Upload
                size={22}
                className="text-slate-300"
              />
            </div>
          )}

          <div className="flex-1">

            <div className="flex items-center gap-3">

              <p className="font-semibold text-slate-800">
                {product.name}
              </p>

              <span
                className={
                  isActive
                    ? 'px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600'
                    : 'px-2.5 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-600'
                }
              >
                {isActive
                  ? 'ACTIVE'
                  : 'INACTIVE'}
              </span>

            </div>

            <p className="text-xs text-slate-400 mt-1">
              Product code: {product.code}
            </p>

            <div className="flex items-center gap-3 mt-2">

              <span className="text-sm font-semibold text-slate-800">
                <Price
                  value={
                    previewPrice
                  }
                />
              </span>

              {Number(
                form.discount
              ) > 0 && (
                <span className="text-xs text-slate-400">
                  {form.discount}%
                  discount
                </span>
              )}

            </div>

          </div>

        </div>

      </div>

      {/* Form */}
      <form
        onSubmit={
          handleSubmit
        }
        className="space-y-6"
      >

        {/* Basic information */}
        <section className="bg-white border border-slate-100 rounded-2xl p-6">

          <div className="mb-6">

            <h2 className="font-semibold text-slate-800">
              Basic Information
            </h2>

            <p className="text-sm text-slate-400 mt-1">
              Update the product information.
            </p>

          </div>

          <div className="grid md:grid-cols-2 gap-5">

            <div>

              <label className="label">
                Product Name *
              </label>

              <input
                name="name"
                value={form.name}
                onChange={
                  handleChange
                }
                className="input-field"
              />

            </div>

            <div>

              <label className="label">
                Product Code
              </label>

              <input
                name="code"
                value={form.code}
                className="input-field bg-slate-50"
                readOnly
              />

            </div>

            <div className="md:col-span-2">

              <label className="label">
                Description
              </label>

              <textarea
                name="description"
                value={
                  form.description
                }
                onChange={
                  handleChange
                }
                rows={5}
                className="input-field resize-none"
              />

            </div>

          </div>

        </section>

        {/* Price and inventory */}
        <section className="bg-white border border-slate-100 rounded-2xl p-6">

          <div className="mb-6">

            <h2 className="font-semibold text-slate-800">
              Price & Inventory
            </h2>

            <p className="text-sm text-slate-400 mt-1">
              Update price, discount and available stock.
            </p>

          </div>

          <div className="grid md:grid-cols-3 gap-5">

            <div>

              <label className="label">
                Price *
              </label>

              <input
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={
                  form.price
                }
                onChange={
                  handleChange
                }
                className="input-field"
              />

            </div>

            <div>

              <label className="label">
                Discount (%)
              </label>

              <input
                name="discount"
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={
                  form.discount
                }
                onChange={
                  handleChange
                }
                className="input-field"
              />

            </div>

            <div>

              <label className="label">
                Stock
              </label>

              <input
                name="stock"
                type="number"
                min="0"
                value={
                  form.stock
                }
                onChange={
                  handleChange
                }
                className="input-field"
              />

            </div>

          </div>

        </section>

        {/* Classification */}
        <section className="bg-white border border-slate-100 rounded-2xl p-6">

          <div className="mb-6">

            <h2 className="font-semibold text-slate-800">
              Classification
            </h2>

            <p className="text-sm text-slate-400 mt-1">
              Change category or brand.
            </p>

          </div>

          <div className="grid md:grid-cols-2 gap-5">

            <div>

              <label className="label">
                Category *
              </label>

              <select
                name="categoryId"
                value={
                  form.categoryId
                }
                onChange={
                  handleChange
                }
                className="input-field"
              >

                <option value="">
                  Select category
                </option>

                {categories.map(
                  (category) => (
                    <option
                      key={
                        category.id
                      }
                      value={
                        category.id
                      }
                    >
                      {
                        category.name
                      }
                    </option>
                  )
                )}

              </select>

            </div>

            <div>

              <label className="label">
                Brand *
              </label>

              <select
                name="brandId"
                value={
                  form.brandId
                }
                onChange={
                  handleChange
                }
                className="input-field"
              >

                <option value="">
                  Select brand
                </option>

                {brands.map(
                  (brand) => (
                    <option
                      key={
                        brand.id
                      }
                      value={
                        brand.id
                      }
                    >
                      {
                        brand.name
                      }
                    </option>
                  )
                )}

              </select>

            </div>

          </div>

        </section>

        {/* Product images */}
        <section className="bg-white border border-slate-100 rounded-2xl p-6">

          <div className="mb-6">

            <h2 className="font-semibold text-slate-800">
              Product Images
            </h2>

            <p className="text-sm text-slate-400 mt-1">
              Click the upload box to add product images. The first image is the main product image.
            </p>

          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={
              handleImageUpload
            }
            className="hidden"
          />

          {/* Small upload box */}
          {totalImageCount <
            MAX_IMAGES && (
            <div
              onClick={
                openFileSelector
              }
              onDragOver={
                handleDragOver
              }
              onDrop={
                handleDrop
              }
              style={{
                width: '180px',
                height: '180px',
                minWidth: '180px',
                minHeight: '180px',
                maxWidth: '180px',
                maxHeight: '180px'
              }}
              className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 transition cursor-pointer flex items-center justify-center text-center shrink-0"
            >

              <div className="pointer-events-none">

                <div className="w-11 h-11 mx-auto rounded-full bg-white border border-slate-200 flex items-center justify-center">

                  <Upload
                    size={21}
                    className="text-slate-400"
                  />

                </div>

                <p className="text-sm font-medium text-slate-700 mt-3">
                  Upload Image
                </p>

                <p className="text-xs text-slate-400 mt-1">
                  Click here to choose
                </p>

                <p className="text-[10px] text-slate-400 mt-2">
                  JPG, PNG or WEBP
                </p>

              </div>

            </div>
          )}

          {/* Image count */}
          <div className="mt-4">

            <p className="text-sm text-slate-400">
              {totalImageCount}/{MAX_IMAGES}{' '}
              images
            </p>

          </div>

          {/* Image previews */}
          {(
            existingImages.length >
              0 ||
            newImages.length >
              0
          ) && (

            <div className="mt-6">

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">

                {/* Existing images */}
                {existingImages.map(
                  (
                    image,
                    index
                  ) => {

                    const imageUrl =
                      getImageUrl(
                        image
                      )

                    return (
                      <div
                        key={`existing-${index}`}
                        className="relative aspect-square rounded-xl overflow-hidden bg-slate-100 border border-slate-200 group"
                      >

                        <img
                          src={
                            imageUrl
                          }
                          alt={`Product ${
                            index + 1
                          }`}
                          className="w-full h-full object-cover"
                        />

                        {index ===
                          0 && (
                          <div className="absolute left-2 top-2 px-2 py-1 rounded-md bg-slate-900/80 text-white text-[10px] font-medium">
                            Main
                          </div>
                        )}

                        <div className="absolute bottom-2 left-2 px-2 py-1 rounded-md bg-white/90 text-slate-600 text-[10px]">
                          Saved
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            removeExistingImage(
                              index
                            )
                          }
                          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white text-rose-500 flex items-center justify-center shadow-md hover:bg-rose-50 transition"
                          title="Remove image"
                        >
                          <Trash2
                            size={15}
                          />
                        </button>

                      </div>
                    )
                  }
                )}

                {/* New images */}
                {newImages.map(
                  (
                    image,
                    index
                  ) => {

                    const isMain =
                      existingImages.length ===
                        0 &&
                      index === 0

                    return (
                      <div
                        key={`new-${index}`}
                        className="relative aspect-square rounded-xl overflow-hidden bg-slate-100 border border-slate-200"
                      >

                        <img
                          src={
                            image.preview
                          }
                          alt={`New product ${
                            index + 1
                          }`}
                          className="w-full h-full object-cover"
                        />

                        {isMain && (
                          <div className="absolute left-2 top-2 px-2 py-1 rounded-md bg-slate-900/80 text-white text-[10px] font-medium">
                            Main
                          </div>
                        )}

                        <div className="absolute bottom-2 left-2 px-2 py-1 rounded-md bg-slate-900/80 text-white text-[10px]">
                          New
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            removeNewImage(
                              index
                            )
                          }
                          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white text-rose-500 flex items-center justify-center shadow-md hover:bg-rose-50 transition"
                          title="Remove image"
                        >
                          <X
                            size={15}
                          />
                        </button>

                      </div>
                    )
                  }
                )}

              </div>

            </div>
          )}

          {/* Image URL section */}
          <div className="mt-7 border-t border-slate-100 pt-6">

            <div className="flex items-center justify-between mb-4">

              <div>

                <p className="text-sm font-semibold text-slate-700">
                  Add Image URL
                </p>

                <p className="text-xs text-slate-400 mt-1">
                  Optional if you want to use an external image URL.
                </p>

              </div>

              <button
                type="button"
                onClick={
                  addImageUrl
                }
                disabled={
                  totalImageCount >=
                  MAX_IMAGES
                }
                className="text-sm font-medium text-slate-700 flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed"
              >

                <Plus
                  size={15}
                />

                Add URL

              </button>

            </div>

            <div className="space-y-3">

              {imageUrls.map(
                (
                  url,
                  index
                ) => (

                  <div
                    key={index}
                    className="flex gap-2"
                  >

                    <input
                      value={url}
                      onChange={(
                        event
                      ) =>
                        updateImageUrl(
                          index,
                          event.target.value
                        )
                      }
                      placeholder="https://..."
                      className="input-field flex-1"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        removeImageUrl(
                          index
                        )
                      }
                      className="w-11 rounded-xl border border-slate-200 text-rose-500 flex items-center justify-center hover:bg-rose-50"
                    >

                      <Trash2
                        size={16}
                      />

                    </button>

                  </div>

                )
              )}

            </div>

          </div>

        </section>

        {/* Specifications */}
        <section className="bg-white border border-slate-100 rounded-2xl p-6">

          <div className="mb-6">

            <h2 className="font-semibold text-slate-800">
              Specifications
            </h2>

            <p className="text-sm text-slate-400 mt-1">
              Update additional product details.
            </p>

          </div>

          <textarea
            name="specifications"
            value={
              form.specifications
            }
            onChange={
              handleChange
            }
            rows={6}
            className="input-field resize-none"
          />

        </section>

        {/* Product status */}
        <section className="bg-white border border-slate-100 rounded-2xl p-6">

          <div className="flex items-center justify-between gap-5">

            <div>

              <h2 className="font-semibold text-slate-800">
                Product Status
              </h2>

              <p className="text-sm text-slate-400 mt-1">
                Control whether this product is available to customers.
              </p>

            </div>

            <div className="flex items-center gap-3">

              <span
                className={
                  isActive
                    ? 'px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600'
                    : 'px-3 py-1.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-600'
                }
              >
                {isActive
                  ? 'ACTIVE'
                  : 'INACTIVE'}
              </span>

              {isActive ? (
                <button
                  type="button"
                  onClick={
                    handleDeactivate
                  }
                  disabled={
                    statusLoading ||
                    saving
                  }
                  className="px-4 py-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-sm font-medium flex items-center gap-2 hover:bg-rose-100 disabled:opacity-50"
                >

                  <Power
                    size={16}
                  />

                  {statusLoading
                    ? 'Updating...'
                    : 'Deactivate'}

                </button>
              ) : (
                <button
                  type="button"
                  onClick={
                    handleActivate
                  }
                  disabled={
                    statusLoading ||
                    saving
                  }
                  className="px-4 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 text-sm font-medium flex items-center gap-2 hover:bg-emerald-100 disabled:opacity-50"
                >

                  <Power
                    size={16}
                  />

                  {statusLoading
                    ? 'Updating...'
                    : 'Activate'}

                </button>
              )}

            </div>

          </div>

        </section>

        {/* Form actions */}
        <div className="flex justify-end gap-3 pb-10">

          <Link
            to="/employee/products"
            className="px-5 py-3 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={
              saving ||
              statusLoading
            }
            className="px-6 py-3 rounded-xl bg-slate-800 text-white text-sm font-medium hover:bg-slate-700 disabled:opacity-50 flex items-center gap-2"
          >

            <Save
              size={17}
            />

            {saving
              ? 'Saving Changes...'
              : 'Save Changes'}

          </button>

        </div>

      </form>

    </div>
  )
}