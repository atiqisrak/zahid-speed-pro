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
  gaming: 'bg-emerald-100 text-emerald-700',
  streaming: 'bg-violet-100 text-violet-700',
  wfh: 'bg-blue-100 text-blue-700',
  budget: 'bg-amber-100 text-amber-700',
  popular: 'bg-teal-100 text-teal-700',
  power: 'bg-red-100 text-red-700',
};

const TAG_LABELS: Record<string,string> = {
  gaming:'🎮 Gaming', streaming:'📹 Streaming', wfh:'💼 WFH', budget:'💰 Budget', popular:'⚡ Popular', power:'🚀 Power',
};

export const PackageCard = ({ pkg, ispPhone }: PackageCardProps) => {
  const isPopular = pkg.tags.includes('popular');
  return (
    <div className={`rounded-2xl border p-4 flex flex-col gap-3 ${isPopular ? 'border-teal-300 bg-teal-50' : 'border-slate-100 bg-slate-50'}`}>
      {isPopular && (
        <span className="text-[9px] font-black uppercase bg-teal-600 text-white px-2 py-0.5 rounded-full w-fit">⚡ Most Popular</span>
      )}
      <div>
        <p className="font-black text-xs text-slate-500 uppercase tracking-wider">{pkg.name}</p>
        <div className="flex items-baseline gap-1 mt-1">
          <span className="text-2xl font-black">{pkg.speed}</span>
          <span className="text-xs font-bold text-slate-400">Mbps</span>
        </div>
        <p className="text-xs text-slate-400 font-medium">↑ {pkg.upload} Mbps upload</p>
      </div>
      <p className="text-xl font-black text-teal-700">৳{pkg.price}<span className="text-xs font-bold text-slate-400">/mo</span></p>
      <div className="space-y-1 flex-1">
        {[['BDIX',pkg.bdix],['Real IP',pkg.realIp],['Unlimited',pkg.unlimited]].map(([l,v]) => (
          <div key={l as string} className="flex items-center gap-1.5 text-[10px] font-bold">
            {v ? <HugeIconPicker name="checkIcon" size={11} className="text-emerald-500" /> : <HugeIconPicker name="cancel01Icon" size={11} className="text-slate-300" />}
            <span className={v ? 'text-slate-700' : 'text-slate-300'}>{l as string}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5 text-[10px] font-bold">
          <HugeIconPicker name="checkIcon" size={11} className="text-emerald-500" />
          <span className="text-slate-700 capitalize">{pkg.type} connection</span>
        </div>
      </div>
      {pkg.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {pkg.tags.filter(t=>t!=='popular').map(t => (
            <span key={t} className={`text-[9px] font-black px-1.5 py-0.5 rounded-lg ${TAG_COLORS[t]||'bg-slate-100 text-slate-500'}`}>
              {TAG_LABELS[t]||t}
            </span>
          ))}
        </div>
      )}
      <a href={`tel:${ispPhone}`}
        className="w-full py-2 bg-white border border-slate-200 rounded-xl text-xs font-black text-center hover:bg-teal-50 hover:border-teal-300 hover:text-teal-700 transition-all flex items-center justify-center gap-1.5">
        <HugeIconPicker name="callIcon" size={11} /> Contact ISP
      </a>
    </div>
  );
};

export default PackageCard;
