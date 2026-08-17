import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import {
  ArrowRight,
  Truck,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Shirt,
  UserRound,
  Gem,
  Footprints,
  Sparkle,
  Heart,
  ShoppingBag,
  CircleDot,
} from 'lucide-react'

import { productApi } from '../api/productApi'
import { categoryApi } from '../api/categoryApi'

import ProductCard from '../components/ProductCard'
import Loader from '../components/Loader'


export default function Home() {

  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)


  useEffect(() => {

    Promise.all([
      productApi.getAll(0, 8, 'newest'),
      categoryApi.getAll(),
    ])

      .then(([productsResponse, categoriesResponse]) => {

        setProducts(
          productsResponse?.data?.data?.content || []
        )

        setCategories(
          categoriesResponse?.data?.data || []
        )

      })

      .catch((error) => {
        console.error(
          'Failed to load ShopSphere home data:',
          error
        )
      })

      .finally(() => {
        setLoading(false)
      })

  }, [])


  return (

    <div className="bg-white">

      {/* =====================================================
          HERO SECTION
      ====================================================== */}

      <section className="bg-gradient-to-r from-[#F4FAFC] via-white to-[#FFF7F8] border-b border-slate-100">

        <div className="max-w-[1440px] mx-auto px-6 py-10 md:py-14">

          <div className="grid lg:grid-cols-[1.05fr_.95fr] gap-10 items-center">

            {/* HERO CONTENT */}

            <div className="max-w-xl">

              <span className="eyebrow">
                The ShopSphere edit
              </span>


              <h1 className="text-4xl md:text-6xl font-display font-semibold leading-[1.05] mt-4 text-[#18344A]">

                Pretty things.
                <br />

                <span className="text-[#4F8197]">
                  Practical choices.
                </span>

              </h1>


              <p className="text-slate-500 text-base md:text-lg leading-7 mt-5 max-w-lg">

                Discover everyday products, fresh finds
                and little upgrades for your routine —
                all in one easy shopping space.

              </p>


              <div className="flex flex-wrap gap-3 mt-7">

                <Link
                  to="/shop"
                  className="btn-primary"
                >

                  Shop now

                  <ArrowRight size={17} />

                </Link>


                <Link
                  to="/register"
                  className="btn-secondary"
                >

                  Create account

                </Link>

              </div>


              <div className="flex flex-wrap gap-5 mt-8 text-xs text-slate-500">

                <span className="flex items-center gap-2">

                  <ShieldCheck
                    size={16}
                    className="text-[#78A99D]"
                  />

                  Secure checkout

                </span>


                <span className="flex items-center gap-2">

                  <Truck
                    size={16}
                    className="text-[#6D9DB3]"
                  />

                  Delivery options

                </span>

              </div>

            </div>


            {/* HERO IMAGE */}

            <div className="relative">

              <div className="rounded-3xl overflow-hidden border-8 border-white shadow-lift">

                <img
                  src="https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=1200"
                  alt="ShopSphere collection"
                  className="w-full h-[330px] md:h-[460px] object-cover"
                />

              </div>


              <div className="absolute -bottom-5 left-5 bg-white rounded-2xl shadow-card border border-slate-100 px-4 py-3 flex items-center gap-3">

                <div className="w-10 h-10 rounded-xl bg-[#FFF0F2] flex items-center justify-center text-[#D88C9A]">

                  <Sparkles size={18} />

                </div>


                <div>

                  <p className="text-xs text-slate-400">
                    Fresh pick
                  </p>

                  <p className="text-sm font-semibold text-[#18344A]">
                    New arrivals every week
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          TRUST BAR
      ====================================================== */}

      <section className="bg-white border-b border-slate-100">

        <div className="max-w-[1440px] mx-auto px-6 py-5">

          <div className="grid sm:grid-cols-3 gap-5">

            <Trust
              icon={<Truck size={19} />}
              title="Convenient delivery"
              text="Easy order tracking"
            />


            <Trust
              icon={<RotateCcw size={19} />}
              title="Simple returns"
              text="Fuss-free shopping"
            />


            <Trust
              icon={<ShieldCheck size={19} />}
              title="Secure shopping"
              text="Safe & reliable experience"
            />

          </div>

        </div>

      </section>


      {/* =====================================================
          SHOP BY CATEGORY
          NO IMAGES
      ====================================================== */}

      {categories.length > 0 && (

        <section className="max-w-[1440px] mx-auto px-6 py-14">

          <div className="flex items-end justify-between mb-7">

            <div>

              <span className="eyebrow">
                Explore
              </span>


              <h2 className="section-title mt-2">
                Shop by category
              </h2>

            </div>


            <Link
              to="/shop"
              className="hidden sm:flex items-center gap-1 text-sm font-semibold text-[#4F8197] hover:text-[#315F75]"
            >

              View all

              <ArrowRight size={15} />

            </Link>

          </div>


          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">

            {categories
              .slice(0, 6)
              .map((category, index) => (

                <CategoryCard
                  key={category.id}
                  category={category}
                  index={index}
                />

              ))}

          </div>

        </section>

      )}


      {/* =====================================================
          TRENDING PRODUCTS
      ====================================================== */}

      <section className="max-w-[1440px] mx-auto px-6 pb-14">

        <div className="flex items-end justify-between mb-7">

          <div>

            <span className="eyebrow">
              Fresh picks
            </span>


            <h2 className="section-title mt-2">
              Trending now
            </h2>


            <p className="text-sm text-slate-500 mt-1">
              Popular products from the latest catalogue.
            </p>

          </div>


          <Link
            to="/shop"
            className="hidden sm:flex items-center gap-1 text-sm font-semibold text-[#4F8197] hover:text-[#315F75]"
          >

            View all

            <ArrowRight size={15} />

          </Link>

        </div>


        {loading ? (

          <Loader label="Loading products…" />

        ) : products.length === 0 ? (

          <div className="py-16 text-center">

            <ShoppingBag
              size={40}
              className="mx-auto text-slate-300"
            />

            <h3 className="font-semibold text-slate-700 mt-4">
              No products available yet
            </h3>

            <p className="text-sm text-slate-400 mt-1">
              New products will appear here soon.
            </p>

          </div>

        ) : (

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-9">

            {products.map((product) => (

              <ProductCard
                key={product.id}
                product={product}
              />

            ))}

          </div>

        )}

      </section>


      {/* =====================================================
          JOIN SHOPSPHERE
      ====================================================== */}

      <section className="bg-[#F2F8F7] border-y border-[#DCEDEA]">

        <div className="max-w-5xl mx-auto px-6 py-14 text-center">

          <span className="eyebrow">
            ShopSphere membership
          </span>


          <h2 className="text-3xl md:text-4xl font-display font-semibold mt-2 text-[#18344A]">

            Your favourites,
            saved in one place.

          </h2>


          <p className="text-slate-500 max-w-xl mx-auto mt-3">

            Create an account to save products,
            manage your bag and keep track of every order.

          </p>


          <Link
            to="/register"
            className="btn-primary mt-6"
          >

            Join ShopSphere

          </Link>

        </div>

      </section>

    </div>

  )
}


/* =========================================================
   CATEGORY CARD
========================================================= */

function CategoryCard({ category, index }) {

  const name =
    category?.name?.toLowerCase() || ''


  let Icon = CircleDot

  if (
    name.includes('women') ||
    name.includes('woman') ||
    name.includes('fashion')
  ) {
    Icon = Shirt
  }

  else if (
    name.includes('men') ||
    name.includes('man')
  ) {
    Icon = UserRound
  }

  else if (
    name.includes('accessor') ||
    name.includes('jewel') ||
    name.includes('bag')
  ) {
    Icon = Gem
  }

  else if (
    name.includes('foot') ||
    name.includes('shoe')
  ) {
    Icon = Footprints
  }

  else if (
    name.includes('makeup') ||
    name.includes('beauty') ||
    name.includes('cosmetic')
  ) {
    Icon = Sparkle
  }

  else if (
    name.includes('skin') ||
    name.includes('care')
  ) {
    Icon = Heart
  }


  const backgrounds = [

    'bg-[#F3F8FA] border-[#DDECEF] text-[#628EA1]',

    'bg-[#FFF5F6] border-[#F5DEE2] text-[#C98591]',

    'bg-[#F2F8F5] border-[#DCEBE2] text-[#6D9D89]',

    'bg-[#FFF9F0] border-[#F2E6CC] text-[#B69561]',

    'bg-[#F5F3FA] border-[#E4DFF0] text-[#8B7FA6]',

    'bg-[#F1F7FA] border-[#D8E8EF] text-[#638CA0]',

  ]


  const colorClass =
    backgrounds[index % backgrounds.length]


  return (

    <Link
      to={`/shop?category=${category.id}`}
      className="group"
    >

      <div
        className={`
          h-[150px]
          md:h-[170px]
          rounded-2xl
          border
          flex
          flex-col
          items-center
          justify-center
          transition-all
          duration-300
          group-hover:-translate-y-1
          group-hover:shadow-soft
          ${colorClass}
        `}
      >

        <div className="w-16 h-16 rounded-full bg-white/80 flex items-center justify-center shadow-sm">

          <Icon size={30} strokeWidth={1.6} />

        </div>


        <p className="text-sm font-semibold mt-4 text-slate-700">

          {category.name}

        </p>


        <span className="text-[11px] text-slate-400 mt-1">

          Explore

        </span>

      </div>

    </Link>

  )
}


/* =========================================================
   TRUST COMPONENT
========================================================= */

function Trust({ icon, title, text }) {

  return (

    <div className="flex items-center justify-center gap-3">

      <div className="w-9 h-9 rounded-xl bg-[#F3F8FA] text-[#628EA1] flex items-center justify-center">

        {icon}

      </div>


      <div>

        <p className="font-semibold text-sm text-slate-700">
          {title}
        </p>

        <p className="text-xs text-slate-400">
          {text}
        </p>

      </div>

    </div>

  )
}