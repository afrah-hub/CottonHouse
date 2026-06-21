import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../services/api';
import FilterSidebar from '../components/FilterSidebar';
import ProductCard from '../components/ProductCard';
import { FiLoader, FiSlash } from 'react-icons/fi';

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const Products = () => {
  const query = useQuery();
  const location = useLocation();

  // Categories list
  const [categories, setCategories] = useState([]);
  
  // Filtering States
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [priceRange, setPriceRange] = useState([10, 300]);
  const [search, setSearch] = useState('');

  // Products state
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load categories once
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await api.get('/categories');
        const allowedCategories = ["Shirts", "T-Shirts", "Jeans", "Pants", "Jackets", "Traditional Wear"];
        const filtered = res.data.filter(cat => allowedCategories.includes(cat.categoryName));
        setCategories(filtered);
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };
    fetchCats();
  }, []);

  // Sync with URL query parameters
  useEffect(() => {
    const catQuery = query.get('categoryId');
    const searchQuery = query.get('search');

    if (catQuery) {
      setSelectedCategory(parseInt(catQuery));
    } else {
      setSelectedCategory('');
    }

    if (searchQuery) {
      setSearch(searchQuery);
    } else {
      setSearch('');
    }
  }, [location.search]);

  // Load products when filters update
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {};
        if (selectedCategory) params.categoryId = selectedCategory;
        if (selectedBrand) params.brand = selectedBrand;
        if (selectedSize) params.size = selectedSize;
        if (selectedColor) params.color = selectedColor;
        if (search) params.search = search;
        
        // Add max price limit
        params.maxPrice = priceRange[1];

        const res = await api.get('/products', { params });
        const allowedCategories = ["Shirts", "T-Shirts", "Jeans", "Pants", "Jackets", "Traditional Wear"];
        const filtered = res.data.filter(p => allowedCategories.includes(p.categoryName));
        setProducts(filtered);
      } catch (err) {
        console.error("Failed to load products", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, selectedBrand, selectedSize, selectedColor, priceRange, search]);

  const handleResetFilters = () => {
    setSelectedCategory('');
    setSelectedBrand('');
    setSelectedSize('');
    setSelectedColor('');
    setPriceRange([10, 300]);
    setSearch('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 flex flex-col gap-8">
      
      {/* Title & Metadata */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 uppercase">
          {search ? `Search results for "${search}"` : "The CottonHouse Collection"}
        </h1>
        <p className="text-sm text-slate-500">
          Showing {products.length} products
        </p>
      </div>

      {/* Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Sidebar Filters */}
        <div className="lg:col-span-1">
          <FilterSidebar
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedBrand={selectedBrand}
            setSelectedBrand={setSelectedBrand}
            selectedSize={selectedSize}
            setSelectedSize={setSelectedSize}
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            onReset={handleResetFilters}
          />
        </div>

        {/* Product Grid Panel */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="flex flex-col items-center justify-center min-h-[40vh] gap-3 text-slate-500">
              <FiLoader size={30} className="animate-spin text-indigo-500" />
              <span className="text-sm font-semibold">Filtering items...</span>
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4 text-center">
              <div className="p-4 bg-slate-100 dark:bg-slate-900/50 rounded-full border border-slate-200 dark:border-slate-800 text-slate-500">
                <FiSlash size={36} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 dark:text-slate-300 text-lg">No Products Found</h3>
                <p className="text-xs text-slate-500 max-w-xs mt-1">
                  We couldn't find any products matching your active filters. Try loosening your search criteria.
                </p>
              </div>
              <button
                id="btn-no-products-reset"
                onClick={handleResetFilters}
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-5 py-2.5 rounded-full transition-all shadow-md"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.productId} product={product} />
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default Products;
