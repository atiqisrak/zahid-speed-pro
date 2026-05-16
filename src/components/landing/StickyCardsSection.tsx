import React from 'react';
import { Link } from 'react-router-dom';
import HugeIconPicker from '../HugeIconPicker';

const StickyCardsSection = () => {
  return (
    <section className="relative bg-slate-50 py-32 px-6 border-b border-slate-200">
      <div className="max-w-screen-xl mx-auto w-full relative">
        {/* Card 1 */}
        <div className="sticky top-20 h-[85vh] flex items-center justify-center mb-10">
          <div className="w-full h-full bg-slate-900 rounded-[3rem] shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.5)] border border-slate-800 p-12 md:p-24 flex flex-col justify-center relative overflow-hidden transition-transform duration-500">
             <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-teal-900/20 to-transparent -z-10" />
             <div className="text-sm font-bold uppercase tracking-widest text-teal-500 mb-8">Problem 01</div>
             <h2 className="text-4xl md:text-6xl font-black text-white mb-8 max-w-3xl leading-[1.1]">Experiencing continuous packet loss during peak hours?</h2>
             <p className="text-xl md:text-2xl text-slate-400 mb-16 max-w-2xl leading-relaxed">Standard ISPs share bandwidth. We isolate your connection and optimize local routing to guarantee 0% packet loss.</p>
             <Link to="/isp-finder" className="inline-flex items-center gap-4 text-2xl font-bold text-teal-400 hover:text-teal-300 transition-colors self-start group">
               Optimize My Routing <HugeIconPicker name="arrowRight01Icon" size={32} className="transform group-hover:translate-x-2 transition-transform" />
             </Link>
          </div>
        </div>
        
        {/* Card 2 */}
        <div className="sticky top-28 h-[85vh] flex items-center justify-center mb-10">
          <div className="w-full h-full bg-slate-950 rounded-[3rem] shadow-[0_-20px_50px_-15px_rgba(0,0,0,0.7)] border border-slate-800 p-12 md:p-24 flex flex-col justify-center text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-amber-900/20 to-transparent -z-10" />
             <div className="text-sm font-bold uppercase tracking-widest text-amber-500 mb-8">Problem 02</div>
             <h2 className="text-4xl md:text-6xl font-black mb-8 max-w-3xl leading-[1.1]">Your enterprise needs to scale, but your latency is holding you back?</h2>
             <p className="text-xl md:text-2xl text-slate-400 mb-16 max-w-2xl leading-relaxed">We map exact BDIX peering paths, ensuring your internal tools and cloud apps respond in under 5ms.</p>
             <Link to="/speedtest" className="inline-flex items-center gap-4 text-2xl font-bold text-amber-500 hover:text-amber-400 transition-colors self-start group">
               Enterprise BDIX Setup <HugeIconPicker name="arrowRight01Icon" size={32} className="transform group-hover:translate-x-2 transition-transform" />
             </Link>
          </div>
        </div>
        
        {/* Card 3 */}
        <div className="sticky top-36 h-[85vh] flex items-center justify-center mb-10">
          <div className="w-full h-full bg-teal-950 rounded-[3rem] shadow-[0_-20px_50px_-15px_rgba(13,148,136,0.2)] border border-teal-900 p-12 md:p-24 flex flex-col justify-center text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-teal-800/50 to-transparent -z-10" />
             <div className="text-sm font-bold uppercase tracking-widest text-teal-300 mb-8">Problem 03</div>
             <h2 className="text-4xl md:text-6xl font-black mb-8 max-w-3xl leading-[1.1]">Have a new corporate office but need an SLA-backed connection quickly?</h2>
             <p className="text-xl md:text-2xl text-teal-100 mb-16 max-w-2xl leading-relaxed">From infrastructure audit to deployment, we fast-track your enterprise setup without sacrificing stability.</p>
             <Link to="/contact" className="inline-flex items-center gap-4 text-2xl font-bold text-white hover:text-teal-100 transition-colors self-start group">
               Fast-Track Deployment <HugeIconPicker name="arrowRight01Icon" size={32} className="transform group-hover:translate-x-2 transition-transform" />
             </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StickyCardsSection;
