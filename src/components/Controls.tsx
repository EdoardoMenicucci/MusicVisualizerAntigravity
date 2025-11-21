import { useRef } from 'react';
import { Mic, Music, Upload, Play, Pause, Monitor, Globe, Activity, BarChart3, Volume2 } from 'lucide-react';
import { type AudioSourceType } from '../hooks/useAudioAnalyzer';
import { type VisualizerMode, type ColorPalette } from './VisualizerCanvas';

interface ControlsProps {
  isPlaying: boolean;
  onTogglePlayPause: () => void;
  sourceType: AudioSourceType;
  onSourceChange: (type: AudioSourceType) => void;
  onFileUpload: (file: File) => void;
  audioElement: HTMLAudioElement | null;
  mode?: VisualizerMode;
  onModeChange?: (mode: VisualizerMode) => void;
  palette?: ColorPalette;
  onPaletteChange?: (palette: ColorPalette) => void;
}

export const Controls = ({
  isPlaying,
  onTogglePlayPause,
  sourceType,
  onSourceChange,
  onFileUpload,
  audioElement,
  mode = 'bars',
  onModeChange,
  palette = 'violet',
  onPaletteChange
}: ControlsProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const palettes: { id: ColorPalette; gradient: string; label: string }[] = [
    { id: 'violet', gradient: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)', label: 'Violet' },
    { id: 'fire', gradient: 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)', label: 'Fire' },
    { id: 'neon', gradient: 'linear-gradient(135deg, #34d399 0%, #06b6d4 100%)', label: 'Neon' },
    { id: 'ocean', gradient: 'linear-gradient(135deg, #38bdf8 0%, #2563eb 100%)', label: 'Ocean' },
  ];

  const modes: { id: VisualizerMode; icon: any; label: string; description: string }[] = [
    { id: 'bars', icon: BarChart3, label: 'Bars', description: 'Frequency bars' },
    { id: 'wave', icon: Activity, label: 'Wave', description: 'Waveform' },
    { id: 'sphere', icon: Globe, label: 'Sphere', description: '3D sphere' },
  ];

  const sources: { id: AudioSourceType; icon: any; label: string; description: string }[] = [
    { id: 'microphone', icon: Mic, label: 'Microphone', description: 'Live mic input' },
    { id: 'system', icon: Monitor, label: 'System Audio', description: 'Desktop sound' },
    { id: 'file', icon: Music, label: 'Audio File', description: 'Play local files' },
  ];

  return (
    <div className="h-full flex flex-col relative overflow-hidden">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-950/30 via-black to-black opacity-90" />
      <div className="absolute inset-0 backdrop-blur-3xl" />
      
      {/* Content */}
      <div className="relative z-10 h-full flex flex-col border-r border-white/10 shadow-[4px_0_24px_rgba(0,0,0,0.5)] ">
        {/* Main Controls - Scrollable */}
        <div className="flex flex-col gap-3 flex-1 overflow-y-auto px-7 py-8 space-y-8 custom-scrollbar pt-10">
          
          {/* Audio Source Section */}
          <div className="space-y-4">
            <h3 className="text-white/40 text-[11px] font-bold uppercase tracking-[0.15em] px-1 mb-5">Audio Source</h3>
            <div className="space-y-3">
              {sources.map(({ id, icon: Icon, label, description }) => (
                <button
                  key={id}
                  onClick={() => onSourceChange(id)}
                  className={`group w-full flex items-center gap-5 px-5 py-4 rounded-2xl transition-all duration-300 ${
                    sourceType === id 
                      ? 'bg-gradient-to-br from-violet-500/25 to-indigo-500/25 text-white shadow-[0_0_30px_rgba(139,92,246,0.2)] border border-violet-400/40 scale-[1.02]' 
                      : 'bg-white/[0.03] text-white/60 hover:bg-white/[0.08] hover:text-white/90 border border-white/[0.05] hover:border-white/10 hover:scale-[1.01]'
                  }`}
                >
                  <div className={`p-2.5 rounded-xl transition-all ${
                    sourceType === id 
                      ? 'bg-violet-500/20' 
                      : 'bg-white/5 group-hover:bg-white/10'
                  }`}>
                    <Icon size={24} strokeWidth={2.5} />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-semibold text-sm mb-0.5">{label}</div>
                    <div className="text-[10px] text-white/30 uppercase tracking-wider">{description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Playback Controls */}
          <div className="space-y-4">
            <h3 className="text-white/40 text-[11px] font-bold uppercase tracking-[0.15em] px-1 mb-5">Playback</h3>
            
            <button
              onClick={onTogglePlayPause}
              disabled={sourceType !== 'file'}
              className={`w-full flex items-center justify-center gap-4 px-6 py-6 rounded-2xl transition-all duration-300 ${
                sourceType === 'file'
                  ? 'bg-gradient-to-r from-white to-gray-100 text-black hover:scale-[1.02] active:scale-[0.98] shadow-[0_8px_32px_rgba(255,255,255,0.25)] font-bold'
                  : 'bg-white/5 text-white/20 cursor-not-allowed border border-white/5'
              }`}
            >
              {isPlaying ? <Pause size={26} fill="currentColor" /> : <Play size={26} fill="currentColor" />}
              <span className="text-base uppercase tracking-[0.15em]">
                {isPlaying ? 'Pause' : 'Play'}
              </span>
            </button>

            {/* Volume Control */}
            {sourceType === 'file' && audioElement && (
              <div className="bg-gradient-to-br from-white/[0.06] to-white/[0.02] rounded-2xl p-5 space-y-4 border border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Volume2 size={20} className="text-violet-400" />
                    <span className="text-white/70 text-xs font-semibold uppercase tracking-wider">Volume</span>
                  </div>
                  <span className="text-white/30 text-xs font-mono">100%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  defaultValue="1"
                  onChange={(e) => {
                    if (audioElement) audioElement.volume = parseFloat(e.target.value);
                  }}
                  className="w-full h-2.5 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-br [&::-webkit-slider-thumb]:from-violet-400 [&::-webkit-slider-thumb]:to-indigo-500 [&::-webkit-slider-thumb]:shadow-[0_0_12px_rgba(139,92,246,0.6)] hover:[&::-webkit-slider-thumb]:scale-110 [&::-webkit-slider-thumb]:transition-transform"
                />
              </div>
            )}

            {/* File Upload */}
            {sourceType === 'file' && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-3 px-5 py-4 rounded-2xl bg-white/[0.03] text-white/70 hover:bg-white/[0.08] hover:text-white transition-all border border-white/10 hover:border-white/20 group"
              >
                <Upload size={22} className="group-hover:translate-y-[-2px] transition-transform" />
                <span className="font-semibold text-sm tracking-wide">Upload Audio File</span>
              </button>
            )}
            
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onFileUpload(file);
              }}
              className="hidden"
            />
          </div>

          {/* Visualization Mode */}
          <div className="space-y-4">
            <h3 className="text-white/40 text-[11px] font-bold uppercase tracking-[0.15em] px-1 mb-5">Visualization</h3>
            <div className="space-y-3">
              {modes.map(({ id, icon: Icon, label, description }) => (
                <button
                  key={id}
                  onClick={() => onModeChange?.(id)}
                  className={`group w-full flex items-center gap-5 px-5 py-4 rounded-2xl transition-all duration-300 ${
                    mode === id 
                      ? 'bg-gradient-to-br from-violet-500/25 to-indigo-500/25 text-white shadow-[0_0_30px_rgba(139,92,246,0.2)] border border-violet-400/40 scale-[1.02]' 
                      : 'bg-white/[0.03] text-white/60 hover:bg-white/[0.08] hover:text-white/90 border border-white/[0.05] hover:border-white/10 hover:scale-[1.01]'
                  }`}
                >
                  <div className={`p-2.5 rounded-xl transition-all ${
                    mode === id 
                      ? 'bg-violet-500/20' 
                      : 'bg-white/5 group-hover:bg-white/10'
                  }`}>
                    <Icon size={24} strokeWidth={2.5} />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-semibold text-sm mb-0.5">{label}</div>
                    <div className="text-[10px] text-white/30 uppercase tracking-wider">{description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Color Palette */}
          <div className="space-y-4 pb-4">
            <h3 className="text-white/40 text-[11px] font-bold uppercase tracking-[0.15em] px-1 mb-5">Color Palette</h3>
            <div className="grid grid-cols-2 gap-3">
              {palettes.map((p) => (
                <button
                  key={p.id}
                  onClick={() => onPaletteChange?.(p.id)}
                  className={`relative h-24 rounded-2xl overflow-hidden transition-all duration-300 group ${
                    palette === p.id 
                      ? 'ring-2 ring-white ring-offset-2 ring-offset-black/50 scale-105 shadow-[0_8px_24px_rgba(0,0,0,0.3)]' 
                      : 'opacity-75 hover:opacity-100 hover:scale-105'
                  }`}
                >
                  <div 
                    className="absolute inset-0 transition-transform group-hover:scale-110 duration-500" 
                    style={{ background: p.gradient }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="relative z-10 h-full flex items-end p-3">
                    <span className="text-white font-bold text-sm drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] tracking-wide">
                      {p.label}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 92, 246, 0.3);
        }
      `}</style>
    </div>
  );
};
