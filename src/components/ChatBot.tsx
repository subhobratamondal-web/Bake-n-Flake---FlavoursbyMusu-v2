import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Send, Phone, MessageSquare, RotateCcw } from 'lucide-react';
import { chatbotData } from '../data/chatbotData';
import { chatbotDataNew } from '../data/chatbotDataNew';

const allBotData = [...chatbotData, ...chatbotDataNew];

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  bn?: string;
  image?: string;
  links?: { label: string; url: string }[];
  showFooter?: boolean;
}

const generateQuickReplies = () => {
    // pick 6-8 random questions from the database keywords
    const shuffled = [...allBotData].sort(() => 0.5 - Math.random());
    const replies: string[] = [];
    
    // We want short keywords that look good as buttons
    const manualDefaults = [
      "How to order? / অর্ডার করব",
      "Menu / মেনু",
      "Cake Price / দাম",
      "Location / কোথায়",
      "Delivery / ডেলিভারি"
    ];
    
    replies.push(...manualDefaults);
    
    for (const intent of shuffled) {
        if (replies.length >= 8) break;
        const kw = intent.keywords[0];
        // Ensure its not too long
        if (kw && kw.length > 5 && kw.length < 35) {
            const capit = kw.charAt(0).toUpperCase() + kw.slice(1);
            if (!replies.includes(capit)) {
                replies.push(capit);
            }
        }
    }
    return [...new Set(replies)].slice(0, 8);
};

const BotFooter = () => (
   <div className="mt-3 pt-3 border-t border-pink-100 flex flex-col gap-2">
      <span className="text-xs font-semibold text-pink-800">For further assistance.Contact :-</span>
      <div className="flex flex-wrap gap-2">
         <a href="https://wa.me/919875563329" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs font-semibold text-gray-800 shadow-sm hover:bg-gray-50 transition-colors">
            <MessageCircle className="w-3.5 h-3.5 text-green-500" /> WhatsApp
         </a>
         <a href="https://m.me/flavoursbymusu" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs font-semibold text-gray-800 shadow-sm hover:bg-gray-50 transition-colors">
            <MessageSquare className="w-3.5 h-3.5 text-blue-500" /> Messenger
         </a>
         <a href="tel:+919875563329" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs font-semibold text-gray-800 shadow-sm hover:bg-gray-50 transition-colors">
            <Phone className="w-3.5 h-3.5 text-pink-500" /> Call
         </a>
      </div>
   </div>
);

const TypewriterText = ({ text, skipAnimation, onComplete }: { text: string; skipAnimation?: boolean, onComplete?: () => void }) => {
  const [displayedText, setDisplayedText] = useState(skipAnimation ? text : '');
  const onCompleteRef = useRef(onComplete);
  const isDoneRef = useRef(skipAnimation);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (skipAnimation) {
      setDisplayedText(text);
      isDoneRef.current = true;
      onCompleteRef.current?.();
      return;
    }

    if (isDoneRef.current) {
      setDisplayedText(text);
      return;
    }

    let index = 0;
    setDisplayedText('');
    const interval = setInterval(() => {
      index += 2; // Type 2 chars per tick for a smooth look
      if (index >= text.length) {
        setDisplayedText(text);
        isDoneRef.current = true;
        clearInterval(interval);
        onCompleteRef.current?.();
      } else {
        setDisplayedText(text.slice(0, index));
      }
    }, 15);

    return () => clearInterval(interval);
  }, [text, skipAnimation]);

  return <>{displayedText}</>;
};

const AnimatedBotMessage = ({ msg, skipAnimation, onComplete }: { msg: Message, skipAnimation: boolean, onComplete: () => void }) => {
  const [textFinished, setTextFinished] = useState(skipAnimation || !msg.text);
  const [bnFinished, setBnFinished] = useState(skipAnimation || !msg.bn);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (textFinished && bnFinished) {
      onCompleteRef.current?.();
    }
  }, [textFinished, bnFinished]);

  return (
    <>
      <p className="text-[13px] md:text-sm leading-relaxed whitespace-pre-wrap">
        <TypewriterText text={msg.text} skipAnimation={skipAnimation} onComplete={() => setTextFinished(true)} />
      </p>
      {msg.bn && (textFinished || skipAnimation) && (
        <p className="text-[13px] md:text-sm mt-2 pt-2 border-t border-black/10 dark:border-white/10 leading-relaxed whitespace-pre-wrap">
          <TypewriterText text={msg.bn} skipAnimation={skipAnimation} onComplete={() => setBnFinished(true)} />
        </p>
      )}
      {Boolean(msg.image) && (bnFinished || skipAnimation) && (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="mt-3">
          <img src={msg.image || "https://i.ibb.co/Xx2kxrrg/LOGO-1.png"} alt="Reference" className="rounded-xl w-full object-cover border border-pink-100 dark:border-slate-700" loading="lazy" />
        </motion.div>
      )}
      {msg.links && msg.links.length > 0 && (bnFinished || skipAnimation) && (
        <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap gap-2 mt-3">
          {msg.links.map((link, idx) => (
            <a key={idx} href={link.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 px-3 py-1.5 bg-pink-50 dark:bg-slate-700 hover:bg-pink-100 dark:hover:bg-slate-600 text-pink-700 dark:text-pink-300 text-xs font-semibold rounded-full transition-colors border border-pink-100 dark:border-slate-600">
              {link.label}
            </a>
          ))}
        </motion.div>
      )}
      {msg.showFooter && (bnFinished || skipAnimation) && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <BotFooter />
        </motion.div>
      )}
    </>
  );
};

export default function ChatBot({ 
  floating = true,
  isOpen: externalIsOpen,
  onToggle,
  onClose,
  hideFloatingButton = false
}: { 
  floating?: boolean;
  isOpen?: boolean;
  onToggle?: (open: boolean) => void;
  onClose?: () => void;
  hideFloatingButton?: boolean;
}) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const setIsOpen = (open: boolean) => {
    setInternalIsOpen(open);
    onToggle?.(open);
    if (!open) onClose?.();
  };
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [quickReplies, setQuickReplies] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(!floating);
  const [isTimeout, setIsTimeout] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const animatedIdsRef = useRef<Set<string>>(new Set());
  const [currentTime, setCurrentTime] = useState("");

  const IDLE_TIMEOUT_MS = 120000; // 2 minutes

  const startNewConversation = () => {
    setMessages([
      {
        id: `msg-system-${Date.now()}`,
        sender: 'bot',
        text: "Welcome to Bake n' Flake ~ Flavors by Musu! 🧁 How can I make your day sweeter?",
        bn: "বেক এন ফ্লেকে আপনাকে স্বাগতম! 🧁 আজ কীভাবে আপনার দিনটি মিষ্টি করতে পারি?",
        showFooter: true
      }
    ]);
    setIsTimeout(false);
    resetTimer();
  };

  useEffect(() => {
    startNewConversation();
    
    // Set initial quick replies
    setQuickReplies(generateQuickReplies());

    // Setup Current Time
    const updateTime = () => setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    updateTime();
    
    // Rotate quick replies every 60 seconds and update time
    const interval = setInterval(() => {
        setQuickReplies(generateQuickReplies());
        updateTime();
    }, 60000);
    
    return () => {
      clearInterval(interval);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // Handle intersection/scroll logic to show chatbot only when gallery is reached
  useEffect(() => {
    if (!floating) return;
    const handleScroll = () => {
      const galleryElement = document.getElementById('gallery');
      if (galleryElement) {
        // Show if we scrolled past the top of the gallery section (with some offset)
        const galleryTop = galleryElement.offsetTop - window.innerHeight * 0.5;
        if (window.scrollY >= galleryTop) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      } else {
        // Fallback: show if scrolled 500px down
        if (window.scrollY >= 500) setIsVisible(true);
        else setIsVisible(false);
      }
    };
    
    // Check initially
    handleScroll();
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [floating]);

  const resetTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      // 2 minutes of idle time triggered
      setMessages(prev => [...prev, {
        id: `msg-${Date.now()}-timeout`,
        sender: 'bot',
        text: "It seems you are away right now! 🕒 If you need more time or have any questions later regarding your cake order, feel free to drop us a message directly on WhatsApp or Messenger. Closing this chat session for now. Have a sweet day! 🧁",
        bn: "মনে হচ্ছে আপনি এই মুহূর্তে কিছুটা ব্যস্ত আছেন! 🕒 আপনার যদি কেকের অর্ডারের বিষয়ে পরে কোনো সাহায্য লাগে, তবে যেকোনো সময় আমাদের হোয়াটসঅ্যাপ বা মেসেঞ্জারে সরাসরি মেসেজ করতে পারেন। আপাতত এই চ্যাটটি ক্লোজ করা হচ্ছে। দিনটি মিষ্টি হোক! 🧁"
      }]);
      setIsTimeout(true);
    }, IDLE_TIMEOUT_MS);
  };

  // Keep timer active whenever there are messages / typing happens
  useEffect(() => {
    if (isOpen && !isTimeout) {
      resetTimer();
    } else {
      if (timerRef.current) clearTimeout(timerRef.current);
    }
  }, [messages, isTyping, isOpen, isTimeout]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, isOpen]);

  // Freeze background scroll when chat is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const findBestMatch = (query: string) => {
    // strip punctuation and normalize spaces
    const cleanQuery = query.toLowerCase().replace(/[?.,!¿¡]/g, '').replace(/\s+/g, ' ').trim();
    const qTokens = cleanQuery.split(' ').filter(t => t.length > 2 && t !== 'কেক' && t !== 'cake' && t !== 'the' && t !== 'and' && t !== 'for' && t !== 'কি');
    
    let bestMatch = null;
    let maxScore = 0;

    allBotData.forEach(intent => {
      let intentScore = 0;
      let matchedTokens = new Set<string>();

      intent.keywords.forEach(kw => {
         const lowerKw = kw.toLowerCase().trim();
         if (!lowerKw) return;
         
         // Exact match
         if (cleanQuery === lowerKw) {
            intentScore += 100;
         } 
         // Query contains keyword
         else if (cleanQuery.includes(lowerKw)) {
            intentScore += 20 + lowerKw.length;
         }
         // Keyword contains query
         else if (cleanQuery.length > 4 && lowerKw.includes(cleanQuery)) {
            intentScore += 10;
         }
         
         // Token overlap
         const kwTokens = lowerKw.split(/\s+/).filter(t => t.length > 2 && t !== 'কেক' && t !== 'cake');
         qTokens.forEach(qt => {
             kwTokens.forEach(kt => {
                 if (qt.length >= 3 && kt.length >= 3) {
                     if (qt === kt || qt.includes(kt) || kt.includes(qt)) {
                         matchedTokens.add(kt); 
                     }
                 }
             });
         });
      });
      
      intentScore += (matchedTokens.size * 15);

      if (intentScore > maxScore) {
        maxScore = intentScore;
        bestMatch = intent;
      }
    });

    // Require a minimum score to consider it a match to avoid random false positives
    return maxScore > 10 ? bestMatch : null;
  };

  const handleSend = (text: string) => {
    if (!text.trim() || isTimeout) return;
    resetTimer();

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: text.trim()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);

    setTimeout(() => {
      const match = findBestMatch(text);
      setIsTyping(false);
      resetTimer();

      if (match) {
        setMessages(prev => [...prev, {
          id: `msg-${Date.now()}-bot`,
          sender: 'bot',
          text: match.en,
          bn: match.bn,
          image: match.image,
          links: match.links,
          showFooter: true
        }]);
      } else {
        setMessages(prev => [...prev, {
          id: `msg-${Date.now()}-bot`,
          sender: 'bot',
          text: "I'm sorry, I couldn't understand. Could you please use simpler keywords or select an option below?",
          bn: "দুঃখিত, আমি বুঝতে পারিনি। দয়া করে একটু সহজভাবে লিখুন অথবা কুইক-রিপ্লাই থেকে বেছে নিন।",
          showFooter: true
        }]);
      }
    }, 600);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend(inputText);
  };

  if (!floating || !isVisible) {
    if (!floating) {
       // fallback for non-floating scenarios 
       return null;
    }
    // We render the wrapper but hidden if isVisible is false
    return (
      <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start pointer-events-none opacity-0"></div>
    );
  }

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[600] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-hidden"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white/70 dark:bg-black/60 backdrop-blur-2xl rounded-[1.5rem] md:rounded-[2rem] shadow-[0_30px_60px_rgba(0,0,0,0.4)] w-[95%] sm:w-[450px] md:w-[480px] h-[92dvh] sm:h-[85vh] max-h-[750px] flex flex-col overflow-hidden border border-white/60 dark:border-white/20 relative"
            >
              {/* Header */}
              <div className="bg-white/40 dark:bg-white/10 backdrop-blur-md border-b border-pink-100/50 dark:border-white/10 text-gray-800 dark:text-white p-4 flex items-center justify-between shrink-0 rounded-t-[1.5rem] md:rounded-t-[2rem]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-pink-600/90 flex items-center justify-center shrink-0 shadow-inner">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm md:text-base leading-tight drop-shadow-sm">Flavors by Musu Support</h3>
                      <span className="text-[10px] md:text-xs font-semibold px-2 py-0.5 bg-black/5 dark:bg-white/10 rounded-full">{currentTime}</span>
                    </div>
                    <p className="text-[10px] md:text-xs text-pink-600/90 dark:text-pink-300 font-medium">Usually replies instantly</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button 
                    onClick={startNewConversation}
                    className="p-2 hover:bg-white/40 dark:hover:bg-white/20 rounded-full transition-colors flex items-center gap-1 text-xs font-bold mr-1 text-gray-700 dark:text-gray-200"
                    aria-label="New Chat"
                    title="New Chat"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-pink-600 hover:text-white rounded-full transition-colors bg-black/5 dark:bg-white/5 text-gray-600 dark:text-gray-200"
                    aria-label="Close Chat"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 bg-transparent flex flex-col gap-4">
                {messages.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={`max-w-[85%] ${msg.sender === 'user' ? 'self-end bg-pink-600 text-white shadow-md' : 'self-start bg-white/95 dark:bg-slate-800/95 text-gray-800 dark:text-gray-100 border border-pink-100 dark:border-slate-700 shadow-sm'} p-3.5 rounded-2xl`}
                    style={{
                      borderBottomRightRadius: msg.sender === 'user' ? '4px' : '16px',
                      borderBottomLeftRadius: msg.sender === 'bot' ? '4px' : '16px',
                    }}
                  >
                    {msg.sender === 'bot' ? (
                      <AnimatedBotMessage 
                        msg={msg} 
                        skipAnimation={animatedIdsRef.current.has(msg.id)} 
                        onComplete={() => {
                          animatedIdsRef.current.add(msg.id);
                          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
                        }}
                      />
                    ) : (
                      <p className="text-[13px] md:text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                    )}
                  </div>
                ))}
                
                {isTyping && (
                  <div className="self-start bg-white/95 dark:bg-slate-800/95 border border-pink-100 dark:border-slate-700 p-3.5 rounded-2xl shadow-sm rounded-bl-sm">
                    <div className="flex gap-1.5">
                      <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-2 h-2 rounded-full bg-pink-400" />
                      <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-2 h-2 rounded-full bg-pink-400" />
                      <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-2 h-2 rounded-full bg-pink-400" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area or New Chat Button */}
              {isTimeout ? (
                <div className="p-4 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border-t border-pink-100 dark:border-slate-800 shrink-0 rounded-b-[2rem]">
                  <button
                    onClick={startNewConversation}
                    className="w-full py-3.5 px-4 bg-pink-600 hover:bg-pink-700 text-white rounded-xl font-bold text-sm tracking-wide uppercase transition-colors shadow-lg flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-5 h-5" />
                    START NEW CHAT
                  </button>
                </div>
              ) : (
                <>
                  {/* Quick Replies */}
                  <div className="px-3 bg-white/60 dark:bg-slate-900/60 pt-2 pb-1 overflow-x-auto whitespace-nowrap scrollbar-hide flex gap-2 shrink-0 border-t border-pink-50 dark:border-slate-800">
                    {quickReplies.map((reply, i) => (
                      <button
                        key={i}
                        onClick={() => handleSend(reply.split('/')[0].trim())}
                        className="inline-block shrink-0 px-3 py-1.5 bg-pink-50/80 dark:bg-slate-800 hover:bg-pink-100 dark:hover:bg-slate-700 text-pink-700 dark:text-pink-300 text-xs font-medium rounded-full transition-colors border border-pink-100 dark:border-slate-700 shadow-sm"
                      >
                        {reply}
                      </button>
                    ))}
                  </div>

                  {/* Text Input */}
                  <div className="p-3 bg-white/60 dark:bg-slate-900/60 shrink-0 pb-4 rounded-b-[2rem] backdrop-blur-md">
                    <div className="flex gap-2 bg-gray-50/90 dark:bg-slate-800/90 rounded-2xl border border-gray-200 dark:border-slate-700 p-1.5 pr-2 focus-within:border-pink-300 dark:focus-within:border-pink-500 focus-within:ring-2 focus-within:ring-pink-100 dark:focus-within:ring-pink-900/30 transition-all shadow-inner">
                      <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message..."
                        // important: text-[16px] prevents iOS Safari zoom
                        className="flex-1 bg-transparent px-3 text-[16px] md:text-sm focus:outline-none text-gray-800 dark:text-gray-100 dark:placeholder-gray-400"
                      />
                      <button
                        onClick={() => handleSend(inputText)}
                        disabled={!inputText.trim()}
                        className="w-10 h-10 bg-pink-600 rounded-xl flex items-center justify-center text-white disabled:opacity-50 disabled:bg-gray-400 dark:disabled:bg-slate-600 shrink-0 transition-all hover:bg-pink-700 active:scale-95"
                        aria-label="Send Message"
                      >
                        <Send className="w-4 h-4 ml-0.5" />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button visible when chat is closed and hideFloatingButton is false */}
      <AnimatePresence>
        {!isOpen && !hideFloatingButton && (
           <motion.div
             initial={{ scale: 0 }}
             animate={{ scale: 1 }}
             exit={{ scale: 0 }}
             className="fixed bottom-6 left-6 z-[400]"
           >
             <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(true)}
              className="w-16 h-16 bg-pink-600 rounded-full shadow-[0_10px_30px_-5px_rgba(236,72,153,0.5)] border-[3px] border-white dark:border-slate-800 flex items-center justify-center text-white hover:bg-pink-700 transition-colors relative group"
              aria-label="Toggle Chat"
             >
              <MessageCircle className="w-7 h-7 group-hover:scale-110 transition-transform" />
              <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 border-[3px] border-white rounded-full animate-pulse" />
             </motion.button>
           </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

