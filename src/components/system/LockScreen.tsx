import { motion } from 'motion/react';
import { useState } from 'react';
import { Power, Fingerprint, Lock, ShieldCheck, ChevronRight } from 'lucide-react';

interface LockScreenProps {
  onUnlock: (user: string) => void;
}

export function LockScreen({ onUnlock }: LockScreenProps) {
  const [unlocking, setUnlocking] = useState(false);
  const [pin, setPin] = useState('');

  const handleUnlock = () => {
    setUnlocking(true);
    setTimeout(() => {
      onUnlock('COMMANDER');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
      {/* Background with parallax effect */}
      <div className="absolute inset-0">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline
          className="w-full h-full object-cover scale-110 blur-sm opacity-40 brightness-50"
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-cyber-city-at-night-with-digital-interface-34538-large.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md px-6"
      >
        <div className="flex flex-col items-center text-center">
          <motion.div
            animate={{ 
              scale: [1, 1.05, 1],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{ repeat: Infinity, duration: 4 }}
            className="w-24 h-24 rounded-full glass flex items-center justify-center mb-8 relative border-blue-500/30"
          >
            <div className="absolute inset-0 rounded-full border border-blue-500/20 animate-ping" />
            <ShieldCheck size={40} className="text-blue-400" />
          </motion.div>

          <h2 className="text-4xl font-heading font-medium tracking-[0.2em] mb-2 uppercase">ENFORCEROS</h2>
          <p className="text-gray-400 text-xs tracking-[0.4em] mb-12 uppercase">V1.0.0-PROTOTYPE</p>

          <div className="w-full space-y-6">
            {!unlocking ? (
              <>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleUnlock}
                  className="w-full h-16 glass rounded-2xl flex items-center justify-center gap-4 group overflow-hidden relative"
                >
                  <div className="absolute inset-0 bg-blue-500/10 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />
                  <Fingerprint size={24} className="text-blue-400 group-hover:animate-pulse" />
                  <span className="text-sm font-medium tracking-widest uppercase">Initiate Neural Scan</span>
                </motion.button>

                <div className="flex items-center gap-4">
                   <div className="h-[1px] flex-1 bg-white/10" />
                   <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">OR</span>
                   <div className="h-[1px] flex-1 bg-white/10" />
                </div>

                <div className="relative group">
                  <input 
                    type="password" 
                    placeholder="ENTER AUTHORIZATION KEY" 
                    className="w-full glass-dark rounded-2xl h-14 px-6 text-center text-sm tracking-[0.5em] focus:outline-none focus:border-blue-500/50 transition-colors uppercase placeholder:text-gray-600"
                    onChange={(e) => setPin(e.target.value)}
                  />
                  <ChevronRight size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600" />
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    className="h-full bg-blue-500 neon-blue"
                  />
                </div>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0.5, 1] }}
                  transition={{ repeat: Infinity, duration: 0.5 }}
                  className="text-[10px] text-blue-400 uppercase tracking-[0.5em] font-bold"
                >
                  Verifying Identity...
                </motion.p>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      <div className="fixed bottom-12 left-1/2 -translate-x-1/2 flex gap-12 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
         <div className="flex flex-col items-center gap-2">
           <Power size={18} className="hover:text-red-500 cursor-pointer transition-colors" />
           <span>Shutdown</span>
         </div>
         <div className="flex flex-col items-center gap-2">
           <Lock size={18} />
           <span>Secure</span>
         </div>
      </div>
    </div>
  );
}
