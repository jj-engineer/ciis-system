import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { MobileNav } from './MobileNav';
import { RoleSwitcherBanner } from '../common/RoleSwitcherBanner';

interface AppLayoutProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeTabTitle: string;
  onVisitWebsite?: () => void;
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  activeTab,
  setActiveTab,
  activeTabTitle,
  onVisitWebsite,
  children
}) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col antialiased">
      {/* Top Role Simulator Switcher for fast evaluation */}
      <RoleSwitcherBanner />

      <div className="flex-1 flex h-[calc(100vh-37px)] overflow-hidden">
        {/* Desktop Sidebar (hidden on mobile) */}
        <div className="hidden md:block">
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onVisitWebsite={onVisitWebsite}
          />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Navbar
            activeTabTitle={activeTabTitle}
            onVisitWebsite={onVisitWebsite}
          />

          <main className="flex-1 overflow-y-auto p-3 sm:p-6 lg:p-8 pb-24 md:pb-8">
            <div key={activeTab} className="max-w-7xl mx-auto animate-fade-slide-up">
              {children}
            </div>
          </main>
        </div>
      </div>

      {/* Mobile Bottom Bar & Slide Drawer */}
      <MobileNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onVisitWebsite={onVisitWebsite}
      />
    </div>
  );
};
