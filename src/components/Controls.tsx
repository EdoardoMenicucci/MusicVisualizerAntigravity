import { Play, Pause, Mic, Music, Upload, Volume2, Monitor, Globe, Activity, BarChart3, Palette } from 'lucide-react';
import { useRef, useState } from 'react';
import type { AudioSourceType } from '../hooks/useAudioAnalyzer';
import type { VisualizerMode, ColorPalette } from './VisualizerCanvas';

interface ControlsProps {
  isPlaying: boolean;
  onTogglePlayPause: () => void;
  sourceType: AudioSourceType;
  onSourceChange: (type: AudioSourceType) => void;
  onFileUpload: (file: File) => void;
  audioElement: HTMLAudioElement | null;
  mode: VisualizerMode;
  onModeChange: (mode: VisualizerMode) => void;
  palette: ColorPalette;
  onPaletteChange: (palette: ColorPalette) => void;
}

export const Controls = ({
  isPlaying,
  onTogglePlayPause,
  sourceType,
  onSourceChange,
  onFileUpload,
  audioElement,
  mode,
  onModeChange,
  palette,
  onPaletteChange
}: ControlsProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showPalettes, setShowPalettes] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioElement) {
      audioElement.volume = parseFloat(e.target.value);
    }
  };

  const palettes: { id: ColorPalette; colors: string[] }[] = [
    { id: 'violet', colors: ['#8b5cf6', '#3b82f6'] },
    { id: 'fire', colors: ['#ef4444', '#f59e0b'] },
    { id: 'neon', colors: ['#10b981', '#d946ef'] },
    { id: 'ocean', colors: ['#0ea5e9', '#f0f9ff'] },
  ];

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[95%] max-w-4xl p-4 rounded-2xl bg-black/30 backdrop-blur-xl border border-white/10 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 text-white transition-all hover:bg-black/40">
      
      {/* Left Group: Source & Mode */}
      <div className="flex items-center gap-4">
        {/* Source Switch */}
        <div className="flex items-center gap-1 bg-white/5 p-1 rounded-lg border border-white/5">
          <button
            onClick={() => onSourceChange('file')}
            className={`p-2 rounded-md transition-all ${sourceType === 'file' ? 'bg-white/20 shadow-sm text-white' : 'text-white/60 hover:text-white hover:bg-white/10'}`}
            title="File Mode"
          >
            <Music size={18} />
          </button>
          <button
            onClick={() => onSourceChange('microphone')}
            className={`p-2 rounded-md transition-all ${sourceType === 'microphone' ? 'bg-white/20 shadow-sm text-white' : 'text-white/60 hover:text-white hover:bg-white/10'}`}
            title="Microphone Mode"
          >
            <Mic size={18} />
          </button>
          <button
            onClick={() => onSourceChange('system')}
            className={`p-2 rounded-md transition-all ${sourceType === 'system' ? 'bg-white/20 shadow-sm text-white' : 'text-white/60 hover:text-white hover:bg-white/10'}`}
            title="System Audio"
          >
            <Monitor size={18} />
          </button>
        </div>

        <div className="w-px h-8 bg-white/10" />

        {/* Mode Switch */}
        <div className="flex items-center gap-1 bg-white/5 p-1 rounded-lg border border-white/5">
          <button
            onClick={() => onModeChange('bars')}
            className={`p-2 rounded-md transition-all ${mode === 'bars' ? 'bg-violet-500/30 text-violet-300 shadow-sm' : 'text-white/60 hover:text-white hover:bg-white/10'}`}
            title="Bars"
          >
            <BarChart3 size={18} />
          </button>
          <button
            onClick={() => onModeChange('wave')}
            className={`p-2 rounded-md transition-all ${mode === 'wave' ? 'bg-violet-500/30 text-violet-300 shadow-sm' : 'text-white/60 hover:text-white hover:bg-white/10'}`}
            title="Wave"
          >
            <Activity size={18} />
          </button>
          <button
            onClick={() => onModeChange('sphere')}
            className={`p-2 rounded-md transition-all ${mode === 'sphere' ? 'bg-violet-500/30 text-violet-300 shadow-sm' : 'text-white/60 hover:text-white hover:bg-white/10'}`}
            title="Sphere"
          >
            <Globe size={18} />
          </button>
        </div>
      </div>

      {/* Center Group: Playback Controls */}
      <div className="flex items-center gap-6">
        {sourceType === 'file' ? (
          <>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 rounded-full hover:bg-white/10 transition-colors text-white/80 hover:text-white"
              title="Upload File"
            >
              <Upload size={20} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              onChange={handleFileChange}
              className="hidden"
            />

            <button
              onClick={onTogglePlayPause}
              className="p-4 rounded-full bg-white text-black hover:scale-105 active:scale-95 transition-all shadow-[0_0_15px_rgba(255,255,255,0.3)]"
            >
              {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
            </button>
          </>
        ) : (
          <div className="px-6 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-white/80 animate-pulse flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            {sourceType === 'microphone' ? 'Listening to Mic' : 'Capturing System Audio'}
          </div>
        )}
      </div>

      {/* Right Group: Palette & Volume */}
      <div className="flex items-center gap-4">
        {/* Palette Selector */}
        <div className="relative">
          <button
            onClick={() => setShowPalettes(!showPalettes)}
            className={`p-2 rounded-full transition-all ${showPalettes ? 'bg-white/20 text-white' : 'text-white/60 hover:text-white hover:bg-white/10'}`}
            title="Color Palette"
          >
            <Palette size={20} />
          </button>
          
          {showPalettes && (
            <div className="absolute bottom-full right-0 mb-4 p-2 rounded-xl bg-black/80 backdrop-blur-xl border border-white/10 shadow-xl flex flex-col gap-2 min-w-[120px]">
              {palettes.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    onPaletteChange(p.id);
                    setShowPalettes(false);
                  }}
                  className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${palette === p.id ? 'bg-white/20' : 'hover:bg-white/10'}`}
                >
                  <div 
                    className="w-6 h-6 rounded-full shadow-sm"
                    style={{ background: `linear-gradient(135deg, ${p.colors[0]}, ${p.colors[1]})` }}
                  />
                  <span className="text-sm capitalize">{p.id}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Volume Control (File only) */}
        {sourceType === 'file' && (
          <div className="flex items-center gap-2 w-24 group">
            <Volume2 size={18} className="text-white/60 group-hover:text-white transition-colors" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              defaultValue="1"
              onChange={handleVolumeChange}
              className="w-full h-1 bg-white/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-125"
            />
          </div>
        )}
      </div>
    </div>
  );
};
