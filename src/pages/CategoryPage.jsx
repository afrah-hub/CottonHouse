import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import { FiLoader, FiSlash, FiFilter } from 'react-icons/fi';

const getCategoryIcon = (name, active) => {
  const color = active ? '#fff' : '#64748b';
  const lowerName = name.toLowerCase();
  
  if (lowerName.includes('shirt') || lowerName.includes('traditional')) {
    return (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M9 3L4 7.5V13h4v11h12V13h4V7.5L19 3l-2.5 3.5C16 7.8 15.1 8.5 14 8.5s-2-.7-2.5-2L9 3z"
          stroke={color}
          strokeWidth="1.6"
          strokeLinejoin="round"
          fill="none"
        />
        <line x1="14" y1="8.5" x2="14" y2="13" stroke={color} strokeWidth="1.4" />
      </svg>
    );
  }
  
  if (lowerName.includes('pant') || lowerName.includes('jeans') || lowerName.includes('trouser') || lowerName.includes('denim')) {
    return (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M7 3h14v5l-2 15H15l-1-7-1 7H9L7 8V3z"
          stroke={color}
          strokeWidth="1.6"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    );
  }

  if (lowerName.includes('jacket') || lowerName.includes('outerwear') || lowerName.includes('coat')) {
    return (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M6 4l4-1h8l4 1v9l-2 11H6L4 13V4z"
          stroke={color}
          strokeWidth="1.6"
          strokeLinejoin="round"
          fill="none"
        />
        <path d="M12 3v21M16 3v21" stroke={color} strokeWidth="1.2" />
      </svg>
    );
  }

  // Generic tag/grid icon
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" strokeWidth="2" />
    </svg>
  );
};

const CategoryPage = () => {
  const { categorySlug } = useParams();
  const [category, setCategory] = useState(null);
  const [subCategories, setSubCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);

  // Filter States
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [priceRange, setPriceRange] = useState([10, 300]);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [sortBy, setSortBy] = useState('featured'); // featured, price-low, price-high, rating

  // List of available filter options (extracted dynamically from products)
  const [brands, setBrands] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);

  // Load category and subcategories
  useEffect(() => {
    const fetchCategoryDetails = async () => {
      setLoading(true);
      try {
        if (!categorySlug || categorySlug === 'all') {
          setCategory({
            categoryId: 0,
            name: "All Categories",
            description: "Explore our complete range of premium apparel, crafted for ultimate comfort and style.",
            bannerImage: "/category-shirts.png"
          });
          const res = await api.get('/categories');
          const formattedCats = (res.data || []).map(cat => ({
            subCategoryId: cat.categoryId || cat.id,
            subCategoryName: cat.categoryName || cat.name,
            id: cat.id,
            name: cat.name,
            slug: cat.slug,
            description: cat.description,
            image: cat.bannerImage
          }));
          setSubCategories(formattedCats);
          setSelectedSubCategory(null);
          
          fetchProductsData(0);
        } else {
          const res = await api.get(`/categories/${categorySlug}`);
          setCategory(res.data);
          setSubCategories(res.data.subCategories || []);
          setSelectedSubCategory(null); // Reset subcategory filter when category changes
          
          // Fetch products for this category
          fetchProductsData(res.data.categoryId);
        }
      } catch (err) {
        console.error("Failed to load category details", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryDetails();
  }, [categorySlug]);

  const fetchProductsData = async (catId) => {
    setProductsLoading(true);
    try {
      const url = catId ? `/products?categoryId=${catId}` : `/products`;
      const res = await api.get(url);
      setProducts(res.data);
      setFilteredProducts(res.data);

      // Dynamically extract unique brands, colors, and sizes from products
      const uniqueBrands = [...new Set(res.data.map(p => p.brand).filter(Boolean))];
      const uniqueColors = [...new Set(res.data.flatMap(p => p.colors || []).filter(Boolean))];
      const uniqueSizes = [...new Set(res.data.flatMap(p => p.sizes || []).filter(Boolean))];

      setBrands(uniqueBrands.length > 0 ? uniqueBrands : ["CottonHouse Premium"]);
      setColors(uniqueColors.length > 0 ? uniqueColors : ["White", "Black", "Blue", "Green", "Khaki"]);
      setSizes(uniqueSizes.length > 0 ? uniqueSizes : ["S", "M", "L", "XL"]);
    } catch (err) {
      console.error("Failed to load category products", err);
    } finally {
      setProductsLoading(false);
    }
  };

  // Filter and sort products on filter changes
  useEffect(() => {
    let result = [...products];

    // Filter by Subcategory or Category
    if (selectedSubCategory) {
      if (category && category.categoryId === 0) {
        result = result.filter(p => p.categoryId === selectedSubCategory.subCategoryId);
      } else {
        result = result.filter(p => p.subCategoryId === selectedSubCategory.subCategoryId);
      }
    }

    // Filter by Brand
    if (selectedBrand) {
      result = result.filter(p => p.brand === selectedBrand);
    }

    // Filter by Price Limit
    result = result.filter(p => p.price <= priceRange[1] && p.price >= priceRange[0]);

    // Filter by Color
    if (selectedColor) {
      result = result.filter(p => p.colors && p.colors.includes(selectedColor));
    }

    // Filter by Size
    if (selectedSize) {
      result = result.filter(p => p.sizes && p.sizes.includes(selectedSize));
    }

    // Sorting logic
    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    setFilteredProducts(result);
  }, [products, selectedSubCategory, selectedBrand, priceRange, selectedColor, selectedSize, sortBy]);

  const handleResetFilters = () => {
    setSelectedSubCategory(null);
    setSelectedBrand('');
    setSelectedColor('');
    setSelectedSize('');
    setPriceRange([10, 300]);
    setSortBy('featured');
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col justify-center items-center gap-4 text-slate-500 bg-[#F8FAFC] dark:bg-slate-950">
        <FiLoader className="animate-spin text-blue-600" size={32} />
        <p className="font-semibold text-sm tracking-wide">Loading premium collection...</p>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-[70vh] flex flex-col justify-center items-center gap-4 text-slate-500 bg-[#F8FAFC] dark:bg-slate-950">
        <FiSlash size={40} className="text-red-500" />
        <p className="font-bold text-lg">Category not found</p>
        <Link to="/" className="text-blue-500 font-bold hover:underline">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="bg-[#F8FAFC] dark:bg-slate-950 min-h-screen pb-16">
      {/* ── Breadcrumb Header ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-6 pb-2">
        <nav className="flex items-center gap-1.5 text-[11px] text-slate-500 font-semibold">
          <Link to="/" className="hover:text-slate-800 transition-colors">Home</Link>
          <span className="text-slate-400">&gt;</span>
          {category.categoryId === 0 ? (
            <span className="text-slate-800">Categories</span>
          ) : (
            <>
              <Link to="/categories" className="hover:text-slate-800 transition-colors">Categories</Link>
              <span className="text-slate-400">&gt;</span>
              <span className="text-slate-800">{category.name}</span>
            </>
          )}
        </nav>
      </div>

      {/* ── Subcategories Showcase ── */}
      <div className="bg-white border-b border-slate-200 dark:bg-slate-900 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-extrabold tracking-[3px] uppercase text-slate-800 dark:text-slate-200">
              {category?.categoryId === 0 ? "Browse Categories" : "Browse Subcategories"}
            </h2>
            {selectedSubCategory && (
              <button
                onClick={() => setSelectedSubCategory(null)}
                className="text-[10px] uppercase font-bold tracking-widest transition-colors"
                style={{ color: '#c8914a' }}
              >
                {category?.categoryId === 0 ? "Clear Category Filter" : "Clear Subcategory Filter"}
              </button>
            )}
          </div>

          <div className="flex gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
            {subCategories.map((sub) => {
              const active = selectedSubCategory?.subCategoryId === sub.subCategoryId;
              const count = category?.categoryId === 0
                ? products.filter(p => p.categoryId === sub.subCategoryId).length
                : products.filter(p => p.subCategoryId === sub.subCategoryId).length;
              return (
                <button
                  key={sub.subCategoryId}
                  onClick={() => setSelectedSubCategory(active ? null : sub)}
                  className="flex-shrink-0 flex flex-col items-center gap-2 px-4 py-4 rounded-xl border transition-all duration-200"
                  style={{
                    minWidth: '110px',
                    background: active ? '#1a2744' : '#fff',
                    border: active ? '1.5px solid #1a2744' : '1.5px solid #e2e8f0',
                    boxShadow: active ? '0 4px 16px rgba(26,39,68,0.15)' : '0 1px 4px rgba(0,0,0,0.06)',
                    color: active ? '#fff' : '#334155',
                  }}
                >
                  {/* Category/Subcategory Icon */}
                  {getCategoryIcon(sub.subCategoryName, active)}
                  {/* Name */}
                  <span className="text-[11px] font-black uppercase tracking-wide text-center leading-tight">
                    {sub.subCategoryName}
                  </span>
                  {/* Count */}
                  <span
                    className="text-[10px] font-semibold"
                    style={{ color: active ? 'rgba(255,255,255,0.7)' : '#94a3b8' }}
                  >
                    {count} Items
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Main Layout (Filters + Grid) ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-4 gap-8 mt-6">
        {/* Filter Sidebar */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col gap-6 sticky top-24 shadow-sm">

            {/* Sidebar Title */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="text-xs uppercase font-extrabold tracking-[3px] text-slate-800 dark:text-slate-200">
                Filters
              </span>
              <button
                onClick={handleResetFilters}
                className="text-[10px] uppercase font-bold text-slate-400 hover:text-slate-700 transition-colors tracking-widest"
              >
                Reset All
              </button>
            </div>

            {/* Brands Filter */}
            <div className="flex flex-col gap-2">
              <h4 className="text-[10px] uppercase font-extrabold tracking-widest text-slate-400 dark:text-slate-500">Brands</h4>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-805 rounded-xl text-xs p-3 text-slate-700 dark:text-slate-350 focus:outline-none focus:border-blue-500"
              >
                <option value="">All Brands</option>
                {brands.map((b, idx) => (
                  <option key={idx} value={b}>{b}</option>
                ))}
              </select>
            </div>

            {/* Price Limit Filter */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <h4 className="text-[10px] uppercase font-extrabold tracking-widest text-slate-400 dark:text-slate-500">Max Price</h4>
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400">${priceRange[1]}</span>
              </div>
              <input
                type="range"
                min="10"
                max="300"
                step="5"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                className="w-full accent-blue-500 cursor-pointer h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none"
              />
              <div className="flex justify-between text-[9px] font-bold text-slate-400 uppercase">
                <span>$10</span>
                <span>$300</span>
              </div>
            </div>

            {/* Colors Filter */}
            <div className="flex flex-col gap-2">
              <h4 className="text-[10px] uppercase font-extrabold tracking-widest text-slate-400 dark:text-slate-500">Colors</h4>
              <div className="flex flex-wrap gap-1.5">
                {colors.map((c, idx) => {
                  const selected = selectedColor === c;
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedColor(selected ? '' : c)}
                      className={`text-[10px] font-bold px-3 py-1.5 rounded-lg border transition-all ${
                        selected
                          ? 'bg-blue-600 border-blue-500 text-white shadow-md'
                          : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-850 text-slate-650 dark:text-slate-400 hover:border-slate-350 hover:bg-slate-100'
                      }`}
                    >
                      {c}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sizes Filter */}
            <div className="flex flex-col gap-2">
              <h4 className="text-[10px] uppercase font-extrabold tracking-widest text-slate-400 dark:text-slate-500">Sizes</h4>
              <div className="flex flex-wrap gap-1.5">
                {sizes.map((s, idx) => {
                  const selected = selectedSize === s;
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedSize(selected ? '' : s)}
                      className={`text-[10px] font-bold w-9 h-9 flex items-center justify-center rounded-lg border transition-all ${
                        selected
                          ? 'bg-blue-600 border-blue-500 text-white shadow-md'
                          : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-850 text-slate-650 dark:text-slate-400 hover:border-slate-350 hover:bg-slate-100'
                      }`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sorting */}
            <div className="flex flex-col gap-2">
              <h4 className="text-[10px] uppercase font-extrabold tracking-widest text-slate-400 dark:text-slate-500">Sort By</h4>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs p-3 text-slate-700 dark:text-slate-350 focus:outline-none focus:border-blue-500"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>

          </div>
        </div>

        {/* Product Grid Panel */}
        <div className="lg:col-span-3">
          {productsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-2xl overflow-hidden aspect-[4/5] p-4 flex flex-col gap-4">
                  <div className="bg-slate-200 dark:bg-slate-800 w-full h-[65%] rounded-xl" />
                  <div className="bg-slate-200 dark:bg-slate-800 w-[40%] h-4 rounded-md" />
                  <div className="bg-slate-200 dark:bg-slate-800 w-[80%] h-5 rounded-md" />
                  <div className="bg-slate-200 dark:bg-slate-800 w-[50%] h-4 rounded-md mt-auto" />
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[45vh] text-center bg-white dark:bg-slate-900/20 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-8">
              <div className="p-4 bg-slate-100 dark:bg-slate-900 rounded-full border border-slate-200 dark:border-slate-800 text-slate-500 mb-4 animate-bounce">
                <FiSlash size={36} />
              </div>
              <h3 className="font-extrabold text-slate-800 dark:text-slate-200 text-lg uppercase tracking-wider">No Products Match Filters</h3>
              <p className="text-xs text-slate-500 max-w-xs mt-2 leading-relaxed">
                We couldn't find any items matching your selected criteria. Try resetting the filters.
              </p>
              <button
                onClick={handleResetFilters}
                className="mt-6 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white text-xs font-black uppercase px-6 py-3 rounded-full transition-all shadow-lg hover:shadow-blue-500/20"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.productId} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
