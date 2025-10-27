import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, MessageCircle, Wind, Heart, Send, BookOpen, Volume2, VolumeX } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Textarea } from './ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { toast } from 'sonner';
import type { Screen } from '../App';

interface HealingHubProps {
  navigateTo: (screen: Screen) => void;
}

export default function HealingHub({ navigateTo }: HealingHubProps) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Array<{ text: string; isAI: boolean }>>([{
    text: "Hello, I'm here to listen and support you. This is a safe, confidential space. How are you feeling today?",
    isAI: true
  }]);
  const [breathCount, setBreathCount] = useState(0);
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'exhale'>('inhale');
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [likedStories, setLikedStories] = useState<number[]>([]);
  const [selectedStory, setSelectedStory] = useState<number | null>(null);
  const [storyReactions, setStoryReactions] = useState<{[key: number]: {[emoji: string]: number}}>({
    0: { '❤️': 0, '👍': 0, '🔥': 0 }, // ❤️ will show 234 (base) + reactions
    1: { '❤️': 0, '👍': 0, '🔥': 0 }, // ❤️ will show 456 (base) + reactions
    2: { '❤️': 0, '👍': 0, '🔥': 0 }, // ❤️ will show 189 (base) + reactions
  });
  const [userReactions, setUserReactions] = useState<{[key: number]: string | null}>({});
  const [showShareStory, setShowShareStory] = useState(false);
  const [newStory, setNewStory] = useState({ author: '', category: '', story: '' });
  const [showResourceModal, setShowResourceModal] = useState<'crisis' | 'counselor' | 'selfcare' | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Speak the welcome message when component mounts
  useEffect(() => {
    if (voiceEnabled) {
      speakText("Hello, I'm here to listen and support you. This is a safe, confidential space. How are you feeling today?");
    }
  }, []);

  // Text-to-speech function with smooth female voice
  const speakText = (text: string) => {
    if (!voiceEnabled) return;
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Configure voice settings for a smooth, warm, empathetic female tone
    utterance.rate = 0.85; // Slower for calm, soothing therapeutic tone
    utterance.pitch = 1.1; // Slightly higher pitch for feminine voice
    utterance.volume = 1.0; // Full volume
    
    // Load voices and select the best female voice
    const setVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      
      // Priority list of high-quality female voices
      const preferredVoiceNames = [
        'Google UK English Female',
        'Google US English Female',
        'Microsoft Zira',
        'Microsoft Aria',
        'Samantha',
        'Victoria',
        'Karen',
        'Moira',
        'Fiona',
        'female',
        'woman'
      ];
      
      // Try to find a preferred voice
      let selectedVoice: SpeechSynthesisVoice | undefined = undefined;
      for (const voiceName of preferredVoiceNames) {
        selectedVoice = voices.find(voice => 
          voice.name.toLowerCase().includes(voiceName.toLowerCase())
        );
        if (selectedVoice) break;
      }
      
      // Fallback: any English female voice
      if (!selectedVoice) {
        selectedVoice = voices.find(voice => 
          voice.lang.startsWith('en') && 
          voice.name.toLowerCase().includes('female')
        );
      }
      
      // Final fallback: first English voice
      if (!selectedVoice) {
        selectedVoice = voices.find(voice => voice.lang.startsWith('en'));
      }
      
      if (selectedVoice) {
        utterance.voice = selectedVoice;
        console.log('Using voice:', selectedVoice.name);
      }
    };
    
    // Set voice immediately if available
    setVoice();
    
    // Also set voice when voices are loaded (for Chrome)
    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = () => {
        setVoice();
      };
    }
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    // Small delay to ensure voice is loaded
    setTimeout(() => {
      window.speechSynthesis.speak(utterance);
    }, 100);
  };

  const toggleVoice = () => {
    const newState = !voiceEnabled;
    setVoiceEnabled(newState);
    
    if (!newState) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      toast.success('Voice disabled');
    } else {
      toast.success('Voice enabled');
    }
  };

  // AI response templates
  const getAIResponse = (userMessage: string): string => {
    const msg = userMessage.toLowerCase();
    
    // Empathetic responses based on keywords
    if (msg.includes('sad') || msg.includes('depressed') || msg.includes('down')) {
      return "I hear that you're going through a difficult time. Sadness is a valid emotion, and it's okay to feel this way. Would you like to talk about what's making you feel sad? Remember, you're not alone in this.";
    }
    if (msg.includes('scared') || msg.includes('afraid') || msg.includes('fear')) {
      return "It's completely understandable to feel scared. Fear is our mind's way of trying to protect us. You're safe here, and your feelings are valid. Can you tell me more about what's making you feel this way?";
    }
    if (msg.includes('anxious') || msg.includes('anxiety') || msg.includes('worried')) {
      return "Anxiety can be overwhelming, but you're taking a positive step by talking about it. Try taking a few deep breaths with me. Would you like to try our breathing exercise to help calm your mind?";
    }
    if (msg.includes('angry') || msg.includes('mad') || msg.includes('frustrated')) {
      return "Anger is a natural response to feeling hurt or violated. It's okay to feel angry. What matters is how we process these feelings in a healthy way. I'm here to help you work through this.";
    }
    if (msg.includes('help') || msg.includes('don\'t know') || msg.includes('lost')) {
      return "Asking for help is a sign of strength, not weakness. I'm here to support you. We can take this one step at a time. What would be most helpful for you right now?";
    }
    if (msg.includes('thank') || msg.includes('appreciate')) {
      return "You're very welcome. Remember, healing is a journey, and every step forward matters. I'm proud of you for being here and taking care of yourself. How else can I support you today?";
    }
    if (msg.includes('better') || msg.includes('good') || msg.includes('happy') || msg.includes('great')) {
      return "That's wonderful to hear! Celebrating these positive moments is important. You deserve to feel good. What helped you feel better?";
    }
    if (msg.includes('alone') || msg.includes('lonely') || msg.includes('isolated')) {
      return "Feeling alone can be incredibly painful. But I want you to know that you're not truly alone. I'm here with you, and there are people who care about you. Would you like to talk about what's making you feel this way?";
    }
    
    // Default empathetic responses
    const defaultResponses = [
      "Thank you for sharing that with me. Your feelings are completely valid. Would you like to tell me more?",
      "I'm listening. It takes courage to open up about what you're experiencing. Take all the time you need.",
      "What you're feeling matters. I'm here to support you through this. How can I help you today?",
      "That sounds really challenging. You're not alone in feeling this way. Many people have similar experiences, and healing is possible.",
      "I appreciate you trusting me with your thoughts. Remember, this is a judgment-free space. What's on your mind?"
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const handleSendMessage = () => {
    if (!message.trim()) {
      toast.error('Please type a message');
      return;
    }

    // Add user message
    const userMsg = { text: message, isAI: false };
    setMessages([...messages, userMsg]);
    setMessage('');
    setIsTyping(true);

    // Simulate AI typing and response
    setTimeout(() => {
      const aiResponse = getAIResponse(message);
      setMessages(prev => [...prev, { text: aiResponse, isAI: true }]);
      setIsTyping(false);
      
      // Speak the AI response
      speakText(aiResponse);
    }, 1500 + Math.random() * 1000); // Random delay between 1.5-2.5 seconds
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const stories = [
    {
      author: 'Anonymous',
      preview: "It's been 6 months since I left. Today, I smiled genuinely for the first time...",
      fullStory: "It's been 6 months since I left. Today, I smiled genuinely for the first time. Not a forced smile, not a polite smile, but a real, heartfelt smile.\n\nSix months ago, I didn't think I would survive. I was trapped in a nightmare, believing the lies that I deserved the pain, that no one would believe me, that I had nowhere to go.\n\nBut I found the courage to leave. It wasn't easy. There were nights I cried myself to sleep, days I wanted to give up. But slowly, with the help of therapy, support groups, and this amazing community, I started to heal.\n\nToday, I look in the mirror and see someone strong. Someone who fought for their life and won. If you're reading this and you're still in the darkness, please know: there is light on the other side. You deserve happiness, safety, and love.\n\nYou are stronger than you know. ❤️",
      category: 'Recovery',
      likes: 234,
    },
    {
      author: 'Sarah M.',
      preview: 'To anyone reading this: You are stronger than you know. My journey from victim to survivor...',
      fullStory: "To anyone reading this: You are stronger than you know. My journey from victim to survivor has been the hardest thing I've ever done, but also the most rewarding.\n\nFor years, I believed I was broken. I thought the abuse had shattered me beyond repair. But through therapy, I learned something powerful: I wasn't broken. I was wounded, yes, but wounds can heal.\n\nI started small. I joined a support group. I spoke my truth. I allowed myself to feel anger, grief, and eventually, hope. I learned that healing isn't linear - some days are harder than others, and that's okay.\n\nToday, I'm not just surviving. I'm thriving. I have a job I love, friends who support me, and most importantly, I have myself back. I know my worth now.\n\nTo anyone still struggling: Your story isn't over. The person who hurt you doesn't get to write your ending. You do. And I promise you, it can be beautiful. 💜",
      category: 'Inspiration',
      likes: 456,
    },
    {
      author: 'Anonymous',
      preview: 'I want to share what helped me heal. Community, therapy, and believing in myself again...',
      fullStory: "I want to share what helped me heal. Community, therapy, and believing in myself again.\n\nAfter I left my abuser, I felt completely lost. I didn't know who I was anymore. The person I had been before the abuse felt like a distant memory, and the person I had become during the abuse was someone I didn't recognize.\n\nHere's what helped me find my way back:\n\n1. **Therapy**: Finding the right therapist changed everything. They helped me understand that what happened wasn't my fault.\n\n2. **Community**: Connecting with other survivors showed me I wasn't alone. Sharing our stories gave me strength.\n\n3. **Self-compassion**: I learned to be gentle with myself. Healing takes time, and that's okay.\n\n4. **Rediscovering joy**: I started doing things I loved again - painting, reading, dancing. Slowly, I remembered who I was.\n\nI'm not 'fixed' and I never will be - because I was never broken. I'm healing, growing, and becoming someone even stronger than before. If you're on this journey too, know that hope is real. 🌟",
      category: 'Hope',
      likes: 189,
    },
  ];

  const aiResponses = [
    "I'm here to listen. You're safe here.",
    "Your feelings are valid. Take all the time you need.",
    "You've taken a brave step by reaching out.",
  ];

  // Breathing cycle effect
  useEffect(() => {
    if (!isBreathing) return;

    const breathCycle = setInterval(() => {
      setBreathPhase(prev => prev === 'inhale' ? 'exhale' : 'inhale');
    }, 4000); // Switch every 4 seconds (4s inhale, 4s exhale)

    return () => clearInterval(breathCycle);
  }, [isBreathing]);

  const startBreathing = () => {
    setIsBreathing(true);
    setBreathPhase('inhale');
    setTimeout(() => {
      setIsBreathing(false);
      setBreathCount(breathCount + 1);
    }, 32000); // 4 cycles of 8 seconds (4s inhale + 4s exhale)
  };

  const toggleLike = (index: number) => {
    if (likedStories.includes(index)) {
      setLikedStories(likedStories.filter(i => i !== index));
      toast.success('Like removed');
    } else {
      setLikedStories([...likedStories, index]);
      toast.success('Story liked! ❤️');
    }
  };

  const openStory = (index: number) => {
    setSelectedStory(index);
  };

  const closeStory = () => {
    setSelectedStory(null);
  };

  const addReaction = (storyIndex: number, emoji: string) => {
    const currentReaction = userReactions[storyIndex];
    
    // Remove old reaction if exists
    if (currentReaction) {
      setStoryReactions(prev => ({
        ...prev,
        [storyIndex]: {
          ...prev[storyIndex],
          [currentReaction]: Math.max(0, prev[storyIndex][currentReaction] - 1)
        }
      }));
    }
    
    // Add new reaction
    if (currentReaction !== emoji) {
      setStoryReactions(prev => ({
        ...prev,
        [storyIndex]: {
          ...prev[storyIndex],
          [emoji]: prev[storyIndex][emoji] + 1
        }
      }));
      setUserReactions(prev => ({ ...prev, [storyIndex]: emoji }));
      toast.success(`Reacted with ${emoji}`);
    } else {
      // Remove reaction if clicking same emoji
      setUserReactions(prev => ({ ...prev, [storyIndex]: null }));
    }
  };

  const submitStory = () => {
    if (!newStory.author.trim() || !newStory.category.trim() || !newStory.story.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    
    toast.success('✨ Your story has been submitted! It will be reviewed and shared with the community soon.');
    setNewStory({ author: '', category: '', story: '' });
    setShowShareStory(false);
  };

  return (
    <div className="min-h-screen bg-black p-6 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-96 h-96 bg-pink-500 rounded-full blur-[120px] opacity-40" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-violet-500 rounded-full blur-[120px] opacity-40" />
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
          className="mb-8 text-center"
        >
          <h1 className="text-white mb-2">Healing Hub</h1>
          <p className="bg-gradient-to-r from-pink-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
            Your journey to healing starts here
          </p>
        </motion.div>

        <Tabs defaultValue="ai-therapist" className="space-y-6">
          <TabsList className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-2">
            <TabsTrigger 
              value="ai-therapist" 
              className="rounded-xl text-white font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=inactive]:text-white/70 data-[state=inactive]:hover:text-white data-[state=inactive]:hover:bg-white/10 transition-all px-6 py-3"
            >
              AI Therapist
            </TabsTrigger>
            <TabsTrigger 
              value="breathing" 
              className="rounded-xl text-white font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=inactive]:text-white/70 data-[state=inactive]:hover:text-white data-[state=inactive]:hover:bg-white/10 transition-all px-6 py-3"
            >
              Breathing Guide
            </TabsTrigger>
            <TabsTrigger 
              value="stories" 
              className="rounded-xl text-white font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=inactive]:text-white/70 data-[state=inactive]:hover:text-white data-[state=inactive]:hover:bg-white/10 transition-all px-6 py-3"
            >
              Survivor Stories
            </TabsTrigger>
          </TabsList>

          {/* AI Therapist */}
          <TabsContent value="ai-therapist">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6 h-[500px] flex flex-col">
                  {/* Voice Toggle Button */}
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-white font-semibold">AI Therapist</h3>
                    <Button
                      onClick={toggleVoice}
                      variant="ghost"
                      className={`rounded-xl transition-all ${
                        voiceEnabled 
                          ? 'text-violet-400 hover:bg-violet-500/10' 
                          : 'text-white/40 hover:bg-white/5'
                      }`}
                    >
                      {voiceEnabled ? (
                        <>
                          <Volume2 className="w-5 h-5 mr-2" />
                          <span className="text-sm">Voice On</span>
                          {isSpeaking && (
                            <div className="ml-2 flex gap-0.5">
                              <div className="w-1 h-3 bg-violet-400 rounded-full animate-pulse" />
                              <div className="w-1 h-4 bg-violet-400 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }} />
                              <div className="w-1 h-3 bg-violet-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                            </div>
                          )}
                        </>
                      ) : (
                        <>
                          <VolumeX className="w-5 h-5 mr-2" />
                          <span className="text-sm">Voice Off</span>
                        </>
                      )}
                    </Button>
                  </div>
                  
                  <div className="flex-1 space-y-4 overflow-y-auto mb-4 px-2">
                    {messages.map((msg, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: msg.isAI ? -20 : 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className={`flex gap-3 ${msg.isAI ? '' : 'justify-end'}`}
                      >
                        {msg.isAI && (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                            <Heart className="w-5 h-5 text-white" />
                          </div>
                        )}
                        <div className={`backdrop-blur-xl rounded-2xl p-4 max-w-md ${
                          msg.isAI 
                            ? 'bg-white/10 rounded-tl-none' 
                            : 'bg-gradient-to-r from-violet-500/30 to-purple-500/30 rounded-tr-none'
                        }`}>
                          <p className="text-white">{msg.text}</p>
                        </div>
                        {!msg.isAI && (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                            <MessageCircle className="w-5 h-5 text-white" />
                          </div>
                        )}
                      </motion.div>
                    ))}
                    {isTyping && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex gap-3"
                      >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                          <Heart className="w-5 h-5 text-white" />
                        </div>
                        <div className="backdrop-blur-xl bg-white/10 rounded-2xl rounded-tl-none p-4">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                          </div>
                        </div>
                      </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  <div className="flex gap-3">
                    <Textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Share what's on your mind... everything here is confidential"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/40 rounded-2xl resize-none"
                      rows={3}
                    />
                    <Button 
                      onClick={handleSendMessage}
                      className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white rounded-2xl px-6"
                    >
                      <Send className="w-5 h-5" />
                    </Button>
                  </div>
                </Card>
              </div>

              <div className="space-y-4">
                <Card className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6">
                  <h3 className="text-white mb-4">Quick Resources</h3>
                  <div className="space-y-3">
                    <Button 
                      onClick={() => setShowResourceModal('crisis')}
                      className="w-full bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-2xl justify-start"
                    >
                      <Heart className="mr-2 w-4 h-4 text-pink-400" />
                      Crisis Support
                    </Button>
                    <Button 
                      onClick={() => setShowResourceModal('counselor')}
                      className="w-full bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-2xl justify-start"
                    >
                      <MessageCircle className="mr-2 w-4 h-4 text-violet-400" />
                      Find a Counselor
                    </Button>
                    <Button 
                      onClick={() => setShowResourceModal('selfcare')}
                      className="w-full bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-2xl justify-start"
                    >
                      <BookOpen className="mr-2 w-4 h-4 text-cyan-400" />
                      Self-Care Guide
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Breathing Guide */}
          <TabsContent value="breathing">
            <Card className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-12">
              <div className="text-center max-w-2xl mx-auto">
                <motion.div
                  animate={isBreathing ? {
                    scale: breathPhase === 'inhale' ? 1.5 : 1,
                  } : { scale: 1 }}
                  transition={{ duration: 4, ease: 'easeInOut' }}
                  className="mb-8"
                >
                  <div className="relative inline-block">
                    <motion.div
                      animate={{
                        opacity: [0.3, 0.6, 0.3],
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full blur-3xl"
                    />
                    <div className="relative bg-gradient-to-br from-cyan-500 to-blue-500 p-16 rounded-full">
                      <Wind className="w-24 h-24 text-white" />
                    </div>
                  </div>
                </motion.div>

                <h2 className="text-white mb-4">
                  {isBreathing ? (
                    <motion.span
                      key={breathPhase}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="text-2xl font-bold mb-2">
                        {breathPhase === 'inhale' ? 'Inhale...' : 'Exhale...'}
                      </div>
                      <div className="text-lg">(4 seconds)</div>
                    </motion.span>
                  ) : (
                    'Guided Breathing Exercise'
                  )}
                </h2>

                <p className="text-white/60 mb-8">
                  {isBreathing
                    ? (
                      <>
                        <span className="block mb-2">Inhale as the circle grows</span>
                        <span className="block mb-2">Exhale as the circle shrinks</span>
                        <span className="block font-medium text-white">Stay calm. You're safe.</span>
                      </>
                    )
                    : 'Take a moment to center yourself with calming breathwork'}
                </p>

                {!isBreathing && (
                  <Button
                    onClick={startBreathing}
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-2xl h-14 px-8"
                  >
                    <Wind className="mr-2 w-5 h-5" />
                    Start Breathing Exercise
                  </Button>
                )}

                {breathCount > 0 && !isBreathing && (
                  <p className="text-white/60 mt-6">
                    Sessions completed today: {breathCount}
                  </p>
                )}
              </div>
            </Card>
          </TabsContent>

          {/* Survivor Stories */}
          <TabsContent value="stories" className="space-y-4">
            {/* Share Your Story Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Button
                onClick={() => setShowShareStory(!showShareStory)}
                className="w-full bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white rounded-2xl h-14"
              >
                <BookOpen className="mr-2 w-5 h-5" />
                Share Your Story
              </Button>
            </motion.div>

            {/* Share Story Form */}
            {showShareStory && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Card className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6">
                  <h3 className="text-white font-bold text-xl mb-4">Share Your Healing Journey</h3>
                  <p className="text-white/60 mb-6">Your story can inspire and give hope to others. You can choose to remain anonymous.</p>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-white text-sm mb-2 block">Your Name (or "Anonymous")</label>
                      <input
                        type="text"
                        value={newStory.author}
                        onChange={(e) => setNewStory({ ...newStory, author: e.target.value })}
                        placeholder="Anonymous"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-pink-500/50"
                      />
                    </div>
                    
                    <div>
                      <label className="text-white text-sm mb-2 block">Category</label>
                      <select
                        value={newStory.category}
                        onChange={(e) => setNewStory({ ...newStory, category: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500/50"
                      >
                        <option value="" className="bg-slate-900">Select a category...</option>
                        <option value="Recovery" className="bg-slate-900">Recovery</option>
                        <option value="Inspiration" className="bg-slate-900">Inspiration</option>
                        <option value="Hope" className="bg-slate-900">Hope</option>
                        <option value="Healing" className="bg-slate-900">Healing</option>
                        <option value="Strength" className="bg-slate-900">Strength</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="text-white text-sm mb-2 block">Your Story</label>
                      <Textarea
                        value={newStory.story}
                        onChange={(e) => setNewStory({ ...newStory, story: e.target.value })}
                        placeholder="Share your journey, what helped you heal, or a message of hope for others..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-pink-500/50 min-h-[200px]"
                      />
                    </div>
                    
                    <div className="flex gap-3">
                      <Button
                        onClick={submitStory}
                        className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-2xl"
                      >
                        Submit Story
                      </Button>
                      <Button
                        onClick={() => setShowShareStory(false)}
                        className="flex-1 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Existing Stories */}
            {stories.map((story, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-semibold">{story.author}</p>
                        <p className="text-white/60 text-sm">{story.category}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleLike(i)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/10 transition-all"
                    >
                      <Heart 
                        className={`w-5 h-5 transition-all ${
                          likedStories.includes(i) 
                            ? 'text-pink-500 fill-pink-500' 
                            : 'text-pink-400'
                        }`} 
                      />
                      <span className="text-white/80 text-sm font-medium">
                        {story.likes + (likedStories.includes(i) ? 1 : 0)}
                      </span>
                    </button>
                  </div>
                  <p className="text-white/80 italic mb-4">"{story.preview}"</p>
                  <Button 
                    onClick={() => openStory(i)}
                    className="w-full bg-gradient-to-r from-pink-500/20 to-rose-500/20 hover:from-pink-500/30 hover:to-rose-500/30 text-white border border-pink-500/30 rounded-2xl"
                  >
                    Read Full Story
                  </Button>
                </Card>
              </motion.div>
            ))}
          </TabsContent>
        </Tabs>
      </div>

      {/* Full Story Modal */}
      {selectedStory !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/95 backdrop-blur-xl z-50 flex items-center justify-center p-6 overflow-y-auto"
          onClick={closeStory}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900/95 backdrop-blur-2xl border border-white/30 rounded-3xl p-8 w-full max-w-xl my-8 shadow-2xl"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">{stories[selectedStory].author}</h3>
                  <p className="text-white/60 text-sm">{stories[selectedStory].category}</p>
                </div>
              </div>
              <button
                onClick={closeStory}
                className="text-white/60 hover:text-white transition-colors text-xl w-8 h-8 flex items-center justify-center flex-shrink-0"
              >
                ✕
              </button>
            </div>
            
            {/* Story content with strong blur background */}
            <div className="max-w-none bg-black/60 backdrop-blur-xl rounded-2xl p-8 mb-6 max-h-[55vh] overflow-y-auto border border-white/10">
              {stories[selectedStory].fullStory.split('\n\n').map((paragraph, idx) => (
                <p key={idx} className="text-white text-base mb-4 leading-relaxed font-normal">
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-white/10">
              {/* Emoji Reactions */}
              <div className="mb-4">
                <p className="text-white/60 text-xs mb-2">React to this story:</p>
                <div className="flex gap-2 flex-wrap">
                  {['❤️', '👍', '🔥'].map(emoji => {
                    // Calculate total count - for ❤️ include the base likes
                    const baseCount = emoji === '❤️' ? stories[selectedStory].likes : 0;
                    const reactionCount = storyReactions[selectedStory]?.[emoji] || 0;
                    const totalCount = baseCount + reactionCount;
                    
                    return (
                      <button
                        key={emoji}
                        onClick={() => addReaction(selectedStory, emoji)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all text-sm ${
                          userReactions[selectedStory] === emoji
                            ? 'bg-pink-500/30 border-2 border-pink-500'
                            : 'bg-white/5 hover:bg-white/10 border-2 border-transparent'
                        }`}
                      >
                        <span className="text-xl">{emoji}</span>
                        <span className="text-white font-medium text-sm">
                          {totalCount}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3">
                <Button
                  onClick={closeStory}
                  className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-xl px-6 h-9 text-sm"
                >
                  Close
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Resource Modals */}
      {showResourceModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/95 backdrop-blur-xl z-50 flex items-center justify-center p-6 overflow-y-auto"
          onClick={() => setShowResourceModal(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-gray-800 rounded-3xl p-6 w-full max-w-md shadow-2xl"
          >
            {/* Crisis Support Modal */}
            {showResourceModal === 'crisis' && (
              <>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
                      <Heart className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-white font-bold text-lg">Crisis Support</h3>
                  </div>
                  <button onClick={() => setShowResourceModal(null)} className="text-white/60 hover:text-white text-lg">✕</button>
                </div>
                
                <div className="space-y-3">
                  <p className="text-white text-sm leading-relaxed">
                    <strong className="text-pink-400">You are not alone.</strong> If you're in immediate danger or need urgent support:
                  </p>
                  
                  <div className="space-y-2">
                    <div className="bg-gray-700 rounded-lg p-3">
                      <p className="text-pink-400 font-bold text-sm mb-1">Emergency Services</p>
                      <p className="text-white text-sm">Call <a href="tel:911" className="underline font-bold">911</a> if you're in danger</p>
                    </div>
                    
                    <div className="bg-gray-700 rounded-lg p-3">
                      <p className="text-violet-400 font-bold text-sm mb-1">Domestic Violence Hotline</p>
                      <p className="text-white text-sm">24/7: <a href="tel:1-800-799-7233" className="underline">1-800-799-SAFE</a></p>
                      <p className="text-white/60 text-xs">Text "START" to 88788</p>
                    </div>
                    
                    <div className="bg-gray-700 rounded-lg p-3">
                      <p className="text-cyan-400 font-bold text-sm mb-1">Crisis Text Line</p>
                      <p className="text-white text-sm">Text "HELLO" to <span className="font-bold">741741</span></p>
                    </div>
                  </div>

                  <p className="text-white/80 text-xs mt-3">
                    💬 Talk to our AI Therapist for immediate support
                  </p>
                </div>
                
                <Button
                  onClick={() => setShowResourceModal(null)}
                  className="w-full mt-4 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-xl h-10"
                >
                  Close
                </Button>
              </>
            )}

            {/* Find a Counselor Modal */}
            {showResourceModal === 'counselor' && (
              <>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                      <MessageCircle className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-white font-bold text-lg">Find a Counselor</h3>
                  </div>
                  <button onClick={() => setShowResourceModal(null)} className="text-white/60 hover:text-white text-lg">✕</button>
                </div>
                
                <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                  <p className="text-white text-sm leading-relaxed">
                    Professional help can make a difference. Here are trusted resources:
                  </p>
                  
                  <div className="space-y-2">
                    <div className="bg-gray-700 rounded-lg p-3">
                      <p className="text-violet-400 font-bold text-sm mb-1">🧠 Trauma Specialists</p>
                      <p className="text-white text-xs mb-1">Find therapists specializing in trauma & PTSD:</p>
                      <ul className="text-white/80 text-xs space-y-0.5 list-disc list-inside">
                        <li>psychologytoday.com/us/therapists</li>
                        <li>goodtherapy.org</li>
                        <li>betterhelp.com (Online)</li>
                      </ul>
                    </div>
                    
                    <div className="bg-gray-700 rounded-lg p-3">
                      <p className="text-pink-400 font-bold text-sm mb-1">💔 DV Advocates</p>
                      <p className="text-white text-xs mb-1">Safety planning & legal support:</p>
                      <ul className="text-white/80 text-xs space-y-0.5 list-disc list-inside">
                        <li>rainn.org - Sexual assault</li>
                        <li>thehotline.org - DV support</li>
                        <li>loveisrespect.org - Teens</li>
                      </ul>
                    </div>
                    
                    <div className="bg-gray-700 rounded-lg p-3">
                      <p className="text-cyan-400 font-bold text-sm mb-1">⚖️ Legal Support</p>
                      <ul className="text-white/80 text-xs space-y-0.5 list-disc list-inside">
                        <li>Contact local legal aid office</li>
                        <li>VictimConnect: 1-855-4-VICTIM</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <Button
                  onClick={() => setShowResourceModal(null)}
                  className="w-full mt-4 bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white rounded-xl h-10"
                >
                  Close
                </Button>
              </>
            )}

            {/* Self-Care Guide Modal */}
            {showResourceModal === 'selfcare' && (
              <>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-white font-bold text-lg">Healing Hub</h3>
                  </div>
                  <button onClick={() => setShowResourceModal(null)} className="text-white/60 hover:text-white text-lg">✕</button>
                </div>
                
                <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                  <div className="bg-gray-700 rounded-lg p-3">
                    <p className="text-white font-bold text-sm mb-2">1. Breathing Exercise</p>
                    <p className="text-white text-xs leading-relaxed">
                      Tap Start Breathing and follow the circle.<br />
                      Inhale as it grows, exhale as it shrinks.<br />
                      Helps calm panic and anxiety.
                    </p>
                  </div>

                  <div className="bg-gray-700 rounded-lg p-3">
                    <p className="text-white font-bold text-sm mb-2">2. Report Incident</p>
                    <p className="text-white text-xs leading-relaxed">
                      Record unsafe events safely.<br />
                      Add notes, photos, or voice clips.<br />
                      Stored securely in your Evidence Vault.
                    </p>
                  </div>

                  <div className="bg-gray-700 rounded-lg p-3">
                    <p className="text-white font-bold text-sm mb-2">3. Survivor Stories</p>
                    <p className="text-white text-xs leading-relaxed">
                      Read and share real stories of healing.<br />
                      React to show support.<br />
                      You're not alone.
                    </p>
                  </div>

                  <div className="bg-gray-700 rounded-lg p-3">
                    <p className="text-white font-bold text-sm mb-2">4. Panic Button</p>
                    <p className="text-white text-xs leading-relaxed">
                      Tap the red shield in emergencies.<br />
                      Alerts trusted contacts with your location.<br />
                      Quick access to help.
                    </p>
                  </div>

                  <div className="bg-gray-700 rounded-lg p-3">
                    <p className="text-white font-bold text-sm mb-2">Daily Care</p>
                    <p className="text-white text-xs leading-relaxed">
                      Start with deep breaths.<br />
                      Check the safety map.<br />
                      Reach out when you need support.
                    </p>
                  </div>

                  <p className="text-white font-medium text-sm text-center mt-4 pt-3 border-t border-gray-600">
                    You are safe. You are healing. You are not alone.
                  </p>
                </div>
                
                <Button
                  onClick={() => setShowResourceModal(null)}
                  className="w-full mt-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-xl h-10"
                >
                  Close
                </Button>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
