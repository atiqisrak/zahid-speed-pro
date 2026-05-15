import HugeIconPicker from '../components/HugeIconPicker';
import { useState } from 'react';

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
  'MirpurNet':'#6366f1','MNET':'#0891b2','BAS Network':'#059669',
  'Info ISP':'#7c3aed','Mirpur Online':'#dc2626','Inspire Broadband':'#f59e0b',
};

const MARKET_SHARE = [
  { name:'MirpurNet', value:28, color:'#6366f1' },
  { name:'MNET',      value:24, color:'#0891b2' },
  { name:'BAS Net',   value:17, color:'#059669' },
  { name:'Info ISP',  value:14, color:'#7c3aed' },
  { name:'Mirpur OL', value:11, color:'#dc2626' },
  { name:'Inspire',   value:6,  color:'#f59e0b' },
];

export default function Coverage() {
  const [selected, setSelected] = useState<string|null>(null);
  const [filterIsp, setFilterIsp] = useState('All');
  const [view, setView] = useState<'map'|'chart'>('map');

  const active = SECTIONS.find(s => s.id === selected);
  const visible = SECTIONS.filter(s =>
    filterIsp === 'All' || s.isps.some(i => i.includes(filterIsp.split(' ')[0])) || s.isps.includes('All ISPs')
  );

  return (
    <div className="min-h-full bg-slate-50 font-sans">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-teal-700 via-teal-600 to-cyan-600 text-white">
        <div className="absolute inset-0 opacity-10"
          style={{backgroundImage:'radial-gradient(circle at 20% 80%, #2dd4bf 0%, transparent 50%)'}}/>
        <div className="relative max-w-5xl mx-auto px-4 md:px-8 py-10">
          <div className="flex items-center gap-2 text-teal-200 text-xs font-bold uppercase tracking-widest mb-3">
            <HugeIconPicker name="location01Icon" size={14}/> Coverage Map
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2">ISP Coverage in Mirpur</h1>
          <p className="text-teal-100 text-sm">Interactive map showing broadband coverage by section · Community-sourced</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 space-y-6">
        {/* View toggle + filter */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex gap-1.5 bg-white rounded-2xl p-1.5 border border-slate-100 shadow-sm">
            <button onClick={()=>setView('map')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${view==='map'?'bg-teal-600 text-white shadow-sm':'text-slate-500 hover:text-slate-800'}`}>
              <HugeIconPicker name="location01Icon" size={13}/> Map View
            </button>
            <button onClick={()=>setView('chart')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${view==='chart'?'bg-teal-600 text-white shadow-sm':'text-slate-500 hover:text-slate-800'}`}>
              <HugeIconPicker name="pieChartIcon" size={13}/> Market Share
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {['All',...ALL_ISPS].map(isp=>(
              <button key={isp} onClick={()=>setFilterIsp(isp)}
                className={`px-3 py-1.5 rounded-xl text-[10px] font-bold border transition-all ${
                  filterIsp===isp?'text-white border-transparent shadow-sm':'bg-white border-slate-200 text-slate-600 hover:border-teal-300'
                }`}
                style={filterIsp===isp?{backgroundColor: ISP_COLORS[isp]||'#0d9488'}:{}}
              >{isp==='All'?'All ISPs':isp}</button>
            ))}
          </div>
        </div>

        {view==='map' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* SVG Map */}
            <div className="lg:col-span-2 bg-white rounded-[1.5rem] border border-slate-100 p-5 shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Mirpur — Click a section to explore</p>
              <svg viewBox="0 0 100 100" className="w-full h-72">
                <defs>
                  <radialGradient id="mapbg" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#f0fdf4"/>
                    <stop offset="100%" stopColor="#e0f2fe"/>
                  </radialGradient>
                </defs>
                <ellipse cx="45" cy="50" rx="42" ry="44" fill="url(#mapbg)" stroke="#e2e8f0" strokeWidth="0.5"/>
                {SECTIONS.map(s=>{
                  const isVis = filterIsp==='All'||s.isps.some(i=>i.includes(filterIsp.split(' ')[0]))||s.isps.includes('All ISPs');
                  const isSel = selected===s.id;
                  const dotColor = s.coverage>=5?'#6366f1':s.coverage>=3?'#0d9488':'#64748b';
                  return (
                    <g key={s.id} onClick={()=>setSelected(s.id===selected?null:s.id)} style={{cursor:'pointer'}} opacity={isVis?1:0.2}>
                      {isSel&&<circle cx={s.x} cy={s.y} r={9} fill={dotColor} opacity="0.15"/>}
                      <circle cx={s.x} cy={s.y} r={isSel?5:3.5} fill={dotColor} stroke="white" strokeWidth={isSel?1.5:1}/>
                      <text x={s.x} y={s.y+8} textAnchor="middle" fontSize="3.2" fill="#475569" fontWeight="700">
                        {s.label.replace('Section ','')}
                      </text>
                    </g>
                  );
                })}
              </svg>
              <div className="flex gap-4 mt-3 flex-wrap">
                {[{c:'#6366f1',l:'6 ISPs (Best)'},{c:'#0d9488',l:'3+ ISPs'},{c:'#64748b',l:'1–2 ISPs'}].map(d=>(
                  <div key={d.l} className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
                    <div className="w-2.5 h-2.5 rounded-full" style={{backgroundColor:d.c}}/>
                    {d.l}
                  </div>
                ))}
              </div>
            </div>

            {/* Detail + list */}
            <div className="space-y-3">
              {active?(
                <div className="bg-white rounded-[1.5rem] border border-slate-100 p-5 shadow-sm space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-teal-50 rounded-2xl flex items-center justify-center">
                      <HugeIconPicker name="location01Icon" size={18} className="text-teal-600"/>
                    </div>
                    <div>
                      <h3 className="font-black text-sm">{active.label}</h3>
                      <p className="text-[10px] text-teal-600 font-bold uppercase">{active.coverage} ISPs available</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {ALL_ISPS.map(isp=>{
                      const covered=active.isps.includes(isp)||active.isps.includes('All ISPs');
                      return (
                        <div key={isp} className={`flex items-center gap-2.5 p-2.5 rounded-xl ${covered?'bg-teal-50':'bg-slate-50'}`}>
                          {covered
                            ?<HugeIconPicker name="tickCircleIcon" size={14} className="text-teal-600 shrink-0"/>
                            :<HugeIconPicker name="circleIcon" size={14} className="text-slate-300 shrink-0"/>}
                          <span className={`text-xs font-bold ${covered?'text-slate-800':'text-slate-300'}`}>{isp}</span>
                          {covered&&<div className="ml-auto w-2 h-2 rounded-full" style={{backgroundColor:ISP_COLORS[isp]||'#0d9488'}}/>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ):(
                <div className="bg-white rounded-[1.5rem] border border-slate-100 p-5 text-center shadow-sm">
                  <HugeIconPicker name="location01Icon" size={28} className="text-slate-200 mx-auto mb-2"/>
                  <p className="text-xs font-bold text-slate-400">Click a section on the map to see which ISPs cover that area</p>
                </div>
              )}

              <div className="bg-white rounded-[1.5rem] border border-slate-100 overflow-hidden shadow-sm">
                <div className="px-4 py-3 border-b border-slate-50 flex items-center gap-1.5">
                  <HugeIconPicker name="userMultipleIcon" size={12} className="text-slate-400"/>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">All Sections</p>
                </div>
                <div className="divide-y divide-slate-50 max-h-48 overflow-y-auto">
                  {visible.map(s=>(
                    <button key={s.id} onClick={()=>setSelected(s.id===selected?null:s.id)}
                      className={`w-full px-4 py-2.5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors ${selected===s.id?'bg-teal-50':''}`}>
                      <span className="text-xs font-bold">{s.label}</span>
                      <span className="text-[10px] font-black text-teal-600">{s.coverage} ISPs</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {view==='chart' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Pie chart */}
            <div className="bg-white rounded-[1.5rem] border border-slate-100 p-6 shadow-sm">
              <h2 className="font-black text-sm uppercase tracking-wider mb-1">Market Share in Mirpur</h2>
              <p className="text-slate-400 text-xs mb-4">% of speed test users per ISP · May 2026</p>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={MARKET_SHARE} cx="50%" cy="50%" innerRadius={60} outerRadius={100}
                      paddingAngle={3} dataKey="value" label={({name,value})=>`${value}%`} labelLine={false}>
                      {MARKET_SHARE.map((entry,i)=><Cell key={i} fill={entry.color}/>)}
                    </Pie>
                    <Tooltip formatter={(v)=>`${v}%`} contentStyle={{borderRadius:12,border:'none',boxShadow:'0 10px 40px rgba(0,0,0,.1)',fontSize:11,fontWeight:700}}/>
                    <Legend wrapperStyle={{fontSize:11,fontWeight:700}}/>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* ISP coverage bars */}
            <div className="bg-white rounded-[1.5rem] border border-slate-100 p-6 shadow-sm">
              <h2 className="font-black text-sm uppercase tracking-wider mb-1">Coverage by ISP</h2>
              <p className="text-slate-400 text-xs mb-5">Sections covered out of 12 total</p>
              <div className="space-y-3">
                {[
                  {isp:'MirpurNet',sections:7,color:'#6366f1'},
                  {isp:'MNET',sections:7,color:'#0891b2'},
                  {isp:'BAS Network',sections:6,color:'#059669'},
                  {isp:'Info ISP',sections:6,color:'#7c3aed'},
                  {isp:'Mirpur Online',sections:6,color:'#dc2626'},
                  {isp:'Inspire Broadband',sections:6,color:'#f59e0b'},
                ].map(d=>(
                  <div key={d.isp}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-700">{d.isp}</span>
                      <span className="text-xs font-black" style={{color:d.color}}>{d.sections}/12 sections</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{width:`${(d.sections/12)*100}%`,backgroundColor:d.color}}/>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-100 rounded-2xl p-5 flex items-center gap-3">
          <HugeIconPicker name="location01Icon" size={20} className="text-teal-600 shrink-0"/>
          <p className="text-xs text-teal-700 font-medium flex-1 flex items-center gap-1.5">
            <HugeIconPicker name="location01Icon" size={12} /> Coverage data is community-sourced and updated monthly.
          </p>
          <button className="shrink-0 bg-teal-600 text-white text-xs font-black px-4 py-2 rounded-xl hover:bg-teal-700 transition-colors">
            Submit Your Area →
          </button>
        </div>
      </div>
    </div>
  );
}
