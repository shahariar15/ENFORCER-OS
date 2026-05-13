import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { APPS } from '../../constants';
import { Search, Sparkles, X, Power, User, Loader2 } from 'lucide-react';

interface AppLauncherProps {
  isOpen: boolean;
  onClose: () => void;
  onAppClick: (id: string, name: string) => void;
  onAISuggest: (query: string) => Promise<void>;
}

export function AppLauncher({ isOpen, onClose, onAppClick, onAISuggest }: AppLauncherProps) {
  const [search, setSearch] = useState('');
  const [isAILoading, setIsAILoading] = useState(false);

  const filteredApps = useMemo(() => {
    return APPS.filter(app => 
      app.name.toLowerCase().includes(search.toLowerCase()) ||
      app.id.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const handleSearchSubmit = async (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && search.trim()) {
      // If there's an exact match or clear prefix, just launch it
      const exactMatch = APPS.find(a => a.name.toLowerCase() === search.toLowerCase() || a.id === search.toLowerCase());
      if (exactMatch) {
        onAppClick(exactMatch.id, exactMatch.name);
        onClose();
        setSearch('');
        return;
      }

      // Otherwise, use AI to interpret intent
      setIsAILoading(true);
      await onAISuggest(search);
      setIsAILoading(false);
      onClose();
      setSearch('');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[45]"
          />

          {/* Launcher Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 50, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.95, y: 50, filter: 'blur(10px)' }}
            className="fixed bottom-24 left-4 w-96 max-h-[600px] glass-dark rounded-3xl z-[46] flex flex-col shadow-2xl border border-white/10"
          >
            {/* Header / User Profile */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                  <User size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-white">COMMANDER</h3>
                  <p className="text-[10px] text-blue-400 font-bold uppercase tracking-tighter">Root Privileges</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-500">
                <X size={18} />
              </button>
            </div>

            {/* Search Bar with AI Glow */}
            <div className="p-6">
              <div className="relative group">
                <div className="absolute inset-x-0 -bottom-2 h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity" />
                <div className="flex items-center gap-4 h-12 px-4 glass-dark rounded-xl border border-white/10 group focus-within:border-blue-500/50 transition-colors">
                  {isAILoading ? (
                    <Loader2 size={18} className="text-blue-400 animate-spin" />
                  ) : (
                    <Search size={18} className="text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                  )}
                  <input
                    autoFocus
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={handleSearchSubmit}
                    placeholder={isAILoading ? "REACHING KERNEL..." : "FIND APP OR ASK KERNEL..."}
                    disabled={isAILoading}
                    className="flex-1 bg-transparent text-[10px] tracking-widest font-bold focus:outline-none placeholder:text-gray-700 uppercase text-white disabled:opacity-50"
                  />
                  <Sparkles size={16} className={`text-indigo-400 ${isAILoading ? 'animate-bounce' : 'animate-pulse'}`} />
                </div>
              </div>
            </div>

            {/* Apps Grid */}
            <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-8">
              <div className="space-y-4">
                <h4 className="text-[10px] text-gray-500 font-bold uppercase tracking-widest px-2">Pinned Modules</h4>
                <div className="grid grid-cols-3 gap-4">
                  {filteredApps.map((app) => (
                    <motion.button
                      key={app.id}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        onAppClick(app.id, app.name);
                        onClose();
                      }}
                      className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-white/5 transition-colors group"
                    >
                      <div className="w-12 h-12 glass rounded-xl flex items-center justify-center transition-all group-hover:brightness-125">
                        <app.icon size={20} style={{ color: app.color }} />
                      </div>
                      <span className="text-[9px] font-bold text-gray-400 group-hover:text-white uppercase tracking-tighter text-center">
                        {app.name}
                      </span>
                    </motion.button>
                  ))}
                  {filteredApps.length === 0 && (
                    <div className="col-span-3 py-12 text-center">
                      <p className="text-[10px] text-gray-600 uppercase tracking-widest font-bold">Nothing found in neural buffers.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* AI Recommendations Section */}
              <div className="p-4 glass rounded-2xl border border-blue-500/10">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles size={14} className="text-blue-400" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400">AI Suggestions</span>
                </div>
                <div className="space-y-2">
                   <div className="text-[10px] text-gray-400 leading-relaxed italic">
                     "commander, it seems you were working on security protocols. initiate secure layer?"
                   </div>
                   <button 
                    onClick={() => { onAppClick('security', 'Secure Layer'); onClose(); }}
                    className="w-full h-8 glass-dark rounded-lg text-[9px] font-bold uppercase tracking-widest hover:bg-white/5 transition-colors"
                   >
                     Launch Secure Layer
                   </button>
                </div>
              </div>
            </div>

            {/* Footer / System Controls */}
            <div className="p-6 border-t border-white/5 flex justify-between items-center bg-black/20">
               <div className="flex items-center gap-4">
                 <button className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors group">
                   <Power size={16} className="group-hover:text-red-500" />
                   <span className="text-[10px] font-bold uppercase tracking-widest">Shutdown</span>
                 </button>
               </div>
               <div className="text-[8px] text-gray-600 font-bold uppercase tracking-[0.3em]">
                 OS BUILD: 1.0.0-PROTOTYPE
               </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
