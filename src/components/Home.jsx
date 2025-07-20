import React, { useState } from 'react';
import ContextMenu from './ContextMenu';
import { useFileSystem } from '../contexts/FileSystemContext';

// --- Icon Components ---
const FileManagerIcon = () => (<img src="src/assets/file_manager.png" alt="File Manager" className="w-full h-full object-contain" />);
const RecycleBinIcon = () => (<img src="src/assets/recycl-bin.png" alt="Recycle Bin" className="w-full h-full object-contain" />);
const NotepadIcon = () => (<img src="src/assets/notepad.png" alt="Notepad" className="w-full h-full object-contain" />);
const TicTacToeIcon = () => (<img src="src/assets/tic-tac-toe-icon.svg" alt="Tic Tac Toe" className="w-full h-full object-contain" />);
const CalculatorIcon = () => (<img src="src/assets/calculator-icon.png" alt="Calculator" className="w-full h-full object-contain" />);
const FolderIcon = () => (<img src="src/assets/folder-icon.png" alt="Folder" className="w-full h-full object-contain" />);

const appIcons = {
  filemanager: <FileManagerIcon />,
  recyclebin: <RecycleBinIcon />,
  notepad: <NotepadIcon />,
  tictactoe: <TicTacToeIcon />,
  calculator: <CalculatorIcon />,
  folder: <FolderIcon />,
};

const wallpapers = [
    'src/assets/background1.png',
    'src/assets/background2.png',
    'src/assets/background3.png',
  
];

const Home = ({ openApp }) => {
  const { fs, setFs } = useFileSystem();

  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0 });
  // State to track the current wallpaper
  const [currentWallpaperIndex, setCurrentWallpaperIndex] = useState(0);

  const desktopPath = fs['C:'].children['Users'].children['Public'].children['Desktop'];
  const desktopItems = Object.entries(desktopPath.children).map(([name, item]) => ({
      id: name,
      ...item
  }));

  const handleContextMenu = (e) => {
    e.preventDefault();
    setContextMenu({ visible: true, x: e.pageX, y: e.pageY });
  };

  const closeContextMenu = () => {
    setContextMenu({ ...contextMenu, visible: false });
  };

  const handleNewFolder = () => {
    setFs(currentFs => {
        const newFs = { ...currentFs };
        const desktop = newFs['C:'].children['Users'].children['Public'].children['Desktop'];
        const newFolderName = `New Folder ${Object.keys(desktop.children).length + 1}`;
        desktop.children[newFolderName] = { type: 'folder', children: {} };
        return newFs;
    });
  };

  const handleRefresh = () => {
    const desktopEl = document.getElementById('desktop-background');
    if(desktopEl) {
        desktopEl.style.transition = 'opacity 0.1s ease-in-out';
        desktopEl.style.opacity = 0.8;
        setTimeout(() => { desktopEl.style.opacity = 1; }, 100);
    }
  };

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
      {desktopItems.map(item => (
          <div 
            key={item.id} 
            onClick={() => openApp && openApp(item.id)}
            className='flex flex-col items-center justify-center w-24 h-24 p-2 rounded-lg hover:bg-black/20 cursor-pointer transition-colors duration-200'
          >
            <div className='w-12 h-12'>{appIcons[item.type] || appIcons['folder']}</div>
            <span className='text-white text-xs mt-2 text-center select-none'>{item.id}</span>
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
