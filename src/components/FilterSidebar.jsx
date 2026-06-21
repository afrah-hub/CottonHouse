import React from 'react';

const FilterSidebar = ({
  categories,
  selectedCategory,
  setSelectedCategory,
  selectedBrand,
  setSelectedBrand,
  selectedSize,
  setSelectedSize,
  selectedColor,
  setSelectedColor,
  priceRange,
  setPriceRange,
  onReset
}) => {
  const brands = ["CottonHouse Premium", "LinenCraft", "StreetWear Co", "PoloClub", "DenimCo", "OutdoorGear", "UrbanRider", "ComfortFit"];
  const sizes = ["S", "M", "L", "XL", "XXL", "30", "32", "34", "36"];
  const colors = ["White", "Black", "Blue", "Green", "Khaki", "Grey", "Brown", "Silver"];

  return (
    <div className="glass-card border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 w-full lg:sticky lg:top-28 flex flex-col gap-6">
      
      {/* Title */}
      <div className="flex items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-900 pb-3">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Filters</h3>
        <button
          id="btn-clear-filters"
          onClick={onReset}
          className="text-xs font-semibold text-indigo-650 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors"
        >
          Clear All
        </button>
      </div>

      {/* Categories */}
      <div className="flex flex-col gap-2">
        <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Categories</h4>
        <div className="flex flex-wrap gap-2 lg:flex-col lg:gap-1.5">
          <button
            id="btn-filter-cat-all"
            onClick={() => setSelectedCategory('')}
            className={`text-left text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
              selectedCategory === '' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-slate-100 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-900 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            All Products
          </button>
          {categories.map((cat) => (
            <button
              id={`btn-filter-cat-${cat.categoryId}`}
              key={cat.categoryId}
              onClick={() => setSelectedCategory(cat.categoryId)}
              className={`text-left text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
                selectedCategory === cat.categoryId 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-slate-100 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-900 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {cat.categoryName}
            </button>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div className="flex flex-col gap-2">
        <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Brands</h4>
        <select
          id="select-filter-brand"
          value={selectedBrand}
          onChange={(e) => setSelectedBrand(e.target.value)}
          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs p-2.5 text-slate-700 dark:text-slate-300 focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-500"
        >
          <option value="">All Brands</option>
          {brands.map((b, idx) => (
            <option key={idx} value={b}>{b}</option>
          ))}
        </select>
      </div>

      {/* Sizes */}
      <div className="flex flex-col gap-2">
        <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Sizes</h4>
        <div className="flex flex-wrap gap-1.5">
          {sizes.map((s, idx) => (
            <button
              id={`btn-filter-size-${s.replace(' ', '-')}`}
              key={idx}
              onClick={() => setSelectedSize(selectedSize === s ? '' : s)}
              className={`text-xs w-9 h-9 rounded-lg flex items-center justify-center font-bold border transition-all ${
                selectedSize === s 
                  ? 'bg-indigo-600 border-indigo-500 text-white' 
                  : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-650 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div className="flex flex-col gap-2">
        <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Colors</h4>
        <div className="flex flex-wrap gap-1.5">
          {colors.map((c, idx) => (
            <button
              id={`btn-filter-color-${c}`}
              key={idx}
              onClick={() => setSelectedColor(selectedColor === c ? '' : c)}
              className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
                selectedColor === c 
                  ? 'bg-indigo-600 border-indigo-500 text-white' 
                  : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-650 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold mb-1">
          <span className="uppercase tracking-widest">Price Limit</span>
          <span className="text-indigo-650 dark:text-indigo-400 font-bold">${priceRange[0]} - ${priceRange[1]}</span>
        </div>
        <input
          id="input-filter-price"
          type="range"
          min="10"
          max="300"
          step="5"
          value={priceRange[1]}
          onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
          className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-900 rounded-lg appearance-none"
        />
      </div>

    </div>
  );
};

export default FilterSidebar;
