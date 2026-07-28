import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { Sparkles, Heart } from 'lucide-react';

interface Preloader3DProps {
  logoUrl: string;
  lang: 'en' | 'bn';
  theme: 'light' | 'dark';
  onComplete?: () => void;
}

export default function Preloader3D({ logoUrl, lang, theme }: Preloader3DProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        // Smooth logarithmic step
        const diff = Math.max(1, Math.floor((100 - prev) / 6));
        return prev + diff;
      });
    }, 50);

    return () => clearInterval(timer);
  }, []);

  const icons = ['🎂', '🍰', '🧁', '🍪', '🍩', '🍫', '✨', '💖'];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.6 }}
      className={cn(
        "fixed inset-0 z-[9999] flex flex-col items-center justify-center p-4 overflow-hidden select-none select-none select-none",
        theme === 'dark'
          ? "bg-[#050505] bg-gradient-to-br from-[#050505] via-[#0a0a0a] to-[#120814]"
          : "bg-[#fffafd] bg-gradient-to-br from-[#fffafd] via-[#fff1f7] to-[#fae8f3]"
      )}
    >
      {/* 3D Floating Bakery Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40 md:opacity-60">
        {icons.map((icon, idx) => {
          const left = (idx * 13 + 7) % 100;
          const delay = idx * 0.4;
          const duration = 12 + (idx % 4) * 3;
          return (
            <motion.div
              key={idx}
              initial={{ y: '110vh', x: 0, opacity: 0, rotateX: 0, rotateY: 0 }}
              animate={{
                y: ['110vh', '-10vh'],
                x: [0, (idx % 2 === 0 ? 30 : -30)],
                opacity: [0, 0.9, 0.9, 0],
                rotateX: [0, 360],
                rotateY: [0, 360]
              }}
              transition={{
                duration,
                repeat: Infinity,
                delay,
                ease: 'linear'
              }}
              className="absolute text-xl sm:text-2xl md:text-3xl filter drop-shadow-[0_0_12px_rgba(236,72,153,0.5)]"
              style={{ left: `${left}%` }}
            >
              {icon}
            </motion.div>
          );
        })}
      </div>

      {/* 3D Backdrop Glow Orbs */}
      <div className="absolute w-[300px] h-[300px] sm:w-[450px] sm:h-[450px] bg-pink-500/20 rounded-full blur-[100px] animate-pulse pointer-events-none" />
      <div className="absolute w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] bg-purple-600/15 rounded-full blur-[80px] animate-pulse delay-500 pointer-events-none" />

      {/* 3D Container Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={cn(
          "relative z-10 w-full max-w-[90%] sm:max-w-md md:max-w-lg p-6 sm:p-10 md:p-12 rounded-[2.5rem] sm:rounded-[3.5rem] backdrop-blur-3xl shadow-[0_32px_80px_-20px_rgba(236,72,153,0.3)] border flex flex-col items-center text-center overflow-hidden",
          theme === 'dark'
            ? "bg-white/[0.04] border-white/10 shadow-black/80"
            : "bg-white/70 border-pink-200/80 shadow-pink-200/50"
        )}
      >
        {/* Shimmer line across card */}
        <motion.div
          animate={{ x: ['-200%', '200%'] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-white/10 to-transparent pointer-events-none -skew-x-12"
        />

        {/* 3D LOGO CONTAINER */}
        <div className="relative mb-6 sm:mb-8 perspective-1000 group">
          {/* Outer Orbiting 3D Ring */}
          <motion.div
            animate={{ rotateZ: 360, rotateX: [20, 35, 20], rotateY: [0, 180, 360] }}
            transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
            className="absolute -inset-4 sm:-inset-6 rounded-full border-2 border-dashed border-pink-400/40 dark:border-pink-500/50 pointer-events-none"
          />

          {/* Inner Glowing Aura Ring */}
          <motion.div
            animate={{ scale: [0.95, 1.1, 0.95], opacity: [0.4, 0.8, 0.4] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
            className="absolute -inset-2 sm:-inset-3 rounded-full bg-gradient-to-tr from-pink-500 via-purple-500 to-amber-400 blur-md opacity-60"
          />

          {/* 3D BADGE WITH PERSPECTIVE TILT */}
          <motion.div
            animate={{
              rotateY: [-15, 15, -15],
              rotateX: [10, -10, 10],
              y: [-6, 6, -6],
            }}
            transition={{
              repeat: Infinity,
              duration: 5,
              ease: "easeInOut"
            }}
            style={{ transformStyle: 'preserve-3d' }}
            className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full bg-gradient-to-b from-amber-200 via-amber-100 to-amber-300 p-1.5 shadow-[0_20px_50px_rgba(236,72,153,0.4)] cursor-pointer"
          >
            {/* Gold Metallic 3D Rim Layer */}
            <div 
              style={{ transform: 'translateZ(15px)' }}
              className="w-full h-full rounded-full bg-white dark:bg-[#120a1a] p-2 flex items-center justify-center overflow-hidden relative shadow-inner border-2 border-amber-300/60"
            >
              {/* Logo Image */}
              <img
                src={logoUrl || "https://i.ibb.co/Xx2kxrrg/LOGO-1.png"}
                alt="Bake n Flake Logo"
                className="w-full h-full object-cover scale-150 rounded-full filter drop-shadow-md"
                referrerPolicy="no-referrer"
              />

              {/* Shimmer Light Beam on Logo */}
              <motion.div
                animate={{ x: ['-150%', '150%'] }}
                transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut", delay: 0.5 }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -skew-x-25 pointer-events-none"
              />
            </div>

            {/* Sparkle Badge Floating on Top Right */}
            <motion.div
              style={{ transform: 'translateZ(30px)' }}
              animate={{ scale: [1, 1.25, 1], rotate: [0, 15, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute -top-1 -right-1 sm:top-1 sm:right-1 bg-gradient-to-r from-pink-500 to-amber-400 p-2 sm:p-2.5 rounded-full shadow-lg text-white"
            >
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin-slow" />
            </motion.div>
          </motion.div>
        </div>

        {/* Brand Name & Tagline */}
        <div className="space-y-2 mb-6 sm:mb-8">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="font-serif text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight drop-shadow-sm flex items-center justify-center gap-2"
          >
            Bake n' Flake
            <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-pink-500 fill-pink-500 inline-block animate-bounce" />
          </motion.h1>

          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "80%" }}
            transition={{ duration: 1, delay: 0.5 }}
            className="h-1 bg-gradient-to-r from-transparent via-pink-500 to-transparent mx-auto rounded-full"
          />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-pink-600 dark:text-pink-400 font-black text-[11px] sm:text-xs md:text-sm uppercase tracking-[0.25em] sm:tracking-[0.35em]"
          >
            {lang === 'en' ? 'Crafting Sweet Moments...' : 'সুস্বাদু মুহূর্ত তৈরি করছি...'}
          </motion.p>
        </div>

        {/* 3D Progress Bar & Percentage */}
        <div className="w-full space-y-2">
          <div className="flex justify-between items-center text-[10px] sm:text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 px-1">
            <span>{lang === 'en' ? 'Loading Delights' : 'লোড হচ্ছে'}</span>
            <span className="text-pink-600 dark:text-pink-400 font-mono">{progress}%</span>
          </div>

          <div className="relative w-full h-2 sm:h-2.5 bg-slate-200/80 dark:bg-white/10 rounded-full overflow-hidden p-0.5 border border-pink-500/20 shadow-inner">
            <motion.div
              className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-amber-400 rounded-full shadow-[0_0_12px_rgba(236,72,153,0.8)] relative"
              style={{ width: `${progress}%` }}
              transition={{ ease: "easeOut" }}
            >
              <div className="absolute top-0 right-0 bottom-0 w-2 bg-white/80 rounded-full animate-ping" />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
