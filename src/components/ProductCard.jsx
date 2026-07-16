import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FiHeart, FiShoppingCart, FiCheck } from 'react-icons/fi';

const ProductCard = ({ product }) => {
  const { addToCart, addToWishlist, removeFromWishlist, isWishlisted } = useCart();
  const [added, setAdded] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const wishlisted = isWishlisted(product.productId);

  const handleCartClick = async (e) => {
    e.preventDefault();
    if (added) return;
    setAdded(true);
    const res = await addToCart(product.productId, 1);
    if (!res.success) {
      alert(res.message);
      setAdded(false);
    } else {
      setTimeout(() => setAdded(false), 2000);
    }
  };

  const handleWishlistClick = async (e) => {
    e.preventDefault();
    if (wishlistLoading) return;
    setWishlistLoading(true);
    if (wishlisted) {
      await removeFromWishlist(product.productId);
    } else {
      const res = await addToWishlist(product.productId);
      if (!res.success) {
        alert(res.message);
      }
    }
    setWishlistLoading(false);
  };

  return (
    <div className="group relative glass-card rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800/60 hover:border-indigo-500/40 transition-all duration-500 flex flex-col h-full shadow-lg hover:shadow-indigo-500/5 dark:hover:shadow-indigo-500/5">

      {/* Product Image Section */}
      <Link to={`/product/${product.productId}`} className="relative block overflow-hidden aspect-[4/5] bg-slate-100 dark:bg-slate-900">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
        />

        {/* Brand Overlay Label */}
        <span className="absolute top-3 left-3 bg-white/85 dark:bg-slate-950/80 backdrop-blur-md text-[10px] uppercase font-bold tracking-widest text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-800">
          {product.brand}
        </span>

        {/* Stock Status Badge */}
        {product.stock <= 0 ? (
          <span className="absolute top-3 right-3 bg-red-500/90 backdrop-blur-md text-[9px] font-extrabold uppercase text-white px-2.5 py-1 rounded-full">
            Out of Stock
          </span>
        ) : product.stock < 5 ? (
          <span className="absolute top-3 right-3 bg-amber-500/90 backdrop-blur-md text-[9px] font-extrabold uppercase text-slate-950 px-2.5 py-1 rounded-full">
            Low Stock ({product.stock})
          </span>
        ) : null}

        {/* Quick Add To Wishlist Floating Button */}
        <button
          id={`btn-wishlist-${product.productId}`}
          onClick={handleWishlistClick}
          className={`absolute bottom-3 right-3 p-2.5 rounded-full backdrop-blur-md transition-all duration-300 ${wishlisted
              ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/20'
              : 'bg-white/80 dark:bg-slate-950/75 text-slate-600 dark:text-slate-400 hover:text-pink-500 hover:bg-white dark:hover:bg-slate-950'
            }`}
          title={wishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
        >
          <FiHeart size={16} className={wishlisted ? 'fill-current' : ''} />
        </button>
      </Link>

      {/* Info Details Section */}
      <div className="p-5 flex flex-col flex-1 gap-2">
        <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-widest">
          {product.categoryName}
        </span>

        <Link to={`/product/${product.productId}`}>
          <h3 className="font-semibold text-slate-800 dark:text-white text-base line-clamp-1 group-hover:text-indigo-650 dark:group-hover:text-indigo-400 transition-colors">
            {product.name}
          </h3>
        </Link>

        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        {/* Size / Color Info Row */}
        <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
          <span>Sizes: {product.size}</span>
          <span className="text-slate-300 dark:text-slate-600">&bull;</span>
          <span>Color: {product.color}</span>
        </div>

        {/* Price & Add to Cart Action */}
        <div className="flex items-center justify-between gap-4 mt-auto pt-4 border-t border-slate-100 dark:border-slate-900">
          <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
            ${product.price.toFixed(2)}
          </span>

          <button
            id={`btn-add-to-cart-${product.productId}`}
            onClick={handleCartClick}
            disabled={product.stock <= 0}
            className={`flex items-center justify-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all shadow-md ${product.stock <= 0
                ? 'bg-slate-100 dark:bg-slate-900 text-slate-400 dark:text-slate-600 cursor-not-allowed border border-slate-200 dark:border-slate-800'
                : added
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white hover:shadow-blue-500/20'
              }`}
          >
            {added ? (
              <>
                <FiCheck size={14} />
                <span>Added</span>
              </>
            ) : (
              <>
                <FiShoppingCart size={14} />
                <span>Add</span>
              </>
            )}
          </button>
        </div>

      </div>

    </div>
  );
};

export default ProductCard;
