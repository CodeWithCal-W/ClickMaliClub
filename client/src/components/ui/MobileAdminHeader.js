import React from 'react';
import { Menu, ChevronDown, Maximize, Grid, List, Settings } from 'react-feather';
import useDeviceDetection from '../../hooks/useDeviceDetection';

const MobileAdminHeader = ({ 
  activeSection, 
  onSectionChange, 
  onToggleSidebar, 
  showSidebar, 
  onLogout,
  stats 
}) => {
  const device = useDeviceDetection();

  const sections = [
    { key: 'overview', label: 'Overview', icon: Grid },
    { key: 'deals', label: 'Deals', icon: List },
    { key: 'categories', label: 'Categories', icon: Settings },
    { key: 'blog', label: 'Blog', icon: List },
    { key: 'subscribers', label: 'Subscribers', icon: List },
    { key: 'business-growth', label: 'Analytics', icon: Grid }
  ];

  const currentSection = sections.find(s => s.key === activeSection);

  if (!device.isMobile) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-3">
        {/* Menu Button & Logo */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold text-primary-600 dark:text-primary-400">
            Admin
          </h1>
        </div>

        {/* Quick Stats */}
        <div className="flex items-center space-x-4 text-sm">
          <div className="text-center">
            <div className="font-semibold text-gray-900 dark:text-white">
              {stats.totalDeals || 0}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Deals</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-gray-900 dark:text-white">
              {stats.totalSubscribers || 0}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Subs</div>
          </div>
        </div>
      </div>

      {/* Section Selector */}
      <div className="px-4 pb-3">
        <div className="relative">
          <select
            value={activeSection}
            onChange={(e) => onSectionChange(e.target.value)}
            className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white appearance-none pr-10"
          >
            {sections.map((section) => (
              <option key={section.key} value={section.key}>
                {section.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {showSidebar && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div 
            className="fixed inset-0 bg-black opacity-50"
            onClick={onToggleSidebar}
          />
          <div className="fixed top-0 left-0 bottom-0 w-80 bg-white dark:bg-gray-800 shadow-xl">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Admin Menu
                </h2>
                <button
                  onClick={onToggleSidebar}
                  className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <Maximize className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-4">
              <nav className="space-y-2">
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.key}
                      onClick={() => {
                        onSectionChange(section.key);
                        onToggleSidebar();
                      }}
                      className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${
                        activeSection === section.key
                          ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{section.label}</span>
                    </button>
                  );
                })}
              </nav>
              
              <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={onLogout}
                  className="w-full p-3 text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors font-medium"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileAdminHeader;
