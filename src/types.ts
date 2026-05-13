/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type SystemStatus = 'OFF' | 'BIOS' | 'KERNEL_LOAD' | 'BOOTING' | 'LOCK_SCREEN' | 'DESKTOP';

export interface WindowState {
  id: string;
  title: string;
  icon: string;
  isOpen: boolean;
  isMaximized: boolean;
  zIndex: number;
  component: string;
}

export interface OSState {
  status: SystemStatus;
  user: string | null;
  openWindows: WindowState[];
  activeWindowId: string | null;
  isAIPanelOpen: boolean;
  theme: 'dark' | 'light' | 'hacker' | 'security';
}

export const INITIAL_OS_STATE: OSState = {
  status: 'OFF',
  user: null,
  openWindows: [],
  activeWindowId: null,
  isAIPanelOpen: false,
  theme: 'dark',
};
