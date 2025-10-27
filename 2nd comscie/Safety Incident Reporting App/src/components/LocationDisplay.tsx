import { useState, useEffect } from 'react';
import { MapPin, Navigation, Wifi } from 'lucide-react';

export default function LocationDisplay() {
  const [location, setLocation] = useState<{lat: number, lng: number, address: string} | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if ('geolocation' in navigator) {
      // Get initial position
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          // Try to get address
          let address = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
              { headers: { 'User-Agent': 'SafetyApp/1.0' } }
            );
            const data = await response.json();
            if (data.display_name) {
              address = data.display_name;
            }
          } catch (err) {
            console.log('Could not get address');
          }

          setLocation({ lat, lng, address });
          setIsTracking(true);
        },
        (err) => {
          setError('Location access denied. Enable location in browser settings.');
          setIsTracking(false);
        }
      );

      // Start tracking
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setLocation({ lat, lng, address: `${lat.toFixed(4)}, ${lng.toFixed(4)}` });
          setIsTracking(true);
        },
        (err) => {
          setIsTracking(false);
        },
        { enableHighAccuracy: true, maximumAge: 5000 }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    } else {
      setError('Geolocation is not supported by your browser');
    }
  }, []);

  return (
    <div className="space-y-4">
      {location ? (
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-green-500/20 border border-green-500/30">
              <MapPin className="w-6 h-6 text-green-400" />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-white font-semibold">Current Location</h3>
                {isTracking && (
                  <div className="flex items-center gap-1 px-2 py-1 bg-green-500/20 border border-green-500/30 rounded-full">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-green-400 text-xs font-semibold">LIVE</span>
                  </div>
                )}
              </div>
              <p className="text-white/80 text-sm mb-3">{location.address}</p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-white/40 text-xs">Latitude</p>
                  <p className="text-white">{location.lat.toFixed(6)}</p>
                </div>
                <div>
                  <p className="text-white/40 text-xs">Longitude</p>
                  <p className="text-white">{location.lng.toFixed(6)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : error ? (
        <div className="backdrop-blur-xl bg-red-500/10 border border-red-500/20 rounded-2xl p-6">
          <div className="flex items-center gap-3">
            <Navigation className="w-6 h-6 text-red-400" />
            <p className="text-red-400">{error}</p>
          </div>
        </div>
      ) : (
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
            <p className="text-white">Detecting your location...</p>
          </div>
        </div>
      )}
    </div>
  );
}

