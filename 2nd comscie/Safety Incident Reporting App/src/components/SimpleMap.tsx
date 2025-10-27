import { useEffect, useRef, useState } from 'react';

interface SimpleMapProps {
  height?: string;
}

export default function SimpleMap({ height = '400px' }: SimpleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [address, setAddress] = useState('Detecting location...');
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    // Get user's location
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setLocation({ lat, lng });

          // Get address
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
              { headers: { 'User-Agent': 'SafetyApp/1.0' } }
            );
            const data = await response.json();
            setAddress(data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`);
          } catch {
            setAddress(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
          }
        },
        () => {
          // Default to Manila if location denied
          setLocation({ lat: 14.5995, lng: 120.9842 });
          setAddress('Manila, Philippines (Default Location)');
        }
      );
    } else {
      setLocation({ lat: 14.5995, lng: 120.9842 });
      setAddress('Manila, Philippines (Default Location)');
    }
  }, []);

  useEffect(() => {
    if (!location || !mapRef.current || mapLoaded) return;

    console.log('SimpleMap: Starting to load map with location:', location);

    // Load Leaflet dynamically
    const loadMap = async () => {
      // Check if Leaflet is already loaded
      if ((window as any).L) {
        console.log('Leaflet already loaded, initializing map...');
        initializeMap();
        return;
      }

      console.log('Loading Leaflet CSS and JS...');
      
      // Add Leaflet CSS
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);

      // Load Leaflet JS
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = () => {
        console.log('Leaflet JS loaded successfully');
        initializeMap();
      };
      script.onerror = () => {
        console.error('Failed to load Leaflet JS');
      };
      document.body.appendChild(script);
    };

    const initializeMap = () => {
      const L = (window as any).L;
      
      if (!L) {
        console.error('Leaflet (L) is not available!');
        return;
      }
      
      console.log('Creating map at coordinates:', location.lat, location.lng);
        
      // Create map with slightly zoomed out view to see all zones
      const map = L.map(mapRef.current!).setView([location.lat, location.lng], 13);

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      console.log('Base map tiles added');
      console.log('Your location:', location.lat, location.lng);

      // Generate random safety zones around the CURRENT location
      // This works anywhere in the world!
      const generateRandomZones = () => {
        const zones: Array<{
          lat: number;
          lng: number;
          level: 'safe' | 'warning' | 'danger';
          name: string;
          reason: string;
        }> = [];
        const zoneTypes = [
          { level: 'safe', names: ['Police Station Area', 'Community Center Zone', 'Residential Safe Zone', 'Hospital District'] },
          { level: 'warning', names: ['Poorly Lit Area', 'Busy Commercial District', 'Industrial Area', 'High Traffic Zone'] },
          { level: 'danger', names: ['High Crime Area', 'Isolated Area', 'Unsafe Zone', 'Avoid After Dark'] }
        ];

        // Generate 10 safe zones (instead of 3)
        for (let i = 0; i < 10; i++) {
          zones.push({
            lat: location.lat + (Math.random() - 0.5) * 0.08, // Spread wider - ~8km radius
            lng: location.lng + (Math.random() - 0.5) * 0.08,
            level: 'safe',
            name: zoneTypes[0].names[i % zoneTypes[0].names.length],
            reason: 'Police station nearby • Low crime rate • Well-lit streets'
          });
        }

        // Generate 8 caution zones (instead of 3)
        for (let i = 0; i < 8; i++) {
          zones.push({
            lat: location.lat + (Math.random() - 0.5) * 0.08,
            lng: location.lng + (Math.random() - 0.5) * 0.08,
            level: 'warning',
            name: zoneTypes[1].names[i % zoneTypes[1].names.length],
            reason: 'Limited street lighting • Moderate crime reports • Stay alert'
          });
        }

        // Generate 6 danger zones (instead of 2)
        for (let i = 0; i < 6; i++) {
          zones.push({
            lat: location.lat + (Math.random() - 0.5) * 0.08,
            lng: location.lng + (Math.random() - 0.5) * 0.08,
            level: 'danger',
            name: zoneTypes[2].names[i % zoneTypes[2].names.length],
            reason: 'Multiple assault reports • Gang activity • Avoid this area'
          });
        }

        return zones;
      };

      const safetyZones = generateRandomZones();
      console.log('Generated', safetyZones.length, 'random zones around location:', location.lat, location.lng);

      // Function to get color based on safety level
      const getColor = (level: string) => {
        switch (level) {
          case 'safe': return '#10b981'; // green
          case 'warning': return '#f59e0b'; // yellow/orange
          case 'danger': return '#ef4444'; // red
          default: return '#6b7280'; // gray
        }
      };

      // Function to get icon based on safety level
      const getIcon = (level: string) => {
        switch (level) {
          case 'safe': return '✓';
          case 'warning': return '⚠';
          case 'danger': return '⚠';
          default: return '•';
        }
      };

      // Create custom animated icons using divIcon
      const createIcon = (color: string) => L.divIcon({
        html: `
          <div style="position: relative; width: 30px; height: 30px;">
            <!-- Pulsing outer ring -->
            <div style="
              position: absolute;
              top: 0;
              left: 0;
              width: 30px;
              height: 30px;
              background: ${color};
              border-radius: 50%;
              opacity: 0.4;
              animation: pulse 2s ease-out infinite;
            "></div>
            <!-- Main dot -->
            <div style="
              position: absolute;
              top: 5px;
              left: 5px;
              width: 20px;
              height: 20px;
              background: ${color};
              border: 3px solid white;
              border-radius: 50%;
              box-shadow: 0 2px 8px rgba(0,0,0,0.4);
            "></div>
          </div>
          <style>
            @keyframes pulse {
              0% {
                transform: scale(1);
                opacity: 0.6;
              }
              50% {
                transform: scale(1.5);
                opacity: 0.3;
              }
              100% {
                transform: scale(2);
                opacity: 0;
              }
            }
          </style>
        `,
        className: '',
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      });

      const safeIcon = createIcon('#10b981');
      const warningIcon = createIcon('#f59e0b');
      const dangerIcon = createIcon('#ef4444');

      // Add safety zone MARKERS with hover functionality
      console.log('Adding', safetyZones.length, 'safety zone markers...');
      
      safetyZones.forEach((zone, index) => {
        const icon = zone.level === 'safe' ? safeIcon : zone.level === 'warning' ? warningIcon : dangerIcon;
        
        const marker = L.marker([zone.lat, zone.lng], { icon }).addTo(map);
        
        // Bind popup with details
        const popupContent = `
          <div style="min-width: 200px;">
            <div style="font-weight: bold; font-size: 14px; margin-bottom: 8px; color: ${zone.level === 'safe' ? '#10b981' : zone.level === 'warning' ? '#f59e0b' : '#ef4444'};">
              ${zone.level === 'safe' ? '✓' : '⚠'} ${zone.name}
            </div>
            <div style="font-size: 11px; text-transform: uppercase; font-weight: bold; margin-bottom: 4px;">
              ${zone.level === 'safe' ? '🟢 SAFE ZONE' : zone.level === 'warning' ? '🟡 CAUTION ZONE' : '🔴 DANGER ZONE'}
            </div>
            <div style="font-size: 12px; color: #666; line-height: 1.4;">
              ${zone.reason}
            </div>
          </div>
        `;
        
        marker.bindPopup(popupContent);
        
        // Open popup on hover (mouseover)
        marker.on('mouseover', function() {
          this.openPopup();
        });
        
        // Keep popup open when mouse is on the popup itself
        marker.on('popupopen', function() {
          const popup = this.getPopup();
          const popupElement = popup.getElement();
          
          if (popupElement) {
            popupElement.addEventListener('mouseenter', () => {
              // Keep popup open
            });
            
            popupElement.addEventListener('mouseleave', () => {
              this.closePopup();
            });
          }
        });
        
        // Close popup when mouse leaves marker (but not if going to popup)
        marker.on('mouseout', function() {
          setTimeout(() => {
            const popupElement = this.getPopup()?.getElement();
            if (popupElement && !popupElement.matches(':hover')) {
              this.closePopup();
            }
          }, 100);
        });
        
        console.log(`✓ Marker ${index + 1} added:`, zone.name);
      });
        
      console.log('All safety zones added to map');

      // Add your location marker
      const marker = L.marker([location.lat, location.lng]).addTo(map);
      marker.bindPopup(`<b>📍 Your Current Location</b><br>${address}`).openPopup();

      // Add click handler
      map.on('click', (e: any) => {
        L.popup()
          .setLatLng(e.latlng)
          .setContent(`Coordinates: ${e.latlng.toString()}`)
          .openOn(map);
      });

      setMapLoaded(true);
    };

    loadMap();
  }, [location, mapLoaded, address]);

  if (!location) {
    return (
      <div 
        className="flex items-center justify-center bg-gradient-to-br from-slate-900/80 to-slate-800/80 rounded-2xl border border-white/10"
        style={{ height }}
      >
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-white">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Map Container */}
      <div 
        ref={mapRef}
        className="rounded-2xl overflow-hidden border border-white/10"
        style={{ height, width: '100%' }}
      />
      
      {/* Location Info */}
      <div className="backdrop-blur-xl bg-black/50 border border-white/10 rounded-xl px-4 py-2">
        <p className="text-white text-sm">
          📍 <span className="font-semibold">Current Location:</span> {address}
        </p>
      </div>
    </div>
  );
}
