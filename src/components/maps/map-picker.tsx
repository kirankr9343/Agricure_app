"use client";

import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

//
// V-- THIS IS THE LINE (OR AROUND HERE) THAT IS LIKELY MISSING --V
//
const MAP_API_KEY = process.env.NEXT_PUBLIC_MAP_API_KEY || '';
const MAP_URL_TEMPLATE = `https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=${MAP_API_KEY}`;
//
// ^-- MAKE SURE THE LINES ABOVE ARE PRESENT AT THE TOP OF YOUR FILE --^
//

// --- Custom Icon ---
const customIcon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// --- Child Components (MapEvents, ChangeView) ---
// (No changes here, just make sure they are present)
interface MapEventsProps {
  onMarkerMove: (lat: number, lng: number) => void;
}
function MapEvents({ onMarkerMove }: MapEventsProps) {
  useMapEvents({
    click(e) {
      onMarkerMove(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function ChangeView({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom);
  }, [center, zoom, map]);
  return null;
}


// --- MAIN COMPONENT ---
interface MapPickerProps {
  initialPosition: [number, number] | null;
  onMarkerMove: (lat: number, lng: number) => void;
}

export default function MapPicker({ initialPosition, onMarkerMove }: MapPickerProps) {
  const [position, setPosition] = useState<[number, number]>(initialPosition || [28.6139, 77.2090]);
  const [currentZoom] = useState(13);

  useEffect(() => {
    if (initialPosition) {
      setPosition(initialPosition);
    }
  }, [initialPosition]);
  
  // This cleanup hook is still important for HMR
  useEffect(() => {
    return () => {
      const mapContainer = L.DomUtil.get('map');
      if (mapContainer != null && (mapContainer as any)._leaflet_id) {
        (mapContainer as any)._leaflet_id = null;
      }
    };
  }, []);
  
  
  // THIS IS LINE 48:
  // This check is now safe because MAP_API_KEY is guaranteed to be defined (even as an empty string)
  if (!MAP_API_KEY) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-muted text-center text-sm text-muted-foreground p-4">
        <p>
          Map cannot be displayed. Please provide a valid map API key in your environment variables (NEXT_PUBLIC_MAP_API_KEY) to enable this feature.
        </p>
      </div>
    );
  }
  
  return (
    <MapContainer
      id="map"
      center={position}
      zoom={currentZoom}
      scrollWheelZoom={true}  // <-- SET THIS TO TRUE
      style={{ height: '100%', width: '100%' }}
    >
      {/* All your other components go here.
        Map features like dragging, touch zoom, and double-click zoom
        are already enabled by default.
      */}
      <TileLayer
        attribution='&copy; <a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
        url={MAP_URL_TEMPLATE}
      />
      <Marker
        position={position}
        icon={customIcon}
        draggable={true}
        eventHandlers={{
          dragend: (e) => {
            const newPos = e.target.getLatLng();
            onMarkerMove(newPos.lat, newPos.lng);
          }
        }}
      />
      <MapEvents onMarkerMove={onMarkerMove} />
      <ChangeView center={position} zoom={currentZoom} />
    </MapContainer>
  );
}