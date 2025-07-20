import React, { createContext, useContext, useState, useEffect } from 'react'; // Import useEffect
import { produce } from 'immer';

// --- Helper function (no changes) ---
const getParentNode = (fs, path) => {
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

// --- Initial file system (no changes) ---
const initialFileSystem = {
  'C:': {
    type: 'drive',
    children: {
      'Users': {
        type: 'folder',
        children: {
            'Public': {
                type: 'folder',
                children: {
                    'Desktop': {
                        type: 'folder',
                        children: {
                            'File Manager': { type: 'filemanager' },
                            'Recycle Bin': { type: 'recyclebin' },
                            'Notepad': { type: 'notepad' },
                            'Tic Tac Toe': { type: 'tictactoe' },
                            'Calculator': { type: 'calculator' },
                        }
                    },
                    'Documents': {
                        type: 'folder',
                        children: {
                            'Welcome.txt': {
                                type: 'file',
                                content: 'Welcome to your virtual OS!\n\nThis is a simple text file stored in your virtual file system.'
                            }
                        }
                    }
                }
            }
        }
      },
      'Windows': {
        type: 'folder',
        children: {},
      },
    },
  },
};

const FileSystemContext = createContext();

export const FileSystemProvider = ({ children }) => {
  const [fs, setFs] = useState(() => {
    try {
      const savedFs = window.localStorage.getItem('virtualFileSystem');
      return savedFs ? JSON.parse(savedFs) : initialFileSystem;
    } catch (error) {
      console.error("Could not parse file system from local storage", error);
      return initialFileSystem;
    }
  });

  useEffect(() => {
    window.localStorage.setItem('virtualFileSystem', JSON.stringify(fs));
  }, [fs]); 

  const createItem = (path, name, type = 'folder') => {
    setFs(produce(draftFs => {
      const parentNode = getParentNode(draftFs, path);
      if (parentNode && parentNode.children && !parentNode.children[name]) {
        parentNode.children[name] = type === 'folder'
          ? { type: 'folder', children: {} }
          : { type: 'file', content: '' };
      } else {
        alert('An item with that name already exists in this directory.');
      }
    }));
  };

  const deleteItem = (path, name) => {
      setFs(produce(draftFs => {
          const parentNode = getParentNode(draftFs, path);
          if (parentNode && parentNode.children && parentNode.children[name]) {
              delete parentNode.children[name];
          }
      }));
  };

  const renameItem = (path, oldName, newName) => {
      setFs(produce(draftFs => {
          const parentNode = getParentNode(draftFs, path);
          if (parentNode && parentNode.children && parentNode.children[oldName] && !parentNode.children[newName]) {
              parentNode.children[newName] = parentNode.children[oldName];
              delete parentNode.children[oldName];
          } else {
              alert('An item with that name already exists or the original item was not found.');
          }
      }));
  };

  const updateFileContent = (path, content) => {
    setFs(produce(draftFs => {
      if(!path || path.length <= 1){
        alert('Enter a valid path');
        return;
      }
      const parentPath = path.slice(0, -1);
      const fileName = path[path.length - 1];
      const parentNode = getParentNode(draftFs, parentPath);

      if (parentNode && parentNode.children) {
         if(parentNode.children[fileName] && parentNode.children[fileName].type === 'file') {
            parentNode.children[fileName].content = content;
         } else if (!parentNode.children[fileName]) {
            parentNode.children[fileName] = {
              type : 'file',
              content: content,
            }
         } else {
            alert('A non-file item with this name already exists.');
         }
      }
    }));
  };

  const value = { fs, setFs, createItem, deleteItem, renameItem , updateFileContent};

  return (
    <FileSystemContext.Provider value={value}>
      {children}
    </FileSystemContext.Provider>
  );
};

export const useFileSystem = () => {
  return useContext(FileSystemContext);
};