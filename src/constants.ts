import { LucideIcon, Terminal, Folder, Settings, Shield, Cpu, MessageSquare } from 'lucide-react';

export interface AppDefinition {
  id: string;
  name: string;
  icon: LucideIcon;
  color: string;
}

export const APPS: AppDefinition[] = [
  { id: 'terminal', name: 'Terminal', icon: Terminal, color: '#3b82f6' },
  { id: 'files', name: 'Filesystem', icon: Folder, color: '#f59e0b' },
  { id: 'settings', name: 'System Settings', icon: Settings, color: '#6366f1' },
  { id: 'security', name: 'Secure Layer', icon: Shield, color: '#ef4444' },
  { id: 'ai-lab', name: 'AI Kernel Lab', icon: Cpu, color: '#10b981' },
];
