/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { VoiceOrb } from './components/VoiceOrb';
import { HUDOverlay } from './components/HUDOverlay';
import { CommandPanel } from './components/CommandPanel';
import { SystemStats } from './components/SystemStats';
import { BiometricLock } from './components/BiometricLock';
import { jarvis } from './lib/jarvisService';
import { cn } from './lib/utils';
import { ShieldCheck, Database, LayoutGrid, Bell } from 'lucide-react';

interface Message {
  role: 'user' | 'jarvis';
  text: string;
  timestamp: string;
}

export default function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Initialize Speech Recognition
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-US';

      rec.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        handleSendMessage(text);
      };

      rec.onend = () => setIsListening(false);
      setRecognition(rec);
    }
  }, []);

  const speak = useCallback((text: string) => {
    if (isMuted || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 0.8;
    
    // Attempt to find a "British" voice for JARVIS vibe
    const voices = window.speechSynthesis.getVoices();
    const jVoice = voices.find(v => v.lang.includes('en-GB')) || voices[0];
    if (jVoice) utterance.voice = jVoice;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }, [isMuted]);

  const handleSendMessage = async (text: string) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newUserMsg: Message = { role: 'user', text, timestamp };
    setMessages(prev => [...prev, newUserMsg]);

    try {
      const response = await jarvis.sendMessage(text);
      const jarvisMsg: Message = { 
        role: 'jarvis', 
        text: response, 
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      };
      setMessages(prev => [...prev, jarvisMsg]);
      speak(response);
    } catch (error) {
      console.error("Jarvis connection error:", error);
    }
  };

  const startListening = () => {
    if (recognition && !isListening) {
      recognition.start();
      setIsListening(true);
    }
  };

  if (!authenticated) {
    return <BiometricLock onAuthenticated={() => {
      setAuthenticated(true);
      speak("Welcome back, Sir. All systems initialized and running at peak performance.");
    }} />;
  }

  return (
    <div className="relative min-h-screen bg-[#020617] text-cyan-50 overflow-hidden selection:bg-cyan-500/30">
      <HUDOverlay />

      <main className="relative z-10 p-6 grid grid-cols-12 gap-6 h-screen max-h-screen overflow-hidden">
        {/* Left Side: Stats & Status */}
        <div className="col-span-3 flex flex-col gap-6 overflow-hidden">
          <SectionHeader icon={<LayoutGrid size={16}/>} title="System Hub" />
          <div className="flex-1 bg-cyan-950/20 backdrop-blur-md rounded-xl border border-cyan-500/20 overflow-hidden">
            <SystemStats />
          </div>
          
          <div className="p-4 bg-cyan-900/10 border border-cyan-500/10 rounded-xl font-mono text-[10px] space-y-2">
            <div className="text-cyan-500/50 uppercase mb-2">Process Stream</div>
            <div className="space-y-1">
              <div className="flex justify-between"><span>[INIT] CORE_PROTOCOL</span><span className="text-green-400">DONE</span></div>
              <div className="flex justify-between"><span>[SYNC] NEURAL_LINK</span><span className="text-green-400">OK</span></div>
              <div className="flex justify-between"><span>[SCAN] PERIMETER_CHK</span><span className="text-cyan-400">READY</span></div>
              <motion.div animate={{ opacity: [0, 1] }} transition={{ repeat: Infinity }} className="w-1 h-3 bg-cyan-500 inline-block" />
            </div>
          </div>
        </div>

        {/* Center: The Core Orb */}
        <div className="col-span-6 flex flex-col items-center justify-center relative">
          <div className="absolute top-12 flex gap-12 items-center">
             <div className="flex flex-col items-center gap-1 opacity-50">
               <ShieldCheck size={20} className="text-green-400" />
               <span className="font-mono text-[8px] uppercase tracking-widest">Secured</span>
             </div>
             <div className="flex flex-col items-center gap-1">
               <Database size={20} className="text-cyan-400 animate-pulse" />
               <span className="font-mono text-[8px] uppercase tracking-widest">Live Sync</span>
             </div>
             <div className="flex flex-col items-center gap-1 opacity-50">
               <Bell size={20} className="text-yellow-400" />
               <span className="font-mono text-[8px] uppercase tracking-widest">Alerts: 0</span>
             </div>
          </div>

          <VoiceOrb isListening={isListening} isSpeaking={isSpeaking} />
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute bottom-12 text-center"
          >
            <h1 className="text-2xl font-black tracking-[0.8em] text-cyan-400 mb-2 font-mono uppercase">
              JARVIS
            </h1>
            <p className="text-[10px] tracking-[0.4em] font-mono text-cyan-600 uppercase">
              Just A Rather Very Intelligent System
            </p>
          </motion.div>
        </div>

        {/* Right Side: Chat & Commands */}
        <div className="col-span-3 h-full overflow-hidden flex flex-col">
          <SectionHeader icon={<Terminal size={16}/>} title="Neural Feed" />
          <div className="flex-1 overflow-hidden">
            <CommandPanel 
              messages={messages} 
              onSendMessage={handleSendMessage}
              isMuted={isMuted}
              setIsMuted={setIsMuted}
              isListening={isListening}
              startListening={startListening}
            />
          </div>
        </div>
      </main>

      {/* Ambient Sound Effects Simulation */}
      <audio id="click-sound" src="https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3" preload="auto" />
    </div>
  );
}

const SectionHeader = ({ icon, title }: any) => (
  <div className="flex items-center gap-3 px-4 py-2 bg-cyan-900/10 border-l border-cyan-500 font-mono">
    <span className="text-cyan-400">{icon}</span>
    <span className="text-[12px] font-bold uppercase tracking-widest text-cyan-100">{title}</span>
  </div>
);

import { Terminal } from 'lucide-react';

