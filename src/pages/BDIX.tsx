import HugeIconPicker from '../components/HugeIconPicker';
import { useState, useEffect } from 'react';

import BDIXServerCard, { Server } from '../components/BDIXServerCard';

const CATS = ['All','Movies/TV','Games','Software','WebTV','Music'];

export default function BDIX() {
  const [servers, setServers] = useState<Server[]>([]);
  const [cat, setCat] = useState('All');
  const [q, setQ] = useState('');
  const [copiedId, setCopiedId] = useState<number|null>(null);
  const [lastChecked, setLastChecked] = useState('');

  useEffect(() => {
    fetch('/data/bdix-servers.json')
      .then(r => r.json())
      .then(d => {
        setServers(d.servers);
        setLastChecked(new Date(d.lastUpdated).toLocaleDateString('en-BD', { day:'numeric', month:'short', year:'numeric' }));
      });
  }, []);

  const copyUrl = (s: Server) => {
    navigator.clipboard?.writeText(s.url);
    setCopiedId(s.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filtered = servers.filter(s =>
    (cat === 'All' || s.category === cat) &&
    (s.name.toLowerCase().includes(q.toLowerCase()) || s.provider.toLowerCase().includes(q.toLowerCase()))
  );

  const counts = CATS.reduce((acc, c) => {
    acc[c] = c === 'All' ? servers.length : servers.filter(s => s.category === c).length;
    return acc;
  }, {} as Record<string,number>);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans relative pb-20 selection:bg-teal-500/30 selection:text-teal-900">
      {/* Background Graphic */}
      <div className="absolute top-0 left-0 w-full h-[50vh] z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-950/90 to-slate-950 z-10" />
        <img 
          src="https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=2000&q=80" 
          alt="Data servers" 
          className="w-full h-full object-cover opacity-20 mix-blend-luminosity scale-105"
        />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-[120px] z-10" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-32 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-teal-400 text-xs font-black uppercase tracking-widest mb-4 bg-teal-500/10 px-3 py-1.5 rounded-full border border-teal-500/20">
              <HugeIconPicker name="database01Icon" size={16} /> Server Directory
            </div>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white drop-shadow-2xl mb-2">
              BDIX <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">Hub</span>
            </h1>
            <p className="text-slate-400 text-sm font-bold uppercase tracking-wider max-w-2xl">
              Bangladesh Internet Exchange — local servers for ultra-fast downloads without using international bandwidth.
            </p>
          </div>
          <div className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-widest bg-white/5 border border-white/10 px-4 py-2 rounded-xl backdrop-blur-md">
            <HugeIconPicker name="arrowReloadHorizontalIcon" size={14} className="text-teal-400" />
            Updated {lastChecked || '—'}
          </div>
        </div>

        {/* Info banner */}
        <div className="bg-teal-500/10 border border-teal-500/20 backdrop-blur-md rounded-[2rem] p-6 text-sm text-teal-400 font-bold shadow-lg leading-relaxed">
          <span className="text-lg mr-2">🔵</span> <strong className="text-white uppercase tracking-wider">What is BDIX?</strong> BDIX servers are hosted inside Bangladesh — you download at your full connection speed without consuming international bandwidth quota. Most Mirpur ISPs support BDIX peering.
        </div>

        {/* Search + Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-center bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 p-4 shadow-xl">
          <div className="relative flex-1 w-full">
            <HugeIconPicker name="search01Icon" size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input value={q} onChange={e => setQ(e.target.value)}
              placeholder="Search servers..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-white/10 text-sm font-bold bg-slate-900/50 text-white placeholder:text-slate-600 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/50 transition-all uppercase tracking-wider" />
          </div>
          <div className="flex gap-2 flex-wrap w-full sm:w-auto">
            {CATS.map(c => (
              <button key={c} onClick={() => setCat(c)}
                className={`px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all border ${
                  cat === c ? 'bg-teal-500 text-slate-950 border-teal-500 shadow-[0_0_15px_rgba(20,184,166,0.4)]' : 'bg-white/5 border-white/10 text-slate-400 hover:border-teal-500/50 hover:text-white'}`}>
                {c} <span className="opacity-60 ml-1">({counts[c]})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Server grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-500 bg-white/5 backdrop-blur-md rounded-[2rem] border border-white/10">
            <HugeIconPicker name="database01Icon" size={60} className="mx-auto mb-4 opacity-20" />
            <p className="font-black uppercase tracking-widest">No servers found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(s => (
              <BDIXServerCard key={s.id} s={s} copiedId={copiedId} onCopy={copyUrl} />
            ))}
          </div>
        )}

        <div className="text-center text-xs font-bold uppercase tracking-widest text-slate-500 pb-8 pt-4">
          Know a BDIX server not listed? <button className="text-teal-400 hover:text-white hover:underline transition-colors">Submit a server →</button>
        </div>
      </div>
    </div>
  );
}
