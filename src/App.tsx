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
      <div className="fixed inset-0 w-full h-screen bg-black flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 animated-gradient" />
        <div className="absolute inset-0 noise-texture" />
        
        <div className="relative z-10 text-center fade-in-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap:'10px'}}>
            <h1 style={{
              fontSize: 'clamp(4rem, 12vw, 8rem)',
              fontWeight: 900,
              letterSpacing: '-0.05em',
              background: 'linear-gradient(135deg, #ffffff 0%, #ddd6fe 50%, #c4b5fd 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 40px rgba(139, 92, 246, 0.5))',
              userSelect: 'none',
              margin: 0
            }}>
              SonicFlow
            </h1>
            <p style={{
              color: 'rgba(221, 214, 254, 0.6)',
              fontSize: 'clamp(1rem, 2vw, 1.5rem)',
              fontWeight: 300,
              letterSpacing: '0.3em',
              textTransform: 'uppercase'
            }}>
              Audio Visualization Evolved
            </p>
          </div>

          <button
            onClick={handleStart}
            className="group relative"
            style={{
              padding: '1.5rem 3rem',
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: 'white',
              borderRadius: '9999px',
              fontSize: '1.25rem',
              fontWeight: 500,
              transition: 'all 0.5s',
              overflow: 'hidden',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.boxShadow = '0 0 40px rgba(139, 92, 246, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <span style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '1rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              fontSize: '0.875rem'
            }}>
              <Play size={20} style={{ fill: 'white' }} />
              Enter Experience
            </span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full h-screen bg-black overflow-hidden">
      {/* Sidebar */}
      <div className="w-80 h-full flex-shrink-0">
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

      {/* Visualizer Area */}
      <div className="flex-1 h-full relative">
        <VisualizerCanvas 
          getFrequencyData={getFrequencyData} 
          isPlaying={isPlaying}
          mode={mode}
          palette={palette}
        />
      </div>
    </div>
  );
}

export default App;
