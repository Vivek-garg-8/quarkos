import React, { useState } from 'react';
import WindowManager from './components/WindowManager';
import DesktopEnvironment from './components/DesktopEnvironment';
import Dock from './components/Dock';
import NotificationSystem from './components/NotificationSystem';

import Calculator from './components/apps/Calculator';
import Notepad from './components/apps/Notepad';
import TicTacToe from './components/apps/TicTacToe';
import FileExplorer from './components/apps/FileExplorer';
import Settings from './components/apps/Settings';

const App = () => {
  const [windows, setWindows] = useState([]);
  const [nextZIndex, setNextZIndex] = useState(1);
  const [activeApps, setActiveApps] = useState([]);

  const openApp = (appId, data = null) => {
    // Check if app is already open
    const existingWindow = windows.find(w => w.appId === appId && !w.isMinimized);
    if (existingWindow) {
      // Bring to front
      bringToFront(existingWindow.id);
      return;
    }

    const windowId = Date.now() + Math.random();
    const newWindow = {
      id: windowId,
      appId,
      title: getAppTitle(appId),
      data,
      zIndex: nextZIndex,
      isMinimized: false,
      position: getRandomPosition(),
      size: getDefaultSize(appId)
    };

    setWindows(prev => [...prev, newWindow]);
    setNextZIndex(prev => prev + 1);
    setActiveApps(prev => [...new Set([...prev, appId])]);
  };

  const closeWindow = (windowId) => {
    const window = windows.find(w => w.id === windowId);
    setWindows(prev => prev.filter(w => w.id !== windowId));
    
    // Remove from active apps if no other windows of this app are open
    const remainingWindows = windows.filter(w => w.id !== windowId && w.appId === window.appId);
    if (remainingWindows.length === 0) {
      setActiveApps(prev => prev.filter(appId => appId !== window.appId));
    }
  };

  const minimizeWindow = (windowId) => {
    setWindows(prev => prev.map(w => 
      w.id === windowId ? { ...w, isMinimized: true } : w
    ));
  };

  const restoreWindow = (appId) => {
    setWindows(prev => prev.map(w => 
      w.appId === appId && w.isMinimized ? { ...w, isMinimized: false } : w
    ));
  };

  const bringToFront = (windowId) => {
    setWindows(prev => prev.map(w => 
      w.id === windowId ? { ...w, zIndex: nextZIndex } : w
    ));
    setNextZIndex(prev => prev + 1);
  };

  const getAppTitle = (appId) => {
    const titles = {
      'File Manager': 'File Explorer',
      'Calculator': 'Calculator',
      'Notepad': 'Notepad',
      'Tic Tac Toe': 'Tic Tac Toe',
      'Settings': 'System Settings'
    };
    return titles[appId] || appId;
  };

  const getRandomPosition = () => ({
    x: Math.random() * 200 + 100,
    y: Math.random() * 100 + 50
  });

  const getDefaultSize = (appId) => {
    const sizes = {
      'Calculator': { width: 400, height: 500 },
      'Notepad': { width: 600, height: 400 },
      'File Manager': { width: 800, height: 600 },
      'Tic Tac Toe': { width: 400, height: 500 },
      'Settings': { width: 700, height: 500 }
    };
    return sizes[appId] || { width: 600, height: 400 };
  };

  const renderAppComponent = (appId, data) => {
    switch (appId) {
      case 'Notepad':
        return <Notepad appData={data} />;
      case 'Calculator':
        return <Calculator />;
      case 'Tic Tac Toe':
        return <TicTacToe />;
      case 'File Manager':
        return <FileExplorer openApp={openApp} />;
      case 'Settings':
        return <Settings />;
      default:
        return <div className="p-4">Unknown application</div>;
    }
  };

  const handleAppLaunch = (appId) => {
    // Check if app is minimized and restore it
    const minimizedWindow = windows.find(w => w.appId === appId && w.isMinimized);
    if (minimizedWindow) {
      restoreWindow(appId);
      bringToFront(minimizedWindow.id);
    } else {
      openApp(appId);
    }
  };

  const handleSettings = () => {
    openApp('Settings');
  };

  return (
    <div className="h-screen overflow-hidden">
      <DesktopEnvironment onSettings={handleSettings}>
        {windows.map(window => (
          <WindowManager
            key={window.id}
            id={window.id}
            title={window.title}
            onClose={closeWindow}
            onMinimize={minimizeWindow}
            isMinimized={window.isMinimized}
            initialPosition={window.position}
            initialSize={window.size}
            zIndex={window.zIndex}
          >
            {renderAppComponent(window.appId, window.data)}
          </WindowManager>
        ))}
      </DesktopEnvironment>
      
      <Dock 
        onAppLaunch={handleAppLaunch}
        activeApps={activeApps}
      />
      
      <NotificationSystem />
    </div>
  );
};

export default App;