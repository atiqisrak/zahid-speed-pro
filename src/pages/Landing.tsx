import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import HugeIconPicker from '../components/HugeIconPicker';

/* --- Components --- */

const PremiumCard = ({ title, desc, icon, delay }: { title: string, desc: string, icon: string, delay: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      ref={cardRef}
      className={`relative group bg-white border border-slate-200 rounded-3xl p-8 transition-all duration-500 hover:border-amber-500/50 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(245,158,11,0.15)]`}
      style={{ animationDelay: `${delay}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute top-0 left-8 w-24 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-6 text-teal-600 group-hover:text-amber-500 group-hover:scale-110 transition-all duration-300 shadow-sm">
        <HugeIconPicker name={icon} size={28} />
      </div>
      
      <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">{title}</h3>
      <p className="text-slate-600 text-sm leading-relaxed font-medium">{desc}</p>
      
      <div className="mt-8 flex items-center text-sm font-bold text-teal-600 group-hover:text-amber-600 transition-colors">
        Learn more <HugeIconPicker name="arrowRight01Icon" size={16} className={`ml-2 transition-transform duration-300 ${isHovered ? 'translate-x-2' : ''}`} />
      </div>
    </div>
  );
};

const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-slate-200 last:border-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex items-center justify-between text-left focus:outline-none"
      >
        <h3 className={`text-lg font-bold transition-colors ${isOpen ? 'text-amber-600' : 'text-slate-900'}`}>
          {question}
        </h3>
        <span className={`text-slate-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          <HugeIconPicker name="arrowDown01Icon" size={20} />
        </span>
      </button>
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <p className="text-slate-600 leading-relaxed">{answer}</p>
      </div>
    </div>
  );
};

/* --- Main Page --- */

export default function Landing() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-amber-500/30 selection:text-amber-900">
      
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-teal-100/60 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-amber-100/60 blur-[120px]" />
        {/* Subtle Grid */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik02MCAwaC0xdjYwaDFWMHptLTYwIDYwaDYwdi0xSDB2MXoiIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMC4wMyIgZmlsbC1ydWxlPSJldmVub2RkIi8+Cjwvc3ZnPg==')] [mask-image:linear-gradient(to_bottom,white,transparent)]" />
      </div>

      <main className="relative z-10 flex flex-col">
        
        {/* HERO SECTION */}
        <header className="pt-32 pb-20 md:pt-48 md:pb-32 px-6 max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-500/30 bg-amber-50 mb-8 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-700">Dhaka's #1 ISP Consultant</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black tracking-tight text-slate-900 mb-6 leading-[1.1]">
              Flawless Connectivity.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-teal-800">Expertly Engineered.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-600 font-medium mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              We don't just test your speed. We analyze your local routing, evaluate BDIX performance, and provide expert consulting to deliver the ultimate internet solution for your home or enterprise in Bangladesh.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link to="/isp-finder" className="w-full sm:w-auto px-8 py-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-1">
                Get a Free Consultation
              </Link>
              <Link to="/speedtest" className="w-full sm:w-auto px-8 py-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2">
                <HugeIconPicker name="activity01Icon" size={20} className="text-teal-600" /> Analyze Network
              </Link>
            </div>
          </div>
          
          <div className="flex-1 relative w-full max-w-lg lg:max-w-none flex justify-center group">
            <div className="relative w-full max-w-[500px] aspect-square rounded-[3rem] overflow-hidden shadow-2xl shadow-teal-500/20 border-8 border-white">
              <img src="/@fs/C:/Users/User/.gemini/antigravity/brain/1c6e9397-34f3-4858-b5fc-12796844cc46/hero_network_remix_1778871201810.png" alt="Speed Pro Network Analytics" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-tr from-teal-500/20 to-transparent pointer-events-none mix-blend-overlay" />
            </div>
          </div>
        </header>

        {/* STATS MARQUEE */}
        <section className="border-y border-slate-200 bg-white/60 backdrop-blur-md py-6 overflow-hidden">
          <div className="flex w-max animate-[marquee_30s_linear_infinite] whitespace-nowrap">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex gap-16 px-8 items-center text-sm font-bold tracking-widest uppercase text-slate-500">
                <span className="flex items-center gap-3"><HugeIconPicker name="location01Icon" size={18} className="text-teal-600" /> 10,000+ Homes Optimized</span>
                <span className="text-slate-300">•</span>
                <span className="flex items-center gap-3"><HugeIconPicker name="map01Icon" size={18} className="text-amber-600" /> 500+ Enterprise Clients in Dhaka</span>
                <span className="text-slate-300">•</span>
                <span className="flex items-center gap-3"><HugeIconPicker name="shield01Icon" size={18} className="text-indigo-600" /> 99.9% Uptime Solutions</span>
                <span className="text-slate-300">•</span>
              </div>
            ))}
          </div>
        </section>

        {/* CORE SERVICES */}
        <section className="py-24 px-6 max-w-7xl mx-auto w-full">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4">Expert Solutions for Flawless Connectivity</h2>
            <p className="text-slate-600 max-w-2xl mx-auto font-medium">We bridge the gap between basic ISP provisions and true enterprise-grade network performance.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <PremiumCard 
              title="Enterprise Diagnostics" 
              desc="Pinpoint exact packet loss, latency bottlenecks, and routing inefficiencies with our proprietary testing algorithms." 
              icon="activity01Icon" 
              delay={0} 
            />
            <PremiumCard 
              title="BDIX Optimization" 
              desc="Unlock the full potential of local peering. We consult on optimal BDIX configurations for zero-buffer streaming and ultra-low latency." 
              icon="database01Icon" 
              delay={100} 
            />
            <PremiumCard 
              title="ISP Matchmaking" 
              desc="Not all fiber is created equal. We analyze local infrastructure to pair you with the highest-rated ISP in your exact Dhaka neighborhood." 
              icon="map01Icon" 
              delay={200} 
            />
          </div>
        </section>

        {/* METHODOLOGY / ADVANTAGE */}
        <section className="py-24 relative overflow-hidden bg-white border-y border-slate-200">
          <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-amber-500/5 to-transparent pointer-events-none" />
          
          <div className="max-w-7xl mx-auto px-6 w-full flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-6">Why We Are The Best in Dhaka</h2>
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-teal-50 border border-teal-200 flex items-center justify-center shrink-0">
                    <span className="font-black text-teal-600">01</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 mb-2">Unbiased Local Data</h4>
                    <p className="text-slate-600 text-sm leading-relaxed">Unlike individual ISPs pushing their own agenda, we aggregate raw performance data across Dhaka to provide completely objective recommendations.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
                    <span className="font-black text-amber-600">02</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 mb-2">Deep BDIX Integration</h4>
                    <p className="text-slate-600 text-sm leading-relaxed">We understand the National Internet Exchange better than anyone. Our tools verify actual peering paths, not just theoretical bandwidth.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center shrink-0">
                    <span className="font-black text-indigo-600">03</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 mb-2">Tailored Architecture</h4>
                    <p className="text-slate-600 text-sm leading-relaxed">From a simple apartment setup to a multi-story corporate office in Gulshan, we engineer solutions designed for your specific load and geography.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex-1 relative w-full flex justify-center group">
              <div className="relative w-full max-w-[450px] aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl shadow-amber-500/20 border-[6px] border-white z-10">
                <img src="/@fs/C:/Users/User/.gemini/antigravity/brain/1c6e9397-34f3-4858-b5fc-12796844cc46/diagnostic_server_remix_1778871222390.png" alt="Enterprise Network Diagnostics" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 to-transparent pointer-events-none" />
              </div>
              <div className="absolute right-0 bottom-[-20px] w-full max-w-[450px] aspect-[4/3] bg-amber-100 rounded-3xl border border-amber-200 -z-10 transition-transform duration-500 group-hover:translate-x-3 group-hover:translate-y-3" />
              <div className="absolute left-0 top-[-20px] w-full max-w-[450px] aspect-[4/3] bg-teal-100 rounded-3xl border border-teal-200 -z-20 transition-transform duration-500 group-hover:-translate-x-3 group-hover:-translate-y-3" />
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section className="py-24 px-6 max-w-3xl mx-auto w-full">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-slate-900 mb-4">Expert Answers to Your Connectivity Questions</h2>
          </div>
          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
            <FAQItem 
              question="Who is the best ISP consultant in Dhaka?" 
              answer="Speed Pro is widely recognized as the premier ISP consultant in Dhaka. We leverage proprietary diagnostic tools and localized network data to provide unbiased, expert recommendations for both homes and enterprises." 
            />
            <FAQItem 
              question="How do I choose the right ISP for my office in Banani/Gulshan?" 
              answer="Choosing the right ISP depends on local infrastructure availability, required bandwidth, and BDIX peering needs. Our ISP Matchmaking service analyzes your exact coordinates to find the most stable fiber provider in your specific neighborhood." 
            />
            <FAQItem 
              question="What is BDIX and why is my local speed slow?" 
              answer="BDIX (Bangladesh Internet Exchange) allows local ISPs to route traffic locally rather than internationally, drastically improving speeds for local content. If your local speed is slow, your ISP may have poor peering paths or congested bandwidth. We diagnose these exact issues." 
            />
            <FAQItem 
              question="Can you help resolve continuous packet loss during peak hours?" 
              answer="Yes. Packet loss during evening hours (8 PM - 11 PM) in Dhaka is typically caused by shared GPON network congestion. We can diagnose the bottleneck and consult on dedicated or optimized line solutions to guarantee stability." 
            />
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="py-24 px-6">
          <div className="max-w-5xl mx-auto bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 shadow-xl rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-full bg-amber-500/10 blur-[80px] pointer-events-none" />
            
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 relative z-10">Ready for Uninterrupted Internet?</h2>
            <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto font-medium relative z-10">Stop guessing with standard speed tests. Let the experts engineer a flawless connection for you.</p>
            
            <div className="relative z-10 flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/isp-finder" className="px-10 py-5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-2xl transition-all shadow-lg hover:shadow-amber-500/30 text-lg hover:-translate-y-1">
                Schedule Your Consultation
              </Link>
            </div>
          </div>
        </section>

      </main>
      
      {/* GLOBAL CSS ANIMATION DEFS */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
