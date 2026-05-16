import React from 'react';
import { motion } from 'framer-motion';
import HugeIconPicker from '../HugeIconPicker';

const ExtremeTestimonial = () => {
  return (
    <section className="min-h-screen bg-slate-950 text-white flex flex-col lg:flex-row border-t border-slate-900">
      <div className="flex-1 p-12 md:p-24 lg:p-32 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-slate-900 relative">
        <div className="absolute top-0 right-0 w-full h-1/2 bg-gradient-to-b from-teal-900/10 to-transparent pointer-events-none" />

        <HugeIconPicker name="quoteDownIcon" size={64} className="text-teal-500 mb-12 opacity-50" />
        <p className="text-3xl md:text-5xl lg:text-6xl font-bold leading-[1.2] mb-16 tracking-tight relative z-10">
          "We have seen a significant improvement in terms of network stability and general routing flow. I believe this has contributed significantly to the growth of our business. Many thanks, Speed Pro."
        </p>
        <div className="relative z-10">
          <div className="text-3xl font-black mb-2">Redwan Hasan</div>
          <div className="text-lg text-slate-500 uppercase tracking-widest font-bold">Country Manager, GrabStar</div>
        </div>
      </div>
      <div className="flex-1 relative overflow-hidden min-h-[50vh] lg:min-h-screen bg-slate-900 flex items-center justify-center">
        <motion.div
          className="absolute inset-0 z-0"
          initial={{ scale: 1.1 }}
          whileInView={{ scale: 1 }}
          transition={{ duration: 15, ease: "easeOut" }}
          viewport={{ once: false }}
          style={{
            backgroundImage: "url('https://images.pexels.com/photos/16323398/pexels-photo-16323398.jpeg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-slate-950/60 z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40 z-20" />
        </motion.div>

        <div className="relative z-10 text-center">
          <div className="w-48 h-48 md:w-64 md:h-64 rounded-full bg-slate-800 border-8 border-slate-900 shadow-2xl overflow-hidden mx-auto mb-8">
            {/* Ideally put a portrait image here. For now a placeholder gradient */}
            <img src='/assets/manager-portrait.png' alt='Redwan Hasan' className='w-full h-full object-cover' />
          </div>
          <div className="text-slate-400 font-mono text-sm tracking-widest uppercase">Verified Partner</div>
        </div>
      </div>
    </section>
  );
};

export default ExtremeTestimonial;
