import backgroundImage from './assets/background1.png';
import Navbar from './components/Navbar'
import Footer from './components/Footer';
import Home from './components/Home';

import React, { useState } from 'react';
import AppContainer from './components/AppContainer';

import Calculator from './components/apps/Calculator';
import Notepad from './components/apps/Notepad';
import TicTacToe from './components/apps/TicTacToe';
import PlaceholderApp from './components/apps/PlaceholderApp';
import FileExplorer from './components/apps/FileExplorer';

const App = () => {
  const [activeApp, setActiveApp] = useState();
  const [nextZIndex, setNextZIndex] = useState(1);


  const openApp = (appId) => {
    setActiveApp(appId);
  };

  const closeApp = () => {
    setActiveApp(null);
  };

  const renderActiveApp = () => {
    if (!activeApp) {
      return null; 
    }

    let AppComponent;
    let appTitle = "Application";
    
    console.log(activeApp)
    switch (activeApp) {
      case 'Notepad':
        AppComponent = Notepad;
        appTitle = 'Notepad';
        break;
      case 'Calculator':
        AppComponent = Calculator;
        appTitle = 'Calculator';
        break;
      case 'Tic Tac Toe':
        AppComponent = TicTacToe;
        appTitle = 'Tic Tac Toe';
        break;
      case 'File Manager':
        AppComponent = () => <FileExplorer />;
        appTitle = 'File Explorer';
        break;
      case 'Recycle Bin':
        AppComponent = () => <PlaceholderApp appName="Recycle Bin" />;
        appTitle = 'Recycle Bin';
        break;
      default:
        return null;
    }

    return (
      <AppContainer title={appTitle} onClose={closeApp}>
        <AppComponent />
      </AppContainer>
    );
  };

  return (
    <main className="h-screen bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url(${backgroundImage})` }}>
      <Navbar />
      <Home openApp={openApp} />
      {renderActiveApp()}
      <Footer openApp={openApp} />
    </main>
  );
};

export default App;
