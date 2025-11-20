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
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-violet-900/20 via-black to-black" />
        
        <div className="relative z-10 text-center space-y-8">
          <div className="space-y-2">
            <h1 className="text-6xl font-bold tracking-tighter text-white">
              Sonic<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Flow</span>
            </h1>
            <p className="text-white/40 text-lg font-light tracking-wide">Interactive Audio Experience</p>
          </div>

          <button
            onClick={handleStart}
            className="group relative px-8 py-4 bg-white text-black rounded-full font-bold text-xl hover:scale-105 transition-transform overflow-hidden shadow-[0_0_40px_rgba(255,255,255,0.3)]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-fuchsia-500 opacity-0 group-hover:opacity-20 transition-opacity" />
            <span className="flex items-center gap-3">
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
      <div className="absolute top-0 left-0 w-full p-8 flex justify-between items-start pointer-events-none">
        <div className="space-y-1">
          <h1 className="text-white/90 font-bold text-2xl tracking-tighter">Sonic<span className="text-white/40">Flow</span></h1>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-green-500 animate-pulse' : 'bg-white/20'}`} />
            <p className="text-white/40 text-xs uppercase tracking-widest font-medium">
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
