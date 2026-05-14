import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, Terminal, Clock, Settings, Mic, Volume2, VolumeX } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { cn } from "@/src/lib/utils";

interface Message {
  role: "user" | "jarvis";
  text: string;
  timestamp: string;
}

interface CommandPanelProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
  isMuted: boolean;
  setIsMuted: (val: boolean) => void;
  isListening: boolean;
  startListening: () => void;
}

export const CommandPanel = ({
  messages,
  onSendMessage,
  isMuted,
  setIsMuted,
  isListening,
  startListening
}: CommandPanelProps) => {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;
    onSendMessage(input);
    setInput("");
  };

  return (
    <div className="flex flex-col h-full bg-cyan-950/20 backdrop-blur-md rounded-xl border border-cyan-500/20 shadow-[0_0_40px_rgba(34,211,238,0.05)] overflow-hidden font-mono">
      {/* Panel Header */}
      <div className="p-4 border-b border-cyan-500/10 flex justify-between items-center bg-cyan-900/10">
        <div className="flex items-center gap-2">
          <Terminal size={14} className="text-cyan-500" />
          <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-widest">Command Interface</span>
        </div>
        <div className="flex gap-4">
          <button onClick={() => setIsMuted(!isMuted)} className="text-cyan-500 hover:text-cyan-300">
            {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </button>
          <Settings size={14} className="text-cyan-500 cursor-pointer" />
        </div>
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-cyan-500/20"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: msg.role === "user" ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={cn(
                "flex flex-col max-w-[85%]",
                msg.role === "user" ? "ml-auto items-end" : "mr-auto items-start"
              )}
            >
              <div className={cn(
                "px-3 py-2 rounded-lg text-sm",
                msg.role === "user" 
                  ? "bg-cyan-500/10 border border-cyan-500/30 text-cyan-200"
                  : "bg-blue-500/10 border border-blue-500/20 text-blue-100"
              )}>
                <div className="markdown-body prose prose-invert prose-xs max-w-none">
                  <ReactMarkdown>
                    {msg.text}
                  </ReactMarkdown>
                </div>
              </div>
              <span className="text-[8px] text-cyan-900 mt-1 uppercase mt-1 opacity-50">
                {msg.timestamp}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-4 bg-cyan-900/10 border-t border-cyan-500/10">
        <div className="flex gap-2 p-1 bg-black/40 rounded-lg border border-cyan-500/30 focus-within:border-cyan-400 transition-all">
          <button
            type="button"
            onClick={startListening}
            className={cn(
              "p-2 rounded-md transition-all",
              isListening ? "text-red-400 bg-red-400/10" : "text-cyan-500 hover:bg-cyan-500/10"
            )}
          >
            <Mic size={18} className={isListening ? "animate-pulse" : ""} />
          </button>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Awaiting command..."
            className="flex-1 bg-transparent border-none focus:ring-0 text-cyan-100 text-sm py-2 placeholder:text-cyan-900"
          />
          <button 
            type="submit"
            className="p-2 text-cyan-500 hover:text-cyan-300 transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
        <div className="mt-2 flex gap-4 text-[8px] text-cyan-800 uppercase tracking-tighter">
          <span className="flex items-center gap-1"><Clock size={8} /> Last Link: Sync Complete</span>
          <span>Buffer: Optimized</span>
        </div>
      </form>
    </div>
  );
};
