import HugeIconPicker from '../components/HugeIconPicker';
import { useState } from 'react';


const TABS = ['Download Time', 'Streaming', 'Video Calls'] as const;
type Tab = typeof TABS[number];

const FILE_PRESETS = [
  { label:'Movie (2 GB)', size: 2048 },
  { label:'Game (20 GB)', size: 20480 },
  { label:'Ubuntu ISO (4 GB)', size: 4096 },
  { label:'BDIX File (1 GB)', size: 1024 },
];

function fmtTime(secs: number) {
  if (secs < 60) return `${secs.toFixed(0)} sec`;
  if (secs < 3600) return `${(secs/60).toFixed(1)} min`;
  return `${(secs/3600).toFixed(1)} hrs`;
}

export default function Bandwidth() {
  const [tab, setTab] = useState<Tab>('Download Time');
  const [speed, setSpeed] = useState(25);
  const [fileMB, setFileMB] = useState(2048);

  const dlTime = (fileMB * 8) / (speed);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans relative pb-20 selection:bg-teal-500/30 selection:text-teal-900">
      {/* Background Graphic */}
      <div className="absolute top-0 left-0 w-full h-[50vh] z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-950/90 to-slate-950 z-10" />
        <img 
          src="https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=2000&q=80" 
          alt="Network cables" 
          className="w-full h-full object-cover opacity-20 mix-blend-luminosity scale-105"
        />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-[120px] z-10" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-6 pt-32 space-y-8">
        <div className="text-center md:text-left">
          <div className="inline-flex items-center gap-2 text-teal-400 text-xs font-black uppercase tracking-widest mb-4 bg-teal-500/10 px-3 py-1.5 rounded-full border border-teal-500/20">
            <HugeIconPicker name="calculatorIcon" size={16} /> Diagnostic Tool
          </div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white drop-shadow-2xl mb-2">
            Bandwidth <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">Calculator</span>
          </h1>
          <p className="text-slate-400 text-sm font-bold uppercase tracking-wider">Find out what you can do with your internet speed</p>
        </div>

        {/* Speed input */}
        <div className="bg-white/5 backdrop-blur-md rounded-[2rem] border border-white/10 p-8 shadow-2xl">
          <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 block mb-4">Your Download Speed</label>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <input type="range" min={1} max={300} value={speed} onChange={e => setSpeed(+e.target.value)}
              className="w-full sm:flex-1 accent-teal-500 bg-white/10 h-2 rounded-lg appearance-none cursor-pointer" />
            <div className="bg-teal-500 text-slate-950 px-6 py-3 rounded-2xl font-black text-2xl w-full sm:w-40 text-center shadow-[0_0_20px_rgba(20,184,166,0.4)]">
              {speed} <span className="text-sm font-black uppercase tracking-widest text-slate-800">Mbps</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap sm:flex-nowrap gap-2 bg-white/5 backdrop-blur-md p-1.5 rounded-2xl border border-white/10">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-3 px-2 text-xs font-black uppercase tracking-wider rounded-xl transition-all ${tab===t ? 'bg-white/10 text-white shadow-md border border-white/10' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
              {t}
            </button>
          ))}
        </div>

        {tab === 'Download Time' && (
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 p-6 shadow-xl">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 block mb-4">Select or Custom File Size</label>
              <div className="flex flex-wrap gap-3">
                {FILE_PRESETS.map(p => (
                  <button key={p.label} onClick={() => setFileMB(p.size)}
                    className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider border transition-all ${fileMB===p.size ? 'bg-teal-500 text-slate-950 border-teal-500 shadow-[0_0_15px_rgba(20,184,166,0.4)]' : 'bg-white/5 border-white/10 text-slate-300 hover:border-teal-400/50 hover:text-white'}`}>
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-teal-500/10 backdrop-blur-md border border-teal-500/30 rounded-[2rem] p-10 text-center shadow-[0_0_40px_rgba(20,184,166,0.1)] relative overflow-hidden">
              <div className="absolute inset-0 opacity-[0.03] flex items-center justify-center pointer-events-none">
                <HugeIconPicker name="time01Icon" size={250} />
              </div>
              <HugeIconPicker name="time01Icon" size={40} className="text-teal-400 mx-auto mb-4 drop-shadow-[0_0_15px_rgba(45,212,191,0.5)]" />
              <p className="text-6xl font-black text-white drop-shadow-[0_0_15px_rgba(20,184,166,0.3)]">{fmtTime(dlTime)}</p>
              <p className="text-sm font-bold uppercase tracking-widest text-slate-400 mt-4">to download {(fileMB/1024).toFixed(fileMB<1024?1:0)} GB at <span className="text-white">{speed} Mbps</span></p>
              <p className="text-xs text-teal-400 mt-2 font-black uppercase tracking-wider">≈ {(fileMB/1024).toFixed(1)} GB file · {speed} Mbps connection</p>
            </div>
          </div>
        )}

        {tab === 'Streaming' && (
          <div className="space-y-4">
            {[
              { quality:'SD (480p)',  req:1.5, icon:'📺' },
              { quality:'HD (1080p)', req:5,   icon:'🖥️' },
              { quality:'4K UHD',     req:25,  icon:'✨' },
              { quality:'8K',         req:80,  icon:'🚀' },
            ].map(s => {
              const streams = Math.floor(speed / s.req);
              return (
                <div key={s.quality} className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl hover:bg-white/10 transition-colors">
                  <div>
                    <p className="font-black text-lg text-white uppercase tracking-wider mb-1">{s.icon} <span className="ml-2">{s.quality}</span></p>
                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">Requires <span className="text-teal-400">{s.req} Mbps</span> per stream</p>
                  </div>
                  <div className="sm:text-right">
                    <p className={`text-4xl font-black ${streams > 0 ? 'text-teal-400 drop-shadow-[0_0_10px_rgba(45,212,191,0.5)]' : 'text-rose-400 drop-shadow-[0_0_10px_rgba(244,63,94,0.5)]'}`}>{streams}</p>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">simultaneous</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {tab === 'Video Calls' && (
          <div className="space-y-4">
            {[
              { app:'Zoom HD',       req:2.5, icon:'💼' },
              { app:'Google Meet',   req:2,   icon:'🟢' },
              { app:'Teams HD',      req:3,   icon:'🔵' },
              { app:'WhatsApp Video',req:1,   icon:'📱' },
            ].map(v => {
              const calls = Math.floor(speed / v.req);
              return (
                <div key={v.app} className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl hover:bg-white/10 transition-colors">
                  <div>
                    <p className="font-black text-lg text-white uppercase tracking-wider mb-1">{v.icon} <span className="ml-2">{v.app}</span></p>
                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">Needs <span className="text-teal-400">{v.req} Mbps</span> per call</p>
                  </div>
                  <div className="sm:text-right">
                    <p className={`text-4xl font-black ${calls > 0 ? 'text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]' : 'text-rose-400 drop-shadow-[0_0_10px_rgba(244,63,94,0.5)]'}`}>{calls}</p>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">simultaneous</p>
                  </div>
                </div>
              );
            })}
            <div className="bg-amber-500/10 border border-amber-500/20 backdrop-blur-md rounded-2xl p-5 text-sm text-amber-400 font-bold shadow-lg">
              <span className="text-lg mr-2">⬆️</span> Video calls depend heavily on <strong className="text-white uppercase tracking-wider">upload speed</strong>. Make sure to test your upload capacity too.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
