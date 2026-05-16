import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import HugeIconPicker from '../HugeIconPicker';

const HeroSection = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.3]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-[110vh] pt-32 px-6 flex flex-col overflow-hidden bg-slate-950">
      <motion.div style={{ opacity }} className="max-w-screen-2xl mx-auto w-full z-10 text-white relative pointer-events-none">
        <h1 className="text-[12vw] leading-[0.85] font-black tracking-tighter mb-8 uppercase drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)] text-white">
          Enterprise <br/>
          <span className="text-teal-400">Network</span> <br/>
          Consulting
        </h1>
        <p className="text-xl md:text-3xl text-slate-100 max-w-3xl font-medium tracking-tight mb-16 drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)]">
          We take connectivity, bandwidth, and routing to the absolute limit. Experience zero packet loss and unmatched latency.
        </p>
      </motion.div>
      
      <motion.div style={{ scale, y }} className="absolute inset-0 z-0 overflow-hidden bg-slate-950 origin-bottom">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-transparent to-slate-950/80 z-10 pointer-events-none" />
        
        {/* Drone shot of Dhaka */}
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="w-full h-full object-cover opacity-100 scale-105"
        >
          <source src="https://www.pexels.com/download/video/32846205/" type="video/mp4" />
        </video>
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none mix-blend-overlay">
           <HugeIconPicker name="playIcon" size={160} className="text-white/40" />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
