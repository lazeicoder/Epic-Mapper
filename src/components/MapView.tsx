import { MapContainer, TileLayer, useMapEvents, Polygon } from 'react-leaflet'
import { useEffect, useState } from 'react'
import axios from 'axios'

function getCentroid(points: [number, number][]): [number, number] {
  const total = points.length
  const latSum = points.reduce((sum, p) => sum + p[0], 0)
  const lngSum = points.reduce((sum, p) => sum + p[1], 0)
  return [latSum / total, lngSum / total]
}

async function fetchWeather(lat: number, lon: number, time: string) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,wind_speed_10m&timezone=auto`
  const res = await axios.get(url)
  const data = res.data
  const hourData = data.hourly
  const index = hourData.time.findIndex((t: string) => t.includes(time))
  if (index !== -1) {
    return {
      temperature: hourData.temperature_2m[index],
      windSpeed: hourData.wind_speed_10m[index],
      time: hourData.time[index],
    }
  }
  return null
}

function MapView() {
  const [points, setPoints] = useState<[number, number][]>([])
  const [time, setTime] = useState(0)
  const [weatherData, setWeatherData] = useState<any>(null)
  const center: [number, number] = [28.6139, 77.2090]

  function MapClickHandler() {
    useMapEvents({
      click(e) {
        const latlng: [number, number] = [e.latlng.lat, e.latlng.lng]
        setPoints([...points, latlng])
      },
    })
    return null
  }

  useEffect(() => {
    if (points.length >= 3) {
      const [lat, lon] = getCentroid(points)
      const hour = String(Math.floor(time / 60)).padStart(2, '0')
      const date = new Date().toISOString().split('T')[0]
      const formatted = `${date}T${hour}:00`
      fetchWeather(lat, lon, formatted).then((data) => {
        setWeatherData(data)
      })
    }
  }, [points, time])

  return (
    <div style={{ padding: '20px' }}>
      <MapContainer
        center={center}
        zoom={15}
        style={{ height: '500px', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapClickHandler />
        {points.length > 2 && <Polygon positions={points} />}
      </MapContainer>

      <input
        type="range"
        min={0}
        max={1440}
        step={60}
        value={time}
        onChange={(e) => setTime(parseInt(e.target.value))}
        style={{ width: '100%', marginTop: '20px' }}
      />

      <div style={{ marginTop: '10px' }}>
        Selected Hour: {Math.floor(time / 60)}:00
      </div>

      {weatherData && (
        <div style={{ marginTop: '20px' }}>
          <div>Time: {weatherData.time}</div>
          <div>Temperature: {weatherData.temperature} °C</div>
          <div>Wind Speed: {weatherData.windSpeed} km/h</div>
        </div>
      )}
    </div>
  )
}

export default MapView
