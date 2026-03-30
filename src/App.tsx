import React, { useEffect, useMemo, useState, useRef } from 'react';
import { toPng } from 'html-to-image';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';
import {
  ArrowDown,
  ArrowUp,
  Activity,
  RefreshCw,
  Share2,
  ShieldCheck,
  Globe,
  History as HistoryIcon,
  Settings as SettingsIcon,
  Copy,
  Check,
  X,
  Zap,
  MapPin,
  Smartphone,
  Router,
  HeartPulse
} from 'lucide-react';

const CHUNK_SIZES = [0.25, 0.5, 1, 2, 4, 8, 16, 32] as const;

const TEST_STAGES = {
  IDLE: 'IDLE',
  LATENCY: 'LATENCY',
  DOWNLOAD: 'DOWNLOAD',
  UPLOAD: 'UPLOAD',
  COMPLETED: 'COMPLETED'
} as const;

type TestStage = (typeof TEST_STAGES)[keyof typeof TEST_STAGES];

type Profile = {
  id: 'real' | 'broadband' | 'fiber';
  name: string;
  desc: string;
  dl: number;
  ul: number;
  p: number;
  j: number;
};

type Server = {
  id: number;
  name: string;
  provider: string;
};

type Results = {
  ping: number | string;
  jitter: number | string;
  download: number | string;
  upload: number | string;
};

type GraphPoint = { time: string; speed: number };

type HistoryEntry = {
  id: number;
  date: string;
  download: string;
  upload: string;
  ping: Results['ping'];
  profile: Profile['id'];
};

const PROFILES: Profile[] = [
  { id: 'real', name: 'Mobile Log', desc: '2-10 Mbps / High Jitter', dl: 2.1, ul: 9.2, p: 49, j: 249 },
  { id: 'broadband', name: 'Standard Broadband', desc: '25-50 Mbps', dl: 45, ul: 20, p: 25, j: 5 },
  { id: 'fiber', name: 'Zahid Fiber Pro', desc: '300+ Mbps Ultra-low latency', dl: 350, ul: 150, p: 4, j: 1 }
];

const SERVERS: Server[] = [
  { id: 1, name: 'Singapore 2', provider: 'Zahid Cloud-SG' },
  { id: 2, name: 'Ashburn, VA', provider: 'Zahid Cloud-US' },
  { id: 3, name: 'London, UK', provider: 'Zahid Cloud-EU' }
];

const STORAGE_KEY = 'zahid_speed_history_v3';

function copyText(text: string) {
  if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(text);
  const el = document.createElement('textarea');
  el.value = text;
  el.setAttribute('readonly', 'true');
  el.style.position = 'fixed';
  el.style.left = '-9999px';
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
  return Promise.resolve();
}

const App = () => {
  const [stage, setStage] = useState<TestStage>(TEST_STAGES.IDLE);
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [results, setResults] = useState<Results>({ ping: 0, jitter: 0, download: 0, upload: 0 });
  const [graphData, setGraphData] = useState<GraphPoint[]>([]);
  const [testHistory, setTestHistory] = useState<HistoryEntry[]>([]);
  const [progress, setProgress] = useState(0);
  const [activeServer, setActiveServer] = useState<Server>(SERVERS[0]);
  const [activeProfile, setActiveProfile] = useState<Profile>(PROFILES[1]);

  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [copied, setCopied] = useState(false);
  const shareCardRef = useRef<HTMLDivElement>(null);

  const downloadImage = async () => {
    if (!shareCardRef.current) return;
    try {
      const dataUrl = await toPng(shareCardRef.current, { backgroundColor: '#ffffff', pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = `Speed_Result_${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch(err) {
      console.error(err);
    }
  };

  const [ipInfo, setIpInfo] = useState({ ip: '...', isp: 'Fetching...', city: '' });
  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

  useEffect(() => {
    fetch('https://speed.cloudflare.com/meta')
      .then((res) => res.json())
      .then((data) => {
        if (data.clientIp) setIpInfo({ ip: data.clientIp, isp: data.asOrganization || 'Unknown ISP', city: data.city || '' });
      })
      .catch(() => setIpInfo({ ip: 'Unknown', isp: 'Unknown Provider', city: '' }));
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved) as HistoryEntry[];
      if (Array.isArray(parsed)) setTestHistory(parsed);
    } catch {
      // ignore invalid storage
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(testHistory));
  }, [testHistory]);

  const healthScore = useMemo(() => {
    const dl = typeof results.download === 'string' ? Number(results.download) : results.download;
    const ping = typeof results.ping === 'string' ? Number(results.ping) : results.ping;
    if (dl > 100 && ping < 20) return { label: 'Excellent', color: 'text-emerald-500' as const };
    if (dl > 25) return { label: 'Good', color: 'text-blue-500' as const };
    return { label: 'Unstable', color: 'text-amber-500' as const };
  }, [results.download, results.ping]);

  const simulateLatency = async () => {
    setStage(TEST_STAGES.LATENCY);
    const pings: number[] = [];
    const pingUrl = `/?t=${Date.now()}`;
    
    for (let i = 0; i < 10; i++) {
        const start = performance.now();
        try {
          await fetch(pingUrl, { method: 'HEAD', cache: 'no-store' });
        } catch (e) {
          // ignore
        }
        pings.push(performance.now() - start);
        setProgress((i + 1) * (100 / 10));
    }
    const validPings = pings.filter(p => p > 0);
    const avgPing = validPings.length ? validPings.reduce((a, b) => a + b, 0) / validPings.length : 0;
    let jitter = 0;
    if (validPings.length > 1) {
        let jitterSum = 0;
        for (let i = 1; i < validPings.length; i++) {
            jitterSum += Math.abs(validPings[i] - validPings[i - 1]);
        }
        jitter = jitterSum / (validPings.length - 1);
    }
    setResults((prev) => ({ ...prev, ping: avgPing.toFixed(0), jitter: jitter.toFixed(1) }));
  };

  const runSpeedTest = async (type: 'download' | 'upload') => {
    setStage(type === 'download' ? TEST_STAGES.DOWNLOAD : TEST_STAGES.UPLOAD);
    setProgress(0);
    setGraphData([]);

    return new Promise<string>((resolve) => {
      const testDuration = 10000; // 10 seconds
      const startTime = performance.now();
      const localGraphData: GraphPoint[] = [];

      let totLoaded = 0;
      let prevLoadedMap = new Map<number, number>();
      
      const xhrs: XMLHttpRequest[] = [];
      const streamsCount = type === 'download' ? 4 : 2;
      let isDone = false;
      let smoothedSpeed = 0;

      const finish = () => {
        if (isDone) return;
        isDone = true;
        xhrs.forEach((xhr) => {
          try {
            xhr.onload = null;
            xhr.onerror = null;
            if(xhr.upload) xhr.upload.onprogress = null;
            xhr.onprogress = null;
            xhr.abort();
          } catch (e) {}
        });
        
        const recent = localGraphData.slice(-5);
        const avg = recent.length ? (recent.reduce((a, b) => a + b.speed, 0) / recent.length) : 0;
        const finalSpeed = avg.toFixed(1);
        setResults((prev) => ({ ...prev, [type]: finalSpeed }));
        setCurrentSpeed(0);
        resolve(finalSpeed);
      };

      const startStream = (id: number) => {
        if (isDone) return;
        const xhr = new XMLHttpRequest();
        xhrs[id] = xhr;
        prevLoadedMap.set(id, 0);

        if (type === 'download') {
          xhr.onprogress = (e) => {
            if (isDone) return;
            const prev = prevLoadedMap.get(id) || 0;
            const diff = e.loaded - prev;
            if (diff > 0) totLoaded += diff;
            prevLoadedMap.set(id, e.loaded);
          };
          const dlUrl = `/garbage.dat?t=${Math.random()}`;
          xhr.onload = () => startStream(id);
          xhr.onerror = () => startStream(id);
          xhr.responseType = 'arraybuffer';
          xhr.open('GET', dlUrl, true);
          xhr.send();
        } else {
          xhr.upload.onprogress = (e) => {
            if (isDone) return;
            const prev = prevLoadedMap.get(id) || 0;
            const diff = e.loaded - prev;
            if (diff > 0) totLoaded += diff;
            prevLoadedMap.set(id, e.loaded);
          };
          const upUrl = `/api/upload?t=${Math.random()}`;
          xhr.onload = () => startStream(id);
          xhr.onerror = () => startStream(id);
          xhr.open('POST', upUrl, true);
          
          const blobSize = 3.5 * 1024 * 1024;
          const buffer = new ArrayBuffer(blobSize);
          const view = new Uint32Array(buffer);
          view[0] = Math.random() * 0xFFFFFFFF;
          const blob = new Blob([buffer], { type: 'text/plain' });
          xhr.send(blob);
        }
      };

      for (let i = 0; i < streamsCount; i++) {
        setTimeout(() => startStream(i), i * 200);
      }

      let lastTime = startTime;
      let lastLoaded = 0;

      const interval = setInterval(() => {
        if (isDone) {
          clearInterval(interval);
          return;
        }
        const now = performance.now();
        const durationSec = (now - startTime) / 1000;
        
        if (durationSec > (testDuration / 1000)) {
          clearInterval(interval);
          finish();
          return;
        }

        setProgress((durationSec / (testDuration / 1000)) * 100);

        const loadedSinceLast = totLoaded - lastLoaded;
        const timeSinceLast = (now - lastTime) / 1000;
        
        if (timeSinceLast > 0 && totLoaded > 0) {
          const overhead = 1.05; 
          let speedMbps = ((loadedSinceLast * 8 * overhead) / timeSinceLast) / 1000000;
          
          speedMbps = speedMbps / 100;
          
          if (speedMbps > 0) {
              smoothedSpeed = smoothedSpeed > 0 ? (smoothedSpeed * 0.4 + speedMbps * 0.6) : speedMbps;
              setCurrentSpeed(smoothedSpeed);
              localGraphData.push({ time: durationSec.toFixed(1), speed: smoothedSpeed });
              setGraphData([...localGraphData]);
          }
        }
        lastTime = now;
        lastLoaded = totLoaded;
      }, 200);
    });
  };

  const startFullTest = async () => {
    setResults({ ping: 0, jitter: 0, download: 0, upload: 0 });
    await simulateLatency();
    const dl = await runSpeedTest('download');
    const ul = await runSpeedTest('upload');
    setStage(TEST_STAGES.COMPLETED);

    const newEntry: HistoryEntry = {
      id: Date.now(),
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      download: dl,
      upload: ul,
      ping: results.ping,
      profile: activeProfile.id
    };
    setTestHistory((prev) => [newEntry, ...prev].slice(0, 10));
  };

  const copyToClipboard = async () => {
    const text = `Zahid Speed Pro\nDL: ${results.download} Mbps | UL: ${results.upload} Mbps\nPing: ${results.ping}ms\nTested via ${activeServer.name}`;
    await copyText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  const Modal = ({
    isOpen,
    onClose,
    title,
    children
  }: {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
  }) => {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="bg-white w-full max-w-lg rounded-t-[2.5rem] sm:rounded-[2rem] overflow-hidden shadow-2xl border-t sm:border border-slate-200 max-h-[90vh] flex flex-col">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center shrink-0">
            <h3 className="text-xl font-black tracking-tight text-slate-900">{title}</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-900"
            >
              <X size={20} />
            </button>
          </div>
          <div className="p-6 overflow-y-auto custom-scrollbar flex-1">{children}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="selection:bg-indigo-100 bg-white">
      <div className="min-h-screen bg-white text-slate-900 font-sans pb-24 md:pb-8">
        <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 px-4 py-4 md:px-8">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-500/20">
                <Zap size={20} className="text-white fill-white" />
              </div>
              <div>
                <h1 className="text-lg font-black tracking-tighter leading-none italic uppercase">
                  Ishrak <span className="text-indigo-600">Speed Pro</span>
                </h1>
                <p className="text-[9px] font-bold text-slate-400 tracking-[0.2em] uppercase mt-0.5">
                  V5.1 Adaptive
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowSettings(true)}
                className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 hidden md:block text-slate-900"
                aria-label="Settings"
              >
                <SettingsIcon size={18} />
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto p-4 md:p-8">
          <div className="flex flex-col gap-6">
            {stage === TEST_STAGES.COMPLETED && (
              <div className="animate-in slide-in-from-top-4 fade-in duration-500 space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: 'Download', val: results.download, unit: 'Mbps', icon: ArrowDown },
                    { label: 'Upload', val: results.upload, unit: 'Mbps', icon: ArrowUp },
                    { label: 'Latency', val: results.ping, unit: 'ms', icon: Activity },
                    { label: 'Jitter', val: results.jitter, unit: 'ms', icon: ShieldCheck }
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm text-center"
                    >
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                        {stat.label}
                      </p>
                      <div className="flex items-baseline justify-center gap-0.5">
                        <span className="text-xl font-black">{stat.val}</span>
                        <span className="text-[8px] font-bold text-slate-400">{stat.unit}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-[2rem] text-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border border-indigo-100 shadow-sm">
                      <HeartPulse size={24} className={healthScore.color} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Network Health</p>
                      <h4 className={`text-xl font-black ${healthScore.color}`}>
                        {healthScore.label} Connection
                      </h4>
                    </div>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button
                      onClick={startFullTest}
                      className="flex-1 sm:flex-none px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black text-xs hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-sm"
                    >
                      <RefreshCw size={14} /> Retest
                    </button>
                    <button
                      onClick={() => setShowShare(true)}
                      className="flex-1 sm:flex-none px-6 py-3 bg-white text-indigo-700 border border-indigo-200 rounded-2xl font-black text-xs hover:bg-indigo-50 transition-all flex items-center justify-center gap-2"
                    >
                      <Share2 size={14} /> Share
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div
              className={`bg-slate-50 rounded-[2.5rem] p-6 md:p-12 transition-all duration-700 border border-slate-100 relative overflow-hidden flex flex-col items-center justify-center min-h-[400px] md:min-h-[500px] ${
                stage === TEST_STAGES.COMPLETED ? 'opacity-70 grayscale-[0.5] scale-[0.98]' : ''
              }`}
            >
              {stage !== TEST_STAGES.IDLE && stage !== TEST_STAGES.COMPLETED && (
                <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-200">
                  <div className="h-full bg-indigo-600 transition-all duration-300" style={{ width: `${progress}%` }} />
                </div>
              )}

              {stage === TEST_STAGES.IDLE ? (
                <div className="text-center group">
                  <button
                    onClick={startFullTest}
                    className="relative w-52 h-52 md:w-64 md:h-64 rounded-full bg-indigo-600 text-white flex flex-col items-center justify-center shadow-2xl shadow-indigo-500/30 active:scale-95 transition-all"
                  >
                    <span className="text-5xl md:text-6xl font-black italic tracking-tighter">GO</span>
                    <div className="absolute -inset-3 rounded-full border border-indigo-600/20 animate-ping pointer-events-none" />
                  </button>
                  <div className="mt-10 space-y-2">
                    <div className="px-4 py-1.5 bg-white rounded-full text-[10px] font-bold shadow-sm inline-flex items-center gap-2 border border-slate-100">
                      <Router size={12} className="text-indigo-500" /> {activeProfile.name}
                    </div>
                    <p className="text-slate-400 text-xs font-medium block">Node: {activeServer.name}</p>
                  </div>
                </div>
              ) : (
                <div className="w-full max-w-2xl text-center">
                  <div className="mb-4 flex items-center justify-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full animate-pulse ${
                        stage === TEST_STAGES.DOWNLOAD ? 'bg-indigo-500' : 'bg-emerald-500'
                      }`}
                    />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                      {stage.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-center mb-10">
                    <span className="text-7xl md:text-9xl font-black tabular-nums tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-slate-900 to-slate-500">
                      {currentSpeed > 0 ? currentSpeed.toFixed(1) : stage === TEST_STAGES.COMPLETED ? '0.0' : '...'}
                    </span>
                    <span className="text-2xl md:text-4xl font-black text-indigo-600 italic ml-2 md:ml-4 tracking-tighter">
                      Mbps
                    </span>
                  </div>

                  <div className="h-40 md:h-56 w-full px-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={graphData}>
                        <defs>
                          <linearGradient id="mainGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <Area
                          type="monotone"
                          dataKey="speed"
                          stroke="#4f46e5"
                          strokeWidth={3}
                          fill="url(#mainGradient)"
                          isAnimationActive={false}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  {stage === TEST_STAGES.COMPLETED && (
                    <div className="mt-6 flex flex-col items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500 opacity-60">
                        Session Standby
                      </span>
                      <div className="text-[10px] text-slate-400 max-w-[200px] leading-relaxed">
                        System monitoring remains active. Click "Retest" above to refresh data.
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-white rounded-xl shadow-sm border border-slate-100">
                    <Globe size={18} className="text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Your Provider</p>
                    <p className="text-sm font-bold">{ipInfo.isp.split(',')[0]} {ipInfo.city ? `(${ipInfo.city})` : ''}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">External IP</p>
                  <p className="text-[11px] font-mono font-bold bg-white px-2 py-1 rounded border border-slate-100">
                    {ipInfo.ip}
                  </p>
                </div>
              </div>
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-white rounded-xl shadow-sm border border-slate-100">
                    <MapPin size={18} className="text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Server Node</p>
                    <p className="text-sm font-bold">{activeServer.name}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowSettings(true)}
                  className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline"
                >
                  Change
                </button>
              </div>
            </div>
          </div>
        </main>

        <nav className="fixed bottom-0 left-0 w-full z-50 md:hidden bg-white/95 backdrop-blur-xl border-t border-slate-100 px-8 py-4 flex justify-between items-center safe-area-bottom">
          <button onClick={startFullTest} className="flex flex-col items-center gap-1 group">
            <div className="p-2 rounded-xl group-active:bg-slate-100 transition-colors">
              <Zap size={22} className={stage === TEST_STAGES.IDLE ? 'text-indigo-600' : 'text-slate-400'} />
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest">Test</span>
          </button>
          <button onClick={() => setShowHistory(true)} className="flex flex-col items-center gap-1 group">
            <div className="p-2 rounded-xl group-active:bg-slate-100 transition-colors">
              <HistoryIcon size={22} className="text-slate-400" />
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest">History</span>
          </button>
          <button onClick={() => setShowSettings(true)} className="flex flex-col items-center gap-1 group">
            <div className="p-2 rounded-xl group-active:bg-slate-100 transition-colors">
              <SettingsIcon size={22} className="text-slate-400" />
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest">Setup</span>
          </button>
        </nav>

        <Modal isOpen={showSettings} onClose={() => setShowSettings(false)} title="Engine Configuration">
          <div className="space-y-6 pb-6">
            <section>
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 flex items-center gap-2">
                <Smartphone size={14} /> Profile Simulation
              </h4>
              <div className="space-y-3">
                {PROFILES.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setActiveProfile(p);
                      setShowSettings(false);
                    }}
                    className={`w-full p-5 rounded-3xl text-left border-2 transition-all ${
                      activeProfile.id === p.id
                        ? 'border-indigo-600 bg-indigo-50'
                        : 'border-slate-100'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-black text-sm">{p.name}</span>
                      {activeProfile.id === p.id && <Check size={16} className="text-indigo-600" />}
                    </div>
                    <p className="text-[10px] font-bold opacity-50 uppercase tracking-tighter">{p.desc}</p>
                  </button>
                ))}
              </div>
            </section>

            <section>
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 flex items-center gap-2">
                <Globe size={14} /> Edge Node
              </h4>
              <div className="grid grid-cols-1 gap-2">
                {SERVERS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setActiveServer(s);
                      setShowSettings(false);
                    }}
                    className={`p-4 rounded-2xl border ${
                      activeServer.id === s.id ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 border-slate-100 text-slate-900'
                    }`}
                  >
                    <div className="font-bold text-xs">{s.name}</div>
                  </button>
                ))}
              </div>
            </section>
          </div>
        </Modal>

        <Modal isOpen={showHistory} onClose={() => setShowHistory(false)} title="Test History">
          <div className="space-y-3 pb-8">
            {testHistory.length === 0 ? (
              <div className="text-center py-10 opacity-30">
                <HistoryIcon size={32} className="mx-auto mb-2" />
                <p className="text-[10px] font-bold uppercase tracking-widest">No Logs Found</p>
              </div>
            ) : (
              testHistory.map((h) => (
                <div
                  key={h.id}
                  className="p-4 bg-slate-50 rounded-3xl flex justify-between items-center border border-slate-100"
                >
                  <div>
                    <div className="text-lg font-black">
                      {h.download} <span className="text-[10px] text-slate-400 uppercase">Mbps</span>
                    </div>
                    <div className="text-[9px] font-bold text-slate-400">{h.date}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-black uppercase tracking-tighter text-indigo-600">
                      {h.ping}ms / {h.upload} Up
                    </div>
                    <div className="text-[8px] font-bold text-slate-400 uppercase">{h.profile}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Modal>

        <Modal isOpen={showShare} onClose={() => setShowShare(false)} title="Export Diagnosis">
          <div className="text-center space-y-6 pb-8">
            <div ref={shareCardRef} className="bg-white rounded-[2.5rem] p-10 text-slate-900 border-2 border-slate-200 shadow-lg relative">
              <div className="absolute top-6 right-8 opacity-20">
                 <Zap size={40} className="fill-indigo-600 text-indigo-600" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-4">Zahid Speed Pro</p>
              <div className="text-7xl font-black italic tracking-tighter mb-2 text-indigo-600">{results.download}</div>
              <div className="text-indigo-600 font-black uppercase text-xs tracking-widest mb-10">Mbps Download</div>
              
              <div className="grid grid-cols-3 gap-2 pt-8 border-t border-slate-100">
                <div className="text-left">
                  <p className="text-[9px] text-slate-400 uppercase font-black">Upload</p>
                  <p className="font-black text-[13px]">{results.upload} Mbps</p>
                </div>
                <div className="text-center">
                  <p className="text-[9px] text-slate-400 uppercase font-black">Latency</p>
                  <p className="font-black text-[13px]">{results.ping} ms</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] text-slate-400 uppercase font-black">Provider</p>
                  <p className="font-black text-[11px] truncate" title={ipInfo.isp}>{ipInfo.isp.split(' ')[0]}</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={downloadImage}
                className="w-full py-4 rounded-2xl font-black flex items-center justify-center gap-2 bg-slate-900 text-white shadow-lg shadow-slate-900/20 transition-all hover:scale-[0.98]"
              >
                Download Image
              </button>
              <button
                onClick={copyToClipboard}
                className={`w-full py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-all hover:scale-[0.98] ${
                  copied ? 'bg-emerald-500 text-white' : 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                }`}
              >
                {copied ? (
                  <>
                    <Check size={18} /> Copied
                  </>
                ) : (
                  <>
                    <Copy size={18} /> Copy Text
                  </>
                )}
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default App;

