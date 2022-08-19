import React from 'react';

import './styles/global.css';
import 'leaflet/dist/leaflet.css';

import Routes from './routes';

function App() {
  return (
    <div className="qtruck">
      <Routes />
    </div>
  );
}

export default App;
