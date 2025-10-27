import { motion } from 'motion/react';
import { ArrowLeft, TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import type { Screen } from '../App';

interface AnalyticsDashboardProps {
  navigateTo: (screen: Screen) => void;
}

export default function AnalyticsDashboard({ navigateTo }: AnalyticsDashboardProps) {
  const incidentData2d = [
    { time: '12 AM', incidents: 2 },
    { time: '6 AM', incidents: 1 },
    { time: '12 PM', incidents: 5 },
    { time: '6 PM', incidents: 8 },
    { time: '11 PM', incidents: 4 },
  ];

  const incidentData5d = [
    { day: 'Mon', incidents: 12 },
    { day: 'Tue', incidents: 8 },
    { day: 'Wed', incidents: 15 },
    { day: 'Thu', incidents: 10 },
    { day: 'Fri', incidents: 18 },
  ];

  const incidentData10d = [
    { day: 'Day 1', incidents: 12 },
    { day: 'Day 2', incidents: 8 },
    { day: 'Day 3', incidents: 15 },
    { day: 'Day 4', incidents: 10 },
    { day: 'Day 5', incidents: 18 },
    { day: 'Day 6', incidents: 14 },
    { day: 'Day 7', incidents: 9 },
    { day: 'Day 8', incidents: 16 },
    { day: 'Day 9', incidents: 11 },
    { day: 'Day 10', incidents: 13 },
  ];

  const incidentTypeData = [
    { name: 'Theft', value: 30, color: '#ef4444' },
    { name: 'Medical', value: 25, color: '#f59e0b' },
    { name: 'Suspicious Activity', value: 20, color: '#eab308' },
    { name: 'Fire', value: 10, color: '#f97316' },
    { name: 'Vandalism', value: 10, color: '#8b5cf6' },
    { name: 'Other', value: 5, color: '#6366f1' },
  ];

  const responseTimeData = [
    { category: 'High Priority', avgTime: 3, maxTime: 15 },
    { category: 'Medium Priority', avgTime: 6, maxTime: 15 },
    { category: 'Low Priority', avgTime: 12, maxTime: 15 },
  ];

  const systemStatus = [
    { name: 'Emergency Phones', status: 'online', count: '15/15' },
    { name: 'CCTV Cameras', status: 'warning', count: '42/45' },
    { name: 'Security Patrols', status: 'online', count: '8/8' },
    { name: 'Alert System', status: 'online', count: 'Active' },
  ];

  const LineChart = ({ data }: { data: Array<{ incidents: number }> }) => {
    const maxValue = Math.max(...data.map(d => d.incidents));
    const points = data.map((d, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = 100 - (d.incidents / maxValue) * 80;
      return `${x},${y}`;
    }).join(' ');

    return (
      <div className="relative h-64 bg-white/5 rounded-2xl p-6">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map(y => (
            <line
              key={y}
              x1="0"
              y1={y}
              x2="100"
              y2={y}
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="0.2"
            />
          ))}
          
          {/* Line */}
          <polyline
            points={points}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Dots */}
          {data.map((d, i) => {
            const x = (i / (data.length - 1)) * 100;
            const y = 100 - (d.incidents / maxValue) * 80;
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="1.5"
                fill="#3b82f6"
              />
            );
          })}
        </svg>
        
        {/* Labels */}
        <div className="absolute bottom-2 left-0 right-0 flex justify-between px-6 text-xs text-white/60">
          {data.map((d, i) => (
            <span key={i}>{(d as any).time || (d as any).day}</span>
          ))}
        </div>
      </div>
    );
  };

  const BarChart = ({ data }: { data: Array<{ incidents: number }> }) => {
    const maxValue = Math.max(...data.map(d => d.incidents));
    
    return (
      <div className="relative h-64 bg-white/5 rounded-2xl p-6">
        <div className="flex items-end justify-between h-48 gap-2">
          {data.map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(d.incidents / maxValue) * 100}%` }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg relative group"
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 px-2 py-1 rounded text-xs text-white whitespace-nowrap">
                  {d.incidents} incidents
                </div>
              </motion.div>
              <span className="text-xs text-white/60">{(d as any).day}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const PieChart = () => {
    let currentAngle = 0;
    const total = incidentTypeData.reduce((sum, d) => sum + d.value, 0);
    
    return (
      <div className="relative h-64 flex items-center justify-center">
        <svg width="200" height="200" viewBox="0 0 200 200" className="transform -rotate-90">
          {incidentTypeData.map((data, i) => {
            const percentage = data.value / total;
            const angle = percentage * 360;
            const largeArcFlag = angle > 180 ? 1 : 0;
            
            const startX = 100 + 80 * Math.cos((currentAngle * Math.PI) / 180);
            const startY = 100 + 80 * Math.sin((currentAngle * Math.PI) / 180);
            const endX = 100 + 80 * Math.cos(((currentAngle + angle) * Math.PI) / 180);
            const endY = 100 + 80 * Math.sin(((currentAngle + angle) * Math.PI) / 180);
            
            const pathData = [
              `M 100 100`,
              `L ${startX} ${startY}`,
              `A 80 80 0 ${largeArcFlag} 1 ${endX} ${endY}`,
              `Z`
            ].join(' ');
            
            currentAngle += angle;
            
            return (
              <motion.path
                key={i}
                d={pathData}
                fill={data.color}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                className="hover:opacity-80 transition-opacity cursor-pointer"
              />
            );
          })}
        </svg>
        
        {/* Legend */}
        <div className="absolute -right-4 top-1/2 -translate-y-1/2 space-y-2">
          {incidentTypeData.map((data, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <div
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: data.color }}
              />
              <span className="text-white/80">{data.name}</span>
              <span className="text-white/60">({data.value}%)</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const HorizontalBarChart = () => {
    const maxTime = Math.max(...responseTimeData.map(d => d.maxTime));
    
    return (
      <div className="space-y-4 bg-white/5 rounded-2xl p-6">
        {responseTimeData.map((data, i) => (
          <div key={i} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-white/80">{data.category}</span>
              <span className="text-white/60">{data.avgTime} min</span>
            </div>
            <div className="h-8 bg-white/5 rounded-lg overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(data.avgTime / maxTime) * 100}%` }}
                transition={{ delay: i * 0.1, duration: 0.8 }}
                className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-lg"
              />
            </div>
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
          <h1 className="text-white mb-2">Analytics Dashboard</h1>
          <p className="text-blue-200">Comprehensive insights into campus security metrics</p>
        </motion.div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="backdrop-blur-xl bg-white/10 border-white/20 rounded-3xl p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-white/60">Total Incidents</p>
                <TrendingDown className="w-4 h-4 text-green-400" />
              </div>
              <p className="text-white text-3xl mb-1">124</p>
              <p className="text-green-400 text-sm">↓ 12% from last week</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="backdrop-blur-xl bg-white/10 border-white/20 rounded-3xl p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-white/60">Avg Response</p>
                <TrendingDown className="w-4 h-4 text-green-400" />
              </div>
              <p className="text-white text-3xl mb-1">4.2m</p>
              <p className="text-green-400 text-sm">↓ 8% improvement</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="backdrop-blur-xl bg-white/10 border-white/20 rounded-3xl p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-white/60">Resolution Rate</p>
                <TrendingUp className="w-4 h-4 text-green-400" />
              </div>
              <p className="text-white text-3xl mb-1">96%</p>
              <p className="text-green-400 text-sm">↑ 4% increase</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="backdrop-blur-xl bg-white/10 border-white/20 rounded-3xl p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-white/60">Active Users</p>
                <Activity className="w-4 h-4 text-blue-400" />
              </div>
              <p className="text-white text-3xl mb-1">3,421</p>
              <p className="text-blue-400 text-sm">Real-time</p>
            </Card>
          </motion.div>
        </div>

        {/* Incident Trends */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <Card className="backdrop-blur-xl bg-white/10 border-white/20 rounded-3xl p-6">
            <h3 className="text-white mb-6">Incident Trends</h3>
            <Tabs defaultValue="2d">
              <TabsList className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-1 mb-6">
                <TabsTrigger value="2d" className="rounded-xl data-[state=active]:bg-blue-500">Last 2 Days</TabsTrigger>
                <TabsTrigger value="5d" className="rounded-xl data-[state=active]:bg-blue-500">Last 5 Days</TabsTrigger>
                <TabsTrigger value="10d" className="rounded-xl data-[state=active]:bg-blue-500">Last 10 Days</TabsTrigger>
              </TabsList>

              <TabsContent value="2d">
                <LineChart data={incidentData2d} />
              </TabsContent>

              <TabsContent value="5d">
                <BarChart data={incidentData5d} />
              </TabsContent>

              <TabsContent value="10d">
                <LineChart data={incidentData10d} />
              </TabsContent>
            </Tabs>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Incident Types */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="backdrop-blur-xl bg-white/10 border-white/20 rounded-3xl p-6">
              <h3 className="text-white mb-6">Incident Types Distribution</h3>
              <PieChart />
            </Card>
          </motion.div>

          {/* Response Time Metrics */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card className="backdrop-blur-xl bg-white/10 border-white/20 rounded-3xl p-6">
              <h3 className="text-white mb-6">Response Time by Priority</h3>
              <HorizontalBarChart />
            </Card>
          </motion.div>
        </div>

        {/* System Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8"
        >
          <Card className="backdrop-blur-xl bg-white/10 border-white/20 rounded-3xl p-6">
            <h3 className="text-white mb-6">System Status Indicators</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {systemStatus.map((system, i) => (
                <div
                  key={i}
                  className="backdrop-blur-xl bg-white/5 rounded-2xl p-4 border border-white/10"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-white">{system.name}</p>
                    <div
                      className={`w-3 h-3 rounded-full ${
                        system.status === 'online'
                          ? 'bg-green-500'
                          : system.status === 'warning'
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      }`}
                    />
                  </div>
                  <p className="text-white/60 text-sm">{system.count}</p>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
