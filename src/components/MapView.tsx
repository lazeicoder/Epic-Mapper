import { MapContainer, TileLayer, useMapEvents, Polygon, Popup } from 'react-leaflet'
import { useEffect, useState } from 'react'
// @ts-ignore
import inside from 'point-in-polygon'
import 'leaflet/dist/leaflet.css'

function ClickHandler({ onClickPoint }: { onClickPoint: (latlng: [number, number]) => void }) {
  useMapEvents({
    click(e) {
      onClickPoint([e.latlng.lat, e.latlng.lng])
    },
  })
  return null
}

function MouseTracker({ onMove }: { onMove: (latlng: [number, number]) => void }) {
  useMapEvents({
    mousemove(e) {
      onMove([e.latlng.lat, e.latlng.lng])
    },
  })
  return null
}

function MapView() {
  const center: [number, number] = [28.6139, 77.209]
  const [points, setPoints] = useState<[number, number][]>([])
  const [mousePos, setMousePos] = useState<[number, number] | null>(null)
  const [weather, setWeather] = useState<any>(null)

  useEffect(() => {
    if (points.length >= 3) {
      const lat = points.reduce((a, b) => a + b[0], 0) / points.length
      const lon = points.reduce((a, b) => a + b[1], 0) / points.length
      fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`)
        .then((res) => res.json())
        .then((data) => setWeather(data.current_weather))
    }
  }, [points])

  const isInside = mousePos && points.length >= 3 && inside([mousePos[1], mousePos[0]], points.map(p => [p[1], p[0]]))

  return (
    <div style={{ padding: '20px' }}>
      <button
        onClick={() => {
          setPoints([])
          setWeather(null)
        }}
        style={{
          marginBottom: '10px',
          backgroundColor: '#ef4444',
          color: 'white',
          padding: '8px 16px',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Reset Polygon
      </button>

      <MapContainer
        center={center}
        zoom={15}
        style={{ height: '500px', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://osm.org">OpenStreetMap</a> contributors'
        />
        <ClickHandler onClickPoint={(latlng) => setPoints([...points, latlng])} />
        <MouseTracker onMove={(latlng) => setMousePos(latlng)} />
        {points.length >= 3 && <Polygon positions={points} pathOptions={{ color: 'red' }} />}
        {isInside && mousePos && weather && (
          <Popup position={mousePos}>
            <div>
              <p>Temperature: {weather.temperature}°C</p>
              <p>Wind Speed: {weather.windspeed} km/h</p>
              <p>Time: {weather.time}</p>
            </div>
          </Popup>
        )}
      </MapContainer>
    </div>
  )
}

export default MapView
