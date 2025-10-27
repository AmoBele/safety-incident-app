import { Home, Shield, Heart, Users, BarChart, Menu, Eye, EyeOff, Map, AlertCircle, LogOut } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useState } from 'react';
import { motion } from 'motion/react';
import type { Screen } from '../App';
import SimpleMap from './SimpleMap';

interface HomeDashboardProps {
  navigateTo: (screen: Screen) => void;
  toggleCompanion: () => void;
  isCompanionActive: boolean;
  authToken: string | null;
  user: any;
  onLogout: () => void;
}

export default function HomeDashboard({ navigateTo, toggleCompanion, isCompanionActive, onLogout }: HomeDashboardProps) {
  const safeZones = [
    { lat: -22.9868, lng: 30.4504, level: 'safe', name: 'Central District' },
    { lat: -23.0045, lng: 30.4680, level: 'warning', name: 'East Side' },
    { lat: -22.9720, lng: 30.4380, level: 'danger', name: 'North Area' },
  ];

  const stats = [
    { label: 'Safe Zones Nearby', value: '12', icon: Shield, color: 'from-green-500 to-emerald-500' },
    { label: 'Active Helpers', value: '48', icon: Users, color: 'from-blue-500 to-cyan-500' },
    { label: 'Emergency Response', value: '<3m', icon: AlertCircle, color: 'from-violet-500 to-purple-500' },
  ];

  return (
    <div className="min-h-screen bg-black p-6 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-[120px] opacity-30" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-violet-500 rounded-full blur-[120px] opacity-30" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500 rounded-full blur-[120px] opacity-30" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-white mb-2">Safety Dashboard</h1>
            <p className="bg-gradient-to-r from-blue-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
              You are protected
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Button
              onClick={onLogout}
              className="bg-white/5 border border-white/10 hover:bg-red-500/20 hover:border-red-500/30 rounded-2xl"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
            <Button
              onClick={toggleCompanion}
              className={`rounded-2xl ${
                isCompanionActive
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500'
                  : 'bg-white/5 border border-white/10'
              }`}
            >
              {isCompanionActive ? <Eye className="w-4 h-4 mr-2" /> : <EyeOff className="w-4 h-4 mr-2" />}
              {isCompanionActive ? 'Guardian Active' : 'Activate Guardian'}
            </Button>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-white/60 text-sm mb-2">{stat.label}</p>
                    <p className="text-white text-3xl">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-2xl bg-gradient-to-r ${stat.color}`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Map with Heat Zones */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <Card className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <h3 className="text-white">Safety Heat Map</h3>
                <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-green-400 text-xs font-semibold">Live Tracking</span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-white/60">Safe</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <span className="text-white/60">Caution</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="text-white/60">Danger</span>
                </div>
              </div>
            </div>

            <SimpleMap height="400px" />
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Button
              onClick={() => navigateTo('report')}
              className="w-full h-32 bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/30 hover:from-violet-500/30 hover:to-purple-500/30 rounded-3xl flex flex-col items-center justify-center gap-3"
            >
              <Shield className="w-8 h-8 text-violet-400" />
              <span className="text-white">Report Incident</span>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              onClick={() => navigateTo('community')}
              className="w-full h-32 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 hover:from-blue-500/30 hover:to-cyan-500/30 rounded-3xl flex flex-col items-center justify-center gap-3"
            >
              <Users className="w-8 h-8 text-blue-400" />
              <span className="text-white">Community Hub</span>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Button
              onClick={() => navigateTo('healing')}
              className="w-full h-32 bg-gradient-to-br from-pink-500/20 to-rose-500/20 border border-pink-500/30 hover:from-pink-500/30 hover:to-rose-500/30 rounded-3xl flex flex-col items-center justify-center gap-3"
            >
              <Heart className="w-8 h-8 text-pink-400" />
              <span className="text-white">Healing Hub</span>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 }}
          >
            <Button
              onClick={() => navigateTo('vault')}
              className="w-full h-32 bg-gradient-to-br from-cyan-500/20 to-teal-500/20 border border-cyan-500/30 hover:from-cyan-500/30 hover:to-teal-500/30 rounded-3xl flex flex-col items-center justify-center gap-3"
            >
              <Shield className="w-8 h-8 text-cyan-400" />
              <span className="text-white">Evidence Vault</span>
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
