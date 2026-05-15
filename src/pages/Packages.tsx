import HugeIconPicker from '../components/HugeIconPicker';
import { useState, useEffect } from 'react';

import { ResponsiveContainer, RadialBarChart, RadialBar, Legend, Tooltip } from 'recharts';
import PackageCard, { ISPPackage } from '../components/PackageCard';
import FilterBar from '../components/FilterBar';

type ISP = {
  id: string; name: string; color: string; phone: string; website: string;
  areas: string[]; rating: number; reviews: number; tags: string[]; packages: ISPPackage[];
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

  // Generate chart data based on visible ISPs
  const chartData = isps.map(isp => {
    // Value score calculation (simplified for mock data)
    const avgPrice = isp.packages.reduce((a, b) => a + b.price, 0) / (isp.packages.length || 1);
    const avgSpeed = isp.packages.reduce((a, b) => a + b.speed, 0) / (isp.packages.length || 1);
    const valueScore = avgSpeed > 0 ? ((avgSpeed / avgPrice) * 1000).toFixed(1) : 0;
    
    return {
      name: isp.name,
      value: Number(valueScore),
      fill: isp.color
    };
  }).sort((a, b) => b.value - a.value).slice(0, 6);

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
            <HugeIconPicker name="packageIcon" size={22} className="text-teal-600" /> ISP Packages
          </h2>
          <p className="text-slate-500 text-sm mt-1">Compare internet plans from ISPs in Mirpur, Dhaka · Updated May 2026</p>
        </div>
        <button onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold hover:border-teal-300 transition-colors">
          <HugeIconPicker name="filterIcon" size={14} /> Filters
        </button>
      </div>

      {/* Value Score Chart */}
      {isps.length > 0 && !showFilters && (
        <div className="bg-white rounded-3xl border border-slate-100 p-6 flex flex-col md:flex-row items-center gap-6 shadow-sm">
          <div className="flex-1">
            <h3 className="font-black text-sm uppercase tracking-wider flex items-center gap-2">
              <HugeIconPicker name="activity01Icon" size={16} className="text-teal-600"/> Value Score Index
            </h3>
            <p className="text-slate-400 text-xs mt-1 mb-4">Speed-to-price ratio across Mirpur ISPs (Higher is better)</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {chartData.map(d => (
                <div key={d.name} className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-500 uppercase truncate">{d.name}</p>
                  <p className="font-black text-lg" style={{color:d.fill}}>{d.value}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="w-full md:w-64 h-56 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="100%" barSize={10} data={chartData}>
                <RadialBar background dataKey="value" cornerRadius={10} />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius:12,border:'none',boxShadow:'0 10px 40px rgba(0,0,0,.1)',fontSize:11,fontWeight:700}}/>
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

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
                      <HugeIconPicker name="starIcon" size={11} className="fill-amber-400" />
                      <span className="text-[10px] font-black text-slate-600">{isp.rating}</span>
                      <span className="text-[10px] text-slate-400 font-medium">({isp.reviews})</span>
                    </div>
                    <div className="flex gap-1">
                      {isp.tags.slice(0,2).map(t => (
                        <span key={t} className="text-[9px] font-black uppercase px-1.5 py-0.5 bg-teal-50 text-teal-600 rounded-lg">{t}</span>
                      ))}
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold mt-0.5 flex items-center gap-1">
                    <HugeIconPicker name="callIcon" size={10} /> {isp.phone} <span className="mx-1">·</span> <HugeIconPicker name="location01Icon" size={10} /> {isp.areas.slice(0,3).join(', ')}{isp.areas.length>3 ? ` +${isp.areas.length-3} more`:''}
                  </p>
                </div>
                {expanded[isp.id] ? <HugeIconPicker name="arrowUp01Icon" size={16} className="text-slate-400 shrink-0" /> : <HugeIconPicker name="arrowDown01Icon" size={16} className="text-slate-400 shrink-0" />}
              </button>

              {/* Packages */}
              {expanded[isp.id] && (
                <div className="px-4 pb-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {visiblePkgs.map(pkg => (
                    <PackageCard key={pkg.name} pkg={pkg} ispPhone={isp.phone} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="bg-slate-50 rounded-2xl p-4 text-xs text-slate-500 text-center">
        <div className="flex items-center justify-center gap-1 mb-1"><HugeIconPicker name="informationCircleIcon" size={14} /> Prices are indicative. Contact ISPs directly for current offers and availability in your specific area.</div>
        <button className="text-teal-600 font-bold hover:underline mt-1">Submit your ISP's package →</button>
      </div>
    </div>
  );
}
