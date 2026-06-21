import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { FiHeart, FiShoppingCart, FiCheck, FiTruck, FiRotateCcw, FiShield, FiStar } from 'react-icons/fi';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart, addToWishlist, removeFromWishlist, isWishlisted } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Selection states
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data);

        // Auto select first size option if available
        if (res.data.size) {
          const sizes = res.data.size.split(',');
          if (sizes.length > 0) setSelectedSize(sizes[0].trim());
        }
      } catch (err) {
        setError('Failed to load product details.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 flex justify-center items-center">
        <div className="animate-pulse flex flex-col items-center gap-4 text-slate-500">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-semibold">Loading product specs...</span>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-300">Product Not Found</h2>
        <p className="text-slate-500 mt-2">{error || 'This product does not exist or has been removed.'}</p>
        <Link to="/products" className="inline-block bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-2.5 rounded-full mt-6 transition-all">
          Back to Catalog
        </Link>
      </div>
    );
  }

  const sizes = product.size ? product.size.split(',') : [];
  const wishlisted = isWishlisted(product.productId);

  const handleCartClick = async () => {
    if (product.stock <= 0) return;
    setAdded(true);
    const res = await addToCart(product.productId, quantity);
    if (!res.success) {
      alert(res.message);
      setAdded(false);
    } else {
      setTimeout(() => setAdded(false), 2000);
    }
  };

  const handleWishlistClick = async () => {
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
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 flex flex-col gap-16">

      {/* Breadcrumbs */}
      <div className="text-xs text-slate-500 font-medium">
        <Link to="/" className="hover:text-indigo-650 dark:hover:text-indigo-400">Home</Link>
        <span className="mx-2">&gt;</span>
        <Link to="/products" className="hover:text-indigo-650 dark:hover:text-indigo-400">Collections</Link>
        <span className="mx-2">&gt;</span>
        <Link to={`/products?categoryId=${product.categoryId}`} className="hover:text-indigo-650 dark:hover:text-indigo-400">{product.categoryName}</Link>
        <span className="mx-2">&gt;</span>
        <span className="text-slate-800 dark:text-slate-300">{product.name}</span>
      </div>

      {/* Grid Container */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">

        {/* Left Column: Image Card */}
        <div className="glass-card border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden aspect-[4/5] bg-slate-100 dark:bg-slate-900 shadow-xl group">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover object-top group-hover:scale-[1.02] transition-transform duration-700"
          />
        </div>

        {/* Right Column: Information Panel */}
        <div className="flex flex-col gap-6 lg:py-2">

          {/* Header specs */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-650 dark:text-indigo-400 uppercase tracking-widest">
              <span>{product.brand}</span>
              <span className="text-slate-300 dark:text-slate-700">&bull;</span>
              <span>{product.categoryName}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              {product.name}
            </h1>

            {/* Rating Stars Mock */}
            <div className="flex items-center gap-2 mt-1">
              <div className="flex text-amber-500">
                <FiStar className="fill-current" />
                <FiStar className="fill-current" />
                <FiStar className="fill-current" />
                <FiStar className="fill-current" />
                <FiStar className="fill-current" />
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-bold">(5.0 / 5)</span>
              <span className="text-slate-300 dark:text-slate-700">&bull;</span>
              <span className="text-xs text-indigo-650 dark:text-indigo-400 font-semibold cursor-pointer">12 customer reviews</span>
            </div>
          </div>

          {/* Price & Stock status */}
          <div className="flex items-end justify-between gap-4 border-b border-slate-100 dark:border-slate-900 pb-5">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
              ${product.price.toFixed(2)}
            </span>
            <div className="flex items-center">
              {product.stock > 0 ? (
                <span className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/30 px-3 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
                  In Stock ({product.stock} available)
                </span>
              ) : (
                <span className="text-xs text-red-650 dark:text-red-400 font-bold bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/30 px-3 py-1 rounded-full">
                  Out of Stock
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            {product.description}
          </p>

          {/* Color tag */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest">Color:</span>
            <span className="text-xs bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 px-3.5 py-1 rounded-lg font-semibold">
              {product.color}
            </span>
          </div>

          {/* Size choices */}
          {sizes.length > 0 && (
            <div className="flex flex-col gap-2">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest">Select Size:</span>
              <div className="flex flex-wrap gap-2">
                {sizes.map((s, idx) => {
                  const val = s.trim();
                  return (
                    <button
                      id={`btn-detail-size-${val}`}
                      key={idx}
                      onClick={() => setSelectedSize(val)}
                      className={`text-xs px-4 py-2.5 rounded-xl border font-bold transition-all ${selectedSize === val
                          ? 'bg-indigo-600 border-indigo-500 text-white'
                          : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-slate-350 dark:hover:border-slate-700 hover:text-slate-800 dark:hover:text-slate-200'
                        }`}
                    >
                      {val}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Checkout Controls Box */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4 border-t border-slate-100 dark:border-slate-900 mt-2">

            {/* Quantity Picker */}
            {product.stock > 0 && (
              <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full px-2 py-1 max-w-[140px] w-full self-start">
                <button
                  id="btn-detail-qty-dec"
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-slate-550 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
                >
                  -
                </button>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{quantity}</span>
                <button
                  id="btn-detail-qty-inc"
                  onClick={() => setQuantity(prev => Math.min(product.stock, prev + 1))}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-slate-550 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
                >
                  +
                </button>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex items-center gap-3 flex-1">
              <button
                id="btn-detail-add-to-cart"
                onClick={handleCartClick}
                disabled={product.stock <= 0}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full text-sm font-bold transition-all shadow-lg ${product.stock <= 0
                    ? 'bg-slate-100 dark:bg-slate-900 text-slate-400 dark:text-slate-600 border border-slate-200 dark:border-slate-800 cursor-not-allowed'
                    : added
                      ? 'bg-emerald-600 text-white'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20 hover:shadow-indigo-600/35'
                  }`}
              >
                {added ? (
                  <>
                    <FiCheck size={18} />
                    <span>Added to Cart</span>
                  </>
                ) : (
                  <>
                    <FiShoppingCart size={18} />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>

              <button
                id="btn-detail-wishlist"
                onClick={handleWishlistClick}
                className={`p-3 rounded-full border transition-all ${wishlisted
                    ? 'bg-pink-500/10 border-pink-500/30 text-pink-500 shadow-md'
                    : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-550 dark:text-slate-400 hover:text-pink-500 hover:border-pink-500/30'
                  }`}
                title={wishlisted ? "Saved" : "Save to Wishlist"}
              >
                <FiHeart className={wishlisted ? 'fill-current' : ''} size={18} />
              </button>
            </div>

          </div>

          {/* Delivery Policy Metadata list */}
          <div className="flex flex-col gap-3 mt-4 border-t border-slate-100 dark:border-slate-900 pt-5 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-3">
              <FiTruck className="text-indigo-600 dark:text-indigo-400" size={16} />
              <span>Complimentary shipping on orders above $150. Delivery within 3-5 working days.</span>
            </div>
            <div className="flex items-center gap-3">
              <FiRotateCcw className="text-indigo-600 dark:text-indigo-400" size={16} />
              <span>Free returns on all orders within 30 days. Exchange available.</span>
            </div>
            <div className="flex items-center gap-3">
              <FiShield className="text-indigo-600 dark:text-indigo-400" size={16} />
              <span>Stripe 3D secure encrypted payment checkout gateway.</span>
            </div>
          </div>

        </div>
      </div>

      {/* Product Reviews section */}
      <section className="border-t border-slate-100 dark:border-slate-900 pt-12 flex flex-col gap-6">
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">Customer Feedback</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card border border-slate-200 dark:border-slate-900 rounded-2xl p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between gap-4">
              <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">Marcus K.</span>
              <div className="flex text-amber-500 text-xs">
                <FiStar className="fill-current" /><FiStar className="fill-current" /><FiStar className="fill-current" /><FiStar className="fill-current" /><FiStar className="fill-current" />
              </div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              "Amazing quality. The stitching is top-notch and the slim fit looks very clean. It feels premium and doesn't shrink after wash."
            </p>
          </div>
          <div className="glass-card border border-slate-200 dark:border-slate-900 rounded-2xl p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between gap-4">
              <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">Aiden L.</span>
              <div className="flex text-amber-500 text-xs">
                <FiStar className="fill-current" /><FiStar className="fill-current" /><FiStar className="fill-current" /><FiStar className="fill-current" /><FiStar className="fill-current" />
              </div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              "Exceeded expectations. The material is very soft and keeps me cool during warm days. Definitely buying the other colors."
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default ProductDetail;
