import { motion } from 'motion/react';
import { AlertCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export default function FloatingEmergencyButton() {
  const handleEmergencyClick = () => {
    toast.error('Emergency alert sent to campus security!', {
      description: 'Help is on the way. Stay in a safe location.',
    });
  };

  return (
    <motion.button
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleEmergencyClick}
      className="fixed bottom-8 right-8 z-50 bg-gradient-to-br from-red-500 to-red-700 text-white rounded-full p-6 shadow-2xl hover:shadow-red-500/50 transition-all"
      style={{
        boxShadow: '0 0 40px rgba(239, 68, 68, 0.6)',
      }}
    >
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
      >
        <AlertCircle className="w-8 h-8" />
      </motion.div>
      
      {/* Pulse effect */}
      <motion.div
        className="absolute inset-0 rounded-full bg-red-500"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.5, 0, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
      />
    </motion.button>
  );
}
