import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import HugeIconPicker from '../components/HugeIconPicker';

export default function Contact() {
  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const opacity = useTransform(heroScroll, [0, 0.8], [1, 0]);
  const y = useTransform(heroScroll, [0, 1], [0, 200]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-teal-500/30 selection:text-teal-900">

      {/* 1. DARK HERO SECTION */}
      <section ref={heroRef} className="relative min-h-[80vh] pt-32 px-6 flex flex-col justify-center overflow-hidden bg-slate-950">
        <motion.div style={{ opacity }} className="max-w-screen-2xl mx-auto w-full z-10 text-white relative text-center">
          <div className="inline-flex items-center justify-center gap-2 text-teal-400 text-xs font-black uppercase tracking-widest mb-6 bg-teal-500/10 px-4 py-2 rounded-full border border-teal-500/20 backdrop-blur-sm">
            <HugeIconPicker name="chat01Icon" size={16} /> Get in Touch
          </div>
          <h1 className="text-[14vw] md:text-[10vw] leading-[0.85] font-black tracking-tighter mb-8 uppercase drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)] text-white">
            LET'S START <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-indigo-400">THE CONVO</span>
          </h1>
          <p className="text-xl md:text-3xl text-slate-400 max-w-4xl mx-auto font-medium tracking-tight mb-16">
            Expert ISP consultancy, technical support, or partnership inquiries. We're here to help you stay connected.
          </p>
        </motion.div>

        <motion.div style={{ y }} className="absolute inset-0 z-0 overflow-hidden bg-slate-950 origin-bottom">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-slate-950/80 to-slate-950 z-10 pointer-events-none" />
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-teal-500/20 rounded-full blur-[150px] z-10 mix-blend-screen" />
          <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[150px] z-10 -translate-x-1/2 mix-blend-screen" />
        </motion.div>
      </section>

      {/* 2. CONTACT CONTENT SECTION */}
      <section className="relative z-20 bg-white py-24 px-6 -mt-20 rounded-t-[3rem] shadow-[0_-20px_50px_rgba(0,0,0,0.1)]">
        <div className="max-w-screen-2xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20">

          {/* Info Side */}
          <div className="space-y-12">
            <div>
              <h2 className="text-4xl md:text-6xl font-black mb-8 uppercase tracking-tighter text-slate-950 leading-none">
                OUR <br /><span className="text-teal-600">CHANNELS</span>
              </h2>
              <p className="text-slate-500 text-lg font-medium max-w-md">Prefer direct communication? Reach out through any of these platforms.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { icon: 'mail01Icon', label: 'Email', val: 'hello@speedpro.vercel.app', color: 'text-teal-600', bg: 'bg-teal-50' },
                { icon: 'callIcon', label: 'Phone', val: '+880 1700 000000', color: 'text-indigo-600', bg: 'bg-indigo-50' },
                { icon: 'location01Icon', label: 'Dhaka Office', val: 'Mirpur DOHS, Road 12', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                { icon: 'chat01Icon', label: 'Support', val: '24/7 Live Chat', color: 'text-rose-600', bg: 'bg-rose-50' },
              ].map((item) => (
                <div key={item.label} className="group p-8 rounded-[2rem] bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all hover:-translate-y-1">
                  <div className={`${item.bg} ${item.color} w-12 h-12 rounded-xl flex items-center justify-center mb-6 shadow-inner`}>
                    <HugeIconPicker name={item.icon} size={24} />
                  </div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{item.label}</h4>
                  <p className="text-slate-900 font-black tracking-tight">{item.val}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Form Side */}
          <div className="bg-slate-950 rounded-[3rem] p-8 md:p-12 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-teal-500/5 to-transparent pointer-events-none" />

            <form className="relative z-10 space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-teal-500 uppercase tracking-widest ml-4">Your Name</label>
                  <input type="text" placeholder="John Doe" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-teal-500/50 transition-colors font-bold uppercase text-xs tracking-widest" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-teal-500 uppercase tracking-widest ml-4">Email Address</label>
                  <input type="email" placeholder="john@example.com" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-teal-500/50 transition-colors font-bold uppercase text-xs tracking-widest" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-teal-500 uppercase tracking-widest ml-4">Subject</label>
                <select className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-teal-500/50 transition-colors font-bold uppercase text-xs tracking-widest appearance-none">
                  <option className="bg-slate-900">ISP Consultancy</option>
                  <option className="bg-slate-900">Technical Support</option>
                  <option className="bg-slate-900">Partnership</option>
                  <option className="bg-slate-900">Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-teal-500 uppercase tracking-widest ml-4">Message</label>
                <textarea rows={5} placeholder="Tell us how we can help..." className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-teal-500/50 transition-colors font-bold uppercase text-xs tracking-widest resize-none"></textarea>
              </div>
              <button className="w-full bg-teal-500 text-slate-950 py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-teal-400 transition-all shadow-[0_15px_30px_-10px_rgba(20,184,166,0.5)] group">
                Send Message <HugeIconPicker name="arrowRight01Icon" size={18} className="inline ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>

        </div>
      </section>
    </div>
  );
}
