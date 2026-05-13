import { useState, useCallback } from 'react';
import { OSState, SystemStatus, WindowState, INITIAL_OS_STATE } from '../types';

export function useOS() {
  const [state, setState] = useState<OSState>(INITIAL_OS_STATE);

  const transitionTo = useCallback((status: SystemStatus) => {
    setState(prev => ({ ...prev, status }));
  }, []);

  const login = useCallback((username: string) => {
    setState(prev => ({ ...prev, user: username, status: 'DESKTOP' }));
  }, []);

  const openApp = useCallback((appId: string, title: string) => {
    setState(prev => {
      // If already open, just bring to front
      const existing = prev.openWindows.find(w => w.id === appId);
      if (existing) {
        return {
          ...prev,
          activeWindowId: appId,
          openWindows: prev.openWindows.map(w => 
            w.id === appId ? { ...w, isOpen: true, zIndex: Math.max(...prev.openWindows.map(x => x.zIndex)) + 1 } : w
          )
        };
      }

      const newWindow: WindowState = {
        id: appId,
        title,
        icon: '', // Handled by UI
        isOpen: true,
        isMaximized: false,
        zIndex: Math.max(0, ...prev.openWindows.map(x => x.zIndex)) + 1,
        component: appId
      };

      return {
        ...prev,
        openWindows: [...prev.openWindows, newWindow],
        activeWindowId: appId
      };
    });
  }, []);

  const closeWindow = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      openWindows: prev.openWindows.filter(w => w.id !== id),
      activeWindowId: prev.activeWindowId === id ? null : prev.activeWindowId
    }));
  }, []);

  const toggleAIPanel = useCallback(() => {
    setState(prev => ({ ...prev, isAIPanelOpen: !prev.isAIPanelOpen }));
  }, []);

  return {
    state,
    transitionTo,
    login,
    openApp,
    closeWindow,
    toggleAIPanel
  };
}
