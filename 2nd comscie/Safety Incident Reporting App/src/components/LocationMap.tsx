import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import { Icon, LatLngExpression } from 'leaflet';
import L from 'leaflet';

// Fix for default marker icon - Leaflet marker issue fix
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface LocationMapProps {
  height?: string;
  showSafeZones?: boolean;
  onLocationDetected?: (lat: number, lng: number, address: string) => void;
}

interface SafeZone {
  lat: number;
  lng: number;
  level: 'safe' | 'warning' | 'danger';
  name: string;
  radius: number;
}

// Component to handle map re-centering when location changes
function RecenterMap({ center }: { center: LatLngExpression }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, 13);
  }, [center, map]);
  
  return null;
}

export default function LocationMap({ 
  height = '400px', 
  showSafeZones = true,
  onLocationDetected 
}: LocationMapProps) {
  // Start with a default location so map shows immediately
  const [currentLocation, setCurrentLocation] = useState<[number, number]>([0, 0]);
  const [address, setAddress] = useState<string>('Getting your location...');
  const [locationError, setLocationError] = useState<string>('');
  const [isTracking, setIsTracking] = useState<boolean>(false);
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const callbackRef = useRef(onLocationDetected);
  
  useEffect(() => {
    callbackRef.current = onLocationDetected;
  }, [onLocationDetected]);

  const safeZones: SafeZone[] = [
    { lat: 14.5995, lng: 120.9842, level: 'safe', name: 'Police Station', radius: 500 },
    { lat: 14.6042, lng: 120.9822, level: 'safe', name: 'Community Center', radius: 300 },
    { lat: 14.5950, lng: 120.9900, level: 'warning', name: 'Poorly Lit Area', radius: 200 },
    { lat: 14.6080, lng: 120.9760, level: 'danger', name: 'High Crime Area', radius: 400 },
  ];

  // Set default location when map first loads
  useEffect(() => {
    // Use default location so map shows something
    setCurrentLocation([14.5995, 120.9842]); // Manila coordinates
    setAddress('Default Location - Manila, Philippines');
    setMapLoaded(true);
    
    let timeoutId: NodeJS.Timeout;
    let watchId: number | null = null;
    
    if ('geolocation' in navigator) {
      // Set a timeout to check if location detection is taking too long
      timeoutId = setTimeout(() => {
        console.log('Location detection timeout, using fallback');
        const fallbackLocation: [number, number] = [14.5995, 120.9842];
        setAddress('Location timeout. Using default location (Manila).');
        setLocationError('Location detection timed out');
      }, 8000); // 8 second timeout
      
      // First get initial position
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          clearTimeout(timeoutId);
          const { latitude, longitude } = position.coords;
          console.log('Initial location detected:', latitude, longitude);
          setCurrentLocation([latitude, longitude]);
          
          // Reverse geocoding to get address
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
              {
                headers: {
                  'User-Agent': 'SafetyIncidentReportingApp/1.0'
                }
              }
            );
            const data = await response.json();
            const detectedAddress = data.display_name || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
            setAddress(detectedAddress);
            console.log('Address detected:', detectedAddress);
            
            if (callbackRef.current) {
              callbackRef.current(latitude, longitude, detectedAddress);
            }
          } catch (error) {
            console.error('Geocoding error:', error);
            const fallbackAddress = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
            setAddress(fallbackAddress);
            if (callbackRef.current) {
              callbackRef.current(latitude, longitude, fallbackAddress);
            }
          }
        },
        (error) => {
          clearTimeout(timeoutId);
          console.error('Error getting location:', error);
          setLocationError(error.message);
          setAddress('Location access denied. Using default location (Manila).');
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );

      // Start continuous tracking with watchPosition
      watchId = navigator.geolocation.watchPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          console.log('Position updated:', latitude, longitude);
          setCurrentLocation([latitude, longitude]);
          setIsTracking(true);
          
          // Update address occasionally (not on every position update to avoid rate limiting)
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
              {
                headers: {
                  'User-Agent': 'SafetyIncidentReportingApp/1.0'
                }
              }
            );
            const data = await response.json();
            const detectedAddress = data.display_name || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
            setAddress(detectedAddress);
          } catch (error) {
            console.error('Geocoding error:', error);
            const fallbackAddress = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
            setAddress(fallbackAddress);
          }
        },
        (error) => {
          console.error('Error watching position:', error);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 5000,
          timeout: 10000
        }
      );
    } else {
      console.error('Geolocation not supported');
      setLocationError('Geolocation is not supported by your browser');
      setAddress('Geolocation not supported. Using default location (Manila).');
    }
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, []);

  const getZoneColor = (level: 'safe' | 'warning' | 'danger') => {
    switch (level) {
      case 'safe':
        return '#10b981'; // green
      case 'warning':
        return '#f59e0b'; // yellow
      case 'danger':
        return '#ef4444'; // red
      default:
        return '#6b7280'; // gray
    }
  };

  if (currentLocation[0] === 0 && currentLocation[1] === 0) {
    return (
      <div className="relative rounded-2xl overflow-hidden border border-white/10 flex items-center justify-center" style={{ height }}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative rounded-2xl overflow-hidden border border-white/10" style={{ height, width: '100%' }}>
      <MapContainer
        center={currentLocation}
        zoom={13}
        style={{ height: '100%', width: '100%', position: 'relative' }}
        zoomControl={true}
        scrollWheelZoom={true}
      >
          <RecenterMap center={currentLocation} />
          
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Current location marker */}
          <Marker position={currentLocation}>
            <Popup>
              <div className="text-center">
                <p className="font-semibold text-cyan-600">📍 Your Current Location</p>
                <p className="text-sm text-gray-600 mt-1">{address}</p>
                <div className="mt-2 flex items-center justify-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs text-green-600 font-semibold">Live Tracking Active</span>
                </div>
              </div>
            </Popup>
          </Marker>

          {/* Safe zones */}
          {showSafeZones && safeZones.map((zone, index) => (
            <Circle
              key={index}
              center={[zone.lat, zone.lng]}
              radius={zone.radius}
              pathOptions={{
                color: getZoneColor(zone.level),
                fillColor: getZoneColor(zone.level),
                fillOpacity: 0.2,
                weight: 2,
              }}
            >
              <Popup>
                <div className="text-center">
                  <p className="font-semibold">{zone.name}</p>
                  <p className="text-sm text-gray-600 capitalize">{zone.level} Zone</p>
                </div>
              </Popup>
            </Circle>
          ))}
        </MapContainer>

      {/* Location info overlay */}
      <div className="absolute top-4 left-4 right-4 z-[1000] pointer-events-none">
        <div className="backdrop-blur-xl bg-black/50 border border-white/10 rounded-xl px-4 py-2 pointer-events-auto">
          <div className="flex items-center gap-3">
            <p className="text-white text-sm">
              📍 <span className="font-semibold">Current Location:</span> {address}
            </p>
            {isTracking && (
              <div className="flex items-center gap-2 ml-auto">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-green-400 text-xs font-semibold">LIVE TRACKING</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
