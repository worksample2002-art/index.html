import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, Search, X } from 'lucide-react';
import { useCartStore, useAuthStore } from '../store';
import { useState } from 'react';

export default function Navbar() {
  const items = useCartStore(state => state.items);
  const user = useAuthStore(state => state.user);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold text-emerald-600 tracking-tight">Biscuit</span>
              <span className="text-2xl font-bold text-orange-500 tracking-tight">Bazar</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-emerald-600 font-medium transition-colors">Home</Link>
            <Link to="/shop" className="text-gray-700 hover:text-emerald-600 font-medium transition-colors">Shop</Link>
            <Link to="/about" className="text-gray-700 hover:text-emerald-600 font-medium transition-colors">About Us</Link>
          </div>

          <div className="flex items-center space-x-5">
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="text-gray-600 hover:text-emerald-600 transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>
            <Link to="/cart" className="relative text-gray-600 hover:text-emerald-600 transition-colors">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            
            {user ? (
              <Link to="/dashboard" className="text-gray-600 hover:text-emerald-600 transition-colors">
                <User className="w-5 h-5" />
              </Link>
            ) : (
              <Link to="/login" className="hidden md:inline-flex px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-full shadow-sm shadow-emerald-600/20 transition-all">
                Login / Register
              </Link>
            )}

            <button 
              className="md:hidden text-gray-600 hover:text-emerald-600"
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Search Bar Dropdown */}
        {isSearchOpen && (
          <div className="absolute top-full left-0 w-full p-4 bg-white border-b border-gray-100 shadow-md transform origin-top transition-all">
             <form onSubmit={handleSearch} className="max-w-3xl mx-auto relative flex items-center">
               <input 
                 type="text" 
                 autoFocus
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="w-full bg-gray-50 border border-gray-200 rounded-full px-5 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900"
                 placeholder="Search for biscuits, brands, categories..."
               />
               <button type="submit" className="absolute right-3 p-2 text-emerald-600 hover:text-emerald-700 bg-emerald-50 rounded-full">
                 <Search className="w-4 h-4" />
               </button>
             </form>
          </div>
        )}
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 p-4 absolute w-full shadow-lg">
          <div className="flex flex-col space-y-4">
            <Link to="/" className="text-gray-700 font-medium" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link to="/shop" className="text-gray-700 font-medium" onClick={() => setMobileMenuOpen(false)}>Shop</Link>
            <Link to="/about" className="text-gray-700 font-medium" onClick={() => setMobileMenuOpen(false)}>About Us</Link>
            {!user && (
               <Link to="/login" className="text-emerald-600 font-medium" onClick={() => setMobileMenuOpen(false)}>Login / Register</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
