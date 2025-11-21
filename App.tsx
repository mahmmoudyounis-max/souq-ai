
import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ProductGrid } from './components/ProductGrid';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { AIChat } from './components/AIChat';
import { Product, CartItem } from './types';
import { MOCK_PRODUCTS } from './constants';
import { searchProductsWithAI } from './services/geminiService';
import { Truck, ShieldCheck, Clock, CreditCard, Award, Globe, Zap, Box, Anchor } from 'lucide-react';

const App: React.FC = () => {
  // State
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Search State
  const [searchTerm, setSearchTerm] = useState('');
  const [isAiSearching, setIsAiSearching] = useState(false);

  // Load initial data (simulated)
  useEffect(() => {
    // In a real app, fetch from API here
    setProducts(MOCK_PRODUCTS);
    setFilteredProducts(MOCK_PRODUCTS);
  }, []);

  // Cart Logic
  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    
    setIsCartOpen(true); 
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    }));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Search Logic
  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      setFilteredProducts(products);
      return;
    }

    setIsAiSearching(true);

    const simpleMatches = products.filter(p => 
      p.name.includes(searchTerm) || p.shortDescription.includes(searchTerm)
    );

    try {
        const relevantIds = await searchProductsWithAI(searchTerm, products);
        
        if (relevantIds.length > 0) {
           const aiMatches = products.filter(p => relevantIds.includes(p.id));
           const combined = Array.from(new Set([...aiMatches, ...simpleMatches]));
           setFilteredProducts(combined);
        } else {
            setFilteredProducts(simpleMatches);
        }
    } catch (error) {
        console.error("Search failed", error);
        setFilteredProducts(simpleMatches); 
    } finally {
        setIsAiSearching(false);
    }
  };

  const resetSearch = () => {
      setSearchTerm('');
      setFilteredProducts(products);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans flex flex-col" dir="rtl">
      <Navbar 
        cartCount={cart.reduce((acc, item) => acc + item.quantity, 0)}
        onCartClick={() => setIsCartOpen(true)}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onSearchSubmit={handleSearchSubmit}
        isAiSearching={isAiSearching}
        onReset={resetSearch}
      />

      {/* Dropshipping Hero Section */}
      <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative z-10 text-center">
            <div className="inline-block mb-4 px-4 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-blue-200 text-sm font-medium animate-pulse">
               🔥 عروض AliExpress و DSers الحصرية
            </div>
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
                أفضل المنتجات العالمية (Trending)، <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">تصلك من المصنع مباشرة</span>
            </h1>
            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
                نحن نوفر عليك عناء البحث. نختار لك أفضل المنتجات الرائجة من الموردين العالميين بأفضل الأسعار مع ضمان التوصيل.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
               <button onClick={() => document.getElementById('products-section')?.scrollIntoView({behavior: 'smooth'})} className="px-8 py-4 bg-white text-blue-900 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all">
                 تصفح العروض
               </button>
               <div className="flex items-center gap-2 px-6 py-4 bg-blue-800/50 backdrop-blur rounded-full text-white border border-blue-700/50">
                  <Clock className="w-5 h-5 text-yellow-400" />
                  <span className="font-medium">خصومات تصل لـ 50%</span>
               </div>
            </div>
        </div>
      </div>

      {/* Trust Bar */}
      <div className="bg-white border-b border-gray-200 shadow-sm relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
           <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="flex flex-col items-center gap-2">
                 <div className="p-3 bg-blue-50 text-blue-600 rounded-full">
                    <Globe className="w-6 h-6" />
                 </div>
                 <div>
                    <h4 className="font-bold text-sm text-gray-900">شحن دولي مباشر</h4>
                    <p className="text-xs text-gray-500">عبر AliExpress Direct</p>
                 </div>
              </div>
              <div className="flex flex-col items-center gap-2">
                 <div className="p-3 bg-green-50 text-green-600 rounded-full">
                    <ShieldCheck className="w-6 h-6" />
                 </div>
                 <div>
                    <h4 className="font-bold text-sm text-gray-900">حماية المشتري</h4>
                    <p className="text-xs text-gray-500">استرداد كامل للمبلغ</p>
                 </div>
              </div>
              <div className="flex flex-col items-center gap-2">
                 <div className="p-3 bg-purple-50 text-purple-600 rounded-full">
                    <Box className="w-6 h-6" />
                 </div>
                 <div>
                    <h4 className="font-bold text-sm text-gray-900">تغليف آمن</h4>
                    <p className="text-xs text-gray-500">ضمان وصول المنتج سليماً</p>
                 </div>
              </div>
              <div className="flex flex-col items-center gap-2">
                 <div className="p-3 bg-orange-50 text-orange-600 rounded-full">
                    <Zap className="w-6 h-6" />
                 </div>
                 <div>
                    <h4 className="font-bold text-sm text-gray-900">منتجات "ترند"</h4>
                    <p className="text-xs text-gray-500">تحديث يومي للمنتجات</p>
                 </div>
              </div>
           </div>
        </div>
      </div>

      <main id="products-section" className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="flex items-center justify-between mb-8">
            <div>
               <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                 <span className="w-2 h-8 bg-primary rounded-full"></span>
                 منتجات مختارة لك
               </h2>
               <p className="text-gray-500 mt-1 mr-4">الأكثر طلباً في أسواق الدروبشيبنج العالمية</p>
            </div>
        </div>

        <ProductGrid 
          products={filteredProducts} 
          onAddToCart={addToCart} 
          onViewDetails={(p) => { setSelectedProduct(p); setIsModalOpen(true); }}
        />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 border-t border-gray-800">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
               <div className="col-span-1 md:col-span-1">
                  <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                    <Anchor className="w-5 h-5 text-blue-500" />
                    سوق AI
                  </h3>
                  <p className="text-sm leading-relaxed text-gray-400 mb-4">
                     متجرك الأول لمنتجات الدروبشيبنج المميزة. نربطك مباشرة مع أفضل المصانع العالمية لتحصل على منتجات عالية الجودة بأسعار الجملة.
                  </p>
                  <div className="flex gap-2 text-xs text-gray-500">
                     <span className="bg-gray-800 px-2 py-1 rounded">Powered by DSers</span>
                     <span className="bg-gray-800 px-2 py-1 rounded">AliExpress API</span>
                  </div>
               </div>
               
               <div>
                  <h3 className="text-white font-bold text-lg mb-4">خدمة العملاء</h3>
                  <ul className="space-y-2 text-sm">
                     <li><a href="#" className="hover:text-white transition-colors">تتبع طلبك (Track Order)</a></li>
                     <li><a href="#" className="hover:text-white transition-colors">سياسة الشحن والتوصيل</a></li>
                     <li><a href="#" className="hover:text-white transition-colors">سياسة الاسترجاع</a></li>
                     <li><a href="#" className="hover:text-white transition-colors">الأسئلة الشائعة</a></li>
                  </ul>
               </div>

               <div>
                  <h3 className="text-white font-bold text-lg mb-4">التسوق</h3>
                  <ul className="space-y-2 text-sm">
                     <li><a href="#" className="hover:text-white transition-colors">أحدث المنتجات</a></li>
                     <li><a href="#" className="hover:text-white transition-colors">الأكثر مبيعاً</a></li>
                     <li><a href="#" className="hover:text-white transition-colors">عروض الفلاش</a></li>
                  </ul>
               </div>

               <div>
                  <h3 className="text-white font-bold text-lg mb-4">نقبل الدفع عبر</h3>
                  <div className="grid grid-cols-2 gap-2">
                     <div className="bg-white px-3 py-2 rounded flex items-center justify-center h-10" title="Mada">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mada_Logo.svg/320px-Mada_Logo.svg.png" className="h-4 object-contain" alt="Mada" onError={(e) => e.currentTarget.style.display='none'} />
                        <span className="text-blue-900 font-bold text-xs" style={{display: 'none'}}>Mada</span> {/* Fallback */}
                        <CreditCard className="h-5 text-blue-600" />
                     </div>
                     <div className="bg-white px-3 py-2 rounded flex items-center justify-center h-10" title="Visa">
                        <span className="text-blue-900 font-bold font-serif italic">VISA</span>
                     </div>
                     <div className="bg-white px-3 py-2 rounded flex items-center justify-center h-10" title="PayPal">
                        <span className="text-[#003087] font-bold italic">PayPal</span>
                     </div>
                     <div className="bg-white px-3 py-2 rounded flex items-center justify-center h-10" title="Payoneer">
                        <Globe className="text-orange-500 w-5 h-5 mr-1" />
                        <span className="text-gray-800 font-bold text-xs">Payoneer</span>
                     </div>
                  </div>
                  <p className="mt-4 text-xs text-gray-500">جميع الحقوق محفوظة © 2024 سوق AI</p>
               </div>
            </div>
         </div>
      </footer>

      <ProductModal 
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddToCart={addToCart}
      />

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cartItems={cart} 
        onRemove={removeFromCart}
        onUpdateQuantity={updateQuantity}
        onClearCart={clearCart}
      />

      <AIChat />

    </div>
  );
};

export default App;
