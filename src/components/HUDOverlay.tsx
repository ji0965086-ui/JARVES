import { motion } from "motion/react";

export const HUDOverlay = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {/* Corner Brackets */}
      <div className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-cyan-500/40" />
      <div className="absolute top-8 right-8 w-16 h-16 border-r-2 border-t-2 border-cyan-500/40" />
      <div className="absolute bottom-8 left-8 w-16 h-16 border-l-2 border-b-2 border-cyan-500/40" />
      <div className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-cyan-500/40" />

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#0891b2_1px,transparent_1px)] [background-size:40px_40px] opacity-[0.05]" />

      {/* Vertical Scanning Bars */}
      <motion.div
        className="absolute left-0 top-0 bottom-0 w-px bg-cyan-500/20"
        animate={{ left: ["0%", "100%", "0%"] }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />

      {/* Horizontal Data Lines */}
      <div className="absolute top-[10%] left-0 right-0 h-px bg-cyan-500/10" />
      <div className="absolute bottom-[10%] left-0 right-0 h-px bg-cyan-500/10" />
      
      {/* Text Indicators */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 font-mono text-[10px] text-cyan-500/50 tracking-[0.3em] uppercase">
        System Status: Optimal | Network: Secured | AI Persona: JARVIS
      </div>
      
      <div className="absolute right-12 top-1/2 -translate-y-1/2 flex flex-col gap-4 font-mono text-[8px] text-cyan-500/30">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex gap-2 items-center">
            <div className="w-8 h-px bg-cyan-500/30" />
            NODE_0x{Math.random().toString(16).slice(2, 6).toUpperCase()}
          </div>
        ))}
      </div>
    </div>
  );
};
