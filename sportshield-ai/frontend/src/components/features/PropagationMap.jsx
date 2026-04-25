// SportShield AI | Google Solution Challenge 2026 | First Prize Target
/** WHY: Visualizes geolocation clusters for anomalies showing physical network bounds across continents safely wrapping Leaflet bounds. */
import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import ErrorBoundary from '../ui/ErrorBoundary';

const DEMO_CITIES = [
  { geo_lat: 51.5074, geo_lng: -0.1278, geo_city: 'London', geo_country: 'UK', similarity_percent: 98.5 },
  { geo_lat: 25.2048, geo_lng: 55.2708, geo_city: 'Dubai', geo_country: 'UAE', similarity_percent: 99.1 },
  { geo_lat: 19.0760, geo_lng: 72.8777, geo_city: 'Mumbai', geo_country: 'India', similarity_percent: 97.4 },
  { geo_lat: 1.3521, geo_lng: 103.8198, geo_city: 'Singapore', geo_country: 'SG', similarity_percent: 98.2 }
];

function InnerMap({ violations = [] }) {
  const points = violations.filter(v => v.geo_lat != null && v.geo_lng != null);
  const data = points.length > 0 ? points : DEMO_CITIES;
  const center = data.length > 0 ? [data[0].geo_lat, data[0].geo_lng] : [20, 0];

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      <div style={{ height: '300px', width: '100%', background: 'var(--color-deep)' }}>
        <MapContainer center={center} zoom={2} style={{ height: '100%', width: '100%' }} zoomControl={false} scrollWheelZoom={false}>
          <TileLayer
            attribution='&copy; OpenStreetMap'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          {data.map((v, i) => (
            <CircleMarker key={i} center={[v.geo_lat, v.geo_lng]} radius={8} pathOptions={{ color: 'var(--color-threat)', fillColor: 'var(--color-threat)', fillOpacity: 0.5, weight: 2 }} className="pulse-threat">
              <Popup>
                <div style={{ fontFamily: 'var(--font-body)', color: 'var(--color-void)' }}>
                  <strong>{v.geo_city}, {v.geo_country}</strong><br/>
                  Match: {v.similarity_percent}%
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}

export default function PropagationMap(props) {
  return <ErrorBoundary><InnerMap {...props} /></ErrorBoundary>;
}
