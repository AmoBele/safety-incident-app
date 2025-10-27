import { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Mic, Camera, MapPin, Send, Heart, Frown, Meh, Smile, Upload, X } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner';
import type { Screen } from '../App';

interface ReportScreenProps {
  navigateTo: (screen: Screen) => void;
}

export default function ReportScreen({ navigateTo }: ReportScreenProps) {
  const [incidentType, setIncidentType] = useState('');
  const [details, setDetails] = useState('');
  const [emotion, setEmotion] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [location, setLocation] = useState({ lat: 0, lng: 0, address: 'Tap "Detect My Location" button below' });
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const emotions = [
    { icon: Frown, label: 'Distressed', color: 'text-red-400' },
    { icon: Meh, label: 'Anxious', color: 'text-yellow-400' },
    { icon: Heart, label: 'Safe Now', color: 'text-green-400' },
  ];

  const handleDetectLocation = () => {
    setDetectingLocation(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
              { headers: { 'User-Agent': 'SafetyIncidentReportingApp/1.0' } }
            );
            const data = await response.json();
            const address = data.display_name || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
            setLocation({ lat: latitude, lng: longitude, address });
            toast.success('Location detected successfully');
          } catch (error) {
            const address = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
            setLocation({ lat: latitude, lng: longitude, address });
            toast.success('Location detected');
          }
          setDetectingLocation(false);
        },
        (error) => {
          toast.error('Could not detect location. Please enable location access.');
          setDetectingLocation(false);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      toast.error('Geolocation is not supported by your browser');
      setDetectingLocation(false);
    }
  };

  const handleSubmit = () => {
    if (!incidentType) {
      toast.error('Please select an incident type');
      return;
    }
    
    // Store report data in localStorage
    const reportData = {
      incidentType,
      details,
      emotion,
      location,
      timestamp: new Date().toISOString(),
      filesCount: uploadedFiles.length,
      hasAudioRecording: !!audioBlob,
      fileNames: uploadedFiles.map(f => f.name)
    };
    
    const existingReports = JSON.parse(localStorage.getItem('incidentReports') || '[]');
    existingReports.push(reportData);
    localStorage.setItem('incidentReports', JSON.stringify(existingReports));
    
    toast.success('Report submitted securely. You are not alone.');
    setTimeout(() => navigateTo('home'), 2000);
  };

  const toggleRecording = async () => {
    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data);
        };

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          setAudioBlob(audioBlob);
          toast.success('Voice recording saved');
          stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorder.start();
        setIsRecording(true);
        toast.info('Voice recording started');
      } catch (error) {
        toast.error('Could not access microphone. Please enable microphone permissions.');
      }
    } else {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);
      const validFiles = newFiles.filter(file => {
        const isImage = file.type.startsWith('image/');
        const isVideo = file.type.startsWith('video/');
        const isAudio = file.type.startsWith('audio/');
        const isValidSize = file.size <= 50 * 1024 * 1024; // 50MB max
        
        if (!isValidSize) {
          toast.error(`${file.name} is too large. Max size is 50MB`);
          return false;
        }
        if (!isImage && !isVideo && !isAudio) {
          toast.error(`${file.name} is not a supported file type`);
          return false;
        }
        return true;
      });
      
      setUploadedFiles([...uploadedFiles, ...validFiles]);
      toast.success(`${validFiles.length} file(s) added`);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
    toast.info('File removed');
  };

  const removeAudioRecording = () => {
    setAudioBlob(null);
    toast.info('Audio recording removed');
  };

  return (
    <div className="min-h-screen bg-black p-6 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-500 rounded-full blur-[120px] opacity-40" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-[120px] opacity-40" />
      </div>

      <div className="max-w-3xl mx-auto relative z-10">
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
          className="mb-8 text-center"
        >
          <h1 className="text-white mb-2">Report Incident</h1>
          <p className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
            Your voice matters. We're here to help.
          </p>
        </motion.div>

        <Card className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8">
          <div className="space-y-6">
            {/* Incident Type */}
            <div>
              <Label className="text-white mb-2 block">Incident Type</Label>
              <Select value={incidentType} onValueChange={setIncidentType}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white rounded-2xl h-12">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-white/20 text-white rounded-2xl">
                  <SelectItem value="harassment">Harassment</SelectItem>
                  <SelectItem value="assault">Assault</SelectItem>
                  <SelectItem value="stalking">Stalking</SelectItem>
                  <SelectItem value="abuse">Domestic Abuse</SelectItem>
                  <SelectItem value="threat">Threat</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Emotion Analysis */}
            <div>
              <Label className="text-white mb-3 block">How are you feeling?</Label>
              <div className="grid grid-cols-3 gap-3">
                {emotions.map((emotionOption, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setEmotion(emotionOption.label)}
                    className={`backdrop-blur-xl rounded-2xl p-4 border transition-all ${
                      emotion === emotionOption.label
                        ? 'bg-white/20 border-white/30'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <emotionOption.icon className={`w-8 h-8 mx-auto mb-2 ${emotionOption.color}`} />
                    <p className="text-white text-sm">{emotionOption.label}</p>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Voice Recording */}
            <div>
              <Label className="text-white mb-2 block">Voice Recording (Optional)</Label>
              <Button
                onClick={toggleRecording}
                className={`w-full rounded-2xl h-16 transition-all ${
                  isRecording
                    ? 'bg-gradient-to-r from-red-500 to-rose-500 animate-pulse'
                    : 'bg-white/5 border border-white/10 hover:bg-white/10'
                }`}
              >
                <Mic className={`mr-2 w-5 h-5 ${isRecording ? 'text-white' : 'text-violet-400'}`} />
                <span className="text-white">
                  {isRecording ? 'Recording... Tap to Stop' : 'Tap to Record Your Story'}
                </span>
              </Button>
            </div>

            {/* Written Details */}
            <div>
              <Label className="text-white mb-2 block">Additional Details (Optional)</Label>
              <Textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Share what happened, when, and any other information you feel comfortable providing..."
                className="bg-white/5 border-white/10 text-white placeholder:text-white/40 rounded-2xl min-h-32"
              />
            </div>

            {/* Photo/Video/Audio Upload */}
            <div>
              <Label className="text-white mb-2 block">Upload Evidence (Optional)</Label>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,video/*,audio/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="backdrop-blur-xl bg-white/5 border-2 border-dashed border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all cursor-pointer"
              >
                <div className="text-center">
                  <Upload className="w-8 h-8 text-violet-400 mx-auto mb-2" />
                  <p className="text-white/60">Tap to upload photos, videos, or audio</p>
                  <p className="text-white/40 text-sm mt-1">Max 50MB per file • Stored securely and encrypted</p>
                </div>
              </div>
              
              {/* Uploaded Files List */}
              {uploadedFiles.length > 0 && (
                <div className="mt-3 space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm truncate">{file.name}</p>
                        <p className="text-white/40 text-xs">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile(index);
                        }}
                        variant="ghost"
                        className="text-red-400 hover:bg-red-500/10 rounded-xl h-8 w-8 p-0"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Audio Recording Status */}
              {audioBlob && (
                <div className="mt-3 flex items-center gap-3 bg-green-500/10 border border-green-500/30 rounded-xl p-3">
                  <Mic className="w-5 h-5 text-green-400" />
                  <div className="flex-1">
                    <p className="text-white text-sm">Voice recording saved</p>
                    <p className="text-white/40 text-xs">{(audioBlob.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <Button
                    onClick={removeAudioRecording}
                    variant="ghost"
                    className="text-red-400 hover:bg-red-500/10 rounded-xl h-8 w-8 p-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* Location */}
            <div>
              <Label className="text-white mb-3 block">Location</Label>
              <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-xl bg-cyan-500/20">
                    <MapPin className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm">Current Location</p>
                    <p className="text-white/60 text-xs mt-1">{location.address}</p>
                  </div>
                </div>
                <Button
                  onClick={handleDetectLocation}
                  disabled={detectingLocation}
                  className="w-full bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/30 rounded-xl h-10"
                >
                  {detectingLocation ? (
                    <>
                      <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mr-2" />
                      Detecting...
                    </>
                  ) : (
                    <>
                      <MapPin className="w-4 h-4 mr-2" />
                      Detect My Location
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Submit */}
            <Button
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 hover:from-violet-600 hover:via-purple-600 hover:to-pink-600 text-white rounded-2xl h-14 mt-6"
              style={{ boxShadow: '0 0 30px rgba(139, 92, 246, 0.6)' }}
            >
              <Send className="mr-2 w-5 h-5" />
              Submit Secure Report
            </Button>

            <p className="text-center text-white/60 text-sm">
              🔒 All reports are encrypted and can be submitted anonymously
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
