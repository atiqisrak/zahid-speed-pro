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
    <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
            <HugeIconPicker name="database01Icon" size={22} className="text-teal-600" /> BDIX Server Hub
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Bangladesh Internet Exchange — local servers for ultra-fast downloads without using international bandwidth
          </p>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          <HugeIconPicker name="arrowReloadHorizontalIcon" size={12} />
          Updated {lastChecked || '—'}
        </div>
      </div>

      {/* Info banner */}
      <div className="bg-teal-50 border border-teal-100 rounded-2xl p-4 text-sm text-teal-700 font-medium">
        🔵 <strong>What is BDIX?</strong> BDIX servers are hosted inside Bangladesh — you download at your full connection speed without consuming international bandwidth quota. Most Mirpur ISPs support BDIX peering.
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <HugeIconPicker name="search01Icon" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={q} onChange={e => setQ(e.target.value)}
            placeholder="Search servers..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:border-teal-400" />
        </div>
      </div>
      <div className="flex gap-2 flex-wrap">
        {CATS.map(c => (
          <button key={c} onClick={() => setCat(c)}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all border ${
              cat === c ? 'bg-teal-600 text-white border-teal-600' : 'bg-white border-slate-200 text-slate-600 hover:border-teal-300'}`}>
            {c} <span className="opacity-60">({counts[c]})</span>
          </button>
        ))}
      </div>

      {/* Server grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <HugeIconPicker name="database01Icon" size={40} className="mx-auto mb-3 opacity-30" />
          <p className="font-bold">No servers found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(s => (
            <BDIXServerCard key={s.id} s={s} copiedId={copiedId} onCopy={copyUrl} />
          ))}
        </div>
      )}

      <div className="text-center text-xs text-slate-400 pb-4">
        Know a BDIX server not listed? <button className="text-teal-600 font-bold hover:underline">Submit a server →</button>
      </div>
    </div>
  );
}
