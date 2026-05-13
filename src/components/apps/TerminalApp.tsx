import { useState } from 'react';
import { motion } from 'motion/react';
import { Terminal as TerminalIcon } from 'lucide-react';

export function TerminalApp() {
  const [history, setHistory] = useState<string[]>([
    'ENFORCER KERNEL v1.0.0 (Neural Link Active)',
    'Type "help" for a list of system commands.',
    '',
  ]);
  const [input, setInput] = useState('');

  const executeCommand = (cmd: string) => {
    const newHistory = [...history, `commander@enforcer:~$ ${cmd}`];
    
    switch (cmd.toLowerCase()) {
      case 'help':
        newHistory.push('SYSTEM COMMANDS:', ' - status: Display system health', ' - clear: Clear neural buffer', ' - identity: Display user credentials', ' - matrix: Execute matrix simulation', ' - shutdown: Terminate OS session');
        break;
      case 'status':
        newHistory.push('SYSTEM STATUS:', ' CPU: Optimal', ' Neural Link: Stable (Latency < 1ms)', ' Shield: Active', ' AI Kernel: Connected');
        break;
      case 'clear':
        setHistory(['ENFORCER KERNEL v1.0.0 (Neural Link Active)']);
        return;
      case 'identity':
        newHistory.push('NAME: COMMANDER-LEVEL-0', 'CLEARANCE: OMNIPOTENT', 'EXPIRY: NEVER');
        break;
      case 'matrix':
        newHistory.push('Initializing simulation...', 'Wake up, Neo...', 'Follow the white rabbit.');
        break;
      default:
        newHistory.push(`Command not found: ${cmd}. Neural core confused.`);
    }
    setHistory(newHistory);
  };

  return (
    <div className="flex flex-col h-full font-mono text-[11px] text-green-400">
      <div className="flex-1 overflow-auto space-y-1 p-2">
        {history.map((line, i) => (
          <div key={i} className="whitespace-pre-wrap leading-tight">{line}</div>
        ))}
      </div>
      <div className="flex items-center gap-2 border-t border-white/5 p-2 pt-4">
        <span className="text-blue-400 font-bold tracking-widest truncate">commander@enforcer:~$</span>
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              executeCommand(input);
              setInput('');
            }
          }}
          autoFocus
          className="flex-1 bg-transparent focus:outline-none text-white tracking-widest uppercase"
        />
      </div>
    </div>
  );
}
