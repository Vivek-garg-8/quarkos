import React, { useRef } from 'react';
import Draggable from 'react-draggable';
import { ResizableBox } from 'react-resizable';

const Window = ({ children, title, zIndex, onClose, onFocus, width, height, onResizeStop }) => {
    const nodeRef = useRef(null);

    return (
        <Draggable 
            handle=".title-bar" 
            onStart={onFocus} 
            nodeRef={nodeRef}
            bounds="parent"
        >
            <div ref={nodeRef} className="absolute top-20 left-40" style={{ zIndex }}>
                 <ResizableBox
                    width={width}
                    height={height}
                    onResizeStop={onResizeStop}
                    minConstraints={[350, 250]}
                    maxConstraints={[1200, 800]}
                    className="shadow-2xl bg-zinc-800 border border-zinc-600 flex flex-col rounded-xl overflow-hidden"
                >
                    <div className="title-bar bg-zinc-900 h-8 flex-shrink-0 rounded-t-xl flex items-center justify-between px-2 cursor-move">
                        <span className="text-white text-sm font-bold select-none">{title}</span>
                        <div className="flex gap-2">
                            <button className="w-4 h-4 bg-yellow-500 rounded-full hover:bg-yellow-600" disabled>_</button>
                            <button className="w-4 h-4 bg-green-500 rounded-full hover:bg-green-600" disabled>O</button>
                            <button onClick={onClose} className="w-4 h-4 bg-red-500 rounded-full hover:bg-red-600"></button>
                        </div>
                    </div>
                    <div className="flex-grow h-full">
                        {children}
                    </div>
                </ResizableBox>
            </div>
        </Draggable>
    );
};

export default Window;
