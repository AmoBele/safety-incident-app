import { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, ArrowRight, Globe, Mic, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { toast } from 'sonner';

interface LoginScreenProps {
  onLogin: (token: string, user: any) => void;
}

interface User {
  id: number;
  email: string;
  username: string;
  full_name: string;
  role: string;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [isRegister, setIsRegister] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const USE_OFFLINE_MODE = false; // Will use real backend
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (isRegister) {
      if (!formData.fullName.trim()) {
        newErrors.fullName = 'Full name is required';
      }
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email is invalid';
      }
    }

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (isRegister) {
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      if (isRegister) {
        // Registration
        if (USE_OFFLINE_MODE) {
          // Offline mode - save to localStorage
          const users = JSON.parse(localStorage.getItem('users') || '[]');
          
          // Check if username already exists
          if (users.find((u: any) => u.username === formData.username)) {
            throw new Error('Username already exists');
          }
          
          // Check if email already exists
          if (users.find((u: any) => u.email === formData.email)) {
            throw new Error('Email already exists');
          }
          
          // Create new user
          const newUser = {
            id: Date.now(),
            full_name: formData.fullName,
            email: formData.email,
            username: formData.username,
            password: formData.password, // In real app, this would be hashed
            role: 'user'
          };
          
          users.push(newUser);
          localStorage.setItem('users', JSON.stringify(users));
        
        // Success! Account created and saved to database
        toast.success('✅ Registration successful! Your account has been created.', {
          description: 'Please login with your credentials',
          duration: 4000,
        });
        
        // Switch to login mode
        setIsRegister(false);
        
        // Clear form but keep username for convenience
        const savedUsername = formData.username;
        setFormData({ 
          fullName: '', 
          email: '', 
          username: savedUsername, 
          password: '', 
          confirmPassword: '' 
        });
        } else {
          // With backend
          const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              full_name: formData.fullName,
              email: formData.email,
              username: formData.username,
              password: formData.password,
            }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Registration failed');
          }
        
          toast.success('✅ Registration successful! Your account has been created.', {
            description: 'Please login with your credentials',
            duration: 4000,
          });
          
          setIsRegister(false);
          const savedUsername = formData.username;
          setFormData({ 
            fullName: '', 
            email: '', 
            username: savedUsername, 
            password: '', 
            confirmPassword: '' 
          });
        }
      } else {
        // Login
        if (USE_OFFLINE_MODE) {
          // Offline mode - check localStorage
          const users = JSON.parse(localStorage.getItem('users') || '[]');
          const user = users.find((u: any) => 
            u.username === formData.username && u.password === formData.password
          );
          
          if (!user) {
            throw new Error('Invalid username or password');
          }
          
          // Create mock token
          const token = 'offline_token_' + Date.now();
          
          // Store auth data
          localStorage.setItem('authToken', token);
          localStorage.setItem('user', JSON.stringify(user));
          
          toast.success('Login successful!');
          onLogin(token, user);
        } else {
          // With backend
          const formDataLogin = new FormData();
          formDataLogin.append('username', formData.username);
          formDataLogin.append('password', formData.password);

          const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            body: formDataLogin,
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Login failed');
          }

          const tokenData = await response.json();
          
          // Get user info
          const userResponse = await fetch(`${API_BASE_URL}/auth/me`, {
            headers: {
              'Authorization': `Bearer ${tokenData.access_token}`,
            },
          });

          if (!userResponse.ok) {
            throw new Error('Failed to get user information');
          }

          const user = await userResponse.json();
          
          // Store token in localStorage
          localStorage.setItem('authToken', tokenData.access_token);
          localStorage.setItem('user', JSON.stringify(user));
          
          toast.success('Login successful!');
          onLogin(tokenData.access_token, user);
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast.error(error instanceof Error ? error.message : 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoMode = () => {
    const demoUser = {
      id: 1,
      email: 'demo@safeguard.com',
      username: 'demo_user',
      full_name: 'Demo User',
      role: 'user'
    };
    const demoToken = 'demo_token_12345';
    
    localStorage.setItem('authToken', demoToken);
    localStorage.setItem('user', JSON.stringify(demoUser));
    
    toast.success('Welcome to Demo Mode!');
    onLogin(demoToken, demoUser);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-[120px] opacity-20 animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-500 rounded-full blur-[120px] opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500 rounded-full blur-[120px] opacity-20 animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Shield Logo Animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 1 }}
          className="flex justify-center mb-8"
        >
          <motion.div
            animate={{
              boxShadow: [
                '0 0 20px rgba(34, 211, 238, 0.5)',
                '0 0 60px rgba(139, 92, 246, 0.8)',
                '0 0 20px rgba(34, 211, 238, 0.5)',
              ],
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-violet-500 to-cyan-500 rounded-full blur-xl opacity-50" />
            <div className="relative bg-gradient-to-br from-blue-500 via-violet-500 to-cyan-500 p-8 rounded-full">
              <Shield className="w-20 h-20 text-white" />
            </div>
          </motion.div>
        </motion.div>

        {/* Tagline */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-white mb-2"
        >
          SafeGuard AI
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center bg-gradient-to-r from-blue-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent mb-8"
        >
          Your Personal Safety Companion
        </motion.p>

        {/* Login/Register Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="backdrop-blur-xl bg-white/5 rounded-3xl p-8 border border-white/10"
          style={{
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 0 40px rgba(139, 92, 246, 0.1)',
          }}
        >
          <div className="space-y-4">
            {isRegister && (
              <div>
                <Input
                  type="text"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className={`bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-violet-500 transition-all ${
                    errors.fullName ? 'border-red-500' : ''
                  }`}
                />
                {errors.fullName && (
                  <div className="flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3 text-red-400" />
                    <span className="text-red-400 text-xs">{errors.fullName}</span>
                  </div>
                )}
              </div>
            )}
            
            {isRegister && (
              <div>
                <Input
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-violet-500 transition-all ${
                    errors.email ? 'border-red-500' : ''
                  }`}
                />
                {errors.email && (
                  <div className="flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3 text-red-400" />
                    <span className="text-red-400 text-xs">{errors.email}</span>
                  </div>
                )}
              </div>
            )}
            
            <div>
              <Input
                type="text"
                placeholder="Username"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                className={`bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-violet-500 transition-all ${
                  errors.username ? 'border-red-500' : ''
                }`}
              />
              {errors.username && (
                <div className="flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3 h-3 text-red-400" />
                  <span className="text-red-400 text-xs">{errors.username}</span>
                </div>
              )}
            </div>
            
            <div>
              <Input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className={`bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-violet-500 transition-all ${
                  errors.password ? 'border-red-500' : ''
                }`}
              />
              {errors.password && (
                <div className="flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3 h-3 text-red-400" />
                  <span className="text-red-400 text-xs">{errors.password}</span>
                </div>
              )}
            </div>
            
            {isRegister && (
              <div>
                <Input
                  type="password"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className={`bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-violet-500 transition-all ${
                    errors.confirmPassword ? 'border-red-500' : ''
                  }`}
                />
                {errors.confirmPassword && (
                  <div className="flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3 text-red-400" />
                    <span className="text-red-400 text-xs">{errors.confirmPassword}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full mt-6 bg-gradient-to-r from-blue-500 via-violet-500 to-cyan-500 hover:from-blue-600 hover:via-violet-600 hover:to-cyan-600 text-white rounded-2xl h-12 group disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              boxShadow: '0 0 30px rgba(139, 92, 246, 0.6)',
            }}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>{isRegister ? 'Creating Account...' : 'Logging in...'}</span>
              </div>
            ) : (
              <>
                {isRegister ? 'Create Account' : 'Login'}
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </Button>

          <button
            onClick={() => setIsRegister(!isRegister)}
            className="w-full mt-4 text-cyan-400 hover:text-white transition-colors text-center"
          >
            {isRegister ? 'Already have an account? Login' : "Don't have an account? Register"}
          </button>

          {/* Demo Mode Button */}
          <Button
            onClick={handleDemoMode}
            className="w-full mt-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-2xl h-10"
          >
            🚀 Try Demo Mode (No Login Required)
          </Button>

          {/* Accessibility Features */}
          <div className="mt-6 pt-6 border-t border-white/10 space-y-3">
            <button className="w-full flex items-center justify-center gap-2 text-white/60 hover:text-white transition-colors">
              <Mic className="w-4 h-4" />
              <span className="text-sm">Voice Login Available</span>
            </button>
            <button className="w-full flex items-center justify-center gap-2 text-white/60 hover:text-white transition-colors">
              <Globe className="w-4 h-4" />
              <span className="text-sm">Language: English</span>
            </button>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center text-white/40 mt-6 text-sm"
        >
          End Gender-Based Violence • Together We're Stronger
        </motion.p>
      </motion.div>
    </div>
  );
}
