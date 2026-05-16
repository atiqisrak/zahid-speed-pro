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
  high:   { badge:'bg-rose-500/20 text-rose-400 border border-rose-500/30',   dot:'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.8)]'    },
  medium: { badge:'bg-amber-500/20 text-amber-400 border border-amber-500/30', dot:'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.8)]' },
  low:    { badge:'bg-slate-500/20 text-slate-400 border border-slate-500/30', dot:'bg-slate-500 shadow-[0_0_10px_rgba(100,116,139,0.8)]' },
};

export default function Outages() {
  const [isp,  setIsp]  = useState('');
  const [area, setArea] = useState('');
  const [desc, setDesc] = useState('');
  const [sent, setSent] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans relative pb-20 selection:bg-rose-500/30 selection:text-rose-900">
      {/* Background Graphic */}
      <div className="absolute top-0 left-0 w-full h-[60vh] z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-950/90 to-slate-950 z-10" />
        <img 
          src="https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=2000&q=80" 
          alt="Network cables" 
          className="w-full h-full object-cover opacity-20 mix-blend-luminosity scale-105"
        />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-rose-600/10 rounded-full blur-[120px] z-10" />
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-amber-500/10 rounded-full blur-[100px] z-10" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 pt-32 space-y-8">
        
        {/* Header */}
        <div className="text-center md:text-left">
          <div className="inline-flex items-center gap-2 text-rose-400 text-xs font-black uppercase tracking-widest mb-4 bg-rose-500/10 px-3 py-1.5 rounded-full border border-rose-500/20">
            <HugeIconPicker name="activity01Icon" size={16} className="animate-pulse" /> Live Outage Monitor
          </div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white drop-shadow-2xl mb-2">
            Outage <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-amber-400">Reporter</span>
          </h1>
          <p className="text-slate-400 text-sm font-bold uppercase tracking-wider">Community-powered real-time outage tracking for Mirpur, Dhaka</p>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label:'Active Outages', val:'1', icon:'alert01Icon',       color:'text-rose-400 drop-shadow-[0_0_10px_rgba(244,63,94,0.5)]',   bg:'bg-rose-500/10 border-rose-500/30 shadow-[0_0_15px_rgba(244,63,94,0.1)]' },
            { label:'Resolved Today', val:'3', icon:'tickCircleIcon',  color:'text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]',  bg:'bg-emerald-500/10 border-emerald-500/30 shadow-[0_0_15px_rgba(52,211,153,0.1)]' },
            { label:'Users Affected', val:'74', icon:'userMultipleIcon',       color:'text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]', bg:'bg-amber-500/10 border-amber-500/30 shadow-[0_0_15px_rgba(251,191,36,0.1)]' },
          ].map(s=>(
            <div key={s.label} className={`${s.bg} backdrop-blur-md rounded-3xl p-6 border text-center transition-transform hover:-translate-y-1`}>
              <HugeIconPicker name={s.icon} size={28} className={`${s.color} mx-auto mb-3`}/>
              <p className="text-4xl font-black text-white">{s.val}</p>
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Report form */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white/5 backdrop-blur-md rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl">
              <div className="bg-rose-500/10 border-b border-rose-500/20 px-6 py-5">
                <h3 className="text-rose-400 font-black text-base uppercase tracking-wider flex items-center gap-2">
                  <HugeIconPicker name="alert01Icon" size={20} className="drop-shadow-[0_0_10px_rgba(244,63,94,0.5)]" /> Report an Outage
                </h3>
                <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest mt-1">Help your neighbors know what's happening</p>
              </div>
              <div className="p-6">
                {sent ? (
                  <div className="flex flex-col items-center gap-4 py-8 text-center">
                    <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/30 shadow-[0_0_20px_rgba(52,211,153,0.2)]">
                      <HugeIconPicker name="tickCircleIcon" size={40} className="text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]"/>
                    </div>
                    <p className="font-black text-2xl text-white uppercase tracking-wider">Report Submitted!</p>
                    <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Thank you for helping the community</p>
                    <button onClick={()=>setSent(false)} className="mt-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10 text-xs font-black text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all uppercase tracking-wider">Report Another</button>
                  </div>
                ):(
                  <div className="space-y-4">
                    <div>
                      <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 block mb-2">Your ISP *</label>
                      <select value={isp} onChange={e=>setIsp(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-white/10 text-sm font-bold bg-slate-900/50 text-white focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400/20 transition-all appearance-none">
                        <option value="">Select ISP</option>
                        {ISPS.map(i=><option key={i} value={i}>{i}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 block mb-2">Your Area *</label>
                      <select value={area} onChange={e=>setArea(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-white/10 text-sm font-bold bg-slate-900/50 text-white focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400/20 transition-all appearance-none">
                        <option value="">Select Area</option>
                        {AREAS.map(a=><option key={a} value={a}>{a}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 block mb-2">Description (optional)</label>
                      <textarea value={desc} onChange={e=>setDesc(e.target.value)} rows={3}
                        placeholder="e.g. Complete outage since 6 PM…"
                        className="w-full px-4 py-3 rounded-xl border border-white/10 text-sm font-bold bg-slate-900/50 text-white focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400/20 resize-none transition-all placeholder:text-slate-600"/>
                    </div>
                    <button onClick={()=>{if(isp&&area)setSent(true);}}
                      disabled={!isp||!area}
                      className="w-full py-4 bg-rose-600 text-white rounded-xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-rose-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-[0_0_20px_rgba(225,29,72,0.4)] disabled:shadow-none">
                      <HugeIconPicker name="edit01Icon" size={18}/> Submit Report
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            {/* ISP status grid */}
            <div className="grid grid-cols-3 gap-3">
              {['MirpurNet','MNET','BAS Network','Info ISP','Inspire','Carnival'].map((isp,i)=>{
                const hasOutage = i===1;
                return (
                  <div key={isp} className={`rounded-2xl p-4 border text-center transition-colors backdrop-blur-md ${hasOutage?'bg-rose-500/10 border-rose-500/30':'bg-white/5 border-white/10'}`}>
                    <div className={`w-2.5 h-2.5 rounded-full mx-auto mb-3 ${hasOutage?'bg-rose-500 animate-pulse shadow-[0_0_10px_rgba(244,63,94,0.8)]':'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]'}`}/>
                    <p className="text-[10px] font-black text-white uppercase tracking-widest truncate">{isp}</p>
                    <p className={`text-[9px] font-black uppercase tracking-widest mt-1 ${hasOutage?'text-rose-400':'text-emerald-400'}`}>
                      {hasOutage?'Outage':'Online'}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Live feed */}
          <div className="md:col-span-3">
            <div className="bg-white/5 backdrop-blur-md rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl h-full flex flex-col">
              <div className="px-6 py-5 border-b border-white/10 flex items-center gap-3 bg-white/5">
                <HugeIconPicker name="time01Icon" size={20} className="text-rose-400 drop-shadow-[0_0_10px_rgba(244,63,94,0.5)]"/>
                <span className="font-black text-base text-white uppercase tracking-wider">Live Outage Feed</span>
                <span className="ml-auto flex items-center gap-2 text-[11px] font-black tracking-widest text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-lg border border-rose-500/20">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shadow-[0_0_5px_rgba(244,63,94,0.8)]"/>LIVE
                </span>
              </div>
              <div className="divide-y divide-white/5 flex-1">
                {FEED.map((f,i)=>{
                  const sev = SEV_STYLES[f.severity as keyof typeof SEV_STYLES] || SEV_STYLES.low;
                  return (
                    <div key={i} className={`flex items-center px-6 py-5 gap-5 hover:bg-white/5 transition-colors ${!f.resolved?'bg-rose-500/5':''}`}>
                      <div className={`w-3 h-3 rounded-full shrink-0 ${f.resolved?'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]':sev.dot+' animate-pulse'}`}/>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 flex-wrap mb-1">
                          <p className="font-black text-base text-white uppercase tracking-wider">{f.isp}</p>
                          <span className="text-slate-500 text-sm">|</span>
                          <p className="text-xs text-slate-300 font-bold uppercase tracking-widest">{f.area}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <HugeIconPicker name="userMultipleIcon" size={14} className="text-slate-500"/>
                          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">{f.users} users <span className="mx-1">·</span> {f.time}</p>
                        </div>
                      </div>
                      <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg shrink-0 ${
                        f.resolved?'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20':sev.badge
                      }`}>{f.resolved?'Resolved':'Active'}</span>
                    </div>
                  );
                })}
              </div>
              <div className="px-6 py-4 bg-white/5 border-t border-white/10">
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest text-center">
                  Showing last 24h <span className="mx-2">·</span> <a href="tel:16996" className="text-rose-400 hover:text-rose-300 hover:underline">BTRC: 16996</a>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* BTRC callout */}
        <div className="bg-rose-500/10 backdrop-blur-md border border-rose-500/20 rounded-[2rem] p-8 flex flex-col sm:flex-row sm:items-center gap-6 shadow-[0_0_30px_rgba(225,29,72,0.1)]">
          <HugeIconPicker name="alert01Icon" size={40} className="text-rose-400 shrink-0 drop-shadow-[0_0_15px_rgba(244,63,94,0.5)]"/>
          <div className="flex-1">
            <p className="font-black text-xl text-white uppercase tracking-wider">Persistent internet problems?</p>
            <p className="text-slate-400 text-sm font-bold mt-1 uppercase tracking-wider">File an official complaint with BTRC if your ISP isn't resolving outages within 24 hours.</p>
          </div>
          <a href="tel:100" className="shrink-0 bg-white/10 border border-white/10 text-white font-black text-sm uppercase tracking-wider px-6 py-4 rounded-xl hover:bg-rose-600 hover:border-rose-500 transition-all shadow-lg hover:shadow-[0_0_20px_rgba(225,29,72,0.5)] text-center">
            Call 100
          </a>
        </div>
      </div>
    </div>
  );
}
