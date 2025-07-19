import React, { useState } from 'react';
import ContextMenu from './ContextMenu';

// --- Icon Components ---
const FileManagerIcon = () => (<img src="src/assets/file_manager.png" alt="File Manager" className="w-full h-full object-contain" />);
const RecycleBinIcon = () => (<img src="src/assets/recycl-bin.png" alt="Recycle Bin" className="w-full h-full object-contain" />);
const NotepadIcon = () => (<img src="src/assets/notepad.png" alt="Notepad" className="w-full h-full object-contain" />);
const TicTacToeIcon = () => (<img src="src/assets/tic-tac-toe-icon.svg" alt="Tic Tac Toe" className="w-full h-full object-contain" />);
const CalculatorIcon = () => (<img src="src/assets/calculator-icon.png" alt="Calculator" className="w-full h-full object-contain" />);
const FolderIcon = () => (<img src="src/assets/folder-icon.png" alt="Folder" className="w-full h-full object-contain" />);

const wallpapers = [
    'src/assets/background1.png',
    'src/assets/background2.png',
    'src/assets/background3.png',
  
];

const Home = ({ openApp }) => {
  const initialApps = [
    { id: 'filemanager', name: 'File Manager', icon: <FileManagerIcon /> },
    { id: 'recyclebin', name: 'Recycle bin', icon: <RecycleBinIcon /> },
    { id: 'notepad', name: 'Notepad', icon: <NotepadIcon /> },
    { id: 'tictactoe', name: 'Tic Tac Toe', icon: <TicTacToeIcon /> },
    { id: 'calculator', name: 'Calculator', icon: <CalculatorIcon /> },
  ];

  const [desktopApps, setDesktopApps] = useState(initialApps);
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0 });
  // State to track the current wallpaper
  const [currentWallpaperIndex, setCurrentWallpaperIndex] = useState(0);

  const handleContextMenu = (e) => {
    e.preventDefault();
    setContextMenu({ visible: true, x: e.pageX, y: e.pageY });
  };

  const closeContextMenu = () => {
    setContextMenu({ ...contextMenu, visible: false });
  };

  const handleNewFolder = () => {
    const newFolder = {
      id: `folder-${Date.now()}`,
      name: 'New Folder',
      icon: <FolderIcon />,
    };
    setDesktopApps([...desktopApps, newFolder]);
  };

  const handleRefresh = () => {
    const desktopEl = document.getElementById('desktop-background');
    if(desktopEl) {
        desktopEl.style.transition = 'opacity 0.1s ease-in-out';
        desktopEl.style.opacity = 0.8;
        setTimeout(() => { desktopEl.style.opacity = 1; }, 100);
    }
  };

  // This function now cycles through the wallpapers array
  const handleChangeWallpaper = () => {
    setCurrentWallpaperIndex((prevIndex) => (prevIndex + 1) % wallpapers.length);
  };

  const contextMenuItems = [
    { label: 'New Folder', onClick: handleNewFolder },
    { label: 'Refresh', onClick: handleRefresh },
    { label: 'Change Wallpaper', onClick: handleChangeWallpaper },
  ];

  return (
    <div
      id="desktop-background"
      onContextMenu={handleContextMenu}
      className='p-4 h-[calc(100vh-50px)] relative bg-cover bg-center transition-all duration-500'
      style={{ backgroundImage: `url(${wallpapers[currentWallpaperIndex]})` }}
    >
      <div className='flex flex-col flex-wrap content-start h-full gap-4'>
        {desktopApps.map(app => (
          <div 
            key={app.id} 
            onClick={() => openApp && openApp(app.id)}
            className='flex flex-col items-center justify-center w-24 h-24 p-2 rounded-lg hover:bg-black/20 cursor-pointer transition-colors duration-200'
          >
            <div className='w-12 h-12'>{app.icon}</div>
            <span className='text-white text-xs mt-2 text-center select-none'>{app.name}</span>
          </div>
        ))}
      </div>

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

export default Home;
