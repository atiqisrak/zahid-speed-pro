import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const ImpactStats = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-50, 50]);

  return (
    <section ref={ref} className="py-32 px-6 bg-slate-50 border-b border-slate-200 relative overflow-hidden">
      {/* Decorative Background Text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] overflow-hidden">
         <h2 className="text-[30vw] font-black uppercase text-slate-900 whitespace-nowrap">Impact</h2>
      </div>

      <div className="max-w-screen-2xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-6 z-10 relative">
        <motion.div style={{ y: y1 }} className="flex flex-col items-center justify-center text-center p-8">
           <div className="text-6xl md:text-8xl font-black text-teal-600 mb-4 tracking-tighter">0%</div>
           <div className="text-xl font-bold text-slate-900 uppercase tracking-widest mb-2">Packet Loss</div>
           <p className="text-slate-500 max-w-xs">During peak traffic hours, guaranteed by isolated local routing.</p>
        </motion.div>
        
        <div className="flex flex-col items-center justify-center text-center p-8 border-y md:border-y-0 md:border-x border-slate-200">
           <div className="text-6xl md:text-8xl font-black text-amber-500 mb-4 tracking-tighter">&lt;5<span className="text-4xl md:text-6xl">ms</span></div>
           <div className="text-xl font-bold text-slate-900 uppercase tracking-widest mb-2">BDIX Latency</div>
           <p className="text-slate-500 max-w-xs">Lightning fast peering for local enterprise tools and gaming.</p>
        </div>

        <motion.div style={{ y: y2 }} className="flex flex-col items-center justify-center text-center p-8">
           <div className="text-6xl md:text-8xl font-black text-indigo-600 mb-4 tracking-tighter">99.9%</div>
           <div className="text-xl font-bold text-slate-900 uppercase tracking-widest mb-2">Uptime SLA</div>
           <p className="text-slate-500 max-w-xs">Bank-grade stability and proactive monitoring around the clock.</p>
        </motion.div>
      </div>
    </section>
  );
};

export default ImpactStats;
