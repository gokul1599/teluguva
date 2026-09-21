'use client';

import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { UploadCloud, Camera, Image as ImageIcon, AlertTriangle, CheckCircle2, RotateCw, X } from 'lucide-react';
import { analyzeImageQuality } from '@/lib/imageQuality';
import { recognizeEnglishText } from '@/lib/ocrService';
import { ImageQualityReport, OCRProgress } from '@/types';

interface ImageUploaderProps {
  onTextExtracted: (text: string) => void;
  onOpenCamera: () => void;
  isLoading: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onTextExtracted,
  onOpenCamera,
  isLoading,
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [qualityReport, setQualityReport] = useState<ImageQualityReport | null>(null);
  const [ocrStatus, setOcrStatus] = useState<OCRProgress>({
    stage: 'idle',
    percent: 0,
    message: '',
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please upload a valid image file (JPG, PNG, WEBP).');
      return;
    }

    setErrorMessage(null);
    setQualityReport(null);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target?.result as string;
      setImagePreview(dataUrl);

      // Pre-check quality using offscreen image
      const img = new Image();
      img.src = dataUrl;
      img.onload = async () => {
        const quality = await analyzeImageQuality(img);
        setQualityReport(quality);

        // Run OCR
        try {
          const result = await recognizeEnglishText(file, (progress) => {
            setOcrStatus(progress);
          });

          if (!result.text || result.isUnclear) {
            setErrorMessage(
              "We couldn't find clear English text in this image. Please try a clearer photo."
            );
            setOcrStatus({ stage: 'error', percent: 0, message: '' });
          } else {
            setOcrStatus({
              stage: 'ready',
              percent: 100,
              message: 'English text extracted successfully!',
            });
            onTextExtracted(result.text);
          }
        } catch (err: any) {
          setErrorMessage(err.message || 'Error processing image.');
          setOcrStatus({ stage: 'error', percent: 0, message: '' });
        }
      };
    };
    reader.readAsDataURL(file);
  };

  const resetImage = () => {
    setImagePreview(null);
    setQualityReport(null);
    setErrorMessage(null);
    setOcrStatus({ stage: 'idle', percent: 0, message: '' });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="w-full flex flex-col items-center justify-center p-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />

      {!imagePreview ? (
        /* Empty Upload Card */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`w-full min-h-[220px] sm:min-h-[260px] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all duration-200 select-none ${
            dragOver
              ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/20 scale-[0.99]'
              : 'border-slate-300 dark:border-slate-700 hover:border-amber-500/80 bg-slate-50/50 dark:bg-slate-900/40 hover:bg-amber-50/30 dark:hover:bg-amber-950/10'
          }`}
        >
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-orange-500/20 dark:from-amber-950/60 dark:to-orange-950/60 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-3.5 shadow-xs">
            <UploadCloud className="w-7 h-7" />
          </div>

          <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100">
            Translate from Image
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
            Drag & drop or click to upload a photo containing English text
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <span className="text-[11px] px-2.5 py-1 rounded-full bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
              JPG, PNG, WEBP
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenCamera();
              }}
              className="px-3.5 py-1.5 rounded-full bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer transition"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Take Photo</span>
            </button>
          </div>
        </div>
      ) : (
        /* Image Preview with Scanning Animation */
        <div className="w-full flex flex-col items-center">
          <div className="relative w-full max-w-md rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md bg-black/5 dark:bg-black/30">
            {/* Image display */}
            <img
              src={imagePreview}
              alt="OCR Preview"
              className="w-full max-h-[300px] object-contain mx-auto"
            />

            {/* Laser scanning beam during reading */}
            {ocrStatus.stage === 'reading' && (
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_15px_rgba(251,191,36,0.9)] animate-laser" />
            )}

            {/* Reset button */}
            <button
              onClick={resetImage}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white backdrop-blur-md transition cursor-pointer"
              title="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Progress Status Display */}
          {ocrStatus.stage !== 'idle' && ocrStatus.stage !== 'ready' && !errorMessage && (
            <div className="w-full max-w-md mt-4 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs font-semibold text-amber-900 dark:text-amber-200">
                <span className="flex items-center gap-2">
                  <RotateCw className="w-3.5 h-3.5 animate-spin text-amber-600 dark:text-amber-400" />
                  {ocrStatus.message || 'Processing image...'}
                </span>
                <span>{ocrStatus.percent}%</span>
              </div>
              <div className="w-full bg-amber-200/60 dark:bg-amber-900/60 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${ocrStatus.percent}%` }}
                />
              </div>
            </div>
          )}

          {/* Quality Guidance Warning */}
          {qualityReport?.message && !errorMessage && (
            <div className="w-full max-w-md mt-3 p-3 rounded-xl bg-amber-50/80 dark:bg-amber-950/50 border border-amber-300/80 dark:border-amber-800/60 flex items-start gap-2.5 text-xs text-amber-800 dark:text-amber-300">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>{qualityReport.message}</span>
            </div>
          )}

          {/* Error Notice */}
          {errorMessage && (
            <div className="w-full max-w-md mt-3 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-300 dark:border-red-800/60 flex items-start gap-2.5 text-xs text-red-700 dark:text-red-300">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">{errorMessage}</p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-1.5 font-medium underline cursor-pointer text-red-800 dark:text-red-200"
                >
                  Upload a clearer photo
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
