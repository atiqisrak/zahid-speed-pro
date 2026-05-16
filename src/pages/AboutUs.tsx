import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import HugeIconPicker from '../components/HugeIconPicker';

export default function AboutUs() {
  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const opacity = useTransform(heroScroll, [0, 0.8], [1, 0]);
  const scale = useTransform(heroScroll, [0, 1], [1, 1.2]);
  const y = useTransform(heroScroll, [0, 1], [0, 200]);

  return (
    <div className="min-h-screen font-sans bg-slate-50 selection:bg-teal-500/30 selection:text-teal-900">
      {/* Dark Hero Section */}
      <section ref={heroRef} className="relative min-h-[90vh] pt-32 px-6 flex flex-col justify-center overflow-hidden bg-slate-950">
        <motion.div style={{ opacity }} className="max-w-screen-2xl mx-auto w-full z-10 text-white text-center pointer-events-none">
          <div className="inline-flex items-center justify-center gap-2 text-teal-400 text-xs font-black uppercase tracking-widest mb-6 bg-teal-500/10 px-4 py-2 rounded-full border border-teal-500/20 backdrop-blur-sm">
            <HugeIconPicker name="info01Icon" size={16} /> About Us
          </div>
          <h1 className="text-[14vw] md:text-[10vw] leading-[0.85] font-black tracking-tighter mb-8 uppercase drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
            Our Story & Vision
          </h1>
          <p className="text-xl md:text-3xl text-slate-400 max-w-4xl mx-auto font-medium tracking-tight mb-16 drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)]">
            Discover how Speed Pro became Dhaka's leading ISP consultancy.
          </p>
        </motion.div>
        <motion.div style={{ scale, y }} className="absolute inset-0 z-0 overflow-hidden bg-slate-950 origin-bottom">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/40 to-slate-950 z-10 pointer-events-none" />
          <img 
            src="/assets/about-us-bg.png" 
            alt="Data Center" 
            className="w-full h-full object-cover opacity-60 scale-105"
          />
        </motion.div>
      </section>

      {/* Light Content Section */}
      <section className="relative z-20 bg-white py-16 px-6 border-b border-slate-200 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
        <div className="max-w-screen-2xl mx-auto space-y-12">
          <p className="text-lg text-slate-700 leading-relaxed max-w-3xl mx-auto">
            Speed Pro was founded with a passion for delivering reliable internet solutions across Dhaka. Our mission is to provide transparent, data‑driven insights that empower both providers and consumers.
          </p>
          <Link to="/contact" className="inline-flex items-center gap-2 text-teal-600 font-black uppercase tracking-widest hover:text-teal-800 transition-colors">
            <HugeIconPicker name="mail01Icon" size={16} /> Get in Touch
          </Link>
        </div>
      </section>
    </div>
  );
}
