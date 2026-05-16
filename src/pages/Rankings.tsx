import { useState } from 'react';
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, XAxis, YAxis, Tooltip, CartesianGrid, Legend
} from 'recharts';
import HugeIconPicker from '../components/HugeIconPicker';

const MOCK = [
  { rank: 1, isp: 'Inspire', dl: 94.2, ul: 47.1, ping: 5, score: 9.4, color: '#2dd4bf', area: 'Sec 6' }, // Changed colors to fit dark theme (teal/indigo/rose)
  { rank: 2, isp: 'BAS Net', dl: 88.7, ul: 43.2, ping: 7, score: 8.9, color: '#818cf8', area: 'Sec 10' },
  { rank: 3, isp: 'MirpurNet', dl: 71.3, ul: 35.6, ping: 9, score: 7.6, color: '#f43f5e', area: 'Sec 11' },
  { rank: 4, isp: 'MNET', dl: 58.4, ul: 28.9, ping: 12, score: 6.5, color: '#38bdf8', area: 'Sec 13' },
  { rank: 5, isp: 'Info ISP', dl: 44.1, ul: 21.3, ping: 18, score: 5.2, color: '#fbbf24', area: 'Sec 12' },
  { rank: 6, isp: 'Mirpur OL', dl: 38.6, ul: 18.7, ping: 22, score: 4.4, color: '#a78bfa', area: 'Sec 14' },
];

const TREND = [
  { month: 'Jan', Inspire: 88, BAS: 82, MirpurNet: 65, MNET: 52 },
  { month: 'Feb', Inspire: 90, BAS: 84, MirpurNet: 67, MNET: 54 },
  { month: 'Mar', Inspire: 91, BAS: 86, MirpurNet: 68, MNET: 55 },
  { month: 'Apr', Inspire: 93, BAS: 87, MirpurNet: 70, MNET: 57 },
  { month: 'May', Inspire: 94, BAS: 89, MirpurNet: 71, MNET: 58 },
];

const RADAR_DATA = [
  { metric: 'Speed', Inspire: 94, BAS: 89, MirpurNet: 71 },
  { metric: 'Upload', Inspire: 94, BAS: 86, MirpurNet: 71 },
  { metric: 'Ping', Inspire: 96, BAS: 93, MirpurNet: 89 },
  { metric: 'Value', Inspire: 75, BAS: 82, MirpurNet: 88 },
  { metric: 'Reliability', Inspire: 95, BAS: 91, MirpurNet: 85 },
  { metric: 'BDIX', Inspire: 95, BAS: 90, MirpurNet: 88 },
];

const MEDAL: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' };
type Tab = 'leaderboard' | 'trend' | 'radar';

export default function Rankings() {
  const [tab, setTab] = useState<Tab>('leaderboard');

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 selection:bg-teal-500/30 selection:text-teal-900 pb-20 relative">
      {/* Background Graphic */}
      <div className="absolute top-0 left-0 w-full h-[60vh] z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-950/90 to-slate-950 z-10" />
        <img 
          src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=2000&q=80" 
          alt="Server infrastructure" 
          className="w-full h-full object-cover opacity-30 mix-blend-luminosity scale-105"
        />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/20 rounded-full blur-[100px] z-10" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px] z-10" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 pt-32 space-y-8">
        
        {/* Header */}
        <div className="text-center md:text-left mb-12">
          <div className="inline-flex items-center gap-2 text-teal-400 text-xs font-black uppercase tracking-widest mb-4 bg-teal-500/10 px-3 py-1.5 rounded-full border border-teal-500/20">
            <HugeIconPicker name="trophy01Icon" size={16} /> Global ISP Rankings
          </div>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white drop-shadow-2xl mb-4">
            Performance <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-indigo-400">Leaderboard</span>
          </h1>
          <p className="text-lg text-slate-400 font-medium max-w-2xl">
            Crowdsourced from thousands of Speed Pro users. Updated monthly with real-time analytics.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: 'Avg Download', val: '65.9 Mbps', icon: 'trendUp01Icon', color: 'text-teal-400' },
            { label: 'Avg Upload', val: '32.5 Mbps', icon: 'arrowUp01Icon', color: 'text-indigo-400' },
            { label: 'Avg Ping', val: '12 ms', icon: 'activity01Icon', color: 'text-rose-400' },
          ].map(s => (
            <div key={s.label} className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 text-center shadow-xl">
              <HugeIconPicker name={s.icon} size={28} className={`${s.color} mx-auto mb-3 drop-shadow-[0_0_15px_rgba(45,212,191,0.5)]`} />
              <p className="text-3xl font-black text-white">{s.val}</p>
              <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tab picker */}
        <div className="flex gap-2 bg-white/5 backdrop-blur-md rounded-2xl p-1.5 border border-white/10 shadow-xl w-fit mx-auto md:mx-0">
          {([
            { key: 'leaderboard', label: 'Leaderboard', icon: 'trophy01Icon' },
            { key: 'trend', label: 'Speed Trend', icon: 'analytics01Icon' },
            { key: 'radar', label: 'Radar', icon: 'activity01Icon' },
          ] as { key: Tab; label: string; icon: string }[]).map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 ${tab === t.key ? 'bg-teal-500 text-slate-950 shadow-[0_0_20px_rgba(20,184,166,0.4)]' : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}>
              <HugeIconPicker name={t.icon} size={16} />
              {t.label}
            </button>
          ))}
        </div>

        {/* Leaderboard */}
        {tab === 'leaderboard' && (
          <div className="bg-white/5 backdrop-blur-md rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl">
            <div className="px-8 py-5 border-b border-white/5 flex items-center gap-3 bg-white/5">
              <HugeIconPicker name="trophy01Icon" size={18} className="text-teal-400" />
              <span className="font-black text-sm text-white uppercase tracking-widest">May 2026 Rankings</span>
              <span className="ml-auto text-[11px] font-black uppercase tracking-wider text-slate-500">2,903 tests</span>
            </div>
            <div className="divide-y divide-white/5">
              {MOCK.map(r => (
                <div key={r.rank} className="flex items-center px-8 py-5 gap-6 hover:bg-white/5 transition-colors group">
                  <span className="text-2xl shrink-0 w-8 text-center flex justify-center items-center">{MEDAL[r.rank] || <span className="text-slate-600 font-black text-lg">#{r.rank}</span>}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-base text-white group-hover:text-teal-400 transition-colors uppercase tracking-wide">{r.isp}</p>
                    <p className="text-[11px] text-slate-500 font-black uppercase tracking-widest mt-0.5">{r.area}</p>
                  </div>
                  <div className="hidden md:flex items-center gap-2 flex-1 max-w-[200px]">
                    <div className="flex-1 h-2.5 bg-slate-900 rounded-full overflow-hidden shadow-inner border border-white/5">
                      <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${r.dl}%`, backgroundColor: r.color, boxShadow: `0 0 10px ${r.color}80` }} />
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-base font-black" style={{ color: r.color }}>{r.dl} <span className="text-[11px] text-slate-500 font-black uppercase tracking-widest">Mbps</span></p>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-0.5">{r.ping}ms ping</p>
                  </div>
                  <div className="shrink-0 flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                    <HugeIconPicker name="starIcon" size={14} className="text-teal-400 fill-teal-400" />
                    <span className="text-sm font-black text-white">{r.score}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Trend chart */}
        {tab === 'trend' && (
          <div className="bg-white/5 backdrop-blur-md rounded-[2rem] border border-white/10 p-8 shadow-2xl space-y-8">
            <div>
              <h2 className="font-black text-base text-white uppercase tracking-widest">Avg Download Speed Trend (Mbps)</h2>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mt-1">Jan – May 2026 · Top 4 ISPs</p>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={TREND} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    {[['inspire', '#2dd4bf'], ['bas', '#818cf8'], ['mirpur', '#f43f5e'], ['mnet', '#38bdf8']].map(([id, color]) => (
                      <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={color} stopOpacity={0} />
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fontWeight: 900, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fontWeight: 900, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#020617', borderRadius: 16, border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', fontSize: 12, fontWeight: 900, color: '#fff' }} itemStyle={{ fontWeight: 900 }} />
                  <Legend wrapperStyle={{ fontSize: 12, fontWeight: 900, color: '#fff' }} />
                  <Area type="monotone" dataKey="Inspire" stroke="#2dd4bf" strokeWidth={3} fill="url(#inspire)" dot={{ r: 4, fill: '#2dd4bf', strokeWidth: 2, stroke: '#020617' }} />
                  <Area type="monotone" dataKey="BAS" stroke="#818cf8" strokeWidth={3} fill="url(#bas)" dot={{ r: 4, fill: '#818cf8', strokeWidth: 2, stroke: '#020617' }} />
                  <Area type="monotone" dataKey="MirpurNet" stroke="#f43f5e" strokeWidth={3} fill="url(#mirpur)" dot={{ r: 4, fill: '#f43f5e', strokeWidth: 2, stroke: '#020617' }} />
                  <Area type="monotone" dataKey="MNET" stroke="#38bdf8" strokeWidth={3} fill="url(#mnet)" dot={{ r: 4, fill: '#38bdf8', strokeWidth: 2, stroke: '#020617' }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="pt-8 border-t border-white/5">
              <h3 className="font-black text-xs text-white uppercase tracking-widest mb-6">Download vs Upload — May 2026</h3>
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={MOCK.map(m => ({ isp: m.isp, Download: m.dl, Upload: m.ul }))} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} barCategoryGap="20%">
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="isp" tick={{ fontSize: 11, fontWeight: 900, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fontWeight: 900, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#020617', borderRadius: 16, border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', fontSize: 12, fontWeight: 900, color: '#fff' }} cursor={{fill: 'rgba(255,255,255,0.05)'}} />
                    <Legend wrapperStyle={{ fontSize: 12, fontWeight: 900, color: '#fff' }} />
                    <Bar dataKey="Download" fill="#2dd4bf" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Upload" fill="#818cf8" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Radar chart */}
        {tab === 'radar' && (
          <div className="bg-white/5 backdrop-blur-md rounded-[2rem] border border-white/10 p-8 shadow-2xl">
            <div className="mb-6">
              <h2 className="font-black text-base text-white uppercase tracking-widest">Multi-Metric Comparison</h2>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mt-1">Top 3 ISPs · Score out of 100</p>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={RADAR_DATA}>
                  <PolarGrid stroke="rgba(255,255,255,0.1)" />
                  <PolarAngleAxis dataKey="metric" tick={{ fontSize: 12, fontWeight: 900, fill: '#94a3b8' }} />
                  <Radar name="Inspire" dataKey="Inspire" stroke="#2dd4bf" fill="#2dd4bf" fillOpacity={0.2} strokeWidth={3} />
                  <Radar name="BAS" dataKey="BAS" stroke="#818cf8" fill="#818cf8" fillOpacity={0.2} strokeWidth={3} />
                  <Radar name="MirpurNet" dataKey="MirpurNet" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.2} strokeWidth={3} />
                  <Legend wrapperStyle={{ fontSize: 12, fontWeight: 900, color: '#fff' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#020617', borderRadius: 16, border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', fontSize: 12, fontWeight: 900, color: '#fff' }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 pt-8 border-t border-white/5">
              {MOCK.slice(0, 3).map(r => (
                <div key={r.rank} className="text-center p-5 rounded-2xl border border-white/10 bg-white/5">
                  <div className="flex justify-center mb-3 text-2xl">{MEDAL[r.rank]}</div>
                  <p className="font-black text-sm text-white uppercase tracking-wider mb-1">{r.isp}</p>
                  <p className="text-[11px] text-teal-400 font-black uppercase tracking-widest">{r.score}/10 Overall</p>
                  <div className="mt-4 h-2 bg-slate-900 rounded-full overflow-hidden border border-white/5 shadow-inner">
                    <div className="h-full rounded-full" style={{ width: `${r.score * 10}%`, backgroundColor: r.color, boxShadow: `0 0 10px ${r.color}80` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ISP grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MOCK.map(r => (
            <div key={r.rank} className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 shadow-xl hover:bg-white/10 hover:border-white/20 transition-all group">
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-black" style={{ color: r.color }}>#{r.rank}</span>
                <HugeIconPicker name="wifi01Icon" size={20} className={r.color} />
              </div>
              <p className="font-black text-lg text-white uppercase tracking-wide group-hover:text-teal-400 transition-colors">{r.isp}</p>
              <p className="text-[11px] text-slate-500 font-black uppercase tracking-widest mb-4">{r.area}</p>
              <div className="flex justify-between text-sm">
                <div>
                  <p className="font-black text-xl" style={{ color: r.color }}>{r.dl}</p>
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">DL Mbps</p>
                </div>
                <div className="text-right">
                  <p className="font-black text-xl text-white">{r.ul}</p>
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">UL Mbps</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
