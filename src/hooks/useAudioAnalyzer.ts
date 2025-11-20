import { useRef, useState, useCallback } from "react";

export type AudioSourceType = "microphone" | "file" | "system";

interface UseAudioAnalyzerProps {
  fftSize?: number;
}

export const useAudioAnalyzer = ({
  fftSize = 2048,
}: UseAudioAnalyzerProps = {}) => {
  const [sourceType, setSourceType] = useState<AudioSourceType>("file");
  const [isPlaying, setIsPlaying] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<
    MediaStreamAudioSourceNode | MediaElementAudioSourceNode | null
  >(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const initializeAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      const AudioContext =
        window.AudioContext || (window as any).webkitAudioContext;
      audioContextRef.current = new AudioContext();

      const analyser = audioContextRef.current.createAnalyser();
      analyser.fftSize = fftSize;
      analyserRef.current = analyser;
    }

    if (audioContextRef.current?.state === "suspended") {
      audioContextRef.current.resume();
    }
  }, [fftSize]);

  const stopCurrentSource = useCallback(() => {
    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      audioElementRef.current.src = "";
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  const connectMicrophone = useCallback(async () => {
    try {
      initializeAudioContext();
      if (!audioContextRef.current || !analyserRef.current) return;

      stopCurrentSource();

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      sourceRef.current = source;
      setSourceType("microphone");
      setIsPlaying(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  }, [initializeAudioContext, stopCurrentSource]);

  const connectSystemAudio = useCallback(async () => {
    try {
      initializeAudioContext();
      if (!audioContextRef.current || !analyserRef.current) return;

      stopCurrentSource();

      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });

      // We only need audio, so we can stop the video track immediately to save resources
      // but keep the stream active for audio
      const audioTracks = stream.getAudioTracks();
      if (audioTracks.length === 0) {
        console.warn(
          "No system audio track found. Did you share a tab/screen with audio?"
        );
        stream.getTracks().forEach((track) => track.stop());
        return;
      }

      streamRef.current = stream;

      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      sourceRef.current = source;
      setSourceType("system");
      setIsPlaying(true);

      // Handle stream ending (e.g. user stops sharing)
      const videoTracks = stream.getVideoTracks();
      if (videoTracks.length > 0) {
        videoTracks[0].onended = () => {
          stopCurrentSource();
          setSourceType("file"); // Fallback or just stop
        };
      } else {
        // If no video track (e.g., only audio shared), listen to audio track ending
        audioTracks[0].onended = () => {
          stopCurrentSource();
          setSourceType("file");
        };
      }
    } catch (error) {
      console.error("Error accessing system audio:", error);
    }
  }, [initializeAudioContext, stopCurrentSource]);

  const connectFile = useCallback(
    (file: File) => {
      initializeAudioContext();
      if (!audioContextRef.current || !analyserRef.current) return;

      stopCurrentSource();

      const audio = new Audio();
      audio.src = URL.createObjectURL(file);
      audioElementRef.current = audio;

      const source = audioContextRef.current.createMediaElementSource(audio);
      source.connect(analyserRef.current);
      analyserRef.current.connect(audioContextRef.current.destination);
      sourceRef.current = source;

      setSourceType("file");

      audio.play();
      setIsPlaying(true);

      audio.onended = () => setIsPlaying(false);
    },
    [initializeAudioContext, stopCurrentSource]
  );

  const togglePlayPause = useCallback(() => {
    if (sourceType === "file" && audioElementRef.current) {
      if (isPlaying) {
        audioElementRef.current.pause();
      } else {
        audioElementRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  }, [sourceType, isPlaying]);

  const getFrequencyData = useCallback(() => {
    if (!analyserRef.current) return new Uint8Array(0);

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyserRef.current.getByteFrequencyData(dataArray);
    return dataArray;
  }, []);

  return {
    initializeAudioContext,
    connectMicrophone,
    connectSystemAudio,
    connectFile,
    getFrequencyData,
    togglePlayPause,
    isPlaying,
    sourceType,
    audioElement: audioElementRef.current,
  };
};
