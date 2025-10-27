import { motion } from 'motion/react';
import { AlertTriangle, FileText, Clock, Users, Phone, AlertCircle, MapPin, Home, Flag, Lightbulb, Settings } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import type { Screen } from '../App';

interface DashboardProps {
  navigateTo: (screen: Screen) => void;
}

export default function Dashboard({ navigateTo }: DashboardProps) {
  const stats = [
    { icon: AlertTriangle, label: 'Active Alerts', value: '3', color: 'text-red-400', bg: 'bg-red-500/20' },
    { icon: FileText, label: 'Total Reports Today', value: '12', color: 'text-blue-400', bg: 'bg-blue-500/20' },
    { icon: Clock, label: 'Avg Response Time', value: '4m', color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
    { icon: Users, label: 'Security Staff Online', value: '8', color: 'text-green-400', bg: 'bg-green-500/20' },
  ];

  const securityStaff = [
    { name: 'JM', online: true },
    { name: 'SK', online: true },
    { name: 'TB', online: false },
    { name: 'PM', online: true },
    { name: 'LN', online: true },
  ];

  const recentIncidents = [
    { type: 'Medical Emergency', location: 'Library Block A', time: '5 min ago', status: 'In Progress' },
    { type: 'Suspicious Activity', location: 'Parking Lot B', time: '12 min ago', status: 'Resolved' },
    { type: 'Fire Alarm', location: 'Residence Hall 3', time: '1 hour ago', status: 'Resolved' },
  ];

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Navigation Sidebar */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="fixed left-6 top-1/2 -translate-y-1/2 z-50"
        >
          <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-4 border border-white/20 space-y-4">
            <button
              onClick={() => navigateTo('dashboard')}
              className="p-3 rounded-2xl bg-blue-500/30 text-blue-300 hover:bg-blue-500/50 transition-all"
            >
              <Home className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigateTo('alerts')}
              className="p-3 rounded-2xl text-white/60 hover:bg-white/10 transition-all"
            >
              <Flag className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigateTo('tips')}
              className="p-3 rounded-2xl text-white/60 hover:bg-white/10 transition-all"
            >
              <Lightbulb className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigateTo('analytics')}
              className="p-3 rounded-2xl text-white/60 hover:bg-white/10 transition-all"
            >
              <FileText className="w-5 h-5" />
            </button>
            <button className="p-3 rounded-2xl text-white/60 hover:bg-white/10 transition-all">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="ml-24">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-white mb-2">Security Dashboard</h1>
            <p className="text-blue-200">Real-time campus safety monitoring</p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="backdrop-blur-xl bg-white/10 border-white/20 rounded-3xl p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-white/60 text-sm mb-2">{stat.label}</p>
                      <p className="text-white text-3xl">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-2xl ${stat.bg}`}>
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Quick Actions & Map */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="lg:col-span-1"
            >
              <Card className="backdrop-blur-xl bg-white/10 border-white/20 rounded-3xl p-6">
                <h3 className="text-white mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button
                    onClick={() => navigateTo('report')}
                    className="w-full bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white rounded-2xl h-12"
                    style={{ boxShadow: '0 0 20px rgba(239, 68, 68, 0.5)' }}
                  >
                    <AlertCircle className="mr-2 w-5 h-5" />
                    Report Emergency
                  </Button>
                  <Button className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/20 rounded-2xl h-12">
                    <Phone className="mr-2 w-5 h-5" />
                    Call Security
                  </Button>
                  <Button
                    onClick={() => navigateTo('alerts')}
                    className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/20 rounded-2xl h-12"
                  >
                    <Flag className="mr-2 w-5 h-5" />
                    View Alerts
                  </Button>
                </div>

                {/* Security Staff */}
                <div className="mt-6">
                  <h4 className="text-white/80 text-sm mb-3">Security Staff Online</h4>
                  <div className="flex -space-x-2">
                    {securityStaff.map((staff, i) => (
                      <div key={i} className="relative">
                        <Avatar className="border-2 border-slate-900">
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-700 text-white text-xs">
                            {staff.name}
                          </AvatarFallback>
                        </Avatar>
                        {staff.online && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Mini Map */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="lg:col-span-2"
            >
              <Card className="backdrop-blur-xl bg-white/10 border-white/20 rounded-3xl p-6 h-full">
                <h3 className="text-white mb-4">Incident Map</h3>
                <div className="relative bg-slate-800/50 rounded-2xl h-64 overflow-hidden">
                  {/* Simplified map visualization */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20" />
                  
                  {/* Incident markers */}
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute top-1/4 left-1/3"
                  >
                    <div className="relative">
                      <MapPin className="w-8 h-8 text-red-500 drop-shadow-lg" />
                      <div className="absolute inset-0 bg-red-500/30 rounded-full blur-xl" />
                    </div>
                  </motion.div>
                  
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                    className="absolute top-2/3 right-1/3"
                  >
                    <div className="relative">
                      <MapPin className="w-8 h-8 text-yellow-500 drop-shadow-lg" />
                      <div className="absolute inset-0 bg-yellow-500/30 rounded-full blur-xl" />
                    </div>
                  </motion.div>

                  <div className="absolute bottom-4 left-4 right-4 backdrop-blur-xl bg-white/10 rounded-xl p-3 border border-white/20">
                    <p className="text-white text-sm">3 active incidents on campus</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Recent Incidents */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="backdrop-blur-xl bg-white/10 border-white/20 rounded-3xl p-6">
              <h3 className="text-white mb-4">Recent Incidents</h3>
              <div className="space-y-3">
                {recentIncidents.map((incident, i) => (
                  <div
                    key={i}
                    className="backdrop-blur-xl bg-white/5 rounded-2xl p-4 border border-white/10 flex items-center justify-between hover:bg-white/10 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-xl bg-red-500/20">
                        <AlertTriangle className="w-5 h-5 text-red-400" />
                      </div>
                      <div>
                        <p className="text-white">{incident.type}</p>
                        <p className="text-white/60 text-sm">{incident.location} • {incident.time}</p>
                      </div>
                    </div>
                    <Badge
                      variant={incident.status === 'Resolved' ? 'secondary' : 'default'}
                      className={`rounded-xl ${
                        incident.status === 'Resolved'
                          ? 'bg-green-500/20 text-green-300 border-green-500/30'
                          : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                      }`}
                    >
                      {incident.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
