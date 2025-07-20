// import React, { createContext, useContext, useState } from 'react';

// // The initial structure of our file system, now with app shortcuts on the desktop
// const initialFileSystem = {
//   'C:': {
//     type: 'drive',
//     children: {
//       'Users': {
//         type: 'folder',
//         children: {
//             'Public': {
//                 type: 'folder',
//                 children: {
//                     'Desktop': {
//                         type: 'folder',
//                         children: {
//                             'File Manager': { type: 'filemanager' },
//                             'Recycle Bin': { type: 'recyclebin' },
//                             'Notepad': { type: 'notepad' },
//                             'Tic Tac Toe': { type: 'tictactoe' },
//                             'Calculator': { type: 'calculator' },
//                         }
//                     },
//                     'Documents': {
//                         type: 'folder',
//                         children: {
//                             'Welcome.txt': {
//                                 type: 'file',
//                                 content: 'Welcome to your virtual OS!\n\nThis is a simple text file stored in your virtual file system.'
//                             }
//                         }
//                     }
//                 }
//             }
//         }
//       },
//       'Windows': {
//         type: 'folder',
//         children: {},
//       },
//     },
//   },
// };

// const FileSystemContext = createContext();

// export const FileSystemProvider = ({ children }) => {
//   const [fs, setFs] = useState(initialFileSystem);

//   // You can add functions to manipulate the file system here
//   // e.g., createFile, createFolder, deleteItem, etc.

//   const value = { fs, setFs };

//   return (
//     <FileSystemContext.Provider value={value}>
//       {children}
//     </FileSystemContext.Provider>
//   );
// };

// // A custom hook to easily access the file system context
// export const useFileSystem = () => {
//   return useContext(FileSystemContext);
// };
import React, { createContext, useContext, useState } from 'react';
import { produce } from 'immer'; 

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
  const [fs, setFs] = useState(initialFileSystem);

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
      const parentPath = path.slice(0, -1);
      const fileName = path[path.length - 1];
      const parentNode = getParentNode(draftFs, parentPath);

      if (parentNode && parentNode.children && parentNode.children[fileName]) {
        parentNode.children[fileName].content = content;
      } else {
        console.error("File not found for saving:", path);
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
