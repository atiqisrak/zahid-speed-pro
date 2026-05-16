import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import HugeIconPicker from '../components/HugeIconPicker';

export default function Compliance() {
  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const opacity = useTransform(heroScroll, [0, 0.8], [1, 0]);
  const y = useTransform(heroScroll, [0, 1], [0, 200]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-teal-500/30 selection:text-teal-900">
      
      {/* 1. DARK HERO SECTION */}
      <section ref={heroRef} className="relative min-h-[60vh] pt-32 px-6 flex flex-col justify-center overflow-hidden bg-slate-950">
        <motion.div style={{ opacity }} className="max-w-screen-2xl mx-auto w-full z-10 text-white relative">
          <div className="inline-flex items-center justify-center gap-2 text-teal-400 text-xs font-black uppercase tracking-widest mb-6 bg-teal-500/10 px-4 py-2 rounded-full border border-teal-500/20 backdrop-blur-sm">
            <HugeIconPicker name="licenseIcon" size={16} /> Regulatory Standards
          </div>
          <h1 className="text-[10vw] md:text-[7vw] leading-[0.85] font-black tracking-tighter mb-8 uppercase text-white">
            ISP <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-indigo-400">COMPLIANCE</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl font-medium tracking-tight">
            Ensuring high standards for internet services in Bangladesh. We monitor adherence to BTRC guidelines and QoS requirements.
          </p>
        </motion.div>
        <motion.div style={{ y }} className="absolute inset-0 z-0 overflow-hidden bg-slate-950 origin-bottom">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 to-slate-950 z-10 pointer-events-none" />
        </motion.div>
      </section>

      {/* 2. COMPLIANCE BLOCKS */}
      <section className="py-24 px-6 bg-white relative z-20 -mt-10 rounded-t-[3rem] shadow-2xl">
        <div className="max-w-screen-2xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            <div className="space-y-8 lg:col-span-1">
              <h2 className="text-4xl font-black uppercase tracking-tighter text-slate-950 leading-none">
                OUR <br/><span className="text-teal-600">MISSION</span>
              </h2>
              <p className="text-slate-500 text-lg font-medium">We act as an independent auditor of ISP quality in Dhaka, ensuring that consumers get exactly what they pay for.</p>
              <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-200">
                <HugeIconPicker name="alertCircleIcon" size={40} className="text-rose-500 mb-6" />
                <h4 className="text-sm font-black uppercase tracking-widest text-slate-950 mb-4">Complaint Hotline</h4>
                <p className="text-slate-500 text-sm mb-6">If your ISP is violating BTRC regulations, report it immediately.</p>
                <a href="tel:16996" className="inline-flex items-center gap-2 bg-rose-500 text-white px-6 py-3 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-rose-600 transition-colors">
                  <HugeIconPicker name="callIcon" size={16} /> Dial 16996
                </a>
              </div>
            </div>

            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { title: 'Quality of Service (QoS)', desc: 'Monitoring latency, jitter, and packet loss according to BTRC benchmarks for broadband internet.', icon: 'chartBar01Icon' },
                { title: 'Fair Pricing', desc: 'Ensuring ISPs adhere to the "One Country One Rate" policy and don\'t overcharge for bandwidth.', icon: 'bankNote01Icon' },
                { title: 'Customer Support', desc: 'Auditing 24/7 technical support availability and resolution times for user complaints.', icon: 'customerServiceIcon' },
                { title: 'Transparency', desc: 'Requiring ISPs to clearly disclose BDIX speeds vs Global bandwidth in their service agreements.', icon: 'viewIcon' },
              ].map((item) => (
                <div key={item.title} className="p-10 rounded-[2.5rem] bg-slate-50 border border-slate-200 hover:border-teal-500/30 transition-all group">
                  <div className="bg-white w-14 h-14 rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform">
                    <HugeIconPicker name={item.icon} size={28} className="text-teal-600" />
                  </div>
                  <h3 className="text-xl font-black uppercase tracking-tight text-slate-950 mb-4">{item.title}</h3>
                  <p className="text-slate-500 text-sm font-medium leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
