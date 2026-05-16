import HugeIconPicker from '../HugeIconPicker';
import React from 'react';

import Modal from '../Modal';

type Profile = { id: 'real' | 'broadband' | 'fiber'; name: string; desc: string; };
type Server = { id: number; name: string; };

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  PROFILES: Profile[];
  SERVERS: Server[];
  activeProfile: Profile;
  setActiveProfile: (p: Profile) => void;
  activeServer: Server;
  setActiveServer: (s: Server) => void;
}

export default function SettingsModal({
  isOpen, onClose, PROFILES, SERVERS, activeProfile, setActiveProfile, activeServer, setActiveServer
}: SettingsModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Engine Configuration">
      <div className="space-y-8 pb-6">
        <section>
          <h4 className="text-[10px] font-black uppercase tracking-widest text-teal-400 mb-4 flex items-center gap-2"><HugeIconPicker name="smartphone01Icon" size={14} /> Profile Simulation</h4>
          <div className="space-y-3">
            {PROFILES.map(p => (
              <button key={p.id} onClick={() => { setActiveProfile(p); onClose(); }}
                className={`w-full p-5 rounded-2xl text-left border transition-all ${activeProfile.id === p.id ? 'border-teal-500/50 bg-teal-500/10 shadow-[0_0_15px_rgba(20,184,166,0.1)]' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className={`font-black text-sm uppercase tracking-wider ${activeProfile.id === p.id ? 'text-teal-400' : 'text-white'}`}>{p.name}</span>
                  {activeProfile.id === p.id && <HugeIconPicker name="checkIcon" size={16} className="text-teal-400" />}
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{p.desc}</p>
              </button>
            ))}
          </div>
        </section>
        <section>
          <h4 className="text-[10px] font-black uppercase tracking-widest text-teal-400 mb-4 flex items-center gap-2"><HugeIconPicker name="globe02Icon" size={14} /> Edge Node</h4>
          <div className="grid grid-cols-1 gap-3">
            {SERVERS.map(s => (
              <button key={s.id} onClick={() => { setActiveServer(s); onClose(); }}
                className={`p-4 rounded-xl border transition-all ${activeServer.id === s.id ? 'bg-teal-500/20 text-teal-400 border-teal-500/50 shadow-[0_0_15px_rgba(20,184,166,0.1)]' : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'}`}>
                <div className="font-black text-xs uppercase tracking-wider">{s.name}</div>
              </button>
            ))}
          </div>
        </section>
      </div>
    </Modal>
  );
}
