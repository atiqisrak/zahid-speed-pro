import { useState, useEffect } from 'react';
import { Package, Phone, Globe, Star, Check, X, ChevronDown, ChevronUp, SlidersHorizontal } from 'lucide-react';

type ISPPackage = {
  name: string; speed: number; upload: number; price: number;
  bdix: boolean; realIp: boolean; unlimited: boolean; type: string; tags: string[];
};
type ISP = {
  id: string; name: string; color: string; phone: string; website: string;
  areas: string[]; rating: number; reviews: number; tags: string[]; packages: ISPPackage[];
};

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

const SPEED_FILTERS = ['All','≤25 Mbps','50 Mbps','100 Mbps','150+ Mbps'];
const PRICE_FILTERS = ['All','Under ৳600','৳600–১000','৳১000+'];
const FEAT_FILTERS  = ['All','BDIX','Real IP','Fiber','Gaming'];

function matchSpeed(p: ISPPackage, f: string) {
  if (f==='All') return true;
  if (f==='≤25 Mbps') return p.speed <= 25;
  if (f==='50 Mbps')  return p.speed >= 40 && p.speed <= 60;
  if (f==='100 Mbps') return p.speed >= 80 && p.speed <= 120;
  if (f==='150+ Mbps') return p.speed >= 150;
  return true;
}
function matchPrice(p: ISPPackage, f: string) {
  if (f==='All') return true;
  if (f==='Under ৳600') return p.price < 600;
  if (f==='৳600–১000') return p.price >= 600 && p.price <= 1000;
  if (f==='৳১000+') return p.price > 1000;
  return true;
}
function matchFeat(p: ISPPackage, f: string) {
  if (f==='All') return true;
  if (f==='BDIX') return p.bdix;
  if (f==='Real IP') return p.realIp;
  if (f==='Fiber') return p.type === 'fiber';
  if (f==='Gaming') return p.tags.includes('gaming');
  return true;
}

export default function Packages() {
  const [isps, setIsps] = useState<ISP[]>([]);
  const [speedF, setSpeedF]  = useState('All');
  const [priceF, setPriceF]  = useState('All');
  const [featF, setFeatF]    = useState('All');
  const [expanded, setExpanded] = useState<Record<string,boolean>>({});
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetch('/data/isp-packages.json').then(r => r.json()).then(d => {
      setIsps(d.isps);
      const exp: Record<string,boolean> = {};
      d.isps.forEach((i: ISP) => { exp[i.id] = true; });
      setExpanded(exp);
    });
  }, []);

  const toggleExpand = (id: string) => setExpanded(p => ({ ...p, [id]: !p[id] }));

  const FilterBar = ({ label, opts, val, set }: { label:string; opts:string[]; val:string; set:(v:string)=>void }) => (
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

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
            <Package size={22} className="text-teal-600" /> ISP Packages
          </h2>
          <p className="text-slate-500 text-sm mt-1">Compare internet plans from ISPs in Mirpur, Dhaka · Updated May 2026</p>
        </div>
        <button onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold hover:border-teal-300 transition-colors">
          <SlidersHorizontal size={14} /> Filters
        </button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white rounded-3xl border border-slate-100 p-5 space-y-4">
          <FilterBar label="Speed Tier" opts={SPEED_FILTERS} val={speedF} set={setSpeedF} />
          <FilterBar label="Monthly Price" opts={PRICE_FILTERS} val={priceF} set={setPriceF} />
          <FilterBar label="Features" opts={FEAT_FILTERS} val={featF} set={setFeatF} />
        </div>
      )}

      {/* ISP sections */}
      <div className="space-y-4">
        {isps.map(isp => {
          const visiblePkgs = isp.packages.filter(p => matchSpeed(p,speedF) && matchPrice(p,priceF) && matchFeat(p,featF));
          if (visiblePkgs.length === 0) return null;
          return (
            <div key={isp.id} className="bg-white rounded-3xl border border-slate-100 overflow-hidden">
              {/* ISP header */}
              <button onClick={() => toggleExpand(isp.id)} className="w-full px-6 py-4 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-black text-sm shrink-0"
                  style={{ backgroundColor: isp.color }}>
                  {isp.name.charAt(0)}
                </div>
                <div className="flex-1 text-left min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-black text-sm">{isp.name}</h3>
                    <div className="flex items-center gap-0.5 text-amber-500">
                      <Star size={11} className="fill-amber-400" />
                      <span className="text-[10px] font-black text-slate-600">{isp.rating}</span>
                      <span className="text-[10px] text-slate-400 font-medium">({isp.reviews})</span>
                    </div>
                    <div className="flex gap-1">
                      {isp.tags.slice(0,2).map(t => (
                        <span key={t} className="text-[9px] font-black uppercase px-1.5 py-0.5 bg-teal-50 text-teal-600 rounded-lg">{t}</span>
                      ))}
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold mt-0.5">
                    📞 {isp.phone} · 🗺️ {isp.areas.slice(0,3).join(', ')}{isp.areas.length>3 ? ` +${isp.areas.length-3} more`:''}
                  </p>
                </div>
                {expanded[isp.id] ? <ChevronUp size={16} className="text-slate-400 shrink-0" /> : <ChevronDown size={16} className="text-slate-400 shrink-0" />}
              </button>

              {/* Packages */}
              {expanded[isp.id] && (
                <div className="px-4 pb-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {visiblePkgs.map(pkg => (
                    <div key={pkg.name} className={`rounded-2xl border p-4 flex flex-col gap-3 ${pkg.tags.includes('popular') ? 'border-teal-300 bg-teal-50' : 'border-slate-100 bg-slate-50'}`}>
                      {pkg.tags.includes('popular') && (
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
                            {v ? <Check size={11} className="text-emerald-500" /> : <X size={11} className="text-slate-300" />}
                            <span className={v ? 'text-slate-700' : 'text-slate-300'}>{l as string}</span>
                          </div>
                        ))}
                        <div className="flex items-center gap-1.5 text-[10px] font-bold">
                          <Check size={11} className="text-emerald-500" />
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
                      <a href={`tel:${isp.phone}`}
                        className="w-full py-2 bg-white border border-slate-200 rounded-xl text-xs font-black text-center hover:bg-teal-50 hover:border-teal-300 hover:text-teal-700 transition-all flex items-center justify-center gap-1.5">
                        <Phone size={11} /> Contact ISP
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="bg-slate-50 rounded-2xl p-4 text-xs text-slate-500 text-center">
        📋 Prices are indicative. Contact ISPs directly for current offers and availability in your specific area. <br/>
        <button className="text-teal-600 font-bold hover:underline mt-1">Submit your ISP's package →</button>
      </div>
    </div>
  );
}
