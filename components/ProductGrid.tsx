
import React from 'react';
import { Product } from '../types';
import { Plus, Star, Wand2, Eye, Flame } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onViewDetails: (product: Product) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products, onAddToCart, onViewDetails }) => {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="text-gray-400 mb-4">
          <SearchIcon className="w-16 h-16 mx-auto opacity-20" />
        </div>
        <h3 className="text-xl font-medium text-gray-900">لا توجد نتائج</h3>
        <p className="text-gray-500 mt-2">جرب البحث بكلمات أخرى أو استخدم الوصف الذكي.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
      {products.map((product) => (
        <div 
          key={product.id} 
          className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col relative"
        >
          {/* Discount Badge */}
          {product.originalPrice && (
             <div className="absolute top-3 left-3 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm">
                خصم {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
             </div>
          )}

          <div className="relative overflow-hidden aspect-[4/3] bg-gray-100 cursor-pointer" onClick={() => onViewDetails(product)}>
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            {product.isHot && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 pt-8">
                 <div className="flex items-center gap-1 text-white text-xs font-bold">
                    <Flame className="w-3 h-3 text-orange-500 fill-orange-500" />
                    شائع جداً هذا الأسبوع
                 </div>
              </div>
            )}
          </div>

          <div className="p-4 flex-1 flex flex-col">
            <div className="flex justify-between items-start mb-1">
               <div className="text-xs text-gray-400">{product.category}</div>
               <div className="flex items-center gap-1 text-xs font-bold text-gray-700">
                 <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                 {product.rating}
               </div>
            </div>
            
            <h3 
               className="text-base font-bold text-gray-900 line-clamp-2 mb-2 cursor-pointer hover:text-primary transition-colors" 
               onClick={() => onViewDetails(product)}
               title={product.name}
            >
              {product.name}
            </h3>
            
            <div className="mt-auto pt-3 flex items-center justify-between border-t border-gray-50">
              <div>
                 {product.originalPrice && (
                   <span className="block text-xs text-gray-400 line-through">{product.originalPrice} ر.س</span>
                 )}
                 <span className="text-lg font-bold text-primary">
                   {product.price} <span className="text-xs font-normal text-gray-500">ر.س</span>
                 </span>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => onViewDetails(product)}
                  className="p-2 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors"
                  title="التفاصيل"
                >
                  <Eye className="w-5 h-5" />
                </button>
                <button
                  onClick={() => onAddToCart(product)}
                  className="p-2 rounded-lg bg-gray-900 text-white hover:bg-primary transition-colors shadow-md active:scale-95 transform"
                  title="إضافة للسلة"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Helper component for empty state
const SearchIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);
