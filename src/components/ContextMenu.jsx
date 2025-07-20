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
      className="absolute bg-zinc-800/90 backdrop-blur-xl text-white rounded-md shadow-lg py-2 w-48 z-50"
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
            className="px-4 py-2 hover:bg-zinc-700 cursor-pointer text-sm"
          >
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContextMenu;
