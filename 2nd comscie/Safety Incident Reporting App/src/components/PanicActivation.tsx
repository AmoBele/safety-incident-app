import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Shield, AlertCircle, Phone, MapPin, Mic } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import type { Screen } from '../App';

interface PanicActivationProps {
  navigateTo: (screen: Screen) => void;
}

export default function PanicActivation({ navigateTo }: PanicActivationProps) {
  const [countdown, setCountdown] = useState(5);
  const [isActivated, setIsActivated] = useState(false);
  const [isListening, setIsListening] = useState(true);

  useEffect(() => {
    if (!isActivated && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && !isActivated) {
      setIsActivated(true);
    }
  }, [countdown, isActivated]);

  const handleCancel = () => {
    navigateTo('home');
  };

  return (
    <div className="min-h-screen bg-black p-6 relative overflow-hidden flex items-center justify-center">
      {/* Intense pulsing background */}
      <motion.div
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ duration: 1, repeat: Infinity }}
        className="absolute inset-0"
      >
        <div className="absolute inset-0 bg-red-500 blur-[120px]" />
      </motion.div>

      <div className="max-w-2xl w-full relative z-10">
        {!isActivated ? (
          // Countdown Screen
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center"
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="mb-8"
            >
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-red-500 rounded-full blur-3xl opacity-50" />
                <div className="relative bg-gradient-to-br from-red-500 to-rose-600 p-12 rounded-full">
                  <AlertCircle className="w-32 h-32 text-white" />
                </div>
              </div>
            </motion.div>

            <h1 className="text-white mb-4">Emergency Protocol Activating</h1>
            
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="mb-8"
            >
              <p className="text-8xl text-red-400">{countdown}</p>
            </motion.div>

            <p className="text-white/80 mb-8">
              Notifying emergency contacts and authorities...
            </p>

            <Button
              onClick={handleCancel}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-2xl h-14 px-8"
            >
              Cancel Emergency Alert
            </Button>
          </motion.div>
        ) : (
          // Activated Screen
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div className="text-center mb-8">
              <motion.div
                animate={{
                  boxShadow: [
                    '0 0 40px rgba(239, 68, 68, 0.8)',
                    '0 0 80px rgba(239, 68, 68, 1)',
                    '0 0 40px rgba(239, 68, 68, 0.8)',
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="inline-block mb-6"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-red-500 rounded-full blur-3xl opacity-50" />
                  <div className="relative bg-gradient-to-br from-red-500 to-rose-600 p-12 rounded-full">
                    <Shield className="w-32 h-32 text-white" />
                  </div>
                </div>
              </motion.div>

              <h1 className="text-white mb-2">Emergency Alert Active</h1>
              <p className="text-red-400">Help is on the way</p>
            </div>

            <div className="space-y-4">
              <Card className="backdrop-blur-xl bg-white/10 border border-red-500/30 rounded-3xl p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-green-500/20">
                    <Phone className="w-6 h-6 text-green-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white">Emergency Services Contacted</p>
                    <p className="text-white/60 text-sm">ETA: 2-3 minutes</p>
                  </div>
                  <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                </div>
              </Card>

              <Card className="backdrop-blur-xl bg-white/10 border border-red-500/30 rounded-3xl p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-blue-500/20">
                    <MapPin className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white">Location Shared</p>
                    <p className="text-white/60 text-sm">Live tracking active</p>
                  </div>
                  <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse" />
                </div>
              </Card>

              <Card className="backdrop-blur-xl bg-white/10 border border-red-500/30 rounded-3xl p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-violet-500/20">
                    <Mic className="w-6 h-6 text-violet-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white">Audio Recording Active</p>
                    <p className="text-white/60 text-sm">Evidence being collected</p>
                  </div>
                  <motion.div
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="w-3 h-3 rounded-full bg-red-500"
                  />
                </div>
              </Card>

              <Card className="backdrop-blur-xl bg-white/10 border border-red-500/30 rounded-3xl p-6">
                <div className="text-center">
                  <p className="text-white mb-2">Trusted Contacts Notified:</p>
                  <div className="flex justify-center gap-2">
                    {['Mom', 'Best Friend', 'Neighbor'].map((contact, i) => (
                      <div
                        key={i}
                        className="backdrop-blur-xl bg-white/10 rounded-full px-3 py-1 text-sm text-white"
                      >
                        {contact}
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>

            <div className="mt-8 text-center">
              <p className="text-white/60 mb-4">You are not alone. Stay strong.</p>
              <Button
                onClick={handleCancel}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-2xl h-12 px-8"
              >
                I'm Safe Now
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
