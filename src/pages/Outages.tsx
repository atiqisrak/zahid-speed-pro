import HugeIconPicker from '../components/HugeIconPicker';
import { useState } from 'react';


const ISPS  = ['MirpurNet','MNET','BAS Network','Info ISP','Mirpur Online','Inspire Broadband','Link3','Carnival','Other'];
const AREAS = ['Section 1','Section 2','Section 6','Section 7','Section 10','Section 11','Section 12','Section 13','Section 14','Pallabi','Kazipara','DOHS'];

const FEED = [
  { isp:'MNET',       area:'Section 13', time:'18 min ago',  users:14, resolved:false, severity:'high'   },
  { isp:'MirpurNet',  area:'Section 10', time:'2 hrs ago',   users:31, resolved:true,  severity:'medium' },
  { isp:'Info ISP',   area:'Section 12', time:'5 hrs ago',   users:7,  resolved:true,  severity:'low'    },
  { isp:'Carnival',   area:'Pallabi',    time:'8 hrs ago',   users:22, resolved:true,  severity:'medium' },
];

const SEV_STYLES = {
  high:   { badge:'bg-red-100 text-red-700',   dot:'bg-red-500'    },
  medium: { badge:'bg-amber-100 text-amber-700', dot:'bg-amber-500' },
  low:    { badge:'bg-slate-100 text-slate-600', dot:'bg-slate-400' },
};

export default function Outages() {
  const [isp,  setIsp]  = useState('');
  const [area, setArea] = useState('');
  const [desc, setDesc] = useState('');
  const [sent, setSent] = useState(false);

  return (
    <div className="min-h-full bg-slate-50 font-sans">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-red-600 via-rose-600 to-pink-700 text-white">
        <div className="absolute inset-0 opacity-10"
          style={{backgroundImage:'radial-gradient(circle at 80% 20%, #fb923c 0%, transparent 50%)'}}/>
        <div className="relative max-w-4xl mx-auto px-4 md:px-8 py-10">
          <div className="flex items-center gap-2 text-red-200 text-xs font-bold uppercase tracking-widest mb-3">
            <HugeIconPicker name="activity01Icon" size={14} className="animate-pulse"/> Live Outage Monitor
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2">ISP Outage Reporter</h1>
          <p className="text-red-100 text-sm">Community-powered real-time outage tracking for Mirpur, Dhaka</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 space-y-6">
        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label:'Active Outages', val:'1', icon:'alert01Icon',       color:'text-red-600',   bg:'bg-red-50' },
            { label:'Resolved Today', val:'3', icon:'tickCircleIcon',  color:'text-teal-600',  bg:'bg-teal-50' },
            { label:'Users Affected', val:'74', icon:'userMultipleIcon',       color:'text-amber-600', bg:'bg-amber-50' },
          ].map(s=>(
            <div key={s.label} className={`${s.bg} rounded-2xl p-4 border border-white text-center shadow-sm`}>
              <HugeIconPicker name={s.icon} size={18} className={`${s.color} mx-auto mb-1.5`}/>
              <p className="text-xl font-black text-slate-900">{s.val}</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {/* Report form */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-[1.5rem] border border-slate-100 overflow-hidden shadow-sm">
              <div className="bg-gradient-to-r from-red-600 to-rose-600 px-5 py-4">
                <h3 className="text-white font-black text-sm flex items-center gap-2">
                  <HugeIconPicker name="alert01Icon" size={16}/> Report an Outage
                </h3>
                <p className="text-red-200 text-[10px] mt-0.5">Help your neighbors know what's happening</p>
              </div>
              <div className="p-5">
                {sent ? (
                  <div className="flex flex-col items-center gap-3 py-6 text-center">
                    <div className="w-14 h-14 bg-teal-50 rounded-full flex items-center justify-center">
                      <HugeIconPicker name="tickCircleIcon" size={28} className="text-teal-600"/>
                    </div>
                    <p className="font-black text-slate-900">Report Submitted!</p>
                    <p className="text-slate-500 text-xs">Thank you for helping the Mirpur community</p>
                    <button onClick={()=>setSent(false)} className="text-xs font-black text-teal-600 hover:underline">Report Another</button>
                  </div>
                ):(
                  <div className="space-y-3">
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Your ISP *</label>
                      <select value={isp} onChange={e=>setIsp(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-medium bg-slate-50 focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400/20 transition-all">
                        <option value="">Select ISP</option>
                        {ISPS.map(i=><option key={i}>{i}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Your Area *</label>
                      <select value={area} onChange={e=>setArea(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-medium bg-slate-50 focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400/20 transition-all">
                        <option value="">Select Area</option>
                        {AREAS.map(a=><option key={a}>{a}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Description (optional)</label>
                      <textarea value={desc} onChange={e=>setDesc(e.target.value)} rows={2}
                        placeholder="e.g. Complete outage since 6 PM…"
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-medium bg-slate-50 focus:outline-none focus:border-red-400 resize-none transition-all"/>
                    </div>
                    <button onClick={()=>{if(isp&&area)setSent(true);}}
                      disabled={!isp||!area}
                      className="w-full py-3 bg-red-600 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm shadow-red-500/20">
                      <HugeIconPicker name="edit01Icon" size={15}/> Submit Report
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Live feed */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-[1.5rem] border border-slate-100 overflow-hidden shadow-sm">
              <div className="px-5 py-4 border-b border-slate-50 flex items-center gap-2 bg-gradient-to-r from-slate-50 to-red-50">
                <HugeIconPicker name="time01Icon" size={15} className="text-red-500"/>
                <span className="font-black text-sm uppercase tracking-wider">Live Outage Feed</span>
                <span className="ml-auto flex items-center gap-1.5 text-[10px] font-bold text-red-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse inline-block"/>LIVE
                </span>
              </div>
              <div className="divide-y divide-slate-50">
                {FEED.map((f,i)=>{
                  const sev = SEV_STYLES[f.severity as keyof typeof SEV_STYLES] || SEV_STYLES.low;
                  return (
                    <div key={i} className={`flex items-center px-5 py-4 gap-4 ${!f.resolved?'bg-red-50/50':''}`}>
                      <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${f.resolved?'bg-teal-400':sev.dot+' animate-pulse'}`}/>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-black text-sm">{f.isp}</p>
                          <span className="text-slate-400 text-xs font-medium">·</span>
                          <p className="text-xs text-slate-600 font-medium">{f.area}</p>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <HugeIconPicker name="userMultipleIcon" size={10} className="text-slate-400"/>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">{f.users} users · {f.time}</p>
                        </div>
                      </div>
                      <span className={`text-[10px] font-black uppercase px-2.5 py-1.5 rounded-xl shrink-0 ${
                        f.resolved?'bg-teal-50 text-teal-700':sev.badge
                      }`}>{f.resolved?'Resolved':'Active'}</span>
                    </div>
                  );
                })}
              </div>
              <div className="px-5 py-3 bg-slate-50/50 border-t border-slate-50">
                <p className="text-[10px] text-slate-400 font-bold text-center">
                  Showing last 24h · <a href="tel:16996" className="text-red-600 font-black">BTRC: 16996</a>
                </p>
              </div>
            </div>

            {/* ISP status grid */}
            <div className="mt-4 grid grid-cols-3 gap-2">
              {['MirpurNet','MNET','BAS Network','Info ISP','Inspire','Carnival'].map((isp,i)=>{
                const hasOutage = i===1;
                return (
                  <div key={isp} className={`rounded-2xl p-3 border text-center ${hasOutage?'bg-red-50 border-red-200':'bg-white border-slate-100'}`}>
                    <div className={`w-2 h-2 rounded-full mx-auto mb-2 ${hasOutage?'bg-red-500 animate-pulse':'bg-teal-400'}`}/>
                    <p className="text-[10px] font-black truncate">{isp}</p>
                    <p className={`text-[9px] font-bold uppercase ${hasOutage?'text-red-600':'text-teal-600'}`}>
                      {hasOutage?'Outage':'Operational'}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* BTRC callout */}
        <div className="bg-gradient-to-r from-rose-50 to-red-50 border border-red-100 rounded-2xl p-5 flex items-center gap-4">
          <HugeIconPicker name="alert01Icon" size={32} className="text-red-400 shrink-0"/>
          <div>
            <p className="font-black text-sm text-slate-900">Persistent internet problems?</p>
            <p className="text-slate-600 text-xs mt-0.5">File an official complaint with BTRC if your ISP isn't resolving outages within 24 hours.</p>
          </div>
          <a href="tel:100" className="shrink-0 bg-red-600 text-white font-black text-xs px-4 py-2.5 rounded-2xl hover:bg-red-700 transition-colors">
            Call 100
          </a>
        </div>
      </div>
    </div>
  );
}
