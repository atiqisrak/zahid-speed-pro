import { Trophy, TrendingUp, TrendingDown, Activity } from 'lucide-react';

const MOCK = [
  { rank: 1, isp: 'Inspire Broadband', dl: 94.2, ul: 47.1, ping: 5, area: 'Section 6' },
  { rank: 2, isp: 'BAS Network',       dl: 88.7, ul: 43.2, ping: 7, area: 'Section 10' },
  { rank: 3, isp: 'MirpurNet',         dl: 71.3, ul: 35.6, ping: 9, area: 'Section 11' },
  { rank: 4, isp: 'MNET',              dl: 58.4, ul: 28.9, ping: 12, area: 'Section 13' },
  { rank: 5, isp: 'Info ISP',          dl: 44.1, ul: 21.3, ping: 18, area: 'Section 12' },
  { rank: 6, isp: 'Mirpur Online',     dl: 38.6, ul: 18.7, ping: 22, area: 'Section 14' },
];

export default function Rankings() {
  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-6">
      <div>
        <h2 className="text-2xl font-black tracking-tight">ISP Rankings</h2>
        <p className="text-slate-500 text-sm mt-1">Crowdsourced from Speed Pro users in Mirpur · Updated monthly</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[{ label:'Avg Download', val:'65.9 Mbps', icon: TrendingDown, color:'text-teal-600' },
          { label:'Avg Upload',   val:'32.5 Mbps', icon: TrendingUp,   color:'text-emerald-600' },
          { label:'Avg Ping',     val:'12 ms',      icon: Activity,     color:'text-amber-500' }
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-4 border border-slate-100 text-center">
            <s.icon size={20} className={`${s.color} mx-auto mb-1`} />
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{s.label}</p>
            <p className="text-lg font-black">{s.val}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
          <Trophy size={16} className="text-amber-500" />
          <span className="font-black text-sm uppercase tracking-wider">Mirpur ISP Leaderboard</span>
        </div>
        <div className="divide-y divide-slate-50">
          {MOCK.map(r => (
            <div key={r.rank} className="flex items-center px-6 py-4 gap-4 hover:bg-slate-50 transition-colors">
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0
                ${r.rank === 1 ? 'bg-amber-400 text-white' : r.rank === 2 ? 'bg-slate-300 text-white' : r.rank === 3 ? 'bg-orange-400 text-white' : 'bg-slate-100 text-slate-500'}`}>
                {r.rank}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm truncate">{r.isp}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase">{r.area}</p>
              </div>
              <div className="text-right shrink-0 space-y-0.5">
                <p className="text-sm font-black text-teal-600">{r.dl} <span className="text-[10px] text-slate-400 font-bold">DL</span></p>
                <p className="text-xs text-slate-400 font-bold">{r.ping}ms ping</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <p className="text-center text-xs text-slate-400">Run a speed test to contribute your data to the rankings.</p>
    </div>
  );
}
