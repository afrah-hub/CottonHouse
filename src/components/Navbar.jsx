import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import {
  FiShoppingBag, FiHeart, FiLogOut,
  FiMenu, FiX, FiSearch, FiChevronRight, FiShield, FiChevronDown, FiTrendingUp
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_LINKS = [
  { name: 'Home', path: '/' },
  { name: 'Categories', path: '/categories' },
  { name: 'Contact', path: '#footer-section', anchor: true },
];

const CATEGORIES_LIST = [
  { name: 'Shirts', path: '/categories/shirts' },
  { name: 'T-Shirts', path: '/categories/t-shirts' },
  { name: 'Jeans', path: '/categories/jeans' },
  { name: 'Pants', path: '/categories/pants' },
  { name: 'Jackets', path: '/categories/jackets' },
  { name: 'Traditional Wear', path: '/categories/traditional-wear' }
];


const SUGGESTIONS = [
  { label: 'Organic Cotton Shirts', query: 'Organic Cotton' },
  { label: 'Oversized Street Tee', query: 'Oversized' },
  { label: 'Nehru Jacket Set', query: 'Nehru' },
  { label: 'Slim-Fit Linen Shirts', query: 'Linen' },
  { label: 'Selvedge Denim Jeans', query: 'Denim' },
  { label: 'Tailored Wool Trousers', query: 'Trousers' }
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount, wishlist } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const suggestionsRef = useRef(null);
  const dropdownRef = useRef(null);

  // Scroll detection — shrink nav + frosted glass when scrolled
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setMobileCategoriesOpen(false);
  }, [location.pathname]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setSearchFocused(false);
    }
  };

  const handleSuggestionClick = (query) => {
    navigate(`/products?search=${encodeURIComponent(query)}`);
    setSearchQuery('');
    setSearchFocused(false);
  };

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path.split('?')[0]);

  // Click outside suggestions and dropdown handler
  useEffect(() => {
    const clickOutside = (e) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target)) {
        setSearchFocused(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', clickOutside);
    return () => document.removeEventListener('mousedown', clickOutside);
  }, []);

  // Escape key handler
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setDropdownOpen(false);
        setSearchFocused(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  return (
    <>
      {/* ── Main Navigation Bar ── */}
      <nav
        className={`z-40 w-full sticky top-0 transition-all duration-550
          ${scrolled
            ? 'h-[64px] bg-[#F7F2EC]/85 dark:bg-slate-950/85 backdrop-blur-xl shadow-[0_1px_0_0_rgba(15,23,42,0.06)]'
            : 'h-[80px] bg-[#F7F2EC] dark:bg-slate-950'
          }`}
      >
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-8 flex items-center justify-between gap-4">

          {/* ── Logo ── */}
          <Link to="/" className="flex-shrink-0 group">
            <span
              className={`font-black uppercase transition-all duration-500 text-slate-900 dark:text-white
                group-hover:text-blue-600 dark:group-hover:text-blue-400
                ${scrolled ? 'text-sm tracking-[6px]' : 'text-[15px] tracking-[7px]'}`}
            >
              COTTONHOUSE
            </span>
          </Link>

          {/* ── Desktop Nav Links ── */}
          <div className="hidden lg:flex items-center gap-1 justify-center flex-1">
            {NAV_LINKS.map((link) => {
              if (link.name === 'Categories') {
                return (
                  <div
                    key={link.name}
                    ref={dropdownRef}
                    className="relative py-2"
                    onMouseEnter={() => setDropdownOpen(true)}
                    onMouseLeave={() => setDropdownOpen(false)}
                  >
                    <Link
                      to={link.path}
                      aria-expanded={dropdownOpen}
                      aria-haspopup="true"
                      className={`relative flex items-center gap-1.5 px-4 py-2 text-[10.5px] font-bold uppercase tracking-[2px] rounded-full transition-all duration-300 z-0 cursor-pointer
                        ${isActive(link.path) || location.pathname.startsWith('/categories')
                          ? 'text-slate-900 dark:text-white'
                          : 'text-slate-500 hover:text-slate-955 dark:hover:text-white hover:bg-slate-900/[0.04] dark:hover:bg-white/[0.04]'
                        }`}
                    >
                      {(isActive(link.path) || location.pathname.startsWith('/categories')) && (
                        <motion.span
                          layoutId="nav-active-pill"
                          className="absolute inset-0 rounded-full bg-slate-900/[0.07] dark:bg-white/[0.08] -z-10"
                          transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
                        />
                      )}
                      <span>{link.name}</span>
                      <FiChevronDown
                        className={`transition-transform duration-300 ${dropdownOpen ? 'rotate-180 text-blue-500' : 'text-slate-400'}`}
                        size={11}
                      />
                    </Link>

                    {/* Desktop Dropdown List */}
                    <AnimatePresence>
                      {dropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 12, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 12, scale: 0.95 }}
                          transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                          className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-48 bg-[#F7F2EC] dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-3 z-50 flex flex-col gap-0.5 text-left"
                        >
                          {CATEGORIES_LIST.map((cat) => (
                            <Link
                              key={cat.name}
                              to={cat.path}
                              onClick={() => setDropdownOpen(false)}
                              className="text-[10.5px] font-bold tracking-wider text-slate-700 dark:text-slate-300 py-2 px-3 rounded-xl hover:bg-slate-900/[0.05] dark:hover:bg-white/[0.05] hover:text-blue-600 dark:hover:text-blue-450 transition-all uppercase"
                            >
                              {cat.name}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              const active = !link.anchor && isActive(link.path);
              const Component = link.anchor ? 'a' : Link;
              const props = link.anchor ? { href: link.path } : { to: link.path };

              return (
                <Component
                  key={link.name}
                  {...props}
                  className={`relative px-4 py-2 text-[10.5px] font-bold uppercase tracking-[2px] rounded-full transition-all duration-300 z-0
                    ${active
                      ? 'text-slate-900 dark:text-white'
                      : 'text-slate-500 hover:text-slate-950 dark:hover:text-white hover:bg-slate-900/[0.04] dark:hover:bg-white/[0.04]'
                    }`}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-active-pill"
                      className="absolute inset-0 rounded-full bg-slate-900/[0.07] dark:bg-white/[0.08] -z-10"
                      transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
                    />
                  )}
                  {link.name}
                </Component>
              );
            })}
          </div>

          {/* ── Desktop Right Section ── */}
          <div className="hidden lg:flex items-center gap-3 flex-shrink-0">

            {/* Expanding Search Form with Suggestions */}
            <div className="relative" ref={suggestionsRef}>
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <motion.div
                  animate={{ width: searchFocused ? 240 : 150 }}
                  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                  className="overflow-hidden"
                >
                  <input
                    id="nav-search-input"
                    type="text"
                    placeholder="Search collections…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setSearchFocused(true)}
                    className="w-full bg-slate-200/50 dark:bg-slate-900/60 border border-slate-300 dark:border-slate-800/80 rounded-full py-1.5 pl-4 pr-9 text-[11px] text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-slate-350 focus:ring-2 focus:ring-slate-900/[0.04] transition-all duration-300"
                  />
                </motion.div>
                <button
                  id="nav-search-button"
                  type="submit"
                  className="absolute right-3 text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                >
                  <FiSearch size={13} />
                </button>
              </form>

              {/* Suggestions Dropdown */}
              <AnimatePresence>
                {searchFocused && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full right-0 mt-2.5 w-64 bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-2xl shadow-xl p-4 z-50"
                  >
                    <span className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2.5">
                      <FiTrendingUp size={10} className="text-blue-500" />
                      Trending Searches
                    </span>
                    <div className="flex flex-col gap-1">
                      {SUGGESTIONS.map((item) => (
                        <button
                          key={item.label}
                          type="button"
                          onClick={() => handleSuggestionClick(item.query)}
                          className="flex items-center justify-between text-left text-xs font-semibold text-slate-750 dark:text-slate-300 py-2 px-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-450 transition-all cursor-pointer w-full"
                        >
                          {item.label}
                          <FiChevronRight size={10} className="text-slate-400" />
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Divider */}
            <div className="w-px h-5 bg-slate-200 dark:bg-slate-800" />

            {/* Wishlist */}
            <Link
              to="/wishlist"
              id="nav-wishlist-btn"
              title="Wishlist"
              className="relative p-2 rounded-full text-slate-650 dark:text-slate-400 hover:text-rose-500 dark:hover:text-rose-455 hover:bg-slate-100 dark:hover:bg-slate-900 transition-all duration-200"
            >
              <FiHeart size={16} />
              <AnimatePresence mode="popLayout">
                {wishlist.length > 0 && (
                  <motion.span
                    key={wishlist.length}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: [0.5, 1.3, 1], opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                    className="absolute -top-0.5 -right-0.5 bg-rose-500 text-white text-[7.5px] min-w-[14px] h-[14px] rounded-full flex items-center justify-center font-black px-0.5 shadow-sm"
                  >
                    {wishlist.length}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              id="nav-cart-btn"
              title="Cart"
              className="relative p-2 rounded-full text-slate-650 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-900 transition-all duration-200"
            >
              <FiShoppingBag size={16} />
              <AnimatePresence mode="popLayout">
                {cartCount > 0 && (
                  <motion.span
                    key={cartCount}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: [0.5, 1.3, 1], opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                    className="absolute -top-0.5 -right-0.5 bg-slate-900 dark:bg-blue-650 text-white text-[7.5px] min-w-[14px] h-[14px] rounded-full flex items-center justify-center font-black px-0.5 shadow-sm"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            {/* Divider */}
            <div className="w-px h-5 bg-slate-200 dark:bg-slate-800" />

            {/* Auth */}
            {user ? (
              <div className="flex items-center gap-2">
                {/* Avatar chip */}
                <Link
                  to="/profile"
                  id="nav-profile-btn"
                  className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-200/50 dark:bg-slate-850 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors group"
                >
                  <span className="w-5 h-5 rounded-full bg-slate-900 dark:bg-blue-605 text-white flex items-center justify-center text-[9px] font-black uppercase">
                    {user.name.charAt(0)}
                  </span>
                  <span className="text-[10.5px] font-bold text-slate-705 dark:text-slate-300 group-hover:text-slate-950 dark:group-hover:text-white uppercase tracking-wide">
                    {user.name.split(' ')[0]}
                  </span>
                </Link>

                {/* Admin badge */}
                {user?.role === 'Admin' && (
                  <Link
                    to="/admin"
                    id="nav-admin-btn"
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950 hover:bg-blue-100 border border-blue-200/40 text-blue-700 dark:text-blue-400 text-[9.5px] font-bold uppercase tracking-wider transition-colors"
                  >
                    <FiShield size={10} />
                    Admin
                  </Link>
                )}

                {/* Logout */}
                <button
                  id="btn-logout"
                  onClick={logout}
                  title="Logout"
                  className="p-2 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-955/40 transition-all duration-200"
                >
                  <FiLogOut size={15} />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                id="nav-signin-btn"
                className="text-[10px] font-bold uppercase tracking-[0.15em] bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-550 text-white px-5 py-2.5 rounded-full transition-all duration-305 shadow-sm hover:shadow-md hover:shadow-slate-900/10 dark:hover:shadow-blue-550/10"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* ── Mobile Right Actions ── */}
          <div className="flex items-center gap-2 lg:hidden">
            <Link to="/cart" className="relative p-2 text-slate-755 dark:text-slate-350">
              <FiShoppingBag size={18} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-slate-900 dark:bg-blue-600 text-white text-[7px] min-w-[14px] h-[14px] rounded-full flex items-center justify-center font-bold px-0.5">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              id="btn-mobile-menu"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-full text-slate-755 dark:text-slate-355 hover:bg-slate-200 dark:hover:bg-slate-900 transition-colors"
            >
              <FiMenu size={20} />
            </button>
          </div>

        </div>
      </nav>

      {/* ── Slide-in Mobile Drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Dark Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-50"
            />

            {/* Mobile Drawer Content */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed top-0 right-0 bottom-0 w-[300px] z-50 bg-[#F7F2EC] dark:bg-[#0D1117] border-l border-slate-200 dark:border-slate-800 shadow-2xl p-6 flex flex-col justify-between"
            >
              <div>
                {/* Header Row */}
                <div className="flex items-center justify-between mb-8">
                  <span className="font-black text-slate-900 dark:text-white uppercase tracking-wider text-xs">
                    CottonHouse
                  </span>
                  <button
                    onClick={() => setMobileOpen(false)}
                    className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-850 text-slate-650 dark:text-slate-400"
                  >
                    <FiX size={18} />
                  </button>
                </div>

                {/* Mobile Search */}
                <form onSubmit={(e) => { handleSearchSubmit(e); setMobileOpen(false); }} className="relative mb-6">
                  <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  <input
                    id="mobile-search-input"
                    type="text"
                    placeholder="Search collections…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full py-2 pl-10 pr-4 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-350"
                  />
                </form>

                {/* Mobile Nav Links */}
                <div className="flex flex-col gap-1.5">
                  {NAV_LINKS.map((link, i) => {
                    if (link.name === 'Categories') {
                      return (
                        <div key={link.name} className="flex flex-col">
                          <button
                            type="button"
                            onClick={() => setMobileCategoriesOpen(!mobileCategoriesOpen)}
                            className={`flex items-center justify-between px-4 py-3 rounded-xl text-xs font-black tracking-widest uppercase transition-colors text-left cursor-pointer
                              ${isActive(link.path)
                                ? 'bg-slate-900/5 dark:bg-blue-650/5 text-slate-900 dark:text-white'
                                : 'text-slate-705 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-850'
                              }`}
                          >
                            <span>{link.name}</span>
                            <FiChevronDown
                              className={`transition-transform duration-350 ${mobileCategoriesOpen ? 'rotate-180 text-blue-500' : 'text-slate-400'}`}
                              size={14}
                            />
                          </button>

                          <AnimatePresence>
                            {mobileCategoriesOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden pl-4 flex flex-col gap-1.5 mt-1.5 border-l border-slate-200 dark:border-slate-805 ml-4"
                              >
                                <Link
                                  to="/categories"
                                  onClick={() => {
                                    setMobileCategoriesOpen(false);
                                    setMobileOpen(false);
                                  }}
                                  className="text-[10px] font-black tracking-widest text-indigo-600 dark:text-indigo-400 py-2.5 px-4 rounded-lg hover:bg-slate-200/40 dark:hover:bg-slate-850 uppercase hover:text-blue-500 font-bold"
                                >
                                  View All Categories
                                </Link>
                                {CATEGORIES_LIST.map((cat) => (
                                  <Link
                                    key={cat.name}
                                    to={cat.path}
                                    onClick={() => {
                                      setMobileCategoriesOpen(false);
                                      setMobileOpen(false);
                                    }}
                                    className="text-[10px] font-black tracking-widest text-slate-650 dark:text-slate-400 py-2.5 px-4 rounded-lg hover:bg-slate-200/40 dark:hover:bg-slate-850 uppercase hover:text-blue-500"
                                  >
                                    {cat.name}
                                  </Link>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    }

                    const active = !link.anchor && isActive(link.path);
                    const Component = link.anchor ? 'a' : Link;
                    const props = link.anchor
                      ? { href: link.path, onClick: () => setMobileOpen(false) }
                      : { to: link.path, onClick: () => setMobileOpen(false) };

                    return (
                      <motion.div
                        key={link.name}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <Component
                          {...props}
                          className={`flex items-center justify-between px-4 py-3 rounded-xl text-xs font-black tracking-widest uppercase transition-colors
                            ${active
                              ? 'bg-slate-900 dark:bg-blue-650 text-white shadow-md'
                              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-850'
                            }`}
                        >
                          {link.name}
                          <FiChevronRight size={12} className={active ? 'text-white' : 'text-slate-400'} />
                        </Component>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Info Drawer */}
              <div className="flex flex-col gap-4 border-t border-slate-200 dark:border-slate-800 pt-6">

                {/* Mobile Wishlist */}
                <Link
                  to="/wishlist"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between px-4 py-2 rounded-xl text-xs font-bold text-slate-705 dark:text-slate-350 hover:bg-slate-202/40 dark:hover:bg-slate-850"
                >
                  <span className="flex items-center gap-2"><FiHeart size={14} /> Wishlist</span>
                  {wishlist.length > 0 && (
                    <span className="bg-rose-100 dark:bg-rose-950 text-rose-605 dark:text-rose-400 text-[9px] font-black px-2 py-0.5 rounded-full">
                      {wishlist.length}
                    </span>
                  )}
                </Link>

                {/* Admin panel */}
                {user?.role === 'Admin' && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40"
                  >
                    <FiShield size={14} /> Admin panel
                  </Link>
                )}

                {/* Auth */}
                <div>
                  {user ? (
                    <div className="flex flex-col gap-2">
                      <Link
                        to="/profile"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-bold text-slate-705 dark:text-slate-300 hover:bg-slate-200/40 dark:hover:bg-slate-850"
                      >
                        <span className="w-6 h-6 rounded-full bg-slate-900 dark:bg-blue-605 text-white flex items-center justify-center text-[10px] font-black uppercase">
                          {user.name.charAt(0)}
                        </span>
                        <span>{user.name}</span>
                      </Link>
                      <button
                        onClick={() => { logout(); setMobileOpen(false); }}
                        className="flex items-center gap-2 px-4 py-2 w-full rounded-xl text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-955/20 text-left cursor-pointer"
                      >
                        <FiLogOut size={14} /> Logout
                      </button>
                    </div>
                  ) : (
                    <Link
                      to="/login"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-center w-full bg-slate-900 dark:bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest py-3 rounded-full hover:bg-slate-800 dark:hover:bg-blue-550 transition-all shadow-md"
                    >
                      Sign In
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
