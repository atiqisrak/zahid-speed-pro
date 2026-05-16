import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import HugeIconPicker from '../components/HugeIconPicker';

export default function TermsOfService() {
  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const opacity = useTransform(heroScroll, [0, 0.8], [1, 0]);
  const y = useTransform(heroScroll, [0, 1], [0, 200]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-teal-500/30 selection:text-teal-900">
      
      {/* 1. DARK HERO SECTION */}
      <section ref={heroRef} className="relative min-h-[50vh] pt-32 px-6 flex flex-col justify-center overflow-hidden bg-slate-950">
        <motion.div style={{ opacity }} className="max-w-screen-2xl mx-auto w-full z-10 text-white relative">
          <div className="inline-flex items-center justify-center gap-2 text-teal-400 text-xs font-black uppercase tracking-widest mb-6 bg-teal-500/10 px-4 py-2 rounded-full border border-teal-500/20 backdrop-blur-sm">
            <HugeIconPicker name="task01Icon" size={16} /> Legal
          </div>
          <h1 className="text-[10vw] md:text-[6vw] leading-[0.85] font-black tracking-tighter mb-8 uppercase text-white">
            TERMS OF <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-indigo-400">SERVICE</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl font-medium tracking-tight">
            Please read these terms carefully before using our platform. By accessing Speed Pro, you agree to these conditions.
          </p>
        </motion.div>
        <motion.div style={{ y }} className="absolute inset-0 z-0 overflow-hidden bg-slate-950 origin-bottom">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 to-slate-950 z-10 pointer-events-none" />
        </motion.div>
      </section>

      {/* 2. CONTENT SECTION */}
      <section className="py-24 px-6 bg-white relative z-20 -mt-10 rounded-t-[3rem] shadow-2xl">
        <div className="max-w-4xl mx-auto prose prose-slate prose-lg lg:prose-xl">
          <div className="space-y-16">
            <div className="space-y-6">
              <h2 className="text-3xl font-black uppercase tracking-tight text-slate-950 border-l-4 border-indigo-500 pl-6">1. Usage Rights</h2>
              <p className="text-slate-600 leading-relaxed font-medium">
                Our tools and data are provided for personal and professional informational use. Automated scraping or commercial resale of Speed Pro rankings without explicit permission is strictly prohibited.
              </p>
            </div>

            <div className="space-y-6">
              <h2 className="text-3xl font-black uppercase tracking-tight text-slate-950 border-l-4 border-indigo-500 pl-6">2. Accuracy of Data</h2>
              <p className="text-slate-600 leading-relaxed font-medium">
                While we strive for 100% accuracy in our ISP rankings and speed tests, network conditions vary. Speed Pro is not liable for decisions made based on the data provided through our platform.
              </p>
            </div>

            <div className="space-y-6">
              <h2 className="text-3xl font-black uppercase tracking-tight text-slate-950 border-l-4 border-indigo-500 pl-6">3. Account Responsibility</h2>
              <p className="text-slate-600 leading-relaxed font-medium">
                If you create an account, you are responsible for maintaining the confidentiality of your credentials and for all activities that occur under your account.
              </p>
            </div>

            <div className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-200">
               <h3 className="text-xl font-black uppercase tracking-tight text-slate-950 mb-4">Agreement</h3>
               <p className="text-slate-600 mb-6 font-medium">By using Speed Pro, you acknowledge that you have read and understood these terms.</p>
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white">
                    <HugeIconPicker name="checkIcon" size={20} />
                  </div>
                  <span className="text-sm font-black uppercase tracking-widest text-slate-400">Dhaka, Bangladesh — 2026</span>
               </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
