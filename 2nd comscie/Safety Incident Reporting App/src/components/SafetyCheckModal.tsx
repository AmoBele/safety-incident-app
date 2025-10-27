import { motion, AnimatePresence } from 'motion/react';
import { Shield, Check, X } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner@2.0.3';

interface SafetyCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SafetyCheckModal({ isOpen, onClose }: SafetyCheckModalProps) {
  const handleSafe = () => {
    toast.success('Glad you\'re safe! Stay vigilant.');
    onClose();
  };

  const handleNotSafe = () => {
    toast.error('Emergency services notified! Help is on the way.');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md p-6"
          >
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 text-center">
              {/* Shield Icon */}
              <motion.div
                animate={{
                  boxShadow: [
                    '0 0 20px rgba(59, 130, 246, 0.5)',
                    '0 0 40px rgba(59, 130, 246, 0.8)',
                    '0 0 20px rgba(59, 130, 246, 0.5)',
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="inline-block bg-gradient-to-br from-blue-500 to-blue-700 p-6 rounded-full mb-6"
              >
                <Shield className="w-12 h-12 text-white" />
              </motion.div>

              <h2 className="text-white mb-2">Safety Check-In</h2>
              <p className="text-blue-200 mb-8">Are you currently safe?</p>

              {/* Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={handleSafe}
                  className="bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white rounded-2xl h-14"
                >
                  <Check className="mr-2 w-5 h-5" />
                  I'm Safe
                </Button>
                <Button
                  onClick={handleNotSafe}
                  className="bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white rounded-2xl h-14"
                >
                  <X className="mr-2 w-5 h-5" />
                  Need Help
                </Button>
              </div>

              <button
                onClick={onClose}
                className="mt-4 text-white/60 hover:text-white transition-colors text-sm"
              >
                Dismiss
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
