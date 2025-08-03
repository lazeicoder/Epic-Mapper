import React from 'react';
import TimelineSlider from './components/TimelineSlider';
import MapView from './components/MapView';

function App() {
  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>Weather Dashboard</h1>
      <TimelineSlider />
      <MapView/>
    </div>
  );
}

export default App;
