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
      <div className="space-y-6 pb-6">
        <section>
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 flex items-center gap-2"><HugeIconPicker name="smartphone01Icon" size={14} /> Profile Simulation</h4>
          <div className="space-y-3">
            {PROFILES.map(p => (
              <button key={p.id} onClick={() => { setActiveProfile(p); onClose(); }}
                className={`w-full p-5 rounded-3xl text-left border-2 transition-all ${activeProfile.id === p.id ? 'border-teal-600 bg-teal-50' : 'border-slate-100'}`}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-black text-sm">{p.name}</span>
                  {activeProfile.id === p.id && <HugeIconPicker name="checkIcon" size={16} className="text-teal-600" />}
                </div>
                <p className="text-[10px] font-bold opacity-50 uppercase tracking-tighter">{p.desc}</p>
              </button>
            ))}
          </div>
        </section>
        <section>
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 flex items-center gap-2"><HugeIconPicker name="globe02Icon" size={14} /> Edge Node</h4>
          <div className="grid grid-cols-1 gap-2">
            {SERVERS.map(s => (
              <button key={s.id} onClick={() => { setActiveServer(s); onClose(); }}
                className={`p-4 rounded-2xl border ${activeServer.id === s.id ? 'bg-teal-600 text-white border-teal-600' : 'bg-slate-50 border-slate-100 text-slate-900'}`}>
                <div className="font-bold text-xs">{s.name}</div>
              </button>
            ))}
          </div>
        </section>
      </div>
    </Modal>
  );
}
