import React from 'react';
import { Link } from 'react-router-dom';

const CallToAction = () => {
  return (
    <section className="py-32 px-6 bg-white border-t border-slate-200 text-center relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[800px] h-[800px] bg-teal-500/10 rounded-full blur-3xl" />
      </div>
      
      <div className="relative z-10">
         <h2 className="text-[12vw] leading-none font-black tracking-tighter text-slate-950 mb-16">
            Let's <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-indigo-500">Talk</span>
         </h2>
         <Link to="/contact" className="inline-flex items-center justify-center w-40 h-40 md:w-56 md:h-56 rounded-full bg-slate-950 hover:bg-teal-500 text-white hover:text-white font-black text-xl md:text-2xl transition-all duration-300 hover:scale-110 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.3)] hover:shadow-[0_0_80px_-15px_rgba(20,184,166,0.5)]">
            Get in Touch
         </Link>
      </div>
    </section>
  );
};

export default CallToAction;
