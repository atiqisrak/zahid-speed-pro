import React from 'react';

interface FilterBarProps {
  label: string;
  opts: string[];
  val: string;
  set: (v: string) => void;
}

export const FilterBar = ({ label, opts, val, set }: FilterBarProps) => (
  <div>
    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">{label}</p>
    <div className="flex flex-wrap gap-1.5">
      {opts.map(o => (
        <button key={o} onClick={() => set(o)}
          className={`px-3 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-wider border transition-all
            ${val===o ? 'bg-teal-500 text-slate-950 border-teal-500 shadow-[0_0_15px_rgba(20,184,166,0.4)]' : 'bg-white/5 border-white/10 text-slate-300 hover:border-teal-400/50 hover:bg-white/10 hover:text-white'}`}>
          {o}
        </button>
      ))}
    </div>
  </div>
);

export default FilterBar;
