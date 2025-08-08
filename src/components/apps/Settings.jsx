import React, { useState } from 'react';
import { FiMonitor, FiPalette, FiSettings as FiSettingsIcon, FiZap } from 'react-icons/fi';

const SettingsTab = ({ icon: Icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`
      flex items-center space-x-3 w-full px-4 py-3 text-left rounded-lg transition-colors duration-150
      ${isActive 
        ? 'bg-blue-500 text-white' 
        : 'text-gray-700 hover:bg-gray-100'
      }
    `}
  >
    <Icon size={18} />
    <span className="font-medium">{label}</span>
  </button>
);

const Settings = () => {
  const [activeTab, setActiveTab] = useState('appearance');
  const [settings, setSettings] = useState({
    theme: 'light',
    background: 'gradient',
    dockPosition: 'bottom',
    animationSpeed: 'normal'
  });

  const tabs = [
    { id: 'appearance', icon: FiPalette, label: 'Appearance' },
    { id: 'desktop', icon: FiMonitor, label: 'Desktop' },
    { id: 'performance', icon: FiZap, label: 'Performance' }
  ];

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    
    // Apply changes immediately
    if (key === 'theme') {
      document.documentElement.setAttribute('data-theme', value);
    }
    
    // Show notification
    if (window.showNotification) {
      window.showNotification({
        type: 'success',
        title: 'Settings Updated',
        message: `${key} changed to ${value}`
      });
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'appearance':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Theme</h3>
              <div className="grid grid-cols-2 gap-3">
                {['light', 'dark'].map(theme => (
                  <button
                    key={theme}
                    onClick={() => updateSetting('theme', theme)}
                    className={`
                      p-4 rounded-lg border-2 transition-all duration-150 capitalize
                      ${settings.theme === theme
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                      }
                    `}
                  >
                    {theme} Mode
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Background</h3>
              <div className="grid grid-cols-3 gap-3">
                {['gradient', 'solid', 'image'].map(bg => (
                  <button
                    key={bg}
                    onClick={() => updateSetting('background', bg)}
                    className={`
                      p-3 rounded-lg border-2 transition-all duration-150 capitalize text-sm
                      ${settings.background === bg
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                      }
                    `}
                  >
                    {bg}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 'desktop':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Dock Position</h3>
              <div className="grid grid-cols-3 gap-3">
                {['bottom', 'left', 'right'].map(position => (
                  <button
                    key={position}
                    onClick={() => updateSetting('dockPosition', position)}
                    className={`
                      p-3 rounded-lg border-2 transition-all duration-150 capitalize
                      ${settings.dockPosition === position
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                      }
                    `}
                  >
                    {position}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 'performance':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Animation Speed</h3>
              <div className="grid grid-cols-3 gap-3">
                {['slow', 'normal', 'fast'].map(speed => (
                  <button
                    key={speed}
                    onClick={() => updateSetting('animationSpeed', speed)}
                    className={`
                      p-3 rounded-lg border-2 transition-all duration-150 capitalize
                      ${settings.animationSpeed === speed
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                      }
                    `}
                  >
                    {speed}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full bg-white flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-50 border-r border-gray-200 p-4">
        <div className="flex items-center space-x-2 mb-6">
          <FiSettingsIcon size={20} className="text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Settings</h2>
        </div>
        
        <nav className="space-y-2">
          {tabs.map(tab => (
            <SettingsTab
              key={tab.id}
              icon={tab.icon}
              label={tab.label}
              isActive={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            />
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default Settings;