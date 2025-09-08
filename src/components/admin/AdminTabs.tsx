'use client';

import { cn } from '@/lib/utils';

interface AdminTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'overview', label: 'Vue d\'ensemble' },
  { id: 'settings', label: 'Paramètres' },
];

export function AdminTabs({ activeTab, onTabChange }: AdminTabsProps) {
  return (
    <div className="!border-b !border-[#F6F1F0]">
      <nav className="-mb-px flex space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              'flex items-center py-3 px-4 border-b-2 font-medium text-sm transition-colors rounded-t-lg',
              activeTab === tab.id
                ? '!border-[#F34A23] text-[#F34A23] bg-[#F34A23]/5'
                : 'border-transparent text-black/70 hover:text-black hover:!border-[#F34A23]/30 hover:bg-[#F34A23]/5'
            )}
          >
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}