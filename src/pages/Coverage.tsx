import { useState } from 'react';
import { MapPin, Users, CheckCircle, Circle } from 'lucide-react';

const SECTIONS = [
  { id:'sec1',  label:'Section 1',  x:28,  y:20,  isps:['MirpurNet','MNET','Mirpur Online'], coverage:3 },
  { id:'sec2',  label:'Section 2',  x:55,  y:15,  isps:['MirpurNet','BAS Network'],          coverage:2 },
  { id:'sec6',  label:'Section 6',  x:72,  y:30,  isps:['MirpurNet','BAS Network','Inspire'], coverage:3 },
  { id:'sec7',  label:'Section 7',  x:80,  y:48,  isps:['MNET','Info ISP'],                  coverage:2 },
  { id:'sec10', label:'Section 10', x:55,  y:45,  isps:['All ISPs'],                          coverage:6 },
  { id:'sec11', label:'Section 11', x:35,  y:55,  isps:['All ISPs'],                          coverage:6 },
  { id:'sec12', label:'Section 12', x:60,  y:65,  isps:['BAS Network','Info ISP','Inspire'],  coverage:3 },
  { id:'sec13', label:'Section 13', x:20,  y:65,  isps:['MNET','Mirpur Online'],              coverage:2 },
  { id:'sec14', label:'Section 14', x:10,  y:50,  isps:['MNET','Mirpur Online'],              coverage:2 },
  { id:'pallabi',label:'Pallabi',   x:15,  y:35,  isps:['MNET','Info ISP'],                  coverage:2 },
  { id:'kazi',  label:'Kazipara',  x:45,  y:75,  isps:['BAS Network','Inspire'],             coverage:2 },
  { id:'dohs',  label:'DOHS',      x:72,  y:70,  isps:['MirpurNet','Inspire'],               coverage:2 },
];

const ALL_ISPS = ['MirpurNet','MNET','BAS Network','Info ISP','Mirpur Online','Inspire Broadband'];
const ISP_COLORS: Record<string,string> = {
  'MirpurNet':'bg-teal-500','MNET':'bg-cyan-500','BAS Network':'bg-emerald-500',
  'Info ISP':'bg-violet-500','Mirpur Online':'bg-red-500','Inspire Broadband':'bg-amber-500',
};

export default function Coverage() {
  const [selected, setSelected] = useState<string|null>(null);
  const [filterIsp, setFilterIsp] = useState('All');

  const active = SECTIONS.find(s => s.id === selected);
  const visible = SECTIONS.filter(s =>
    filterIsp === 'All' || s.isps.some(i => i.includes(filterIsp.split(' ')[0])) || s.isps.includes('All ISPs')
  );

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-6">
      <div>
        <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
          <MapPin size={22} className="text-teal-600" /> Coverage Map
        </h2>
        <p className="text-slate-500 text-sm mt-1">ISP coverage by section in Mirpur, Dhaka</p>
      </div>

      {/* ISP filter */}
      <div className="flex flex-wrap gap-2">
        {['All',...ALL_ISPS].map(isp => (
          <button key={isp} onClick={() => setFilterIsp(isp)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all
              ${filterIsp===isp ? 'bg-teal-600 text-white border-teal-600' : 'bg-white border-slate-200 text-slate-600 hover:border-teal-300'}`}>
            {isp}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* SVG Map */}
        <div className="lg:col-span-2 bg-slate-50 rounded-3xl border border-slate-100 p-4 relative" style={{ minHeight:360 }}>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Mirpur — Interactive Map</p>
          <svg viewBox="0 0 100 100" className="w-full h-72">
            {/* Background shape */}
            <ellipse cx="45" cy="50" rx="42" ry="44" fill="#f1f5f9" stroke="#e2e8f0" strokeWidth="0.5"/>
            {SECTIONS.map(s => {
              const isVisible = filterIsp==='All' || s.isps.some(i=>i.includes(filterIsp.split(' ')[0])) || s.isps.includes('All ISPs');
              const isSelected = selected === s.id;
              const dotColor = s.coverage >= 5 ? '#0d9488' : s.coverage >= 3 ? '#06b6d4' : '#64748b';
              return (
                <g key={s.id} onClick={() => setSelected(s.id===selected?null:s.id)} style={{cursor:'pointer'}} opacity={isVisible?1:0.2}>
                  <circle cx={s.x} cy={s.y} r={isSelected?5:3.5} fill={dotColor}
                    stroke={isSelected?'#0d9488':'white'} strokeWidth={isSelected?1.5:1}/>
                  {isSelected && <circle cx={s.x} cy={s.y} r={8} fill="none" stroke="#0d9488" strokeWidth="0.5" opacity="0.5"/>}
                  <text x={s.x} y={s.y+8} textAnchor="middle" fontSize="3.5" fill="#475569" fontWeight="600">
                    {s.label.replace('Section ','')}
                  </text>
                </g>
              );
            })}
          </svg>
          <div className="flex gap-4 mt-2">
            {[{c:'bg-teal-500',l:'6 ISPs'},{ c:'bg-cyan-400',l:'3+ ISPs'},{c:'bg-slate-400',l:'1–2 ISPs'}].map(d=>(
              <div key={d.l} className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
                <div className={`w-2.5 h-2.5 rounded-full ${d.c}`}/>{d.l}
              </div>
            ))}
          </div>
        </div>

        {/* Detail panel */}
        <div className="space-y-3">
          {active ? (
            <div className="bg-white rounded-3xl border border-slate-100 p-5 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 bg-teal-50 rounded-2xl flex items-center justify-center">
                  <MapPin size={18} className="text-teal-600"/>
                </div>
                <div>
                  <h3 className="font-black text-sm">{active.label}</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">{active.coverage} ISP{active.coverage!==1?'s':''} available</p>
                </div>
              </div>
              <div className="space-y-2">
                {ALL_ISPS.map(isp => {
                  const covered = active.isps.includes(isp) || active.isps.includes('All ISPs');
                  return (
                    <div key={isp} className="flex items-center gap-2">
                      {covered
                        ? <CheckCircle size={14} className="text-emerald-500 shrink-0"/>
                        : <Circle size={14} className="text-slate-200 shrink-0"/>}
                      <span className={`text-xs font-bold ${covered?'text-slate-700':'text-slate-300'}`}>{isp}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-100 p-5 text-center">
              <MapPin size={28} className="text-slate-200 mx-auto mb-2"/>
              <p className="text-xs font-bold text-slate-400">Click a section on the map to see which ISPs cover that area</p>
            </div>
          )}

          {/* Section list */}
          <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-50">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1"><Users size={11}/> All Sections</p>
            </div>
            <div className="divide-y divide-slate-50 max-h-52 overflow-y-auto">
              {visible.map(s => (
                <button key={s.id} onClick={() => setSelected(s.id===selected?null:s.id)}
                  className={`w-full px-4 py-2.5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors ${selected===s.id?'bg-teal-50':''}`}>
                  <span className="text-xs font-bold">{s.label}</span>
                  <span className="text-[10px] font-black text-teal-600">{s.coverage} ISPs</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-teal-50 border border-teal-100 rounded-2xl p-4 text-xs text-teal-700 font-medium">
        📍 Coverage data is community-sourced. <button className="font-black underline">Submit your ISP & area →</button> to help improve the map.
      </div>
    </div>
  );
}
