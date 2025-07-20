import React, { useState, useEffect } from 'react';
import { useFileSystem } from '../../contexts/FileSystemContext';
import MenuBar from '../MenuBar';

const Notepad = ({ appData }) => {
  const [content, setContent] = useState('');
  const { fs, updateFileContent } = useFileSystem();
  const [filePath, setFilePath] = useState(appData?.filePath);

  useEffect(() => {
    if (filePath) {
      const file = getObjectFromPath(fs, filePath);
      if (file && file.type === 'file') {
        setContent(file.content);
      }
    }
  }, [fs, filePath]);

  const handleNew = () => {
    const confirmed = window.confirm("Are you sure you want to start a new file? Any unsaved changes will be lost.");
    if (confirmed) {
      setContent('');
      setFilePath(null);
    }
  };

  const handleSave = () => {
    if (filePath) {
      updateFileContent(filePath, content);
      alert("File saved!");
    } else {
      const newFilePathStr = prompt("Save As...\nEnter full path (e.g., C: > Users > Public > Documents > newfile.txt)");
      if (newFilePathStr) {
        const newFilePath = newFilePathStr.split(' > ');
        updateFileContent(newFilePath, content);
        setFilePath(newFilePath);
      }
    }
  };

  const menuItems = [
    {
      label: "File",
      actions: [
        { label: "New", onClick: handleNew },
        { label: "Save", onClick: handleSave }
      ]
    }
  ];

  return (
    <div className="w-[480px] h-[400px] bg-zinc-900 rounded-b-xl flex flex-col text-white">
      <MenuBar items={menuItems} />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="flex-grow bg-zinc-900 text-white p-4 focus:outline-none"
        placeholder="Start typing..."
      />
    </div>
  );
};

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

export default Notepad;