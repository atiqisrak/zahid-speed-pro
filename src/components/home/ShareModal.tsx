import HugeIconPicker from '../HugeIconPicker';
import React, { useRef, useState } from 'react';
import { toPng } from 'html-to-image';

import Modal from '../Modal';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  results: { ping: number | string; download: number | string; upload: number | string };
  ipInfo: { ip: string; isp: string; city: string };
}

function copyText(t: string) { return navigator.clipboard?.writeText(t) || Promise.resolve(); }

export default function ShareModal({ isOpen, onClose, results, ipInfo }: ShareModalProps) {
  const shareCardRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  const downloadImage = async () => {
    if (!shareCardRef.current) return;
    const dataUrl = await toPng(shareCardRef.current, { backgroundColor: '#020617', pixelRatio: 2 });
    const link = document.createElement('a'); link.download = `SpeedPro_${Date.now()}.png`; link.href = dataUrl; link.click();
  };

  const copyToClipboard = async () => {
    await copyText(`Speed Pro\nDL: ${results.download} Mbps | UL: ${results.upload} Mbps\nPing: ${results.ping}ms\nTested via SpeedPro`);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Export Diagnosis">
      <div className="text-center space-y-6 pb-8">
        <div ref={shareCardRef} className="bg-slate-950 rounded-[2.5rem] p-6 sm:p-10 text-white border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)] relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5"><HugeIconPicker name="zapIcon" size={100} className="fill-teal-500 text-teal-500" /></div>
          <div className="absolute -inset-24 bg-teal-500/10 rounded-full blur-[80px] pointer-events-none" />
          
          <div className="relative">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-4">Speed Pro</p>
            <div className="text-5xl sm:text-7xl font-black italic tracking-tighter mb-2 text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400">{results.download}</div>
            <div className="text-teal-400 font-black uppercase text-[10px] tracking-widest mb-8">Mbps Download</div>
            <div className="grid grid-cols-3 gap-2 pt-8 border-t border-white/10">
              <div className="text-left"><p className="text-[9px] text-slate-500 uppercase tracking-widest font-black mb-1">Upload</p><p className="font-black text-[13px]">{results.upload} Mbps</p></div>
              <div className="text-center"><p className="text-[9px] text-slate-500 uppercase tracking-widest font-black mb-1">Latency</p><p className="font-black text-[13px]">{results.ping} ms</p></div>
              <div className="text-right"><p className="text-[9px] text-slate-500 uppercase tracking-widest font-black mb-1">Provider</p><p className="font-black text-[11px] truncate uppercase tracking-widest">{ipInfo.isp.split(' ')[0]}</p></div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <button onClick={downloadImage} className="w-full py-4 rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors">Download Image</button>
          <button onClick={copyToClipboard} className={`w-full py-4 rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 transition-all ${copied ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' : 'bg-teal-500/20 border border-teal-500/50 text-teal-400 hover:bg-teal-500/30'}`}>
            {copied ? <><HugeIconPicker name="checkIcon" size={16} />Copied</> : <><HugeIconPicker name="copy01Icon" size={16} />Copy Text</>}
          </button>
        </div>
      </div>
    </Modal>
  );
}
