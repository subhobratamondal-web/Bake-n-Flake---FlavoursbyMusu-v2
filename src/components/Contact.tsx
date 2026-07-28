import React, { useContext, useState } from 'react';
import { Send, Phone, MapPin, MessageCircle, Mail, Heart, Star, Pin } from 'lucide-react';
import { motion } from 'motion/react';
import { AppContext } from '../App';
import { cn } from '../lib/utils';
import { BrandIcons } from './BrandIcons';

export default function Contact() {
  const { t, galleryData } = useContext(AppContext);
  const headerItems = galleryData['Header'];
  const firstHeaderItem = headerItems && headerItems[0];
  const ownerAvatar = ((firstHeaderItem 
    ? (typeof firstHeaderItem === 'string' ? firstHeaderItem : (firstHeaderItem as any).img)
    : null) || "https://bakings.in/wp-content/uploads/2024/09/musu.jpg") || null;

  const socialLinks = [
    { icon: Heart, isBrand: false, label: 'OWNER', className: 'owner-neon-btn', href: 'https://www.facebook.com/musu.khan99/', color: 'text-pink-500' },
    { icon: BrandIcons.Facebook, isBrand: true, label: 'FACEBOOK', className: 'fb-neon-btn', href: 'https://www.facebook.com/flavoursbymusu/', color: '' },
    { icon: BrandIcons.Instagram, isBrand: true, label: 'INSTAGRAM', className: 'insta-neon-btn', href: 'https://instagram.com/flavoursbymusu', color: '' },
    { icon: Pin, isBrand: false, label: 'PINTEREST', className: 'pinterest-neon-btn', href: 'https://in.pinterest.com/khanmegha99/', color: 'text-red-600' },
    { icon: BrandIcons.YouTube, isBrand: true, label: 'YOUTUBE', className: 'yt-neon-btn', href: 'https://youtube.com/@MuskanKhan-pk3qt', color: '' },
    { icon: Mail, isBrand: false, label: 'EMAIL', className: 'email-neon-btn', href: 'mailto:subhobratamondal@gmail.com', color: 'text-orange-500' },
    { icon: Phone, isBrand: false, label: 'CALL', className: 'call-neon-btn', href: 'tel:+919875563329', color: 'text-emerald-500' },
  ];

  return (
    <section id="contact" className="py-24 bg-transparent relative transition-colors duration-500 overflow-hidden">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center gap-3 mb-6 p-4 rounded-2xl bg-white dark:bg-white/5 shadow-2xl shadow-pink-500/10 border border-pink-100 dark:border-white/10 group">
               <MapPin className="text-pink-500 transform group-hover:scale-110 transition-transform drop-shadow-[0_4px_4px_rgba(236,72,153,0.3)]" size={32} />
            </div>
            <p className="text-pink-600 dark:text-pink-400 font-black tracking-[0.3em] uppercase text-[10px] md:text-xs">
               {t.lang === 'en' ? 'GET IN TOUCH' : 'যোগাযোগ করুন'}
            </p>
            <h2 className="font-serif text-3xl md:text-7xl font-bold text-slate-900 dark:text-white mt-4 tracking-tighter">
              {t.lang === 'en' ? "Let's Talk Sweets" : 'মিষ্টি নিয়ে কথা বলি'}
            </h2>
          </div>

          {/* Owner Identity */}
          <div className="flex flex-col items-center mb-12">
             <div className="w-24 h-24 rounded-full border-4 border-white dark:border-white/10 shadow-2xl overflow-hidden mb-6 bg-pink-100">
                <img src={ownerAvatar} alt="Owner" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
             </div>
             <h4 className="text-xl font-bold text-slate-800 dark:text-white uppercase tracking-tight">{t.contact.studio}</h4>
             <a 
               href="https://maps.app.goo.gl/B5ZzfftE7RUzeyqb9" 
               target="_blank" 
               rel="noreferrer"
               className="text-pink-600 dark:text-pink-400 font-bold px-4 text-center mt-2 underline decoration-dashed underline-offset-8 decoration-pink-300 hover:text-pink-500 transition-colors"
             >
                Bake n' Flake ~ FlavoursbyMusu - Kamalgazi, Rajpur Sonarpur, West Bengal 700103
             </a>
          </div>

          {/* Map Preview */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="relative rounded-[3rem] overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.2)] border-8 border-white dark:border-white/5 bg-white/20 backdrop-blur-md mb-20 h-[500px] group"
          >
             <iframe 
               src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3687.5000858931385!2d88.3911033!3d22.4478343!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a027107c2d3f269%3A0x115c8763018d2718!2sBake%20n&#39;%20Flake%20~%20FlavoursbyMusu!5e0!3m2!1sen!2sin!4v1779521919928!5m2!1sen!2sin" 
               className={cn(
                 "w-full h-full border-0 transition-all duration-700",
                 "dark:invert dark:hue-rotate-180 dark:brightness-95 contrast-[1.1]"
               )}
               allowFullScreen 
               loading="lazy" 
               referrerPolicy="no-referrer-when-downgrade"
             ></iframe>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="p-12 mb-20 bg-white/20 dark:bg-black/20 backdrop-blur-3xl rounded-[4rem] border border-white/40 dark:border-white/5 shadow-2xl relative overflow-hidden"
          >
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white uppercase tracking-[0.3em] mb-4 text-center">CONNECT WITH US ON SOCIAL MEDIA</h3>
              <div className="flex justify-center mb-12">
                 <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-pink-500 to-transparent" />
              </div>

              {/* Row 1: 4 Icons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto mb-4 md:mb-6">
                {socialLinks.slice(0, 4).map((social, i) => {
                  const Icon = social.icon;
                  return (
                    <motion.a
                      key={i}
                      href={social.href}
                      target={social.href.startsWith('#') ? '_self' : '_blank'}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      viewport={{ once: true }}
                      className={cn(
                         "flex flex-col items-center justify-center gap-3 p-5 md:p-6 rounded-[2.5rem] glass-3d border border-white/40 dark:border-white/10 transition-all hover:scale-105 active:scale-95 group min-h-[130px] md:min-h-[140px]",
                         social.className
                      )}
                    >
                      <div className={cn("w-12 h-12 md:w-14 md:h-14 flex items-center justify-center transition-all duration-300 group-hover:scale-110", social.color)}>
                         {social.isBrand ? <Icon /> : <Icon size={32} className="stroke-[1.5]" />}
                      </div>
                      <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 tracking-[0.2em] uppercase group-hover:text-slate-800 dark:group-hover:text-white transition-colors">{social.label}</span>
                    </motion.a>
                  );
                })}
              </div>

              {/* Row 2: 3 Icons Centered */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-6 max-w-3xl mx-auto justify-center">
                {socialLinks.slice(4).map((social, i) => {
                  const Icon = social.icon;
                  return (
                    <motion.a
                      key={i + 4}
                      href={social.href}
                      target={social.href.startsWith('#') ? '_self' : '_blank'}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: (i + 4) * 0.08 }}
                      viewport={{ once: true }}
                      className={cn(
                         "flex flex-col items-center justify-center gap-3 p-5 md:p-6 rounded-[2.5rem] glass-3d border border-white/40 dark:border-white/10 transition-all hover:scale-105 active:scale-95 group min-h-[130px] md:min-h-[140px]",
                         social.className,
                         i === 2 ? "col-span-2 sm:col-span-1 max-w-[200px] sm:max-w-none mx-auto w-full" : ""
                      )}
                    >
                      <div className={cn("w-12 h-12 md:w-14 md:h-14 flex items-center justify-center transition-all duration-300 group-hover:scale-110", social.color)}>
                         {social.isBrand ? <Icon /> : <Icon size={32} className="stroke-[1.5]" />}
                      </div>
                      <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 tracking-[0.2em] uppercase group-hover:text-slate-800 dark:group-hover:text-white transition-colors">{social.label}</span>
                    </motion.a>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Social Chat Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <a 
               href="https://m.me/flavoursbymusu" 
               target="_blank" 
               rel="noreferrer"
               className="messenger-neon-btn group flex items-center gap-6 p-8 bg-white/40 dark:bg-white/5 backdrop-blur-2xl rounded-[2.5rem] border border-pink-100 dark:border-white/10 shadow-xl transition-all hover:scale-105"
             >
                <div className="w-16 h-16 bg-[#0084ff]/10 rounded-[1.5rem] flex items-center justify-center text-white shadow-lg group-hover:rotate-12 transition-transform border border-[#0084ff]/20">
                   <BrandIcons.Messenger width="36" height="36" />
                </div>
                <div className="text-left">
                   <div className="text-lg font-extrabold text-slate-800 dark:text-white">{t.contact.msg}</div>
                   <div className="text-xs font-bold text-blue-500 uppercase tracking-widest mt-1">Chat on Facebook</div>
                </div>
             </a>

             <a 
               href="https://wa.me/919875563329" 
               target="_blank" 
               rel="noreferrer"
               className="wa-neon-btn group flex items-center gap-6 p-8 bg-white/40 dark:bg-white/5 backdrop-blur-2xl rounded-[2.5rem] border border-pink-100 dark:border-white/10 shadow-xl transition-all hover:scale-105"
             >
                <div className="w-16 h-16 bg-[#25D366]/10 rounded-[1.5rem] flex items-center justify-center text-white shadow-lg group-hover:-rotate-12 transition-transform border border-[#25D366]/20">
                   <BrandIcons.WhatsApp width="36" height="36" />
                </div>
                <div className="text-left">
                   <div className="text-lg font-extrabold text-slate-800 dark:text-white">{t.contact.wa}</div>
                   <div className="text-xs font-bold text-emerald-500 uppercase tracking-widest mt-1">Live on WhatsApp</div>
                </div>
             </a>
          </div>
        </div>
    </section>
  );
}
