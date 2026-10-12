import React, { useState, useRef } from 'react';
import { X, Download, Copy, Check, Eye, Sparkles } from 'lucide-react';
import { HogtechLogo } from './HogtechLogo.tsx';
import hogtechLogoImg from '../assets/images/hogtech_logo.jpg';

interface LogoViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LogoViewerModal: React.FC<LogoViewerModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [logoMode, setLogoMode] = useState<'framed' | 'transparent' | 'lockup'>('framed');

  if (!isOpen) return null;

  const handleDownloadJpg = () => {
    const link = document.createElement('a');
    link.href = hogtechLogoImg;
    link.download = 'hogtech_logo.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Exact raw SVG code for downloading or copying
  const rawSvgCode = `<svg width="1000" height="1000" viewBox="0 0 1000 1000" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="hogtechMainWave" x1="10%" y1="60%" x2="90%" y2="40%">
      <stop offset="0%" stop-color="#00E5C9" />
      <stop offset="30%" stop-color="#00C4DB" />
      <stop offset="52%" stop-color="#80F5FF" />
      <stop offset="70%" stop-color="#00C6B8" />
      <stop offset="100%" stop-color="#00BBA0" />
    </linearGradient>
    <linearGradient id="hogtechCrestHighlight" x1="38%" y1="52%" x2="55%" y2="44%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.8" />
      <stop offset="50%" stop-color="#E2FCFF" stop-opacity="0.9" />
      <stop offset="100%" stop-color="#00C8D8" stop-opacity="0" />
    </linearGradient>
  </defs>
  <rect width="1000" height="1000" fill="#0A182F" rx="32" />
  <rect x="35" y="35" width="930" height="930" rx="52" stroke="#FFFFFF" stroke-width="6" stroke-opacity="0.85" fill="none" />
  <path d="M 235 528 A 290 290 0 1 1 776 490" stroke="#FFFFFF" stroke-width="15" stroke-linecap="round" fill="none" />
  <path d="M 776 525 A 290 290 0 0 1 270 655" stroke="#FFFFFF" stroke-width="15" stroke-linecap="round" fill="none" />
  <path d="M 345 330 H 425 V 348 H 402 V 468 H 368 V 348 H 345 Z" fill="#FFFFFF" />
  <path d="M 368 598 V 652 H 340 V 670 H 455 V 652 H 428 C 424 645, 420 635, 418 625 L 418 574 C 402 582, 385 590, 368 598 Z" fill="#FFFFFF" />
  <path d="M 588 338 H 658 V 448 C 635 448, 610 448, 588 450 Z" fill="#FFFFFF" />
  <path d="M 588 505 H 655 V 652 H 675 V 670 H 548 V 652 H 575 C 584 644, 588 632, 588 618 Z" fill="#FFFFFF" />
  <rect x="588" y="338" width="60" height="18" fill="#FFFFFF" />
  <rect x="682" y="666" width="16" height="4" fill="#FFFFFF" />
  <path d="M 224 612 C 310 612, 420 545, 562 505 C 530 514, 440 540, 350 588 C 295 615, 252 612, 224 612 Z" fill="#FFFFFF" />
  <path d="M 230 580 H 260 C 262 580, 264 582, 264 585 V 598 C 264 601, 262 603, 260 603 H 230 C 228 603, 226 601, 226 598 V 585 C 226 582, 228 580, 230 580 Z" fill="#FFFFFF" />
  <line x1="222" y1="610" x2="265" y2="603" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round" />
  <path d="M 94 508 C 165 540, 240 568, 335 558 C 440 545, 505 468, 620 422 C 700 395, 760 440, 788 474 C 740 435, 680 415, 615 440 C 505 485, 425 565, 310 575 C 220 585, 140 545, 94 508 Z" fill="url(#hogtechMainWave)" />
  <path d="M 370 512 C 440 480, 500 445, 580 432 C 530 445, 460 480, 400 508 Z" fill="url(#hogtechCrestHighlight)" />
</svg>`;

  const handleCopySvg = () => {
    navigator.clipboard.writeText(rawSvgCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadSvg = () => {
    const blob = new Blob([rawSvgCode], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'hogtech_official_logo.svg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadPng = () => {
    setDownloading(true);
    try {
      const img = new Image();
      const svgBlob = new Blob([rawSvgCode], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 1600;
        canvas.height = 1600;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, 1600, 1600);
          canvas.toBlob((blob) => {
            if (blob) {
              const pngUrl = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = pngUrl;
              link.download = 'hogtech_official_logo_1600x1600.png';
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(pngUrl);
            }
          }, 'image/png');
        }
        URL.revokeObjectURL(url);
        setDownloading(false);
      };

      img.src = url;
    } catch (e) {
      console.error(e);
      setDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full p-6 sm:p-8 text-white shadow-2xl relative max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-400 uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Official Identity Asset</span>
          </div>
          <h2 className="font-display font-extrabold text-2xl text-white">
            Official Hogtech Int’l Ventures Logo
          </h2>
          <p className="text-xs text-slate-400">
            Official high-resolution identity asset loaded from <span className="text-teal-400 font-mono">hogtech_logo.jpg</span>.
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex items-center gap-2 pt-4 border-b border-slate-800 pb-3">
          <button
            onClick={() => setLogoMode('framed')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              logoMode === 'framed'
                ? 'bg-teal-500 text-slate-950 shadow'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            Official Badge
          </button>
          <button
            onClick={() => setLogoMode('transparent')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              logoMode === 'transparent'
                ? 'bg-teal-500 text-slate-950 shadow'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            Isolated Emblem
          </button>
          <button
            onClick={() => setLogoMode('lockup')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              logoMode === 'lockup'
                ? 'bg-teal-500 text-slate-950 shadow'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            Full Wordmark Lockup
          </button>
        </div>

        {/* Large Logo Showcase Display */}
        <div className="my-6 p-8 rounded-2xl bg-[#060e1b] border border-slate-800/80 flex items-center justify-center min-h-[300px] shadow-inner relative overflow-hidden">
          {logoMode === 'framed' && (
            <HogtechLogo size="hero" variant="framed" transparentBg={false} />
          )}
          {logoMode === 'transparent' && (
            <div className="p-6 rounded-2xl bg-slate-900/40 border border-dashed border-slate-700/60 flex items-center justify-center">
              <HogtechLogo size="hero" variant="emblem" transparentBg={true} />
            </div>
          )}
          {logoMode === 'lockup' && (
            <div className="flex flex-col items-center gap-4 text-center">
              <HogtechLogo size="2xl" variant="emblem" transparentBg={false} />
              <div>
                <h3 className="font-display font-extrabold text-2xl tracking-tight text-white uppercase">
                  Hogtech Int’l <span className="text-teal-400">Ventures</span>
                </h3>
                <p className="font-mono text-xs text-slate-400 tracking-widest uppercase mt-1">
                  Innovation · Print · Tech · Solutions
                </p>
                <p className="text-xs text-teal-300 italic mt-1 font-medium">
                  "Your Vision, Our Priority"
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Key Dimensions & Verified Specs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
          <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase">File Format</span>
            <span className="font-mono font-bold text-white">hogtech_logo.jpg</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase">Resolution</span>
            <span className="font-mono font-bold text-teal-300">1600 × 1600 px</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase">Navy Base</span>
            <span className="font-mono font-bold text-teal-300">#0A182F Deep Blue</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase">Wave Crest</span>
            <span className="font-bold text-teal-400">Cyan-Teal Gradient</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 pt-5 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={handleDownloadJpg}
            className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold transition-colors flex items-center gap-2 shadow"
          >
            <Download className="w-4 h-4" />
            <span>Download hogtech_logo.jpg</span>
          </button>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleCopySvg}
              className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied' : 'Copy SVG'}</span>
            </button>
            <button
              onClick={handleDownloadSvg}
              className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <Download className="w-4 h-4 text-teal-400" />
              <span>SVG</span>
            </button>
            <button
              onClick={handleDownloadPng}
              disabled={downloading}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>{downloading ? 'Exporting...' : 'PNG (1600px)'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
