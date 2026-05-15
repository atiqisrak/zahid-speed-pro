import HugeIconPicker from '../components/HugeIconPicker';
import { NavLink } from 'react-router-dom';


const TOOLS = [
  { to: '/tools/ip-check', icon:'search01Icon',     title: 'Real IP Checker',       desc: 'Check your public IP, NAT type, IPv6 support and ISP details.', color: 'bg-teal-50 text-teal-600' },
  { to: '/tools/dns',      icon:'serverIcon',      title: 'DNS Benchmark',         desc: 'Compare DNS speed — Cloudflare vs Google vs your ISP DNS.', color: 'bg-violet-50 text-violet-600' },
  { to: '/tools/bandwidth',icon:'calculatorIcon', title: 'Bandwidth Calculator',  desc: 'How long to download a file? Can you stream 4K? Find out.', color: 'bg-emerald-50 text-emerald-600' },
  { to: '/',               icon:'wifi01Icon',       title: 'BDIX Speed Test',       desc: 'Run a speed test specifically against BDIX servers.', color: 'bg-amber-50 text-amber-600' },
];

export default function Tools() {
  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8 space-y-6">
      <div>
        <h2 className="text-2xl font-black tracking-tight">Network Tools</h2>
        <p className="text-slate-500 text-sm mt-1">Diagnostic tools for Bangladeshi internet users</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {TOOLS.map(t => (
          <NavLink key={t.to + t.title} to={t.to}
            className="bg-white rounded-3xl border border-slate-100 p-6 hover:border-teal-200 hover:shadow-md transition-all group">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-4 ${t.color}`}>
              <HugeIconPicker name={t.icon} size={20} />
            </div>
            <h3 className="font-black text-sm mb-1 group-hover:text-teal-600 transition-colors">{t.title}</h3>
            <p className="text-xs text-slate-500 leading-relaxed">{t.desc}</p>
          </NavLink>
        ))}
      </div>
    </div>
  );
}
