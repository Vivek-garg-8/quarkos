import React, { useState, useRef, useEffect } from 'react';
import { FiMinus, FiX, FiMaximize2 } from 'react-icons/fi';

const WindowManager = ({ 
  id,
  title, 
  children, 
  onClose, 
  onMinimize,
  isMinimized = false,
  initialPosition = { x: 100, y: 100 },
  initialSize = { width: 800, height: 600 },
  zIndex = 1
}) => {
  const [position, setPosition] = useState(initialPosition);
  const [size, setSize] = useState(initialSize);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isMaximized, setIsMaximized] = useState(false);
  const [previousState, setPreviousState] = useState(null);

  const windowRef = useRef(null);
  const resizeRef = useRef(null);

  // Handle window dragging
  const handleMouseDown = (e) => {
    if (e.target.closest('.window-controls')) return;
    
    setIsDragging(true);
    const rect = windowRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight - 80 // Account for dock
    };

    let newX = e.clientX - dragOffset.x;
    let newY = e.clientY - dragOffset.y;

    // Boundary constraints
    newX = Math.max(0, Math.min(newX, viewport.width - size.width));
    newY = Math.max(0, Math.min(newY, viewport.height - size.height));

    setPosition({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  // Handle window maximize/restore
  const handleMaximize = () => {
    if (isMaximized) {
      // Restore
      setPosition(previousState.position);
      setSize(previousState.size);
      setIsMaximized(false);
    } else {
      // Maximize
      setPreviousState({ position, size });
      setPosition({ x: 0, y: 0 });
      setSize({ 
        width: window.innerWidth, 
        height: window.innerHeight - 80 
      });
      setIsMaximized(true);
    }
  };

  // Handle minimize animation
  const handleMinimizeClick = () => {
    const windowEl = windowRef.current;
    if (windowEl) {
      windowEl.style.transform = 'scale(0.1)';
      windowEl.style.opacity = '0';
      setTimeout(() => {
        onMinimize(id);
      }, 250);
    }
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, size]);

  // Restore animation when unminimized
  useEffect(() => {
    if (!isMinimized && windowRef.current) {
      const windowEl = windowRef.current;
      windowEl.style.transform = 'scale(1)';
      windowEl.style.opacity = '1';
    }
  }, [isMinimized]);

  if (isMinimized) return null;

  return (
    <div
      ref={windowRef}
      className={`absolute bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden transition-all duration-300 ease-in-out ${
        isDragging ? 'cursor-grabbing' : ''
      }`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
        zIndex: zIndex,
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)'
      }}
    >
      {/* Window Header */}
      <div
        className="bg-gray-50 border-b border-gray-200 h-12 flex items-center justify-between px-4 cursor-grab active:cursor-grabbing select-none"
        onMouseDown={handleMouseDown}
        onDoubleClick={handleMaximize}
      >
        <div className="flex items-center space-x-3">
          <div className="flex space-x-2">
            <button
              onClick={() => onClose(id)}
              className="w-3 h-3 bg-red-500 rounded-full hover:bg-red-600 transition-colors duration-150"
              aria-label="Close"
            />
            <button
              onClick={handleMinimizeClick}
              className="w-3 h-3 bg-yellow-500 rounded-full hover:bg-yellow-600 transition-colors duration-150"
              aria-label="Minimize"
            />
            <button
              onClick={handleMaximize}
              className="w-3 h-3 bg-green-500 rounded-full hover:bg-green-600 transition-colors duration-150"
              aria-label="Maximize"
            />
          </div>
          <span className="text-sm font-medium text-gray-700">{title}</span>
        </div>
        
        <div className="window-controls flex items-center space-x-1">
          <button
            onClick={handleMinimizeClick}
            className="p-1 hover:bg-gray-200 rounded transition-colors duration-150"
            aria-label="Minimize"
          >
            <FiMinus size={14} className="text-gray-600" />
          </button>
          <button
            onClick={handleMaximize}
            className="p-1 hover:bg-gray-200 rounded transition-colors duration-150"
            aria-label="Maximize"
          >
            <FiMaximize2 size={14} className="text-gray-600" />
          </button>
          <button
            onClick={() => onClose(id)}
            className="p-1 hover:bg-red-100 rounded transition-colors duration-150"
            aria-label="Close"
          >
            <FiX size={14} className="text-red-600" />
          </button>
        </div>
      </div>

      {/* Window Content */}
      <div className="flex-1 overflow-hidden">
        {children}
      </div>

      {/* Resize Handle */}
      <div
        className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
        onMouseDown={(e) => {
          e.preventDefault();
          setIsResizing(true);
          resizeRef.current = {
            startX: e.clientX,
            startY: e.clientY,
            startWidth: size.width,
            startHeight: size.height
          };
        }}
      >
        <div className="w-full h-full bg-gray-300 opacity-50 rounded-tl-lg" />
      </div>
    </div>
  );
};

export default WindowManager;