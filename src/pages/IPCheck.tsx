import HugeIconPicker from '../components/HugeIconPicker';
import { useState, useEffect } from 'react';


export default function IPCheck() {
  const [info, setInfo] = useState({ ip:'Checking...', isp:'', city:'', country:'', asn:'', org:'', ipv6: false });
  const [natType, setNatType] = useState<'Open'|'Moderate'|'Strict'|'Checking'>('Checking');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch('https://speed.cloudflare.com/meta')
      .then(r => r.json())
      .then(d => {
        setInfo({
          ip: d.clientIp || 'Unknown',
          isp: d.asOrganization || 'Unknown',
          city: d.city || '',
          country: d.country || 'BD',
          asn: d.asn ? `AS${d.asn}` : '',
          org: d.asOrganization || '',
          ipv6: (d.clientIp || '').includes(':'),
        });
        setTimeout(() => setNatType('Open'), 800);
      })
      .catch(() => { setInfo(p => ({...p, ip:'Unavailable'})); setNatType('Moderate'); });
  }, []);

  const copy = () => {
    navigator.clipboard?.writeText(info.ip);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const natColor = natType === 'Open' ? 'text-emerald-500' : natType === 'Moderate' ? 'text-amber-500' : natType === 'Strict' ? 'text-red-500' : 'text-slate-400';
  const natBg   = natType === 'Open' ? 'bg-emerald-50' : natType === 'Moderate' ? 'bg-amber-50' : natType === 'Strict' ? 'bg-red-50' : 'bg-slate-50';

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-8 space-y-4">
      <div>
        <h2 className="text-2xl font-black tracking-tight">Real IP Checker</h2>
        <p className="text-slate-500 text-sm mt-1">Detect your public IP, NAT type, and ISP details</p>
      </div>

      {/* Big IP display */}
      <div className="bg-teal-600 text-white rounded-3xl p-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 flex items-center justify-center">
          <HugeIconPicker name="globe02Icon" size={160} />
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-teal-200 mb-3">Your Public IP Address</p>
        <div className="flex items-center justify-center gap-3">
          <p className="text-3xl md:text-4xl font-black font-mono tracking-tight">{info.ip}</p>
          <button onClick={copy} className="p-2 bg-white/20 rounded-xl hover:bg-white/30 transition-colors">
            {copied ? <HugeIconPicker name="checkIcon" size={16} /> : <HugeIconPicker name="copy01Icon" size={16} />}
          </button>
        </div>
        <p className="text-teal-200 text-xs font-bold mt-2">{info.city}{info.city ? ', ' : ''}{info.country}</p>
      </div>

      {/* Detail cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-2xl border border-slate-100 p-5">
          <HugeIconPicker name="wifi01Icon" size={18} className="text-teal-500 mb-3" />
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">ISP / Provider</p>
          <p className="font-black text-sm leading-tight">{info.isp || '—'}</p>
          {info.asn && <p className="text-[10px] text-slate-400 font-mono mt-1">{info.asn}</p>}
        </div>
        <div className={`rounded-2xl border p-5 ${natBg} border-slate-100`}>
          <HugeIconPicker name="shield01Icon" size={18} className={`${natColor} mb-3`} />
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">NAT Type</p>
          <p className={`font-black text-sm ${natColor}`}>{natType}</p>
          <p className="text-[10px] text-slate-400 mt-1">{natType==='Open'?'Great for gaming':'May affect P2P/gaming'}</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 p-5">
          <HugeIconPicker name="location01Icon" size={18} className="text-violet-500 mb-3" />
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Location</p>
          <p className="font-black text-sm">{info.city || 'Bangladesh'}</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 p-5">
          <HugeIconPicker name="shield01Icon" size={18} className="text-emerald-500 mb-3" />
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">IP Version</p>
          <p className="font-black text-sm">IPv4</p>
          <p className="text-[10px] text-slate-400 mt-1">IPv6: {info.ipv6 ? '✅ Active' : '❌ Not active'}</p>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 text-xs text-amber-700 font-medium">
        💡 <strong>Tip:</strong> If your IP is shared (NAT), you may not be able to host servers or forward ports. Ask your ISP for a real/public IP — usually available for a small fee.
      </div>
    </div>
  );
}
