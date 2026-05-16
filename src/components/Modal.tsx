import HugeIconPicker from './HugeIconPicker';
import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-xl">
      <div className="bg-slate-900/90 w-full max-w-lg rounded-t-[2.5rem] sm:rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border-t sm:border border-white/10 max-h-[90vh] flex flex-col backdrop-blur-3xl">
        <div className="p-6 sm:p-8 border-b border-white/10 flex justify-between items-center shrink-0 bg-white/5">
          <h3 className="text-xl font-black uppercase tracking-widest text-white">{title}</h3>
          <button onClick={onClose} className="p-2.5 hover:bg-white/10 text-slate-400 hover:text-white rounded-xl transition-all">
            <HugeIconPicker name="cancel01Icon" size={20} />
          </button>
        </div>
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 custom-scrollbar text-slate-100">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
