import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import { useTheme } from '../context/ThemeContext';
import { FiArrowRight, FiTruck, FiShield, FiRotateCcw, FiAward, FiChevronDown } from 'react-icons/fi';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await api.get('/products');
        const allowedCategories = ["Shirts", "T-Shirts", "Jeans", "Pants", "Jackets", "Traditional Wear"];
        const filtered = res.data.filter(p => allowedCategories.includes(p.categoryName));
        setFeaturedProducts(filtered.slice(0, 4));
      } catch (err) {
        console.error("Failed to load featured products", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const categories = [
    {
      id: 1, name: "Shirts", image: "/category-shirts.png",
      desc: "Formal & Casual", path: "/products?categoryId=1",
      tag: "Best Seller"
    },
    {
      id: 2, name: "T-Shirts", image: "/category-tshirts.png",
      desc: "Oversized & Polo", path: "/products?categoryId=2",
      tag: "New Arrivals"
    },
    {
      id: 3, name: "Jeans", image: "/category-jeans.png",
      desc: "Premium Denim", path: "/products?categoryId=3",
      tag: "Trending"
    },
    {
      id: 4, name: "Pants", image: "/category-pants.png",
      desc: "Chinos & Trousers", path: "/products?categoryId=3",
      tag: "Essentials"
    },
    {
      id: 5, name: "Jackets", image: "/category-jackets.png",
      desc: "Outerwear & Hoodies", path: "/products?categoryId=4",
      tag: "Premium"
    },
    {
      id: 6, name: "Traditional Wear", image: "/category-traditional.png",
      desc: "Kurtas & Sherwanis", path: "/products?categoryId=5",
      tag: "Heritage"
    },
  ];

  // ── 4 showcase cards using user-uploaded product images ──
  const showcaseProducts = [
    {
      id: "sc-1",
      image: "/cotton pique polo shirt.webp",
      name: "Cotton Piqué Polo Shirt",
      category: "T-Shirts",
      categoryColor: "#60a5fa",
      desc: "Crafted from breathable piqué cotton with a refined slim fit. Perfect for smart-casual occasions.",
      price: "₨ 2,499",
      badge: "New Arrival",
      badgeBg: "rgba(37,99,235,0.2)",
      badgeBorder: "1px solid rgba(59,130,246,0.35)",
      badgeColor: "#93c5fd",
      stars: 4,
      reviews: "128",
    },
    {
      id: "sc-2",
      image: "/oversized streat t shirt.jpg",
      name: "Oversized Street T-Shirt",
      category: "T-Shirts",
      categoryColor: "#34d399",
      desc: "Drop-shoulder oversized fit with bold street-style graphics. A wardrobe staple for the modern man.",
      price: "₨ 1,899",
      badge: "Trending",
      badgeBg: "rgba(5,150,105,0.2)",
      badgeBorder: "1px solid rgba(52,211,153,0.35)",
      badgeColor: "#6ee7b7",
      stars: 5,
      reviews: "214",
    },
    {
      id: "sc-3",
      image: "/designer nehru jacket.webp",
      name: "Designer Nehru Jacket",
      category: "Traditional Wear",
      categoryColor: "#f59e0b",
      desc: "Luxurious Nehru-collar jacket with intricate woven detailing. Ideal for festive & formal events.",
      price: "₨ 5,999",
      badge: "Premium",
      badgeBg: "rgba(245,158,11,0.18)",
      badgeBorder: "1px solid rgba(245,158,11,0.35)",
      badgeColor: "#fcd34d",
      stars: 5,
      reviews: "87",
    },
    {
      id: "sc-4",
      image: "/embroided cotton kurtha.webp",
      name: "Embroidered Cotton Kurtha",
      category: "Traditional Wear",
      categoryColor: "#c084fc",
      desc: "Hand-embroidered motifs on premium cotton fabric. A timeless South Asian classic reimagined.",
      price: "₨ 3,299",
      badge: "Heritage",
      badgeBg: "rgba(124,58,237,0.2)",
      badgeBorder: "1px solid rgba(192,132,252,0.35)",
      badgeColor: "#e9d5ff",
      stars: 4,
      reviews: "163",
    },
  ];

  return (
    <div className="flex flex-col">

      {/* ══════════════════════════════════════════
          HERO SECTION — Premium Luxury Men's Fashion
      ══════════════════════════════════════════ */}
      <header
        id="hero-section"
        className="hero-root relative w-full overflow-hidden"
        style={{ height: '100vh', minHeight: '600px' }}
      >
        {/* Dark Hero Image */}
        <div
          className="hero-bg-layer absolute top-0 right-0 h-full w-full pointer-events-none"
          style={{
            backgroundImage: "url('/hero-dark.webp')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            animation: 'kenburns 28s ease-in-out infinite alternate',
            opacity: theme === 'dark' ? 1 : 0,
            zIndex: theme === 'dark' ? 2 : 1,
            transition: 'opacity 450ms ease-in-out, filter 450ms ease-in-out',
          }}
        />

        {/* Light Hero Image */}
        <div
          className="hero-bg-layer absolute top-0 right-0 h-full w-full pointer-events-none"
          style={{
            backgroundImage: "url('/hero-light.webp')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            animation: 'kenburns 28s ease-in-out infinite alternate',
            opacity: theme === 'light' ? 1 : 0,
            zIndex: theme === 'light' ? 2 : 1,
            transition: 'opacity 450ms ease-in-out, filter 450ms ease-in-out',
          }}
        />

        {/* ── Theme-aware gradient overlay ── */}
        <div className="hero-overlay absolute inset-0 pointer-events-none" />

        {/* ── Scroll-down indicator ── */}
        <a
          href="#trust-section"
          className="hero-animate-6 absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5 hover:opacity-80 transition-opacity cursor-pointer"
          aria-label="Scroll down"
        >
          <span className="text-[10px] tracking-[0.25em] uppercase font-semibold text-slate-500">Scroll</span>
          <FiChevronDown className="text-slate-500 animate-bounce" size={16} />
        </a>
      </header>

      {/* ══════════════════════════════════════════
          TRUST BADGES
      ══════════════════════════════════════════ */}
      <section
        id="trust-section"
        className="relative z-10 -mt-1 bg-[#F8FAFC] dark:bg-[#05070B] py-16 transition-colors duration-300"
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                Icon: FiTruck,
                title: 'Free Global Delivery',
                desc: 'Free standard shipping on orders over ₨5,000.',
                color: 'indigo',
              },
              {
                Icon: FiShield,
                title: 'Secure Payment',
                desc: 'Your credentials are protected using SSL encryption.',
                color: 'blue',
              },
              {
                Icon: FiRotateCcw,
                title: '30-Day Easy Returns',
                desc: 'Not satisfied? Return or exchange within 30 days.',
                color: 'violet',
              },
              {
                Icon: FiAward,
                title: 'Premium Guarantee',
                desc: 'We source only long-staple organic cotton fibers.',
                color: 'indigo',
              },
            ].map(({ Icon, title, desc, color }, i) => (
              <div
                key={i}
                className="group flex items-start gap-4 p-6 rounded-2xl border border-slate-200 dark:border-slate-800/60 hover:border-indigo-500/30 transition-all duration-300 bg-white dark:bg-slate-900 shadow-sm dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
                style={{
                  animation: `fadeInUp 0.6s ease ${i * 0.1}s both`,
                }}
              >
                <div
                  className="flex-shrink-0 p-3 rounded-xl border"
                  style={{
                    background: `rgba(${color === 'indigo' ? '79,70,229' : color === 'blue' ? '59,130,246' : '124,58,237'},0.12)`,
                    borderColor: `rgba(${color === 'indigo' ? '79,70,229' : color === 'blue' ? '59,130,246' : '124,58,237'},0.2)`,
                    color: color === 'indigo' ? '#818cf8' : color === 'blue' ? '#60a5fa' : '#a78bfa',
                  }}
                >
                  <Icon size={22} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm mb-1">{title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CATEGORIES SECTION
      ══════════════════════════════════════════ */}
      <section
        id="categories-section"
        className="py-20 bg-[#F8FAFC] dark:bg-[#060810] transition-colors duration-300"
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          {/* Section Header */}
          <div className="flex flex-col gap-2 mb-12">
            <div className="flex items-center gap-3">
              <span className="block h-[1px] w-8 bg-indigo-500" />
              <span className="text-[11px] font-bold tracking-[0.28em] text-indigo-400 uppercase">
                Featured Categories
              </span>
            </div>
            <h2
              className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-slate-100 leading-tight"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              Shop by Wardrobe
            </h2>
            <p className="text-slate-500 text-sm max-w-lg mt-1">
              Curated collections for every occasion — from everyday essentials to statement pieces.
            </p>
          </div>

          {/* Category Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat, i) => (
              <Link
                id={`cat-card-${cat.id}`}
                key={cat.id}
                to={cat.path}
                className="group relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800/60 hover:border-indigo-500/40 transition-all duration-500 hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1 bg-white dark:bg-[#0D1117]"
                style={{
                  aspectRatio: '3/4',
                  animation: `fadeInUp 0.5s ease ${i * 0.08}s both`,
                }}
              >
                {/* Category image */}
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover object-center opacity-60 group-hover:opacity-75 group-hover:scale-105 transition-all duration-700"
                  style={{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }}
                />

                {/* Gradient overlay */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(to top, rgba(5,7,11,0.95) 0%, rgba(5,7,11,0.4) 50%, rgba(5,7,11,0.1) 100%)',
                  }}
                />

                {/* Tag badge */}
                <div className="absolute top-3 left-3 z-10">
                  <span
                    className="text-[8px] font-bold tracking-[0.15em] uppercase px-2 py-0.5 rounded-full"
                    style={{
                      background: 'rgba(79,70,229,0.2)',
                      border: '1px solid rgba(99,102,241,0.35)',
                      color: '#a5b4fc',
                    }}
                  >
                    {cat.tag}
                  </span>
                </div>

                {/* Text content */}
                <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                  <span
                    className="block font-bold text-slate-100 text-sm group-hover:text-indigo-300 transition-colors duration-300 mb-0.5"
                    style={{ fontFamily: "'Outfit', sans-serif" }}
                  >
                    {cat.name}
                  </span>
                  <span className="block text-[10px] text-slate-500 font-medium group-hover:text-slate-400 transition-colors">
                    {cat.desc}
                  </span>
                  {/* Arrow indicator */}
                  <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
                    <span className="text-[9px] font-semibold tracking-wider text-indigo-400 uppercase">Shop Now</span>
                    <FiArrowRight size={10} className="text-indigo-400" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FEATURED PRODUCTS SECTION
      ══════════════════════════════════════════ */}
      <section className="py-20 bg-[#F8FAFC] dark:bg-[#05070B] transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          {/* Section Header */}
          <div className="flex items-end justify-between gap-4 mb-12">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <span className="block h-[1px] w-8 bg-indigo-500" />
                <span className="text-[11px] font-bold tracking-[0.28em] text-indigo-400 uppercase">
                  Best Sellers
                </span>
              </div>
              <h2
                className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-slate-100 leading-tight"
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                Featured New Arrivals
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                Our most-loved pieces, handpicked for discerning gentlemen.
              </p>
            </div>
            <Link
              to="/products"
              id="btn-view-all-products"
              className="group flex items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors flex-shrink-0"
            >
              <span>View All</span>
              <FiArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* ── Showcase Cards — 4 user-uploaded product images ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
            {showcaseProducts.map((item, i) => (
              <Link
                key={item.id}
                to="/products"
                id={`showcase-card-${item.id}`}
                className="group relative flex flex-col rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800/60 hover:border-indigo-500/40 transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1.5 bg-white dark:bg-gradient-to-br dark:from-[#111827] dark:to-[#0D1117]"
                style={{
                  animation: `fadeInUp 0.55s ease ${i * 0.1}s both`,
                }}
              >
                {/* Product Image */}
                <div className="relative overflow-hidden" style={{ aspectRatio: '3/4' }}>
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                    style={{ transitionTimingFunction: 'cubic-bezier(0.4,0,0.2,1)' }}
                  />
                  {/* Overlay on hover */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-center justify-center"
                    style={{ background: 'rgba(5,7,11,0.35)' }}
                  >
                    <span
                      className="flex items-center gap-2 text-white text-xs font-bold tracking-widest uppercase px-5 py-2.5 rounded-full"
                      style={{
                        background: 'rgba(79,70,229,0.85)',
                        backdropFilter: 'blur(8px)',
                        boxShadow: '0 4px 20px rgba(79,70,229,0.4)',
                      }}
                    >
                      View Product <FiArrowRight size={12} />
                    </span>
                  </div>
                  {/* Badge */}
                  <div className="absolute top-3 left-3 z-10">
                    <span
                      className="text-[9px] font-bold tracking-[0.14em] uppercase px-2.5 py-1 rounded-full"
                      style={{
                        background: item.badgeBg,
                        border: item.badgeBorder,
                        color: item.badgeColor,
                      }}
                    >
                      {item.badge}
                    </span>
                  </div>
                </div>

                {/* Product Info */}
                <div className="flex flex-col gap-1.5 p-4 border-t border-slate-100 dark:border-slate-800/60">
                  <span
                    className="text-xs font-semibold tracking-widest uppercase"
                    style={{ color: item.categoryColor }}
                  >
                    {item.category}
                  </span>
                  <h3
                    className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-650 dark:group-hover:text-indigo-300 transition-colors leading-snug"
                    style={{ fontFamily: "'Outfit', sans-serif" }}
                  >
                    {item.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">
                    {item.desc}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                      {item.price}
                    </span>
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, s) => (
                        <svg key={s} width="10" height="10" viewBox="0 0 10 10" fill={s < item.stars ? '#f59e0b' : (theme === 'dark' ? '#1e293b' : '#cbd5e1')}>
                          <path d="M5 0.5l1.12 2.27 2.5.36-1.81 1.76.43 2.49L5 6.27 2.76 7.38l.43-2.49L1.38 3.13l2.5-.36L5 0.5z" />
                        </svg>
                      ))}
                      <span className="text-[10px] text-slate-500 ml-1">({item.reviews})</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* ── API Products (if any loaded) ── */}
          {!loading && featuredProducts.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-6">
              {featuredProducts.map((product, i) => (
                <div
                  key={product.productId}
                  style={{ animation: `fadeInUp 0.5s ease ${i * 0.1}s both` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          BRAND STRIP / CTA BANNER
      ══════════════════════════════════════════ */}
      <section
        className="py-24 relative overflow-hidden border-t border-b border-slate-200 dark:border-transparent transition-all duration-300"
        style={{
          background: theme === 'dark'
            ? 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)'
            : 'linear-gradient(135deg, #F1F5F9 0%, #E2E8F0 100%)',
        }}
      >
        {/* Decorative background circles */}
        <div
          className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 rounded-full pointer-events-none"
          style={{
            background: theme === 'dark'
              ? 'radial-gradient(circle, rgba(79,70,229,0.15) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(79,70,229,0.06) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute top-1/2 right-1/4 -translate-y-1/2 w-80 h-80 rounded-full pointer-events-none"
          style={{
            background: theme === 'dark'
              ? 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(59,130,246,0.05) 0%, transparent 70%)',
          }}
        />

        <div className="max-w-4xl mx-auto px-6 sm:px-8 text-center relative z-10">
          <span className="inline-flex items-center gap-3 mb-6">
            <span className="block h-[1px] w-8 bg-indigo-500" />
            <span className="text-[11px] font-bold tracking-[0.28em] text-indigo-400 uppercase">
              Exclusive Offer
            </span>
            <span className="block h-[1px] w-8 bg-indigo-500" />
          </span>

          <h2
            className="text-4xl sm:text-6xl font-extrabold mb-6 leading-tight"
            style={{
              fontFamily: "'Outfit', sans-serif",
              background: theme === 'dark'
                ? 'linear-gradient(135deg, #e2e8f0 0%, #93c5fd 50%, #818cf8 100%)'
                : 'linear-gradient(135deg, #0F172A 0%, #1E3A8A 50%, #2563EB 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            New Season.<br />New Style.
          </h2>

          <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            Explore our latest collection of premium men's fashion. Crafted with long-staple organic cotton for the modern gentleman.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              id="btn-cta-banner-shop"
              to="/products"
              className="group flex items-center gap-2"
              style={{
                background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
                color: '#ffffff',
                fontFamily: "'Inter', sans-serif",
                fontWeight: 700,
                fontSize: '12px',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                padding: '15px 40px',
                borderRadius: '4px',
                boxShadow: '0 8px 32px rgba(79,70,229,0.35)',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(79,70,229,0.5)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(79,70,229,0.35)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Explore Collections
              <FiArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              id="btn-cta-banner-traditional"
              to="/products?categoryId=5"
              className="transition-all duration-300"
              style={{
                color: theme === 'dark' ? '#a5b4fc' : '#4f46e5',
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                fontSize: '12px',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                padding: '14px 36px',
                borderRadius: '4px',
                border: theme === 'dark' ? '1px solid rgba(99,102,241,0.4)' : '1px solid rgba(79,70,229,0.4)',
                textDecoration: 'none',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = theme === 'dark' ? 'rgba(99,102,241,0.7)' : 'rgba(79,70,229,0.7)';
                e.currentTarget.style.background = theme === 'dark' ? 'rgba(99,102,241,0.08)' : 'rgba(79,70,229,0.08)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = theme === 'dark' ? 'rgba(99,102,241,0.4)' : 'rgba(79,70,229,0.4)';
                e.currentTarget.style.background = 'transparent';
              }}
            >
              Traditional Wear
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
