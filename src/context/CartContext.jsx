import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const fetchCart = async () => {
    if (!user) return;
    setCartLoading(true);
    try {
      const response = await api.get('/cart');
      setCart(response.data);
    } catch (error) {
      console.error("Error fetching cart", error);
    } finally {
      setCartLoading(false);
    }
  };

  const fetchWishlist = async () => {
    if (!user) return;
    setWishlistLoading(true);
    try {
      const response = await api.get('/wishlist');
      setWishlist(response.data);
    } catch (error) {
      console.error("Error fetching wishlist", error);
    } finally {
      setWishlistLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCart();
      fetchWishlist();
    } else {
      setCart(null);
      setWishlist([]);
    }
  }, [user]);

  const addToCart = async (productId, quantity = 1) => {
    if (!user) return { success: false, message: 'Please log in to add items to cart.' };
    try {
      await api.post('/cart/items', { productId, quantity });
      await fetchCart();
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to add item to cart.'
      };
    }
  };

  const updateCartQuantity = async (productId, quantity) => {
    if (!user) return;
    try {
      await api.put('/cart/items', { productId, quantity });
      await fetchCart();
    } catch (error) {
      console.error("Error updating cart quantity", error);
    }
  };

  const removeFromCart = async (productId) => {
    if (!user) return;
    try {
      await api.delete(`/cart/items/${productId}`);
      await fetchCart();
    } catch (error) {
      console.error("Error removing item from cart", error);
    }
  };

  const clearCart = async () => {
    if (!user) return;
    try {
      await api.delete('/cart');
      setCart(prev => prev ? { ...prev, items: [] } : null);
    } catch (error) {
      console.error("Error clearing cart", error);
    }
  };

  const addToWishlist = async (productId) => {
    if (!user) return { success: false, message: 'Please log in to save to wishlist.' };
    try {
      await api.post(`/wishlist/${productId}`);
      await fetchWishlist();
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to add to wishlist.'
      };
    }
  };

  const removeFromWishlist = async (productId) => {
    if (!user) return;
    try {
      await api.delete(`/wishlist/${productId}`);
      await fetchWishlist();
    } catch (error) {
      console.error("Error removing from wishlist", error);
    }
  };

  const isWishlisted = (productId) => {
    return wishlist.some(item => item.productId === productId);
  };

  const cartCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <CartContext.Provider value={{
      cart,
      wishlist,
      cartLoading,
      wishlistLoading,
      cartCount,
      fetchCart,
      addToCart,
      updateCartQuantity,
      removeFromCart,
      clearCart,
      fetchWishlist,
      addToWishlist,
      removeFromWishlist,
      isWishlisted
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
