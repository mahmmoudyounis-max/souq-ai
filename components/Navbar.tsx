import React from 'react';
import { ShoppingCart, Search, Sparkles } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  onCartClick: () => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
  isAiSearching: boolean;
  onReset: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  cartCount, 
  onCartClick, 
  searchTerm, 
  setSearchTerm,
  onSearchSubmit,
  isAiSearching,
  onReset
}) => {
  return (
    <nav className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex-shrink-0 cursor-pointer" onClick={onReset}>
            <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-accent" />
              سوق AI
            </h1>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg mx-8 hidden md:block">
            <form onSubmit={onSearchSubmit} className="relative group">
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                {isAiSearching ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                ) : (
                  <Search className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                )}
              </div>
              <input
                type="text"
                className="block w-full pr-10 pl-3 py-2 border border-gray-300 rounded-full leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:border-primary focus:ring-1 focus:ring-primary sm:text-sm transition-all shadow-sm"
                placeholder="ابحث عن منتج (جرب: 'أبحث عن هدية لصديقي الرياضي')..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="submit" className="hidden"></button>
            </form>
          </div>

          {/* Cart Icon */}
          <div className="flex items-center">
            <button
              onClick={onCartClick}
              className="relative p-2 rounded-full text-gray-600 hover:text-primary hover:bg-gray-100 transition-all"
            >
              <ShoppingCart className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute top-0 left-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform -translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile Search (visible only on small screens) */}
        <div className="pb-3 md:hidden">
           <form onSubmit={onSearchSubmit} className="relative">
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                 <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pr-9 pl-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 focus:border-primary focus:ring-1 focus:ring-primary"
                placeholder="ابحث بذكاء..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </form>
        </div>
      </div>
    </nav>
  );
};