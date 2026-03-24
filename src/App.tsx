import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, MicOff, Activity, ShieldAlert, Zap, ArrowUp, ArrowDown, RotateCw, Play } from 'lucide-react';
import { MachineState, Movement, COMMAND_KEYWORDS } from './types';

export default function App() {
  const [state, setState] = useState<MachineState>({
    vertical: 50,
    horizontal: 50,
    rotation: 0,
    isExposing: false,
    lastCommand: 'Waiting for voice command...',
    status: 'IDLE'
  });

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSpeechSupported, setIsSpeechSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Initialize Web Speech API
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const current = event.resultIndex;
        const resultTranscript = event.results[current][0].transcript.toLowerCase();
        setTranscript(resultTranscript);

        if (event.results[current].isFinal) {
          handleVoiceCommand(resultTranscript);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };
    } else {
      setIsSpeechSupported(false);
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const handleVoiceCommand = (cmd: string) => {
    let matched = false;
    
    // Check for STOP first (safety)
    if (COMMAND_KEYWORDS.STOP.some(k => cmd.includes(k))) {
      updateMachine('STOP');
      matched = true;
    } else if (COMMAND_KEYWORDS.EXPOSE.some(k => cmd.includes(k))) {
      triggerExposure();
      matched = true;
    } else if (COMMAND_KEYWORDS.UP.some(k => cmd.includes(k))) {
      updateMachine('UP');
      matched = true;
    } else if (COMMAND_KEYWORDS.DOWN.some(k => cmd.includes(k))) {
      updateMachine('DOWN');
      matched = true;
    } else if (COMMAND_KEYWORDS.ROTATE_CW.some(k => cmd.includes(k))) {
      updateMachine('ROTATE_CW');
      matched = true;
    } else if (COMMAND_KEYWORDS.ROTATE_CCW.some(k => cmd.includes(k))) {
      updateMachine('ROTATE_CCW');
      matched = true;
    }

    setState(prev => ({
      ...prev,
      lastCommand: matched ? `Executed: ${cmd}` : `Unknown command: ${cmd}`
    }));
  };

  const updateMachine = (action: Movement) => {
    setState(prev => {
      let next = { ...prev, status: 'MOVING' as const };
      switch (action) {
        case 'UP': next.vertical = Math.min(100, prev.vertical + 10); break;
        case 'DOWN': next.vertical = Math.max(0, prev.vertical - 10); break;
        case 'ROTATE_CW': next.rotation = (prev.rotation + 15) % 360; break;
        case 'ROTATE_CCW': next.rotation = (prev.rotation - 15) % 360; break;
        case 'STOP': next.status = 'IDLE'; break;
      }
      return next;
    });

    // Simulate movement completion
    if (action !== 'STOP') {
      setTimeout(() => {
        setState(prev => ({ ...prev, status: 'IDLE' }));
      }, 1000);
    }
  };

  const triggerExposure = () => {
    setState(prev => ({ ...prev, isExposing: true, status: 'EXPOSING' }));
    setTimeout(() => {
      setState(prev => ({ ...prev, isExposing: false, status: 'IDLE' }));
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-mono p-4 md:p-8 selection:bg-orange-500 selection:text-black">
      {/* Header */}
      <header className="max-w-6xl mx-auto flex justify-between items-center border-b border-white/10 pb-6 mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tighter flex items-center gap-2">
            <Activity className="text-orange-500" />
            C-ARM VOICE CONTROL <span className="text-xs bg-orange-500 text-black px-1 py-0.5 rounded">PROTOTYPE</span>
          </h1>
          <p className="text-xs text-white/40 mt-1 uppercase tracking-widest">Raspberry Pi Interface v1.0.4 - Kiran/Allengers Compatible</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden md:block">
            <p className="text-[10px] text-white/40 uppercase">System Status</p>
            <p className="text-xs font-bold text-green-500">CONNECTED</p>
          </div>
          <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center">
            <Zap size={16} className="text-orange-500" />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Visualizer */}
        <div className="lg:col-span-7 space-y-6">
          <div className="aspect-video bg-white/5 rounded-2xl border border-white/10 relative overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 opacity-20 pointer-events-none" 
                 style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
            
            {/* Simulated C-Arm Graphic */}
            <div className="relative w-64 h-64 flex items-center justify-center">
              <motion.div 
                animate={{ rotate: state.rotation, y: (state.vertical - 50) * -1 }}
                transition={{ type: 'spring', stiffness: 50 }}
                className="w-48 h-48 border-4 border-white/20 rounded-full border-t-orange-500 relative"
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white/10 border border-white/20 rounded-sm flex items-center justify-center">
                  <div className={`w-2 h-2 rounded-full ${state.isExposing ? 'bg-red-500 animate-pulse' : 'bg-white/20'}`} />
                </div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-12 h-6 bg-white/10 border border-white/20 rounded-sm" />
              </motion.div>
              
              {/* Exposure Flash */}
              <AnimatePresence>
                {state.isExposing && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-white/10 backdrop-blur-sm flex items-center justify-center z-10"
                  >
                    <div className="text-red-500 font-bold text-4xl animate-pulse flex flex-col items-center">
                      <ShieldAlert size={64} />
                      RADIATION ACTIVE
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Telemetry Overlay */}
            <div className="absolute bottom-4 left-4 space-y-1">
              <div className="text-[10px] text-white/40 uppercase">Vertical Offset</div>
              <div className="text-xl font-bold">{state.vertical}%</div>
            </div>
            <div className="absolute bottom-4 right-4 text-right space-y-1">
              <div className="text-[10px] text-white/40 uppercase">Rotation Angle</div>
              <div className="text-xl font-bold">{state.rotation}°</div>
            </div>
          </div>

          {/* Command Log */}
          <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
            <h3 className="text-xs font-bold text-white/40 uppercase mb-4 flex items-center gap-2">
              <Activity size={14} /> System Console
            </h3>
            <div className="space-y-2 h-32 overflow-y-auto font-mono text-sm scrollbar-hide">
              <div className="text-green-500/60">[SYSTEM] Raspberry Pi GPIO Initialized...</div>
              <div className="text-green-500/60">[SYSTEM] Motor Drivers Ready...</div>
              <div className="text-orange-500">{`> ${state.lastCommand}`}</div>
              {transcript && <div className="text-white/40">{`>> Hearing: "${transcript}"`}</div>}
            </div>
          </div>
        </div>

        {/* Right Column: Controls & Voice */}
        <div className="lg:col-span-5 space-y-6">
          {/* Voice Control Card */}
          <div className="bg-white/5 rounded-2xl border border-white/10 p-8 flex flex-col items-center justify-center text-center space-y-6 relative overflow-hidden">
            {isListening && (
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute inset-0 bg-orange-500/5 pointer-events-none"
              />
            )}
            
            <div className="space-y-2">
              <h2 className="text-xl font-bold">Voice Activation</h2>
              {isSpeechSupported ? (
                <p className="text-sm text-white/40">Say "Up", "Down", "Rotate", or "Expose"</p>
              ) : (
                <p className="text-sm text-red-500 font-bold">Speech Recognition not supported in this browser</p>
              )}
            </div>

            <button 
              onClick={toggleListening}
              disabled={!isSpeechSupported}
              className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-500 ${
                !isSpeechSupported ? 'opacity-20 cursor-not-allowed' :
                isListening 
                ? 'bg-orange-500 shadow-[0_0_50px_rgba(249,115,22,0.4)]' 
                : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              {isListening ? <Mic size={40} className="text-black" /> : <MicOff size={40} />}
            </button>

            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                animate={{ width: isListening ? '100%' : '0%' }}
                className="h-full bg-orange-500"
              />
            </div>

            <div className="text-sm font-medium text-white/60 italic">
              {transcript || "Click mic to start listening..."}
            </div>
          </div>

          {/* Manual Override Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-xl border border-white/10 p-4 space-y-4">
              <p className="text-[10px] text-white/40 uppercase">Manual Lift</p>
              <div className="flex gap-2">
                <button onClick={() => updateMachine('UP')} className="flex-1 h-12 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center transition-colors">
                  <ArrowUp size={20} />
                </button>
                <button onClick={() => updateMachine('DOWN')} className="flex-1 h-12 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center transition-colors">
                  <ArrowDown size={20} />
                </button>
              </div>
            </div>
            <div className="bg-white/5 rounded-xl border border-white/10 p-4 space-y-4">
              <p className="text-[10px] text-white/40 uppercase">Manual Rotation</p>
              <div className="flex gap-2">
                <button onClick={() => updateMachine('ROTATE_CCW')} className="flex-1 h-12 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center transition-colors">
                  <RotateCw size={20} className="scale-x-[-1]" />
                </button>
                <button onClick={() => updateMachine('ROTATE_CW')} className="flex-1 h-12 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center transition-colors">
                  <RotateCw size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Emergency Stop */}
          <button 
            onClick={() => updateMachine('STOP')}
            className="w-full h-16 bg-red-500/10 hover:bg-red-500/20 border border-red-500/50 rounded-xl flex items-center justify-center gap-3 text-red-500 font-bold transition-all uppercase tracking-widest"
          >
            <ShieldAlert size={24} />
            Emergency Stop
          </button>

          {/* Safety Warning */}
          <div className="p-4 bg-orange-500/5 border border-orange-500/20 rounded-xl">
            <p className="text-[10px] text-orange-500/80 leading-relaxed uppercase">
              Warning: This is a simulation interface. Real-world implementation requires hardware interlocks, 
              radiation shielding protocols, and compliance with medical device regulations (FDA/CE).
            </p>
          </div>
        </div>
      </main>

      {/* Footer Info */}
      <footer className="max-w-6xl mx-auto mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between gap-4 text-[10px] text-white/20 uppercase tracking-widest">
        <div>Hardware: Raspberry Pi 4 Model B | OS: Raspberry Pi OS (64-bit)</div>
        <div>Control Logic: Python RPi.GPIO / Serial Bridge</div>
        <div>© 2026 Medical Systems Integration Prototype</div>
      </footer>
    </div>
  );
}
