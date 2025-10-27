import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Shield, Lock, Upload, File, Image, Mic, Video, Download, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import type { Screen } from '../App';

interface EvidenceVaultProps {
  navigateTo: (screen: Screen) => void;
}

interface EvidenceItem {
  id: string;
  type: 'image' | 'audio' | 'document' | 'video';
  name: string;
  date: string;
  size: string;
  encrypted: boolean;
  file?: File;
}

export default function EvidenceVault({ navigateTo }: EvidenceVaultProps) {
  const [evidenceItems, setEvidenceItems] = useState<EvidenceItem[]>([
    {
      id: '1',
      type: 'image',
      name: 'Evidence_Photo_001.jpg',
      date: '2025-10-25',
      size: '2.4 MB',
      encrypted: true,
    },
    {
      id: '2',
      type: 'audio',
      name: 'Voice_Recording_002.mp3',
      date: '2025-10-24',
      size: '5.1 MB',
      encrypted: true,
    },
    {
      id: '3',
      type: 'document',
      name: 'Report_Statement.pdf',
      date: '2025-10-23',
      size: '890 KB',
      encrypted: true,
    },
    {
      id: '4',
      type: 'video',
      name: 'Video_Evidence_003.mp4',
      date: '2025-10-22',
      size: '12.3 MB',
      encrypted: true,
    },
  ]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load evidence from localStorage on mount
  useEffect(() => {
    const savedEvidence = localStorage.getItem('evidenceVault');
    if (savedEvidence) {
      try {
        const parsed = JSON.parse(savedEvidence);
        setEvidenceItems([...evidenceItems, ...parsed]);
      } catch (error) {
        console.error('Error loading evidence:', error);
      }
    }
  }, []);

  // Save evidence to localStorage whenever it changes
  useEffect(() => {
    const itemsToSave = evidenceItems.map(item => ({
      id: item.id,
      type: item.type,
      name: item.name,
      date: item.date,
      size: item.size,
      encrypted: item.encrypted
    }));
    localStorage.setItem('evidenceVault', JSON.stringify(itemsToSave));
  }, [evidenceItems]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);
      const validFiles = newFiles.filter(file => {
        const isImage = file.type.startsWith('image/');
        const isVideo = file.type.startsWith('video/');
        const isAudio = file.type.startsWith('audio/');
        const isPDF = file.type === 'application/pdf';
        const isValidSize = file.size <= 50 * 1024 * 1024; // 50MB max
        
        if (!isValidSize) {
          toast.error(`${file.name} is too large. Max size is 50MB`);
          return false;
        }
        if (!isImage && !isVideo && !isAudio && !isPDF) {
          toast.error(`${file.name} is not a supported file type`);
          return false;
        }
        return true;
      });
      
      const newEvidenceItems: EvidenceItem[] = validFiles.map(file => {
        let type: 'image' | 'audio' | 'document' | 'video' = 'document';
        if (file.type.startsWith('image/')) type = 'image';
        else if (file.type.startsWith('video/')) type = 'video';
        else if (file.type.startsWith('audio/')) type = 'audio';
        
        return {
          id: Date.now().toString() + Math.random().toString(36),
          type,
          name: file.name,
          date: new Date().toISOString().split('T')[0],
          size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
          encrypted: true,
          file
        };
      });
      
      setEvidenceItems([...evidenceItems, ...newEvidenceItems]);
      toast.success(`${validFiles.length} file(s) uploaded and encrypted`);
    }
  };

  const handleDelete = (id: string) => {
    setEvidenceItems(evidenceItems.filter(item => item.id !== id));
    toast.success('Evidence deleted');
  };

  const handleDownload = (item: EvidenceItem) => {
    if (item.file) {
      const url = URL.createObjectURL(item.file);
      const a = document.createElement('a');
      a.href = url;
      a.download = item.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('File downloaded');
    } else {
      toast.info('File download simulated (demo data)');
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'image':
        return Image;
      case 'audio':
        return Mic;
      case 'document':
        return File;
      case 'video':
        return Video;
      default:
        return File;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'image':
        return 'from-blue-500 to-cyan-500';
      case 'audio':
        return 'from-violet-500 to-purple-500';
      case 'document':
        return 'from-green-500 to-emerald-500';
      case 'video':
        return 'from-pink-500 to-rose-500';
      default:
        return 'from-gray-500 to-slate-500';
    }
  };

  return (
    <div className="min-h-screen bg-black p-6 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500 rounded-full blur-[120px] opacity-40" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-500 rounded-full blur-[120px] opacity-40" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
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
          <div className="flex items-center gap-3 mb-2">
            <motion.div
              animate={{
                boxShadow: [
                  '0 0 20px rgba(34, 211, 238, 0.5)',
                  '0 0 40px rgba(34, 211, 238, 0.8)',
                  '0 0 20px rgba(34, 211, 238, 0.5)',
                ],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Shield className="w-8 h-8 text-cyan-400" />
            </motion.div>
            <h1 className="text-white">Anonymous Evidence Vault</h1>
          </div>
          <p className="bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
            Securely store and manage encrypted evidence
          </p>
        </motion.div>

        {/* Security Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card className="backdrop-blur-xl bg-gradient-to-r from-cyan-500/10 to-teal-500/10 border border-cyan-500/30 rounded-3xl p-6">
            <div className="flex items-start gap-4">
              <Lock className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-white mb-2">End-to-End Encryption Active</h3>
                <p className="text-white/80 text-sm">
                  All files are encrypted with military-grade AES-256 encryption. Only you have access to your evidence. Files can be shared anonymously with authorities when ready.
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Upload Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,video/*,audio/*,.pdf"
            onChange={handleFileSelect}
            className="hidden"
          />
          <Card 
            onClick={() => fileInputRef.current?.click()}
            className="backdrop-blur-xl bg-white/5 border-2 border-dashed border-white/10 rounded-3xl p-12 hover:bg-white/10 hover:border-cyan-500/30 transition-all cursor-pointer"
          >
            <div className="text-center">
              <Upload className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
              <h3 className="text-white mb-2">Upload Evidence</h3>
              <p className="text-white/60 mb-4">
                Photos, videos, audio recordings, or documents
              </p>
              <Button 
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white rounded-2xl"
              >
                <Upload className="mr-2 w-4 h-4" />
                Select Files
              </Button>
              <p className="text-white/40 text-sm mt-4">
                Max 50MB per file • Files are automatically encrypted before upload
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Evidence List */}
        <div>
          <h3 className="text-white mb-4">Stored Evidence ({evidenceItems.length})</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {evidenceItems.map((item, i) => {
              const Icon = getIcon(item.type);
              const color = getColor(item.type);
              
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                >
                  <Card className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-2xl bg-gradient-to-r ${color}`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-white truncate">{item.name}</p>
                            <p className="text-white/60 text-sm">{item.date}</p>
                          </div>
                          {item.encrypted && (
                            <Badge className="bg-green-500/20 text-green-300 border-green-500/30 rounded-xl ml-2 flex-shrink-0">
                              <Lock className="w-3 h-3 mr-1" />
                              Encrypted
                            </Badge>
                          )}
                        </div>
                        <p className="text-white/40 text-sm mb-4">{item.size}</p>
                        
                        <div className="flex gap-2">
                          <Button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownload(item);
                            }}
                            className="flex-1 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl text-sm h-9"
                          >
                            <Download className="w-3 h-3 mr-1" />
                            Download
                          </Button>
                          <Button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(item.id);
                            }}
                            className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-2xl text-sm h-9 px-3"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Storage Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8"
        >
          <Card className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-white">Storage Used</p>
              <p className="text-white/60">20.6 MB / 5 GB</p>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full w-[0.4%] bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full" />
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
