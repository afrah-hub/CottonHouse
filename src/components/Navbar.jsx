import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import {
  FiShoppingBag, FiHeart, FiLogOut,
  FiMenu, FiX, FiSearch, FiChevronRight, FiShield
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_LINKS = [
  { name: 'Home',         path: '/' },
  { name: 'Shop',         path: '/products' },
  { name: 'New Arrivals', path: '/products?tag=New+Arrivals' },
  { name: 'Collections',  path: '/products' },
  { name: 'About',        path: '#footer-section', anchor: true },
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount, wishlist } = useCart();
  const [mobileOpen, setMobileOpen]       = useState(false);
  const [searchQuery, setSearchQuery]     = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [scrolled, setScrolled]           = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Scroll detection — shrink nav + frosted glass when scrolled
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path.split('?')[0]);

  return (
    <>
      {/* ── Main Navigation Bar ── */}
      <nav
        className={`z-50 w-full sticky top-0 transition-all duration-500
          ${scrolled
            ? 'h-[64px] bg-[#F7F2EC]/95 backdrop-blur-xl shadow-[0_1px_0_0_rgba(15,23,42,0.06)]'
            : 'h-[80px] bg-[#F7F2EC]'
          }`}
      >
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-8 flex items-center justify-between gap-4">

          {/* ── Logo ── */}
          <Link to="/" className="flex-shrink-0 group">
            <span
              className={`font-black uppercase transition-all duration-500 text-slate-900
                group-hover:text-slate-600
                ${scrolled ? 'text-sm tracking-[6px]' : 'text-[15px] tracking-[7px]'}`}
            >
              COTTONHOUSE
            </span>
          </Link>

          {/* ── Desktop Nav Links ── */}
          <div className="hidden lg:flex items-center gap-1 justify-center flex-1">
            {NAV_LINKS.map((link) => {
              const active = !link.anchor && isActive(link.path);
              const Component = link.anchor ? 'a' : Link;
              const props = link.anchor ? { href: link.path } : { to: link.path };

              return (
                <Component
                  key={link.name}
                  {...props}
                  className={`relative px-3.5 py-1.5 text-[10.5px] font-bold uppercase tracking-[2px] rounded-full transition-all duration-300 z-0
                    ${active
                      ? 'text-slate-900'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-900/[0.04]'
                    }`}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-active-pill"
                      className="absolute inset-0 rounded-full bg-slate-900/[0.07] -z-10"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                  {link.name}
                </Component>
              );
            })}
          </div>

          {/* ── Desktop Right Section ── */}
          <div className="hidden lg:flex items-center gap-3 flex-shrink-0">

            {/* Expanding Search */}
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <motion.div
                animate={{ width: searchFocused ? 200 : 140 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                className="overflow-hidden"
              >
                <input
                  id="nav-search-input"
                  type="text"
                  placeholder="Search…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  className="w-full bg-slate-100/70 border border-slate-200/80 rounded-full py-1.5 pl-3.5 pr-8 text-[11px] text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-300 focus:ring-2 focus:ring-slate-900/[0.06] transition-all duration-300"
                />
              </motion.div>
              <button
                id="nav-search-button"
                type="submit"
                className="absolute right-2.5 text-slate-400 hover:text-slate-700 transition-colors"
              >
                <FiSearch size={13} />
              </button>
            </form>

            {/* Divider */}
            <div className="w-px h-5 bg-slate-200" />

            {/* Wishlist */}
            <Link
              to="/wishlist"
              id="nav-wishlist-btn"
              title="Wishlist"
              className="relative p-2 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all duration-200"
            >
              <FiHeart size={17} />
              <AnimatePresence>
                {wishlist.length > 0 && (
                  <motion.span
                    key="wishlist-badge"
                    initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                    className="absolute -top-0.5 -right-0.5 bg-rose-500 text-white text-[7px] min-w-[14px] h-[14px] rounded-full flex items-center justify-center font-extrabold px-0.5"
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
              className="relative p-2 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all duration-200"
            >
              <FiShoppingBag size={17} />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    key="cart-badge"
                    initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                    className="absolute -top-0.5 -right-0.5 bg-slate-900 text-white text-[7px] min-w-[14px] h-[14px] rounded-full flex items-center justify-center font-extrabold px-0.5"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            {/* Divider */}
            <div className="w-px h-5 bg-slate-200" />

            {/* Auth */}
            {user ? (
              <div className="flex items-center gap-2">
                {/* Avatar chip */}
                <Link
                  to="/profile"
                  id="nav-profile-btn"
                  className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors group"
                >
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[9px] font-black uppercase">
                    {user.name.charAt(0)}
                  </span>
                  <span className="text-[10.5px] font-bold text-slate-700 group-hover:text-slate-900 uppercase tracking-wide">
                    {user.name.split(' ')[0]}
                  </span>
                </Link>

                {/* Admin badge */}
                {user?.role === 'Admin' && (
                  <Link
                    to="/admin"
                    id="nav-admin-btn"
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-violet-50 hover:bg-violet-100 border border-violet-200/60 text-violet-700 text-[9.5px] font-bold uppercase tracking-wider transition-colors"
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
                  className="p-2 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200"
                >
                  <FiLogOut size={15} />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                id="nav-signin-btn"
                className="text-[10px] font-bold uppercase tracking-[0.15em] bg-slate-900 text-white px-5 py-2 rounded-full hover:bg-slate-700 transition-all duration-300 shadow-sm hover:shadow-md hover:shadow-slate-900/10"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* ── Mobile Right Actions ── */}
          <div className="flex items-center gap-2 lg:hidden">
            <Link to="/cart" className="relative p-2 text-slate-700">
              <FiShoppingBag size={18} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-slate-900 text-white text-[7px] min-w-[14px] h-[14px] rounded-full flex items-center justify-center font-bold px-0.5">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              id="btn-mobile-menu"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-full text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <AnimatePresence mode="wait" initial={false}>
                {mobileOpen
                  ? <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}><FiX size={20} /></motion.span>
                  : <motion.span key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}><FiMenu size={20} /></motion.span>
                }
              </AnimatePresence>
            </button>
          </div>

        </div>
      </nav>

      {/* ── Mobile Drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-drawer"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="lg:hidden fixed top-[64px] sm:top-[80px] left-0 right-0 z-40 bg-[#F7F2EC]/98 backdrop-blur-xl border-b border-slate-200/70 shadow-xl px-5 py-6 flex flex-col gap-1"
          >
            {/* Mobile Search */}
            <form onSubmit={(e) => { handleSearchSubmit(e); setMobileOpen(false); }} className="relative mb-4">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
              <input
                id="mobile-search-input"
                type="text"
                placeholder="Search collections…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-full py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-300 focus:ring-2 focus:ring-slate-900/[0.06]"
              />
            </form>

            {/* Mobile Nav Links */}
            {NAV_LINKS.map((link, i) => {
              const active = !link.anchor && isActive(link.path);
              const Component = link.anchor ? 'a' : Link;
              const props = link.anchor
                ? { href: link.path, onClick: () => setMobileOpen(false) }
                : { to: link.path, onClick: () => setMobileOpen(false) };

              return (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.2 }}
                >
                  <Component
                    {...props}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold tracking-wide transition-colors
                      ${active ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'}`}
                  >
                    {link.name}
                    {active && <FiChevronRight size={14} />}
                  </Component>
                </motion.div>
              );
            })}

            {/* Divider */}
            <div className="h-px bg-slate-200 my-2" />

            {/* Mobile Wishlist */}
            <Link
              to="/wishlist"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <span className="flex items-center gap-2"><FiHeart size={16} /> Wishlist</span>
              {wishlist.length > 0 && (
                <span className="bg-rose-100 text-rose-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Admin */}
            {user?.role === 'Admin' && (
              <Link
                to="/admin"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-violet-700 hover:bg-violet-50 transition-colors"
              >
                <FiShield size={16} /> Admin Panel
              </Link>
            )}

            {/* Auth */}
            <div className="mt-2">
              {user ? (
                <div className="flex flex-col gap-2">
                  <Link
                    to="/profile"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    <span className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center text-[11px] font-black uppercase">
                      {user.name.charAt(0)}
                    </span>
                    <span>{user.name}</span>
                  </Link>
                  <button
                    id="mobile-btn-logout"
                    onClick={() => { logout(); setMobileOpen(false); }}
                    className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors text-left"
                  >
                    <FiLogOut size={16} /> Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 w-full bg-slate-900 text-white text-xs font-bold uppercase tracking-widest py-3 rounded-full mt-1 hover:bg-slate-700 transition-all"
                >
                  Sign In
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
