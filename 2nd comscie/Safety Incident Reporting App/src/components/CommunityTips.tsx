import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Send, ThumbsUp, MessageCircle, Eye, Lightbulb, Shield, AlertCircle } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { toast } from 'sonner@2.0.3';
import type { Screen } from '../App';

interface CommunityTipsProps {
  navigateTo: (screen: Screen) => void;
}

interface Tip {
  id: string;
  author: string;
  isAnonymous: boolean;
  content: string;
  time: string;
  likes: number;
  comments: number;
  category: 'safety' | 'alert' | 'tip';
}

export default function CommunityTips({ navigateTo }: CommunityTipsProps) {
  const [newTip, setNewTip] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [tips, setTips] = useState<Tip[]>([
    {
      id: '1',
      author: 'Sarah M.',
      isAnonymous: false,
      content: 'Avoid Parking Lot B after 8 PM - several lights are out and it\'s poorly lit. Security has been notified.',
      time: '2 hours ago',
      likes: 24,
      comments: 5,
      category: 'alert',
    },
    {
      id: '2',
      author: 'Anonymous',
      isAnonymous: true,
      content: 'Always walk in groups when returning to residence halls late at night. Use the buddy system!',
      time: '5 hours ago',
      likes: 42,
      comments: 8,
      category: 'safety',
    },
    {
      id: '3',
      author: 'John D.',
      isAnonymous: false,
      content: 'The new emergency phones near the library are working great. Don\'t hesitate to use them if you feel unsafe.',
      time: '1 day ago',
      likes: 31,
      comments: 3,
      category: 'tip',
    },
    {
      id: '4',
      author: 'Anonymous',
      isAnonymous: true,
      content: 'Noticed suspicious activity near Residence Hall 3 entrance around 10 PM. Stay alert and report anything unusual.',
      time: '1 day ago',
      likes: 18,
      comments: 12,
      category: 'alert',
    },
    {
      id: '5',
      author: 'Mike T.',
      isAnonymous: false,
      content: 'Pro tip: Save the campus security number in your favorites for quick access. Response time is usually under 5 minutes!',
      time: '2 days ago',
      likes: 56,
      comments: 7,
      category: 'tip',
    },
  ]);

  const handlePostTip = () => {
    if (!newTip.trim()) {
      toast.error('Please enter a tip to share');
      return;
    }

    const tip: Tip = {
      id: Date.now().toString(),
      author: isAnonymous ? 'Anonymous' : 'You',
      isAnonymous,
      content: newTip,
      time: 'Just now',
      likes: 0,
      comments: 0,
      category: 'tip',
    };

    setTips([tip, ...tips]);
    setNewTip('');
    toast.success('Tip posted successfully!');
  };

  const handleLike = (tipId: string) => {
    setTips(tips.map(tip => 
      tip.id === tipId ? { ...tip, likes: tip.likes + 1 } : tip
    ));
  };

  const getCategoryIcon = (category: Tip['category']) => {
    switch (category) {
      case 'safety':
        return <Shield className="w-4 h-4" />;
      case 'alert':
        return <AlertCircle className="w-4 h-4" />;
      case 'tip':
        return <Lightbulb className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: Tip['category']) => {
    switch (category) {
      case 'safety':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'alert':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'tip':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    }
  };

  const guides = [
    { title: 'Emergency Contacts', icon: '📞' },
    { title: 'Safe Walking Routes', icon: '🚶' },
    { title: 'Night Safety Guide', icon: '����' },
    { title: 'Personal Safety Tips', icon: '🛡️' },
  ];

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
          <h1 className="text-white mb-2">Community Safety Feed</h1>
          <p className="text-blue-200">Share tips, alerts, and stay informed about campus safety</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-6">
            {/* Post Tip Box */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="backdrop-blur-xl bg-white/10 border-white/20 rounded-3xl p-6">
                <h3 className="text-white mb-4">Share a Safety Tip</h3>
                <Textarea
                  value={newTip}
                  onChange={(e) => setNewTip(e.target.value)}
                  placeholder="Share a safety tip, alert the community about a concern, or post helpful advice..."
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/50 rounded-2xl min-h-24 mb-4"
                />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={isAnonymous}
                      onCheckedChange={setIsAnonymous}
                      className="data-[state=checked]:bg-blue-500"
                    />
                    <Label className="text-white/80">Post anonymously</Label>
                  </div>
                  <Button
                    onClick={handlePostTip}
                    className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white rounded-2xl"
                  >
                    <Send className="mr-2 w-4 h-4" />
                    Post Tip
                  </Button>
                </div>
              </Card>
            </motion.div>

            {/* Tips Feed */}
            <div className="space-y-4">
              {tips.map((tip, i) => (
                <motion.div
                  key={tip.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="backdrop-blur-xl bg-white/10 border-white/20 rounded-3xl p-6 hover:bg-white/15 transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white">
                          {tip.isAnonymous ? '?' : tip.author.charAt(0)}
                        </div>
                        <div>
                          <p className="text-white">{tip.author}</p>
                          <p className="text-white/60 text-sm">{tip.time}</p>
                        </div>
                      </div>
                      <Badge className={`rounded-xl ${getCategoryColor(tip.category)}`}>
                        {getCategoryIcon(tip.category)}
                        <span className="ml-1 capitalize">{tip.category}</span>
                      </Badge>
                    </div>

                    <p className="text-white/90 mb-4">{tip.content}</p>

                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleLike(tip.id)}
                        className="flex items-center gap-2 text-white/60 hover:text-blue-400 transition-colors"
                      >
                        <ThumbsUp className="w-4 h-4" />
                        <span className="text-sm">{tip.likes}</span>
                      </button>
                      <button className="flex items-center gap-2 text-white/60 hover:text-blue-400 transition-colors">
                        <MessageCircle className="w-4 h-4" />
                        <span className="text-sm">{tip.comments}</span>
                      </button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Tips Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="backdrop-blur-xl bg-white/10 border-white/20 rounded-3xl p-6">
                <h3 className="text-white mb-4">Today's Activity</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-blue-400" />
                      <span className="text-white/80">Total Views</span>
                    </div>
                    <span className="text-white">1,234</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-yellow-400" />
                      <span className="text-white/80">Tips Posted</span>
                    </div>
                    <span className="text-white">18</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ThumbsUp className="w-4 h-4 text-green-400" />
                      <span className="text-white/80">Total Likes</span>
                    </div>
                    <span className="text-white">342</span>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Campus Guides */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="backdrop-blur-xl bg-white/10 border-white/20 rounded-3xl p-6">
                <h3 className="text-white mb-4">Campus Safety Guides</h3>
                <div className="space-y-3">
                  {guides.map((guide, i) => (
                    <button
                      key={i}
                      className="w-full backdrop-blur-xl bg-white/5 rounded-2xl p-4 border border-white/10 hover:bg-white/10 transition-all text-left flex items-center gap-3"
                    >
                      <span className="text-2xl">{guide.icon}</span>
                      <span className="text-white">{guide.title}</span>
                    </button>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Trending Topics */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="backdrop-blur-xl bg-white/10 border-white/20 rounded-3xl p-6">
                <h3 className="text-white mb-4">Trending Topics</h3>
                <div className="space-y-2">
                  {['#ParkingLotSafety', '#NightWalking', '#EmergencyContacts', '#CampusSecurity'].map((tag, i) => (
                    <Badge
                      key={i}
                      className="bg-blue-500/20 text-blue-300 border-blue-500/30 rounded-xl mr-2"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
