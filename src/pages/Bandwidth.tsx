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
    <div className="max-w-2xl mx-auto p-4 md:p-8 space-y-6">
      <div>
        <h2 className="text-2xl font-black tracking-tight">Bandwidth Calculator</h2>
        <p className="text-slate-500 text-sm mt-1">Find out what you can do with your internet speed</p>
      </div>

      {/* Speed input */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6">
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-3">Your Download Speed</label>
        <div className="flex items-center gap-4">
          <input type="range" min={1} max={300} value={speed} onChange={e => setSpeed(+e.target.value)}
            className="flex-1 accent-teal-600" />
          <div className="bg-teal-600 text-white px-4 py-2 rounded-xl font-black text-lg w-28 text-center">
            {speed} <span className="text-xs font-bold text-teal-200">Mbps</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-slate-100 p-1 rounded-2xl">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 py-2 text-xs font-black rounded-xl transition-all ${tab===t ? 'bg-white text-teal-600 shadow-sm' : 'text-slate-500'}`}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'Download Time' && (
        <div className="space-y-3">
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">File Size</label>
            <div className="flex flex-wrap gap-2">
              {FILE_PRESETS.map(p => (
                <button key={p.label} onClick={() => setFileMB(p.size)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${fileMB===p.size ? 'bg-teal-600 text-white border-teal-600' : 'border-slate-200 text-slate-600 hover:border-teal-300'}`}>
                  {p.label}
                </button>
              ))}
            </div>
          </div>
          <div className="bg-teal-50 border border-teal-100 rounded-3xl p-8 text-center">
            <HugeIconPicker name="time01Icon" size={32} className="text-teal-500 mx-auto mb-3" />
            <p className="text-5xl font-black text-teal-700">{fmtTime(dlTime)}</p>
            <p className="text-sm text-slate-500 mt-2">to download {(fileMB/1024).toFixed(fileMB<1024?1:0)} GB at {speed} Mbps</p>
            <p className="text-xs text-teal-400 mt-1 font-bold">≈ {(fileMB/1024).toFixed(1)} GB file · {speed} Mbps connection</p>
          </div>
        </div>
      )}

      {tab === 'Streaming' && (
        <div className="space-y-3">
          {[
            { quality:'SD (480p)',  req:1.5, icon:'📺' },
            { quality:'HD (1080p)', req:5,   icon:'🖥️' },
            { quality:'4K UHD',     req:25,  icon:'✨' },
            { quality:'8K',         req:80,  icon:'🚀' },
          ].map(s => {
            const streams = Math.floor(speed / s.req);
            return (
              <div key={s.quality} className="bg-white rounded-2xl border border-slate-100 p-5 flex items-center justify-between">
                <div>
                  <p className="font-black text-sm">{s.icon} {s.quality}</p>
                  <p className="text-xs text-slate-400 font-bold">Requires {s.req} Mbps per stream</p>
                </div>
                <div className="text-right">
                  <p className={`text-2xl font-black ${streams > 0 ? 'text-teal-600' : 'text-red-400'}`}>{streams}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">simultaneous</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {tab === 'Video Calls' && (
        <div className="space-y-3">
          {[
            { app:'Zoom HD',       req:2.5, icon:'💼' },
            { app:'Google Meet',   req:2,   icon:'🟢' },
            { app:'Teams HD',      req:3,   icon:'🔵' },
            { app:'WhatsApp Video',req:1,   icon:'📱' },
          ].map(v => {
            const calls = Math.floor(speed / v.req);
            return (
              <div key={v.app} className="bg-white rounded-2xl border border-slate-100 p-5 flex items-center justify-between">
                <div>
                  <p className="font-black text-sm">{v.icon} {v.app}</p>
                  <p className="text-xs text-slate-400 font-bold">Needs {v.req} Mbps per call</p>
                </div>
                <div className="text-right">
                  <p className={`text-2xl font-black ${calls > 0 ? 'text-emerald-600' : 'text-red-400'}`}>{calls}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">simultaneous</p>
                </div>
              </div>
            );
          })}
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 text-xs text-amber-700 font-medium">
            ⬆️ Video calls depend on <strong>upload speed</strong>. Make sure to test your upload too.
          </div>
        </div>
      )}
    </div>
  );
}
