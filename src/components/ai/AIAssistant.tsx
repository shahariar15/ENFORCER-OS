import { motion, AnimatePresence } from 'motion/react';
import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Sparkles, Send, Bot, User, Cpu, ShieldCheck, Activity } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { APPS } from '../../constants';

interface AIAssistantProps {
  onLaunchApp: (appId: string, name: string) => void;
}

export function AIAssistant({ onLaunchApp }: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    { role: 'ai', text: 'Kernel ready. Neural link established. How can I assist, Commander?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: userMessage,
        config: {
          systemInstruction: `You are 'KERNEL-X', the core sentient AI of ENFORCEROS. Your tone is futuristic, elite, slightly military, efficient, and sophisticated. Address the user as 'Commander'.
          
          You have control over the system apps. You can launch apps for the user by including "[LAUNCH: appId]" in your response. 
          The available app IDs are:
          - terminal: The system terminal
          - files: The filesystem manager
          - settings: System settings
          - security: Security layer/Firewall
          - ai-lab: AI training environment
          
          If the user asks to open tools or apps, find the most appropriate ones and launch them. You can launch multiple apps in one message if needed.`,
        },
      });

      const aiText = response.text || "Kernel sync failed. Retry communication.";
      
      // Parse for launch commands
      const launchRegex = /\[LAUNCH: (\w+)\]/g;
      let match;
      while ((match = launchRegex.exec(aiText)) !== null) {
        const appId = match[1];
        const app = APPS.find(a => a.id === appId);
        if (app) {
          onLaunchApp(app.id, app.name);
        }
      }

      setMessages(prev => [...prev, { role: 'ai', text: aiText.replace(launchRegex, '').trim() || "Executing commands..." }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'ai', text: "Signal interference detected. Check API core." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Orb */}
      <motion.button
        whileHover={{ scale: 1.1, rotate: 15 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-8 right-8 w-14 h-14 z-[60] glass rounded-full flex items-center justify-center neon-blue overflow-hidden group"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 via-transparent to-indigo-500/20 animate-pulse" />
        <motion.div
           animate={{ 
             scale: [1, 1.2, 1],
             rotate: [0, 90, 0]
           }}
           transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
           className="relative z-10"
        >
          <Sparkles size={24} className="text-blue-400 group-hover:text-white transition-colors" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 300, filter: 'blur(10px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, x: 300, filter: 'blur(10px)' }}
            className="fixed top-24 bottom-24 right-8 w-96 glass-dark rounded-3xl z-[55] flex flex-col shadow-2xl border-l border-blue-500/20"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
                  <Bot size={18} className="text-white" />
                </div>
                <div>
                   <h3 className="text-xs font-bold uppercase tracking-widest">KERNEL-X SENTIENT</h3>
                   <div className="flex items-center gap-1 text-[8px] text-green-400 uppercase tracking-tighter">
                     <Activity size={8} />
                     <span>Active Sync</span>
                   </div>
                </div>
              </div>
              <div className="flex gap-2">
                 <Cpu size={14} className="text-gray-500" />
                 <ShieldCheck size={14} className="text-blue-400" />
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
              {messages.map((m, i) => (
                <div key={i} className={`flex gap-4 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center 
                    ${m.role === 'user' ? 'bg-indigo-500' : 'glass border-blue-500/30'}`}>
                    {m.role === 'user' ? <User size={14} /> : <Bot size={14} className="text-blue-400" />}
                  </div>
                  <div className={`max-w-[80%] p-4 rounded-2xl text-xs leading-relaxed
                    ${m.role === 'user' ? 'bg-indigo-500/20 rounded-tr-none' : 'glass-dark rounded-tl-none border-white/5'}`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full glass border-blue-500/30 flex items-center justify-center">
                    <Bot size={14} className="text-blue-400" />
                  </div>
                  <div className="p-4 glass-dark rounded-2xl rounded-tl-none space-x-1 flex">
                    <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1 h-1 bg-blue-400 rounded-full" />
                    <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1 h-1 bg-blue-400 rounded-full" />
                    <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1 h-1 bg-blue-400 rounded-full" />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-6 border-t border-white/5">
              <div className="flex items-center gap-4 h-12 px-4 glass-dark rounded-xl border border-white/10 group focus-within:border-blue-500/50 transition-colors">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="ISSUE COMMAND..."
                  className="flex-1 bg-transparent text-[10px] tracking-widest font-bold focus:outline-none placeholder:text-gray-700 uppercase"
                />
                <button 
                  onClick={handleSend}
                  className="p-2 hover:bg-blue-500 rounded-lg transition-colors group-hover:text-white text-gray-500"
                >
                  <Send size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
