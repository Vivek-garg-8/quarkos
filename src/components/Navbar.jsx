import React, { useState, useEffect } from 'react';

const Navbar = () => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []); 

  const timeOptions = { hour: 'numeric', minute: 'numeric', hour12: true };
  const dateOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };

  return (
    <nav className='flex bg-black/40 text-white justify-between items-center p-2 px-4 backdrop-blur-lg rounded-b-lg'>
      <div className="icons">
        <ul className='flex gap-2 items-center'>
          <li className='cursor-pointer transition-transform duration-200 hover:scale-110'>
            <img width={30} src="src/assets/wifi.png" alt="Wi-Fi" />
          </li>
          <li className='cursor-pointer transition-transform duration-200 hover:scale-110'>
            <img width={30} src="src/assets/bluetooth.png" alt="Bluetooth" />
          </li>
          <li className='cursor-pointer transition-transform duration-200 hover:scale-110'>
            <img width={30} src="src/assets/battery.png" alt="Battery" />
          </li>
          <li className='cursor-pointer transition-transform duration-200 hover:scale-110'>
            <img width={30} src="src/assets/volume-on.png" alt="Volume" />
          </li>
        </ul>
      </div>
      <div className="time font-sans">
        <span>{currentDateTime.toLocaleTimeString('en-US', timeOptions)} - </span>
        <span>{currentDateTime.toLocaleDateString('en-GB', dateOptions)}</span>
      </div>
    </nav>
  );
};

export default Navbar;
