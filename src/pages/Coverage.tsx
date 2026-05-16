import HugeIconPicker from '../components/HugeIconPicker';
import { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const SECTIONS = [
  { id:'sec1',  label:'Section 1',  x:28, y:20, isps:['MirpurNet','MNET','Mirpur Online'],       coverage:3 },
  { id:'sec2',  label:'Section 2',  x:55, y:15, isps:['MirpurNet','BAS Network'],                coverage:2 },
  { id:'sec6',  label:'Section 6',  x:72, y:30, isps:['MirpurNet','BAS Network','Inspire'],      coverage:3 },
  { id:'sec7',  label:'Section 7',  x:80, y:48, isps:['MNET','Info ISP'],                        coverage:2 },
  { id:'sec10', label:'Section 10', x:55, y:45, isps:['All ISPs'],                               coverage:6 },
  { id:'sec11', label:'Section 11', x:35, y:55, isps:['All ISPs'],                               coverage:6 },
  { id:'sec12', label:'Section 12', x:60, y:65, isps:['BAS Network','Info ISP','Inspire'],       coverage:3 },
  { id:'sec13', label:'Section 13', x:20, y:65, isps:['MNET','Mirpur Online'],                   coverage:2 },
  { id:'sec14', label:'Section 14', x:10, y:50, isps:['MNET','Mirpur Online'],                   coverage:2 },
  { id:'pallabi',label:'Pallabi',   x:15, y:35, isps:['MNET','Info ISP'],                        coverage:2 },
  { id:'kazi',  label:'Kazipara',  x:45, y:75, isps:['BAS Network','Inspire'],                   coverage:2 },
  { id:'dohs',  label:'DOHS',      x:72, y:70, isps:['MirpurNet','Inspire'],                     coverage:2 },
];

const ALL_ISPS = ['MirpurNet','MNET','BAS Network','Info ISP','Mirpur Online','Inspire Broadband'];
const ISP_COLORS: Record<string,string> = {
  'MirpurNet':'#818cf8','MNET':'#22d3ee','BAS Network':'#34d399',
  'Info ISP':'#a78bfa','Mirpur Online':'#fb7185','Inspire Broadband':'#fbbf24',
};

const MARKET_SHARE = [
  { name:'MirpurNet', value:28, color:'#818cf8' },
  { name:'MNET',      value:24, color:'#22d3ee' },
  { name:'BAS Net',   value:17, color:'#34d399' },
  { name:'Info ISP',  value:14, color:'#a78bfa' },
  { name:'Mirpur OL', value:11, color:'#fb7185' },
  { name:'Inspire',   value:6,  color:'#fbbf24' },
];

export default function Coverage() {
  const [selected, setSelected] = useState<string|null>(null);
  const [filterIsp, setFilterIsp] = useState('All');
  const [view, setView] = useState<'map'|'chart'>('map');

  const active = SECTIONS.find(s => s.id === selected);
  const visible = SECTIONS.filter(s =>
    filterIsp === 'All' || s.isps.some(i => i.includes(filterIsp.split(' ')[0])) || s.isps.includes('All ISPs')
  );

  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const scale = useTransform(heroScroll, [0, 1], [1, 1.2]);
  const y = useTransform(heroScroll, [0, 1], [0, 200]);
  const opacity = useTransform(heroScroll, [0, 0.8], [1, 0]);

  return (
    <div className="min-h-screen font-sans selection:bg-teal-500/30 selection:text-teal-900 bg-slate-50">
      
      {/* 1. DARK HERO SECTION */}
      <section ref={heroRef} className="relative min-h-[85vh] pt-32 px-6 flex flex-col justify-center overflow-hidden bg-slate-950">
        <motion.div style={{ opacity }} className="max-w-screen-2xl mx-auto w-full z-10 text-white relative pointer-events-none text-center">
          <div className="inline-flex items-center justify-center gap-2 text-teal-400 text-xs font-black uppercase tracking-widest mb-6 bg-teal-500/10 px-4 py-2 rounded-full border border-teal-500/20 backdrop-blur-sm">
            <HugeIconPicker name="location01Icon" size={16} /> Coverage Map
          </div>
          <h1 className="text-[14vw] md:text-[10vw] leading-[0.85] font-black tracking-tighter mb-8 uppercase drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)] text-white">
            NETWORK <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-indigo-400">COVERAGE</span>
          </h1>
          <p className="text-xl md:text-3xl text-slate-400 max-w-4xl mx-auto font-medium tracking-tight mb-16 drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)]">
            Interactive map showing broadband coverage by section. Community-sourced data for Mirpur & surrounding areas.
          </p>
        </motion.div>
        
        <motion.div style={{ scale, y }} className="absolute inset-0 z-0 overflow-hidden bg-slate-950 origin-bottom">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-slate-950/80 to-slate-950 z-10 pointer-events-none" />
          <img 
            src="https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=2000&q=80" 
            alt="Map network" 
            className="w-full h-full object-cover opacity-20 mix-blend-luminosity scale-105"
          />
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[150px] z-10" />
          <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[120px] z-10" />
        </motion.div>
      </section>

      {/* 2. LIGHT FILTER/TOGGLE SECTION */}
      <section className="relative z-20 bg-white py-12 px-6 border-b border-slate-200 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
        <div className="max-w-screen-xl mx-auto flex flex-col sm:flex-row gap-6 items-center justify-between">
          <div className="flex gap-3 w-full sm:w-auto bg-slate-100 p-2 rounded-[1.5rem] border border-slate-200">
            <button onClick={()=>setView('map')}
              className={`flex-1 sm:flex-none px-8 py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 border shadow-sm ${view==='map'?'bg-white text-teal-600 border-slate-200 shadow-md':'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-200/50'}`}>
              <HugeIconPicker name="location01Icon" size={18}/> Map View
            </button>
            <button onClick={()=>setView('chart')}
              className={`flex-1 sm:flex-none px-8 py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 border shadow-sm ${view==='chart'?'bg-white text-teal-600 border-slate-200 shadow-md':'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-200/50'}`}>
              <HugeIconPicker name="pieChartIcon" size={18}/> Market Share
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-center">
            {['All',...ALL_ISPS].map(isp=>(
              <button key={isp} onClick={()=>setFilterIsp(isp)}
                className={`px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                  filterIsp===isp?'text-white border-transparent shadow-md':'bg-white border-slate-200 text-slate-500 hover:border-teal-500/50 hover:text-slate-900'
                }`}
                style={filterIsp===isp?{backgroundColor: ISP_COLORS[isp]||'#0f172a'}:{}}
              >{isp==='All'?'All ISPs':isp}</button>
            ))}
          </div>
        </div>
      </section>

      {/* 3. LIGHT CONTENT SECTION */}
      <section className="relative bg-slate-50 py-24 px-6 pb-40">
        <div className="max-w-screen-xl mx-auto space-y-12">
          
          {view==='map' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* SVG Map (Dark element on light background) */}
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="lg:col-span-2 bg-slate-950 rounded-[3rem] p-8 shadow-2xl relative overflow-hidden border border-slate-800">
                <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-[80px] pointer-events-none mix-blend-screen" />
                <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2"><HugeIconPicker name="cursorPointer02Icon" size={16} className="text-teal-400"/> Mirpur — Click a section to explore</p>
                <svg viewBox="0 0 100 100" className="w-full h-96 drop-shadow-[0_0_30px_rgba(0,0,0,0.8)]">
                  <defs>
                    <radialGradient id="mapbg" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#1e293b" stopOpacity={0.8}/>
                      <stop offset="100%" stopColor="#020617" stopOpacity={0.9}/>
                    </radialGradient>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="1.5" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>
                  <ellipse cx="45" cy="50" rx="42" ry="44" fill="url(#mapbg)" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5"/>
                  {SECTIONS.map(s=>{
                    const isVis = filterIsp==='All'||s.isps.some(i=>i.includes(filterIsp.split(' ')[0]))||s.isps.includes('All ISPs');
                    const isSel = selected===s.id;
                    const dotColor = s.coverage>=5?'#818cf8':s.coverage>=3?'#2dd4bf':'#94a3b8';
                    return (
                      <g key={s.id} onClick={()=>setSelected(s.id===selected?null:s.id)} style={{cursor:'pointer'}} opacity={isVis?1:0.15} className="transition-all duration-300 hover:opacity-100">
                        {isSel&&<circle cx={s.x} cy={s.y} r={10} fill={dotColor} opacity="0.2" filter="url(#glow)"/>}
                        <circle cx={s.x} cy={s.y} r={isSel?5:3.5} fill={dotColor} stroke="#020617" strokeWidth={isSel?1.5:1} filter={isSel?"url(#glow)":""}/>
                        <text x={s.x} y={s.y+8} textAnchor="middle" fontSize="3.5" fill="#f8fafc" fontWeight="900" style={{textTransform:'uppercase', letterSpacing:'0.05em', textShadow:'0 2px 4px rgba(0,0,0,0.9)'}}>
                          {s.label.replace('Section ','')}
                        </text>
                      </g>
                    );
                  })}
                </svg>
                <div className="flex gap-6 mt-8 flex-wrap justify-center border-t border-white/10 pt-6">
                  {[{c:'#818cf8',l:'6 ISPs (Best)'},{c:'#2dd4bf',l:'3+ ISPs'},{c:'#94a3b8',l:'1–2 ISPs'}].map(d=>(
                    <div key={d.l} className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-slate-400">
                      <div className="w-3 h-3 rounded-full shadow-[0_0_10px_currentColor]" style={{backgroundColor:d.c, color:d.c}}/>
                      {d.l}
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Detail + list (Light background) */}
              <div className="space-y-8">
                {active?(
                  <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-xl space-y-8">
                    <div className="flex items-center gap-5">
                      <div className="w-16 h-16 bg-teal-50 border border-teal-100 rounded-2xl flex items-center justify-center shadow-inner">
                        <HugeIconPicker name="location01Icon" size={28} className="text-teal-500 drop-shadow-sm"/>
                      </div>
                      <div>
                        <h3 className="font-black text-2xl text-slate-900 uppercase tracking-tighter">{active.label}</h3>
                        <p className="text-xs text-teal-600 font-black uppercase tracking-widest mt-1">{active.coverage} ISPs available</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      {ALL_ISPS.map(isp=>{
                        const covered=active.isps.includes(isp)||active.isps.includes('All ISPs');
                        return (
                          <div key={isp} className={`flex items-center gap-4 p-4 rounded-xl transition-colors border ${covered?'bg-slate-50 border-slate-200 shadow-sm':'bg-white border-transparent opacity-50 grayscale'}`}>
                            {covered
                              ?<HugeIconPicker name="tickCircleIcon" size={20} className="text-teal-500 shrink-0"/>
                              :<HugeIconPicker name="circleIcon" size={20} className="text-slate-300 shrink-0"/>}
                            <span className={`text-xs font-black uppercase tracking-wider ${covered?'text-slate-900':'text-slate-500'}`}>{isp}</span>
                            {covered&&<div className="ml-auto w-3 h-3 rounded-full shadow-sm" style={{backgroundColor:ISP_COLORS[isp]||'#2dd4bf'}}/>}
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                ):(
                  <div className="bg-white rounded-[2.5rem] border border-slate-200 p-10 text-center shadow-xl h-[400px] flex flex-col items-center justify-center">
                    <HugeIconPicker name="location01Icon" size={64} className="text-slate-300 mx-auto mb-6"/>
                    <p className="text-xs font-black uppercase tracking-widest text-slate-500 leading-relaxed max-w-[200px]">Click a section on the map to see which ISPs cover that area</p>
                  </div>
                )}

                <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-xl">
                  <div className="px-8 py-5 border-b border-slate-100 flex items-center gap-3 bg-slate-50">
                    <HugeIconPicker name="userMultipleIcon" size={18} className="text-slate-500"/>
                    <p className="text-[11px] font-black uppercase tracking-widest text-slate-600">All Sections Directory</p>
                  </div>
                  <div className="divide-y divide-slate-100 max-h-[350px] overflow-y-auto">
                    {visible.map(s=>(
                      <button key={s.id} onClick={()=>setSelected(s.id===selected?null:s.id)}
                        className={`w-full px-8 py-5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors ${selected===s.id?'bg-teal-50 border-l-4 border-teal-500':'border-l-4 border-transparent'}`}>
                        <span className="text-xs font-black text-slate-900 uppercase tracking-wider">{s.label}</span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-teal-600 bg-white shadow-sm px-3 py-1.5 rounded-lg border border-teal-100">{s.coverage} ISPs</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {view==='chart' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Pie chart */}
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-slate-950 text-white rounded-[3rem] border border-slate-800 p-10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-[80px] pointer-events-none mix-blend-screen" />
                <h2 className="font-black text-2xl uppercase tracking-wider mb-2">Market Share in Mirpur</h2>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-10">% of speed test users per ISP · May 2026</p>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={MARKET_SHARE} cx="50%" cy="50%" innerRadius={90} outerRadius={140} stroke="rgba(255,255,255,0.05)" strokeWidth={2}
                        paddingAngle={5} dataKey="value" label={({name,value})=>`${value}%`} labelLine={false}>
                        {MARKET_SHARE.map((entry,i)=><Cell key={i} fill={entry.color}/>)}
                      </Pie>
                      <Tooltip formatter={(v)=>`${v}%`} contentStyle={{backgroundColor: '#020617', borderRadius:16, border:'1px solid rgba(255,255,255,0.1)', boxShadow:'0 20px 40px rgba(0,0,0,0.5)', fontSize:12, fontWeight:900, color: '#fff'}} itemStyle={{fontWeight: 900}} />
                      <Legend wrapperStyle={{fontSize:12,fontWeight:900, textTransform:'uppercase', color:'#fff'}}/>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* ISP coverage bars */}
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="bg-white rounded-[3rem] border border-slate-200 p-10 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-50 rounded-full blur-[80px] pointer-events-none" />
                <h2 className="font-black text-2xl uppercase tracking-wider mb-2 text-slate-900">Coverage footprint by ISP</h2>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-10">Sections covered out of 12 total</p>
                <div className="space-y-8 relative z-10">
                  {[
                    {isp:'MirpurNet',sections:7,color:'#818cf8'},
                    {isp:'MNET',sections:7,color:'#22d3ee'},
                    {isp:'BAS Network',sections:6,color:'#34d399'},
                    {isp:'Info ISP',sections:6,color:'#a78bfa'},
                    {isp:'Mirpur Online',sections:6,color:'#fb7185'},
                    {isp:'Inspire Broadband',sections:6,color:'#fbbf24'},
                  ].map(d=>(
                    <div key={d.isp}>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-black text-slate-900 uppercase tracking-wider">{d.isp}</span>
                        <span className="text-[10px] font-black uppercase tracking-widest" style={{color:d.color}}>{d.sections}/12 sections</span>
                      </div>
                      <div className="h-4 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                        <div className="h-full rounded-full transition-all shadow-sm" style={{width:`${(d.sections/12)*100}%`,backgroundColor:d.color}}/>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          )}

        </div>
      </section>

      {/* 4. DARK FOOTER CTA */}
      <section className="bg-slate-950 py-24 px-6 border-t border-slate-800">
        <div className="max-w-screen-xl mx-auto">
          <div className="bg-teal-900/20 border border-teal-500/30 rounded-[3rem] p-10 md:p-16 flex flex-col sm:flex-row sm:items-center gap-10 shadow-[0_0_50px_rgba(20,184,166,0.1)]">
            <div className="w-24 h-24 bg-teal-500/10 border border-teal-500/30 rounded-[2rem] flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(20,184,166,0.2)]">
              <HugeIconPicker name="location01Icon" size={48} className="text-teal-400 drop-shadow-[0_0_15px_rgba(45,212,191,0.5)]"/>
            </div>
            <div className="flex-1">
              <h3 className="font-black text-3xl uppercase tracking-tighter text-white drop-shadow-md mb-2">Help Improve Our Maps</h3>
              <p className="text-teal-400 text-sm font-black uppercase tracking-widest leading-relaxed drop-shadow-[0_0_8px_currentColor]">
                Coverage data is community-sourced and updated monthly. Submit your area's information to help others.
              </p>
            </div>
            <button className="shrink-0 bg-teal-500 text-slate-950 text-sm font-black uppercase tracking-widest px-10 py-5 rounded-2xl hover:bg-teal-400 transition-all shadow-[0_0_20px_rgba(20,184,166,0.4)] hover:-translate-y-1">
              Submit Area →
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
