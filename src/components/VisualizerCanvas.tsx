import { useEffect, useRef } from 'react';

export type VisualizerMode = 'bars' | 'wave' | 'sphere';
export type ColorPalette = 'violet' | 'fire' | 'neon' | 'ocean';

interface VisualizerCanvasProps {
  getFrequencyData: () => Uint8Array;
  isPlaying: boolean;
  mode?: VisualizerMode;
  palette?: ColorPalette;
}

const PALETTES = {
  violet: ['#8b5cf6', '#3b82f6', '#6366f1'], // Violet -> Blue -> Indigo
  fire: ['#ef4444', '#f59e0b', '#fcd34d'],   // Red -> Amber -> Yellow
  neon: ['#10b981', '#06b6d4', '#d946ef'],   // Emerald -> Cyan -> Fuchsia
  ocean: ['#0ea5e9', '#22d3ee', '#f0f9ff'],  // Sky -> Cyan -> AliceBlue
};

export const VisualizerCanvas = ({ 
  getFrequencyData, 
  isPlaying, 
  mode = 'bars', 
  palette = 'violet' 
}: VisualizerCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const rotationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      const data = getFrequencyData();
      const width = canvas.width;
      const height = canvas.height;
      const colors = PALETTES[palette];

      ctx.clearRect(0, 0, width, height);

      // Create gradient based on palette
      const getGradient = (ctx: CanvasRenderingContext2D, h: number) => {
        const gradient = ctx.createLinearGradient(0, h, 0, 0);
        gradient.addColorStop(0, colors[0]);
        gradient.addColorStop(0.5, colors[1]);
        gradient.addColorStop(1, colors[2]);
        return gradient;
      };

      if (mode === 'bars') {
        const barWidth = (width / data.length) * 2.5;
        let x = 0;

        for (let i = 0; i < data.length; i++) {
          const barHeight = (data[i] / 255) * height;
          ctx.fillStyle = getGradient(ctx, height);
          ctx.fillRect(x, height - barHeight, barWidth, barHeight);
          x += barWidth + 1;
        }
      } else if (mode === 'wave') {
        ctx.lineWidth = 3;
        ctx.strokeStyle = colors[1];
        ctx.beginPath();

        const sliceWidth = width / data.length;
        let x = 0;

        for (let i = 0; i < data.length; i++) {
          const v = data[i] / 128.0;
          const y = (v * height) / 2;

          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);

          x += sliceWidth;
        }

        ctx.lineTo(width, height / 2);
        ctx.stroke();
      } else if (mode === 'sphere') {
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) / 4;
        
        rotationRef.current += 0.005;
        
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(rotationRef.current);

        const bars = 120; // Limit bars for circle
        const step = (Math.PI * 2) / bars;
        
        for (let i = 0; i < bars; i++) {
          // Map i to frequency data index
          const dataIndex = Math.floor((i / bars) * (data.length / 2));
          const value = data[dataIndex];
          const barHeight = (value / 255) * (radius * 1.5);

          ctx.rotate(step);
          
          // Draw mirrored bars
          ctx.fillStyle = colors[i % 3]; // Cycle through palette colors
          ctx.fillRect(0, radius, 4, barHeight);
        }
        
        ctx.restore();

        // Inner glow
        const gradient = ctx.createRadialGradient(centerX, centerY, radius * 0.8, centerX, centerY, radius * 1.2);
        gradient.addColorStop(0, colors[0] + '00'); // Transparent
        gradient.addColorStop(1, colors[1] + '40'); // Semi-transparent
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * 1.5, 0, Math.PI * 2);
        ctx.fill();
      }

      if (isPlaying) {
        animationRef.current = requestAnimationFrame(render);
      }
    };

    if (isPlaying) {
      render();
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [getFrequencyData, isPlaying, mode, palette]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full -z-10 bg-neutral-900 transition-colors duration-1000"
    />
  );
};
