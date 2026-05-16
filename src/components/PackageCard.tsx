import HugeIconPicker from './HugeIconPicker';
import React from 'react';


export type ISPPackage = {
  name: string; speed: number; upload: number; price: number;
  bdix: boolean; realIp: boolean; unlimited: boolean; type: string; tags: string[];
};

interface PackageCardProps {
  pkg: ISPPackage;
  ispPhone: string;
}

const TAG_COLORS: Record<string,string> = {
  gaming: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
  streaming: 'bg-violet-500/20 text-violet-400 border border-violet-500/30',
  wfh: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
  budget: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
  popular: 'bg-teal-500/20 text-teal-400 border border-teal-500/30',
  power: 'bg-rose-500/20 text-rose-400 border border-rose-500/30',
};

const TAG_LABELS: Record<string,string> = {
  gaming:'🎮 Gaming', streaming:'📹 Streaming', wfh:'💼 WFH', budget:'💰 Budget', popular:'⚡ Popular', power:'🚀 Power',
};

export const PackageCard = ({ pkg, ispPhone }: PackageCardProps) => {
  const isPopular = pkg.tags.includes('popular');
  return (
    <div className={`rounded-2xl border p-5 flex flex-col gap-4 transition-all hover:scale-[1.02] ${isPopular ? 'border-teal-400/50 bg-teal-500/10 shadow-[0_0_30px_rgba(20,184,166,0.15)]' : 'border-white/10 bg-white/5 backdrop-blur-md'}`}>
      {isPopular && (
        <span className="text-[10px] font-black uppercase tracking-wider bg-teal-500 text-slate-950 px-2.5 py-1 rounded-full w-fit shadow-[0_0_15px_rgba(20,184,166,0.5)]">⚡ Most Popular</span>
      )}
      <div>
        <p className="font-black text-xs text-slate-400 uppercase tracking-widest">{pkg.name}</p>
        <div className="flex items-baseline gap-1 mt-1.5">
          <span className="text-3xl font-black text-white">{pkg.speed}</span>
          <span className="text-[11px] font-black uppercase tracking-widest text-slate-500">Mbps</span>
        </div>
        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mt-1 text-teal-400/80">↑ {pkg.upload} Mbps upload</p>
      </div>
      <p className="text-2xl font-black text-teal-400">৳{pkg.price}<span className="text-[11px] font-black uppercase tracking-widest text-slate-500">/mo</span></p>
      <div className="space-y-2 flex-1 pt-2 border-t border-white/5">
        {[['BDIX',pkg.bdix],['Real IP',pkg.realIp],['Unlimited',pkg.unlimited]].map(([l,v]) => (
          <div key={l as string} className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider">
            {v ? <HugeIconPicker name="checkIcon" size={14} className="text-teal-400" /> : <HugeIconPicker name="cancel01Icon" size={14} className="text-slate-600" />}
            <span className={v ? 'text-slate-200' : 'text-slate-600'}>{l as string}</span>
          </div>
        ))}
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider">
          <HugeIconPicker name="checkIcon" size={14} className="text-teal-400" />
          <span className="text-slate-200">{pkg.type} connection</span>
        </div>
      </div>
      {pkg.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {pkg.tags.filter(t=>t!=='popular').map(t => (
            <span key={t} className={`text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-lg ${TAG_COLORS[t]||'bg-white/10 text-slate-300 border border-white/10'}`}>
              {TAG_LABELS[t]||t}
            </span>
          ))}
        </div>
      )}
      <a href={`tel:${ispPhone}`}
        className="w-full py-2.5 bg-white/10 border border-white/10 rounded-xl text-xs font-black uppercase tracking-wider text-white text-center hover:bg-teal-500 hover:border-teal-500 hover:text-slate-950 transition-all flex items-center justify-center gap-2 mt-2">
        <HugeIconPicker name="callIcon" size={14} /> Contact ISP
      </a>
    </div>
  );
};

export default PackageCard;
