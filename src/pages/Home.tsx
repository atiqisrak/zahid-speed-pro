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
    if(dl>100 && ping<20) return { label:'Excellent', color:'text-emerald-500' };
    if(dl>25) return { label:'Good', color:'text-blue-500' };
    return { label:'Unstable', color:'text-amber-500' };
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
    <div className="min-h-full bg-white text-slate-900 font-sans">
      <main className="max-w-6xl mx-auto p-4 md:p-8">
        <div className="flex flex-col gap-6">
          {stage===TEST_STAGES.COMPLETED && (
            <div className="animate-in zoom-in-95 fade-in duration-500 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-teal-600 text-white p-6 sm:p-8 rounded-[2rem] shadow-xl shadow-teal-500/20 relative overflow-hidden flex flex-col justify-between min-h-[140px]">
                  <div className="absolute top-0 right-0 p-6 opacity-10"><HugeIconPicker name="arrowDown01Icon" size={80}/></div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-teal-200 mb-2">Download</p>
                  <div className="flex items-baseline gap-2 mt-auto">
                    <span className="text-5xl sm:text-7xl font-black italic tracking-tighter">{results.download}</span>
                    <span className="text-xl font-bold text-teal-200 ml-1">Mbps</span>
                  </div>
                </div>
                <div className="bg-white border-2 border-slate-100 p-6 sm:p-8 rounded-[2rem] shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[140px]">
                  <div className="absolute top-0 right-0 p-6 opacity-5"><HugeIconPicker name="arrowUp01Icon" size={80}/></div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Upload</p>
                  <div className="flex items-baseline gap-2 mt-auto">
                    <span className="text-5xl sm:text-7xl font-black italic tracking-tighter text-slate-900">{results.upload}</span>
                    <span className="text-xl font-bold text-slate-400 ml-1">Mbps</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 flex flex-col justify-center items-center text-center">
                  <HugeIconPicker name="activity01Icon" size={24} className="text-teal-500 mb-3"/>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Latency</p>
                  <div className="flex items-baseline gap-1"><span className="text-3xl font-black">{results.ping}</span><span className="text-xs font-bold text-slate-400">ms</span></div>
                </div>
                <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 flex flex-col justify-center items-center text-center">
                  <HugeIconPicker name="shield01Icon" size={24} className="text-emerald-500 mb-3"/>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Jitter</p>
                  <div className="flex items-baseline gap-1"><span className="text-3xl font-black">{results.jitter}</span><span className="text-xs font-bold text-slate-400">ms</span></div>
                </div>
              </div>
              <div className="bg-teal-50 border border-teal-100 p-6 rounded-[2rem] text-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border border-teal-100 shadow-sm shrink-0">
                    <HugeIconPicker name="heartPulseIcon" size={24} className={healthScore.color}/>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Network Health</p>
                    <h4 className={`text-xl font-black ${healthScore.color}`}>{healthScore.label} Connection</h4>
                  </div>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <button onClick={startFullTest} className="flex-1 sm:flex-none px-6 py-4 sm:py-3 bg-teal-600 text-white rounded-2xl font-black text-xs hover:bg-teal-700 transition-all flex items-center justify-center gap-2 shadow-sm">
                    <HugeIconPicker name="arrowReloadHorizontalIcon" size={14}/> Retest
                  </button>
                  <button onClick={()=>setShowShare(true)} className="flex-1 sm:flex-none px-6 py-4 sm:py-3 bg-white text-teal-700 border border-teal-200 rounded-2xl font-black text-xs hover:bg-teal-50 transition-all flex items-center justify-center gap-2">
                    <HugeIconPicker name="share01Icon" size={14}/> Share
                  </button>
                </div>
              </div>
            </div>
          )}

          {stage!==TEST_STAGES.COMPLETED && (
            <div className="bg-slate-50 rounded-[2.5rem] p-4 sm:p-6 md:p-12 border border-slate-100 relative overflow-hidden flex flex-col items-center justify-center min-h-[350px] sm:min-h-[400px] md:min-h-[500px]">
              {stage!==TEST_STAGES.IDLE && (
                <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-200">
                  <div className="h-full bg-teal-600 transition-all duration-300" style={{width:`${progress}%`}}/>
                </div>
              )}
              {stage===TEST_STAGES.IDLE ? (
                <div className="text-center">
                  <button onClick={startFullTest} className="relative w-52 h-52 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-full bg-teal-600 text-white flex flex-col items-center justify-center shadow-2xl shadow-teal-500/30 active:scale-95 transition-all">
                    <span className="text-5xl md:text-6xl font-black italic tracking-tighter">GO</span>
                    <div className="absolute -inset-3 rounded-full border border-teal-600/20 animate-ping pointer-events-none"/>
                  </button>
                  <div className="mt-10 space-y-2">
                    <div className="px-4 py-1.5 bg-white rounded-full text-[10px] font-bold shadow-sm inline-flex items-center gap-2 border border-slate-100">
                      <HugeIconPicker name="routerIcon" size={12} className="text-teal-500"/> {activeProfile.name}
                    </div>
                    <p className="text-slate-400 text-xs font-medium block">Node: {activeServer.name}</p>
                  </div>
                </div>
              ) : (
                <div className="w-full max-w-2xl text-center">
                  <div className="mb-4 flex items-center justify-center gap-2">
                    <div className={`w-2 h-2 rounded-full animate-pulse ${stage===TEST_STAGES.DOWNLOAD?'bg-teal-500':'bg-emerald-500'}`}/>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">{stage.replace('_',' ')}</span>
                  </div>
                  <div className="flex items-baseline justify-center mb-10">
                    <span className="text-6xl sm:text-7xl md:text-9xl font-black tabular-nums tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-slate-900 to-slate-500">
                      {currentSpeed>0?currentSpeed.toFixed(1):'...'}
                    </span>
                    <span className="text-xl sm:text-4xl font-black text-teal-600 italic ml-2 md:ml-4 tracking-tighter">Mbps</span>
                  </div>
                  <div className="h-40 md:h-56 w-full px-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={graphData}>
                        <defs>
                          <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0d9488" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey="speed" stroke="#0d9488" strokeWidth={3} fill="url(#g1)" isAnimationActive={false}/>
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-4 min-w-0">
                <div className="p-2.5 bg-white rounded-xl shadow-sm border border-slate-100 shrink-0"><HugeIconPicker name="globe02Icon" size={18} className="text-teal-600"/></div>
                <div className="min-w-0">
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Your Provider</p>
                  <p className="text-sm font-bold truncate">{ipInfo.isp.split(',')[0]} {ipInfo.city?`(${ipInfo.city})`:''}</p>
                </div>
              </div>
              <div className="text-right shrink-0 ml-4">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 whitespace-nowrap">External IP</p>
                <p className="text-[11px] font-mono font-bold bg-white px-2 py-1 rounded border border-slate-100">{ipInfo.ip}</p>
              </div>
            </div>
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-4 min-w-0">
                <div className="p-2.5 bg-white rounded-xl shadow-sm border border-slate-100 shrink-0"><HugeIconPicker name="location01Icon" size={18} className="text-teal-600"/></div>
                <div className="min-w-0">
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Server Node</p>
                  <p className="text-sm font-bold truncate">{activeServer.name}</p>
                </div>
              </div>
              <button onClick={()=>setShowSettings(true)} className="text-[10px] font-black text-teal-600 uppercase tracking-widest hover:underline shrink-0 ml-4">Change</button>
            </div>
          </div>

          {/* Mobile action buttons */}
          <div className="flex gap-3 md:hidden">
            <button onClick={()=>setShowHistory(true)} className="flex-1 py-3 bg-slate-100 rounded-2xl font-black text-xs flex items-center justify-center gap-2">
              <HugeIconPicker name="historyIcon" size={16}/> History
            </button>
            <button onClick={()=>setShowSettings(true)} className="flex-1 py-3 bg-slate-100 rounded-2xl font-black text-xs flex items-center justify-center gap-2">
              <HugeIconPicker name="settings01Icon" size={16}/> Settings
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
