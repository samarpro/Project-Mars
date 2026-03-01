import {
  Clock,
  FileText,
  Home,
  Trash2,
  type LucideIcon,
} from 'lucide-react';

export type SidebarAction = {
  label: string;
  icon: LucideIcon;
};

export type NavItem = {
  label: string;
  icon: LucideIcon;
  active?: boolean;
};

export type SectionItem = {
  label: string;
  icon: LucideIcon;
};

export type FilterItem = {
  label: string;
  icon?: LucideIcon;
  active?: boolean;
};

export type WorkspaceCard = {
  title: string;
  body: string;
  footerTitle: string;
  timestamp: string;
};

export const sidebarActions: SidebarAction[] = [
  { label: 'Delete', icon: Trash2 },
];

export const quickNavItems: NavItem[] = [
  { label: 'Home', icon: Home, active: true },
];

export const recentsLabel = {
  label: 'Recents',
  icon: Clock,
};

export const recentItems: SectionItem[] = [
  { label: 'Welcome to Spirit ✨', icon: FileText },
];

export const workspaceItems: SectionItem[] = [
  { label: 'Welcome to Spirit ✨', icon: FileText },
];

export const filterItems: FilterItem[] = [
  { label: 'All results', active: true },
  { label: 'Notes', icon: FileText },
  { label: 'Trash', icon: Trash2 },
];

export const cards: WorkspaceCard[] = [
  {
    title: 'Welcome to Spirit ✨',
    body: 'This is your workspace. Everything you put here like videos, links, notes, and files... Spirit remembers and understands.',
    footerTitle: 'Welcome to E...',
    timestamp: 'Now',
  },
];
