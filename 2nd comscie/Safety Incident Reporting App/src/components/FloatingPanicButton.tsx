import { motion } from 'motion/react';
import { Shield } from 'lucide-react';
import type { Screen } from '../App';

interface FloatingPanicButtonProps {
  navigateTo: (screen: Screen) => void;
}

export default function FloatingPanicButton({ navigateTo }: FloatingPanicButtonProps) {
  return (
    <motion.button
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => navigateTo('panic')}
      className="fixed bottom-8 right-8 z-50 group"
    >
      <div className="relative">
        {/* Pulsing glow */}
        <motion.div
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
          className="absolute inset-0 bg-red-500 rounded-full blur-2xl"
        />
        
        {/* Button */}
        <div className="relative bg-gradient-to-br from-red-500 to-rose-600 rounded-full p-6 shadow-2xl">
          <motion.div
            animate={{
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              repeatDelay: 3,
            }}
          >
            <Shield className="w-10 h-10 text-white" />
          </motion.div>
        </div>

        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="backdrop-blur-xl bg-black/80 border border-red-500/30 rounded-2xl px-4 py-2 whitespace-nowrap">
            <p className="text-white text-sm">Emergency SOS</p>
          </div>
        </div>
      </div>
    </motion.button>
  );
}
