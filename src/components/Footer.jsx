import React, { useState } from 'react';

const FileManagerIcon = () => (
    <img src="src/assets/file_manager.png" alt="File Manager" className="w-full h-full object-contain" />
);

const NotepadIcon = () => (
    <img src="src/assets/notepad.png" alt="Notepad" className="w-full h-full object-contain" />
);

const TicTacToeIcon = () => (
    <img src="src/assets/tic-tac-toe-icon.svg" alt="Notepad" className="w-full h-full object-contain" />
);

const SearchIcon = () => (
    <img src="src/assets/search-icon.png" alt="Tic Tac Toe" className="w-full h-full object-contain" />
);

const CalculatorIcon = () => (
    <img src="src/assets/calculator-icon.png" alt="Calculator" className="w-full h-full object-contain" />
);

const Footer = ({ openApp }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const menuApps = [
        { id: 'File Manager', name: 'File Explorer', icon: <FileManagerIcon /> },
        { id: 'Calculator', name: 'Calculator', icon: <CalculatorIcon /> },
        { id: 'Notepad', name: 'Notepad', icon: <NotepadIcon /> },
        { id: 'Tic Tac Toe', name: 'Tic Tac Toe', icon: <TicTacToeIcon /> },
    ];

    const handleAppClick = (appId) => {
        if (openApp) {
            openApp(appId);
        }
        setIsMenuOpen(false);
        setSearchTerm('');
    };

    const filteredApps = menuApps.filter(app =>
        app.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <footer className='flex bg-black/40 text-white justify-center items-center p-2 px-4 backdrop-blur-lg rounded-t-lg absolute bottom-0 w-full'>
            
            {isMenuOpen && (
                <div className="absolute bottom-full mb-2 w-72 bg-zinc-800/90 backdrop-blur-xl rounded-lg shadow-lg p-4">
                    <ul className="space-y-2">
                        {filteredApps.map(app => (
                            <li 
                                key={app.id} 
                                onClick={() => handleAppClick(app.id)}
                                className="flex items-center gap-4 p-2 rounded-md hover:bg-zinc-700 cursor-pointer"
                            >
                                <span className='w-10 mix-blend-darken'>{app.icon}</span>
                                <span className="text-lg">{app.name}</span>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-4 pt-4 border-t border-zinc-700">
                        <div className="relative">
                            <div className="w-8 absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <SearchIcon />
                            </div>
                            <input 
                                type="text" 
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-zinc-700 rounded-full py-2 pl-10 pr-4 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                        </div>
                    </div>
                </div>
            )}

            <div 
                className="start cursor-pointer transition-transform duration-200 hover:scale-110"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
                <img width={40} src="src/assets/start_button.png" alt="Start" />
            </div>
        </footer>   
    );
};

export default Footer;
