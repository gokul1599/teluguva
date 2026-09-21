import { ImageQualityReport } from '@/types';

export function analyzeImageQuality(imageElement: HTMLImageElement): Promise<ImageQualityReport> {
  return new Promise((resolve) => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) {
        resolve({
          isAcceptable: true,
          isDark: false,
          isBlurry: false,
          brightness: 128,
          contrast: 50,
        });
        return;
      }

      // Downscale for fast analysis
      const maxDim = 300;
      let w = imageElement.naturalWidth || imageElement.width;
      let h = imageElement.naturalHeight || imageElement.height;
      if (w > maxDim || h > maxDim) {
        if (w > h) {
          h = Math.round((h * maxDim) / w);
          w = maxDim;
        } else {
          w = Math.round((w * maxDim) / h);
          h = maxDim;
        }
      }

      canvas.width = w;
      canvas.height = h;
      ctx.drawImage(imageElement, 0, 0, w, h);

      const imgData = ctx.getImageData(0, 0, w, h);
      const data = imgData.data;

      let totalLuminance = 0;
      const pixelCount = w * h;
      const grayValues: number[] = new Array(pixelCount);

      // 1. Calculate luminance
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        // Standard perceived luminance
        const lum = 0.299 * r + 0.587 * g + 0.114 * b;
        totalLuminance += lum;
        grayValues[i / 4] = lum;
      }

      const avgBrightness = totalLuminance / pixelCount;

      // 2. Estimate edge sharpness using neighbor variance
      let edgeDifference = 0;
      let samples = 0;
      for (let y = 1; y < h - 1; y += 2) {
        for (let x = 1; x < w - 1; x += 2) {
          const idx = y * w + x;
          const current = grayValues[idx];
          const right = grayValues[idx + 1];
          const bottom = grayValues[(y + 1) * w + x];
          edgeDifference += Math.abs(current - right) + Math.abs(current - bottom);
          samples += 2;
        }
      }

      const contrastScore = samples > 0 ? (edgeDifference / samples) : 20;

      const isDark = avgBrightness < 65;
      const isBlurry = contrastScore < 5.5;

      let message = '';
      if (isDark && isBlurry) {
        message = 'The photo looks too dark and blurry. Try taking it in brighter light without shaking.';
      } else if (isDark) {
        message = 'The image looks dark. Try taking the photo in better lighting for best reading.';
      } else if (isBlurry) {
        message = 'The text looks slightly blurry. Hold the camera still for clearer English recognition.';
      }

      resolve({
        isAcceptable: !isDark && !isBlurry,
        isDark,
        isBlurry,
        brightness: Math.round(avgBrightness),
        contrast: Math.round(contrastScore),
        message: message || undefined,
      });
    } catch {
      resolve({
        isAcceptable: true,
        isDark: false,
        isBlurry: false,
        brightness: 128,
        contrast: 50,
      });
    }
  });
}
