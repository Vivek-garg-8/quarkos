import React, { useState } from "react";
import ContextMenu from "./ContextMenu";
import { useFileSystem } from "../contexts/FileSystemContext";

const FileManagerIcon = () => (
  <img
    src="src/assets/file_manager.png"
    alt="File Manager"
    className="w-full h-full object-contain"
  />
);
const RecycleBinIcon = () => (
  <img
    src="src/assets/recycl-bin.png"
    alt="Recycle Bin"
    className="w-full h-full object-contain"
  />
);
const NotepadIcon = () => (
  <img
    src="src/assets/notepad.png"
    alt="Notepad"
    className="w-full h-full object-contain"
  />
);
const TicTacToeIcon = () => (
  <img
    src="src/assets/tic-tac-toe-icon.svg"
    alt="Tic Tac Toe"
    className="w-full h-full object-contain"
  />
);
const CalculatorIcon = () => (
  <img
    src="src/assets/calculator-icon.png"
    alt="Calculator"
    className="w-full h-full object-contain"
  />
);
const FolderIcon = () => (
  <img
    src="src/assets/folder-icon.png"
    alt="Folder"
    className="w-full h-full object-contain"
  />
);
const FileIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-12 w-12 text-black-300"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    {" "}
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
    />{" "}
  </svg>
);

const appIcons = {
  filemanager: <FileManagerIcon />,
  recyclebin: <RecycleBinIcon />,
  notepad: <NotepadIcon />,
  tictactoe: <TicTacToeIcon />,
  calculator: <CalculatorIcon />,
  folder: <FolderIcon />,
  file: <FileIcon />,
};

const wallpapers = [
  "src/assets/background1.png",
  "src/assets/background2.png",
  "src/assets/background3.png",
];

const Home = ({ openApp }) => {
  const { fs, setFs , createItem } = useFileSystem();

  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
  });
  const [currentWallpaperIndex, setCurrentWallpaperIndex] = useState(0);

  const desktopPath =
    fs["C:"].children["Users"].children["Public"].children["Desktop"];
  const desktopItems = Object.entries(desktopPath.children).map(
    ([name, item]) => ({
      id: name,
      ...item,
    })
  );

  const handleContextMenu = (e) => {
    e.preventDefault();
    setContextMenu({ visible: true, x: e.pageX, y: e.pageY });
  };
  const closeContextMenu = () => {
    setContextMenu({ ...contextMenu, visible: false });
  };
  const handleNewFolder = () => {
    const desktopFsPath = ["C:", "Users", "Public", "Desktop"];
    
    let newFolderName = "New Folder";
    let counter = 1;
    const existingNames = Object.keys(desktopPath.children);
    while (existingNames.includes(newFolderName)) {
        counter++;
        newFolderName = `New Folder ${counter}`;
    }

    createItem(desktopFsPath, newFolderName, "folder");
  };
  const handleRefresh = () => {
    const desktopEl = document.getElementById("desktop-background");
    if (desktopEl) {
      desktopEl.style.transition = "opacity 0.1s ease-in-out";
      desktopEl.style.opacity = 0.8;
      setTimeout(() => {
        desktopEl.style.opacity = 1;
      }, 100);
    }
  };
  const handleChangeWallpaper = () => {
    setCurrentWallpaperIndex(
      (prevIndex) => (prevIndex + 1) % wallpapers.length
    );
  };

  const contextMenuItems = [
    { label: "New Folder", onClick: handleNewFolder },
    { label: "Refresh", onClick: handleRefresh },
    { label: "Change Wallpaper", onClick: handleChangeWallpaper },
  ];

  // **3. New handler to determine what to do on click**
  const handleDesktopItemClick = (item) => {
    if (!openApp) return;

    const { id, type } = item;
    const fullPath = ["C:", "Users", "Public", "Desktop", id];

    if (type === "folder") {
      // If it's a folder, open File Manager.
      // The File Manager will start at its default location.
      openApp("File Manager");
    } else if (type === "file") {
      // If it's a file, open it in Notepad with its path.
      openApp("Notepad", { filePath: fullPath });
    } else {
      // Otherwise, it's an app shortcut. Open the app by its ID.
      // This relies on the item 'id' matching the app name in App.jsx (e.g., 'Notepad', 'Calculator')
      openApp(id);
    }
  };

  return (
    <div
      id="desktop-background"
      onContextMenu={handleContextMenu}
      className="p-4 h-[calc(100vh-50px)] relative bg-cover bg-center transition-all duration-500"
      style={{ backgroundImage: `url(${wallpapers[currentWallpaperIndex]})` }}
      onClick={closeContextMenu} // Close context menu when clicking anywhere on the desktop
    >
      <div className="flex flex-col flex-wrap content-start h-full gap-4">
        {desktopItems.map((item) => (
          <div
            key={item.id}
            // **4. Updated onClick handler**
            onDoubleClick={() => handleDesktopItemClick(item)} // Changed to onDoubleClick for standard OS behavior
            className="flex flex-col items-center justify-center w-24 h-24 p-2 rounded-lg hover:bg-black/20 cursor-pointer transition-colors duration-200"
          >
            {/* **5. Updated icon logic to include the new FileIcon** */}
            <div className="w-12 h-12">
              {appIcons[item.type] || <FileIcon />}
            </div>
            <span className="text-white text-xs mt-2 text-center select-none">
              {item.id}
            </span>
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
