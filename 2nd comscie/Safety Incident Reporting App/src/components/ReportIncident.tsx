import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, MapPin, Upload, Send, CheckCircle } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { toast } from 'sonner@2.0.3';
import type { Screen } from '../App';

interface ReportIncidentProps {
  navigateTo: (screen: Screen) => void;
}

export default function ReportIncident({ navigateTo }: ReportIncidentProps) {
  const [incidentType, setIncidentType] = useState('');
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!incidentType || !details) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setSubmitted(true);
    toast.success('Incident reported successfully!');
    
    setTimeout(() => {
      navigateTo('dashboard');
    }, 2000);
  };

  if (submitted) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.8 }}
          className="text-center"
        >
          <motion.div
            animate={{
              boxShadow: [
                '0 0 20px rgba(34, 197, 94, 0.5)',
                '0 0 40px rgba(34, 197, 94, 0.8)',
                '0 0 20px rgba(34, 197, 94, 0.5)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block bg-gradient-to-br from-green-500 to-green-700 p-8 rounded-full mb-6"
          >
            <CheckCircle className="w-20 h-20 text-white" />
          </motion.div>
          <h2 className="text-white mb-2">Report Submitted!</h2>
          <p className="text-blue-200">Security has been notified and will respond shortly.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
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
          <h1 className="text-white mb-2">Report Incident</h1>
          <p className="text-blue-200">Provide details about the incident for immediate response</p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="backdrop-blur-xl bg-white/10 border-white/20 rounded-3xl p-8">
            <div className="space-y-6">
              {/* Incident Type */}
              <div>
                <Label className="text-white mb-2 block">Incident Type *</Label>
                <Select value={incidentType} onValueChange={setIncidentType}>
                  <SelectTrigger className="bg-white/5 border-white/20 text-white rounded-2xl h-12">
                    <SelectValue placeholder="Select incident type" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-white/20 text-white rounded-2xl">
                    <SelectItem value="fire">🔥 Fire Emergency</SelectItem>
                    <SelectItem value="medical">🏥 Medical Emergency</SelectItem>
                    <SelectItem value="theft">🚨 Theft / Robbery</SelectItem>
                    <SelectItem value="suspicious">👁️ Suspicious Activity</SelectItem>
                    <SelectItem value="assault">⚠️ Assault / Violence</SelectItem>
                    <SelectItem value="vandalism">🔨 Vandalism</SelectItem>
                    <SelectItem value="other">📝 Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Details */}
              <div>
                <Label className="text-white mb-2 block">Incident Details *</Label>
                <Textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Describe what happened, when, and any other relevant information..."
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/50 rounded-2xl min-h-32"
                />
              </div>

              {/* Location */}
              <div>
                <Label className="text-white mb-2 block">Location</Label>
                <div className="backdrop-blur-xl bg-white/5 border border-white/20 rounded-2xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-blue-500/20">
                      <MapPin className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-white">Current Location Detected</p>
                      <p className="text-white/60 text-sm">Library Building, Block A - Level 2</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Upload */}
              <div>
                <Label className="text-white mb-2 block">Attach Photo or Video (Optional)</Label>
                <div className="backdrop-blur-xl bg-white/5 border-2 border-dashed border-white/20 rounded-2xl p-8 hover:bg-white/10 transition-all cursor-pointer">
                  <div className="text-center">
                    <Upload className="w-8 h-8 text-white/60 mx-auto mb-2" />
                    <p className="text-white/60">Click to upload or drag and drop</p>
                    <p className="text-white/40 text-sm mt-1">PNG, JPG, MP4 up to 10MB</p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white rounded-2xl h-14 mt-8"
                style={{ boxShadow: '0 0 30px rgba(239, 68, 68, 0.6)' }}
              >
                <Send className="mr-2 w-5 h-5" />
                Submit Report
              </Button>

              <p className="text-white/60 text-sm text-center">
                Your report will be sent immediately to campus security for response
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
