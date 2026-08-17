import React, {
  useCallback,
  useEffect,
  useState,
} from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal } from 'lucide-react'
import { productApi } from '../api/productApi'
import { categoryApi } from '../api/categoryApi'
import { brandApi } from '../api/brandApi'
import ProductCard from '../components/ProductCard'
import Loader from '../components/Loader'

export default function Shop() {
  const [params, setParams] = useSearchParams()

  const [products, setProducts] = useState([])
  const [cats, setCats] = useState([])
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState(false)
  const [page, setPage] = useState(0)
  const [total, setTotal] = useState(0)

  const search = params.get('search') || ''
  const category = params.get('category') || ''
  const brand = params.get('brand') || ''
  const minPrice = params.get('minPrice') || ''
  const maxPrice = params.get('maxPrice') || ''
  const sort = params.get('sort') || 'newest'

  useEffect(() => {
    Promise.all([
      categoryApi.getAll(),
      brandApi.getAll(),
    ])
      .then(([c, b]) => {
        setCats(c.data.data || [])
        setBrands(b.data.data || [])
      })
      .catch(() => {})
  }, [])

  const load = useCallback(async () => {
    setLoading(true)

    try {
      let response

      if (search) {
        response = await productApi.search(
          search,
          page,
          12,
          sort
        )
      } else if (
        category ||
        brand ||
        minPrice ||
        maxPrice
      ) {
        response = await productApi.filter({
          categoryId: category || undefined,
          brandId: brand || undefined,
          minPrice: minPrice || undefined,
          maxPrice: maxPrice || undefined,
          sort,
          page,
          size: 12,
        })
      } else {
        response = await productApi.getAll(
          page,
          12,
          sort
        )
      }

      setProducts(response.data.data.content || [])
      setTotal(response.data.data.totalPages || 0)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [
    search,
    category,
    brand,
    minPrice,
    maxPrice,
    sort,
    page,
  ])

  useEffect(() => {
    setPage(0)
  }, [
    search,
    category,
    brand,
    minPrice,
    maxPrice,
    sort,
  ])

  useEffect(() => {
    load()
  }, [load])

  const setFilter = (key, value) => {
    const next = new URLSearchParams(params)

    if (value) {
      next.set(key, value)
    } else {
      next.delete(key)
    }

    setParams(next)
  }

  const clear = () => {
    setParams(search ? { search } : {})
  }

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-7">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <span className="eyebrow">
            ShopSphere store
          </span>

          <h1 className="text-3xl font-display font-semibold mt-1">
            {search
              ? `Results for “${search}”`
              : 'All products'}
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            {products.length} products on this page
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilters(!filters)}
            className="md:hidden btn-secondary !py-2.5"
          >
            <SlidersHorizontal size={16} />
            Filters
          </button>

          <select
            value={sort}
            onChange={(e) =>
              setFilter('sort', e.target.value)
            }
            className="input-field !w-auto !py-2.5 text-sm"
          >
            <option value="newest">
              Newest first
            </option>

            <option value="priceAsc">
              Price: Low to High
            </option>

            <option value="priceDesc">
              Price: High to Low
            </option>
          </select>
        </div>
      </div>

      <div className="grid md:grid-cols-[240px_1fr] gap-7">
        <aside
          className={`${filters ? 'block' : 'hidden'} md:block`}
        >
          <div className="dashboard-card p-5 md:sticky md:top-28">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold">
                Filters
              </h2>

              <button
                onClick={clear}
                className="text-xs font-semibold text-brand-700"
              >
                Clear
              </button>
            </div>

            <div className="mb-7">
              <p className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-3">
                Category
              </p>

              <div className="space-y-2">
                {cats.map((c) => (
                  <label
                    key={c.id}
                    className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="cat"
                      checked={category == c.id}
                      onChange={() =>
                        setFilter('category', c.id)
                      }
                      className="accent-[#82AFCF]"
                    />

                    {c.name}
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-7">
              <p className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-3">
                Brand
              </p>

              <div className="space-y-2">
                {brands.map((b) => (
                  <label
                    key={b.id}
                    className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="brand"
                      checked={brand == b.id}
                      onChange={() =>
                        setFilter('brand', b.id)
                      }
                      className="accent-[#82AFCF]"
                    />

                    {b.name}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-3">
                Price range
              </p>

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) =>
                    setFilter(
                      'minPrice',
                      e.target.value
                    )
                  }
                  className="input-field !py-2 text-sm"
                />

                <span className="text-slate-300">
                  –
                </span>

                <input
                  type="number"
                  min="0"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) =>
                    setFilter(
                      'maxPrice',
                      e.target.value
                    )
                  }
                  className="input-field !py-2 text-sm"
                />
              </div>
            </div>
          </div>
        </aside>

        <section className="min-w-0">
          {loading ? (
            <Loader label="Finding your picks…" />
          ) : products.length === 0 ? (
            <div className="dashboard-card py-20 text-center">
              <p className="font-semibold">
                No products found
              </p>

              <p className="text-sm text-slate-400 mt-1">
                Try clearing a filter or searching for
                something else.
              </p>

              <button
                onClick={clear}
                className="btn-secondary mt-5"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-9">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                  />
                ))}
              </div>

              {total > 1 && (
                <div className="flex justify-center gap-2 mt-10">
                  {Array.from({ length: total }).map(
                    (_, index) => (
                      <button
                        key={index}
                        onClick={() =>
                          setPage(index)
                        }
                        className={`w-10 h-10 rounded-xl text-sm font-semibold ${
                          page === index
                            ? 'bg-brand-500 text-white'
                            : 'bg-white border border-slate-200 text-slate-600 hover:bg-brand-50'
                        }`}
                      >
                        {index + 1}
                      </button>
                    )
                  )}
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  )
}