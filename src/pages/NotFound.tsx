import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import HugeIconPicker from '../components/HugeIconPicker';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-6 relative overflow-hidden selection:bg-teal-500/30">
      
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center relative z-10"
      >
        <motion.div
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="inline-block mb-12"
        >
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] shadow-2xl">
             <HugeIconPicker name="search01Icon" size={80} className="text-teal-400 opacity-80" />
          </div>
        </motion.div>

        <h1 className="text-[20vw] md:text-[15vw] leading-none font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-800 uppercase mb-4">
          404
        </h1>
        
        <h2 className="text-2xl md:text-4xl font-bold text-white mb-6 uppercase tracking-tight">
          Signal <span className="text-teal-500">Lost</span> in Transit
        </h2>
        
        <p className="text-slate-400 max-w-md mx-auto mb-12 text-lg font-medium">
          The page you are looking for has been moved or doesn't exist. Let's get you back on the right route.
        </p>

        <Link 
          to="/" 
          className="inline-flex items-center gap-3 bg-teal-500 text-slate-950 px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-teal-400 hover:-translate-y-1 transition-all shadow-[0_20px_50px_-10px_rgba(20,184,166,0.5)]"
        >
          <HugeIconPicker name="home01Icon" size={20} />
          Return Home
        </Link>
      </motion.div>

      {/* Floating Elements */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0, 0.5, 0],
            scale: [0.5, 1, 0.5],
            x: Math.random() * 400 - 200,
            y: Math.random() * 400 - 200
          }}
          transition={{
            duration: 5 + Math.random() * 5,
            repeat: Infinity,
            delay: i * 2
          }}
          className="absolute w-2 h-2 bg-teal-500 rounded-full blur-sm"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`
          }}
        />
      ))}
    </div>
  );
}
