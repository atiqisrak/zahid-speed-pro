import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Preloader = ({ onComplete }: { onComplete: () => void }) => {
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const phrases = [
    "Pinging local gateways...",
    "Analyzing routing tables...",
    "Optimizing BDIX paths...",
    "Flawless connectivity engineered."
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentPhrase(prev => {
        if (prev === phrases.length - 1) {
          clearInterval(timer);
          setTimeout(onComplete, 800);
          return prev;
        }
        return prev + 1;
      });
    }, 800);
    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950 text-teal-400 font-mono text-sm md:text-lg"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
    >
      <div className="relative h-8 flex items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPhrase}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-3"
          >
            <span className="animate-pulse">_</span>
            {phrases[currentPhrase]}
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-48 md:w-64 h-1 bg-slate-900 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-teal-500"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: phrases.length * 0.8, ease: "linear" }}
        />
      </div>
    </motion.div>
  );
};

export default Preloader;
