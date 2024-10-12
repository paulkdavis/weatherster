import './App.css';

import { useEffect, useState } from 'react';
import WeatherOverview from './components/WeatherOverview';
import { Weather } from './constants/Weather';

function App() {
  return (
    <div className="">
      <header className="App-header">
        <img src={''} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <WeatherOverview
        weather={Weather.sunny}
      />
    </div>
  );
}

export default App;
