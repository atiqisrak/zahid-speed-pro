import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import HugeIconPicker from '../components/HugeIconPicker';

export default function PrivacyPolicy() {
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
            <HugeIconPicker name="shieldTickIcon" size={16} /> Legal
          </div>
          <h1 className="text-[10vw] md:text-[6vw] leading-[0.85] font-black tracking-tighter mb-8 uppercase text-white">
            PRIVACY <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-indigo-400">POLICY</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl font-medium tracking-tight">
            Last Updated: May 16, 2026. Your privacy is our priority. This document outlines how we collect, use, and protect your data.
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
              <h2 className="text-3xl font-black uppercase tracking-tight text-slate-950 border-l-4 border-teal-500 pl-6">1. Data Collection</h2>
              <p className="text-slate-600 leading-relaxed font-medium">
                We collect information you provide directly to us, such as when you create an account, use our speed test tools, or contact us for support. This may include your IP address, browser type, and approximate location for network diagnostic purposes.
              </p>
            </div>

            <div className="space-y-6">
              <h2 className="text-3xl font-black uppercase tracking-tight text-slate-950 border-l-4 border-teal-500 pl-6">2. Use of Information</h2>
              <p className="text-slate-600 leading-relaxed font-medium">
                The data we collect is used to provide, maintain, and improve our services, including network performance analysis and generating ISP rankings for the Dhaka region. We do not sell your personal data to third parties.
              </p>
            </div>

            <div className="space-y-6">
              <h2 className="text-3xl font-black uppercase tracking-tight text-slate-950 border-l-4 border-teal-500 pl-6">3. Security</h2>
              <p className="text-slate-600 leading-relaxed font-medium">
                We implement industry-standard security measures to protect your information. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
              </p>
            </div>

            <div className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-200">
              <h3 className="text-xl font-black uppercase tracking-tight text-slate-950 mb-4">Questions?</h3>
              <p className="text-slate-600 mb-6 font-medium">If you have any questions about this Privacy Policy, please contact our legal team.</p>
              <a href="mailto:legal@speedpro.vercel.app" className="inline-flex items-center gap-2 text-teal-600 font-black uppercase tracking-widest text-xs hover:text-teal-700 transition-colors">
                <HugeIconPicker name="mail01Icon" size={16} /> legal@speedpro.vercel.app
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
