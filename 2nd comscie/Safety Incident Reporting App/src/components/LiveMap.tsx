import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix for default marker icon
import 'leaflet/dist/leaflet.css';
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

interface LiveMapProps {
  height?: string;
}

function AutoCenterMap({ position }: { position: [number, number] }) {
  const map = useMap();
  
  useEffect(() => {
    if (position[0] !== 0 || position[1] !== 0) {
      map.setView(position, 13);
    }
  }, [map, position]);
  
  return null;
}

export default function LiveMap({ height = '400px' }: LiveMapProps) {
  const [position, setPosition] = useState<[number, number]>([14.5995, 120.9842]); // Default Manila
  const [isTracking, setIsTracking] = useState(false);
  const [address, setAddress] = useState('Loading location...');
  const watchIdRef = useRef<number | null>(null);

  useEffect(() => {
    // Try to get current location
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          
          setPosition([lat, lng]);
          setAddress(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
          setIsTracking(true);
          
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
              { headers: { 'User-Agent': 'SafetyApp/1.0' } }
            );
            const data = await response.json();
            if (data.display_name) {
              setAddress(data.display_name);
            }
          } catch (err) {
            console.log('Geocoding failed');
          }
        },
        () => {
          console.log('Location access denied, using default');
          setAddress('Default Location - Manila, Philippines');
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );

      // Watch for position changes
      watchIdRef.current = navigator.geolocation.watchPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          
          setPosition([lat, lng]);
          setIsTracking(true);
        },
        () => {
          setIsTracking(false);
        },
        { enableHighAccuracy: true, maximumAge: 5000 }
      );
    }

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  return (
    <div className="relative" style={{ height }}>
      <MapContainer
        center={position}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <AutoCenterMap position={position} />
        
        <Marker position={position}>
          <Popup>
            <div className="text-center">
              <p className="font-semibold text-blue-600">📍 Your Location</p>
              <p className="text-sm text-gray-600 mt-1">{address}</p>
              {isTracking && (
                <p className="text-xs text-green-600 mt-2 font-semibold">✓ Live Tracking Active</p>
              )}
            </div>
          </Popup>
        </Marker>
      </MapContainer>

      {/* Status overlay */}
      <div className="absolute top-4 left-4 right-4 z-[1000] pointer-events-none">
        <div className="backdrop-blur-xl bg-black/70 border border-white/20 rounded-xl px-4 py-3 pointer-events-auto">
          <div className="flex items-center gap-3">
            <p className="text-white text-sm">
              📍 <span className="font-semibold">Location:</span> {address}
            </p>
            {isTracking && (
              <div className="flex items-center gap-2 ml-auto">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-green-400 text-xs font-semibold">LIVE</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

