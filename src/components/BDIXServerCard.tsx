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
  'Movies/TV': 'bg-violet-100 text-violet-700',
  'Games':     'bg-emerald-100 text-emerald-700',
  'Software':  'bg-blue-100 text-blue-700',
  'WebTV':     'bg-rose-100 text-rose-700',
  'Music':     'bg-amber-100 text-amber-700',
};

export const BDIXServerCard = ({ s, copiedId, onCopy }: BDIXServerCardProps) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-5 flex flex-col gap-3 hover:shadow-md hover:border-teal-100 transition-all">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${s.lastStatus==='online' ? 'bg-emerald-400 shadow-sm shadow-emerald-400/50' : 'bg-red-400'}`}
            style={s.lastStatus==='online' ? {animation:'pulse 2s cubic-bezier(0.4,0,0.6,1) infinite'} : {}} />
          <h3 className="font-black text-sm truncate">{s.name}</h3>
        </div>
        {s.popular && <span className="text-[9px] font-black uppercase bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full shrink-0">Popular</span>}
      </div>

      <p className="text-[11px] text-slate-500 leading-relaxed">{s.description}</p>

      <div className="flex items-center gap-2 flex-wrap">
        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-lg ${CAT_COLORS[s.category] || 'bg-slate-100 text-slate-600'}`}>
          {s.category}
        </span>
        <span className="text-[10px] text-slate-400 font-bold">⏱ {s.lastPing}ms</span>
      </div>

      <div className="bg-slate-50 rounded-xl px-3 py-2 font-mono text-[10px] text-slate-500 truncate border border-slate-100">
        {s.url}
      </div>

      <div className="flex gap-2 mt-auto">
        <button onClick={() => onCopy(s)}
          className={`flex-1 py-2 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all
            ${copiedId===s.id ? 'bg-emerald-500 text-white' : 'bg-teal-50 text-teal-700 hover:bg-teal-100'}`}>
          {copiedId===s.id ? <><HugeIconPicker name="checkIcon" size={12}/> Copied</> : <><HugeIconPicker name="copy01Icon" size={12}/> Copy URL</>}
        </button>
        {s.httpUrl && (
          <a href={s.httpUrl} target="_blank" rel="noopener noreferrer"
            className="px-3 py-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors flex items-center justify-center">
            <HugeIconPicker name="linkSquare01Icon" size={14} />
          </a>
        )}
        <button title="Report Down"
          className="px-3 py-2 rounded-xl bg-slate-100 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors">
          <HugeIconPicker name="flag01Icon" size={14} />
        </button>
      </div>
    </div>
  );
};

export default BDIXServerCard;
