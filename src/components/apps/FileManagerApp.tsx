import { useState } from 'react';
import { motion } from 'motion/react';
import { Folder, File, ChevronRight, HardDrive, Database, Globe } from 'lucide-react';

export function FileManagerApp() {
  const [currentPath, setCurrentPath] = useState(['root']);
  const files = [
    { name: 'System', type: 'folder', items: ['kernel.sys', 'boot.log', 'neural_keys'] },
    { name: 'Communications', type: 'folder', items: ['intercepts.txt', 'ai_logs.json'] },
    { name: 'Archives', type: 'folder', items: ['history_of_war.db', 'manifesto.pdf'] },
    { name: 'core_dump.bin', type: 'file' },
    { name: 'README_COMMANDER.txt', type: 'file' },
  ];

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-48 border-r border-white/5 p-4 space-y-6">
        <div className="space-y-4">
           <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Storage</p>
           <div className="space-y-2">
             <div className="flex items-center gap-2 text-xs text-blue-400 cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-colors">
               <HardDrive size={14} />
               <span>ENFORCER_HD</span>
             </div>
             <div className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-colors">
               <Database size={14} />
               <span>SENTIENT_DB</span>
             </div>
             <div className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-colors">
               <Globe size={14} />
               <span>CLOUD_VAULT</span>
             </div>
           </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <div className="h-10 border-b border-white/5 flex items-center px-4 gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
          {currentPath.map((p, i) => (
            <div key={p} className="flex items-center gap-2">
              <span className={i === currentPath.length - 1 ? 'text-blue-400' : ''}>{p}</span>
              {i < currentPath.length - 1 && <ChevronRight size={12} />}
            </div>
          ))}
        </div>

        <div className="p-6 grid grid-cols-4 gap-6">
          {files.map((file, i) => (
            <motion.div
              key={file.name}
              whileHover={{ scale: 1.05, y: -2 }}
              className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group"
            >
              {file.type === 'folder' ? (
                <Folder size={40} className="text-yellow-500 opacity-80 group-hover:opacity-100 transition-opacity" />
              ) : (
                <File size={40} className="text-blue-400 opacity-80 group-hover:opacity-100 transition-opacity" />
              )}
              <span className="text-[10px] font-bold text-center uppercase tracking-tighter truncate w-full">{file.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
