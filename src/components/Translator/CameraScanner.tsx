'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Camera, X, RotateCcw, Zap, AlertCircle } from 'lucide-react';

interface CameraScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (blob: Blob) => void;
}

export const CameraScanner: React.FC<CameraScannerProps> = ({
  isOpen,
  onClose,
  onCapture,
}) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError('Camera is not supported on this browser or device.');
        return;
      }

      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      });

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      console.error('Camera access error:', err);
      if (err.name === 'NotAllowedError') {
        setCameraError('Camera permission was denied. Please allow camera access in browser settings.');
      } else {
        setCameraError('Could not start camera. Please ensure another app is not using it.');
      }
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const flipCamera = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  const captureFrame = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(
      (blob) => {
        if (blob) {
          stopCamera();
          onCapture(blob);
          onClose();
        }
      },
      'image/jpeg',
      0.95
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex flex-col justify-between p-4 sm:p-6 backdrop-blur-md animate-in fade-in duration-200">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between text-white z-20">
        <div className="flex items-center gap-2">
          <Camera className="w-5 h-5 text-amber-400" />
          <span className="font-semibold text-sm sm:text-base">Scan English Text</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={flipCamera}
            className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
            title="Switch camera"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
            title="Close camera"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Viewfinder */}
      <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden rounded-3xl">
        {cameraError ? (
          <div className="p-6 max-w-sm text-center text-white bg-slate-900/80 rounded-2xl border border-red-500/40">
            <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
            <p className="text-sm font-medium text-red-200">{cameraError}</p>
            <button
              onClick={startCamera}
              className="mt-4 px-4 py-2 rounded-xl bg-amber-500 text-white text-xs font-semibold"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Viewfinder Target Framing Box */}
            <div className="relative w-[85%] max-w-[420px] aspect-[4/3] rounded-2xl border-2 border-dashed border-amber-400/90 shadow-[0_0_0_9999px_rgba(0,0,0,0.55)] pointer-events-none flex flex-col justify-between p-4">
              {/* Four Corner Accents */}
              <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-amber-400 rounded-tl-lg" />
              <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-amber-400 rounded-tr-lg" />
              <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-amber-400 rounded-bl-lg" />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-amber-400 rounded-br-lg" />

              <div className="text-center text-xs font-medium text-amber-200 bg-black/50 px-3 py-1 rounded-full mx-auto backdrop-blur-xs">
                Position English text inside the box
              </div>

              {/* Scanning sweep bar */}
              <div className="absolute inset-x-0 h-0.5 bg-amber-400/80 shadow-[0_0_12px_#f59e0b] animate-laser" />
            </div>
          </>
        )}
      </div>

      {/* Bottom Controls */}
      <div className="flex flex-col items-center justify-center gap-3 z-20">
        <button
          onClick={captureFrame}
          disabled={Boolean(cameraError)}
          className="w-18 h-18 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 p-1 shadow-lg shadow-orange-500/40 hover:scale-105 active:scale-95 transition disabled:opacity-50 cursor-pointer"
          title="Capture & Translate"
        >
          <div className="w-full h-full rounded-full border-2 border-white flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
              <Camera className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </button>
        <span className="text-xs text-slate-300 font-medium tracking-wide">
          Tap to Capture & Translate
        </span>
      </div>
    </div>
  );
};
