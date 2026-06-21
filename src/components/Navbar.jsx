import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { FiShoppingCart, FiHeart, FiUser, FiLogOut, FiMenu, FiX, FiSearch, FiSun, FiMoon } from 'react-icons/fi';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount, wishlist } = useCart();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const [isScrolled, setIsScrolled] = useState(false);
  const isHomePage = location.pathname === '/';
  // Navbar is transparent when sitting over the hero (home page, top of page)
  const isTransparent = isHomePage && !isScrolled;

  useEffect(() => {
    if (!isHomePage) return;
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <nav className={`z-50 px-4 sm:px-8 h-[80px] flex items-center transition-all duration-500 w-full ${
      isHomePage ? 'fixed top-0 left-0' : 'sticky top-0 shadow-md'
    } ${
      isHomePage && !isScrolled
        ? 'bg-transparent border-b border-transparent backdrop-blur-none'
        : theme === 'dark'
          ? 'bg-[#050816]/95 border-b border-white/5 backdrop-blur-md'
          : 'bg-[#f8fafc]/95 border-b border-slate-200/85 backdrop-blur-md shadow-sm'
    }`}>
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-4">
        
        {/* Left Section: Logo */}
        <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
          <span className={`text-base sm:text-lg font-bold tracking-[7px] uppercase transition-colors duration-500 ${
            isTransparent || theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}>
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

            return (
              <Component
                key={link.name}
                {...linkProps}
                className={`relative text-[10px] sm:text-[11px] font-bold uppercase tracking-[2.5px] transition-colors duration-500 py-1.5 group ${
                  isTransparent || theme === 'dark' ? 'text-white/80 hover:text-[#3B82F6]' : 'text-slate-700 hover:text-[#3B82F6]'
                }`}
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[#3B82F6] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
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
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full border rounded-full py-1.5 pl-4 pr-10 text-xs transition-all duration-500 backdrop-blur-md focus:outline-none focus:border-[#3B82F6]/50 ${
                isTransparent || theme === 'dark'
                  ? 'bg-white/5 border-white/10 text-white placeholder-white/40 focus:bg-white/10'
                  : 'bg-slate-200/50 border-slate-300 text-slate-800 placeholder-slate-400 focus:bg-white'
              }`}
            />
            <button id="nav-search-button" type="submit" className={`absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors ${
              isTransparent || theme === 'dark' ? 'text-white/60 hover:text-white' : 'text-slate-500 hover:text-slate-800'
            }`}>
              <FiSearch size={14} />
            </button>
          </form>

          {/* Action Icons */}
          <div className="flex items-center gap-3">
            {/* Wishlist Icon */}
            <Link 
              to="/wishlist" 
              className={`relative p-1.5 hover:scale-110 transition-all duration-300 ${
                isTransparent || theme === 'dark' ? 'text-white hover:text-white' : 'text-slate-700 hover:text-[#3B82F6]'
              }`}
              style={{ filter: 'drop-shadow(0 0 0px rgba(255,255,255,0))' }}
              onMouseEnter={(e) => {
                if (theme === 'dark') {
                  e.currentTarget.style.filter = 'drop-shadow(0 0 6px rgba(255,255,255,0.7))';
                } else {
                  e.currentTarget.style.filter = 'drop-shadow(0 0 6px rgba(59,130,246,0.4))';
                }
              }}
              onMouseLeave={(e) => e.currentTarget.style.filter = 'drop-shadow(0 0 0px rgba(255,255,255,0))'}
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
              className={`relative p-1.5 hover:scale-110 transition-all duration-300 ${
                isTransparent || theme === 'dark' ? 'text-white hover:text-white' : 'text-slate-700 hover:text-[#3B82F6]'
              }`}
              style={{ filter: 'drop-shadow(0 0 0px rgba(255,255,255,0))' }}
              onMouseEnter={(e) => {
                if (theme === 'dark') {
                  e.currentTarget.style.filter = 'drop-shadow(0 0 6px rgba(255,255,255,0.7))';
                } else {
                  e.currentTarget.style.filter = 'drop-shadow(0 0 6px rgba(59,130,246,0.4))';
                }
              }}
              onMouseLeave={(e) => e.currentTarget.style.filter = 'drop-shadow(0 0 0px rgba(255,255,255,0))'}
            >
              <FiShoppingCart size={18} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#3B82F6] text-white text-[8px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-extrabold">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-1.5 hover:scale-110 transition-all duration-300 ${
                isTransparent || theme === 'dark' ? 'text-white' : 'text-slate-700 hover:text-[#3B82F6]'
              }`}
              style={{ filter: 'drop-shadow(0 0 0px rgba(255,255,255,0))' }}
              onMouseEnter={(e) => {
                if (theme === 'dark') {
                  e.currentTarget.style.filter = 'drop-shadow(0 0 6px rgba(255,255,255,0.7))';
                } else {
                  e.currentTarget.style.filter = 'drop-shadow(0 0 6px rgba(59,130,246,0.4))';
                }
              }}
              onMouseLeave={(e) => e.currentTarget.style.filter = 'drop-shadow(0 0 0px rgba(255,255,255,0))'}
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? <FiSun size={18} /> : <FiMoon size={18} />}
            </button>
          </div>

          {/* User profile / Sign In */}
          {user ? (
            <div className={`flex items-center gap-3 border-l pl-4 ${
              isTransparent || theme === 'dark' ? 'border-white/10' : 'border-slate-200'
            }`}>
              <Link 
                to="/profile" 
                className={`flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider hover:scale-105 transition-all duration-300 ${
                  isTransparent || theme === 'dark' ? 'text-white' : 'text-slate-800 hover:text-[#3B82F6]'
                }`}
                style={{ filter: 'drop-shadow(0 0 0px rgba(255,255,255,0))' }}
                onMouseEnter={(e) => {
                  if (theme === 'dark') {
                    e.currentTarget.style.filter = 'drop-shadow(0 0 6px rgba(255,255,255,0.7))';
                  } else {
                    e.currentTarget.style.filter = 'drop-shadow(0 0 6px rgba(59,130,246,0.4))';
                  }
                }}
                onMouseLeave={(e) => e.currentTarget.style.filter = 'drop-shadow(0 0 0px rgba(255,255,255,0))'}
              >
                <FiUser size={15} />
                <span>{user.name.split(' ')[0]}</span>
              </Link>
              {user?.role === 'Admin' && (
                <Link to="/admin" className="text-xs font-bold uppercase tracking-wider text-purple-400 hover:text-purple-350 transition-colors">
                  Admin
                </Link>
              )}
              <button 
                id="btn-logout"
                onClick={logout} 
                className={`p-1.5 transition-colors ${
                  isTransparent || theme === 'dark' ? 'text-white/50 hover:text-red-500' : 'text-slate-400 hover:text-red-650'
                }`}
                title="Logout"
              >
                <FiLogOut size={16} />
              </button>
            </div>
          ) : (
            <Link 
              to="/login" 
              className={`text-[10px] font-bold uppercase tracking-[0.18em] border border-[#3B82F6] bg-transparent px-6 py-2.5 rounded-full transition-all duration-300 hover:scale-[1.03] ${
                isTransparent || theme === 'dark'
                  ? 'text-white hover:shadow-[0_0_15px_rgba(59,130,246,0.6)] hover:border-blue-400'
                  : 'text-[#3B82F6] hover:bg-[#3B82F6] hover:text-white hover:shadow-[0_4px_12px_rgba(59,130,246,0.2)]'
              }`}
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile Menu Actions */}
        <div className="flex items-center gap-3 lg:hidden">
          <button
            onClick={toggleTheme}
            className={`p-1.5 transition-transform hover:scale-105 ${
              isTransparent || theme === 'dark' ? 'text-white' : 'text-slate-700'
            }`}
          >
            {theme === 'dark' ? <FiSun size={18} /> : <FiMoon size={18} />}
          </button>

          <Link to="/cart" className={`relative p-1.5 ${
            isTransparent || theme === 'dark' ? 'text-white' : 'text-slate-700'
          }`}>
            <FiShoppingCart size={18} />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-[#3B82F6] text-white text-[8px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </Link>
          <button 
            id="btn-mobile-menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className={theme === 'dark' ? 'p-1.5 text-white' : 'p-1.5 text-slate-700'}
          >
            {mobileMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>

      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className={`lg:hidden absolute top-[80px] left-0 w-full px-6 py-6 flex flex-col gap-4 animate-fade-in shadow-xl z-50 transition-all duration-500 border-b ${
          theme === 'dark' 
            ? 'bg-[#050816] border-white/10' 
            : 'bg-[#f8fafc] border-slate-200'
        }`}>
          <form onSubmit={handleSearchSubmit} className="flex items-center relative mb-2">
            <input
              id="mobile-search-input"
              type="text"
              placeholder="Search collections..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full border rounded-full py-2 pl-4 pr-10 text-sm focus:outline-none focus:border-[#3B82F6]/50 ${
                theme === 'dark'
                  ? 'bg-white/5 border-white/10 text-slate-100 placeholder-slate-500'
                  : 'bg-slate-100 border-slate-200 text-slate-800 placeholder-slate-400'
              }`}
            />
            <button id="mobile-search-button" type="submit" className={`absolute right-4 ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
            }`}>
              <FiSearch size={18} />
            </button>
          </form>

          <Link to="/" onClick={() => setMobileMenuOpen(false)} className={`font-medium py-1 text-sm tracking-wide ${
            theme === 'dark' ? 'text-white/80 hover:text-white' : 'text-slate-700 hover:text-slate-900'
          }`}>
            Home
          </Link>
          <Link to="/products" onClick={() => setMobileMenuOpen(false)} className={`font-medium py-1 text-sm tracking-wide ${
            theme === 'dark' ? 'text-white/80 hover:text-white' : 'text-slate-700 hover:text-slate-900'
          }`}>
            Shop
          </Link>
          <Link to="/products?tag=New+Arrivals" onClick={() => setMobileMenuOpen(false)} className={`font-medium py-1 text-sm tracking-wide ${
            theme === 'dark' ? 'text-white/80 hover:text-white' : 'text-slate-700 hover:text-slate-900'
          }`}>
            New Arrivals
          </Link>
          <Link to="/wishlist" onClick={() => setMobileMenuOpen(false)} className={`font-medium py-1 text-sm tracking-wide flex items-center gap-2 ${
            theme === 'dark' ? 'text-white/80 hover:text-white' : 'text-slate-700 hover:text-slate-900'
          }`}>
            <FiHeart size={16} /> Wishlist ({wishlist.length})
          </Link>
          
          {user?.role === 'Admin' && (
            <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="text-purple-400 hover:text-purple-300 font-semibold py-1 text-sm tracking-wide">
              Admin Panel
            </Link>
          )}

          {user ? (
            <>
              <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className={`font-medium py-1 text-sm tracking-wide flex items-center gap-2 ${
                theme === 'dark' ? 'text-white/80 hover:text-white' : 'text-slate-700 hover:text-slate-900'
              }`}>
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
              className={`text-center text-xs font-bold uppercase tracking-wider border border-[#3B82F6] py-2.5 rounded-full mt-2 transition-all ${
                theme === 'dark'
                  ? 'text-white hover:shadow-[0_0_15px_rgba(59,130,246,0.6)]'
                  : 'text-[#3B82F6] hover:bg-[#3B82F6] hover:text-white hover:shadow-[0_4px_12px_rgba(59,130,246,0.2)]'
              }`}
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
