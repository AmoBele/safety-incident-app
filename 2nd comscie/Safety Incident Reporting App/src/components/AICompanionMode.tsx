import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, MapPin, Navigation, Eye, Shield } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import type { Screen } from '../App';

interface AICompanionModeProps {
  navigateTo: (screen: Screen) => void;
}

export default function AICompanionMode({ navigateTo }: AICompanionModeProps) {
  const [journeySteps, setJourneySteps] = useState([
    { location: 'Home', time: '8:00 PM', status: 'completed' },
    { location: 'Main Street', time: '8:15 PM', status: 'current' },
    { location: 'Friend\'s Place', time: '8:30 PM (ETA)', status: 'upcoming' },
  ]);

  return (
    <div className="min-h-screen bg-black p-6 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500 rounded-full blur-[120px] opacity-40 animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-[120px] opacity-40 animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
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

        {/* Guardian Eye */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 1 }}
          className="flex flex-col items-center mb-12"
        >
          <motion.div
            animate={{
              boxShadow: [
                '0 0 40px rgba(34, 211, 238, 0.5)',
                '0 0 80px rgba(34, 211, 238, 0.8)',
                '0 0 40px rgba(34, 211, 238, 0.5)',
              ],
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="relative mb-6"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full blur-3xl opacity-50" />
            <div className="relative bg-gradient-to-br from-cyan-500 to-blue-500 p-12 rounded-full">
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Eye className="w-24 h-24 text-white" />
              </motion.div>
            </div>
          </motion.div>

          <h1 className="text-white mb-2">AI Guardian Active</h1>
          <p className="text-cyan-400">Watching over your journey</p>
        </motion.div>

        {/* Journey Tracker */}
        <Card className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 mb-6">
          <h3 className="text-white mb-6">Journey Timeline</h3>
          
          <div className="space-y-6">
            {journeySteps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.2 }}
                className="flex items-start gap-4"
              >
                <div className="flex flex-col items-center">
                  <motion.div
                    animate={step.status === 'current' ? {
                      scale: [1, 1.3, 1],
                      boxShadow: [
                        '0 0 10px rgba(34, 211, 238, 0.5)',
                        '0 0 20px rgba(34, 211, 238, 1)',
                        '0 0 10px rgba(34, 211, 238, 0.5)',
                      ],
                    } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                    className={`w-4 h-4 rounded-full ${
                      step.status === 'completed'
                        ? 'bg-green-500'
                        : step.status === 'current'
                        ? 'bg-cyan-500'
                        : 'bg-white/20'
                    }`}
                  />
                  {i < journeySteps.length - 1 && (
                    <div className={`w-0.5 h-12 mt-2 ${
                      step.status === 'completed' ? 'bg-green-500' : 'bg-white/20'
                    }`} />
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className={`w-4 h-4 ${
                      step.status === 'current' ? 'text-cyan-400' : 'text-white/60'
                    }`} />
                    <p className="text-white">{step.location}</p>
                  </div>
                  <p className="text-white/60 text-sm">{step.time}</p>
                </div>

                {step.status === 'current' && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  >
                    <Navigation className="w-5 h-5 text-cyan-400" />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Safety Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-5 h-5 text-green-400" />
              <p className="text-white/60">Journey Safety</p>
            </div>
            <p className="text-white text-2xl">High</p>
          </Card>

          <Card className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Eye className="w-5 h-5 text-cyan-400" />
              <p className="text-white/60">Guardians Watching</p>
            </div>
            <p className="text-white text-2xl">3</p>
          </Card>
        </div>

        {/* Emergency Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-6"
        >
          <Button
            onClick={() => navigateTo('panic')}
            className="w-full bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white rounded-2xl h-14"
            style={{ boxShadow: '0 0 30px rgba(239, 68, 68, 0.6)' }}
          >
            <Shield className="mr-2 w-5 h-5" />
            Activate Emergency Protocol
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
