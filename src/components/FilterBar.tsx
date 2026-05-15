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
          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all
            ${val===o ? 'bg-teal-600 text-white border-teal-600' : 'border-slate-200 text-slate-600 hover:border-teal-300 bg-white'}`}>
          {o}
        </button>
      ))}
    </div>
  </div>
);

export default FilterBar;
