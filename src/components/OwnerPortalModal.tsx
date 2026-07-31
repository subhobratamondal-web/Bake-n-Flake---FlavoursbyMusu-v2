import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Shield, Search, CheckCircle2, MessageSquare, Phone, MapPin, ExternalLink, Lock, FileSpreadsheet, KeyRound, AlertCircle, Copy, Check, Edit3, Plus, Trash2, Save } from 'lucide-react';
import { Order, OrderStatus, CartItem } from '../types';
import { generateWhatsAppStatusUpdateLink, TARGET_GOOGLE_SHEET_ID } from '../utils/googleSheetsSync';
import { AppContext } from '../App';
import { isAllowedAdminUser } from '../lib/utils';

interface OwnerPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
  onUpdateOrder?: (updatedOrder: Order) => void;
  lang: 'en' | 'bn';
}

const ALL_STATUSES: OrderStatus[] = ['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'];
const ADMIN_SECURITY_PIN = '1234';

export default function OwnerPortalModal({
  isOpen,
  onClose,
  orders,
  onUpdateStatus,
  onUpdateOrder,
  lang
}: OwnerPortalModalProps) {
  const { user, setIsAuthModalOpen, isAdminLoggedIn, setIsAdminLoggedIn } = useContext(AppContext);
  const isAuthorizedAdmin = user?.isLoggedIn && isAllowedAdminUser(user.phone);
  const [userIdInput, setUserIdInput] = useState('');
  const [userIdError, setUserIdError] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showScriptModal, setShowScriptModal] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);

  // Edit State for Pending Orders
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
  const [editTotal, setEditTotal] = useState<number>(0);
  const [editItems, setEditItems] = useState<{ id: string; productNameEn: string; productNameBn: string; weight: string; quantity: number; price: number; img: string }[]>([]);

  const startEditing = (order: Order) => {
    setEditingOrderId(order.id);
    const items = order.items.map(it => ({
      id: it.id || 'it_' + Math.random().toString(36).substring(2, 6),
      productNameEn: it.productNameEn,
      productNameBn: it.productNameBn || it.productNameEn,
      weight: it.weight || '1 Pound',
      quantity: it.quantity || 1,
      price: it.price || 450,
      img: it.img || ''
    }));
    setEditItems(items);
    const calcSum = items.reduce((sum, it) => sum + (it.price * it.quantity), 0);
    setEditTotal(order.total || calcSum);
  };

  const updateItemsAndTotal = (newItems: typeof editItems) => {
    setEditItems(newItems);
    const calcSum = newItems.reduce((sum, it) => sum + ((Number(it.price) || 0) * (Number(it.quantity) || 1)), 0);
    setEditTotal(calcSum);
  };

  const handleSaveEdit = (order: Order, overrideStatus?: OrderStatus) => {
    const finalItems = editItems as CartItem[];
    const computedTotal = editItems.reduce((acc, it) => acc + ((Number(it.price) || 0) * (Number(it.quantity) || 1)), 0);
    const finalTotal = editTotal > 0 ? editTotal : computedTotal;

    const updatedOrder: Order = {
      ...order,
      items: finalItems,
      total: finalTotal,
      subtotal: finalTotal,
      status: overrideStatus || order.status
    };

    if (onUpdateOrder) {
      onUpdateOrder(updatedOrder);
    }
    setEditingOrderId(null);
  };

  const handleStatusChange = (order: Order, newStatus: OrderStatus) => {
    if (editingOrderId === order.id) {
      handleSaveEdit(order, newStatus);
    } else {
      onUpdateStatus(order.id, newStatus);
    }
  };

  if (!isOpen) return null;

  const handleUserIdSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userIdInput.trim() === 'bnfmusu') {
      setIsAdminLoggedIn(true);
      setUserIdError(false);
      setUserIdInput('');
    } else {
      setUserIdError(true);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = filterStatus === 'All' || o.status === filterStatus;
    const matchesSearch = 
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerPhone.includes(searchQuery);
    return matchesStatus && matchesSearch;
  });

  const appScriptCode = `// Bake n' Flake (~Flavours by Musu) Google Apps Script Order Sync
// Sheet Link: https://docs.google.com/spreadsheets/d/1vZsYmZzxu653U4T6O-_S0i2dazAU_VJKBRYwdgAmXSw/edit?gid=1527393898#gid=1527393898

function doPost(e) {
  return handleRequest(e);
}

function doGet(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("order info") || ss.getSheetByName("Orders") || ss.getSheetByName("orders") || ss.getSheets()[0];
    
    // Auto-create header row if sheet is fresh
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp", "Order ID", "Customer Name", "Phone", "Email", 
        "Items", "Subtotal (₹)", "Total (₹)", "Delivery Date", "Delivery Address", "Status", "Payment Method", "Notes"
      ]);
    }

    var data = {};
    if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch(parseErr) {
        data = e.parameter || {};
      }
    } else if (e && e.parameter) {
      data = e.parameter;
    }
    
    function cleanId(str) {
      return String(str || "").replace(/^#/, "").trim().toLowerCase();
    }

    var targetOrderId = String(data.orderId || data.id || "").trim();
    var cleanedTarget = cleanId(targetOrderId);
    var rowValues = [
      data.timestamp || new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
      targetOrderId,
      data.customerName || data.name || "",
      data.customerPhone || data.phone || "",
      data.customerEmail || data.email || "",
      typeof data.items === 'string' ? data.items : JSON.stringify(data.items || ''),
      data.subtotal || data.total || 0,
      data.total || data.price || 0,
      data.deliveryDate || "",
      data.deliveryAddress || data.address || "",
      data.status || "Pending",
      data.paymentMethod || "Cash on Delivery",
      data.notes || data.message || ""
    ];

    var updatedExisting = false;
    if (cleanedTarget) {
      var lastRow = sheet.getLastRow();
      if (lastRow >= 2) {
        var orderIds = sheet.getRange(1, 2, lastRow, 1).getValues();
        for (var i = 1; i < orderIds.length; i++) {
          if (cleanId(orderIds[i][0]) === cleanedTarget) {
            sheet.getRange(i + 1, 1, 1, rowValues.length).setValues([rowValues]);
            updatedExisting = true;
            break;
          }
        }
      }
    }

    if (!updatedExisting) {
      sheet.appendRow(rowValues);
    }
    
    return ContentService.createTextOutput(JSON.stringify({ status: "success", updated: updatedExisting, message: updatedExisting ? "Order updated" : "Order appended" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[140] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-white/10 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-pink-500 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-pink-500/20">
                <Shield size={22} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold">
                    {lang === 'en' ? 'Musu\'s Bakery Admin Portal' : 'মুসুর বেকারি অ্যাডমিন প্যানেল'}
                  </h3>
                  {isAdminLoggedIn && (
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Unlocked
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400">
                  {lang === 'en' ? 'Manage customer orders & WhatsApp updates' : 'কাস্টমার অর্ডার ও হোয়াটসঅ্যাপ আপডেট ম্যানেজ করুন'}
                </p>
              </div>
            </div>

            <button 
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Check if user is logged in with an authorized admin phone number */}
          {!isAuthorizedAdmin ? (
            <div className="p-8 md:p-12 text-center max-w-md mx-auto space-y-6">
              <div className="w-16 h-16 rounded-3xl bg-rose-500/10 text-rose-500 border border-rose-500/30 flex items-center justify-center mx-auto">
                <Lock size={32} />
              </div>

              <div>
                <h4 className="text-xl font-bold text-slate-900 dark:text-white">
                  {lang === 'en' ? 'Access Restricted' : 'এক্সেস সুরক্ষিত ও সংরক্ষিত'}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  {lang === 'en'
                    ? 'The Admin Portal is restricted. You must log in with an authorized admin phone number (+918584017701 or +919875563329) to access.'
                    : 'অ্যাডমিন পোর্টালটি শুধুমাত্র অনুমোদিত অ্যাডমিনদের জন্য। প্রবেশ করতে +918584017701 বা +919875563329 ফোন নম্বর দিয়ে কাস্টমার হিসেবে লগইন করুন।'}
                </p>
              </div>

              <div className="flex flex-col gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    setIsAuthModalOpen(true);
                  }}
                  className="w-full py-3 px-6 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-600 text-white font-bold text-sm shadow-lg shadow-pink-500/30 hover:opacity-95 transition-all"
                >
                  {lang === 'en' ? 'Login with Admin Phone' : 'এডমিন ফোন নাম্বার দিয়ে লগইন করুন'}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-2.5 px-6 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 transition-all"
                >
                  {lang === 'en' ? 'Close' : 'বন্ধ করুন'}
                </button>
              </div>
            </div>
          ) : !isAdminLoggedIn ? (
            <div className="p-8 md:p-12 text-center max-w-md mx-auto space-y-6">
              <div className="w-16 h-16 rounded-3xl bg-pink-500/10 text-pink-500 border border-pink-500/30 flex items-center justify-center mx-auto">
                <Shield size={32} />
              </div>

              <div>
                <h4 className="text-xl font-bold text-slate-900 dark:text-white">
                  {lang === 'en' ? 'Owner Access Verification' : 'মালিক এক্সেস যাচাইকরণ'}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {lang === 'en' 
                    ? 'Enter User ID to access bakery admin portal' 
                    : 'অ্যাডমিন প্যানেলে প্রবেশ করতে আপনার ইউজার আইডি লিখুন'}
                </p>
              </div>

              <form onSubmit={handleUserIdSubmit} className="space-y-4">
                <div>
                  <div className="relative">
                    <KeyRound size={18} className="absolute left-4 top-3.5 text-slate-400" />
                    <input 
                      type="text"
                      required
                      value={userIdInput}
                      onChange={(e) => { setUserIdInput(e.target.value); setUserIdError(false); }}
                      placeholder={lang === 'en' ? 'Enter Owner User ID' : 'ইউজার আইডি দিন'}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-center font-bold text-base focus:outline-none focus:ring-2 focus:ring-pink-500 dark:text-white"
                    />
                  </div>
                  {userIdError && (
                    <div className="text-xs text-rose-500 font-bold mt-2 flex items-center justify-center gap-1">
                      <AlertCircle size={14} />
                      {lang === 'en' ? 'Invalid User ID!' : 'ভুল ইউজার আইডি!'}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 text-white font-bold shadow-lg shadow-pink-500/25 hover:opacity-95 transition-all"
                >
                  {lang === 'en' ? 'Unlock Portal' : 'পোর্টাল আনলক করুন'}
                </button>
              </form>
            </div>
          ) : (
            /* Admin Portal Content */
            <>
              {/* Google Sheet Sync Banner */}
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border-b border-emerald-200 dark:border-emerald-900/40 flex flex-wrap items-center justify-between gap-2 px-6 shrink-0">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                  <FileSpreadsheet size={16} className="text-emerald-600 dark:text-emerald-400" />
                  <span>
                    {lang === 'en' 
                      ? 'Live Sync Google Sheet ID:' 
                      : 'লাইভ সিঙ্ক গুগল শিট আইডি:'}
                  </span>
                  <code className="bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded text-[11px] font-mono">
                    {TARGET_GOOGLE_SHEET_ID}
                  </code>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`https://docs.google.com/spreadsheets/d/${TARGET_GOOGLE_SHEET_ID}/edit`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    <ExternalLink size={14} />
                    {lang === 'en' ? 'Open Google Sheet' : 'গুগল শিট খুলুন'}
                  </a>

                  <button
                    onClick={() => setShowScriptModal(true)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-slate-200 text-xs font-bold transition-all"
                  >
                    {lang === 'en' ? 'Apps Script Code' : 'অ্যাপস স্ক্রিপ্ট কোড'}
                  </button>
                </div>
              </div>

              {/* Controls Bar */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 flex flex-wrap gap-3 items-center justify-between shrink-0">
                {/* Search */}
                <div className="relative flex-1 min-w-[200px]">
                  <Search size={16} className="absolute left-3 top-3 text-slate-400" />
                  <input 
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={lang === 'en' ? 'Search Order ID / Customer Name / Phone...' : 'অর্ডার আইডি / নাম / মোবাইল খুজুন...'}
                    className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center gap-1 overflow-x-auto max-w-full pb-1 md:pb-0">
                  <button
                    type="button"
                    onClick={() => setFilterStatus('All')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      filterStatus === 'All' 
                        ? 'bg-pink-500 text-white shadow-md' 
                        : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    All ({orders.length})
                  </button>
                  {ALL_STATUSES.map((st) => {
                    const count = orders.filter((o) => o.status === st).length;
                    return (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setFilterStatus(st)}
                        className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                          filterStatus === st 
                            ? 'bg-pink-500 text-white shadow-md' 
                            : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {st} ({count})
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Orders List */}
              <div className="p-6 overflow-y-auto space-y-4 flex-1">
                {filteredOrders.length === 0 ? (
                  <div className="py-20 text-center text-slate-400 font-medium">
                    {lang === 'en' ? 'No orders match your filter.' : 'কোন অর্ডার মেলেনি।'}
                  </div>
                ) : (
                  filteredOrders.map((order) => {
                    const isDeliveredLocked = order.status === 'Delivered';
                    const waStatusLink = generateWhatsAppStatusUpdateLink(order, order.status);

                    return (
                      <div 
                        key={order.id}
                        className={`p-5 rounded-2xl border shadow-sm hover:shadow-md transition-all space-y-4 ${
                          isDeliveredLocked 
                            ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40' 
                            : 'bg-white dark:bg-slate-800/90 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {/* Top Header */}
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-700 pb-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-black text-pink-600 dark:text-pink-400">
                                {order.id}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                • {new Date(order.timestamp).toLocaleString()}
                              </span>
                              {isDeliveredLocked && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-white flex items-center gap-1">
                                  <Lock size={10} /> {lang === 'en' ? 'Delivered & Locked' : 'ডেলিভার্ড ও লকড'}
                                </span>
                              )}
                            </div>
                            <div className="text-sm font-bold text-slate-800 dark:text-white mt-1 flex items-center gap-2">
                              {order.customerName}
                              <a 
                                href={`tel:${order.customerPhone}`} 
                                className="text-xs text-slate-500 hover:text-pink-500 font-normal flex items-center gap-1"
                              >
                                <Phone size={12} /> {order.customerPhone}
                              </a>
                            </div>
                          </div>

                          {/* Status Select & Dynamic WhatsApp Message */}
                          <div className="flex flex-wrap items-center gap-2">
                            {/* Edit Button for Pending Orders */}
                            {order.status === 'Pending' && editingOrderId !== order.id && (
                              <button
                                type="button"
                                onClick={() => startEditing(order)}
                                className="py-1.5 px-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1 shadow-sm transition-all"
                                title="Edit Items & Final Price"
                              >
                                <Edit3 size={14} />
                                {lang === 'en' ? 'Edit Details' : 'ডাটা এডিট করুন'}
                              </button>
                            )}

                            {/* Status Select (Disabled if Delivered) */}
                            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-700 p-1 rounded-xl">
                              <span className="text-[10px] uppercase font-bold text-slate-400 pl-2">Status:</span>
                              <select
                                value={order.status}
                                disabled={isDeliveredLocked}
                                onChange={(e) => handleStatusChange(order, e.target.value as OrderStatus)}
                                className={`text-xs font-bold px-2 py-1 rounded-lg border focus:outline-none ${
                                  isDeliveredLocked 
                                    ? 'bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400 border-slate-300 dark:border-slate-700 cursor-not-allowed' 
                                    : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-white border-slate-200 dark:border-slate-600'
                                }`}
                              >
                                {ALL_STATUSES.map((s) => (
                                  <option key={s} value={s}>{s}</option>
                                ))}
                              </select>
                            </div>

                            {/* Dynamic Pre-text WhatsApp Link Button */}
                            <a
                              href={waStatusLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="py-1.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all"
                            >
                              <MessageSquare size={14} />
                              {lang === 'en' ? `Send WhatsApp (${order.status})` : `হোয়াটসঅ্যাপ মেসেজ (${order.status})`}
                            </a>
                          </div>
                        </div>

                        {/* Order Details OR Edit Form */}
                        {editingOrderId === order.id && order.status === 'Pending' ? (
                          <div className="p-4 bg-amber-50/70 dark:bg-amber-950/30 rounded-2xl border-2 border-amber-400/60 space-y-3 text-xs">
                            <div className="flex items-center justify-between font-bold text-amber-900 dark:text-amber-300 border-b border-amber-200 dark:border-amber-800/60 pb-2">
                              <span className="flex items-center gap-1.5">
                                <Edit3 size={15} />
                                {lang === 'en' ? 'Edit Pending Order Items & Price' : 'পেন্ডিং অর্ডারের দাম ও আইটেম এডিট করুন'}
                              </span>
                              <span className="text-[11px] text-amber-700 dark:text-amber-400 font-normal">
                                {lang === 'en' ? '(Locked after confirmation)' : '(কনফার্ম করার পর লক হয়ে যাবে)'}
                              </span>
                            </div>

                            {/* Items Edit List */}
                            <div className="space-y-2">
                              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300">
                                {lang === 'en' ? 'Order Items (Name, Weight/Pound, Qty, Unit Price):' : 'অর্ডার আইটেম (নাম, ওয়েট/পাউন্ড, পরিমাণ, মূল্য):'}
                              </label>

                              {editItems.map((item, idx) => (
                                <div key={item.id || idx} className="grid grid-cols-12 gap-1.5 items-center bg-white dark:bg-slate-900 p-2 rounded-xl border border-amber-200 dark:border-slate-700">
                                  {/* Item Name */}
                                  <input
                                    type="text"
                                    value={item.productNameEn}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setEditItems(prev => prev.map((it, i) => i === idx ? { ...it, productNameEn: val, productNameBn: val } : it));
                                    }}
                                    placeholder="Product Name"
                                    className="col-span-4 px-2 py-1 bg-slate-50 dark:bg-slate-800 border rounded-lg text-xs font-semibold text-slate-900 dark:text-white"
                                  />
                                  {/* Weight / Pound */}
                                  <input
                                    type="text"
                                    value={item.weight}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setEditItems(prev => prev.map((it, i) => i === idx ? { ...it, weight: val } : it));
                                    }}
                                    placeholder="e.g. 1 Pound"
                                    className="col-span-3 px-2 py-1 bg-slate-50 dark:bg-slate-800 border rounded-lg text-xs font-semibold text-slate-900 dark:text-white"
                                  />
                                  {/* Qty */}
                                  <input
                                    type="number"
                                    min="1"
                                    value={item.quantity}
                                    onChange={(e) => {
                                      const val = parseInt(e.target.value) || 1;
                                      updateItemsAndTotal(editItems.map((it, i) => i === idx ? { ...it, quantity: val } : it));
                                    }}
                                    placeholder="Qty"
                                    className="col-span-2 px-1 py-1 bg-slate-50 dark:bg-slate-800 border rounded-lg text-xs text-center font-bold text-slate-900 dark:text-white"
                                  />
                                  {/* Unit Price */}
                                  <input
                                    type="number"
                                    min="0"
                                    value={item.price}
                                    onChange={(e) => {
                                      const val = parseFloat(e.target.value) || 0;
                                      updateItemsAndTotal(editItems.map((it, i) => i === idx ? { ...it, price: val } : it));
                                    }}
                                    placeholder="Price ₹"
                                    className="col-span-2 px-1 py-1 bg-slate-50 dark:bg-slate-800 border rounded-lg text-xs text-center font-bold text-pink-600"
                                  />
                                  {/* Remove Item */}
                                  <button
                                    type="button"
                                    onClick={() => updateItemsAndTotal(editItems.filter((_, i) => i !== idx))}
                                    className="col-span-1 p-1 hover:bg-rose-100 text-rose-500 rounded-lg flex items-center justify-center"
                                    title="Remove item"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </div>
                              ))}

                              <button
                                type="button"
                                onClick={() => updateItemsAndTotal([
                                  ...editItems,
                                  { id: 'it_' + Date.now(), productNameEn: 'Custom Item', productNameBn: 'কাস্টম আইটেম', weight: '1 Pound', quantity: 1, price: 450, img: '' }
                                ])}
                                className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-bold flex items-center gap-1 hover:bg-slate-100"
                              >
                                <Plus size={12} />
                                {lang === 'en' ? 'Add Item' : 'আইটেম যোগ করুন'}
                              </button>
                            </div>

                            {/* Final Total Price */}
                            <div className="pt-2 border-t border-amber-200 dark:border-amber-800/60 flex flex-wrap items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <label className="font-bold text-slate-800 dark:text-white">
                                  {lang === 'en' ? 'Final Total Price (₹):' : 'ফাইনাল মোট মূল্য (₹):'}
                                </label>
                                <input
                                  type="number"
                                  value={editTotal}
                                  onChange={(e) => setEditTotal(parseFloat(e.target.value) || 0)}
                                  className="w-28 px-3 py-1.5 bg-white dark:bg-slate-900 border-2 border-pink-500 rounded-xl text-sm font-black text-pink-600 focus:outline-none"
                                />
                              </div>

                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => setEditingOrderId(null)}
                                  className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold"
                                >
                                  {lang === 'en' ? 'Cancel' : 'বাতিল'}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleSaveEdit(order)}
                                  className="px-4 py-1.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold flex items-center gap-1.5 shadow-md"
                                >
                                  <Save size={14} />
                                  {lang === 'en' ? 'Save Changes' : 'সেভ করুন'}
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          /* Standard Order Details */
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                            <div>
                              <div className="text-slate-400 font-semibold mb-1 flex items-center gap-1">
                                <MapPin size={12} /> Address & Date:
                              </div>
                              <p className="text-slate-700 dark:text-slate-200 font-medium">
                                {order.deliveryAddress}
                              </p>
                              <p className="text-pink-600 dark:text-pink-400 font-bold mt-1">
                                Date: {order.deliveryDate} ({order.paymentMethod})
                              </p>
                            </div>

                            <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                              <div className="text-slate-400 font-semibold mb-1">Items:</div>
                              {order.items.map((it, idx) => (
                                <div key={idx} className="flex justify-between text-slate-700 dark:text-slate-300 font-medium py-0.5">
                                  <span>• {it.productNameEn} ({it.weight}) x{it.quantity}</span>
                                  <span className="font-bold">₹{(it.price || 450) * it.quantity}</span>
                                </div>
                              ))}
                              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between font-bold text-sm text-slate-900 dark:text-white mt-1">
                                <span>Total:</span>
                                <span className="text-pink-600 dark:text-pink-400">₹{order.total}</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* User Review if submitted */}
                        {order.userReview && (
                          <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-800/40 text-xs flex items-start gap-2">
                            <CheckCircle2 size={16} className="text-amber-500 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-bold text-amber-900 dark:text-amber-300">
                                {lang === 'en' ? 'Customer Review Submitted:' : 'কাস্টমার রিভিউ জমা দিয়েছে:'} {'⭐'.repeat(order.userReview.rating)}
                              </span>
                              <p className="text-slate-700 dark:text-slate-300 italic mt-0.5">
                                "{order.userReview.comment}"
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </>
          )}

          {/* Google Apps Script Modal Code Drawer */}
          {showScriptModal && (
            <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
              <div className="bg-slate-900 text-white rounded-2xl p-6 max-w-xl w-full border border-slate-700 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-base flex items-center gap-2">
                    <FileSpreadsheet className="text-emerald-400" size={20} />
                    Google Apps Script Code
                  </h4>
                  <button onClick={() => setShowScriptModal(false)} className="p-1 rounded bg-slate-800 text-slate-300">
                    <X size={16} />
                  </button>
                </div>
                <p className="text-xs text-slate-400">
                  Paste this snippet inside Google Sheets &gt; Extensions &gt; Apps Script, then deploy as a Web App to enable automated sheet syncing!
                </p>
                <div className="relative">
                  <pre className="p-4 bg-black/60 rounded-xl text-xs font-mono text-emerald-300 overflow-x-auto max-h-60 border border-slate-800">
                    {appScriptCode}
                  </pre>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(appScriptCode);
                      setCopiedScript(true);
                      setTimeout(() => setCopiedScript(false), 2000);
                    }}
                    className="absolute top-3 right-3 p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold flex items-center gap-1 text-white"
                  >
                    {copiedScript ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    {copiedScript ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <button
                  onClick={() => setShowScriptModal(false)}
                  className="w-full py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 font-bold text-xs"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
