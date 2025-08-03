import React, { useState } from 'react';
import { MapContainer, TileLayer, useMapEvents, Polygon } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function ClickHandler({ onClickPoint }: { onClickPoint: (latlng: [number, number]) => void }) {
  useMapEvents({
    click(e) {
      onClickPoint([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

function MapView() {
  const center: [number, number] = [28.6139, 77.2090];
  const [points, setPoints] = useState<[number, number][]>([]);

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
          attribution='&copy; <a href="https://osm.org">OpenStreetMap</a> contributors'
        />
        <ClickHandler onClickPoint={(latlng) => setPoints([...points, latlng])} />
        {points.length >= 3 && <Polygon positions={points} pathOptions={{ color: 'red' }} />}
      </MapContainer>
    </div>
  );
}

export default MapView;
