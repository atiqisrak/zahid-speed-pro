import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const TextScrubSection = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 30%"] });
  
  const text = "We work with enterprises who've outgrown basic ISP provisions — and need one partner to rethink, optimize, and deliver flawless routing. From the first diagnostic scan to post-setup monitoring, we own it end to end.";
  const words = text.split(" ");

  return (
    <section ref={ref} className="py-40 md:py-64 px-6 bg-white text-slate-950 border-b border-slate-200">
      <div className="max-w-screen-2xl mx-auto">
        <p className="text-4xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.1] flex flex-wrap gap-x-3 md:gap-x-6 gap-y-2 md:gap-y-4">
          {words.map((word, i) => {
            const start = i / words.length;
            const end = start + (1 / words.length);
            // Slight overlap for smoother transition
            const opacity = useTransform(scrollYProgress, [Math.max(0, start - 0.1), end], [0.15, 1]);
            return (
              <motion.span key={i} style={{ opacity }}>
                {word}
              </motion.span>
            );
          })}
        </p>
      </div>
    </section>
  );
};

export default TextScrubSection;
