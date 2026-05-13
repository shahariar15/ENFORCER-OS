import { AnimatePresence, motion } from 'motion/react';
import { useOS } from './hooks/useOS';
import { BootSequence } from './components/system/BootSequence';
import { LockScreen } from './components/system/LockScreen';
import { Taskbar } from './components/desktop/Taskbar';
import { Window } from './components/desktop/Window';
import { AIAssistant } from './components/ai/AIAssistant';
import { APPS } from './constants';
import { TerminalApp } from './components/apps/TerminalApp';
import { FileManagerApp } from './components/apps/FileManagerApp';
import { interpretAICommand } from './services/aiAppLauncher';
import { Shield, Sparkles, Settings as SettingsIcon, Cpu } from 'lucide-react';
import { useEffect, useCallback } from 'react';

export default function App() {
  const { state, transitionTo, login, openApp, closeWindow } = useOS();

  const handleAISearch = useCallback(async (query: string) => {
    await interpretAICommand(query, openApp);
  }, [openApp]);

  // Initial boot effect
  useEffect(() => {
    const timer = setTimeout(() => transitionTo('BIOS'), 1000);
    return () => clearTimeout(timer);
  }, [transitionTo]);

  const renderAppContent = (appId: string) => {
    switch (appId) {
      case 'terminal': return <TerminalApp />;
      case 'files': return <FileManagerApp />;
      case 'settings': return (
        <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
           <SettingsIcon size={64} className="text-gray-600 animate-spin-slow" />
           <p className="text-xs text-gray-500 uppercase tracking-[0.5em]">System Core is updating. Calibration in progress.</p>
        </div>
      );
      case 'security': return (
        <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
           <Shield size={64} className="text-red-500 animate-pulse" />
           <div className="space-y-2">
             <h3 className="text-xl font-heading uppercase tracking-widest text-red-400">Threat Neutralization Layer</h3>
             <p className="text-[10px] text-gray-500 uppercase tracking-widest">Scan Status: Active. Firewall: impenetrable.</p>
           </div>
        </div>
      );
      case 'ai-lab': return (
        <div className="flex flex-col items-center justify-center h-full text-center space-y-6 p-12">
           <Cpu size={64} className="text-emerald-500" />
           <div className="space-y-4">
             <h3 className="text-xl font-heading uppercase tracking-widest text-emerald-400">AI KERNEL TRAINING GROUND</h3>
             <p className="text-xs text-gray-400 leading-relaxed font-bold italic">"We are not merely writing code. We are cultivating consciousness."</p>
             <div className="w-64 h-1 bg-white/5 rounded-full overflow-hidden mx-auto">
               <motion.div 
                 animate={{ x: [-256, 256] }}
                 transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                 className="w-32 h-full bg-emerald-500/50"
               />
             </div>
           </div>
        </div>
      );
      default: return null;
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black select-none">
      <AnimatePresence mode="wait">
        {state.status === 'OFF' && (
          <motion.div key="off" className="fixed inset-0 bg-black z-[200]" />
        )}

        {(state.status === 'BIOS' || state.status === 'KERNEL_LOAD' || state.status === 'LOGO') && (
          <BootSequence onComplete={() => transitionTo('LOCK_SCREEN')} />
        )}

        {state.status === 'LOCK_SCREEN' && (
          <LockScreen onUnlock={login} />
        )}

        {state.status === 'DESKTOP' && (
          <motion.div
            key="desktop"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 flex flex-col"
          >
            {/* Desktop Background Layer */}
            <div className="absolute inset-0 z-0">
               <img 
                src="https://images.unsplash.com/photo-1614850523296-e8c041de24c6?q=80&w=2560&auto=format&fit=crop" 
                className="w-full h-full object-cover scale-110 brightness-[0.3]"
                alt="OS Background"
               />
               <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/20 to-black/80" />
               
               {/* Decorative Particles Simulation */}
               <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-50">
                  <motion.div 
                    animate={{ y: [0, -1000] }}
                    transition={{ repeat: Infinity, duration: 60, ease: "linear" }}
                    className="absolute inset-0"
                    style={{ backgroundImage: 'radial-gradient(circle at 10% 10%, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '100px 100px' }}
                  />
               </div>
            </div>

            {/* Desktop Content */}
            <main className="flex-1 relative p-12 overflow-hidden">
               {/* Desktop Icons */}
               <div className="flex flex-col gap-8 flex-wrap h-full content-start items-center">
                  {APPS.map((app) => (
                    <motion.button
                      key={app.id}
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => openApp(app.id, app.name)}
                      className="flex flex-col items-center gap-2 w-20 group relative"
                    >
                      <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center transition-all group-hover:brightness-125">
                         <app.icon size={20} style={{ color: app.color }} className="drop-shadow-lg" />
                         <div className="absolute inset-0 rounded-2xl bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <span className="text-[10px] font-bold text-white/50 group-hover:text-white uppercase tracking-widest text-shadow-md">
                        {app.name}
                      </span>
                    </motion.button>
                  ))}
               </div>

               {/* Windows Container */}
               <AnimatePresence>
                 {state.openWindows.map((win) => (
                    <Window 
                      key={win.id}
                      title={win.title}
                      icon={APPS.find(a => a.id === win.id)?.icon || Sparkles}
                      onClose={() => closeWindow(win.id)}
                      active={state.activeWindowId === win.id}
                    >
                      {renderAppContent(win.id)}
                    </Window>
                 ))}
               </AnimatePresence>
            </main>

            {/* System UI Layers */}
            <AIAssistant onLaunchApp={openApp} />
            <Taskbar 
              onAppClick={openApp} 
              activeAppId={state.activeWindowId}
              openAppIds={state.openWindows.map(w => w.id)}
              onAISearch={handleAISearch}
            />

            {/* Bottom Overlay Info */}
            <div className="fixed bottom-24 left-1/2 -translate-x-1/2 flex gap-8 text-[8px] text-white/20 uppercase font-bold tracking-[0.5em] pointer-events-none">
               <span>Kernel Entropy: -0.002</span>
               <span>Sentience Load: 4.8%</span>
               <span>Neural Latency: 0.4ms</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
