import { useState } from 'react';
import { AlertTriangle, CheckCircle, Clock, Send } from 'lucide-react';

const ISPS = ['MirpurNet', 'MNET', 'BAS Network', 'Info ISP', 'Mirpur Online', 'Inspire Broadband', 'Other'];
const AREAS = ['Section 1','Section 2','Section 6','Section 7','Section 10','Section 11','Section 12','Section 13','Section 14','Pallabi','Kazipara','DOHS'];

const FEED = [
  { isp:'MNET', area:'Section 13', time:'18 min ago', users:14, resolved:false },
  { isp:'MirpurNet', area:'Section 10', time:'2 hrs ago', users:31, resolved:true },
  { isp:'Info ISP', area:'Section 12', time:'5 hrs ago', users:7, resolved:true },
];

export default function Outages() {
  const [isp, setIsp] = useState('');
  const [area, setArea] = useState('');
  const [sent, setSent] = useState(false);

  const submit = () => { if (isp && area) setSent(true); };

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8 space-y-6">
      <div>
        <h2 className="text-2xl font-black tracking-tight">Outage Reporter</h2>
        <p className="text-slate-500 text-sm mt-1">Community-powered real-time ISP outage tracking for Mirpur</p>
      </div>

      {/* Report form */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 space-y-4">
        <h3 className="font-black text-sm uppercase tracking-wider flex items-center gap-2">
          <AlertTriangle size={16} className="text-amber-500" /> Report an Outage
        </h3>
        {sent ? (
          <div className="flex items-center gap-3 py-4 text-emerald-600">
            <CheckCircle size={24} />
            <p className="font-bold">Report submitted! Thank you for helping the community.</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Your ISP</label>
                <select value={isp} onChange={e => setIsp(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-medium bg-slate-50 focus:outline-none focus:border-teal-400">
                  <option value="">Select ISP</option>
                  {ISPS.map(i => <option key={i}>{i}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Your Area</label>
                <select value={area} onChange={e => setArea(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-medium bg-slate-50 focus:outline-none focus:border-teal-400">
                  <option value="">Select Area</option>
                  {AREAS.map(a => <option key={a}>{a}</option>)}
                </select>
              </div>
            </div>
            <button onClick={submit}
              className="w-full py-3 bg-teal-600 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-teal-700 transition-colors">
              <Send size={16} /> Submit Report
            </button>
          </div>
        )}
      </div>

      {/* Live feed */}
      <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
          <Clock size={16} className="text-teal-500" />
          <span className="font-black text-sm uppercase tracking-wider">Live Outage Feed</span>
          <span className="ml-auto text-[10px] font-bold text-slate-400 uppercase">Mirpur, Dhaka</span>
        </div>
        <div className="divide-y divide-slate-50">
          {FEED.map((f, i) => (
            <div key={i} className="flex items-center px-6 py-4 gap-4">
              <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${f.resolved ? 'bg-emerald-400' : 'bg-red-500 animate-pulse'}`} />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm">{f.isp} <span className="text-slate-400 font-medium">· {f.area}</span></p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{f.users} users reported · {f.time}</p>
              </div>
              <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-lg ${f.resolved ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                {f.resolved ? 'Resolved' : 'Active'}
              </span>
            </div>
          ))}
        </div>
      </div>
      <p className="text-center text-xs text-slate-400">BTRC Hotline: <a href="tel:100" className="font-bold text-teal-600">100</a> · Email: btrc@btrc.gov.bd</p>
    </div>
  );
}
