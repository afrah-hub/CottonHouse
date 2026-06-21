import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FiHeart, FiTrash2, FiShoppingCart, FiLoader } from 'react-icons/fi';

const Wishlist = () => {
  const { wishlist, wishlistLoading, removeFromWishlist, addToCart } = useCart();

  const handleQuickAdd = async (e, productId) => {
    e.preventDefault();
    const res = await addToCart(productId, 1);
    if (res.success) {
      alert("Added to cart!");
    } else {
      alert(res.message);
    }
  };

  if (wishlistLoading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 flex justify-center items-center">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <FiLoader className="animate-spin text-indigo-500" size={30} />
          <span className="text-sm font-semibold">Retrieving your wishlist...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 flex flex-col gap-8">

      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 uppercase">My Wishlist</h1>

      {wishlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center gap-6">
          <div className="p-5 bg-slate-100 dark:bg-slate-900/60 rounded-full border border-slate-200 dark:border-slate-800 text-slate-500">
            <FiHeart size={40} />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 dark:text-slate-300 text-lg">Your wishlist is empty</h3>
            <p className="text-xs text-slate-500 max-w-xs mt-1">
              Save your favorite shirts, jeans, and sneakers to keep track of them here.
            </p>
          </div>
          <Link
            to="/products"
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-7 py-3 rounded-full transition-all shadow-md"
          >
            Explore Catalog
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-fade-in">
          {wishlist.map((item) => (
            <div key={item.wishlistId} className="group relative glass-card rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-900 hover:border-indigo-500/35 transition-all duration-300 flex flex-col h-full">

              {/* Product Image */}
              <Link to={`/product/${item.productId}`} className="relative block overflow-hidden aspect-[3/4] bg-slate-100 dark:bg-slate-900 shrink-0">
                <img
                  src={item.productImageUrl}
                  alt={item.productName}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />

                {/* Delete/Remove button */}
                <button
                  id={`btn-wishlist-remove-${item.productId}`}
                  onClick={(e) => { e.preventDefault(); removeFromWishlist(item.productId); }}
                  className="absolute top-3 right-3 p-2 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md rounded-full text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 border border-slate-200 dark:border-slate-800 transition-colors"
                  title="Remove"
                >
                  <FiTrash2 size={14} />
                </button>
              </Link>

              {/* Info & CTA details */}
              <div className="p-4 flex flex-col flex-1 gap-2">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                  {item.productBrand}
                </span>

                <Link to={`/product/${item.productId}`} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm truncate">
                    {item.productName}
                  </h4>
                </Link>

                <div className="flex items-center justify-between gap-4 mt-auto pt-3 border-t border-slate-100 dark:border-slate-900">
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    ${item.productPrice.toFixed(2)}
                  </span>

                  <button
                    id={`btn-wishlist-add-to-cart-${item.productId}`}
                    onClick={(e) => handleQuickAdd(e, item.productId)}
                    className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-full transition-all"
                  >
                    <FiShoppingCart size={11} />
                    <span>Add</span>
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default Wishlist;
