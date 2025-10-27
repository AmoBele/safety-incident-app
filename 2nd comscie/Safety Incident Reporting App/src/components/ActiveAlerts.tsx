import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, AlertTriangle, Clock, MapPin, CheckCircle, Filter } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import type { Screen } from '../App';

interface ActiveAlertsProps {
  navigateTo: (screen: Screen) => void;
}

interface Alert {
  id: string;
  type: string;
  description: string;
  location: string;
  time: string;
  status: 'reported' | 'assigned' | 'in-progress' | 'resolved';
  priority: 'high' | 'medium' | 'low';
  reporter: string;
}

export default function ActiveAlerts({ navigateTo }: ActiveAlertsProps) {
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

  const alerts: Alert[] = [
    {
      id: '1',
      type: 'Medical Emergency',
      description: 'Student collapsed in cafeteria, appears unconscious',
      location: 'Main Cafeteria, Building C',
      time: '5 min ago',
      status: 'in-progress',
      priority: 'high',
      reporter: 'Sarah M.',
    },
    {
      id: '2',
      type: 'Suspicious Activity',
      description: 'Unknown person loitering near residence entrance',
      location: 'Residence Hall 2, East Wing',
      time: '12 min ago',
      status: 'assigned',
      priority: 'medium',
      reporter: 'John D.',
    },
    {
      id: '3',
      type: 'Fire Alarm',
      description: 'Smoke detector triggered in kitchen area',
      location: 'Residence Hall 3, Floor 4',
      time: '1 hour ago',
      status: 'resolved',
      priority: 'high',
      reporter: 'System Auto',
    },
    {
      id: '4',
      type: 'Theft',
      description: 'Laptop stolen from unattended study area',
      location: 'Library, Study Room 12',
      time: '2 hours ago',
      status: 'reported',
      priority: 'medium',
      reporter: 'Mike T.',
    },
    {
      id: '5',
      type: 'Vandalism',
      description: 'Graffiti on exterior walls',
      location: 'Science Building, North Side',
      time: '3 hours ago',
      status: 'resolved',
      priority: 'low',
      reporter: 'Security Patrol',
    },
  ];

  const getStatusColor = (status: Alert['status']) => {
    switch (status) {
      case 'reported':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'assigned':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'in-progress':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'resolved':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
    }
  };

  const getPriorityColor = (priority: Alert['priority']) => {
    switch (priority) {
      case 'high':
        return 'text-red-400 bg-red-500/20';
      case 'medium':
        return 'text-yellow-400 bg-yellow-500/20';
      case 'low':
        return 'text-blue-400 bg-blue-500/20';
    }
  };

  const filterByStatus = (status: Alert['status'] | 'all') => {
    if (status === 'all') return alerts;
    return alerts.filter((alert) => alert.status === status);
  };

  const AlertTimeline = ({ status }: { status: Alert['status'] }) => {
    const steps = [
      { label: 'Reported', status: 'reported' },
      { label: 'Assigned', status: 'assigned' },
      { label: 'In Progress', status: 'in-progress' },
      { label: 'Resolved', status: 'resolved' },
    ];

    const currentIndex = steps.findIndex((s) => s.status === status);

    return (
      <div className="flex items-center gap-2">
        {steps.map((step, i) => (
          <div key={step.status} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                i <= currentIndex ? 'bg-blue-500 text-white' : 'bg-white/10 text-white/40'
              }`}
            >
              {i <= currentIndex ? <CheckCircle className="w-4 h-4" /> : <div className="w-2 h-2 rounded-full bg-current" />}
            </div>
            {i < steps.length - 1 && (
              <div className={`w-12 h-0.5 ${i < currentIndex ? 'bg-blue-500' : 'bg-white/10'}`} />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Button
            onClick={() => navigateTo('dashboard')}
            variant="ghost"
            className="text-white hover:bg-white/10 rounded-2xl"
          >
            <ArrowLeft className="mr-2 w-4 h-4" />
            Back to Dashboard
          </Button>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-white mb-2">Active Alerts</h1>
          <p className="text-blue-200">Monitor and track all campus incidents</p>
        </motion.div>

        {/* Alerts List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <Tabs defaultValue="all" className="mb-6">
              <TabsList className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-1">
                <TabsTrigger value="all" className="rounded-xl data-[state=active]:bg-blue-500">All</TabsTrigger>
                <TabsTrigger value="in-progress" className="rounded-xl data-[state=active]:bg-blue-500">Active</TabsTrigger>
                <TabsTrigger value="resolved" className="rounded-xl data-[state=active]:bg-blue-500">Resolved</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-6 space-y-4">
                {alerts.map((alert, i) => (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => setSelectedAlert(alert)}
                  >
                    <Card className={`backdrop-blur-xl bg-white/10 border-white/20 rounded-3xl p-6 cursor-pointer hover:bg-white/15 transition-all ${
                      selectedAlert?.id === alert.id ? 'ring-2 ring-blue-500' : ''
                    }`}>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-xl ${getPriorityColor(alert.priority)}`}>
                            <AlertTriangle className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="text-white">{alert.type}</h3>
                            <p className="text-white/60 text-sm">{alert.time}</p>
                          </div>
                        </div>
                        <Badge className={`rounded-xl ${getStatusColor(alert.status)}`}>
                          {alert.status.replace('-', ' ')}
                        </Badge>
                      </div>
                      <p className="text-white/80 mb-3">{alert.description}</p>
                      <div className="flex items-center gap-2 text-white/60 text-sm">
                        <MapPin className="w-4 h-4" />
                        {alert.location}
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </TabsContent>

              <TabsContent value="in-progress" className="mt-6 space-y-4">
                {filterByStatus('in-progress').map((alert, i) => (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => setSelectedAlert(alert)}
                  >
                    <Card className={`backdrop-blur-xl bg-white/10 border-white/20 rounded-3xl p-6 cursor-pointer hover:bg-white/15 transition-all ${
                      selectedAlert?.id === alert.id ? 'ring-2 ring-blue-500' : ''
                    }`}>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-xl ${getPriorityColor(alert.priority)}`}>
                            <AlertTriangle className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="text-white">{alert.type}</h3>
                            <p className="text-white/60 text-sm">{alert.time}</p>
                          </div>
                        </div>
                        <Badge className={`rounded-xl ${getStatusColor(alert.status)}`}>
                          {alert.status.replace('-', ' ')}
                        </Badge>
                      </div>
                      <p className="text-white/80 mb-3">{alert.description}</p>
                      <div className="flex items-center gap-2 text-white/60 text-sm">
                        <MapPin className="w-4 h-4" />
                        {alert.location}
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </TabsContent>

              <TabsContent value="resolved" className="mt-6 space-y-4">
                {filterByStatus('resolved').map((alert, i) => (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => setSelectedAlert(alert)}
                  >
                    <Card className={`backdrop-blur-xl bg-white/10 border-white/20 rounded-3xl p-6 cursor-pointer hover:bg-white/15 transition-all ${
                      selectedAlert?.id === alert.id ? 'ring-2 ring-blue-500' : ''
                    }`}>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-xl ${getPriorityColor(alert.priority)}`}>
                            <AlertTriangle className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="text-white">{alert.type}</h3>
                            <p className="text-white/60 text-sm">{alert.time}</p>
                          </div>
                        </div>
                        <Badge className={`rounded-xl ${getStatusColor(alert.status)}`}>
                          {alert.status.replace('-', ' ')}
                        </Badge>
                      </div>
                      <p className="text-white/80 mb-3">{alert.description}</p>
                      <div className="flex items-center gap-2 text-white/60 text-sm">
                        <MapPin className="w-4 h-4" />
                        {alert.location}
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </TabsContent>
            </Tabs>
          </div>

          {/* Alert Detail */}
          <div>
            {selectedAlert ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card className="backdrop-blur-xl bg-white/10 border-white/20 rounded-3xl p-8 sticky top-6">
                  <h3 className="text-white mb-6">Alert Details</h3>

                  <div className="space-y-6">
                    <div>
                      <p className="text-white/60 text-sm mb-1">Type</p>
                      <p className="text-white">{selectedAlert.type}</p>
                    </div>

                    <div>
                      <p className="text-white/60 text-sm mb-1">Description</p>
                      <p className="text-white">{selectedAlert.description}</p>
                    </div>

                    <div>
                      <p className="text-white/60 text-sm mb-1">Location</p>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-blue-400" />
                        <p className="text-white">{selectedAlert.location}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-white/60 text-sm mb-1">Reported By</p>
                      <p className="text-white">{selectedAlert.reporter}</p>
                    </div>

                    <div>
                      <p className="text-white/60 text-sm mb-1">Time</p>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-400" />
                        <p className="text-white">{selectedAlert.time}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-white/60 text-sm mb-3">Status Timeline</p>
                      <AlertTimeline status={selectedAlert.status} />
                      <div className="flex justify-between mt-2 text-xs text-white/60">
                        <span>Reported</span>
                        <span>Resolved</span>
                      </div>
                    </div>

                    <div>
                      <p className="text-white/60 text-sm mb-1">Priority Level</p>
                      <Badge className={`rounded-xl ${getPriorityColor(selectedAlert.priority)}`}>
                        {selectedAlert.priority.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ) : (
              <Card className="backdrop-blur-xl bg-white/10 border-white/20 rounded-3xl p-8 h-full flex items-center justify-center">
                <div className="text-center text-white/60">
                  <Filter className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Select an alert to view details</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
