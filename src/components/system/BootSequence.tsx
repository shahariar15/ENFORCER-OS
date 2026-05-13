import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { Terminal, Shield, Cpu, Activity, Lock, AlertTriangle } from 'lucide-react';

interface BootSequenceProps {
  onComplete: () => void;
}

export function BootSequence({ onComplete }: BootSequenceProps) {
  const [stage, setStage] = useState<'OFF' | 'BIOS' | 'KERNEL' | 'LOGO'>('BIOS');
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const biosLogs = [
      'ENFORCER BIOS v4.0.2',
      'Processor: AI-X Neuronal Core @ 5.2GHz',
      'Memory: 128TB Quantum Lattice',
      'Storage: Entropic Vault [CONNECTED]',
      'Checking Secure Boot...',
      'Signature Verified: HEAVY-METAL-9',
      'Initializing Kernel...',
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < biosLogs.length) {
        setLogs(prev => [...prev, biosLogs[i]]);
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => setStage('KERNEL'), 1000);
      }
    }, 150);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (stage === 'KERNEL') {
      const kernelLogs = [
        '[OK] Loading Sentient Drivers...',
        '[OK] Virtualizing UI Layer...',
        '[OK] Syncing Neural Interface...',
        '[OK] Establishing AI Encryption...',
        '[OK] Booting ENFORCEROS 1.0...',
      ];

      let i = 0;
      const interval = setInterval(() => {
        if (i < kernelLogs.length) {
          setLogs(prev => [...prev, kernelLogs[i]]);
          i++;
        } else {
          clearInterval(interval);
          setTimeout(() => setStage('LOGO'), 800);
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, [stage]);

  return (
    <div className="fixed inset-0 bg-black z-[100] flex flex-col font-mono text-[10px] md:text-xs">
      <AnimatePresence mode="wait">
        {stage !== 'LOGO' ? (
          <motion.div
            key="logs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-8 md:p-12 space-y-1"
          >
            {logs.map((log, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={log?.startsWith('[OK]') ? 'text-blue-400' : 'text-gray-400'}
              >
                {log}
              </motion.div>
            ))}
            <motion.div
              animate={{ opacity: [1, 0] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="w-2 h-4 bg-white inline-block ml-1 align-middle"
            />
          </motion.div>
        ) : (
          <motion.div
            key="logo"
            initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="flex-1 flex flex-col items-center justify-center relative overflow-hidden"
            onAnimationComplete={() => setTimeout(onComplete, 2500)}
          >
            {/* Background Glitch Effects */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-[100px] animate-pulse" />
              <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-500 rounded-full blur-[100px] animate-pulse delay-700" />
            </div>

            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="relative z-10"
            >
              <h1 className="text-6xl md:text-9xl font-heading font-bold tracking-[0.2em] italic text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-white to-red-400 drop-shadow-[0_0_30px_rgba(59,130,246,0.5)]">
                ENFORCER
              </h1>
              <div className="flex justify-between items-center mt-2 px-2">
                <span className="text-[10px] tracking-[0.5em] text-gray-500 font-bold uppercase">Intelligence Beyond Control</span>
                <div className="flex gap-2">
                  <Activity size={12} className="text-blue-400 animate-pulse" />
                  <Shield size={12} className="text-red-400 animate-pulse" />
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: 240 }}
              transition={{ duration: 2, ease: "easeInOut" }}
              className="mt-12 h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"
            />
            
            <div className="mt-4 flex gap-8">
               <div className="flex items-center gap-2 text-gray-500 text-[10px] uppercase tracking-widest">
                 <Lock size={10} />
                 <span>Secure Core</span>
               </div>
               <div className="flex items-center gap-2 text-gray-500 text-[10px] uppercase tracking-widest">
                 <Cpu size={10} />
                 <span>Neural Link</span>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed bottom-8 left-8 flex items-center gap-4 text-[8px] text-gray-700 tracking-[0.3em] font-bold">
        <span>SYSTEM READINESS: {(logs.length / 12 * 100).toFixed(0)}%</span>
        <div className="w-32 h-[2px] bg-gray-900 overflow-hidden">
          <motion.div 
            animate={{ x: [-128, 128] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            className="w-16 h-full bg-blue-500/50 blur-[2px]"
          />
        </div>
      </div>
    </div>
  );
}
