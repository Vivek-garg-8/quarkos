import React, { useState } from 'react';
import ContextMenu from './ContextMenu';
import { useFileSystem } from '../contexts/FileSystemContext';

const DesktopEnvironment = ({ children, onNewFolder, onRefresh, onSettings }) => {
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0 });
  const { createItem } = useFileSystem();

  const handleRightClick = (e) => {
    e.preventDefault();
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY
    });
  };

  const closeContextMenu = () => {
    setContextMenu({ ...contextMenu, visible: false });
  };

  const handleNewFolder = () => {
    const desktopPath = ["C:", "Users", "Public", "Desktop"];
    const folderName = prompt("Enter folder name:", "New Folder");
    if (folderName) {
      createItem(desktopPath, folderName, "folder");
    }
    closeContextMenu();
  };

  const handleRefresh = () => {
    // Add refresh animation
    const desktop = document.getElementById('desktop-environment');
    if (desktop) {
      desktop.style.opacity = '0.8';
      setTimeout(() => {
        desktop.style.opacity = '1';
      }, 200);
    }
    closeContextMenu();
  };

  const contextMenuItems = [
    { label: 'New Folder', onClick: handleNewFolder },
    { label: 'Refresh', onClick: handleRefresh },
    { label: 'Settings', onClick: onSettings }
  ];

  return (
    <div
      id="desktop-environment"
      className="fixed inset-0 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 transition-opacity duration-200"
      onContextMenu={handleRightClick}
      onClick={closeContextMenu}
    >
      {/* Desktop Icons Area */}
      <div className="absolute top-4 left-4 z-10">
        {/* Desktop icons will be rendered here */}
      </div>

      {/* Windows Container */}
      <div className="relative w-full h-full pb-20">
        {children}
      </div>

      {/* Context Menu */}
      {contextMenu.visible && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          items={contextMenuItems}
          onClose={closeContextMenu}
        />
      )}
    </div>
  );
};

export default DesktopEnvironment;