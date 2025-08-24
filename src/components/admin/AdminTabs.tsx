'use client';

import { cn } from '@/lib/utils';

interface AdminTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'overview', label: 'Vue d\'ensemble', icon: '📊' },
  { id: 'reservations', label: 'Réservations', icon: '📅' },
  { id: 'settings', label: 'Paramètres', icon: '⚙️' },
];

export function AdminTabs({ activeTab, onTabChange }: AdminTabsProps) {
  return (
    <div className="border-b border-white/10">
      <nav className="-mb-px flex space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              'flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors',
              activeTab === tab.id
                ? 'border-[#644a40] text-[#644a40]'
                : 'border-transparent text-white/70 hover:text-white hover:border-white/20'
            )}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}