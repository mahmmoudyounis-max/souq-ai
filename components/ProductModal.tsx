
import React, { useState, useEffect } from 'react';
import { Product, AIStatus } from '../types';
import { X, ShoppingBag, Wand2, Sparkles, Truck, Package, CheckCircle, Shield } from 'lucide-react';
import { generateProductMarketingCopy } from '../services/geminiService';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, isOpen, onClose, onAddToCart }) => {
  const [aiDescription, setAiDescription] = useState<string | null>(null);
  const [aiStatus, setAiStatus] = useState<AIStatus>(AIStatus.IDLE);

  useEffect(() => {
    if (isOpen) {
      setAiDescription(null);
      setAiStatus(AIStatus.IDLE);
    }
  }, [isOpen, product]);

  const handleGenerateDescription = async () => {
    if (!product) return;
    setAiStatus(AIStatus.THINKING);
    try {
      const desc = await generateProductMarketingCopy(product);
      setAiDescription(desc);
      setAiStatus(AIStatus.SUCCESS);
    } catch (e) {
      setAiStatus(AIStatus.ERROR);
    }
  };

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity backdrop-blur-sm" aria-hidden="true" onClick={onClose}></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="relative inline-block align-bottom bg-white rounded-2xl text-right overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl w-full">
          
          <div className="absolute top-4 left-4 z-10">
            <button
              type="button"
              className="bg-white/80 rounded-full p-2 text-gray-400 hover:text-gray-500 focus:outline-none backdrop-blur-md"
              onClick={onClose}
            >
              <span className="sr-only">إغلاق</span>
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="relative h-64 md:h-full bg-gray-100">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
              {product.isHot && (
                <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-md animate-pulse">
                  🔥 الأكثر مبيعاً
                </div>
              )}
            </div>

            <div className="p-6 md:p-8 flex flex-col h-full">
              <div className="mb-1 flex justify-between items-start">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {product.category}
                </span>
                {product.originalPrice && (
                  <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                    خصم {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                  </span>
                )}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h2>
              
              <div className="flex items-center mb-4 gap-4">
                <div className="flex items-center">
                    <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                        <Sparkles key={i} className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-300'}`} />
                    ))}
                    </div>
                    <span className="mr-2 text-sm text-gray-500">({product.reviewsCount || 100}+ تقييم)</span>
                </div>
              </div>

              {/* Dropshipping Trust Badges */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                 <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg border border-gray-100">
                    <Package className="w-4 h-4 text-primary" />
                    <div>
                        <p className="text-[10px] text-gray-500">المورد</p>
                        <p className="text-xs font-bold text-gray-800">{product.supplier || 'DSers Verified'}</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg border border-gray-100">
                    <Truck className="w-4 h-4 text-green-600" />
                    <div>
                        <p className="text-[10px] text-gray-500">مدة الشحن</p>
                        <p className="text-xs font-bold text-gray-800">{product.shippingTime || '10-15 يوم'}</p>
                    </div>
                 </div>
              </div>

              <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                {product.shortDescription}
              </p>

              {/* AI Section */}
              <div className="bg-indigo-50 rounded-xl p-4 mb-6 border border-indigo-100">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-bold text-indigo-900 flex items-center gap-2">
                    <Wand2 className="w-4 h-4" />
                    لماذا تشتري هذا المنتج؟ (AI)
                  </h4>
                  {aiStatus === AIStatus.IDLE && (
                    <button 
                      onClick={handleGenerateDescription}
                      className="text-xs bg-indigo-600 text-white px-3 py-1 rounded-full hover:bg-indigo-700 transition-colors"
                    >
                      توليد
                    </button>
                  )}
                </div>
                
                <div className="min-h-[60px] text-sm text-indigo-800 leading-relaxed">
                  {aiStatus === AIStatus.THINKING ? (
                    <div className="flex items-center gap-2 animate-pulse">
                       <div className="h-2 w-2 bg-indigo-400 rounded-full animate-bounce"></div>
                       <div className="h-2 w-2 bg-indigo-400 rounded-full animate-bounce delay-75"></div>
                       جاري الكتابة...
                    </div>
                  ) : aiStatus === AIStatus.SUCCESS ? (
                    <p className="animate-in fade-in duration-500">{aiDescription}</p>
                  ) : (
                     <p className="text-indigo-400 italic text-xs">اضغط توليد لمعرفة مميزات المنتج الخفية.</p>
                  )}
                </div>
              </div>

              <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                 <div>
                   <p className="text-xs text-gray-400 line-through">{product.originalPrice ? `${product.originalPrice} ر.س` : ''}</p>
                   <p className="text-3xl font-bold text-gray-900">{product.price} <span className="text-sm font-normal text-gray-500">ر.س</span></p>
                 </div>
                 <button
                    onClick={() => {
                      onAddToCart(product);
                      onClose();
                    }}
                    className="flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-primary hover:bg-blue-700 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                  >
                    <ShoppingBag className="ml-2 -mr-1 h-5 w-5" />
                    أضف للسلة
                  </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
