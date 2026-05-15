import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Zap, Database, Package, Wrench, AlertTriangle, Trophy, Globe, Map, BookOpen } from 'lucide-react';

const NAV_ITEMS = [
  { to:'/',         label:'Speed Test', icon:Zap,           exact:true  },
  { to:'/bdix',     label:'BDIX Hub',   icon:Database,      exact:false },
  { to:'/packages', label:'ISP Plans',  icon:Package,       exact:false },
  { to:'/tools',    label:'Tools',      icon:Wrench,        exact:false },
  { to:'/outages',  label:'Outages',    icon:AlertTriangle, exact:false },
  { to:'/rankings', label:'Rankings',   icon:Trophy,        exact:false },
  { to:'/coverage', label:'Coverage',   icon:Map,           exact:false },
  { to:'/blog',     label:'Blog',       icon:BookOpen,      exact:false },
];

export default function Layout() {
  const location = useLocation();

  const pageTitle = () => {
    if (location.pathname === '/')                        return 'Speed Test';
    if (location.pathname.startsWith('/bdix'))            return 'BDIX Hub';
    if (location.pathname.startsWith('/packages'))        return 'ISP Packages';
    if (location.pathname.startsWith('/tools'))           return 'Tools';
    if (location.pathname.startsWith('/outages'))         return 'Outage Reporter';
    if (location.pathname.startsWith('/rankings'))        return 'ISP Rankings';
    if (location.pathname.startsWith('/coverage'))        return 'Coverage Map';
    if (location.pathname.startsWith('/blog'))            return 'Blog';
    return 'Speed Pro';
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* ── Sidebar (desktop) ── */}
      <aside className="hidden md:flex flex-col w-56 bg-white border-r border-slate-100 shrink-0">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="bg-gradient-to-br from-indigo-600 to-teal-600 p-1.5 rounded-lg shadow-md shadow-indigo-500/20">
              <Zap size={16} className="text-white fill-white" />
            </div>
            <div>
              <h1 className="text-sm font-black tracking-tighter italic uppercase leading-none">
                Speed<span className="text-indigo-600">Pro</span>
              </h1>
              <p className="text-[8px] font-bold text-slate-400 tracking-[0.15em] uppercase">
                v1.0 Bangladesh
              </p>
            </div>
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map(({ to, label, icon: Icon, exact }) => (
            <NavLink
              key={to}
              to={to}
              end={exact}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={16} className={isActive ? 'text-indigo-600' : ''} />
                  {label}
                  {to === '/blog' && (
                    <span className="ml-auto text-[8px] font-black bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded-lg uppercase tracking-wider">
                      New
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-slate-100">
          <div className="flex items-center gap-1.5 text-[9px] text-slate-400 font-bold uppercase tracking-widest">
            <Globe size={10} />
            Mirpur, Dhaka, BD
          </div>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile header */}
        <header className="md:hidden sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 px-4 py-3 flex items-center gap-3">
          <div className="bg-gradient-to-br from-indigo-600 to-teal-600 p-1.5 rounded-lg">
            <Zap size={14} className="text-white fill-white" />
          </div>
          <div>
            <h1 className="text-sm font-black tracking-tighter italic uppercase leading-none">
              Speed<span className="text-indigo-600">Pro</span>
            </h1>
            <p className="text-[8px] font-bold text-slate-400 tracking-widest uppercase">{pageTitle()}</p>
          </div>
        </header>

        {/* Scrollable page content */}
        <main className="flex-1 overflow-y-auto pb-24 md:pb-0">
          <Outlet />
        </main>
      </div>

      {/* ── Bottom nav (mobile) — show 5 most important ── */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 bg-white/95 backdrop-blur-xl border-t border-slate-100 px-2 py-2 flex justify-around items-center safe-area-bottom">
        {NAV_ITEMS.slice(0, 5).map(({ to, label, icon: Icon, exact }) => (
          <NavLink
            key={to}
            to={to}
            end={exact}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all ${
                isActive ? 'text-indigo-600' : 'text-slate-400'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`p-1.5 rounded-lg ${isActive ? 'bg-indigo-50' : ''}`}>
                  <Icon size={18} />
                </div>
                <span className="text-[8px] font-black uppercase tracking-wider">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
