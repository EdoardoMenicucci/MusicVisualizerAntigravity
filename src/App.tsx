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
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <button
          onClick={handleStart}
          className="group relative px-8 py-4 bg-white text-black rounded-full font-bold text-xl hover:scale-105 transition-transform overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-fuchsia-500 opacity-0 group-hover:opacity-20 transition-opacity" />
          <span className="flex items-center gap-3">
            <Play size={24} fill="currentColor" />
            Start Experience
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <VisualizerCanvas 
        getFrequencyData={getFrequencyData} 
        isPlaying={isPlaying}
        mode={mode}
        palette={palette}
      />
      
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start pointer-events-none">
        <div>
          <h1 className="text-white font-bold text-2xl tracking-tighter">Sonic<span className="text-violet-400">Flow</span></h1>
          <p className="text-white/50 text-sm">Interactive Audio Visualizer</p>
        </div>
        <div className="text-sm text-white/50 bg-black/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/5">
          {sourceType === 'microphone' ? 'Live Input' : sourceType === 'system' ? 'System Audio' : 'File Playback'}
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
