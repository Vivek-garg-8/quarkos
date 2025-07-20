import React from 'react';
import { FaFolder, FaFileAlt } from 'react-icons/fa';

const DesktopIcon = ({ icon, label, onDoubleClick }) => (
  <div
    className="flex flex-col items-center gap-2 cursor-pointer p-2 rounded-md hover:bg-blue-500 hover:bg-opacity-50"
    onDoubleClick={onDoubleClick}
  >
    <div className="text-5xl text-white">{icon}</div>
    <span className="text-white text-sm">{label}</span>
  </div>
);

const Desktop = ({ openApp }) => {
  return (
    <div className="flex-grow p-4">
      <div className="flex flex-col items-start gap-4">
        <DesktopIcon
          icon={<FaFolder />}
          label="File Explorer"
          onDoubleClick={() => openApp('FileExplorer')}
        />
        <DesktopIcon
          icon={<FaFileAlt />}
          label="Notepad"
          onDoubleClick={() => openApp('Notepad')}
        />
      </div>
    </div>
  );
};

export default Desktop;