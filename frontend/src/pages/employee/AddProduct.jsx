// IMPORTS

import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Save,
  Upload,
  X,
  Trash2,
  Plus,
} from 'lucide-react'

import Price from '../../components/Price'
import { productApi } from '../../api/productApi'
import { categoryApi } from '../../api/categoryApi'
import { brandApi } from '../../api/brandApi'
import Loader from '../../components/Loader'


// FALLBACK IMAGE

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400'


// EMPTY FORM

const emptyForm = {
  code: '',
  name: '',
  description: '',
  price: '',
  discount: '0',
  stock: '0',
  categoryId: '',
  brandId: '',
  specifications: '',
  status: 'ACTIVE',
}


// MAIN COMPONENT

export default function AddProduct() {

  // URL / NAVIGATION

  const { id } = useParams()
  const navigate = useNavigate()

  const editMode = Boolean(id)


  // FORM STATE

  const [form, setForm] = useState(emptyForm)


  // PRODUCT STATE

  const [product, setProduct] = useState(null)


  // CATEGORY / BRAND STATE

  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])


  // EXISTING IMAGES

  const [existingImages, setExistingImages] = useState([])


  // NEW IMAGES

  const [newImages, setNewImages] = useState([])


  // IMAGE URLS

  const [imageUrls, setImageUrls] = useState([])


  // LOADING / SAVING

  const [loading, setLoading] = useState(editMode)
  const [saving, setSaving] = useState(false)


  // ERROR / SUCCESS

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')


  // LOAD DATA

  useEffect(() => {
    loadOptions()

    if (editMode) {
      loadProduct()
    } else {
      setLoading(false)
    }
  }, [id, editMode])


  // LOAD PRODUCT

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

      // LOAD FORM VALUES

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

        specifications: data.specifications || '',
        status: data.status || 'ACTIVE',
      })

      // LOAD EXISTING IMAGES

      const images = Array.isArray(data.images)
        ? data.images
        : []

      console.log('EXISTING PRODUCT IMAGES:', images)

      setExistingImages(images)

    } catch (err) {
      console.error('Could not load product:', err)

      setError(
        err?.response?.data?.message ||
        'Could not load product.'
      )

    } finally {
      setLoading(false)
    }
  }


  // LOAD CATEGORIES AND BRANDS

  const loadOptions = async () => {
    try {
      const [
        categoryResponse,
        brandResponse,
      ] = await Promise.all([
        categoryApi.getAll(),
        brandApi.getAll(),
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
        'Could not load categories and brands:',
        err
      )

      setError(
        err?.response?.data?.message ||
        'Could not load categories and brands.'
      )
    }
  }


  // FORM CHANGE

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target

    setForm((current) => ({
      ...current,
      [name]: value,
    }))
  }


  // HANDLE IMAGE UPLOAD

  const handleImageUpload = (event) => {
    const files = Array.from(
      event.target.files || []
    )

    if (!files.length) {
      return
    }

    // CHECK MAXIMUM IMAGE COUNT

    const totalImages =
      existingImages.length +
      newImages.length +
      imageUrls.filter(Boolean).length

    if (totalImages + files.length > 5) {
      setError(
        'You can have a maximum of 5 product images.'
      )

      event.target.value = ''

      return
    }

    // VALIDATE FILES

    const validFiles = []
    const invalidFiles = []

    files.forEach((file) => {
      const validType = [
        'image/jpeg',
        'image/png',
        'image/webp',
      ].includes(file.type)

      const validSize =
        file.size <= 5 * 1024 * 1024

      if (validType && validSize) {
        validFiles.push(file)
      } else {
        invalidFiles.push(file)
      }
    })

    // INVALID FILE

    if (invalidFiles.length > 0) {
      setError(
        'Only JPG, PNG or WEBP images up to 5 MB are allowed.'
      )
    } else {
      setError('')
    }

    // CREATE LOCAL PREVIEWS

    const previews = validFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }))

    setNewImages((current) => [
      ...current,
      ...previews,
    ])

    // RESET FILE INPUT

    event.target.value = ''
  }


  // REMOVE EXISTING IMAGE

  const removeExistingImage = (index) => {
    setExistingImages((current) =>
      current.filter((_, i) => i !== index)
    )
  }


  // REMOVE NEW IMAGE

  const removeNewImage = (index) => {
    setNewImages((current) => {
      const image = current[index]

      if (image?.preview) {
        URL.revokeObjectURL(image.preview)
      }

      return current.filter((_, i) => i !== index)
    })
  }


  // ADD IMAGE URL

  const addImageUrl = () => {
    setImageUrls((current) => [
      ...current,
      '',
    ])
  }


  // UPDATE IMAGE URL

  const updateImageUrl = (index, value) => {
    setImageUrls((current) =>
      current.map((url, i) =>
        i === index
          ? value
          : url
      )
    )
  }


  // REMOVE IMAGE URL

  const removeImageUrl = (index) => {
    setImageUrls((current) =>
      current.filter((_, i) => i !== index)
    )
  }


  // VALIDATE FORM

  const validate = () => {
    if (!form.name.trim()) {
      return 'Product name is required.'
    }

    if (
      !form.price ||
      Number(form.price) < 0
    ) {
      return 'Please enter a valid price.'
    }

    if (
      Number(form.discount) < 0 ||
      Number(form.discount) > 100
    ) {
      return 'Discount must be between 0 and 100.'
    }

    if (Number(form.stock) < 0) {
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


  // HANDLE SUBMIT

  const handleSubmit = async (event) => {
    event.preventDefault()

    setError('')
    setSuccess('')

    // VALIDATE

    const validationError = validate()

    if (validationError) {
      setError(validationError)
      return
    }

    try {
      setSaving(true)

      // UPLOAD NEW IMAGES

      let uploadedImageUrls = []

      if (newImages.length > 0) {
        setSuccess(
          'Uploading product images...'
        )

        const files = newImages.map(
          (image) => image.file
        )

        console.log(
          'UPLOADING FILES:',
          files
        )

        const uploadResponse =
          await productApi.uploadImages(files)

        console.log(
          'IMAGE UPLOAD RESPONSE:',
          uploadResponse
        )

        const uploadedData =
          uploadResponse?.data?.data

        if (!Array.isArray(uploadedData)) {
          throw new Error(
            'Image upload did not return image URLs.'
          )
        }

        uploadedImageUrls = uploadedData

        console.log(
          'UPLOADED IMAGE URLS:',
          uploadedImageUrls
        )
      }


      // ADD MANUAL IMAGE URLS

      const additionalUrls =
        imageUrls
          .map((url) => url.trim())
          .filter(Boolean)


      // BUILD FINAL IMAGE LIST

      const finalImages = [
        ...existingImages,
        ...uploadedImageUrls,
        ...additionalUrls,
      ]

      console.log(
        'FINAL IMAGE LIST:',
        finalImages
      )


      // BUILD PRODUCT REQUEST

      const request = {
        code: form.code.trim(),
        name: form.name.trim(),
        description: form.description.trim(),

        price: Number(form.price),

        discount:
          Number(form.discount || 0),

        stock:
          Number(form.stock || 0),

        categoryId:
          Number(form.categoryId),

        brandId:
          Number(form.brandId),

        specifications:
          form.specifications.trim(),

        status:
          form.status,

        images:
          finalImages,
      }


      // DEBUG STOCK

      console.log(
        'STOCK BEING SENT TO BACKEND:',
        request.stock
      )


      // DEBUG COMPLETE REQUEST

      console.log(
        'PRODUCT UPDATE REQUEST:',
        request
      )


      // CREATE OR UPDATE PRODUCT

      setSuccess(
        editMode
          ? 'Saving product changes...'
          : 'Creating product...'
      )

      if (editMode) {
        const response =
          await productApi.update(
            id,
            request
          )

        console.log(
          'PRODUCT UPDATE RESPONSE:',
          response
        )

      } else {
        const response =
          await productApi.create(request)

        console.log(
          'PRODUCT CREATE RESPONSE:',
          response
        )
      }


      // CLEANUP PREVIEWS

      newImages.forEach((image) => {
        if (image.preview) {
          URL.revokeObjectURL(
            image.preview
          )
        }
      })

      setNewImages([])


      // SUCCESS

      setSuccess(
        editMode
          ? 'Product updated successfully.'
          : 'Product created successfully.'
      )


      // RETURN TO PRODUCTS

      setTimeout(() => {
        navigate('/employee/products')
      }, 800)

    } catch (err) {
      console.error(
        'Could not save product:',
        err
      )

      console.error(
        'BACKEND RESPONSE:',
        err?.response?.data
      )

      setError(
        err?.response?.data?.message ||
        err?.message ||
        'Could not save product.'
      )

    } finally {
      setSaving(false)
    }
  }


  // LOADING

  if (loading) {
    return (
      <Loader
        label="Loading product..."
      />
    )
  }


  // PRODUCT NOT FOUND

  if (editMode && !product) {
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


  // PRICE PREVIEW

  const previewPrice =
    Number(form.price || 0) *
    (
      1 -
      Number(form.discount || 0) / 100
    )


  // TOTAL IMAGE COUNT

  const totalImageCount =
    existingImages.length +
    newImages.length +
    imageUrls.filter(Boolean).length


  // MAIN UI

  return (
    <div className="max-w-5xl mx-auto space-y-7">

      {/* HEADER */}

      <div className="flex items-center gap-4">

        <Link
          to="/employee/products"
          className="w-10 h-10 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:bg-slate-50"
        >
          <ArrowLeft size={18} />
        </Link>

        <div className="min-w-0">

          <p className="text-xs uppercase tracking-[0.18em] text-slate-400 font-semibold">
            Catalogue
          </p>

          <h1 className="text-3xl font-semibold text-slate-800 mt-1">
            {editMode
              ? 'Edit Product'
              : 'Add Product'}
          </h1>

          {editMode && product && (
            <p className="text-sm text-slate-500 mt-1 truncate">
              Editing {product.name}
            </p>
          )}

        </div>

      </div>


      {/* ERROR */}

      {error && (
        <div className="rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-600">
          {error}
        </div>
      )}


      {/* SUCCESS */}

      {success && (
        <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {success}
        </div>
      )}


      {/* PRODUCT PREVIEW */}

      {editMode && product && (
        <div className="bg-white border border-slate-100 rounded-2xl p-5">

          <div className="flex items-center gap-4">

            <img
              src={
                existingImages[0] ||
                newImages[0]?.preview ||
                FALLBACK_IMAGE
              }
              alt={product.name}
              className="w-20 h-20 rounded-xl object-cover bg-slate-100"
            />

            <div>

              <p className="font-semibold text-slate-800">
                {product.name}
              </p>

              <p className="text-xs text-slate-400 mt-1">
                Product code: {product.code}
              </p>

              <div className="flex items-center gap-3 mt-2">

                <span className="text-sm font-semibold text-slate-800">
                  <Price value={previewPrice} />
                </span>

                {Number(form.discount) > 0 && (
                  <span className="text-xs text-slate-400">
                    {form.discount}% discount
                  </span>
                )}

              </div>

            </div>

          </div>

        </div>
      )}


      {/* FORM */}

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >

        {/* BASIC INFORMATION */}

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
                onChange={handleChange}
                className="input-field"
                required
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
                value={form.description}
                onChange={handleChange}
                rows={5}
                className="input-field resize-none"
              />

            </div>

          </div>

        </section>


        {/* PRICE AND STOCK */}

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
                value={form.price}
                onChange={handleChange}
                className="input-field"
                required
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
                value={form.discount}
                onChange={handleChange}
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
                value={form.stock}
                onChange={handleChange}
                className="input-field"
              />

            </div>

          </div>

        </section>


        {/* CATEGORY AND BRAND */}

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
                value={form.categoryId}
                onChange={handleChange}
                className="input-field"
                required
              >

                <option value="">
                  Select category
                </option>

                {categories.map((category) => (
                  <option
                    key={category.id}
                    value={category.id}
                  >
                    {category.name}
                  </option>
                ))}

              </select>

            </div>


            <div>

              <label className="label">
                Brand *
              </label>

              <select
                name="brandId"
                value={form.brandId}
                onChange={handleChange}
                className="input-field"
                required
              >

                <option value="">
                  Select brand
                </option>

                {brands.map((brand) => (
                  <option
                    key={brand.id}
                    value={brand.id}
                  >
                    {brand.name}
                  </option>
                ))}

              </select>

            </div>

          </div>

        </section>


        {/* PRODUCT IMAGES */}

        <section className="bg-white border border-slate-100 rounded-2xl p-6">

          <div className="mb-6">

            <h2 className="font-semibold text-slate-800">
              Product Images
            </h2>

            <p className="text-sm text-slate-400 mt-1">
              Click the upload box to add product images.
              The first image is the main product image.
            </p>

          </div>


          {/* IMAGE GRID */}

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">


            {/* EXISTING IMAGES */}

            {existingImages.map((image, index) => (

              <div
                key={`existing-${index}`}
                className="relative aspect-square rounded-xl overflow-hidden bg-slate-100 border border-slate-200 group"
              >

                <img
                  src={image}
                  alt={`Product ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(event) => {
                    event.currentTarget.src =
                      FALLBACK_IMAGE
                  }}
                />

                {index === 0 && (
                  <div className="absolute left-2 bottom-2 px-2 py-1 rounded-md bg-slate-900/80 text-white text-[10px]">
                    Main Image
                  </div>
                )}

                <button
                  type="button"
                  onClick={() =>
                    removeExistingImage(index)
                  }
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 text-rose-500 flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={15} />
                </button>

              </div>

            ))}


            {/* NEW IMAGES */}

            {newImages.map((image, index) => (

              <div
                key={`new-${index}`}
                className="relative aspect-square rounded-xl overflow-hidden bg-slate-100 border border-slate-200 group"
              >

                <img
                  src={image.preview}
                  alt={`New product ${index + 1}`}
                  className="w-full h-full object-cover"
                />

                <div className="absolute bottom-2 left-2 px-2 py-1 rounded-md bg-slate-900/80 text-white text-[10px]">
                  New
                </div>

                <button
                  type="button"
                  onClick={() =>
                    removeNewImage(index)
                  }
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 text-rose-500 flex items-center justify-center shadow"
                >
                  <X size={15} />
                </button>

              </div>

            ))}


            {/* CLICKABLE UPLOAD BOX */}

            {totalImageCount < 5 && (

              <label
                className="aspect-square rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-brand-50 hover:border-brand-300 cursor-pointer flex flex-col items-center justify-center text-center p-4 transition-colors"
              >

                <Upload
                  size={30}
                  className="text-slate-400 mb-3"
                />

                <p className="text-sm font-semibold text-slate-600">
                  Upload Image
                </p>

                <p className="text-xs text-slate-400 mt-1">
                  Click here to choose
                </p>

                <p className="text-[11px] text-slate-400 mt-2">
                  JPG, PNG or WEBP
                </p>

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />

              </label>

            )}

          </div>


          {/* IMAGE COUNT */}

          <div className="mt-4 text-xs text-slate-400">
            {totalImageCount}/5 images
          </div>


          {/* IMAGE URL SECTION */}

          <div className="mt-7 border-t border-slate-100 pt-6">

            <div className="flex items-center justify-between mb-4">

              <div>

                <p className="text-sm font-semibold text-slate-700">
                  Add Image URL
                </p>

                <p className="text-xs text-slate-400 mt-1">
                  Optional external image URL.
                </p>

              </div>

              <button
                type="button"
                onClick={addImageUrl}
                className="text-sm font-medium text-slate-700 flex items-center gap-1"
              >
                <Plus size={15} />
                Add URL
              </button>

            </div>

            <div className="space-y-3">

              {imageUrls.map((url, index) => (

                <div
                  key={index}
                  className="flex gap-2"
                >

                  <input
                    value={url}
                    onChange={(event) =>
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
                      removeImageUrl(index)
                    }
                    className="w-11 rounded-xl border border-slate-200 text-rose-500 flex items-center justify-center"
                  >
                    <Trash2 size={16} />
                  </button>

                </div>

              ))}

            </div>

          </div>

        </section>


        {/* SPECIFICATIONS */}

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
            value={form.specifications}
            onChange={handleChange}
            rows={6}
            className="input-field resize-none"
          />

        </section>


        {/* STATUS */}

        <section className="bg-white border border-slate-100 rounded-2xl p-6">

          <div className="mb-5">

            <h2 className="font-semibold text-slate-800">
              Product Status
            </h2>

            <p className="text-sm text-slate-400 mt-1">
              Control whether customers can purchase this product.
            </p>

          </div>

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="input-field max-w-md"
          >

            <option value="ACTIVE">
              Active
            </option>

            <option value="INACTIVE">
              Inactive
            </option>

            <option value="DISCONTINUED">
              Discontinued
            </option>

            <option value="OUT_OF_STOCK">
              Out of Stock
            </option>

          </select>

        </section>


        {/* FOOTER */}

        <div className="flex justify-end gap-3 pb-10">

          <Link
            to="/employee/products"
            className="px-5 py-3 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 rounded-xl bg-slate-800 text-white text-sm font-medium hover:bg-slate-700 disabled:opacity-50 flex items-center gap-2"
          >

            <Save size={17} />

            {saving
              ? editMode
                ? 'Saving Changes...'
                : 'Creating Product...'
              : editMode
                ? 'Save Changes'
                : 'Create Product'}

          </button>

        </div>

      </form>

    </div>
  )
}