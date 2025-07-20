import React, { useState } from "react";
import { useFileSystem } from "../../contexts/FileSystemContext";
import MenuBar from "../MenuBar";

// Helper function from your code
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

// Icon components from your code...
const FolderIcon = ({ isOpen }) => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" > {isOpen ? ( <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" /> ) : ( <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /> )} </svg> );
const FileIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" > <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /> </svg> );
const DriveIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" > <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /> </svg> );

const TreeView = ({ data, onSelect, path = [] }) => {
    const [expanded, setExpanded] = useState({});
    const toggleExpand = (name) => setExpanded(prev => ({ ...prev, [name]: !prev[name] }));

    return ( <ul className="text-white text-sm"> {Object.entries(data).map(([name, item]) => { const isFolder = item.type === "folder" || item.type === "drive"; const currentItemPath = [...path, name]; return ( <li key={name} className="my-1"> <div className="flex items-center gap-2 p-1 rounded-md hover:bg-zinc-700 cursor-pointer" onClick={() => { if (isFolder) toggleExpand(name); onSelect(item, currentItemPath, name); }} > {isFolder && <span className="w-4">{expanded[name] ? "▼" : "►"}</span>} <div className="w-5 h-5">{item.type === "drive" ? <DriveIcon /> : isFolder ? <FolderIcon isOpen={expanded[name]} /> : <FileIcon />}</div> <span>{name}</span> </div> {isFolder && expanded[name] && ( <div className="pl-6 border-l border-zinc-600"> <TreeView data={item.children} onSelect={onSelect} path={currentItemPath} /> </div> )} </li> ); })} </ul> );
};


// Main component receives `openApp` as a prop
const FileExplorer = ({ openApp }) => {
  const { fs, createItem, deleteItem, renameItem } = useFileSystem();
  const [currentPath, setCurrentPath] = useState(["C:"]);
  const [selectedInView, setSelectedInView] = useState(null);

  const currentDirectory = getObjectFromPath(fs, currentPath);

  // Menu bar actions from your code...
  const handleNewFolder = () => { const folderName = prompt("Enter folder name:", "New Folder"); if (folderName) createItem(currentPath, folderName, "folder"); };
  const handleNewFile = () => { const fileName = prompt("Enter file name:", "New File.txt"); if (fileName) createItem(currentPath, fileName, "file"); };
  const handleDelete = () => { if (!selectedInView) return alert("No item selected."); if (window.confirm(`Are you sure you want to delete "${selectedInView}"?`)) { deleteItem(currentPath, selectedInView); setSelectedInView(null); } };
  const handleRename = () => { if (!selectedInView) return alert("No item selected."); const newName = prompt(`Enter new name for "${selectedInView}":`, selectedInView); if (newName && newName !== selectedInView) { renameItem(currentPath, selectedInView, newName); setSelectedInView(newName); } };

  const menuBarItems = [ { label: "File", actions: [{ label: "New Folder", onClick: handleNewFolder }, { label: "New File", onClick: handleNewFile }] }, { label: "Edit", actions: [{ label: "Rename", onClick: handleRename, disabled: !selectedInView }, { label: "Delete", onClick: handleDelete, disabled: !selectedInView }] } ];

  // This function now handles opening files
  const handleNavigate = (itemName) => {
    const item = currentDirectory?.children?.[itemName];
    if (item) {
      if (item.type === "folder" || item.type === "drive") {
        setCurrentPath([...currentPath, itemName]);
        setSelectedInView(null);
      } else if (item.type === 'file') {
        // If it's a file, call openApp with Notepad and the file's path
        if(openApp) {
          openApp('Notepad', { filePath: [...currentPath, itemName] });
        }
      }
    }
  };

  const handleTreeSelect = (item, path, name) => {
    if (item.type === "folder" || item.type === "drive") {
      setCurrentPath(path);
      setSelectedInView(null);
    } else {
      setCurrentPath(path.slice(0, -1));
      setSelectedInView(name);
    }
  };

  const handleGoBack = () => {
    if (currentPath.length > 1) {
      setCurrentPath(currentPath.slice(0, -1));
      setSelectedInView(null);
    }
  };

  return (
    <div className="w-full h-full bg-zinc-900 rounded-b-xl flex flex-col text-white">
      <MenuBar items={menuBarItems} />
      <div className="flex flex-grow overflow-hidden">
        <div className="w-1/3 bg-zinc-800 p-2 border-r border-zinc-700 overflow-y-auto">
          <h3 className="font-bold p-2">File System</h3>
          <TreeView data={fs} onSelect={handleTreeSelect} path={[]} />
        </div>
        <div className="w-2/3 flex flex-col">
          <div className="flex-shrink-0 h-12 bg-zinc-700 p-2 flex items-center gap-2 border-b border-zinc-600">
            <button
              onClick={handleGoBack}
              disabled={currentPath.length <= 1}
              className="px-3 py-1 bg-zinc-600 rounded-md text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-500"
            >
              &larr;
            </button>
            <div className="bg-zinc-900 text-gray-300 px-3 py-1 rounded-md text-sm flex-grow truncate">
              {currentPath.join(" > ")}
            </div>
          </div>
          <div className="flex-grow p-2 overflow-auto" onClick={() => setSelectedInView(null)}>
            {currentDirectory &&
              Object.entries(currentDirectory.children).map(([name, item]) => (
                <div
                  key={name}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedInView(name);
                  }}
                  onDoubleClick={() => handleNavigate(name)}
                  className={`p-2 text-white flex items-center gap-3 cursor-pointer rounded-md ${
                    selectedInView === name ? 'bg-blue-600' : 'hover:bg-zinc-700'
                  }`}
                >
                  {item.type.includes("folder") || item.type === "drive" ? (
                    <FolderIcon isOpen={false} />
                  ) : (
                    <FileIcon />
                  )}
                  <span>{name}</span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileExplorer;