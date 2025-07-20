import React, { useState, useEffect, useRef } from 'react';

const MenuBar = ({ items }) => {
    const [openMenu, setOpenMenu] = useState(null);
    const menuRef = useRef(null);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpenMenu(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [menuRef]);

    const handleMenuClick = (label) => {
        setOpenMenu(openMenu === label ? null : label);
    };

    return (
        <nav ref={menuRef} className="bg-zinc-700 text-white text-sm flex items-center px-2 h-8 flex-shrink-0 border-b border-zinc-600">
            {items.map(menu => (
                <div key={menu.label} className="relative">
                    <button 
                        onClick={() => handleMenuClick(menu.label)} 
                        className="px-3 py-1 hover:bg-zinc-600 rounded-md"
                    >
                        {menu.label}
                    </button>
                    {openMenu === menu.label && (
                        <ul className="absolute top-full left-0 mt-1 w-48 bg-zinc-800 rounded-md shadow-lg py-1 z-50">
                            {menu.actions.map(action => (
                                <li 
                                    key={action.label} 
                                    onClick={() => { if (!action.disabled) { action.onClick(); setOpenMenu(null); } }} 
                                    className={`px-3 py-1 ${action.disabled ? 'text-gray-500 cursor-not-allowed' : 'hover:bg-zinc-700 cursor-pointer'}`}
                                >
                                    {action.label}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            ))}
        </nav>
    );
};

export default MenuBar;
