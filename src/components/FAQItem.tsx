import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ExternalLink, MapPin, Phone, MessageCircle, MessageSquare, Facebook, Instagram, Youtube, Pin, BookOpen, Image, CircleDollarSign, X } from 'lucide-react';
import * as Icons from 'lucide-react';
import { FAQ, Language } from '../types';
import { cn } from '../lib/utils';

interface FAQItemProps {
  faq: FAQ;
  language: Language;
}

const getLinkIcon = (iconName?: string) => {
  if (!iconName) return <ExternalLink size={14} />;
  const IconComp = (Icons as any)[iconName];
  return IconComp ? <IconComp size={14} /> : <ExternalLink size={14} />;
};

const FAQImage: React.FC<{ src: string; delay: number }> = ({ src, delay }) => {
  const [imgError, setImgError] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  if (imgError) return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay }}
        onClick={() => setIsZoomed(true)}
        className="relative w-24 h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden border-4 border-white dark:border-white/10 shadow-md group/img cursor-pointer cursor-zoom-in"
      >
        <img 
          src={src} 
          alt="FAQ Visual" 
          className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-110" 
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
        />
        <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/10 transition-colors" />
      </motion.div>

      <AnimatePresence>
        {isZoomed && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/90 backdrop-blur-sm p-4"
            onClick={() => setIsZoomed(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative max-w-2xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setIsZoomed(false)}
                className="absolute -top-12 right-0 w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors"
              >
                <X size={20} />
              </button>
              <img 
                src={src} 
                className="w-full h-auto rounded-2xl shadow-2xl" 
                alt="Zoomed FAQ Visual" 
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export const FAQItem: React.FC<FAQItemProps> = ({ faq, language }) => {
  const [isOpen, setIsOpen] = useState(false);

  const question = language === 'en' ? faq.questionEn : faq.questionBn;
  const answer = language === 'en' ? faq.answerEn : faq.answerBn;

  return (
    <div className={cn(
      "border border-slate-100 dark:border-white/5 rounded-3xl transition-all duration-300 mb-4 overflow-hidden",
      isOpen 
        ? "bg-pink-50/50 dark:bg-pink-500/10 border-pink-200 dark:border-pink-500/30 shadow-xl shadow-pink-500/5 ring-1 ring-pink-500/10" 
        : "bg-white/40 dark:bg-white/2 hover:border-slate-300 dark:hover:border-white/10"
    )}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none group relative overflow-hidden"
      >
        <div className={cn(
          "absolute left-0 top-0 bottom-0 w-1 bg-pink-500 transition-transform duration-300",
          isOpen ? "scale-y-100" : "scale-y-0"
        )} />
        <span className={cn(
          "text-base md:text-lg font-bold pr-4 leading-tight transition-colors duration-300",
          isOpen ? "text-pink-700 dark:text-pink-400" : "text-slate-800 dark:text-slate-200 group-hover:text-pink-600 dark:group-hover:text-pink-400"
        )}>
          {question}
        </span>
        <div className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 shrink-0",
          isOpen ? "bg-pink-500 text-white rotate-180" : "bg-slate-100 dark:bg-white/5 text-slate-400 group-hover:bg-pink-50 group-hover:text-pink-500 dark:group-hover:bg-pink-500/10"
        )}>
          <ChevronDown className="w-4 h-4" />
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 border-t border-pink-100/50 dark:border-pink-500/10 pt-4 mt-1">
              <div className="text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap text-base font-medium prose-p:mb-2 prose-strong:text-pink-600 dark:prose-strong:text-pink-400">
                {answer.split('\n').map((line, i) => (
                  <p key={i} className={cn(
                    "py-1 px-2 rounded-lg transition-colors",
                    i % 2 === 0 ? "bg-slate-50/50 dark:bg-white/2" : ""
                  )}>
                    {line}
                  </p>
                ))}
              </div>

              {/* Map Rendering */}
              {faq.mapIframe && (
                <div className="mt-6 rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-lg aspect-video w-full">
                  <iframe 
                    src={faq.mapIframe} 
                    className="w-full h-full border-0" 
                    allowFullScreen 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              )}

              {/* Links Rendering */}
              {faq.links && faq.links.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {faq.links.map((link, idx) => (
                    <a
                      key={idx}
                      href={link.url}
                      target={link.url.startsWith('#') ? '_self' : '_blank'}
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-xs font-bold text-pink-600 dark:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-500/10 transition-colors shadow-sm"
                    >
                      {getLinkIcon(link.icon)}
                      {link.label}
                    </a>
                  ))}
                </div>
              )}

              {/* Images Rendering */}
              {faq.images && faq.images.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-3">
                  {faq.images.map((img, idx) => (
                    <FAQImage key={idx} src={img} delay={idx * 0.1} />
                  ))}
                </div>
              )}

              {/* Contact the team button */}
              <div className="mt-8 border-t border-slate-100 dark:border-white/5 pt-6 flex justify-end">
                <a 
                  href={`https://wa.me/919875563329?text=${encodeURIComponent(
                    `Hi Bake n' Flake Team,\n\nI have a follow-up question regarding this FAQ:\n"${language === 'en' ? faq.questionEn : faq.questionBn}"\n\n[Ref: ${faq.questionEn} / ${faq.questionBn}]\n\nPlease assist me. Thanks!`
                  )}`} 
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-3 px-6 py-3 bg-slate-900 dark:bg-pink-500 text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-pink-500/20 hover:scale-105 active:scale-95 transition-all"
                >
                  <MessageCircle size={16} />
                  {language === 'en' ? 'Contact the team' : 'টিমের সাথে যোগাযোগ করুন'}
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
