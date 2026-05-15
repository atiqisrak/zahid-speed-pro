import React, { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import HugeIconPicker from './HugeIconPicker';

const NAV_ITEMS = [
  { to:'/',         label:'Speed Test', icon:'zapIcon',           exact:true  },
  { to:'/bdix',     label:'BDIX Hub',   icon:'database01Icon',    exact:false },
  { to:'/packages', label:'ISP Plans',  icon:'packageIcon',       exact:false },
  { to:'/tools',    label:'Tools',      icon:'wrench01Icon',      exact:false },
  { to:'/outages',  label:'Outages',    icon:'alert01Icon',       exact:false },
  { to:'/rankings', label:'Rankings',   icon:'trophy01Icon',      exact:false },
  { to:'/coverage', label:'Coverage',   icon:'map01Icon',         exact:false },
  { to:'/isp-finder', label:'ISP Finder', icon:'location01Icon',  exact:false },
  { to:'/blog',     label:'Blog',       icon:'book01Icon',        exact:false },
];

export default function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
      {/* ── Top Navigation Bar ── */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="bg-gradient-to-br from-indigo-600 to-teal-600 p-1.5 rounded-lg shadow-md shadow-indigo-500/20">
              <HugeIconPicker name="zapIcon" size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tighter italic uppercase leading-none">
                Speed<span className="text-indigo-600">Pro</span>
              </h1>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map(({ to, label, icon, exact }) => (
              <NavLink
                key={to}
                to={to}
                end={exact}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <HugeIconPicker name={icon} size={14} className={isActive ? 'text-indigo-600' : 'text-slate-400'} />
                    {label}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Mobile Menu Toggle */}
          <button 
            className="lg:hidden p-2 text-slate-500 hover:bg-slate-50 rounded-xl transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <HugeIconPicker name="cancel01Icon" size={24} /> : <HugeIconPicker name="menu01Icon" size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Nav Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-white pt-16 flex flex-col">
          <nav className="p-4 space-y-1 overflow-y-auto pb-24 flex-1">
            {NAV_ITEMS.map(({ to, label, icon, exact }) => (
              <NavLink
                key={to}
                to={to}
                end={exact}
                onClick={closeMenu}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-4 rounded-2xl text-sm font-bold transition-all ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <HugeIconPicker name={icon} size={20} className={isActive ? 'text-indigo-600' : 'text-slate-400'} />
                    {label}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>
      )}

      {/* ── Main Content ── */}
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>

      {/* ── Footer ── */}
      <footer className="bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="bg-gradient-to-br from-indigo-600 to-teal-600 p-1 rounded-lg">
                <HugeIconPicker name="zapIcon" size={14} className="text-white" />
              </div>
              <div>
                <h2 className="text-sm font-black tracking-tighter italic uppercase leading-none">
                  Speed<span className="text-indigo-600">Pro</span>
                </h2>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
              <a href="#" className="hover:text-indigo-600 transition-colors">Privacy</a>
              <a href="#" className="hover:text-indigo-600 transition-colors">Terms</a>
              <a href="#" className="hover:text-indigo-600 transition-colors">Contact</a>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold tracking-widest uppercase">
              <HugeIconPicker name="globe02Icon" size={12} /> Mirpur, Dhaka, BD
            </div>
          </div>
          <div className="mt-8 text-center text-xs font-medium text-slate-400">
            &copy; {new Date().getFullYear()} Speed Pro Bangladesh. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
