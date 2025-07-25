import React, { useState } from 'react';

const Calculator = () => {
  const [display, setDisplay] = useState('0');

  const handleButtonClick = (value) => {
    const operators = ['+', '-', '*', '/'];

    if (value === 'C') {
      setDisplay('0');
    } else if (value === '=') {
      try {
        // Using new Function is a security risk in real apps, but fine for this context.
        const result = new Function('return ' + display)();
        setDisplay(result.toString());
      } catch (error) {
        setDisplay('Error');
      }
    } else if (operators.includes(value)) {
        const lastChar = display.slice(-1);
        if (operators.includes(lastChar)) {
            setDisplay(display.slice(0, -1) + value);
        } else {
            setDisplay(display + value);
        }
    } else {
      if (display === '0' || display === 'Error') {
        setDisplay(value);
      } else {
        setDisplay(display + value);
      }
    }
  };

  const Button = ({ value, className }) => (
    <button
      onClick={() => handleButtonClick(value)}
      className={`
        w-full aspect-square rounded-full text-white text-2xl font-light 
        flex items-center justify-center 
        bg-zinc-700 border-2 border-zinc-400 
        hover:bg-zinc-600 active:bg-zinc-500
        transition-colors duration-200
        ${className || ''}
      `}
    >
      {value}
    </button>
  );

  return (
    <div className="w-full h-full bg-zinc-800 p-4 rounded-b-xl shadow-lg flex flex-col">
      <div className="flex-shrink-0 bg-zinc-700/80 text-white text-right p-4 mb-4 rounded-lg text-4xl font-light overflow-x-auto">
        {display}
      </div>
      {/* This new wrapper centers the button grid and constrains its size */}
      <div className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-xs grid grid-cols-4 gap-2">
            <Button value="1" />
            <Button value="2" />
            <Button value="3" />
            <Button value="+" className="!bg-orange-500 hover:!bg-orange-600 active:!bg-orange-700" />
            
            <Button value="4" />
            <Button value="5" />
            <Button value="6" />
            <Button value="-" className="!bg-orange-500 hover:!bg-orange-600 active:!bg-orange-700" />
            
            <Button value="7" />
            <Button value="8" />
            <Button value="9" />
            <Button value="*" className="!bg-orange-500 hover:!bg-orange-600 active:!bg-orange-700" />
            
            <Button value="0" />
            <Button value="C" />
            <Button value="=" />
            <Button value="/" className="!bg-orange-500 hover:!bg-orange-600 active:!bg-orange-700" />
        </div>
      </div>
    </div>
  );
};

export default Calculator;
