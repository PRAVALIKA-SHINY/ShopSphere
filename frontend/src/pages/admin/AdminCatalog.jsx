import React, {
  useEffect,
  useState,
} from 'react'

import {
  Trash2,
  Plus,
  Layers,
  Tag,
} from 'lucide-react'

import { categoryApi } from '../../api/categoryApi'
import { brandApi } from '../../api/brandApi'
import { productApi } from '../../api/productApi'
import Loader from '../../components/Loader'
import Price from '../../components/Price'

export default function AdminCatalog() {

  const [categories, setCategories] =
    useState([])

  const [brands, setBrands] =
    useState([])

  const [products, setProducts] =
    useState([])

  const [loading, setLoading] =
    useState(true)

  const [cat, setCat] = useState({
    name: '',
    description: '',
  })

  const [brand, setBrand] = useState({
    name: '',
    description: '',
  })

  const [msg, setMsg] = useState('')


  // =========================================================
  // LOAD CATALOGUE
  // =========================================================

  const load = async () => {

    setLoading(true)
    setMsg('')

    try {

      const [
        categoriesRes,
        brandsRes,
        productsRes,
      ] = await Promise.all([

        categoryApi.getAll(),

        brandApi.getAll(),

        /*
         * IMPORTANT:
         *
         * productApi.js exposes getManageable(),
         * not manage().
         */
        productApi.getManageable(
          0,
          100
        ),

      ])


      // =====================================================
      // CATEGORIES
      // =====================================================

      const categoryData =
        categoriesRes?.data?.data ??
        categoriesRes?.data ??
        []

      setCategories(
        Array.isArray(categoryData)
          ? categoryData
          : []
      )


      // =====================================================
      // BRANDS
      // =====================================================

      const brandData =
        brandsRes?.data?.data ??
        brandsRes?.data ??
        []

      setBrands(
        Array.isArray(brandData)
          ? brandData
          : []
      )


      // =====================================================
      // PRODUCTS
      // =====================================================

      const productData =
        productsRes?.data?.data ??
        productsRes?.data ??
        []

      /*
       * Backend may return either:
       *
       * [
       *   ...
       * ]
       *
       * or Spring Page:
       *
       * {
       *   content: [...]
       * }
       */

      const productList =
        Array.isArray(productData)
          ? productData
          : Array.isArray(
              productData?.content
            )
            ? productData.content
            : []

      setProducts(productList)

    } catch (error) {

      console.error(
        'ADMIN CATALOG LOAD ERROR:',
        error
      )

      setMsg(
        error?.response?.data?.message ||
        error?.message ||
        'Could not load catalog'
      )

    } finally {

      setLoading(false)

    }
  }


  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {

    load()

  }, [])


  // =========================================================
  // CREATE CATEGORY
  // =========================================================

  const createCat = async (event) => {

    event.preventDefault()

    setMsg('')

    try {

      await categoryApi.create(cat)

      setCat({
        name: '',
        description: '',
      })

      setMsg(
        'Category created successfully.'
      )

      await load()

    } catch (error) {

      console.error(
        'CREATE CATEGORY ERROR:',
        error
      )

      setMsg(
        error?.response?.data?.message ||
        'Could not create category'
      )

    }
  }


  // =========================================================
  // CREATE BRAND
  // =========================================================

  const createBrand = async (event) => {

    event.preventDefault()

    setMsg('')

    try {

      await brandApi.create(brand)

      setBrand({
        name: '',
        description: '',
      })

      setMsg(
        'Brand created successfully.'
      )

      await load()

    } catch (error) {

      console.error(
        'CREATE BRAND ERROR:',
        error
      )

      setMsg(
        error?.response?.data?.message ||
        'Could not create brand'
      )

    }
  }


  // =========================================================
  // DELETE CATEGORY
  // =========================================================

  const handleDeleteCategory = async (
    id
  ) => {

    const confirmed =
      window.confirm(
        'Are you sure you want to delete this category?'
      )

    if (!confirmed) {
      return
    }

    try {

      await categoryApi.delete(id)

      setMsg(
        'Category deleted successfully.'
      )

      await load()

    } catch (error) {

      console.error(
        'DELETE CATEGORY ERROR:',
        error
      )

      setMsg(
        error?.response?.data?.message ||
        'Could not delete category'
      )

    }
  }


  // =========================================================
  // DELETE BRAND
  // =========================================================

  const handleDeleteBrand = async (
    id
  ) => {

    const confirmed =
      window.confirm(
        'Are you sure you want to delete this brand?'
      )

    if (!confirmed) {
      return
    }

    try {

      await brandApi.delete(id)

      setMsg(
        'Brand deleted successfully.'
      )

      await load()

    } catch (error) {

      console.error(
        'DELETE BRAND ERROR:',
        error
      )

      setMsg(
        error?.response?.data?.message ||
        'Could not delete brand'
      )

    }
  }


  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {

    return (
      <Loader
        label="Loading catalogue tools…"
      />
    )

  }


  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="space-y-6">


      {/* =====================================================
          HEADER
      ===================================================== */}

      <div>

        <span className="eyebrow">
          Catalogue settings
        </span>

        <h1 className="text-3xl font-display font-semibold mt-1">
          Categories & brands
        </h1>

        <p className="text-sm text-slate-500 mt-2">
          Maintain the structure used by
          employees while creating products.
        </p>

      </div>


      {/* =====================================================
          MESSAGE
      ===================================================== */}

      {msg && (

        <div className="rounded-xl bg-mint-50 border border-mint-100 text-mint-500 px-4 py-3 text-sm">
          {msg}
        </div>

      )}


      {/* =====================================================
          CREATE CATEGORY / BRAND
      ===================================================== */}

      <div className="grid lg:grid-cols-2 gap-5">


        {/* ===================================================
            CATEGORY
        =================================================== */}

        <form
          onSubmit={createCat}
          className="dashboard-card p-6 space-y-4"
        >

          <div className="flex items-center gap-3">

            <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">

              <Layers size={17} />

            </div>

            <div>

              <h2 className="font-semibold">
                Add category
              </h2>

              <p className="text-xs text-slate-400">
                Used in product filters.
              </p>

            </div>

          </div>


          <input
            className="input-field"
            required
            placeholder="Category name"
            value={cat.name}
            onChange={(event) =>
              setCat({
                ...cat,
                name: event.target.value,
              })
            }
          />


          <input
            className="input-field"
            placeholder="Short description"
            value={cat.description}
            onChange={(event) =>
              setCat({
                ...cat,
                description:
                  event.target.value,
              })
            }
          />


          <button
            type="submit"
            className="btn-primary"
          >

            <Plus size={16} />

            Create category

          </button>

        </form>


        {/* ===================================================
            BRAND
        =================================================== */}

        <form
          onSubmit={createBrand}
          className="dashboard-card p-6 space-y-4"
        >

          <div className="flex items-center gap-3">

            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center">

              <Tag size={17} />

            </div>

            <div>

              <h2 className="font-semibold">
                Add brand
              </h2>

              <p className="text-xs text-slate-400">
                Shown on product cards.
              </p>

            </div>

          </div>


          <input
            className="input-field"
            required
            placeholder="Brand name"
            value={brand.name}
            onChange={(event) =>
              setBrand({
                ...brand,
                name: event.target.value,
              })
            }
          />


          <input
            className="input-field"
            placeholder="Short description"
            value={brand.description}
            onChange={(event) =>
              setBrand({
                ...brand,
                description:
                  event.target.value,
              })
            }
          />


          <button
            type="submit"
            className="btn-primary"
          >

            <Plus size={16} />

            Create brand

          </button>

        </form>

      </div>


      {/* =====================================================
          CATEGORY / BRAND LISTS
      ===================================================== */}

      <div className="grid lg:grid-cols-2 gap-5">


        <List
          title="Categories"
          items={categories}
          onDelete={
            handleDeleteCategory
          }
        />


        <List
          title="Brands"
          items={brands}
          onDelete={
            handleDeleteBrand
          }
        />

      </div>


      {/* =====================================================
          CATALOGUE SNAPSHOT
      ===================================================== */}

      <div className="dashboard-card overflow-hidden">

        <div className="p-5 border-b border-slate-100">

          <h2 className="font-display text-xl font-semibold">
            Catalogue snapshot
          </h2>

          <p className="text-sm text-slate-400 mt-1">
            Recently available products.
          </p>

        </div>


        <div className="divide-y divide-slate-100">

          {products
            .slice(0, 8)
            .map((product) => (

              <div
                key={product.id}
                className="px-5 py-3 flex items-center justify-between gap-4"
              >

                <div className="min-w-0">

                  <p className="text-sm font-semibold truncate">
                    {product.name}
                  </p>

                  <p className="text-xs text-slate-400 mt-1 truncate">

                    {product.category?.name ||
                      product.categoryName ||
                      'Uncategorised'}

                    {' • '}

                    {product.brand?.name ||
                      product.brandName ||
                      'No brand'}

                  </p>

                </div>


                <span className="text-sm font-semibold flex-shrink-0">

                  <Price
                    value={
                      product.price || 0
                    }
                  />

                </span>

              </div>

            ))}


          {products.length === 0 && (

            <div className="p-8 text-center">

              <p className="text-sm text-slate-400">
                No products available.
              </p>

            </div>

          )}

        </div>

      </div>

    </div>
  )
}


/* =========================================================
   LIST COMPONENT
========================================================= */

function List({
  title,
  items,
  onDelete,
}) {

  return (

    <div className="dashboard-card p-5">

      <h2 className="font-display text-xl font-semibold mb-4">
        {title}
      </h2>


      <div className="space-y-2">

        {items.map((item) => (

          <div
            key={item.id}
            className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-3"
          >

            <span className="text-sm font-medium">
              {item.name}
            </span>


            <button
              type="button"
              onClick={() =>
                onDelete(item.id)
              }
              className="w-8 h-8 rounded-lg bg-white text-red-500 flex items-center justify-center hover:bg-red-50 transition"
              title={`Delete ${item.name}`}
            >

              <Trash2 size={14} />

            </button>

          </div>

        ))}


        {items.length === 0 && (

          <p className="text-sm text-slate-400">
            Nothing added yet.
          </p>

        )}

      </div>

    </div>

  )
}