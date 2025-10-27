import { useState, useEffect } from 'react';
import LoginScreen from './components/LoginScreen';
import HomeDashboard from './components/HomeDashboard';
import AICompanionMode from './components/AICompanionMode';
import ReportScreen from './components/ReportScreen';
import PanicActivation from './components/PanicActivation';
import CommunityHub from './components/CommunityHub';
import HealingHub from './components/HealingHub';
import AnalyticsView from './components/AnalyticsView';
import EvidenceVault from './components/EvidenceVault';
import FloatingPanicButton from './components/FloatingPanicButton';
import { Toaster } from './components/ui/sonner';

export type Screen = 'login' | 'home' | 'companion' | 'report' | 'panic' | 'community' | 'healing' | 'analytics' | 'vault';

interface User {
  id: number;
  email: string;
  username: string;
  full_name: string;
  role: string;
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCompanionActive, setIsCompanionActive] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  // Check for existing authentication on app load
  useEffect(() => {
    // Removed auto-login - users must explicitly login each session
    // This ensures they always see the login screen first
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('user');
    
    // Clear any stale session data on app start
    if (token || userData) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
  }, []);

  const handleLogin = (token: string, userData: User) => {
    setAuthToken(token);
    setUser(userData);
    setIsLoggedIn(true);
    setCurrentScreen('home');
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setAuthToken(null);
    setUser(null);
    setIsLoggedIn(false);
    setCurrentScreen('login');
  };

  const navigateTo = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  const toggleCompanion = () => {
    const newState = !isCompanionActive;
    setIsCompanionActive(newState);
    
    // Play activation sound when turning on
    if (newState) {
      // Create a pleasant activation sound using Web Audio API
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Create a rising tone for activation
      oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // A4
      oscillator.frequency.exponentialRampToValueAtTime(880, audioContext.currentTime + 0.2); // A5
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
      
      // Also speak confirmation
      const utterance = new SpeechSynthesisUtterance('Guardian activated');
      utterance.rate = 1.0;
      utterance.pitch = 1.2;
      utterance.volume = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-black">
      {currentScreen === 'home' && (
        <HomeDashboard 
          navigateTo={navigateTo} 
          toggleCompanion={toggleCompanion} 
          isCompanionActive={isCompanionActive}
          authToken={authToken}
          user={user}
          onLogout={handleLogout}
        />
      )}
      {currentScreen === 'companion' && <AICompanionMode navigateTo={navigateTo} />}
      {currentScreen === 'report' && <ReportScreen navigateTo={navigateTo} />}
      {currentScreen === 'panic' && <PanicActivation navigateTo={navigateTo} />}
      {currentScreen === 'community' && <CommunityHub navigateTo={navigateTo} />}
      {currentScreen === 'healing' && <HealingHub navigateTo={navigateTo} />}
      {currentScreen === 'analytics' && <AnalyticsView navigateTo={navigateTo} />}
      {currentScreen === 'vault' && <EvidenceVault navigateTo={navigateTo} />}
      
      <FloatingPanicButton navigateTo={navigateTo} />
      {isCompanionActive && (
        <div className="fixed top-4 right-4 z-40">
          <div className="relative">
            <div className="absolute inset-0 bg-cyan-500 rounded-full blur-xl opacity-50 animate-pulse" />
            <div className="relative bg-gradient-to-r from-blue-500 via-violet-500 to-cyan-500 rounded-full p-4">
              <div className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-xl flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-cyan-400 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      )}
      <Toaster />
    </div>
  );
}
