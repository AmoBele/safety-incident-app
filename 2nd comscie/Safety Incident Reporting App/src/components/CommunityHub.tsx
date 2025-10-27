import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, MapPin, Shield, Users, Phone, Star, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { toast } from 'sonner';
import type { Screen } from '../App';

interface CommunityHubProps {
  navigateTo: (screen: Screen) => void;
}

export default function CommunityHub({ navigateTo }: CommunityHubProps) {
  const [findingLocation, setFindingLocation] = useState(false);

  const handleGetDirections = async (zoneName: string) => {
    setFindingLocation(true);
    toast.info('Getting your location...');
    
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;
          
          // Search for nearest police station using Google Maps
          const searchQuery = encodeURIComponent(`police station near ${userLat},${userLng}`);
          const mapsUrl = `https://www.google.com/maps/dir/${userLat},${userLng}/police+station/@${userLat},${userLng},15z`;
          
          toast.success('Opening directions to nearest police station');
          window.open(mapsUrl, '_blank');
          setFindingLocation(false);
        },
        (error) => {
          toast.error('Could not get your location', {
            description: 'Please enable location access'
          });
          setFindingLocation(false);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      toast.error('Location not supported');
      setFindingLocation(false);
    }
  };
  const safeZones = [
    {
      name: 'City Police Station',
      address: '123 Main Street',
      distance: '0.5 km',
      type: 'police',
      verified: true,
      rating: 4.9,
      phone: '911',
    },
    {
      name: "Women's Shelter - SafeHaven",
      address: '456 Oak Avenue',
      distance: '1.2 km',
      type: 'shelter',
      verified: true,
      rating: 5.0,
      phone: '18007997233', // National Domestic Violence Hotline
    },
    {
      name: '24/7 Community Center',
      address: '789 Park Road',
      distance: '2.0 km',
      type: 'community',
      verified: true,
      rating: 4.8,
      phone: '211', // Community services
    },
  ];

  const verifiedHelpers = [
    {
      name: 'Sarah Johnson',
      badge: 'Guardian',
      rating: 5.0,
      helped: 127,
      distance: '500m',
      available: true,
    },
    {
      name: 'Maria Garcia',
      badge: 'Advocate',
      rating: 4.9,
      helped: 84,
      distance: '800m',
      available: true,
    },
    {
      name: 'Lisa Chen',
      badge: 'Counselor',
      rating: 5.0,
      helped: 156,
      distance: '1.2km',
      available: false,
    },
  ];

  const supportCenters = [
    {
      name: 'National GBV Hotline',
      phone: '1-800-SAFE-NOW',
      phoneNumber: '18007233669', // Actual dialable number
      hours: '24/7',
      services: ['Crisis Support', 'Legal Aid', 'Counseling'],
    },
    {
      name: 'Survivor Support Network',
      phone: '1-800-HELP-123',
      phoneNumber: '18004357123', // Actual dialable number
      hours: '24/7',
      services: ['Peer Support', 'Resources', 'Safe Housing'],
    },
  ];

  const handleCall = (phoneNumber: string, name: string) => {
    window.location.href = `tel:${phoneNumber}`;
    toast.success(`Calling ${name}`, {
      description: 'Opening phone dialer...'
    });
  };

  return (
    <div className="min-h-screen bg-black p-6 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-[120px] opacity-40" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500 rounded-full blur-[120px] opacity-40" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Button
            onClick={() => navigateTo('home')}
            variant="ghost"
            className="text-white hover:bg-white/10 rounded-2xl"
          >
            <ArrowLeft className="mr-2 w-4 h-4" />
            Back to Home
          </Button>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-white mb-2">Community Hub</h1>
          <p className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Find safety, support, and solidarity near you
          </p>
        </motion.div>

        <Tabs defaultValue="zones" className="space-y-6">
          <TabsList className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-1">
            <TabsTrigger value="zones" className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500">
              Safe Zones
            </TabsTrigger>
            <TabsTrigger value="helpers" className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500">
              Verified Helpers
            </TabsTrigger>
            <TabsTrigger value="support" className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500">
              Support Centers
            </TabsTrigger>
          </TabsList>

          {/* Safe Zones */}
          <TabsContent value="zones" className="space-y-4">
            {safeZones.map((zone, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <motion.div
                        animate={{
                          boxShadow: [
                            '0 0 10px rgba(34, 211, 238, 0.3)',
                            '0 0 20px rgba(34, 211, 238, 0.6)',
                            '0 0 10px rgba(34, 211, 238, 0.3)',
                          ],
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="p-3 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500"
                      >
                        <Shield className="w-6 h-6 text-white" />
                      </motion.div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-white">{zone.name}</h3>
                          {zone.verified && (
                            <CheckCircle className="w-4 h-4 text-green-400" />
                          )}
                        </div>
                        <p className="text-white/60 text-sm mb-2">{zone.address}</p>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4 text-cyan-400" />
                            <span className="text-white/60 text-sm">{zone.distance}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            <span className="text-white/60 text-sm">{zone.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30 rounded-xl">
                      {zone.type}
                    </Badge>
                  </div>
                  <div className="flex gap-3">
                    <Button 
                      onClick={() => handleGetDirections(zone.name)}
                      disabled={findingLocation}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-2xl disabled:opacity-50"
                    >
                      {findingLocation ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Finding...
                        </>
                      ) : (
                        <>
                          <MapPin className="mr-2 w-4 h-4" />
                          Get Directions
                        </>
                      )}
                    </Button>
                    <Button 
                      onClick={() => handleCall(zone.phone, zone.name)}
                      className="flex-1 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-2xl"
                    >
                      <Phone className="mr-2 w-4 h-4" />
                      Call Now
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </TabsContent>

          {/* Verified Helpers */}
          <TabsContent value="helpers" className="space-y-4">
            {verifiedHelpers.map((helper, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                        <span className="text-white text-xl">{helper.name.charAt(0)}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-white">{helper.name}</h3>
                          <Badge className="bg-violet-500/20 text-violet-300 border-violet-500/30 rounded-xl">
                            {helper.badge}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 mb-2">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            <span className="text-white/60 text-sm">{helper.rating}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4 text-blue-400" />
                            <span className="text-white/60 text-sm">{helper.helped} helped</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4 text-cyan-400" />
                            <span className="text-white/60 text-sm">{helper.distance}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${helper.available ? 'bg-green-500' : 'bg-gray-500'}`} />
                          <span className="text-white/60 text-sm">
                            {helper.available ? 'Available Now' : 'Currently Unavailable'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {helper.available && (
                    <Button className="w-full mt-4 bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white rounded-2xl">
                      Request Help
                    </Button>
                  )}
                </Card>
              </motion.div>
            ))}
          </TabsContent>

          {/* Support Centers */}
          <TabsContent value="support" className="space-y-4">
            {supportCenters.map((center, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white mb-2">{center.name}</h3>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-cyan-400" />
                          <span className="text-cyan-400">{center.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-green-500/20 text-green-300 border-green-500/30 rounded-xl">
                            {center.hours}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {center.services.map((service, j) => (
                          <Badge
                            key={j}
                            className="bg-white/5 text-white/80 border-white/10 rounded-xl"
                          >
                            {service}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <Button 
                    onClick={() => handleCall(center.phoneNumber, center.name)}
                    className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-2xl"
                  >
                    <Phone className="mr-2 w-4 h-4" />
                    Call Now
                  </Button>
                </Card>
              </motion.div>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
