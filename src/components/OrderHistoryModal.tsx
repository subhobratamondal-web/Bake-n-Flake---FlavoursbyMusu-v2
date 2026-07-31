import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Clock, Check, MessageCircle, AlertCircle, Heart, Star, CheckCircle2, MessageSquare, ChefHat, Truck, Sparkles, PackageCheck, ClipboardCheck, Trash2 } from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { BAKERY_WHATSAPP_NUMBER, generateWhatsAppCustomerThanksLink } from '../utils/googleSheetsSync';

interface OrderHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  onAddReview?: (orderId: string, rating: number, comment: string) => void;
  onRemoveOldOrders?: () => void;
  onRemoveOrder?: (orderId: string) => void;
  lang: 'en' | 'bn';
}

const DISPLAY_STEPS = [
  { key: 'Placed', labelEn: 'Placed', labelBn: 'অর্ডার প্লেসড', descEn: 'Order received & confirmed', descBn: 'অর্ডার গৃহীত ও কনফার্মড', icon: <ClipboardCheck size={14} /> },
  { key: 'Baking', labelEn: 'Baking', labelBn: 'বেকিং চলছে', descEn: 'Fresh cake baking in oven', descBn: 'ওভেনে তাজা স্পঞ্জ বেকিং চলছে', icon: <ChefHat size={14} /> },
  { key: 'Packaging', labelEn: 'Packaging', labelBn: 'প্যাকেজিং', descEn: 'Cream decoration & boxed', descBn: 'ক্রিম ডেকোরেশন ও সাবধানে বক্সিং', icon: <Sparkles size={14} /> },
  { key: 'Out for Delivery', labelEn: 'Out for Delivery', labelBn: 'ডেলিভারিতে আছে', descEn: 'On the way to your doorstep', descBn: 'আপনার ঠিকানায় নিয়ে আসা হচ্ছে', icon: <Truck size={14} /> },
  { key: 'Delivered', labelEn: 'Delivered', labelBn: 'ডেলিভার্ড', descEn: 'Delivered with love', descBn: 'ভালোবাসার সাথে ডেলিভার্ড', icon: <PackageCheck size={14} /> }
];

function getStatusStepIndex(status: OrderStatus): number {
  switch (status) {
    case 'Pending':
      return 0; // Placed
    case 'Confirmed':
      return 0; // Placed
    case 'Preparing':
      return 2; // Packaging & Decorating in progress
    case 'Out for Delivery':
      return 3; // Out for Delivery
    case 'Delivered':
      return 4; // Delivered
    default:
      return 0;
  }
}

function OrderProgressBar({ status, lang }: { status: OrderStatus; lang: 'en' | 'bn' }) {
  const currentStep = getStatusStepIndex(status);
  const isCancelled = status === 'Cancelled';
  const progressPercent = isCancelled ? 0 : (currentStep / (DISPLAY_STEPS.length - 1)) * 100;

  const currentStatusDescEn = () => {
    switch (status) {
      case 'Pending': return 'Order placed! Musu di will confirm shortly. 📝';
      case 'Confirmed': return 'Order confirmed! Kitchen team is preparing fresh ingredients. 👩‍🍳';
      case 'Preparing': return 'Baking in oven & decorating with fresh frosting! 🎂✨';
      case 'Out for Delivery': return 'Out for delivery! Your driver is arriving shortly. 🚚💨';
      case 'Delivered': return 'Delivered successfully! Enjoy your delicious treats! 🎉🍰';
      case 'Cancelled': return 'Order cancelled.';
      default: return 'Processing your order...';
    }
  };

  const currentStatusDescBn = () => {
    switch (status) {
      case 'Pending': return 'অর্ডার গৃহীত হয়েছে! মুসু দি শীঘ্রই কনফার্ম করবেন। 📝';
      case 'Confirmed': return 'অর্ডার কনফার্ম হয়েছে! তাজা উপাদান প্রস্তুত করা হচ্ছে। 👩‍🍳';
      case 'Preparing': return 'ওভেনে কেক বেকিং ও তাজা ক্রিম দিয়ে সাজানো হচ্ছে! 🎂✨';
      case 'Out for Delivery': return 'ডেলিভারিতে বেরিয়েছে! ডেলিভারি পার্টনার শীঘ্রই পৌঁছাচ্ছেন। 🚚💨';
      case 'Delivered': return 'সফলভাবে ডেলিভার্ড! বেক এন ফ্লেকের মিষ্টি স্বাদ উপভোগ করুন! 🎉🍰';
      case 'Cancelled': return 'অর্ডার বাতিল করা হয়েছে।';
      default: return 'প্রসেসিং চলছে...';
    }
  };

  return (
    <div className="py-4 px-3 sm:px-4 bg-white/90 dark:bg-slate-900/80 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm my-3">
      <div className="relative flex items-center justify-between px-1 sm:px-2 mb-3">
        {/* Progress Connecting Line */}
        <div className="absolute left-6 right-6 top-4 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full z-0">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            className="h-full bg-gradient-to-r from-pink-500 via-amber-500 to-emerald-500 rounded-full shadow-sm"
          />
        </div>

        {/* Step Nodes */}
        {DISPLAY_STEPS.map((step, idx) => {
          const isDone = idx < currentStep;
          const isCurrent = idx === currentStep;

          return (
            <div key={step.key} className="relative z-10 flex flex-col items-center">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: isCurrent ? 1.2 : 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all shadow-md ${
                  isDone
                    ? 'bg-emerald-500 text-white shadow-emerald-500/30 ring-2 ring-emerald-300 dark:ring-emerald-800'
                    : isCurrent
                    ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white ring-4 ring-pink-500/30 shadow-lg shadow-pink-500/50 animate-pulse'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {isDone ? <Check size={16} className="stroke-[3]" /> : step.icon}
              </motion.div>

              <span className={`text-[10px] sm:text-[11px] font-bold mt-2 max-w-[60px] sm:max-w-[75px] text-center leading-tight transition-colors ${
                isCurrent 
                  ? 'text-pink-600 dark:text-pink-400 font-black' 
                  : isDone 
                  ? 'text-slate-800 dark:text-slate-200' 
                  : 'text-slate-400 dark:text-slate-600'
              }`}>
                {lang === 'en' ? step.labelEn : step.labelBn}
              </span>
            </div>
          );
        })}
      </div>

      {/* Real-time Status Card Message */}
      {!isCancelled && (
        <div className="mt-3 px-3 py-2 bg-gradient-to-r from-pink-50 to-rose-50 dark:from-slate-800/80 dark:to-slate-800/40 rounded-xl border border-pink-200/60 dark:border-pink-900/30 flex items-center gap-2.5 text-xs font-semibold text-slate-800 dark:text-slate-200">
          <div className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-ping flex-shrink-0" />
          <p className="flex-1 leading-snug">
            {lang === 'en' ? currentStatusDescEn() : currentStatusDescBn()}
          </p>
        </div>
      )}
    </div>
  );
}

export default function OrderHistoryModal({ isOpen, onClose, orders, onAddReview, onRemoveOldOrders, onRemoveOrder, lang }: OrderHistoryModalProps) {
  const [activeReviewOrderId, setActiveReviewOrderId] = useState<string | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittedOrders, setSubmittedOrders] = useState<Record<string, boolean>>({});

  if (!isOpen) return null;

  const hasOrdersOlderThan30Days = orders.some(o => {
    const ageInMs = Date.now() - new Date(o.timestamp).getTime();
    return ageInMs > 30 * 24 * 60 * 60 * 1000;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300';
      case 'Preparing':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300';
      case 'Out for Delivery':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300';
      case 'Delivered':
        return 'bg-emerald-500 text-white font-extrabold shadow-sm';
      default:
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300';
    }
  };

  const getStepIndex = (status: OrderStatus) => {
    return getStatusStepIndex(status);
  };

  const handleReviewSubmit = (orderId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (onAddReview && comment.trim()) {
      onAddReview(orderId, rating, comment.trim());
      setSubmittedOrders(prev => ({ ...prev, [orderId]: true }));
      setActiveReviewOrderId(null);
      setComment('');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden max-h-[85vh] flex flex-col"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 p-6 text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                <Clock size={20} className="text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">
                  {lang === 'en' ? 'My Order History & Live Tracking' : 'আমার অর্ডার হিস্ট্রি ও লাইভ ট্র্যাক'}
                </h3>
                <p className="text-xs text-white/80">
                  {orders.length} {lang === 'en' ? 'Orders placed' : 'টি অর্ডার তৈরি করা হয়েছে'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {onRemoveOldOrders && (
                <button
                  type="button"
                  onClick={onRemoveOldOrders}
                  className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-rose-600 text-white text-xs font-bold flex items-center gap-1.5 border border-white/30 backdrop-blur-md transition-all"
                  title={lang === 'en' ? 'Clear orders older than 1 month' : '১ মাসের পুরনো অর্ডার মুছে ফেলুন'}
                >
                  <Trash2 size={14} />
                  <span className="hidden sm:inline">
                    {lang === 'en' ? 'Clear >1 Month Old' : '১ মাসের পুরনো অর্ডার রিমুভ'}
                  </span>
                </button>
              )}

              <button 
                onClick={onClose}
                className="p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Orders List */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1">
            {orders.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <AlertCircle size={40} className="text-slate-300 dark:text-slate-700 mx-auto" />
                <p className="text-sm font-bold text-slate-400">
                  {lang === 'en' ? 'No orders placed yet' : 'এখনো কোন অর্ডার নেই'}
                </p>
              </div>
            ) : (
              orders.map((order) => {
                const currentStep = getStepIndex(order.status);
                const isDelivered = order.status === 'Delivered';
                const waThanksLink = generateWhatsAppCustomerThanksLink(order);

                return (
                  <div 
                    key={order.id}
                    className={`p-5 rounded-2xl border space-y-4 transition-all ${
                      isDelivered 
                        ? 'bg-gradient-to-br from-emerald-50/60 to-teal-50/40 dark:from-emerald-950/20 dark:to-teal-950/20 border-emerald-200 dark:border-emerald-800/40' 
                        : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {/* Top Row */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/60 dark:border-slate-700/60 pb-3">
                      <div>
                        <span className="text-xs font-black uppercase text-pink-600 dark:text-pink-400">
                          {order.id}
                        </span>
                        <div className="text-[11px] text-slate-400">
                          {new Date(order.timestamp).toLocaleString()}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${getStatusBadge(order.status)}`}>
                          {order.status}
                        </span>
                        
                        <a 
                          href={`https://wa.me/${BAKERY_WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hi Musu, checking status for my order ${order.id}`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-full bg-emerald-500 text-white hover:opacity-90 transition-opacity"
                          title="Ask on WhatsApp"
                        >
                          <MessageCircle size={14} />
                        </a>

                        {onRemoveOrder && (
                          <button
                            type="button"
                            onClick={() => onRemoveOrder(order.id)}
                            className="p-1.5 rounded-full bg-rose-100 hover:bg-rose-200 text-rose-600 dark:bg-rose-950 dark:hover:bg-rose-900 dark:text-rose-300 transition-colors"
                            title={lang === 'en' ? 'Delete this order from history' : 'হিস্ট্রি থেকে এই অর্ডারটি মুছে ফেলুন'}
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Step-by-Step Order Progress Bar */}
                    <OrderProgressBar status={order.status} lang={lang} />

                    {/* Items List */}
                    <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-800 text-xs space-y-1.5">
                      <div className="font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {lang === 'en' ? 'Ordered Items:' : 'অর্ডার করা আইটেম:'}
                      </div>
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-slate-600 dark:text-slate-400">
                          <span>
                            • {item.productNameEn} ({item.weight}) x{item.quantity}
                          </span>
                          <span className="font-semibold">₹{(item.price || 450) * item.quantity}</span>
                        </div>
                      ))}
                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between font-bold text-slate-800 dark:text-white">
                        <span>{lang === 'en' ? 'Total' : 'মোট'}:</span>
                        <span className="text-pink-600 dark:text-pink-400">₹{order.total}</span>
                      </div>
                    </div>

                    {/* Delivered Special Options: WhatsApp Thanks & Review */}
                    {isDelivered && (
                      <div className="space-y-3 pt-2 border-t border-emerald-200 dark:border-emerald-800/40">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          {/* Send WhatsApp Thanks Link */}
                          <a
                            href={waThanksLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="py-2 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-xs flex items-center gap-2 shadow-md hover:scale-102 transition-all"
                          >
                            <Heart size={14} className="fill-white animate-pulse" />
                            {lang === 'en' ? 'Say Thanks on WhatsApp! 💖' : 'হোয়াটসঅ্যাপে ধন্যবাদ জানান! 💖'}
                          </a>

                          {/* Write Review Toggle */}
                          {order.userReview || submittedOrders[order.id] ? (
                            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                              <CheckCircle2 size={14} />
                              {lang === 'en' ? 'Review Submitted!' : 'রিভিউ জমা দেওয়া হয়েছে!'}
                            </span>
                          ) : (
                            <button
                              onClick={() => setActiveReviewOrderId(activeReviewOrderId === order.id ? null : order.id)}
                              className="py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                            >
                              <Star size={14} />
                              {lang === 'en' ? 'Leave Feedback / Review' : 'রিভিউ ও ফিডব্যাক দিন'}
                            </button>
                          )}
                        </div>

                        {/* Submitted Review Info */}
                        {order.userReview && (
                          <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-emerald-100 dark:border-emerald-800/40 text-xs">
                            <div className="font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                              {'⭐'.repeat(order.userReview.rating)} {order.userReview.rating}/5
                            </div>
                            <p className="text-slate-600 dark:text-slate-300 italic mt-0.5">
                              "{order.userReview.comment}"
                            </p>
                          </div>
                        )}

                        {/* Rating & Review Form */}
                        {activeReviewOrderId === order.id && !order.userReview && !submittedOrders[order.id] && (
                          <form 
                            onSubmit={(e) => handleReviewSubmit(order.id, e)}
                            className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-amber-200 dark:border-amber-800/40 space-y-3"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                                {lang === 'en' ? 'Rate your cake experience:' : 'কেকের অভিজ্ঞতা কেমন ছিল:'}
                              </span>
                              <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    className="p-1 focus:outline-none"
                                  >
                                    <Star 
                                      size={18} 
                                      className={star <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-300 dark:text-slate-700'} 
                                    />
                                  </button>
                                ))}
                              </div>
                            </div>

                            <textarea
                              rows={2}
                              required
                              value={comment}
                              onChange={(e) => setComment(e.target.value)}
                              placeholder={lang === 'en' ? 'Write a short review...' : 'একটি ছোট কমেন্ট বা রিভিউ লিখুন...'}
                              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-pink-500 dark:text-white"
                            />

                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => setActiveReviewOrderId(null)}
                                className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold"
                              >
                                {lang === 'en' ? 'Cancel' : 'বাতিল'}
                              </button>
                              <button
                                type="submit"
                                className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-md"
                              >
                                {lang === 'en' ? 'Submit Review' : 'জমা দিন'}
                              </button>
                            </div>
                          </form>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
