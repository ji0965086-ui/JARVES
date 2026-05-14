import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShieldCheck, ShieldAlert, Fingerprint, Camera } from "lucide-react";
import confetti from "canvas-confetti";

export const BiometricLock = ({ onAuthenticated }: { onAuthenticated: () => void }) => {
  const [status, setStatus] = useState<"idle" | "scanning" | "success" | "denied">("idle");
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (status === "scanning") {
      const interval = setInterval(() => {
        setProgress((p) => {
          if (p >= 100) {
            clearInterval(interval);
            handleSuccess();
            return 100;
          }
          return p + 2;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [status]);

  const startScan = async () => {
    setStatus("scanning");
    setProgress(0);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (e) {
      console.warn("Camera access denied or missing");
    }
  };

  const handleSuccess = () => {
    setStatus("success");
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#06b6d4", "#3b82f6", "#0891b2"],
    });
    setTimeout(onAuthenticated, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center font-mono">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#06b6d415_0%,transparent_70%)]" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-[400px] p-8 border border-cyan-500/30 rounded-2xl bg-black/40 backdrop-blur-xl flex flex-col items-center gap-8 shadow-[0_0_50px_rgba(6,182,212,0.1)]"
      >
        <div className="text-cyan-500 uppercase tracking-[0.4em] text-sm mb-4">
          Biometric Security Verification
        </div>

        <div className="relative w-48 h-48 rounded-full border-2 border-cyan-500/50 overflow-hidden flex items-center justify-center bg-cyan-900/20">
          <AnimatePresence mode="wait">
            {status === "idle" && (
              <motion.div key="idle" exit={{ opacity: 0 }}>
                <Camera size={64} className="text-cyan-500/40" />
              </motion.div>
            )}
            {status === "scanning" && (
              <motion.div key="scan" className="relative w-full h-full">
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover grayscale opacity-50" />
                <motion.div 
                  className="absolute inset-x-0 h-1 bg-cyan-400 shadow-[0_0_15px_rgba(6,182,212,1)] z-10"
                  animate={{ top: ["0%", "100%", "0%"] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
              </motion.div>
            )}
            {status === "success" && (
              <motion.div key="success" initial={{ scale: 0 }} animate={{ scale: 1 }}>
                <ShieldCheck size={80} className="text-green-400" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="w-full space-y-4">
          <div className="flex justify-between items-center text-[10px] text-cyan-500/70">
            <span>Scan Progress: {progress}%</span>
            <span>Identity: Stark_01</span>
          </div>
          <div className="h-1.5 w-full bg-cyan-900/50 rounded-full overflow-hidden border border-cyan-500/20">
            <motion.div 
              className="h-full bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,1)]"
              animate={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <button
          onClick={startScan}
          disabled={status !== "idle"}
          className={cn(
            "group relative px-8 py-3 w-full border border-cyan-500/40 rounded-lg transition-all",
            "hover:bg-cyan-500/10 active:scale-95 disabled:opacity-50",
            status === "scanning" ? "border-cyan-400 bg-cyan-900/20" : "bg-black"
          )}
        >
          <div className="flex items-center justify-center gap-3">
            <Fingerprint className="text-cyan-400 group-hover:scale-110 transition-transform" />
            <span className="text-cyan-400 uppercase text-xs tracking-widest font-bold">
              {status === "idle" ? "Initiate Core Auth" : "Decrypting Protocol..."}
            </span>
          </div>
        </button>

        <div className="flex gap-2 text-[8px] text-cyan-500/30 uppercase">
          <span>MK_X Protocol</span>
          <span>•</span>
          <span>Face ID Enabled</span>
          <span>•</span>
          <span>Fingerprint Sync</span>
        </div>
      </motion.div>
    </div>
  );
};

import { cn } from "@/src/lib/utils";
