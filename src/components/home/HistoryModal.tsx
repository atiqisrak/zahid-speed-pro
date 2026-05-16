import HugeIconPicker from '../HugeIconPicker';
import React from 'react';

import Modal from '../Modal';

interface HistoryEntry { id: number; date: string; download: string; upload: string; ping: number | string; profile: string; }

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  testHistory: HistoryEntry[];
}

export default function HistoryModal({ isOpen, onClose, testHistory }: HistoryModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Test History">
      <div className="space-y-4 pb-8">
        {testHistory.length === 0 ? (
          <div className="text-center py-10 opacity-30 text-white"><HugeIconPicker name="historyIcon" size={32} className="mx-auto mb-2" /><p className="text-[10px] font-black uppercase tracking-widest">No Logs Found</p></div>
        ) : testHistory.map(h => (
          <div key={h.id} className="p-5 bg-white/5 rounded-2xl flex justify-between items-center border border-white/10 hover:bg-white/10 hover:border-teal-500/30 transition-all group">
            <div>
              <div className="text-xl font-black text-white">{h.download} <span className="text-[10px] text-teal-400 uppercase tracking-widest">Mbps</span></div>
              <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{h.date}</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-black uppercase tracking-widest text-teal-400">{h.ping}ms / {h.upload} Up</div>
              <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{h.profile}</div>
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
}
