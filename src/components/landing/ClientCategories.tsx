import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HugeIconPicker from '../HugeIconPicker';

const categories = [
  {
    id: 'enterprise',
    title: 'Enterprise & Corporate',
    subtitle: 'Unbreakable Connectivity for HQs',
    video: 'https://www.pexels.com/download/video/15728562/', // People working at office
    description: 'We build resilient, SLA-backed infrastructures designed for large-scale operations and uninterrupted workflows.',
    icon: 'building04Icon'
  },
  {
    id: 'remote',
    title: 'Remote Professionals',
    subtitle: 'Zero-Lag Work from Anywhere',
    video: 'https://www.pexels.com/download/video/32276538/', // Person working on computer at home
    description: 'Stable VPN connections and optimized routes for digital nomads and remote teams who demand reliability.',
    icon: 'laptopProgrammingIcon'
  },
  {
    id: 'gamers',
    title: 'Hardcore Gamers',
    subtitle: 'Sub-5ms Latency Guaranteed',
    video: 'https://www.pexels.com/download/video/4247319/', // Man gaming on ps5
    description: 'Specialized routing profiles prioritizing gaming traffic to eliminate packet loss and reduce ping.',
    icon: 'gamepadIcon'
  },
  {
    id: 'smartcity',
    title: 'Smart Infrastructure',
    subtitle: 'IoT & Large Scale Data',
    video: 'https://www.pexels.com/download/video/10444089/', // Timelapse of busy city
    description: 'High-bandwidth, low-latency backbones capable of supporting thousands of simultaneous connections for smart grids.',
    icon: 'satellite01Icon'
  }
];

const ClientCategories = () => {
  const [activeCategory, setActiveCategory] = useState(categories[0]);

  return (
    <section className="relative min-h-screen bg-slate-950 border-t border-slate-900 py-32 flex flex-col justify-center">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory.id}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-transparent z-10 pointer-events-none" />
            <video 
              autoPlay 
              loop 
              muted 
              playsInline
              className="w-full h-full object-cover opacity-90"
            >
              <source src={activeCategory.video} type="video/mp4" />
            </video>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="relative z-10 max-w-screen-2xl mx-auto px-6 w-full h-full flex flex-col md:flex-row gap-16 md:items-center">
        {/* Left Side: Text and Categories List */}
        <div className="flex-1">
          <h2 className="text-sm font-bold uppercase tracking-widest text-teal-500 mb-6">Who We Serve</h2>
          <h3 className="text-4xl md:text-6xl font-black text-white mb-16 leading-[1.1]">
            Tailored Routing <br/>
            <span className="text-slate-400">For Every Demand.</span>
          </h3>

          <div className="flex flex-col gap-6">
            {categories.map((cat) => (
              <div 
                key={cat.id}
                onMouseEnter={() => setActiveCategory(cat)}
                className={`group flex items-center gap-6 cursor-pointer p-6 rounded-2xl transition-all duration-300 ${
                  activeCategory.id === cat.id ? 'bg-white/10 backdrop-blur-md border border-white/20' : 'hover:bg-white/5 border border-transparent'
                }`}
              >
                <div className={`p-4 rounded-xl transition-colors duration-300 ${
                  activeCategory.id === cat.id ? 'bg-teal-500 text-slate-950' : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700'
                }`}>
                  <HugeIconPicker name={cat.icon} size={28} />
                </div>
                <div>
                  <h4 className={`text-xl md:text-2xl font-bold transition-colors duration-300 ${
                    activeCategory.id === cat.id ? 'text-white' : 'text-slate-300'
                  }`}>
                    {cat.title}
                  </h4>
                  <p className={`text-sm md:text-base font-medium mt-1 transition-colors duration-300 ${
                    activeCategory.id === cat.id ? 'text-teal-300' : 'text-slate-500'
                  }`}>
                    {cat.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Active Description */}
        <div className="flex-1 md:h-full flex items-center justify-center lg:justify-end">
           <AnimatePresence mode="wait">
             <motion.div
               key={activeCategory.id}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -20 }}
               transition={{ duration: 0.5 }}
               className="bg-slate-900/80 backdrop-blur-xl border border-slate-700 p-10 md:p-16 rounded-[3rem] max-w-xl shadow-2xl"
             >
                <div className="bg-teal-500/20 text-teal-400 w-16 h-16 rounded-full flex items-center justify-center mb-8">
                   <HugeIconPicker name={activeCategory.icon} size={32} />
                </div>
                <h4 className="text-3xl font-black text-white mb-6">{activeCategory.title}</h4>
                <p className="text-lg text-slate-400 leading-relaxed mb-8">
                  {activeCategory.description}
                </p>
                <button className="text-teal-400 font-bold tracking-wide uppercase text-sm flex items-center gap-2 hover:text-teal-300 transition-colors group">
                  Explore Solutions <HugeIconPicker name="arrowRight01Icon" size={20} className="transform group-hover:translate-x-1 transition-transform" />
                </button>
             </motion.div>
           </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default ClientCategories;
