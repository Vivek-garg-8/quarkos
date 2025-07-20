import React, { useState, useRef, useEffect } from 'react';

const AppContainer = ({ title, children, onClose }) => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [size, setSize] = useState({ width: 640, height: 480 });
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);

    const windowRef = useRef(null);
    const dragOffsetRef = useRef({ x: 0, y: 0 });
    const resizeRef = useRef(null);

    useEffect(() => {
        if (windowRef.current) {
            const { innerWidth, innerHeight } = window;
            setPosition({
                x: (innerWidth - size.width) / 2,
                y: (innerHeight - size.height) / 2,
            });
        }
    }, []);

    const onDragMouseDown = (e) => {
        if (e.button !== 0) return;
        e.preventDefault();
        setIsDragging(true);
        if (windowRef.current) {
            const rect = windowRef.current.getBoundingClientRect();
            dragOffsetRef.current = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            };
        }
    };

    const onResizeMouseDown = (e, direction) => {
        e.preventDefault();
        e.stopPropagation();
        setIsResizing(true);
        if (windowRef.current) {
            const rect = windowRef.current.getBoundingClientRect();
            resizeRef.current = {
                direction,
                initialX: e.clientX,
                initialY: e.clientY,
                initialWidth: rect.width,
                initialHeight: rect.height,
                initialLeft: rect.left,
                initialTop: rect.top,
            };
        }
    };

    const onMouseMove = (e) => {
        if (isDragging) {
            setPosition({
                x: e.clientX - dragOffsetRef.current.x,
                y: e.clientY - dragOffsetRef.current.y,
            });
        } else if (isResizing && resizeRef.current) {
            const { direction, initialX, initialY, initialWidth, initialHeight, initialLeft, initialTop } = resizeRef.current;
            const dx = e.clientX - initialX;
            const dy = e.clientY - initialY;

            let newWidth = initialWidth;
            let newHeight = initialHeight;
            let newLeft = initialLeft;
            let newTop = initialTop;

            if (direction.includes('right')) newWidth = initialWidth + dx;
            if (direction.includes('bottom')) newHeight = initialHeight + dy;
            if (direction.includes('left')) {
                newWidth = initialWidth - dx;
                newLeft = initialLeft + dx;
            }
            if (direction.includes('top')) {
                newHeight = initialHeight - dy;
                newTop = initialTop + dy;
            }

            const minWidth = 300;
            const minHeight = 200;

            if (newWidth >= minWidth) {
                setSize(s => ({ ...s, width: newWidth }));
                if (direction.includes('left')) {
                    setPosition(p => ({ ...p, x: newLeft }));
                }
            }
            if (newHeight >= minHeight) {
                setSize(s => ({ ...s, height: newHeight }));
                if (direction.includes('top')) {
                    setPosition(p => ({ ...p, y: newTop }));
                }
            }
        }
    };

    const onMouseUp = () => {
        setIsDragging(false);
        setIsResizing(false);
        resizeRef.current = null;
    };

    useEffect(() => {
        if (isDragging || isResizing) {
            window.addEventListener('mousemove', onMouseMove);
            window.addEventListener('mouseup', onMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        };
    }, [isDragging, isResizing]);

    const resizeHandles = [
        { direction: 'top', cursor: 'ns-resize', className: 'absolute top-0 left-1/2 -translate-x-1/2 w-full h-2 z-10' },
        { direction: 'bottom', cursor: 'ns-resize', className: 'absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-2 z-10' },
        { direction: 'left', cursor: 'ew-resize', className: 'absolute left-0 top-1/2 -translate-y-1/2 h-full w-2 z-10' },
        { direction: 'right', cursor: 'ew-resize', className: 'absolute right-0 top-1/2 -translate-y-1/2 h-full w-2 z-10' },
        { direction: 'top-left', cursor: 'nwse-resize', className: 'absolute top-0 left-0 w-4 h-4 z-10' },
        { direction: 'top-right', cursor: 'nesw-resize', className: 'absolute top-0 right-0 w-4 h-4 z-10' },
        { direction: 'bottom-left', cursor: 'nesw-resize', className: 'absolute bottom-0 left-0 w-4 h-4 z-10' },
        { direction: 'bottom-right', cursor: 'nwse-resize', className: 'absolute bottom-0 right-0 w-4 h-4 z-10' },
    ];

    return (
        <div
            ref={windowRef}
            className="bg-zinc-800 rounded-xl shadow-2xl flex flex-col border border-zinc-600"
            style={{
                position: 'absolute',
                left: `${position.x}px`,
                top: `${position.y}px`,
                width: `${size.width}px`,
                height: `${size.height}px`,
            }}
        >
            <div
                onMouseDown={onDragMouseDown}
                className="bg-zinc-900 h-8 flex-shrink-0 rounded-t-xl flex items-center justify-between px-3 cursor-move"
            >
                <span className="text-white text-sm font-bold select-none">{title}</span>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onClose();
                    }}
                    className="w-5 h-5 bg-red-500 rounded-full hover:bg-red-600 flex items-center justify-center text-white text-xs font-bold cursor-pointer"
                >
                    X
                </button>
            </div>
            <div className="flex-grow relative overflow-auto flex">
                <div className="w-full h-full">
                    {children}
                </div>
            </div>
            {resizeHandles.map(({ direction, cursor, className }) => (
                <div
                    key={direction}
                    onMouseDown={(e) => onResizeMouseDown(e, direction)}
                    className={className}
                    style={{ cursor: cursor }}
                />
            ))}
        </div>
    );
};

export default AppContainer;
