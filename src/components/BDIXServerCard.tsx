import HugeIconPicker from './HugeIconPicker';
import React from 'react';

export type Server = {
  id: number; name: string; provider: string; url: string;
  httpUrl: string | null; category: string; description: string;
  isps: string; lastStatus: string; lastPing: number; popular: boolean;
};

interface BDIXServerCardProps {
  s: Server;
  copiedId: number | null;
  onCopy: (s: Server) => void;
}

const CAT_COLORS: Record<string,string> = {
  'Movies/TV': 'bg-violet-500/20 text-violet-400 border border-violet-500/30',
  'Games':     'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
  'Software':  'bg-blue-500/20 text-blue-400 border border-blue-500/30',
  'WebTV':     'bg-rose-500/20 text-rose-400 border border-rose-500/30',
  'Music':     'bg-amber-500/20 text-amber-400 border border-amber-500/30',
};

export const BDIXServerCard = ({ s, copiedId, onCopy }: BDIXServerCardProps) => {
  return (
    <div className="bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 p-5 flex flex-col gap-3 hover:shadow-2xl hover:border-teal-500/50 hover:bg-white/10 transition-all group">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <span className={`w-3 h-3 rounded-full shrink-0 ${s.lastStatus==='online' ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]' : 'bg-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.8)]'}`}
            style={s.lastStatus==='online' ? {animation:'pulse 2s cubic-bezier(0.4,0,0.6,1) infinite'} : {}} />
          <h3 className="font-black text-sm text-white uppercase tracking-wider truncate group-hover:text-teal-400 transition-colors">{s.name}</h3>
        </div>
        {s.popular && <span className="text-[9px] font-black uppercase tracking-widest bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-lg shrink-0">Popular</span>}
      </div>

      <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">{s.description}</p>

      <div className="flex items-center gap-2 flex-wrap">
        <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${CAT_COLORS[s.category] || 'bg-white/5 text-slate-400 border border-white/10'}`}>
          {s.category}
        </span>
        <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest ml-auto">⏱ {s.lastPing}ms</span>
      </div>

      <div className="bg-slate-900/50 rounded-xl px-3 py-2.5 font-mono text-[10px] font-bold text-slate-400 truncate border border-white/5 shadow-inner">
        {s.url}
      </div>

      <div className="flex gap-2 mt-auto pt-2">
        <button onClick={() => onCopy(s)}
          className={`flex-1 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all border
            ${copiedId===s.id ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-teal-500/10 text-teal-400 border-teal-500/20 hover:bg-teal-500 hover:text-slate-950 hover:border-teal-500'}`}>
          {copiedId===s.id ? <><HugeIconPicker name="checkIcon" size={14}/> Copied</> : <><HugeIconPicker name="copy01Icon" size={14}/> Copy URL</>}
        </button>
        {s.httpUrl && (
          <a href={s.httpUrl} target="_blank" rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white transition-colors flex items-center justify-center">
            <HugeIconPicker name="linkSquare01Icon" size={14} />
          </a>
        )}
        <button title="Report Down"
          className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:bg-rose-500/20 hover:border-rose-500/30 hover:text-rose-400 transition-colors">
          <HugeIconPicker name="flag01Icon" size={14} />
        </button>
      </div>
    </div>
  );
};

export default BDIXServerCard;
