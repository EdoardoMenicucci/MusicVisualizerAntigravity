import { useRef, useState } from 'react';
import { Mic, Music, Upload, Play, Pause, Monitor, Globe, Activity, BarChart3, Palette, Volume2 } from 'lucide-react';
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
  const [showPalette, setShowPalette] = useState(false);

  const palettes: { id: ColorPalette; color: string; label: string }[] = [
    { id: 'violet', color: 'from-violet-500 to-indigo-500', label: 'Violet' },
    { id: 'fire', color: 'from-red-500 to-orange-500', label: 'Fire' },
    { id: 'neon', color: 'from-emerald-400 to-cyan-500', label: 'Neon' },
    { id: 'ocean', color: 'from-sky-400 to-blue-600', label: 'Ocean' },
  ];

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999]">
      {/* Simple visible Dock */}
      <div className="flex items-center gap-4 p-6 bg-white/90 backdrop-blur-xl rounded-3xl border-4 border-violet-500 shadow-2xl">
        
        {/* Source Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onSourceChange('microphone')}
            className={`p-3 rounded-xl transition-all ${sourceType === 'microphone' ? 'bg-violet-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            title="Microphone"
          >
            <Mic size={24} />
          </button>
          <button
            onClick={() => onSourceChange('system')}
            className={`p-3 rounded-xl transition-all ${sourceType === 'system' ? 'bg-violet-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            title="System Audio"
          >
            <Monitor size={24} />
          </button>
          <button
            onClick={() => onSourceChange('file')}
            className={`p-3 rounded-xl transition-all ${sourceType === 'file' ? 'bg-violet-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            title="File"
          >
            <Music size={24} />
          </button>
        </div>

        <div className="w-px h-12 bg-gray-300" />

        {/* Play/Pause */}
        <button
          onClick={onTogglePlayPause}
          disabled={sourceType !== 'file'}
          className="p-4 rounded-full bg-violet-500 text-white hover:bg-violet-600 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" />}
        </button>

        <div className="w-px h-12 bg-gray-300" />

        {/* Mode Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onModeChange?.('bars')}
            className={`p-3 rounded-xl transition-all ${mode === 'bars' ? 'bg-violet-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            title="Bars"
          >
            <BarChart3 size={24} />
          </button>
          <button
            onClick={() => onModeChange?.('wave')}
            className={`p-3 rounded-xl transition-all ${mode === 'wave' ? 'bg-violet-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            title="Wave"
          >
            <Activity size={24} />
          </button>
          <button
            onClick={() => onModeChange?.('sphere')}
            className={`p-3 rounded-xl transition-all ${mode === 'sphere' ? 'bg-violet-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            title="Sphere"
          >
            <Globe size={24} />
          </button>
        </div>

        <div className="w-px h-12 bg-gray-300" />

        {/* Palette */}
        <button
          onClick={() => setShowPalette(!showPalette)}
          className={`p-3 rounded-xl transition-all ${showPalette ? 'bg-violet-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          title="Color Palette"
        >
          <Palette size={24} />
        </button>

        {/* Volume (only for file) */}
        {sourceType === 'file' && audioElement && (
          <>
            <div className="w-px h-12 bg-gray-300" />
            <div className="flex items-center gap-2">
              <Volume2 size={20} className="text-gray-700" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                defaultValue="1"
                onChange={(e) => {
                  if (audioElement) audioElement.volume = parseFloat(e.target.value);
                }}
                className="w-24 h-2 bg-gray-300 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-violet-500"
              />
            </div>
          </>
        )}

        {/* File upload */}
        {sourceType === 'file' && (
          <>
            <div className="w-px h-12 bg-gray-300" />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-3 rounded-xl bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all"
              title="Upload File"
            >
              <Upload size={24} />
            </button>
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
          </>
        )}
      </div>

      {/* Palette Selector */}
      {showPalette && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 p-4 bg-white/90 backdrop-blur-xl rounded-2xl border-2 border-violet-500 shadow-xl">
          <div className="flex gap-3">
            {palettes.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  onPaletteChange?.(p.id);
                  setShowPalette(false);
                }}
                className={`relative w-12 h-12 rounded-xl overflow-hidden transition-transform hover:scale-110 ${palette === p.id ? 'ring-4 ring-violet-500' : ''}`}
                title={p.label}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${p.color}`} />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
