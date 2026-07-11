import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { FiShoppingBag, FiHeart, FiUser, FiLogOut, FiMenu, FiX, FiSearch } from 'react-icons/fi';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount, wishlist } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <nav className="z-50 px-4 sm:px-8 h-[80px] flex items-center transition-all duration-500 w-full sticky top-0 bg-[#F7F2EC]">
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-4">

        {/* Left Section: Logo */}
        <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
          <span className="text-base sm:text-lg font-bold tracking-[8px] uppercase transition-colors duration-500 text-slate-900">
            COTTONHOUSE
          </span>
        </Link>

        {/* Center Section: Navigation Links */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-8 justify-center flex-1">
          {[
            { name: 'Home', path: '/' },
            { name: 'Shop', path: '/products' },
            { name: 'New Arrivals', path: '/products?tag=New+Arrivals' },
            { name: 'Collections', path: '/products' },
            { name: 'About', path: '#footer-section' }
          ].map((link) => {
            const isAnchor = link.path.startsWith('#');
            const linkProps = isAnchor
              ? { href: link.path }
              : { to: link.path };
            const Component = isAnchor ? 'a' : Link;
            const isActive = location.pathname === link.path;

            return (
              <Component
                key={link.name}
                {...linkProps}
                className="relative text-[10.5px] font-bold uppercase tracking-[2.5px] transition-colors duration-300 py-1.5 group text-slate-800 hover:text-slate-950"
              >
                {link.name}
                <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-[2px] bg-slate-800 transition-transform duration-300 origin-center ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
              </Component>
            );
          })}
        </div>

        {/* Right Section: Search, Icons, Sign In */}
        <div className="hidden lg:flex items-center gap-5 flex-shrink-0">
          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="relative w-[180px] xl:w-[220px]">
            <input
              id="nav-search-input"
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border rounded-full py-1.5 pl-4 pr-10 text-[11px] transition-all duration-300 focus:outline-none focus:border-slate-300 bg-slate-100/50 border-slate-200/80 text-slate-800 placeholder-slate-400 focus:bg-white/80"
            />
            <button id="nav-search-button" type="submit" className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors text-slate-400 hover:text-slate-700">
              <FiSearch size={13} />
            </button>
          </form>

          {/* Action Icons */}
          <div className="flex items-center gap-4">
            {/* Wishlist Icon */}
            <Link
              to="/wishlist"
              className="relative p-1.5 transition-colors duration-300 text-slate-800 hover:text-slate-950"
            >
              <FiHeart size={18} />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-pink-500 text-white text-[8px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-extrabold animate-pulse">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart Icon */}
            <Link
              to="/cart"
              className="relative p-1.5 transition-colors duration-300 text-slate-800 hover:text-slate-950"
            >
              <FiShoppingBag size={18} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#0B1E3D] text-white text-[8px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-extrabold">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          {/* User profile / Sign In */}
          {user ? (
            <div className="flex items-center gap-3 border-l pl-4 border-slate-200">
              <Link
                to="/profile"
                className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-850 hover:text-slate-950"
              >
                <FiUser size={15} />
                <span>{user.name.split(' ')[0]}</span>
              </Link>
              {user?.role === 'Admin' && (
                <Link to="/admin" className="text-xs font-bold uppercase tracking-wider text-purple-650 hover:text-[#0B1E3D] transition-colors">
                  Admin
                </Link>
              )}
              <button
                id="btn-logout"
                onClick={logout}
                className="p-1.5 transition-colors text-slate-450 hover:text-red-650"
                title="Logout"
              >
                <FiLogOut size={16} />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="text-[10px] font-bold uppercase tracking-[0.15em] border border-[#0B1E3D] text-[#0B1E3D] bg-transparent px-6 py-2 rounded-full transition-all duration-300 hover:bg-[#0B1E3D] hover:text-white"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile Menu Actions */}
        <div className="flex items-center gap-3 lg:hidden">
          <Link to="/cart" className="relative p-1.5 text-slate-800">
            <FiShoppingBag size={18} />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-[#0B1E3D] text-white text-[8px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </Link>
          <button
            id="btn-mobile-menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-slate-800"
          >
            {mobileMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>

      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-[80px] left-0 w-full px-6 py-6 flex flex-col gap-4 animate-fade-in shadow-xl z-50 transition-all duration-500 border-b bg-[#f8fafc] border-slate-200">
          <form onSubmit={handleSearchSubmit} className="flex items-center relative mb-2">
            <input
              id="mobile-search-input"
              type="text"
              placeholder="Search collections..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border rounded-full py-2 pl-4 pr-10 text-sm focus:outline-none focus:border-[#3B82F6]/50 bg-slate-100 border-slate-200 text-slate-800 placeholder-slate-400"
            />
            <button id="mobile-search-button" type="submit" className="absolute right-4 text-slate-500">
              <FiSearch size={18} />
            </button>
          </form>

          <Link to="/" onClick={() => setMobileMenuOpen(false)} className="font-medium py-1 text-sm tracking-wide text-slate-700 hover:text-slate-900">
            Home
          </Link>
          <Link to="/products" onClick={() => setMobileMenuOpen(false)} className="font-medium py-1 text-sm tracking-wide text-slate-700 hover:text-slate-900">
            Shop
          </Link>
          <Link to="/products?tag=New+Arrivals" onClick={() => setMobileMenuOpen(false)} className="font-medium py-1 text-sm tracking-wide text-slate-700 hover:text-slate-900">
            New Arrivals
          </Link>
          <Link to="/wishlist" onClick={() => setMobileMenuOpen(false)} className="font-medium py-1 text-sm tracking-wide flex items-center gap-2 text-slate-700 hover:text-slate-900">
            <FiHeart size={16} /> Wishlist ({wishlist.length})
          </Link>

          {user?.role === 'Admin' && (
            <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="text-purple-400 hover:text-purple-300 font-semibold py-1 text-sm tracking-wide">
              Admin Panel
            </Link>
          )}

          {user ? (
            <>
              <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="font-medium py-1 text-sm tracking-wide flex items-center gap-2 text-slate-700 hover:text-slate-900">
                <FiUser size={16} /> Profile ({user.name})
              </Link>
              <button
                id="mobile-btn-logout"
                onClick={() => { logout(); setMobileMenuOpen(false); }}
                className="text-left text-red-400 hover:text-red-300 font-medium py-1 text-sm tracking-wide flex items-center gap-2"
              >
                <FiLogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="text-center text-xs font-bold uppercase tracking-wider border border-[#3B82F6] py-2.5 rounded-full mt-2 transition-all text-[#3B82F6] hover:bg-[#3B82F6] hover:text-white hover:shadow-[0_4px_12px_rgba(59,130,246,0.2)]"
            >
              Sign In
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
