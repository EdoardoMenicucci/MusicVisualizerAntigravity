import { useState } from 'react';
import { VisualizerCanvas, type VisualizerMode, type ColorPalette } from './components/VisualizerCanvas';
import { Controls } from './components/Controls';
import { useAudioAnalyzer } from './hooks/useAudioAnalyzer';
import { Play } from 'lucide-react';

function App() {
  const {
    initializeAudioContext,
    connectMicrophone,
    connectSystemAudio,
    connectFile,
    getFrequencyData,
    togglePlayPause,
    isPlaying,
    sourceType,
    audioElement
  } = useAudioAnalyzer();

  const [isStarted, setIsStarted] = useState(false);
  const [mode, setMode] = useState<VisualizerMode>('bars');
  const [palette, setPalette] = useState<ColorPalette>('violet');

  const handleStart = () => {
    initializeAudioContext();
    setIsStarted(true);
  };

  if (!isStarted) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-violet-900/20 via-black to-black animate-pulse" />
        
        <div className="relative z-10 text-center space-y-12 animate-in fade-in zoom-in duration-1000">
          <div className="space-y-4">
            <h1 className="text-7xl md:text-8xl font-bold tracking-tighter text-white drop-shadow-[0_0_30px_rgba(139,92,246,0.3)]">
              Sonic<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Flow</span>
            </h1>
            <p className="text-white/40 text-xl font-light tracking-[0.2em] uppercase">Interactive Audio Experience</p>
          </div>

          <button
            onClick={handleStart}
            className="group relative px-10 py-5 bg-white text-black rounded-full font-bold text-xl hover:scale-105 transition-all duration-300 overflow-hidden shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(139,92,246,0.4)]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-violet-500 opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-[length:200%_100%] animate-gradient" />
            <span className="relative flex items-center gap-3">
              <Play size={24} fill="currentColor" />
              Start Experience
            </span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      <VisualizerCanvas 
        getFrequencyData={getFrequencyData} 
        isPlaying={isPlaying}
        mode={mode}
        palette={palette}
      />
      
      {/* Minimal Header */}
      <div className="absolute top-0 left-0 w-full p-8 flex justify-between items-start pointer-events-none z-50">
        <div className="space-y-2">
          <h1 className="text-white/90 font-bold text-2xl tracking-tighter drop-shadow-lg">
            Sonic<span className="text-white/40">Flow</span>
          </h1>
          <div className="flex items-center gap-3 bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/5 w-fit">
            <div className={`w-2 h-2 rounded-full shadow-[0_0_10px_currentColor] ${isPlaying ? 'bg-green-500 text-green-500 animate-pulse' : 'bg-white/20 text-white/20'}`} />
            <p className="text-white/60 text-[10px] uppercase tracking-widest font-medium">
              {sourceType === 'microphone' ? 'Live Input' : sourceType === 'system' ? 'System Audio' : 'File Playback'}
            </p>
          </div>
        </div>
      </div>

      <Controls
        isPlaying={isPlaying}
        onTogglePlayPause={togglePlayPause}
        sourceType={sourceType}
        onSourceChange={(type) => {
          if (type === 'microphone') connectMicrophone();
          else if (type === 'system') connectSystemAudio();
          // File handling is separate via onFileUpload
        }}
        onFileUpload={connectFile}
        audioElement={audioElement}
        mode={mode}
        onModeChange={setMode}
        palette={palette}
        onPaletteChange={setPalette}
      />
    </div>
  );
}

export default App;
