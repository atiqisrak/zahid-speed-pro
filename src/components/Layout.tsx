import React, { useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import HugeIconPicker from './HugeIconPicker';

const NAV_ITEMS = [
  { to: '/speedtest', label: 'Speed Test', icon: 'zapIcon' },
  { to: '/packages', label: 'Plans', icon: 'packageIcon' },
  { to: '/coverage', label: 'Coverage', icon: 'map01Icon' },
  { to: '/isp-finder', label: 'Finder', icon: 'location01Icon' },
  { to: '/tools', label: 'Tools', icon: 'wrench01Icon' },
];

export default function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-teal-500/30 selection:text-teal-900">
      
      {/* ── Floating Pill Navigation (Non-traditional) ── */}
      <header className="fixed bottom-6 md:bottom-auto md:top-8 left-1/2 -translate-x-1/2 z-[100] px-4 w-full max-w-max pointer-events-none">
        <div className="pointer-events-auto bg-slate-900/80 backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)] rounded-full px-2 py-2 flex items-center gap-2 md:gap-4 transition-all hover:bg-slate-900/90 hover:border-white/20">
          
          {/* Logo */}
          <div 
            className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-teal-500 to-indigo-500 rounded-full cursor-pointer hover:scale-105 transition-transform" 
            onClick={() => navigate('/')}
            title="Speed Pro Home"
          >
            <HugeIconPicker name="zapIcon" size={20} className="text-white" />
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 px-4">
            {NAV_ITEMS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-full text-sm font-bold tracking-wide transition-all ${isActive
                    ? 'bg-white/10 text-teal-400'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white transition-colors ml-2"
            onClick={() => setMobileMenuOpen(true)}
          >
            <HugeIconPicker name="menu01Icon" size={20} />
          </button>
          
          {/* Contact CTA */}
          <button onClick={() => navigate('/contact')} className="hidden md:flex items-center gap-2 bg-white text-slate-950 px-6 py-2.5 rounded-full font-bold text-sm tracking-wide hover:bg-teal-400 hover:text-white transition-colors group">
             Let's Talk <HugeIconPicker name="arrowRight01Icon" size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>

        </div>
      </header>

      {/* Fullscreen Mobile Nav Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[110] bg-slate-950 flex flex-col justify-end md:hidden"
          >
            <div className="absolute top-6 right-6">
              <button
                className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                onClick={closeMenu}
              >
                <HugeIconPicker name="cancel01Icon" size={24} />
              </button>
            </div>
            
            <div className="flex-1 flex flex-col justify-center px-8 py-12 space-y-6">
              <h2 className="text-xs font-bold text-teal-500 uppercase tracking-[0.3em] mb-4">Navigation</h2>
              {NAV_ITEMS.map(({ to, label, icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `flex items-center gap-6 text-3xl font-black transition-all ${isActive
                      ? 'text-teal-400'
                      : 'text-white hover:text-slate-300'
                    }`
                  }
                >
                  <HugeIconPicker name={icon} size={32} className="opacity-50" />
                  {label}
                </NavLink>
              ))}
              <NavLink
                to="/contact"
                onClick={closeMenu}
                className="flex items-center gap-6 text-3xl font-black text-amber-500 mt-8"
              >
                <HugeIconPicker name="chat01Icon" size={32} className="opacity-50" />
                Let's Talk
              </NavLink>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main Content ── */}
      <main className="flex-1 flex flex-col relative z-0">
        <Outlet />
      </main>

      {/* ── Massive Agency Footer ── */}
      <footer className="bg-slate-950 text-white border-t border-slate-900 pt-32 pb-16 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-screen-2xl mx-auto flex flex-col justify-between relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-32">
            <div className="lg:col-span-2">
               <h3 className="text-2xl md:text-4xl font-bold mb-6">Ready to redefine your <br/><span className="text-teal-500">network infrastructure?</span></h3>
               <p className="text-slate-400 max-w-md text-lg">We partner with forward-thinking enterprises to deliver flawless routing and zero packet loss.</p>
            </div>
            <div>
               <h4 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-8">Platform</h4>
               <ul className="space-y-4">
                 <li><a href="#" className="font-medium hover:text-teal-400 transition-colors">Speed Test</a></li>
                 <li><a href="#" className="font-medium hover:text-teal-400 transition-colors">BDIX Hub</a></li>
                 <li><a href="#" className="font-medium hover:text-teal-400 transition-colors">ISP Finder</a></li>
                 <li><a href="#" className="font-medium hover:text-teal-400 transition-colors">Enterprise Plans</a></li>
               </ul>
            </div>
            <div>
               <h4 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-8">Company</h4>
               <ul className="space-y-4">
                 <li><a href="#" className="font-medium hover:text-teal-400 transition-colors">About Us</a></li>
                 <li><a href="#" className="font-medium hover:text-teal-400 transition-colors">Contact</a></li>
                 <li><a href="#" className="font-medium hover:text-teal-400 transition-colors">Privacy Policy</a></li>
                 <li><a href="#" className="font-medium hover:text-teal-400 transition-colors">Terms of Service</a></li>
               </ul>
            </div>
          </div>
          
          <div className="flex flex-col items-center">
             <h2 className="text-[15vw] leading-none font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-800 uppercase text-center w-full mb-8">
               Speed<span className="text-teal-500">Pro</span>
             </h2>
             <div className="flex flex-col md:flex-row items-center justify-between w-full pt-8 border-t border-slate-900 gap-4">
                <div className="text-slate-500 font-medium text-sm">
                  &copy; {new Date().getFullYear()} Speed Pro BD. All rights reserved.
                </div>
                <div className="flex items-center gap-2 text-slate-500 text-sm font-bold uppercase tracking-widest">
                  <HugeIconPicker name="globe02Icon" size={16} /> Dhaka, Bangladesh
                </div>
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
