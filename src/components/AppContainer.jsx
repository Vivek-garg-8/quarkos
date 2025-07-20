import React from 'react';

const AppContainer = ({ title, children, onClose }) => {
    return (
        <div className="absolute inset-0 bg-slate-800/50 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-zinc-800 rounded-xl shadow-2xl flex flex-col border border-zinc-600">
                {/* Title Bar */}
                <div className="bg-zinc-900 h-8 flex-shrink-0 rounded-t-xl flex items-center justify-between px-3">
                    <span className="text-white text-sm font-bold">{title}</span>
                    <button onClick={onClose} className="w-5 h-5 bg-red-500 rounded-full hover:bg-red-600 flex items-center justify-center text-white text-xs font-bold">
                        X
                    </button>
                </div>
                {/* App Content */}
                <div className="flex-grow h-full">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AppContainer;
