
import React, { useState, useEffect } from 'react';
import { CartItem } from '../types';
import { X, Trash2, ArrowRight, CreditCard, CheckCircle2, Wallet, Globe, Loader2, ChevronRight, MapPin, Truck, Lock, ShieldCheck, Package } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onRemove: (id: number) => void;
  onUpdateQuantity: (id: number, delta: number) => void;
  onClearCart: () => void;
}

type PaymentMethod = 'MADA' | 'VISA' | 'PAYPAL' | 'PAYONEER';
type ViewState = 'CART' | 'SHIPPING' | 'PAYMENT' | 'SUCCESS';

interface ShippingDetails {
  name: string;
  phone: string;
  address: string;
  city: string;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ 
  isOpen, 
  onClose, 
  cartItems, 
  onRemove, 
  onUpdateQuantity,
  onClearCart
}) => {
  const [view, setView] = useState<ViewState>('CART');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('VISA');
  const [isProcessing, setIsProcessing] = useState(false);
  const [shipping, setShipping] = useState<ShippingDetails>({ name: '', phone: '', address: '', city: '' });

  // Calculations
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingTotal = cartItems.reduce((sum, item) => sum + ((item.shippingPrice || 0) * item.quantity), 0);
  const total = subtotal + shippingTotal;
  
  const originalTotal = cartItems.reduce((sum, item) => sum + ((item.originalPrice || item.price) * item.quantity), 0);
  const savings = originalTotal - subtotal;

  // Extract Shipping Times
  const shippingTimes = Array.from(new Set(cartItems.map(item => item.shippingTime).filter(Boolean)));
  const shippingDurationDisplay = shippingTimes.length > 0 
    ? shippingTimes.length > 1 ? '7-20 يوم (حسب المنتج)' : shippingTimes[0]
    : '10-15 يوم';

  // Reset view when drawer is closed
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setView('CART');
        setIsProcessing(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setView('PAYMENT');
  };

  const handlePayment = () => {
    setIsProcessing(true);
    // Simulate API call to Payment Gateway
    setTimeout(() => {
      setIsProcessing(false);
      setView('SUCCESS');
      onClearCart();
    }, 3000);
  };

  const renderHeader = (title: string, backAction?: () => void) => (
    <div className="px-4 py-4 bg-white border-b border-gray-100 flex items-center justify-between sticky top-0 z-10 shadow-sm">
      <div className="flex items-center gap-2">
         {backAction && (
           <button onClick={backAction} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
             <ChevronRight className="w-6 h-6 text-gray-600" />
           </button>
         )}
         <h2 className="text-lg font-bold text-gray-900">{title}</h2>
      </div>
      <div className="flex flex-col items-end">
        <div className="text-primary font-bold text-lg">{view === 'CART' ? subtotal : total} ر.س</div>
        {savings > 0 && <div className="text-xs text-green-600 font-medium">وفرت {savings} ر.س</div>}
      </div>
    </div>
  );

  const renderCartView = () => (
    <div className="h-full flex flex-col animate-in slide-in-from-left duration-300">
      <div className="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
        <div className="flex items-start justify-between">
          <h2 className="text-lg font-medium text-gray-900">سلة التسوق ({cartItems.length})</h2>
          <div className="ml-3 h-7 flex items-center">
            <button onClick={onClose} className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none">
              <span className="sr-only">إغلاق</span>
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="mt-8">
          {cartItems.length === 0 ? (
            <div className="text-center py-10">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">سلتك فارغة حالياً.</p>
              <p className="text-gray-400 text-sm mt-2">تصفح أفضل عروض الدروبشيبنج الحصرية.</p>
              <button onClick={onClose} className="mt-6 text-primary hover:text-blue-800 font-bold text-sm border border-primary px-6 py-2 rounded-full hover:bg-primary hover:text-white transition-all">
                ابدأ التسوق
              </button>
            </div>
          ) : (
            <div className="flow-root">
              <ul className="-my-6 divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <li key={item.id} className="py-6 flex">
                    <div className="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-xl overflow-hidden relative">
                      <img src={item.image} alt={item.name} className="w-full h-full object-center object-cover" />
                      {item.originalPrice && (
                        <span className="absolute bottom-0 right-0 bg-red-500 text-white text-[10px] px-1 font-bold">
                          -{Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}%
                        </span>
                      )}
                    </div>

                    <div className="mr-4 flex-1 flex flex-col">
                      <div>
                        <div className="flex justify-between text-base font-bold text-gray-900">
                          <h3 className="line-clamp-1 text-sm">{item.name}</h3>
                          <p className="mr-4 text-primary">{item.price * item.quantity} ر.س</p>
                        </div>
                        <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                            <span className="bg-gray-100 px-1.5 py-0.5 rounded">{item.supplier}</span>
                            {item.shippingPrice === 0 ? (
                                <span className="text-green-600 font-bold">شحن مجاني</span>
                            ) : (
                                <span>شحن: {item.shippingPrice} ر.س</span>
                            )}
                        </div>
                      </div>
                      <div className="flex-1 flex items-end justify-between text-sm">
                        <div className="flex items-center border border-gray-300 rounded-lg bg-gray-50">
                          <button 
                            onClick={() => onUpdateQuantity(item.id, -1)}
                            className="px-3 py-1 hover:bg-gray-200 text-gray-600 disabled:opacity-50 rounded-r-lg transition-colors"
                            disabled={item.quantity <= 1}
                          >-</button>
                          <span className="px-2 py-1 font-medium w-8 text-center bg-white h-full flex items-center justify-center">{item.quantity}</span>
                          <button 
                            onClick={() => onUpdateQuantity(item.id, 1)}
                            className="px-3 py-1 hover:bg-gray-200 text-gray-600 rounded-l-lg transition-colors"
                          >+</button>
                        </div>

                        <button
                          type="button"
                          onClick={() => onRemove(item.id)}
                          className="font-medium text-red-500 hover:text-red-700 flex items-center gap-1 text-xs bg-red-50 px-2 py-1 rounded hover:bg-red-100 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                          حذف
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {cartItems.length > 0 && (
        <div className="border-t border-gray-200 py-6 px-4 sm:px-6 bg-gray-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <div className="flex justify-between text-base font-medium text-gray-900 mb-2">
            <p>المجموع الفرعي</p>
            <p>{subtotal} ر.س</p>
          </div>
          <div className="flex justify-between text-sm text-gray-500 font-medium mb-4 bg-gray-100 p-2 rounded-lg border border-gray-200 border-dashed">
            <p className="flex items-center gap-1"><Truck className="w-4 h-4" /> الشحن والضريبة</p>
            <p className="text-xs">يتم الحساب عند الدفع</p>
          </div>
          <div className="mt-6">
            <button
              onClick={() => setView('SHIPPING')}
              className="w-full flex justify-center items-center px-6 py-4 border border-transparent rounded-xl shadow-lg text-base font-bold text-white bg-gradient-to-r from-primary to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all transform active:scale-[0.98]"
            >
              متابعة الشراء الآمن <ArrowRight className="mr-2 w-5 h-5 rtl:rotate-180" />
            </button>
          </div>
          <div className="mt-4 flex justify-center gap-4 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
             <CreditCard className="w-6 h-6" />
             <Globe className="w-6 h-6" />
             <Wallet className="w-6 h-6" />
             <ShieldCheck className="w-6 h-6" />
          </div>
        </div>
      )}
    </div>
  );

  const renderShippingView = () => (
    <div className="h-full flex flex-col bg-gray-50 animate-in slide-in-from-left duration-300">
      {renderHeader('بيانات الشحن', () => setView('CART'))}

      <form onSubmit={handleShippingSubmit} className="flex-1 overflow-y-auto p-4 space-y-6">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
           <div className="flex items-center gap-2 text-gray-800 font-bold mb-2">
             <MapPin className="w-5 h-5 text-primary" />
             <h3>عنوان التوصيل</h3>
           </div>
           
           <div>
             <label className="block text-xs font-bold text-gray-700 mb-1">الاسم الكامل</label>
             <input 
               required
               type="text" 
               value={shipping.name}
               onChange={e => setShipping({...shipping, name: e.target.value})}
               placeholder="الاسم الثنائي" 
               className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" 
             />
           </div>

           <div>
             <label className="block text-xs font-bold text-gray-700 mb-1">رقم الجوال</label>
             <input 
               required
               type="tel" 
               value={shipping.phone}
               onChange={e => setShipping({...shipping, phone: e.target.value})}
               placeholder="05xxxxxxxx" 
               className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" 
             />
           </div>

           <div>
             <label className="block text-xs font-bold text-gray-700 mb-1">المدينة</label>
             <input 
               required
               type="text" 
               value={shipping.city}
               onChange={e => setShipping({...shipping, city: e.target.value})}
               placeholder="الرياض" 
               className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" 
             />
           </div>

           <div>
             <label className="block text-xs font-bold text-gray-700 mb-1">العنوان التفصيلي</label>
             <textarea 
               required
               value={shipping.address}
               onChange={e => setShipping({...shipping, address: e.target.value})}
               placeholder="الحي، الشارع، رقم المبنى" 
               rows={3}
               className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none resize-none" 
             />
           </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-xl flex items-start gap-3 border border-blue-100">
           <ShieldCheck className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
           <p className="text-xs text-blue-800">
             بياناتك مشفرة وآمنة. نستخدمها فقط لتوصيل طلباتك من مستودعاتنا العالمية.
           </p>
        </div>

        <button
            type="submit"
            className="w-full flex justify-center items-center px-6 py-4 border border-transparent rounded-xl shadow-sm text-base font-bold text-white bg-primary hover:bg-blue-700 transition-colors"
         >
            الذهاب للدفع <ArrowRight className="mr-2 w-5 h-5 rtl:rotate-180" />
         </button>
      </form>
    </div>
  );

  const renderPaymentView = () => (
    <div className="h-full flex flex-col bg-gray-50 animate-in slide-in-from-left duration-300">
      {renderHeader('الدفع الآمن', () => setView('SHIPPING'))}

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Shipping Address Confirmation */}
        <div className="bg-white border border-gray-200 p-4 rounded-xl flex justify-between items-center shadow-sm">
           <div className="text-sm text-gray-700">
              <span className="font-bold text-gray-900">الشحن لـ:</span> {shipping.city}
           </div>
           <button onClick={() => setView('SHIPPING')} className="text-xs text-primary font-bold underline">تعديل</button>
        </div>

        {/* Shopify-style Order Summary */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2">ملخص الطلب</h3>
            
            <div className="flex justify-between text-sm text-gray-600">
                <span>المجموع الفرعي ({cartItems.length} منتجات)</span>
                <span>{subtotal} ر.س</span>
            </div>
            
            <div className="flex justify-between text-sm items-start">
                <div className="flex flex-col">
                    <span className="text-gray-600">الشحن والتوصيل</span>
                    <span className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5">
                       <Truck className="w-3 h-3" />
                       {shippingDurationDisplay}
                    </span>
                </div>
                <span className={`font-medium ${shippingTotal === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                    {shippingTotal === 0 ? 'مجاني' : `${shippingTotal} ر.س`}
                </span>
            </div>

            <div className="flex justify-between text-sm text-gray-600">
                <span>الضريبة</span>
                <span>شامل الضريبة</span>
            </div>

             <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-gray-900 text-lg">
                <span>الإجمالي الكلي</span>
                <span className="text-primary">{total} ر.س</span>
            </div>
        </div>

        {/* Payment Methods */}
        <div>
          <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Lock className="w-4 h-4 text-gray-500" />
            اختر وسيلة الدفع
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: 'MADA', label: 'مدى', icon: CreditCard, color: 'text-blue-600', bg: 'bg-blue-50' },
              { id: 'VISA', label: 'فيزا / ماستر', icon: CreditCard, color: 'text-blue-900', bg: 'bg-indigo-50' },
              { id: 'PAYPAL', label: 'PayPal', icon: Wallet, color: 'text-[#003087]', bg: 'bg-blue-50' },
              { id: 'PAYONEER', label: 'Payoneer', icon: Globe, color: 'text-[#FF4800]', bg: 'bg-orange-50' },
            ].map((method) => (
               <button
                 key={method.id}
                 onClick={() => setSelectedMethod(method.id as PaymentMethod)}
                 className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all relative overflow-hidden ${
                   selectedMethod === method.id 
                     ? `border-primary ${method.bg} shadow-md transform scale-[1.02]` 
                     : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                 }`}
               >
                 {selectedMethod === method.id && (
                   <div className="absolute top-2 right-2 text-primary">
                     <CheckCircle2 className="w-4 h-4" />
                   </div>
                 )}
                 <method.icon className={`w-8 h-8 mb-2 ${method.color}`} />
                 <span className="text-sm font-bold text-gray-800">{method.label}</span>
               </button>
            ))}
          </div>
        </div>

        {/* Dynamic Payment Form */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary"></div>
          
          {(selectedMethod === 'VISA' || selectedMethod === 'MADA') && (
             <div className="space-y-4 animate-in fade-in duration-300">
               <div className="flex items-center gap-2 mb-2 border-b border-gray-100 pb-2">
                  <div className={`h-3 w-3 rounded-full ${selectedMethod === 'MADA' ? 'bg-blue-600' : 'bg-blue-900'}`}></div>
                  <span className="text-sm font-bold text-gray-700">بيانات {selectedMethod === 'MADA' ? 'بطاقة مدى' : 'البطاقة الائتمانية'}</span>
               </div>
               <div>
                 <label className="block text-xs font-bold text-gray-600 mb-1">رقم البطاقة</label>
                 <div className="relative">
                    <input type="text" placeholder="0000 0000 0000 0000" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none dir-ltr text-left font-mono" dir="ltr" />
                    <CreditCard className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                 </div>
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="block text-xs font-bold text-gray-600 mb-1">تاريخ الانتهاء</label>
                   <input type="text" placeholder="MM/YY" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-center font-mono" dir="ltr" />
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-gray-600 mb-1">CVV</label>
                   <input type="text" placeholder="123" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-center font-mono" dir="ltr" />
                 </div>
               </div>
               <div>
                 <label className="block text-xs font-bold text-gray-600 mb-1">اسم حامل البطاقة</label>
                 <input type="text" placeholder="الاسم كما يظهر على البطاقة" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" />
               </div>
             </div>
          )}
          
          {(selectedMethod === 'PAYPAL' || selectedMethod === 'PAYONEER') && (
             <div className="space-y-4 text-center py-6 animate-in fade-in duration-300">
                <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${selectedMethod === 'PAYPAL' ? 'bg-blue-100' : 'bg-orange-100'}`}>
                  {selectedMethod === 'PAYPAL' ? <Wallet className="w-8 h-8 text-[#003087]" /> : <Globe className="w-8 h-8 text-[#FF4800]" />}
                </div>
                <h4 className="font-bold text-gray-900">الدفع عبر {selectedMethod === 'PAYPAL' ? 'PayPal' : 'Payoneer'}</h4>
                <p className="text-sm text-gray-500 leading-relaxed px-4">
                  سيتم توجيهك إلى صفحة {selectedMethod === 'PAYPAL' ? 'PayPal' : 'Payoneer'} الآمنة لإتمام عملية الدفع.
                </p>
             </div>
          )}
        </div>
      </div>

      <div className="p-4 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
         <button
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full flex justify-center items-center px-6 py-4 border border-transparent rounded-xl shadow-sm text-base font-bold text-white bg-primary hover:bg-blue-700 transition-all disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.98]"
         >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin ml-2" />
                جاري الاتصال بالبوابة...
              </>
            ) : (
              <>تأكيد الدفع {total} ر.س</>
            )}
         </button>
         <div className="mt-4 flex justify-center items-center gap-2 text-xs text-gray-400">
           <Lock className="w-3 h-3" />
           <span>تشفير SSL 256-bit آمن</span>
         </div>
      </div>
    </div>
  );

  const renderSuccessView = () => (
    <div className="h-full flex flex-col items-center justify-center p-6 text-center bg-white animate-in zoom-in duration-300">
      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
        <CheckCircle2 className="w-12 h-12 text-green-600" />
      </div>
      <h2 className="text-3xl font-extrabold text-gray-900 mb-2">تم استلام الطلب!</h2>
      <p className="text-lg text-gray-600 mb-8 font-medium">
        شكراً {shipping.name.split(' ')[0]}، سيتم شحن طلبك قريباً.
      </p>
      
      <div className="bg-gray-50 rounded-2xl p-6 w-full max-w-xs mb-8 border border-gray-100 shadow-sm text-right">
         <div className="flex justify-between items-center mb-3">
             <span className="text-sm text-gray-500">رقم الطلب</span>
             <span className="text-lg font-mono font-bold text-primary">#{(Math.random() * 100000).toFixed(0)}</span>
         </div>
         <div className="border-t border-gray-200 my-3"></div>
         <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-500">الحالة</span>
            <span className="font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded text-xs">قيد المعالجة</span>
         </div>
         <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-500">الشحن</span>
            <div className="text-left">
              <span className="block font-bold text-gray-900">AliExpress Direct</span>
              <span className="text-[10px] text-gray-500">{shippingDurationDisplay}</span>
            </div>
         </div>
         <div className="flex justify-between text-sm">
            <span className="text-gray-500">طريقة الدفع</span>
            <span className="font-bold text-gray-900">{selectedMethod}</span>
         </div>
      </div>

      <button
        onClick={onClose}
        className="w-full max-w-xs px-6 py-3 border border-transparent rounded-xl shadow-lg text-base font-bold text-white bg-gray-900 hover:bg-gray-800 transition-colors"
      >
        متابعة التسوق
      </button>
    </div>
  );

  return (
    <div className={`fixed inset-0 z-50 overflow-hidden ${isOpen ? '' : 'pointer-events-none'}`}>
      <div className={`absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0'}`} onClick={onClose} />

      <div className={`fixed inset-y-0 left-0 max-w-full flex transition-transform duration-500 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="w-screen max-w-md pointer-events-auto">
          <div className="h-full flex flex-col bg-white shadow-2xl">
             {view === 'CART' && renderCartView()}
             {view === 'SHIPPING' && renderShippingView()}
             {view === 'PAYMENT' && renderPaymentView()}
             {view === 'SUCCESS' && renderSuccessView()}
          </div>
        </div>
      </div>
    </div>
  );
};
