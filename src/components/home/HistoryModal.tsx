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
      <div className="space-y-3 pb-8">
        {testHistory.length === 0 ? (
          <div className="text-center py-10 opacity-30"><HugeIconPicker name="historyIcon" size={32} className="mx-auto mb-2" /><p className="text-[10px] font-bold uppercase tracking-widest">No Logs Found</p></div>
        ) : testHistory.map(h => (
          <div key={h.id} className="p-4 bg-slate-50 rounded-3xl flex justify-between items-center border border-slate-100">
            <div>
              <div className="text-lg font-black">{h.download} <span className="text-[10px] text-slate-400 uppercase">Mbps</span></div>
              <div className="text-[9px] font-bold text-slate-400">{h.date}</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-black uppercase tracking-tighter text-teal-600">{h.ping}ms / {h.upload} Up</div>
              <div className="text-[8px] font-bold text-slate-400 uppercase">{h.profile}</div>
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
}
