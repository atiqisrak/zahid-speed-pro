import { useState, useEffect } from 'react';
import { Database, Search, Copy, Check, ExternalLink, Flag, RefreshCw } from 'lucide-react';

type Server = {
  id: number; name: string; provider: string; url: string;
  httpUrl: string | null; category: string; description: string;
  isps: string; lastStatus: string; lastPing: number; popular: boolean;
};

const CATS = ['All','Movies/TV','Games','Software','WebTV','Music'];
const CAT_COLORS: Record<string,string> = {
  'Movies/TV': 'bg-violet-100 text-violet-700',
  'Games':     'bg-emerald-100 text-emerald-700',
  'Software':  'bg-blue-100 text-blue-700',
  'WebTV':     'bg-rose-100 text-rose-700',
  'Music':     'bg-amber-100 text-amber-700',
};

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
            <Database size={22} className="text-teal-600" /> BDIX Server Hub
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Bangladesh Internet Exchange — local servers for ultra-fast downloads without using international bandwidth
          </p>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          <RefreshCw size={12} />
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
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
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
          <Database size={40} className="mx-auto mb-3 opacity-30" />
          <p className="font-bold">No servers found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(s => (
            <div key={s.id} className="bg-white rounded-3xl border border-slate-100 p-5 flex flex-col gap-3 hover:shadow-md hover:border-teal-100 transition-all">
              {/* Status + name */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${s.lastStatus==='online' ? 'bg-emerald-400 shadow-sm shadow-emerald-400/50' : 'bg-red-400'}`}
                    style={s.lastStatus==='online' ? {animation:'pulse 2s cubic-bezier(0.4,0,0.6,1) infinite'} : {}} />
                  <h3 className="font-black text-sm truncate">{s.name}</h3>
                </div>
                {s.popular && <span className="text-[9px] font-black uppercase bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full shrink-0">Popular</span>}
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed">{s.description}</p>

              {/* Meta */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-lg ${CAT_COLORS[s.category] || 'bg-slate-100 text-slate-600'}`}>
                  {s.category}
                </span>
                <span className="text-[10px] text-slate-400 font-bold">⏱ {s.lastPing}ms</span>
              </div>

              {/* URL */}
              <div className="bg-slate-50 rounded-xl px-3 py-2 font-mono text-[10px] text-slate-500 truncate border border-slate-100">
                {s.url}
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-auto">
                <button onClick={() => copyUrl(s)}
                  className={`flex-1 py-2 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all
                    ${copiedId===s.id ? 'bg-emerald-500 text-white' : 'bg-teal-50 text-teal-700 hover:bg-teal-100'}`}>
                  {copiedId===s.id ? <><Check size={12}/> Copied</> : <><Copy size={12}/> Copy URL</>}
                </button>
                {s.httpUrl && (
                  <a href={s.httpUrl} target="_blank" rel="noopener noreferrer"
                    className="px-3 py-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors flex items-center justify-center">
                    <ExternalLink size={14} />
                  </a>
                )}
                <button title="Report Down"
                  className="px-3 py-2 rounded-xl bg-slate-100 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors">
                  <Flag size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="text-center text-xs text-slate-400 pb-4">
        Know a BDIX server not listed? <button className="text-teal-600 font-bold hover:underline">Submit a server →</button>
      </div>
    </div>
  );
}
