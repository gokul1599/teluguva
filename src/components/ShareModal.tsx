'use client';

import React, { useState, useRef } from 'react';
import { X, Share2, Copy, Check, Download, MessageCircle } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  englishText: string;
  teluguText: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  englishText,
  teluguText,
}) => {
  const [copiedType, setCopiedType] = useState<'telugu' | 'both' | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  if (!isOpen) return null;

  const handleCopy = async (text: string, type: 'telugu' | 'both') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2000);
    } catch {
      // Fallback
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: 'TELUGUVA Translation',
          text: `English: ${englishText}\n\nTelugu (తెలుగు): ${teluguText}\n\nTranslated by TELUGUVA (తెలుగు AI)`,
        });
      } catch {
        // Cancelled
      }
    }
  };

  const handleWhatsAppShare = () => {
    const message = encodeURIComponent(
      `*English:*\n${englishText}\n\n*తెలుగు అనువాదం:*\n${teluguText}\n\n_Translated with TELUGUVA (తెలుగు AI)_`
    );
    window.open(`https://api.whatsapp.com/send?text=${message}`, '_blank');
  };

  const handleDownloadCard = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Render 1080x1080 social card
    const width = 1080;
    const height = 1080;
    canvas.width = width;
    canvas.height = height;

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#fffbeb'); // warm amber tint
    gradient.addColorStop(0.5, '#ffffff');
    gradient.addColorStop(1, '#fef3c7');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Subtle decorative borders
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 12;
    ctx.strokeRect(40, 40, width - 80, height - 80);

    // App Branding Header
    ctx.fillStyle = '#d97706';
    ctx.font = 'bold 44px sans-serif';
    ctx.fillText('TELUGUVA | తెలుగు AI', 90, 130);

    ctx.fillStyle = '#64748b';
    ctx.font = '28px sans-serif';
    ctx.fillText('Understand English. Hear Telugu.', 90, 175);

    // Divider
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(90, 220);
    ctx.lineTo(width - 90, 220);
    ctx.stroke();

    // English Section
    ctx.fillStyle = '#475569';
    ctx.font = 'bold 30px sans-serif';
    ctx.fillText('ENGLISH', 90, 290);

    ctx.fillStyle = '#1e293b';
    ctx.font = '36px sans-serif';
    wrapText(ctx, `"${englishText}"`, 90, 350, width - 180, 50);

    // Telugu Section
    ctx.fillStyle = '#b45309';
    ctx.font = 'bold 32px sans-serif';
    ctx.fillText('🇮🇳 తెలుగు అనువాదం (TELUGU)', 90, 620);

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 42px "Noto Sans Telugu", sans-serif';
    wrapText(ctx, `"${teluguText}"`, 90, 690, width - 180, 60);

    // Footer badge
    ctx.fillStyle = '#94a3b8';
    ctx.font = '24px sans-serif';
    ctx.fillText('Created with TELUGUVA — Simple Telugu for Everyone', 90, 990);

    // Trigger download
    const link = document.createElement('a');
    link.download = `teluguva-translation-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  function wrapText(
    context: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number
  ) {
    const words = text.split(' ');
    let line = '';
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = context.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        context.fillText(line, x, y);
        line = words[n] + ' ';
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    context.fillText(line, x, y);
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Share Translation
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Share with family on WhatsApp or save as an image
            </p>
          </div>
        </div>

        {/* Translation Preview Box */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 mb-4 space-y-2">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
            Telugu Translation:
          </div>
          <p className="font-telugu text-base font-semibold text-slate-900 dark:text-slate-100 leading-relaxed">
            {teluguText}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          {/* WhatsApp Share Button */}
          <button
            onClick={handleWhatsAppShare}
            className="w-full py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
          >
            <MessageCircle className="w-4.5 h-4.5 fill-current" />
            <span>Share via WhatsApp</span>
          </button>

          {/* Native Mobile Share */}
          {typeof navigator !== 'undefined' && 'share' in navigator && (
            <button
              onClick={handleNativeShare}
              className="w-full py-2.5 px-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>Native Share (Apps)</span>
            </button>
          )}

          {/* Download Social Card */}
          <button
            onClick={handleDownloadCard}
            className="w-full py-2.5 px-4 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-sm flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 transition cursor-pointer"
          >
            <Download className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>Download as Image Card</span>
          </button>

          {/* Copy Options */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              onClick={() => handleCopy(teluguText, 'telugu')}
              className="py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              {copiedType === 'telugu' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-600">✓ Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Telugu</span>
                </>
              )}
            </button>

            <button
              onClick={() =>
                handleCopy(`English: ${englishText}\nTelugu: ${teluguText}`, 'both')
              }
              className="py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              {copiedType === 'both' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-600">✓ Copied Both</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Both</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Hidden Canvas for Card Generation */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
};
