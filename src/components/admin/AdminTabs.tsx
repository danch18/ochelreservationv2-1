'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui';

interface AdminTabsProps {
  defaultTab?: string;
  children: React.ReactNode;
}

interface TabContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const TabContext = React.createContext<TabContextType | undefined>(undefined);

export function AdminTabs({ defaultTab = 'overview', children }: AdminTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <TabContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="bg-card/80 backdrop-blur-sm border-border/50 rounded-lg border">
        <div className="border-b border-border/50 p-4">
          <div className="flex space-x-2">
            <TabButton id="overview">Overview</TabButton>
            <TabButton id="settings">Settings</TabButton>
          </div>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </TabContext.Provider>
  );
}

interface TabButtonProps {
  id: string;
  children: React.ReactNode;
}

function TabButton({ id, children }: TabButtonProps) {
  const context = React.useContext(TabContext);
  if (!context) {
    throw new Error('TabButton must be used within AdminTabs');
  }

  const { activeTab, setActiveTab } = context;
  const isActive = activeTab === id;

  return (
    <Button
      onClick={() => setActiveTab(id)}
      variant={isActive ? 'primary' : 'secondary'}
      size="sm"
    >
      {children}
    </Button>
  );
}

interface TabPanelProps {
  id: string;
  children: React.ReactNode;
}

export function TabPanel({ id, children }: TabPanelProps) {
  const context = React.useContext(TabContext);
  if (!context) {
    throw new Error('TabPanel must be used within AdminTabs');
  }

  const { activeTab } = context;
  if (activeTab !== id) {
    return null;
  }

  return <div>{children}</div>;
}
