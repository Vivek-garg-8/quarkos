import React, { useState } from 'react';
import { FiFolder, FiSettings, FiCalculator, FiEdit3, FiGrid3X3 } from 'react-icons/fi';

const DockIcon = ({ icon: Icon, label, isActive, onClick, onMouseEnter, onMouseLeave }) => (
  <div className="relative group">
    <button
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`
        w-14 h-14 rounded-xl flex items-center justify-center
        transition-all duration-200 ease-out
        hover:scale-110 hover:-translate-y-1
        ${isActive 
          ? 'bg-blue-500 text-white shadow-lg' 
          : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white shadow-md'
        }
      `}
      aria-label={label}
    >
      <Icon size={24} />
      {isActive && (
        <div className="absolute -bottom-1 w-1 h-1 bg-white rounded-full" />
      )}
    </button>
    
    {/* Tooltip */}
    <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
      <div className="bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
        {label}
      </div>
    </div>
  </div>
);

const Dock = ({ onAppLaunch, activeApps = [] }) => {
  const [hoveredIcon, setHoveredIcon] = useState(null);

  const dockApps = [
    { id: 'File Manager', icon: FiFolder, label: 'File Manager' },
    { id: 'Calculator', icon: FiCalculator, label: 'Calculator' },
    { id: 'Notepad', icon: FiEdit3, label: 'Notepad' },
    { id: 'Tic Tac Toe', icon: FiGrid3X3, label: 'Tic Tac Toe' },
    { id: 'Settings', icon: FiSettings, label: 'Settings' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 bg-white/10 backdrop-blur-xl border-t border-white/20">
      <div className="flex items-center justify-center h-full">
        <div className="flex items-center space-x-3 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-2xl">
          {dockApps.map((app) => (
            <DockIcon
              key={app.id}
              icon={app.icon}
              label={app.label}
              isActive={activeApps.includes(app.id)}
              onClick={() => onAppLaunch(app.id)}
              onMouseEnter={() => setHoveredIcon(app.id)}
              onMouseLeave={() => setHoveredIcon(null)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dock;