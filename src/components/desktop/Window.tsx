import React, { ReactNode } from 'react';
import { motion } from 'motion/react';
import { LucideIcon, X, Minus, Square } from 'lucide-react';

interface WindowProps {
  title: string;
  icon: LucideIcon;
  onClose: () => void;
  children: ReactNode;
  active?: boolean;
}

export const Window: React.FC<WindowProps> = ({ title, icon: Icon, onClose, children, active }) => {
  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.95, opacity: 0, y: 20 }}
      drag
      dragMomentum={false}
      className={`absolute w-[800px] h-[500px] glass-dark rounded-xl flex flex-col overflow-hidden shadow-2xl ${active ? 'ring-1 ring-blue-500/30 brightness-110' : 'opacity-80 scale-[0.98]'}`}
    >
      {/* Title Bar */}
      <div className="h-10 flex items-center justify-between px-4 bg-white/5 border-b border-white/5 select-none cursor-move">
        <div className="flex items-center gap-3">
          <Icon size={14} className="text-blue-400" />
          <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400">{title}</span>
        </div>

        <div className="flex items-center gap-4">
          <button className="text-gray-500 hover:text-white transition-colors">
            <Minus size={14} />
          </button>
          <button className="text-gray-500 hover:text-white transition-colors">
            <Square size={12} />
          </button>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-red-400 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6 scroll-smooth">
        {children}
      </div>
    </motion.div>
  );
}
