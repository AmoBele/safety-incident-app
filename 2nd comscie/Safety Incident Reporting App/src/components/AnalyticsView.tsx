import { motion } from 'motion/react';
import { ArrowLeft, TrendingDown, TrendingUp, AlertCircle, Globe } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import type { Screen } from '../App';

interface AnalyticsViewProps {
  navigateTo: (screen: Screen) => void;
}

export default function AnalyticsView({ navigateTo }: AnalyticsViewProps) {
  const globalMetrics = [
    { label: 'Total Reports', value: '12,847', trend: -8, color: 'text-green-400' },
    { label: 'Active Cases', value: '2,341', trend: -12, color: 'text-green-400' },
    { label: 'Response Time', value: '4.2m', trend: -15, color: 'text-green-400' },
    { label: 'Resolved', value: '10,506', trend: +18, color: 'text-cyan-400' },
  ];

  const incidentClusters = [
    { location: 'Central District', incidents: 234, severity: 'medium', lat: 40, lng: 30 },
    { location: 'East Side', incidents: 178, severity: 'low', lat: 60, lng: 50 },
    { location: 'North Area', incidents: 456, severity: 'high', lat: 30, lng: 70 },
  ];

  const weeklyData = [
    { day: 'Mon', incidents: 145 },
    { day: 'Tue', incidents: 132 },
    { day: 'Wed', incidents: 156 },
    { day: 'Thu', incidents: 128 },
    { day: 'Fri', incidents: 189 },
    { day: 'Sat', incidents: 201 },
    { day: 'Sun', incidents: 167 },
  ];

  return (
    <div className="min-h-screen bg-black p-6 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-96 h-96 bg-violet-500 rounded-full blur-[120px] opacity-40" />
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
          <h1 className="text-white mb-2">Global Analytics</h1>
          <p className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
            Real-time GBV metrics and incident insights
          </p>
        </motion.div>

        {/* Global Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {globalMetrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-white/60 text-sm">{metric.label}</p>
                  {metric.trend < 0 ? (
                    <TrendingDown className="w-4 h-4 text-green-400" />
                  ) : (
                    <TrendingUp className="w-4 h-4 text-cyan-400" />
                  )}
                </div>
                <p className="text-white text-3xl mb-1">{metric.value}</p>
                <p className={`text-sm ${metric.color}`}>
                  {metric.trend > 0 ? '+' : ''}{metric.trend}% this month
                </p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Incident Clusters Map */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <Card className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white">Global Incident Clusters</h3>
              <Globe className="w-5 h-5 text-cyan-400" />
            </div>

            <div className="relative bg-gradient-to-br from-slate-900/50 to-slate-800/50 rounded-2xl h-96 overflow-hidden border border-white/5">
              {/* World map visualization */}
              <div className="absolute inset-0 bg-gradient-to-br from-violet-900/20 to-cyan-900/20" />
              
              {incidentClusters.map((cluster, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.2 }}
                  className="absolute"
                  style={{
                    left: `${cluster.lng}%`,
                    top: `${cluster.lat}%`,
                  }}
                >
                  <div className="relative">
                    <motion.div
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.5, 0.2, 0.5],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className={`absolute inset-0 w-32 h-32 -translate-x-1/2 -translate-y-1/2 rounded-full blur-xl ${
                        cluster.severity === 'high'
                          ? 'bg-red-500'
                          : cluster.severity === 'medium'
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                      }`}
                    />
                    <div className={`relative w-6 h-6 rounded-full ${
                      cluster.severity === 'high'
                        ? 'bg-red-500'
                        : cluster.severity === 'medium'
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                    }`}>
                      <div className="absolute inset-0 rounded-full animate-ping opacity-75" />
                    </div>
                    <div className="absolute top-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                      <div className="backdrop-blur-xl bg-black/50 border border-white/10 rounded-lg px-3 py-2">
                        <p className="text-white text-sm">{cluster.location}</p>
                        <p className="text-white/60 text-xs">{cluster.incidents} incidents</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Weekly Trends */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6">
              <h3 className="text-white mb-6">Weekly Incident Trends</h3>
              <div className="space-y-3">
                {weeklyData.map((day, i) => {
                  const maxIncidents = Math.max(...weeklyData.map(d => d.incidents));
                  const percentage = (day.incidents / maxIncidents) * 100;
                  
                  return (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-white/80">{day.day}</span>
                        <span className="text-white/60">{day.incidents}</span>
                      </div>
                      <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ delay: i * 0.1, duration: 0.8 }}
                          className="h-full bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6">
              <h3 className="text-white mb-6">Priority Alerts</h3>
              <div className="space-y-4">
                <div className="backdrop-blur-xl bg-red-500/10 border border-red-500/30 rounded-2xl p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-white mb-1">High-Risk Area Detected</p>
                      <p className="text-white/60 text-sm">North Area showing 45% increase in incidents</p>
                    </div>
                  </div>
                </div>

                <div className="backdrop-blur-xl bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-white mb-1">Response Time Increasing</p>
                      <p className="text-white/60 text-sm">Weekend response times need attention</p>
                    </div>
                  </div>
                </div>

                <div className="backdrop-blur-xl bg-green-500/10 border border-green-500/30 rounded-2xl p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-white mb-1">Resolution Rate Improving</p>
                      <p className="text-white/60 text-sm">96% of cases resolved within 24 hours</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
