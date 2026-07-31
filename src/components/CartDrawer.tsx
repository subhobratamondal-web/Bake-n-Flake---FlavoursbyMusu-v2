import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingCart, Trash2, Plus, Minus, Calendar, MapPin, Send, MessageSquare, CheckCircle2, User, Sparkles, Navigation } from 'lucide-react';
import confetti from 'canvas-confetti';
import { CartItem, UserProfile, Order } from '../types';
import { sendOrderToGoogleSheet, generateWhatsAppOrderLink } from '../utils/googleSheetsSync';
import OptimizedImage from './OptimizedImage';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onRemoveItem: (id: string) => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  onClearCart: () => void;
  user: UserProfile | null;
  onOpenAuth: () => void;
  onPlaceOrder: (order: Omit<Order, 'id' | 'timestamp' | 'status'>) => Order;
  lang: 'en' | 'bn';
}

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  onRemoveItem,
  onUpdateQuantity,
  onClearCart,
  user,
  onOpenAuth,
  onPlaceOrder,
  lang
}: CartDrawerProps) {
  const [deliveryDate, setDeliveryDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [deliveryAddress, setDeliveryAddress] = useState(user?.address || 'Kamalgazi, Kolkata');
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');
  const [paymentMethod, setPaymentMethod] = useState<'Cash on Delivery' | 'UPI / Online'>('Cash on Delivery');
  const [orderNotes, setOrderNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlacedSuccess, setOrderPlacedSuccess] = useState<Order | null>(null);

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + (item.price || 450) * item.quantity, 0);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    if (!customerName.trim() || !customerPhone.trim()) {
      onOpenAuth();
      return;
    }

    setIsSubmitting(true);

    const newOrderData = {
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerEmail: user?.email || '',
      deliveryAddress: deliveryAddress.trim(),
      deliveryDate,
      items: cart,
      subtotal,
      total: subtotal,
      notes: orderNotes.trim(),
      paymentMethod
    };

    const createdOrder = onPlaceOrder(newOrderData);

    // Generate WhatsApp Link & Trigger
    const waLink = generateWhatsAppOrderLink(createdOrder);

    setIsSubmitting(false);
    setOrderPlacedSuccess(createdOrder);
    onClearCart();

    try {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // ignore
    }

    // Open WhatsApp
    window.open(waLink, '_blank', 'noopener,noreferrer');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[130] flex justify-end bg-black/60 backdrop-blur-sm">
        <motion.div 
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="relative w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col border-l border-slate-200 dark:border-white/10"
        >
          {/* Top Header */}
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-pink-50/50 dark:bg-pink-950/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-pink-500 text-white flex items-center justify-center shadow-lg shadow-pink-500/20">
                <ShoppingCart size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 dark:text-white text-lg">
                  {lang === 'en' ? 'Your Bakery Cart' : 'আপনার বেকারি কার্ট'}
                </h3>
                <p className="text-xs text-pink-600 dark:text-pink-400 font-medium">
                  {cart.length} {lang === 'en' ? 'Items selected' : 'টি আইটেম যুক্ত'}
                </p>
              </div>
            </div>

            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Success Screen */}
          {orderPlacedSuccess ? (
            <div className="p-8 text-center space-y-6 my-auto">
              <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-500 flex items-center justify-center mx-auto shadow-xl">
                <CheckCircle2 size={48} className="animate-bounce" />
              </div>
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300">
                  {orderPlacedSuccess.id}
                </span>
                <h4 className="text-2xl font-bold text-slate-800 dark:text-white">
                  {lang === 'en' ? 'Order Sent Successfully!' : 'অর্ডার পাঠানো সফল হয়েছে!'}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-xs mx-auto">
                  {lang === 'en' 
                    ? 'Your order details have been recorded into Google Sheets and opened on WhatsApp. Musu will confirm your order shortly.' 
                    : 'আপনার অর্ডার গুগেল শিটে রেকর্ড হয়েছে এবং হোয়াটসঅ্যাপে পাঠানো হয়েছে। মুসু শীঘ্রই আপনার অর্ডার কনফার্ম করবেন।'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-left text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">{lang === 'en' ? 'Delivery Date:' : 'ডেলিভারি তারিখ:'}</span>
                  <span className="font-bold dark:text-white">{orderPlacedSuccess.deliveryDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">{lang === 'en' ? 'Status:' : 'স্ট্যাটাস:'}</span>
                  <span className="font-bold text-amber-500">Pending Confirmation</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setOrderPlacedSuccess(null);
                  onClose();
                }}
                className="w-full py-3.5 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold hover:opacity-90 transition-all"
              >
                {lang === 'en' ? 'Back to Bakery' : 'বেকোরিতে ফিরে যান'}
              </button>
            </div>
          ) : (
            <>
              {/* Cart List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {cart.length === 0 ? (
                  <div className="py-20 text-center space-y-4">
                    <ShoppingCart size={48} className="text-slate-300 dark:text-slate-700 mx-auto" />
                    <p className="text-sm font-bold text-slate-400">
                      {lang === 'en' ? 'Your cart is currently empty' : 'আপনার কার্ট এখন খালি'}
                    </p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div 
                      key={item.id} 
                      className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 flex gap-3 relative group"
                    >
                      <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-slate-200">
                        <OptimizedImage 
                          src={item.img} 
                          alt={item.productNameEn} 
                          className="w-full h-full object-cover" 
                          width={150}
                        />
                      </div>

                      <div className="flex-1 min-w-0 pr-6">
                        <h4 className="text-sm font-bold text-slate-800 dark:text-white truncate">
                          {lang === 'en' ? item.productNameEn : item.productNameBn}
                        </h4>
                        <span className="inline-block text-[10px] font-semibold text-pink-600 dark:text-pink-400 bg-pink-100 dark:bg-pink-950/60 px-2 py-0.5 rounded-md mt-0.5">
                          {item.weight}
                        </span>

                        {item.customNote && (
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 italic truncate mt-1">
                            "{item.customNote}"
                          </p>
                        )}

                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                            ₹{(item.price || 450) * item.quantity}
                          </span>

                          <div className="flex items-center gap-2 bg-white dark:bg-slate-700 rounded-lg p-1 border border-slate-200 dark:border-slate-600">
                            <button
                              onClick={() => onUpdateQuantity(item.id, -1)}
                              className="p-0.5 hover:bg-slate-100 dark:hover:bg-slate-600 rounded text-slate-600 dark:text-slate-300"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="text-xs font-bold w-4 text-center dark:text-white">{item.quantity}</span>
                            <button
                              onClick={() => onUpdateQuantity(item.id, 1)}
                              className="p-0.5 hover:bg-slate-100 dark:hover:bg-slate-600 rounded text-slate-600 dark:text-slate-300"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="absolute top-3 right-3 text-slate-400 hover:text-rose-500 transition-colors p-1"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))
                )}

                {/* Customer Details & Checkout form */}
                {cart.length > 0 && (
                  <form onSubmit={handleCheckout} className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <User size={14} className="text-pink-500" />
                        {lang === 'en' ? 'Delivery Details' : 'ডেলিভারি বিবরণ'}
                      </h4>

                      {!user?.isLoggedIn && (
                        <button
                          type="button"
                          onClick={onOpenAuth}
                          className="text-xs font-bold text-pink-600 dark:text-pink-400 hover:underline"
                        >
                          {lang === 'en' ? 'Quick Login' : 'দ্রুত লগইন'}
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <input 
                        type="text"
                        required
                        placeholder={lang === 'en' ? 'Name *' : 'নাম *'}
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs dark:text-white focus:ring-2 focus:ring-pink-500"
                      />
                      <input 
                        type="tel"
                        required
                        placeholder={lang === 'en' ? 'WhatsApp Phone *' : 'মোবাইল নম্বর *'}
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs dark:text-white focus:ring-2 focus:ring-pink-500"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-[11px] text-slate-400 flex items-center gap-1">
                          <MapPin size={12} /> {lang === 'en' ? 'Delivery Address / Map:' : 'ঠিকানা / ম্যাপ:'}
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            if ('geolocation' in navigator) {
                              navigator.geolocation.getCurrentPosition(
                                (pos) => {
                                  setDeliveryAddress(`GPS: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)} (Auto Detected)`);
                                },
                                () => setDeliveryAddress('Kamalgazi, Garia, Kolkata')
                              );
                            }
                          }}
                          className="text-[10px] text-pink-600 dark:text-pink-400 font-bold hover:underline flex items-center gap-0.5"
                        >
                          <Navigation size={10} /> Auto Detect
                        </button>
                      </div>
                      <input 
                        type="text"
                        required
                        placeholder="Kamalgazi, Kolkata"
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs dark:text-white focus:ring-2 focus:ring-pink-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1 flex items-center gap-1">
                        <Calendar size={12} /> {lang === 'en' ? 'Preferred Delivery Date:' : 'ডেলিভারি তারিখ:'}
                      </label>
                      <input 
                        type="date"
                        required
                        value={deliveryDate}
                        onChange={(e) => setDeliveryDate(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs dark:text-white focus:ring-2 focus:ring-pink-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1 flex items-center gap-1">
                        <MessageSquare size={12} /> {lang === 'en' ? 'Order Notes (Optional):' : 'বিশেষ নোট (ঐচ্ছিক):'}
                      </label>
                      <input 
                        type="text"
                        placeholder={lang === 'en' ? 'e.g. Less sugar, eggless only' : 'যেমন: ডিম ছাড়া কেক'}
                        value={orderNotes}
                        onChange={(e) => setOrderNotes(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs dark:text-white focus:ring-2 focus:ring-pink-500"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-white font-bold shadow-lg shadow-emerald-500/25 hover:opacity-95 transition-all flex items-center justify-center gap-2 mt-4"
                    >
                      <Send size={18} />
                      {isSubmitting 
                        ? (lang === 'en' ? 'Processing...' : 'প্রসেসিং হচ্ছে...') 
                        : (lang === 'en' ? 'Send Order on WhatsApp & Record in Sheet' : 'অর্ডার হোয়াটসঅ্যাপে পাঠান ও শিটে রেকর্ড করুন')}
                    </button>
                  </form>
                )}
              </div>

              {/* Bottom Summary Bar */}
              {cart.length > 0 && (
                <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase">
                      {lang === 'en' ? 'Total Amount' : 'মোট মূল্য'}
                    </span>
                    <span className="text-xl font-extrabold text-pink-600 dark:text-pink-400">
                      ₹{subtotal}
                    </span>
                  </div>
                </div>
              )}
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
