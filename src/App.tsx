import React, { useState } from 'react'
import TimelineSlider from './components/TimelineSlider'
import MapView from './components/MapView'

function App() {
  const [range, setRange] = useState<[number, number]>([-120, 80])
  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>Weather Dashboard</h1>
      <TimelineSlider range={range} setRange={setRange} />

      <MapView />
    </div>
  )
}

export default App
