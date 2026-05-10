import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const MapComponent = ({ markers, onMarkerClick }) => {
  const getMarkerColor = (status, deaths) => {
    if (deaths > 0) return '#ff3333'; // Red for deaths
    if (status === 'confirmed') return '#ff6b6b'; // Orange-red for confirmed
    return '#ffa500'; // Orange for monitoring
  };

  const getMarkerRadius = (count) => {
    return Math.max(10, Math.min(40, 10 + count * 3));
  };

  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      style={{ height: '500px', borderRadius: '8px' }}
      className="leaflet-container"
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; OpenStreetMap contributors'
      />

      {markers.map((marker) => (
        <CircleMarker
          key={marker.id}
          center={[marker.lat, marker.lng]}
          radius={getMarkerRadius(marker.count)}
          fillColor={getMarkerColor(marker.status, marker.deaths)}
          color={getMarkerColor(marker.status, marker.deaths)}
          weight={2}
          opacity={0.8}
          fillOpacity={0.7}
          onClick={() => onMarkerClick(marker.country)}
        >
          <Popup className="custom-popup">
            <div className="marker-popup">
              <h4>{marker.country}</h4>
              <p className="city">{marker.city}</p>
              <div className="marker-stats">
                <div><span className="label">Confirmed:</span> <strong>{marker.count}</strong></div>
                <div><span className="label">Deaths:</span> <strong style={{color: '#ff3333'}}>{marker.deaths}</strong></div>
              </div>
              <p className="status" style={{
                color: marker.deaths > 0 ? '#ff3333' : '#ffa500'
              }}>
                ● {marker.deaths > 0 ? 'High Risk' : 'Monitoring'}
              </p>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
};

export default MapComponent;
