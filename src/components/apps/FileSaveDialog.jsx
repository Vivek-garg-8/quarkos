import React, { useState } from 'react';
import { FiFolder, FiFile, FiSearch, FiPlus, FiHome, FiChevronRight } from 'react-icons/fi';
import { useFileSystem } from '../../contexts/FileSystemContext';

const FileSaveDialog = ({ onSave, onCancel, defaultName = 'Untitled' }) => {
  const { fs, createItem } = useFileSystem();
  const [currentPath, setCurrentPath] = useState(['C:', 'Users', 'Public', 'Documents']);
  const [fileName, setFileName] = useState(defaultName);
  const [searchTerm, setSearchTerm] = useState('');
  const [fileType, setFileType] = useState('all');

  const getObjectFromPath = (fs, path) => {
    let current = fs;
    for (const part of path) {
      if (current && current[part]) {
        current = current[part];
      } else if (current && current.children && current.children[part]) {
        current = current.children[part];
      } else {
        return null;
      }
    }
    return current;
  };

  const currentDirectory = getObjectFromPath(fs, currentPath);
  const items = currentDirectory?.children ? Object.entries(currentDirectory.children) : [];

  const filteredItems = items.filter(([name, item]) => {
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = fileType === 'all' || 
      (fileType === 'folders' && (item.type === 'folder' || item.type === 'drive')) ||
      (fileType === 'files' && item.type === 'file');
    return matchesSearch && matchesType;
  });

  const handleNavigate = (itemName) => {
    const item = currentDirectory.children[itemName];
    if (item && (item.type === 'folder' || item.type === 'drive')) {
      setCurrentPath([...currentPath, itemName]);
    }
  };

  const handleBreadcrumbClick = (index) => {
    setCurrentPath(currentPath.slice(0, index + 1));
  };

  const handleNewFolder = () => {
    const folderName = prompt('Enter folder name:', 'New Folder');
    if (folderName) {
      createItem(currentPath, folderName, 'folder');
    }
  };

  const handleSave = () => {
    if (!fileName.trim()) {
      alert('Please enter a file name');
      return;
    }
    onSave([...currentPath, fileName.trim()]);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-[600px] h-[500px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Save File</h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-150"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPath(['C:', 'Users', 'Public'])}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors duration-150"
              title="Home"
            >
              <FiHome size={16} />
            </button>
            <button
              onClick={handleNewFolder}
              className="flex items-center space-x-1 px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-150"
            >
              <FiPlus size={14} />
              <span className="text-sm">New Folder</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <select
              value={fileType}
              onChange={(e) => setFileType(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Items</option>
              <option value="folders">Folders</option>
              <option value="files">Files</option>
            </select>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="flex items-center px-4 py-2 bg-gray-50 border-b border-gray-200">
          {currentPath.map((part, index) => (
            <React.Fragment key={index}>
              <button
                onClick={() => handleBreadcrumbClick(index)}
                className="text-sm text-blue-600 hover:text-blue-800 transition-colors duration-150"
              >
                {part}
              </button>
              {index < currentPath.length - 1 && (
                <FiChevronRight size={14} className="text-gray-400 mx-1" />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <FiSearch size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search files and folders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* File List */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-1">
            {filteredItems.map(([name, item]) => (
              <div
                key={name}
                onClick={() => {
                  if (item.type === 'file') {
                    setFileName(name);
                  } else {
                    handleNavigate(name);
                  }
                }}
                className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors duration-150"
              >
                {item.type === 'folder' || item.type === 'drive' ? (
                  <FiFolder size={16} className="text-blue-500" />
                ) : (
                  <FiFile size={16} className="text-gray-500" />
                )}
                <span className="text-sm text-gray-900">{name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              File name:
            </label>
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter file name"
            />
          </div>
          <div className="flex space-x-2 ml-4">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors duration-150"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-150"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileSaveDialog;