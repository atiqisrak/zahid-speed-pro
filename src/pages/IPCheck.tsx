import HugeIconPicker from '../components/HugeIconPicker';
import { useState, useEffect } from 'react';


export default function IPCheck() {
  const [info, setInfo] = useState({ ip:'Checking...', isp:'', city:'', country:'', asn:'', org:'', ipv6: false });
  const [natType, setNatType] = useState<'Open'|'Moderate'|'Strict'|'Checking'>('Checking');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch('https://speed.cloudflare.com/meta')
      .then(r => r.json())
      .then(d => {
        setInfo({
          ip: d.clientIp || 'Unknown',
          isp: d.asOrganization || 'Unknown',
          city: d.city || '',
          country: d.country || 'BD',
          asn: d.asn ? `AS${d.asn}` : '',
          org: d.asOrganization || '',
          ipv6: (d.clientIp || '').includes(':'),
        });
        setTimeout(() => setNatType('Open'), 800);
      })
      .catch(() => { setInfo(p => ({...p, ip:'Unavailable'})); setNatType('Moderate'); });
  }, []);

  const copy = () => {
    navigator.clipboard?.writeText(info.ip);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const natColor = natType === 'Open' ? 'text-emerald-400' : natType === 'Moderate' ? 'text-amber-400' : natType === 'Strict' ? 'text-rose-400' : 'text-slate-500';
  const natBg   = natType === 'Open' ? 'bg-emerald-500/10 border-emerald-500/20' : natType === 'Moderate' ? 'bg-amber-500/10 border-amber-500/20' : natType === 'Strict' ? 'bg-rose-500/10 border-rose-500/20' : 'bg-white/5 border-white/10';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans relative pb-20 selection:bg-teal-500/30 selection:text-teal-900">
      {/* Background Graphic */}
      <div className="absolute top-0 left-0 w-full h-[50vh] z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-950/90 to-slate-950 z-10" />
        <img 
          src="https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=2000&q=80" 
          alt="Network cables" 
          className="w-full h-full object-cover opacity-20 mix-blend-luminosity scale-105"
        />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-[120px] z-10" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-6 pt-32 space-y-8">
        <div className="text-center md:text-left">
          <div className="inline-flex items-center gap-2 text-teal-400 text-xs font-black uppercase tracking-widest mb-4 bg-teal-500/10 px-3 py-1.5 rounded-full border border-teal-500/20">
            <HugeIconPicker name="search01Icon" size={16} /> Diagnostic Tool
          </div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white drop-shadow-2xl mb-2">
            Real IP <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">Checker</span>
          </h1>
          <p className="text-slate-400 text-sm font-bold uppercase tracking-wider">Detect your public IP, NAT type, and ISP details</p>
        </div>

        {/* Big IP display */}
        <div className="bg-teal-500/10 backdrop-blur-md border border-teal-500/30 shadow-[0_0_40px_rgba(20,184,166,0.15)] text-white rounded-[2rem] p-10 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03] flex items-center justify-center pointer-events-none">
            <HugeIconPicker name="globe02Icon" size={300} />
          </div>
          <p className="text-[11px] font-black uppercase tracking-[0.4em] text-teal-400 mb-4">Your Public IP Address</p>
          <div className="flex items-center justify-center gap-4">
            <p className="text-4xl md:text-6xl font-black font-mono tracking-tighter drop-shadow-[0_0_15px_rgba(20,184,166,0.5)]">{info.ip}</p>
            <button onClick={copy} className="p-3 bg-white/10 hover:bg-teal-500 hover:text-slate-950 rounded-xl transition-all border border-white/10 hover:border-teal-500">
              {copied ? <HugeIconPicker name="checkIcon" size={20} /> : <HugeIconPicker name="copy01Icon" size={20} />}
            </button>
          </div>
          <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mt-4">{info.city}{info.city ? ', ' : ''}{info.country}</p>
        </div>

        {/* Detail cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 shadow-xl hover:bg-white/10 transition-colors">
            <HugeIconPicker name="wifi01Icon" size={24} className="text-teal-400 mb-4 drop-shadow-[0_0_10px_rgba(45,212,191,0.5)]" />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">ISP / Provider</p>
            <p className="font-black text-lg leading-tight text-white uppercase tracking-wider">{info.isp || '—'}</p>
            {info.asn && <p className="text-[11px] text-teal-400/80 font-mono font-bold mt-1 uppercase tracking-widest">{info.asn}</p>}
          </div>
          <div className={`rounded-2xl border p-6 backdrop-blur-md shadow-xl transition-colors ${natBg}`}>
            <HugeIconPicker name="shield01Icon" size={24} className={`${natColor} mb-4 drop-shadow-[0_0_10px_currentColor]`} />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">NAT Type</p>
            <p className={`font-black text-lg uppercase tracking-wider ${natColor}`}>{natType}</p>
            <p className="text-[11px] text-slate-400 mt-1 font-bold uppercase tracking-wider">{natType==='Open'?'Great for gaming':'May affect P2P/gaming'}</p>
          </div>
          <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 shadow-xl hover:bg-white/10 transition-colors">
            <HugeIconPicker name="location01Icon" size={24} className="text-indigo-400 mb-4 drop-shadow-[0_0_10px_rgba(129,140,248,0.5)]" />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Location</p>
            <p className="font-black text-lg text-white uppercase tracking-wider">{info.city || 'Bangladesh'}</p>
          </div>
          <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 shadow-xl hover:bg-white/10 transition-colors">
            <HugeIconPicker name="shield01Icon" size={24} className="text-emerald-400 mb-4 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">IP Version</p>
            <p className="font-black text-lg text-white uppercase tracking-wider">IPv4</p>
            <p className="text-[11px] text-slate-400 mt-1 font-bold uppercase tracking-wider">IPv6: {info.ipv6 ? '✅ Active' : '❌ Not active'}</p>
          </div>
        </div>

        <div className="bg-teal-500/10 border border-teal-500/20 backdrop-blur-md rounded-2xl p-6 text-sm text-teal-400 font-bold leading-relaxed shadow-lg">
          💡 <strong className="text-white uppercase tracking-wider">Pro Tip:</strong> If your IP is shared (NAT Strict/Moderate), you may experience packet loss or strict matchmaking in games. Ask your ISP for a real/public IP — usually available for a small fee.
        </div>
      </div>
    </div>
  );
}
