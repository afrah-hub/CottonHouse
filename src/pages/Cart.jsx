import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../services/api';
import { FiTrash2, FiShoppingBag, FiArrowRight, FiShield, FiLoader } from 'react-icons/fi';

const Cart = () => {
  const { cart, cartLoading, updateCartQuantity, removeFromCart, clearCart } = useCart();
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const items = cart?.items || [];

  const subtotal = items.reduce((sum, item) => sum + (item.productPrice * item.quantity), 0);
  const shipping = subtotal === 0 ? 0 : subtotal > 150 ? 0 : 15;
  const total = subtotal + shipping;

  const handleQtyChange = (productId, currentQty, amount) => {
    const newQty = currentQty + amount;
    if (newQty <= 0) {
      removeFromCart(productId);
    } else {
      updateCartQuantity(productId, newQty);
    }
  };

  const handleCheckout = async () => {
    if (items.length === 0) return;
    setCheckoutLoading(true);
    try {
      // Call checkout endpoint
      const response = await api.post('/orders/checkout');
      // Retrieve Stripe session URL and redirect
      if (response.data?.url) {
        window.location.href = response.data.url;
      } else {
        alert("Failed to initiate payment checkout.");
      }
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "An error occurred during checkout.");
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (cartLoading && !cart) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 flex justify-center items-center">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <FiLoader className="animate-spin text-indigo-500" size={30} />
          <span className="text-sm font-semibold">Retrieving your cart...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 flex flex-col gap-8">

      {/* Title */}
      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 uppercase">Shopping Bag</h1>

      {items.length === 0 ? (
        /* Empty Cart View */
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center gap-6">
          <div className="p-5 bg-slate-100 dark:bg-slate-900/60 rounded-full border border-slate-200 dark:border-slate-800 text-slate-500">
            <FiShoppingBag size={40} />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 dark:text-slate-300 text-lg">Your bag is empty</h3>
            <p className="text-xs text-slate-500 max-w-xs mt-1">
              Explore our premium wardrobe collections and add some items to your cart.
            </p>
          </div>
          <Link
            to="/products"
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-7 py-3 rounded-full transition-all shadow-md"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        /* Cart Grid Layout */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start animate-fade-in">

          {/* Left Panel: Items List */}
          <div className="lg:col-span-2 flex flex-col gap-4">

            {/* Clear Cart Button */}
            <div className="flex justify-end">
              <button
                id="btn-clear-cart"
                onClick={clearCart}
                className="text-xs text-red-650 dark:text-red-400 hover:text-red-500 dark:hover:text-red-300 font-semibold flex items-center gap-1.5 transition-colors"
              >
                <FiTrash2 size={13} />
                <span>Clear Bag</span>
              </button>
            </div>

            {/* Cart Items Cards */}
            <div className="flex flex-col gap-4">
              {items.map((item) => (
                <div key={item.cartItemId} className="glass-card border border-slate-200 dark:border-slate-900 rounded-2xl p-4 flex gap-4 items-center">

                  {/* Product Image */}
                  <Link to={`/product/${item.productId}`} className="w-20 sm:w-24 aspect-[3/4] rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 shrink-0">
                    <img
                      src={item.productImageUrl}
                      alt={item.productName}
                      className="w-full h-full object-cover object-top"
                    />
                  </Link>

                  {/* Product Info */}
                  <div className="flex-1 flex flex-col gap-1 min-w-0">
                    <span className="text-[10px] text-indigo-600 dark:text-indigo-400 uppercase font-semibold tracking-wider">
                      {item.productBrand}
                    </span>
                    <Link to={`/product/${item.productId}`} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                      <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm sm:text-base truncate">
                        {item.productName}
                      </h4>
                    </Link>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 font-semibold uppercase">
                      <span>Size: {item.productSize}</span>
                      <span>&bull;</span>
                      <span>Color: {item.productColor}</span>
                    </div>
                    <span className="text-sm font-bold text-slate-600 dark:text-slate-400 mt-1">
                      ${item.productPrice.toFixed(2)}
                    </span>
                  </div>

                  {/* Quantity Actions */}
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full px-2 py-0.5 w-24">
                      <button
                        id={`btn-cart-qty-dec-${item.productId}`}
                        onClick={() => handleQtyChange(item.productId, item.quantity, -1)}
                        className="text-slate-500 hover:text-slate-800 dark:hover:text-white w-6 h-6 flex items-center justify-center font-bold"
                      >
                        -
                      </button>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{item.quantity}</span>
                      <button
                        id={`btn-cart-qty-inc-${item.productId}`}
                        onClick={() => handleQtyChange(item.productId, item.quantity, 1)}
                        className="text-slate-500 hover:text-slate-800 dark:hover:text-white w-6 h-6 flex items-center justify-center font-bold"
                      >
                        +
                      </button>
                    </div>

                    <button
                      id={`btn-cart-remove-${item.productId}`}
                      onClick={() => removeFromCart(item.productId)}
                      className="text-slate-500 hover:text-red-500 p-2 transition-colors"
                      title="Remove Item"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>

                </div>
              ))}
            </div>

          </div>

          {/* Right Panel: Order Summary */}
          <div className="lg:col-span-1 glass-card border border-slate-200 dark:border-slate-900 rounded-2xl p-6 flex flex-col gap-6 lg:sticky lg:top-28">
            <h3 className="text-lg font-bold text-slate-850 dark:text-slate-200 border-b border-slate-100 dark:border-slate-900 pb-3 uppercase tracking-wider">Summary</h3>

            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                <span>Subtotal</span>
                <span className="font-bold text-slate-700 dark:text-slate-300">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                <span>Shipping</span>
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-[10px] text-slate-500 italic mt-0.5">
                  Add ${(150 - subtotal).toFixed(2)} more for complimentary shipping!
                </p>
              )}
              <div className="flex items-center justify-between text-base text-slate-800 dark:text-slate-200 font-extrabold border-t border-slate-100 dark:border-slate-900 pt-4 mt-1">
                <span>Estimated Total</span>
                <span className="text-lg text-indigo-600 dark:text-indigo-400">${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              id="btn-cart-checkout"
              onClick={handleCheckout}
              disabled={checkoutLoading}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-full shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/35 transition-all w-full flex items-center justify-center gap-2 group text-sm"
            >
              {checkoutLoading ? (
                <>
                  <FiLoader className="animate-spin" />
                  <span>Preparing Checkout...</span>
                </>
              ) : (
                <>
                  <span>Proceed to Payment</span>
                  <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] text-slate-500">
              <FiShield />
              <span>Payments secured by Stripe checkout</span>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default Cart;
