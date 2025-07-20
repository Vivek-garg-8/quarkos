import React from 'react';
import { FaFolder, FaFileAlt, FaWindows } from 'react-icons/fa';

const Taskbar = ({ openApp }) => {
  return (
    <div className="w-full bg-zinc-800 bg-opacity-80 backdrop-blur-md h-12 flex items-center px-4 justify-between border-t border-zinc-700">
      <div className="flex items-center gap-4">
        <button className="text-white text-2xl hover:bg-zinc-700 p-2 rounded-md">
          <FaWindows />
        </button>
        <button
          onClick={() => openApp('FileExplorer')}
          className="text-yellow-500 text-2xl hover:bg-zinc-700 p-2 rounded-md"
        >
          <FaFolder />
        </button>
        <button
          onClick={() => openApp('Notepad')}
          className="text-gray-300 text-2xl hover:bg-zinc-700 p-2 rounded-md"
        >
          <FaFileAlt />
        </button>
      </div>
      <div className="text-white text-sm">
        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
    </div>
  );
};

export default Taskbar;