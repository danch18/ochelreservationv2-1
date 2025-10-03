'use client';

import { cn } from '@/lib/utils';

interface AdminTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'overview', label: 'Vue d\'ensemble', mobileLabel: 'Aperçu', icon: '📊' },
  { id: 'settings', label: 'Paramètres', mobileLabel: 'Paramètres', icon: '⚙️' },
  { id: 'manage', label: 'Gestion des Réservations', mobileLabel: 'Gestion', icon: '🍽️' },
  { id: 'menu', label: 'Gestion du Menu', mobileLabel: 'Menu', icon: '📋' },
];

export function AdminTabs({ activeTab, onTabChange }: AdminTabsProps) {
  return (
    <div className="font-forum">
      {/* Desktop Tabs */}
      <div className="hidden md:block !border-b !border-[#F6F1F0]">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                'flex items-center py-3 px-4 border-b-2 font-medium text-sm transition-colors rounded-t-lg cursor-pointer',
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

      {/* Mobile Bottom Navigation */}
      <div className="block md:hidden">
        <nav className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                'flex-1 flex flex-col items-center justify-center py-3 px-2 transition-all duration-200 cursor-pointer',
                activeTab === tab.id
                  ? 'text-[#F34A23] bg-[#F34A23]/5'
                  : 'text-gray-600 hover:text-[#F34A23] hover:bg-[#F34A23]/5'
              )}
            >
              <div className={cn(
                'w-6 h-6 rounded-full flex items-center justify-center mb-1 transition-all duration-200',
                activeTab === tab.id 
                  ? 'bg-[#F34A23] text-white text-sm' 
                  : 'text-lg'
              )}>
                {activeTab === tab.id ? (
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                ) : (
                  <span className="text-base">{tab.icon}</span>
                )}
              </div>
              <span className="text-xs font-medium">{tab.mobileLabel}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}