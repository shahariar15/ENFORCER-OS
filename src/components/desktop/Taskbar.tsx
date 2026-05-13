import { motion } from 'motion/react';
import { APPS } from '../../constants';
import { Search, Battery, Wifi, Volume2, Calendar, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { AppLauncher } from './AppLauncher';

interface TaskbarProps {
  onAppClick: (id: string, name: string) => void;
  openAppIds: string[];
  activeAppId: string | null;
  onAISearch: (query: string) => Promise<void>;
}

export function Taskbar({ onAppClick, openAppIds, activeAppId, onAISearch }: TaskbarProps) {
  const [time, setTime] = useState(new Date());
  const [isLauncherOpen, setIsLauncherOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <AppLauncher 
        isOpen={isLauncherOpen} 
        onClose={() => setIsLauncherOpen(false)} 
        onAppClick={onAppClick}
        onAISuggest={onAISearch}
      />
      
      <div className="fixed bottom-4 left-4 right-4 h-16 flex items-center justify-between px-6 glass rounded-2xl z-50">
        {/* Start & Search */}
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsLauncherOpen(!isLauncherOpen)}
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center neon-blue"
          >
            <div className="w-4 h-4 bg-white rounded-sm rotate-45" />
          </motion.button>
          
          <div 
            onClick={() => setIsLauncherOpen(true)}
            className="flex items-center gap-2 px-4 h-10 glass-dark rounded-xl text-gray-500 cursor-pointer hover:bg-white/5 transition-colors"
          >
            <Search size={14} />
            <span className="text-[10px] hidden md:block uppercase tracking-widest font-bold">Search Neural Web...</span>
          </div>
        </div>

      {/* Apps Dock */}
      <div className="flex items-center gap-2 p-1 glass-dark rounded-2xl border border-white/5 mx-auto">
        {APPS.map((app) => (
          <motion.button
            key={app.id}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onAppClick(app.id, app.name)}
            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all relative group
              ${activeAppId === app.id ? 'bg-white/10' : 'hover:bg-white/5'}`}
          >
            <app.icon size={20} style={{ color: app.color }} />
            
            {/* Active Indicator */}
            {openAppIds.includes(app.id) && (
              <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full 
                ${activeAppId === app.id ? 'bg-blue-400 w-2' : 'bg-gray-500'}`} 
              />
            )}

            {/* Tooltip */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 glass rounded-lg text-[10px] uppercase font-bold tracking-widest opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              {app.name}
            </div>
          </motion.button>
        ))}
      </div>

      {/* System Tray */}
      <div className="flex items-center gap-6">
        <div className="hidden lg:flex items-center gap-4 text-gray-400 px-4 py-2 glass-dark rounded-xl border border-white/5">
          <Wifi size={14} className="text-green-400" />
          <Volume2 size={14} />
          <div className="flex items-center gap-1">
             <Battery size={14} />
             <span className="text-[10px] font-bold">84%</span>
          </div>
        </div>

        <div className="flex flex-col items-end px-2 border-l border-white/10">
          <div className="text-xs font-bold tracking-wider">{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
          <div className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">{time.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}</div>
        </div>
      </div>
      </div>
    </>
  );
}
