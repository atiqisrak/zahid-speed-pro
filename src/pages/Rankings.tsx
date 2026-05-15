import { useState } from 'react';
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, XAxis, YAxis, Tooltip, CartesianGrid, Legend
} from 'recharts';
import HugeIconPicker from '../components/HugeIconPicker';

const MOCK = [
  { rank: 1, isp: 'Inspire', dl: 94.2, ul: 47.1, ping: 5, score: 9.4, color: '#6366f1', area: 'Sec 6' },
  { rank: 2, isp: 'BAS Net', dl: 88.7, ul: 43.2, ping: 7, score: 8.9, color: '#8b5cf6', area: 'Sec 10' },
  { rank: 3, isp: 'MirpurNet', dl: 71.3, ul: 35.6, ping: 9, score: 7.6, color: '#0d9488', area: 'Sec 11' },
  { rank: 4, isp: 'MNET', dl: 58.4, ul: 28.9, ping: 12, score: 6.5, color: '#06b6d4', area: 'Sec 13' },
  { rank: 5, isp: 'Info ISP', dl: 44.1, ul: 21.3, ping: 18, score: 5.2, color: '#f59e0b', area: 'Sec 12' },
  { rank: 6, isp: 'Mirpur OL', dl: 38.6, ul: 18.7, ping: 22, score: 4.4, color: '#ef4444', area: 'Sec 14' },
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
    <div className="min-h-full bg-slate-50 font-sans">
      {/* Gradient header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-amber-500 via-orange-500 to-rose-600 text-white">
        <div className="relative max-w-5xl mx-auto px-4 md:px-8 py-10">
          <div className="flex items-center gap-2 text-amber-200 text-xs font-bold uppercase tracking-widest mb-3">
            <HugeIconPicker name="trophy01Icon" size={14} /> ISP Rankings
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2">Mirpur ISP Leaderboard</h1>
          <p className="text-amber-100 text-sm">Crowdsourced from Speed Pro users · Updated monthly</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Avg Download', val: '65.9 Mbps', icon: 'trendUp01Icon', color: 'text-indigo-600' },
            { label: 'Avg Upload', val: '32.5 Mbps', icon: 'arrowUp01Icon', color: 'text-teal-600' },
            { label: 'Avg Ping', val: '12 ms', icon: 'activity01Icon', color: 'text-amber-500' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl p-4 border border-slate-100 text-center shadow-sm">
              <HugeIconPicker name={s.icon} size={20} className={`${s.color} mx-auto mb-1.5`} />
              <p className="text-lg font-black text-slate-900">{s.val}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tab picker */}
        <div className="flex gap-2 bg-white rounded-2xl p-1.5 border border-slate-100 shadow-sm w-fit">
          {([
            { key: 'leaderboard', label: 'Leaderboard', icon: 'trophy01Icon' },
            { key: 'trend', label: 'Speed Trend', icon: 'analytics01Icon' },
            { key: 'radar', label: 'Radar', icon: 'activity01Icon' },
          ] as { key: Tab; label: string; icon: string }[]).map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${tab === t.key ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}>
              <HugeIconPicker name={t.icon} size={14} />
              {t.label}
            </button>
          ))}
        </div>

        {/* Leaderboard */}
        {tab === 'leaderboard' && (
          <div className="bg-white rounded-[1.5rem] border border-slate-100 overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-slate-50 flex items-center gap-2 bg-gradient-to-r from-amber-50 to-orange-50">
              <HugeIconPicker name="trophy01Icon" size={16} className="text-amber-500" />
              <span className="font-black text-sm uppercase tracking-wider">May 2026 Rankings</span>
              <span className="ml-auto text-[10px] font-bold text-slate-400">2,903 tests</span>
            </div>
            <div className="divide-y divide-slate-50">
              {MOCK.map(r => (
                <div key={r.rank} className="flex items-center px-6 py-4 gap-4 hover:bg-slate-50 transition-colors">
                  <span className="text-xl shrink-0 w-8 text-center flex justify-center items-center">{MEDAL[r.rank] || <span className="text-slate-400 font-black text-sm">#{r.rank}</span>}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-sm">{r.isp}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">{r.area}</p>
                  </div>
                  <div className="hidden md:flex items-center gap-2 flex-1 max-w-[160px]">
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${r.dl}%`, backgroundColor: r.color }} />
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-black" style={{ color: r.color }}>{r.dl} <span className="text-[10px] text-slate-400 font-bold">Mbps</span></p>
                    <p className="text-xs text-slate-400 font-bold">{r.ping}ms ping</p>
                  </div>
                  <div className="shrink-0 flex items-center gap-1">
                    <HugeIconPicker name="starIcon" size={12} className="text-amber-400 fill-amber-400" />
                    <span className="text-xs font-black text-slate-700">{r.score}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Trend chart */}
        {tab === 'trend' && (
          <div className="bg-white rounded-[1.5rem] border border-slate-100 p-6 shadow-sm space-y-6">
            <div>
              <h2 className="font-black text-sm uppercase tracking-wider">Avg Download Speed Trend (Mbps)</h2>
              <p className="text-slate-400 text-xs mt-0.5">Jan – May 2026 · Top 4 ISPs</p>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={TREND} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    {[['inspire', '#6366f1'], ['bas', '#8b5cf6'], ['mirpur', '#0d9488'], ['mnet', '#06b6d4']].map(([id, color]) => (
                      <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={color} stopOpacity={0.2} />
                        <stop offset="95%" stopColor={color} stopOpacity={0} />
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 16, border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,.1)', fontSize: 11, fontWeight: 700 }} />
                  <Legend wrapperStyle={{ fontSize: 11, fontWeight: 700 }} />
                  <Area type="monotone" dataKey="Inspire" stroke="#6366f1" strokeWidth={2.5} fill="url(#inspire)" dot={{ r: 3, fill: '#6366f1' }} />
                  <Area type="monotone" dataKey="BAS" stroke="#8b5cf6" strokeWidth={2.5} fill="url(#bas)" dot={{ r: 3, fill: '#8b5cf6' }} />
                  <Area type="monotone" dataKey="MirpurNet" stroke="#0d9488" strokeWidth={2.5} fill="url(#mirpur)" dot={{ r: 3, fill: '#0d9488' }} />
                  <Area type="monotone" dataKey="MNET" stroke="#06b6d4" strokeWidth={2.5} fill="url(#mnet)" dot={{ r: 3, fill: '#06b6d4' }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div>
              <h3 className="font-black text-xs uppercase tracking-wider text-slate-400 mb-3">Download vs Upload — May 2026</h3>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={MOCK.map(m => ({ isp: m.isp, Download: m.dl, Upload: m.ul }))} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} barCategoryGap="30%">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="isp" tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: 16, border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,.1)', fontSize: 11, fontWeight: 700 }} />
                    <Legend wrapperStyle={{ fontSize: 11, fontWeight: 700 }} />
                    <Bar dataKey="Download" fill="#6366f1" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="Upload" fill="#0d9488" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Radar chart */}
        {tab === 'radar' && (
          <div className="bg-white rounded-[1.5rem] border border-slate-100 p-6 shadow-sm">
            <div className="mb-4">
              <h2 className="font-black text-sm uppercase tracking-wider">Multi-Metric Comparison</h2>
              <p className="text-slate-400 text-xs mt-0.5">Top 3 ISPs · Score out of 100</p>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={RADAR_DATA}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fontWeight: 700, fill: '#64748b' }} />
                  <Radar name="Inspire" dataKey="Inspire" stroke="#6366f1" fill="#6366f1" fillOpacity={0.15} strokeWidth={2} />
                  <Radar name="BAS" dataKey="BAS" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.1} strokeWidth={2} />
                  <Radar name="MirpurNet" dataKey="MirpurNet" stroke="#0d9488" fill="#0d9488" fillOpacity={0.1} strokeWidth={2} />
                  <Legend wrapperStyle={{ fontSize: 11, fontWeight: 700 }} />
                  <Tooltip contentStyle={{ borderRadius: 16, border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,.1)', fontSize: 11, fontWeight: 700 }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 gap-3 mt-4">
              {MOCK.slice(0, 3).map(r => (
                <div key={r.rank} className="text-center p-3 rounded-2xl border border-slate-100 bg-slate-50">
                  <div className="flex justify-center mb-2">{MEDAL[r.rank]}</div>
                  <p className="font-black text-xs">{r.isp}</p>
                  <p className="text-[10px] text-slate-400 font-bold">{r.score}/10</p>
                  <div className="mt-2 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${r.score * 10}%`, backgroundColor: r.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ISP grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {MOCK.map(r => (
            <div key={r.rank} className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-black" style={{ color: r.color }}>#{r.rank}</span>
                <HugeIconPicker name="wifi01Icon" size={16} className={r.color} />
              </div>
              <p className="font-black text-sm">{r.isp}</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase mb-2">{r.area}</p>
              <div className="flex justify-between text-xs">
                <div><p className="font-black" style={{ color: r.color }}>{r.dl}</p><p className="text-[9px] text-slate-400 font-bold">DL Mbps</p></div>
                <div className="text-right"><p className="font-black text-slate-600">{r.ul}</p><p className="text-[9px] text-slate-400 font-bold">UL Mbps</p></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
