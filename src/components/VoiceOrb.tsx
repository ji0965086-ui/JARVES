import { motion } from "motion/react";
import { cn } from "@/src/lib/utils";

interface VoiceOrbProps {
  isListening: boolean;
  isSpeaking: boolean;
  intensity?: number;
}

export const VoiceOrb = ({ isListening, isSpeaking, intensity = 1 }: VoiceOrbProps) => {
  return (
    <div className="relative flex items-center justify-center w-64 h-64">
      {/* Outer Rings */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute border border-cyan-500/30 rounded-full"
          initial={{ width: 0, height: 0, opacity: 1 }}
          animate={{
            width: ["100%", "150%"],
            height: ["100%", "150%"],
            opacity: [0.5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.6,
            ease: "easeOut",
          }}
        />
      ))}

      {/* Main Pulse Orb */}
      <motion.div
        className={cn(
          "relative z-10 w-32 h-32 rounded-full flex items-center justify-center",
          "bg-gradient-to-br from-cyan-400 to-blue-600 shadow-[0_0_50px_rgba(34,211,238,0.5)]",
          isListening && "animate-pulse shadow-[0_0_70px_rgba(34,211,238,0.8)]"
        )}
        animate={{
          scale: isSpeaking ? [1, 1.1, 1] : 1,
        }}
        transition={{
          repeat: Infinity,
          duration: 0.2,
        }}
      >
        <div className="w-24 h-24 rounded-full border-2 border-white/20 bg-cyan-900/40 backdrop-blur-md flex items-center justify-center overflow-hidden">
          {/* Internal Waveform (Simulated) */}
          <div className="flex gap-1 items-center h-8">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="w-1 bg-cyan-300 rounded-full"
                animate={{
                  height: isSpeaking || isListening ? [4, 24, 8, 32, 4] : 4,
                }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  delay: i * 0.1,
                }}
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Scanning Line */}
      {isListening && (
        <motion.div
          className="absolute z-20 w-48 h-1 bg-cyan-400/50 shadow-[0_0_10px_rgba(34,211,238,1)]"
          animate={{
            top: ["20%", "80%", "20%"],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}
    </div>
  );
};
