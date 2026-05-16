import HugeIconPicker from '../components/HugeIconPicker';
import { NavLink } from 'react-router-dom';


const TOOLS = [
  { to: '/tools/ip-check', icon:'search01Icon',     title: 'Real IP Checker',       desc: 'Check your public IP, NAT type, IPv6 support and ISP details.', color: 'bg-teal-500/20 text-teal-400 border-teal-500/30' },
  { to: '/tools/dns',      icon:'serverIcon',      title: 'DNS Benchmark',         desc: 'Compare DNS speed — Cloudflare vs Google vs your ISP DNS.', color: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' },
  { to: '/tools/bandwidth',icon:'calculatorIcon', title: 'Bandwidth Calculator',  desc: 'How long to download a file? Can you stream 4K? Find out.', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  { to: '/',               icon:'wifi01Icon',       title: 'BDIX Speed Test',       desc: 'Run a speed test specifically against BDIX servers.', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
];

export default function Tools() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans relative pb-20 selection:bg-teal-500/30 selection:text-teal-900">
      
      {/* Background Graphic */}
      <div className="absolute top-0 left-0 w-full h-[50vh] z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-950/90 to-slate-950 z-10" />
        <img 
          src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=2000&q=80" 
          alt="Cybersecurity data" 
          className="w-full h-full object-cover opacity-20 mix-blend-luminosity scale-105"
        />
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-[120px] z-10" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-32 space-y-12">
        <div className="text-center md:text-left">
          <div className="inline-flex items-center gap-2 text-teal-400 text-xs font-black uppercase tracking-widest mb-4 bg-teal-500/10 px-3 py-1.5 rounded-full border border-teal-500/20">
            <HugeIconPicker name="wrench01Icon" size={16} /> Diagnostic Tools
          </div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white drop-shadow-2xl mb-2">
            Network <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-indigo-400">Toolkit</span>
          </h1>
          <p className="text-slate-400 text-sm font-bold uppercase tracking-wider">Advanced diagnostic tools for Bangladeshi internet users</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {TOOLS.map(t => (
            <NavLink key={t.to + t.title} to={t.to}
              className="bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 p-8 hover:bg-white/10 hover:border-white/20 hover:-translate-y-1 hover:shadow-2xl transition-all group">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border shadow-lg ${t.color}`}>
                <HugeIconPicker name={t.icon} size={28} />
              </div>
              <h3 className="font-black text-xl text-white uppercase tracking-wider mb-2 group-hover:text-teal-400 transition-colors">{t.title}</h3>
              <p className="text-sm text-slate-400 font-bold leading-relaxed">{t.desc}</p>
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
}
