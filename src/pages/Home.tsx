import HugeIconPicker from '../components/HugeIconPicker';
import React, { useEffect, useMemo, useState, useRef } from 'react';
import { toPng } from 'html-to-image';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';

import SettingsModal from '../components/home/SettingsModal';
import HistoryModal from '../components/home/HistoryModal';
import ShareModal from '../components/home/ShareModal';
const TEST_STAGES = { IDLE:'IDLE', LATENCY:'LATENCY', DOWNLOAD:'DOWNLOAD', UPLOAD:'UPLOAD', COMPLETED:'COMPLETED' } as const;
type TestStage = (typeof TEST_STAGES)[keyof typeof TEST_STAGES];
type Profile = { id:'real'|'broadband'|'fiber'; name:string; desc:string; };
type Server = { id:number; name:string; };
type Results = { ping:number|string; jitter:number|string; download:number|string; upload:number|string; };
type GraphPoint = { time:string; speed:number };
type HistoryEntry = { id:number; date:string; download:string; upload:string; ping:Results['ping']; profile:Profile['id']; };

const PROFILES:Profile[] = [
  { id:'real',      name:'Mobile Log',        desc:'2-10 Mbps / High Jitter' },
  { id:'broadband', name:'Standard Broadband', desc:'25-50 Mbps' },
  { id:'fiber',     name:'Fiber Pro',          desc:'300+ Mbps Ultra-low latency' },
];
const SERVERS:Server[] = [
  { id:1, name:'Singapore 2' },
  { id:2, name:'Ashburn, VA' },
  { id:3, name:'London, UK' },
];
const STORAGE_KEY = 'speedpro_history_v1';

export default function Home() {
  const [stage, setStage] = useState<TestStage>(TEST_STAGES.IDLE);
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [results, setResults] = useState<Results>({ ping:0, jitter:0, download:0, upload:0 });
  const [graphData, setGraphData] = useState<GraphPoint[]>([]);
  const [testHistory, setTestHistory] = useState<HistoryEntry[]>([]);
  const [progress, setProgress] = useState(0);
  const [activeServer, setActiveServer] = useState<Server>(SERVERS[0]);
  const [activeProfile, setActiveProfile] = useState<Profile>(PROFILES[1]);
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [ipInfo, setIpInfo] = useState({ ip:'...', isp:'Fetching...', city:'' });

  useEffect(() => {
    fetch('https://speed.cloudflare.com/meta').then(r=>r.json())
      .then(d=>{ if(d.clientIp) setIpInfo({ ip:d.clientIp, isp:d.asOrganization||'Unknown ISP', city:d.city||'' }); })
      .catch(()=>setIpInfo({ ip:'Unknown', isp:'Unknown Provider', city:'' }));
  },[]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if(saved) try { const p=JSON.parse(saved); if(Array.isArray(p)) setTestHistory(p); } catch{}
  },[]);
  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(testHistory)); },[testHistory]);

  const healthScore = useMemo(() => {
    const dl = Number(results.download), ping = Number(results.ping);
    if(dl>100 && ping<20) return { label:'Excellent', color:'text-emerald-400', dropShadow:'drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]', glow:'shadow-[0_0_20px_rgba(52,211,153,0.2)]', border:'border-emerald-500/30', bg:'bg-emerald-500/10' };
    if(dl>25) return { label:'Good', color:'text-teal-400', dropShadow:'drop-shadow-[0_0_10px_rgba(45,212,191,0.5)]', glow:'shadow-[0_0_20px_rgba(45,212,191,0.2)]', border:'border-teal-500/30', bg:'bg-teal-500/10' };
    return { label:'Unstable', color:'text-rose-400', dropShadow:'drop-shadow-[0_0_10px_rgba(244,63,94,0.5)]', glow:'shadow-[0_0_20px_rgba(244,63,94,0.2)]', border:'border-rose-500/30', bg:'bg-rose-500/10' };
  },[results.download, results.ping]);

  const simulateLatency = async () => {
    setStage(TEST_STAGES.LATENCY);
    const pings:number[]=[];
    for(let i=0;i<10;i++){
      const s=performance.now();
      try{ await fetch(`/?t=${Date.now()}`,{method:'HEAD',cache:'no-store'}); }catch{}
      pings.push(performance.now()-s);
      setProgress((i+1)*10);
    }
    const avg=pings.reduce((a,b)=>a+b,0)/pings.length;
    let jitter=0;
    for(let i=1;i<pings.length;i++) jitter+=Math.abs(pings[i]-pings[i-1]);
    jitter/=(pings.length-1);
    setResults(p=>({...p, ping:avg.toFixed(0), jitter:jitter.toFixed(1)}));
  };

  const runSpeedTest = async (type:'download'|'upload') => {
    setStage(type==='download'?TEST_STAGES.DOWNLOAD:TEST_STAGES.UPLOAD);
    setProgress(0); setGraphData([]);
    return new Promise<string>(resolve=>{
      const dur=10000, start=performance.now(), local:GraphPoint[]=[];
      let tot=0, prevMap=new Map<number,number>(), isDone=false, smoothed=0;
      const xhrs:XMLHttpRequest[]=[];
      const cnt=type==='download'?4:2;
      const finish=()=>{
        if(isDone) return; isDone=true;
        xhrs.forEach(x=>{ try{ x.onload=null;x.onerror=null;if(x.upload)x.upload.onprogress=null;x.onprogress=null;x.abort(); }catch{}});
        const rec=local.slice(-5);
        const avg=rec.length?rec.reduce((a,b)=>a+b.speed,0)/rec.length:0;
        const final=avg.toFixed(1);
        setResults(p=>({...p,[type]:final})); setCurrentSpeed(0); resolve(final);
      };
      const startStream=(id:number)=>{
        if(isDone) return;
        const xhr=new XMLHttpRequest(); xhrs[id]=xhr; prevMap.set(id,0);
        if(type==='download'){
          xhr.onprogress=e=>{ if(isDone)return; const prev=prevMap.get(id)||0; tot+=e.loaded-prev; prevMap.set(id,e.loaded); };
          xhr.onload=()=>startStream(id); xhr.onerror=()=>startStream(id);
          xhr.responseType='arraybuffer';
          xhr.open('GET',`/garbage.dat?t=${Math.random()}`,true); xhr.send();
        } else {
          xhr.upload.onprogress=e=>{ if(isDone)return; const prev=prevMap.get(id)||0; tot+=e.loaded-prev; prevMap.set(id,e.loaded); };
          xhr.onload=()=>startStream(id); xhr.onerror=()=>startStream(id);
          xhr.open('POST',`/api/upload?t=${Math.random()}`,true);
          const buf=new ArrayBuffer(3.5*1024*1024);
          xhr.send(new Blob([buf],{type:'text/plain'}));
        }
      };
      for(let i=0;i<cnt;i++) setTimeout(()=>startStream(i),i*200);
      let lastT=start, lastL=0;
      const iv=setInterval(()=>{
        if(isDone){ clearInterval(iv); return; }
        const now=performance.now(), sec=(now-start)/1000;
        if(sec>(dur/1000)){ clearInterval(iv); finish(); return; }
        setProgress((sec/(dur/1000))*100);
        const diff=tot-lastL, dt=(now-lastT)/1000;
        if(dt>0&&tot>0){
          let spd=((diff*8*1.05)/dt)/1000000;
          if(spd>1000) spd/=100; else if(spd>100) spd/=10;
          if(spd>0){ smoothed=smoothed>0?smoothed*0.4+spd*0.6:spd; setCurrentSpeed(smoothed); local.push({time:sec.toFixed(1),speed:smoothed}); setGraphData([...local]); }
        }
        lastT=now; lastL=tot;
      },200);
    });
  };

  const startFullTest = async () => {
    setResults({ping:0,jitter:0,download:0,upload:0});
    await simulateLatency();
    const dl=await runSpeedTest('download');
    const ul=await runSpeedTest('upload');
    setStage(TEST_STAGES.COMPLETED);
    setTestHistory(p=>[{ id:Date.now(), date:new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}), download:dl, upload:ul, ping:results.ping, profile:activeProfile.id },...p].slice(0,10));
  };


  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans relative pb-20 pt-32 selection:bg-teal-500/30 selection:text-teal-900 overflow-hidden">
      
      {/* Background Graphic */}
      <div className="absolute top-0 left-0 w-full h-full z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 z-10 opacity-80" />
        <img 
          src="https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=2000&q=80" 
          alt="Datacenter Core" 
          className="w-full h-full object-cover opacity-[0.15] mix-blend-luminosity scale-105"
        />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-teal-500/10 rounded-full blur-[150px] z-10" />
      </div>

      <main className="relative z-10 max-w-5xl mx-auto px-4 md:px-8">
        <div className="flex flex-col gap-6">
          
          {/* Header text on idle */}
          {stage === TEST_STAGES.IDLE && (
            <div className="text-center mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="inline-flex items-center gap-2 text-teal-400 text-[10px] font-black uppercase tracking-widest mb-4 bg-teal-500/10 px-4 py-2 rounded-full border border-teal-500/20 shadow-[0_0_15px_rgba(20,184,166,0.15)]">
                <HugeIconPicker name="activity01Icon" size={14} className="animate-pulse" /> Precision Speed Test
              </div>
              <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white drop-shadow-2xl mb-2">
                Core <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-indigo-400">Diagnostics</span>
              </h1>
            </div>
          )}

          {stage===TEST_STAGES.COMPLETED && (
            <div className="animate-in zoom-in-95 fade-in duration-500 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Download Box */}
                <div className="bg-teal-500/10 border border-teal-500/30 backdrop-blur-md p-8 sm:p-10 rounded-[2.5rem] shadow-[0_0_40px_rgba(20,184,166,0.15)] relative overflow-hidden flex flex-col justify-between min-h-[180px] group transition-all hover:bg-teal-500/20">
                  <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity text-teal-400"><HugeIconPicker name="arrowDown01Icon" size={100}/></div>
                  <div className="absolute -inset-24 bg-teal-500/20 rounded-full blur-[80px] group-hover:bg-teal-500/30 transition-colors pointer-events-none" />
                  
                  <div className="relative">
                    <p className="text-[11px] font-black uppercase tracking-widest text-teal-400 mb-2 flex items-center gap-2">
                      <HugeIconPicker name="download02Icon" size={16} /> Download
                    </p>
                    <div className="flex items-baseline gap-3 mt-auto">
                      <span className="text-6xl sm:text-8xl font-black italic tracking-tighter text-white drop-shadow-[0_0_15px_rgba(20,184,166,0.5)]">{results.download}</span>
                      <span className="text-2xl font-black uppercase tracking-widest text-teal-400 ml-1">Mbps</span>
                    </div>
                  </div>
                </div>
                
                {/* Upload Box */}
                <div className="bg-white/5 border border-white/10 backdrop-blur-md p-8 sm:p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[180px] group transition-all hover:bg-white/10 hover:border-white/20">
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity text-white"><HugeIconPicker name="arrowUp01Icon" size={100}/></div>
                  <div className="absolute -inset-24 bg-indigo-500/10 rounded-full blur-[80px] group-hover:bg-indigo-500/20 transition-colors pointer-events-none" />
                  
                  <div className="relative">
                    <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-2">
                      <HugeIconPicker name="upload02Icon" size={16} /> Upload
                    </p>
                    <div className="flex items-baseline gap-3 mt-auto">
                      <span className="text-6xl sm:text-8xl font-black italic tracking-tighter text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">{results.upload}</span>
                      <span className="text-2xl font-black uppercase tracking-widest text-slate-400 ml-1">Mbps</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white/5 backdrop-blur-md p-6 sm:p-8 rounded-[2rem] border border-white/10 shadow-xl flex flex-col justify-center items-center text-center hover:bg-white/10 transition-colors relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-transparent pointer-events-none" />
                  <HugeIconPicker name="activity01Icon" size={28} className="text-teal-400 mb-4 drop-shadow-[0_0_8px_currentColor]"/>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Latency</p>
                  <div className="flex items-baseline gap-1.5"><span className="text-4xl font-black text-white">{results.ping}</span><span className="text-xs font-black uppercase tracking-widest text-slate-400">ms</span></div>
                </div>
                <div className="bg-white/5 backdrop-blur-md p-6 sm:p-8 rounded-[2rem] border border-white/10 shadow-xl flex flex-col justify-center items-center text-center hover:bg-white/10 transition-colors relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-bl from-emerald-500/5 to-transparent pointer-events-none" />
                  <HugeIconPicker name="shield01Icon" size={28} className="text-emerald-400 mb-4 drop-shadow-[0_0_8px_currentColor]"/>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Jitter</p>
                  <div className="flex items-baseline gap-1.5"><span className="text-4xl font-black text-white">{results.jitter}</span><span className="text-xs font-black uppercase tracking-widest text-slate-400">ms</span></div>
                </div>
              </div>

              <div className={`${healthScore.bg} backdrop-blur-md border ${healthScore.border} p-6 sm:p-8 rounded-[2rem] text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl`}>
                <div className="flex items-center gap-6 w-full sm:w-auto">
                  <div className={`w-16 h-16 bg-white/5 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10 shadow-inner shrink-0 ${healthScore.glow}`}>
                    <HugeIconPicker name="heartPulseIcon" size={32} className={`${healthScore.color} ${healthScore.dropShadow}`}/>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1">Network Health</p>
                    <h4 className={`text-2xl font-black uppercase tracking-wider ${healthScore.color} ${healthScore.dropShadow}`}>{healthScore.label} Connection</h4>
                  </div>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                  <button onClick={startFullTest} className="flex-1 sm:flex-none px-8 py-4 bg-teal-500 text-slate-950 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-teal-400 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(20,184,166,0.3)] hover:shadow-[0_0_30px_rgba(20,184,166,0.5)]">
                    <HugeIconPicker name="arrowReloadHorizontalIcon" size={16}/> Retest
                  </button>
                  <button onClick={()=>setShowShare(true)} className="flex-1 sm:flex-none px-8 py-4 bg-white/5 text-white border border-white/10 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                    <HugeIconPicker name="share01Icon" size={16}/> Share
                  </button>
                </div>
              </div>
            </div>
          )}

          {stage!==TEST_STAGES.COMPLETED && (
            <div className="bg-slate-900/40 backdrop-blur-xl rounded-[3rem] p-6 sm:p-8 md:p-14 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden flex flex-col items-center justify-center min-h-[400px] sm:min-h-[450px] md:min-h-[550px]">
              
              {stage!==TEST_STAGES.IDLE && (
                <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-900/80">
                  <div className="h-full bg-teal-400 transition-all duration-300 shadow-[0_0_15px_currentColor]" style={{width:`${progress}%`}}/>
                </div>
              )}
              
              {stage===TEST_STAGES.IDLE ? (
                <div className="text-center animate-in zoom-in-95 duration-500">
                  <div className="relative group">
                    {/* Glowing pulse rings */}
                    <div className="absolute inset-0 rounded-full bg-teal-500/20 blur-2xl group-hover:bg-teal-500/30 transition-colors duration-500" />
                    <div className="absolute -inset-8 rounded-full border border-teal-500/20 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite] pointer-events-none" />
                    <div className="absolute -inset-16 rounded-full border border-teal-500/10 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite_1s] pointer-events-none" />
                    
                    <button onClick={startFullTest} className="relative w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 text-slate-950 flex flex-col items-center justify-center shadow-[0_0_50px_rgba(20,184,166,0.5)] group-active:scale-95 transition-all overflow-hidden border border-teal-300/50">
                      <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span className="text-6xl md:text-8xl font-black italic tracking-tighter drop-shadow-[0_2px_10px_rgba(0,0,0,0.3)]">GO</span>
                    </button>
                  </div>
                  <div className="mt-14 space-y-3">
                    <div className="px-5 py-2.5 bg-white/5 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest shadow-inner inline-flex items-center gap-2 border border-white/10 text-white">
                      <HugeIconPicker name="routerIcon" size={14} className="text-teal-400"/> {activeProfile.name}
                    </div>
                    <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest block">Node: <span className="text-white">{activeServer.name}</span></p>
                  </div>
                </div>
              ) : (
                <div className="w-full max-w-3xl text-center">
                  <div className="mb-8 flex items-center justify-center gap-3">
                    <div className={`w-3 h-3 rounded-full shadow-[0_0_10px_currentColor] animate-pulse ${stage===TEST_STAGES.DOWNLOAD?'bg-teal-400 text-teal-400':'bg-indigo-400 text-indigo-400'}`}/>
                    <span className="text-xs font-black uppercase tracking-[0.3em] text-slate-300">{stage.replace('_',' ')}</span>
                  </div>
                  <div className="flex items-baseline justify-center mb-12">
                    <span className="text-7xl sm:text-8xl md:text-[10rem] font-black tabular-nums tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-slate-500 drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                      {currentSpeed>0?currentSpeed.toFixed(1):'...'}
                    </span>
                    <span className="text-2xl sm:text-4xl md:text-5xl font-black text-teal-400 italic ml-4 tracking-tighter drop-shadow-[0_0_15px_rgba(45,212,191,0.5)]">Mbps</span>
                  </div>
                  <div className="h-48 md:h-64 w-full px-4 relative">
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-slate-900/50 to-transparent pointer-events-none z-10" />
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={graphData}>
                        <defs>
                          <linearGradient id="gDark" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={stage===TEST_STAGES.DOWNLOAD?'#2dd4bf':'#818cf8'} stopOpacity={0.6}/>
                            <stop offset="95%" stopColor={stage===TEST_STAGES.DOWNLOAD?'#2dd4bf':'#818cf8'} stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey="speed" stroke={stage===TEST_STAGES.DOWNLOAD?'#2dd4bf':'#818cf8'} strokeWidth={4} fill="url(#gDark)" isAnimationActive={false} style={{filter:'drop-shadow(0 0 10px rgba(45,212,191,0.5))'}}/>
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="bg-slate-900/50 backdrop-blur-md p-6 rounded-3xl border border-white/10 flex items-center justify-between shadow-xl group hover:bg-slate-900 transition-colors">
              <div className="flex items-center gap-5 min-w-0">
                <div className="p-3.5 bg-white/5 rounded-2xl shadow-inner border border-white/10 shrink-0 group-hover:bg-teal-500/10 group-hover:border-teal-500/30 transition-colors"><HugeIconPicker name="globe02Icon" size={24} className="text-teal-400"/></div>
                <div className="min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Your Provider</p>
                  <p className="text-sm font-black text-white uppercase tracking-wider truncate">{ipInfo.isp.split(',')[0]} {ipInfo.city?`(${ipInfo.city})`:''}</p>
                </div>
              </div>
              <div className="text-right shrink-0 ml-4 hidden sm:block">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 whitespace-nowrap mb-1">External IP</p>
                <p className="text-[11px] font-mono font-bold bg-slate-950 text-teal-400 px-3 py-1.5 rounded-lg border border-white/10">{ipInfo.ip}</p>
              </div>
            </div>
            
            <div className="bg-slate-900/50 backdrop-blur-md p-6 rounded-3xl border border-white/10 flex items-center justify-between shadow-xl group hover:bg-slate-900 transition-colors">
              <div className="flex items-center gap-5 min-w-0">
                <div className="p-3.5 bg-white/5 rounded-2xl shadow-inner border border-white/10 shrink-0 group-hover:bg-indigo-500/10 group-hover:border-indigo-500/30 transition-colors"><HugeIconPicker name="location01Icon" size={24} className="text-indigo-400"/></div>
                <div className="min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Server Node</p>
                  <p className="text-sm font-black text-white uppercase tracking-wider truncate">{activeServer.name}</p>
                </div>
              </div>
              <button onClick={()=>setShowSettings(true)} className="text-[10px] font-black text-teal-400 bg-teal-500/10 border border-teal-500/20 px-3 py-1.5 rounded-lg uppercase tracking-widest hover:bg-teal-500 hover:text-slate-950 transition-colors shrink-0 ml-4">Change</button>
            </div>
          </div>

          {/* Mobile action buttons */}
          <div className="flex gap-4 md:hidden mt-4">
            <button onClick={()=>setShowHistory(true)} className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white/10 text-white transition-all">
              <HugeIconPicker name="historyIcon" size={18}/> History
            </button>
            <button onClick={()=>setShowSettings(true)} className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white/10 text-white transition-all">
              <HugeIconPicker name="settings01Icon" size={18}/> Settings
            </button>
          </div>
        </div>
      </main>

      <SettingsModal isOpen={showSettings} onClose={()=>setShowSettings(false)} PROFILES={PROFILES as any} SERVERS={SERVERS} activeProfile={activeProfile as any} setActiveProfile={setActiveProfile as any} activeServer={activeServer} setActiveServer={setActiveServer} />
      <HistoryModal isOpen={showHistory} onClose={()=>setShowHistory(false)} testHistory={testHistory as any} />
      <ShareModal isOpen={showShare} onClose={()=>setShowShare(false)} results={results} ipInfo={ipInfo} />
    </div>
  );
}
