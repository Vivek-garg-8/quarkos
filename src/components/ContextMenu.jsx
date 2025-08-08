import React, { useEffect, useRef } from 'react';

const ContextMenu = ({ x, y, items = [], onClose }) => {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      className="absolute bg-white/95 backdrop-blur-xl text-gray-800 rounded-lg shadow-xl py-2 w-48 z-50 border border-gray-200"
      style={{ top: y, left: x }}
    >
      <ul>
        {items.map((item, index) => (
          <li
            key={index}
            onClick={() => {
              item.onClick();
              onClose();      
            }}
            className="px-4 py-2 hover:bg-blue-500 hover:text-white cursor-pointer text-sm transition-colors duration-150"
          >
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContextMenu;
