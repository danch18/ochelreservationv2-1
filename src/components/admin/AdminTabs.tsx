'use client';

import { cn } from '@/lib/utils';
import { useTranslation } from '@/contexts/LanguageContext';

interface AdminTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function AdminTabs({ activeTab, onTabChange }: AdminTabsProps) {
  const { t } = useTranslation();

  const tabs = [
    { id: 'overview', labelKey: 'admin.tabs.overview', mobileLabelKey: 'admin.tabs.overviewMobile', icon: '📊' },
    { id: 'settings', labelKey: 'admin.tabs.settings', mobileLabelKey: 'admin.tabs.settingsMobile', icon: '⚙️' },
    { id: 'manage', labelKey: 'admin.tabs.manage', mobileLabelKey: 'admin.tabs.manageMobile', icon: '🍽️' },
    { id: 'menu', labelKey: 'admin.tabs.menu', mobileLabelKey: 'admin.tabs.menuMobile', icon: '📋' },
  ];
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
              <span>{t(tab.labelKey)}</span>
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
              <span className="text-xs font-medium">{t(tab.mobileLabelKey)}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}