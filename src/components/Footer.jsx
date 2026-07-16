import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-900 bg-white/80 dark:bg-slate-950/80 px-4 sm:px-8 py-10 mt-20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* Brand Column */}
        <div className="flex flex-col gap-3">
          <span className="text-xl font-extrabold tracking-wider bg-gradient-to-r from-indigo-400 to-indigo-500 bg-clip-text text-transparent">
            COTTONHOUSE
          </span>
          <p className="text-sm text-slate-500 max-w-xs leading-relaxed">
            Premium men's clothing crafted with quality fabrics, modern fits, and timeless designs.
          </p>
        </div>

        {/* Collections */}
        <div className="flex flex-col gap-2">
          <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-300 uppercase tracking-widest mb-1">Collections</h4>
          <Link to="/products?categoryId=1" className="text-sm text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Shirts</Link>
          <Link to="/products?categoryId=2" className="text-sm text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">T-Shirts</Link>
          <Link to="/products?categoryId=3" className="text-sm text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Jeans</Link>
          <Link to="/products?categoryId=3" className="text-sm text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Pants</Link>
          <Link to="/products?categoryId=4" className="text-sm text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Jackets</Link>
          <Link to="/products?categoryId=5" className="text-sm text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Traditional Wear</Link>
        </div>

        {/* Support */}
        <div className="flex flex-col gap-2">
          <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-300 uppercase tracking-widest mb-1">Customer Care</h4>
          <Link to="/profile" className="text-sm text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">My Profile</Link>
          <Link to="/cart" className="text-sm text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Shopping Cart</Link>
          <Link to="/wishlist" className="text-sm text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Wishlist</Link>
        </div>

        {/* Info */}
        <div className="flex flex-col gap-2">
          <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-300 uppercase tracking-widest mb-1">Company</h4>
          <span className="text-sm text-slate-500">Contact: support@cottonhouse.com</span>
          <span className="text-sm text-slate-500">Address: London, United Kingdom</span>
          <span className="text-sm text-slate-500">&copy; {new Date().getFullYear()} CottonHouse Ltd.</span>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
