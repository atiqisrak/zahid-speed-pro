import HugeIconPicker from '../components/HugeIconPicker';
import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

import { ResponsiveContainer, RadialBarChart, RadialBar, Tooltip } from 'recharts';
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

  useEffect(() => {
    fetch('/data/isp-packages.json').then(r => r.json()).then(d => {
      setIsps(d.isps);
      const exp: Record<string,boolean> = {};
      d.isps.forEach((i: ISP) => { exp[i.id] = true; });
      setExpanded(exp);
    });
  }, []);

  const toggleExpand = (id: string) => setExpanded(p => ({ ...p, [id]: !p[id] }));

  const chartData = isps.map(isp => {
    const avgPrice = isp.packages.reduce((a, b) => a + b.price, 0) / (isp.packages.length || 1);
    const avgSpeed = isp.packages.reduce((a, b) => a + b.speed, 0) / (isp.packages.length || 1);
    const valueScore = avgSpeed > 0 ? ((avgSpeed / avgPrice) * 1000).toFixed(1) : 0;
    return { name: isp.name, value: Number(valueScore), fill: isp.color };
  }).sort((a, b) => b.value - a.value).slice(0, 6);

  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const scale = useTransform(heroScroll, [0, 1], [1, 1.2]);
  const y = useTransform(heroScroll, [0, 1], [0, 200]);
  const opacity = useTransform(heroScroll, [0, 0.8], [1, 0]);

  return (
    <div className="min-h-screen font-sans selection:bg-teal-500/30 selection:text-teal-900 bg-slate-50">
      
      {/* 1. DARK HERO SECTION */}
      <section ref={heroRef} className="relative min-h-[90vh] pt-32 px-6 flex flex-col justify-center overflow-hidden bg-slate-950">
        <motion.div style={{ opacity }} className="max-w-screen-2xl mx-auto w-full z-10 text-white relative pointer-events-none text-center">
          <div className="inline-flex items-center justify-center gap-2 text-teal-400 text-xs font-black uppercase tracking-widest mb-6 bg-teal-500/10 px-4 py-2 rounded-full border border-teal-500/20 backdrop-blur-sm">
            <HugeIconPicker name="packageIcon" size={16} /> ISP Plans & Pricing
          </div>
          <h1 className="text-[14vw] md:text-[10vw] leading-[0.85] font-black tracking-tighter mb-8 uppercase drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)] text-white">
            COMPARE <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">PACKAGES</span>
          </h1>
          <p className="text-xl md:text-3xl text-slate-400 max-w-4xl mx-auto font-medium tracking-tight mb-16 drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)]">
            Find the ultimate bandwidth for your home or enterprise. Filter by Speed, Price, BDIX, and Real IP availability across Mirpur.
          </p>
        </motion.div>
        
        <motion.div style={{ scale, y }} className="absolute inset-0 z-0 overflow-hidden bg-slate-950 origin-bottom">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-slate-950/80 to-slate-950 z-10 pointer-events-none" />
          <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-30 mix-blend-screen scale-105">
            <source src="https://www.pexels.com/download/video/3129977/" type="video/mp4" />
          </video>
        </motion.div>
      </section>

      {/* 2. LIGHT FILTER & CHART SECTION */}
      <section className="relative z-20 bg-white py-24 px-6 border-b border-slate-200 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
        <div className="max-w-screen-2xl mx-auto flex flex-col xl:flex-row gap-12">
          
          {/* Filters */}
          <div className="w-full xl:w-1/3">
            <div className="sticky top-32 space-y-8">
              <h2 className="text-4xl font-black tracking-tighter uppercase text-slate-900 mb-2">Filter Network</h2>
              <p className="text-slate-500 font-bold tracking-tight mb-8">Narrow down the exact routing setup you require.</p>
              
              <div className="space-y-6">
                <div className="bg-slate-50 border border-slate-200 rounded-[2rem] p-6 shadow-sm">
                  <FilterBar label="Speed Tier" opts={SPEED_FILTERS} val={speedF} set={setSpeedF} />
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-[2rem] p-6 shadow-sm">
                  <FilterBar label="Monthly Price" opts={PRICE_FILTERS} val={priceF} set={setPriceF} />
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-[2rem] p-6 shadow-sm">
                  <FilterBar label="Features" opts={FEAT_FILTERS} val={featF} set={setFeatF} />
                </div>
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="w-full xl:w-2/3">
            <div className="bg-slate-950 text-white rounded-[3rem] p-8 md:p-16 shadow-2xl flex flex-col md:flex-row items-center gap-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-[100px] pointer-events-none" />
              
              <div className="flex-1 relative z-10">
                <h3 className="font-black text-2xl uppercase tracking-widest flex items-center gap-3 mb-4">
                  <HugeIconPicker name="activity01Icon" size={28} className="text-teal-400"/> Value Index
                </h3>
                <p className="text-slate-400 font-bold mb-8 text-sm">Speed-to-price ratio across Mirpur ISPs (Higher is better)</p>
                <div className="grid grid-cols-2 gap-4">
                  {chartData.map(d => (
                    <div key={d.name} className="bg-white/5 rounded-[1.5rem] p-5 border border-white/10">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest truncate mb-2">{d.name}</p>
                      <p className="font-black text-3xl" style={{color:d.fill}}>{d.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="w-full md:w-80 h-80 shrink-0 relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart cx="50%" cy="50%" innerRadius="30%" outerRadius="100%" barSize={16} data={chartData}>
                    <RadialBar dataKey="value" cornerRadius={12} background={{ fill: 'rgba(255,255,255,0.05)' }} />
                    <Tooltip cursor={{fill: 'transparent'}} contentStyle={{backgroundColor: '#020617', borderRadius:16, border:'1px solid rgba(255,255,255,0.1)', fontWeight:900, color: '#fff'}} itemStyle={{fontWeight: 900}} />
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. LIGHT BACKGROUND, DARK CARDS SECTION */}
      <section className="relative bg-slate-50 py-32 px-6">
        <div className="max-w-screen-xl mx-auto space-y-12 relative">
          
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-slate-900 mb-4">Available Packages</h2>
            <p className="text-slate-500 font-bold text-lg">Click on an ISP to view their filtered plans.</p>
          </div>

          {isps.map((isp, i) => {
            const visiblePkgs = isp.packages.filter(p => matchSpeed(p,speedF) && matchPrice(p,priceF) && matchFeat(p,featF));
            if (visiblePkgs.length === 0) return null;
            return (
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                key={isp.id} 
                className="bg-slate-900 text-white rounded-[3rem] border border-slate-800 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-all relative"
              >
                <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none" style={{ background: `linear-gradient(to left, ${isp.color}, transparent)` }} />
                
                <button onClick={() => toggleExpand(isp.id)} className="w-full px-8 md:px-12 py-8 flex flex-col md:flex-row items-start md:items-center gap-6 hover:bg-white/5 transition-colors group relative z-10 text-left">
                  <div className="w-20 h-20 rounded-[2rem] flex items-center justify-center text-slate-950 font-black text-3xl shrink-0 shadow-lg"
                    style={{ backgroundColor: isp.color, boxShadow: `0 0 30px ${isp.color}80` }}>
                    {isp.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-4 flex-wrap mb-3">
                      <h3 className="font-black text-3xl md:text-4xl text-white uppercase tracking-tighter">{isp.name}</h3>
                      <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
                        <HugeIconPicker name="starIcon" size={16} className="text-teal-400 fill-teal-400" />
                        <span className="text-sm font-black">{isp.rating}</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">({isp.reviews})</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest flex items-center gap-3 flex-wrap">
                      <span className="flex items-center gap-1.5"><HugeIconPicker name="callIcon" size={14} className="text-teal-400" /> {isp.phone}</span>
                      <span className="text-slate-600">|</span> 
                      <span className="flex items-center gap-1.5"><HugeIconPicker name="location01Icon" size={14} className="text-teal-400" /> {isp.areas.slice(0,3).join(', ')}{isp.areas.length>3 ? ` +${isp.areas.length-3} more`:''}</span>
                    </p>
                  </div>
                  <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 group-hover:text-white group-hover:scale-110 transition-all shrink-0">
                    {expanded[isp.id] ? <HugeIconPicker name="arrowUp01Icon" size={24} /> : <HugeIconPicker name="arrowDown01Icon" size={24} />}
                  </div>
                </button>

                {expanded[isp.id] && (
                  <div className="px-8 md:px-12 pb-12 pt-4 relative z-10 border-t border-white/5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {visiblePkgs.map(pkg => (
                        <PackageCard key={pkg.name} pkg={pkg} ispPhone={isp.phone} />
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}

          <div className="bg-teal-50 rounded-[2rem] p-8 border border-teal-100 text-sm text-teal-800 text-center font-bold tracking-wide mt-20">
            <div className="flex items-center justify-center gap-3 mb-2"><HugeIconPicker name="informationCircleIcon" size={20} className="text-teal-600" /> Prices are indicative. Contact ISPs directly for current offers and availability in your specific area.</div>
          </div>
        </div>
      </section>

    </div>
  );
}
