import React, { useState } from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'motion/react';
import { Sparkles, CheckCircle2, ShieldCheck, Monitor, Maximize2, Layers, Image as ImageIcon, Check } from 'lucide-react';
import hogtechHeroImage from '../assets/images/Hogetech_hero_images.jpeg';
import workspaceImage from '../assets/images/hero_hogtech_workspace_1791613498907.jpg';

interface AnimatedHeroImageProps {
  onOpenLogoModal?: () => void;
}

export const AnimatedHeroImage: React.FC<AnimatedHeroImageProps> = ({ onOpenLogoModal }) => {
  const shouldReduceMotion = useReducedMotion();
  const [activeView, setActiveView] = useState<'hero' | 'workspace'>('hero');
  const [isFullscreenModalOpen, setIsFullscreenModalOpen] = useState(false);

  // Floating keyframe animation (disabled if prefers-reduced-motion is true)
  const floatAnimation = shouldReduceMotion
    ? undefined
    : {
        y: [0, -8, 0],
        transition: {
          duration: 5.5,
          repeat: Infinity,
          ease: 'easeInOut' as const,
        },
      };

  const currentImageSrc = activeView === 'hero' ? hogtechHeroImage : workspaceImage;
  const currentAlt =
    activeView === 'hero'
      ? 'HogTech Int’l Ventures Hero Showcase - Professional Digital Solutions'
      : 'HogTech Int’l Ventures Workstation & Modern Computer Hub';

  return (
    <>
      <div className="relative w-full max-w-lg lg:max-w-none mx-auto select-none">
        {/* Subtle ambient decorative multi-tone glow behind the frame */}
        <div
          className="absolute -inset-4 sm:-inset-6 bg-gradient-to-tr from-teal-500/25 via-cyan-500/20 to-teal-400/25 rounded-3xl blur-2xl -z-10 opacity-75 pointer-events-none"
          aria-hidden="true"
        />

        {/* Decorative cyber corner accents */}
        <div
          className="hidden sm:block absolute -top-3.5 -right-3.5 w-10 h-10 border-t-2 border-r-2 border-teal-400/70 rounded-tr-xl pointer-events-none z-10 shadow-[0_0_12px_rgba(45,212,191,0.5)]"
          aria-hidden="true"
        />
        <div
          className="hidden sm:block absolute -bottom-3.5 -left-3.5 w-10 h-10 border-b-2 border-l-2 border-teal-400/70 rounded-bl-xl pointer-events-none z-10 shadow-[0_0_12px_rgba(45,212,191,0.5)]"
          aria-hidden="true"
        />

        {/* Main Entrance & Floating Motion Wrapper */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 24, x: 20 }}
          animate={
            shouldReduceMotion
              ? { opacity: 1 }
              : {
                  opacity: 1,
                  y: 0,
                  x: 0,
                }
          }
          transition={{
            duration: 0.75,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          className="relative"
        >
          {/* Continuous slow floating wrapper */}
          <motion.div
            animate={floatAnimation}
            whileHover={shouldReduceMotion ? undefined : { scale: 1.015 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="group relative rounded-2xl sm:rounded-3xl p-1.5 sm:p-2 bg-gradient-to-b from-slate-700/80 via-slate-800 to-slate-900 shadow-2xl shadow-teal-950/60 border border-teal-500/40 hover:border-teal-400/70 transition-all hover:shadow-teal-900/50"
          >
            {/* Photograph Container with rounded corners & modern frame */}
            <div className="relative rounded-xl sm:rounded-2xl overflow-hidden bg-slate-950 aspect-[4/3] sm:aspect-[14/10] lg:aspect-[4/3] min-h-[290px] sm:min-h-[360px] lg:min-h-[410px]">
              {/* Image Transition with Fade */}
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeView}
                  src={currentImageSrc}
                  alt={currentAlt}
                  loading="eager"
                  decoding="async"
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.45, ease: 'easeOut' }}
                  className="w-full h-full object-cover object-center transform transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />
              </AnimatePresence>

              {/* Shimmer light beam sweep animation */}
              <div
                className="absolute inset-0 pointer-events-none overflow-hidden opacity-30 group-hover:opacity-60 transition-opacity"
                aria-hidden="true"
              >
                <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-hero-shimmer" />
              </div>

              {/* Photographic vignette overlay to enhance contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-slate-950/20 pointer-events-none" />

              {/* Top-left status pill */}
              <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 backdrop-blur-md border border-teal-500/40 text-[11px] sm:text-xs font-semibold text-teal-200 shadow-lg shadow-black/40">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500" />
                </span>
                <span>HogTech Visual Hub</span>
              </div>

              {/* Top-right Action Buttons */}
              <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsFullscreenModalOpen(true)}
                  className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-slate-900/85 hover:bg-slate-800 backdrop-blur-md border border-slate-700/80 text-[11px] font-semibold text-slate-300 hover:text-white transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-teal-400 flex items-center gap-1.5"
                  title="Expand Fullscreen Image"
                  aria-label="View Image Fullscreen"
                >
                  <Maximize2 className="w-3.5 h-3.5 text-teal-400" />
                  <span className="hidden sm:inline">Zoom</span>
                </button>

                {onOpenLogoModal && (
                  <button
                    type="button"
                    onClick={onOpenLogoModal}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900/85 hover:bg-slate-800 backdrop-blur-md border border-teal-500/30 text-[11px] font-semibold text-teal-300 hover:text-white transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-teal-400"
                    title="View official HogTech logo details"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                    <span className="hidden sm:inline">Brand Logo</span>
                  </button>
                )}
              </div>

              {/* Interactive View Switcher Tabs inside frame */}
              <div className="absolute bottom-12 sm:bottom-14 left-3 right-3 sm:left-4 sm:right-4 z-10 flex items-center justify-between gap-2">
                <div className="inline-flex p-1 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700/80 shadow-lg">
                  <button
                    type="button"
                    onClick={() => setActiveView('hero')}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-medium transition-all ${
                      activeView === 'hero'
                        ? 'bg-teal-500 text-slate-950 font-bold shadow-sm'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    <ImageIcon className="w-3 h-3" />
                    <span>Hero Showcase</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveView('workspace')}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-medium transition-all ${
                      activeView === 'workspace'
                        ? 'bg-teal-500 text-slate-950 font-bold shadow-sm'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    <Monitor className="w-3 h-3" />
                    <span>Workstation</span>
                  </button>
                </div>
              </div>

              {/* Bottom summary bar inside frame */}
              <div className="absolute bottom-2.5 left-2.5 right-2.5 sm:bottom-3 sm:left-3 sm:right-3 flex items-center justify-between gap-2 text-[11px] sm:text-xs text-slate-300 bg-slate-950/85 backdrop-blur-md px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl border border-slate-800/80">
                <span className="flex items-center gap-1.5 text-teal-300 font-semibold truncate">
                  <Monitor className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">
                    {activeView === 'hero' ? 'Official HogTech Showcase' : 'Modern Workstations & Tech Hub'}
                  </span>
                </span>
                <span className="text-slate-400 hidden xs:inline flex-shrink-0">76 Ekpo Abasi St, Calabar</span>
              </div>
            </div>
          </motion.div>

          {/* Floating Information Card: “Professional Digital Services” */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16, scale: 0.95 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.6,
              delay: shouldReduceMotion ? 0 : 0.45,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            className="absolute -bottom-5 sm:-bottom-6 -left-3 sm:-left-6 z-20 max-w-[270px] sm:max-w-[310px] p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-slate-900/95 backdrop-blur-md border border-teal-500/40 shadow-xl shadow-slate-950/70"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-400 flex items-center justify-center text-slate-950 shadow-md shadow-teal-900/40 flex-shrink-0">
                <ShieldCheck className="w-5 h-5 text-slate-950" />
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-xs sm:text-sm text-white tracking-tight leading-snug">
                  Professional Digital Services
                </h4>
                <p className="text-[10px] sm:text-[11px] text-teal-300 font-medium flex items-center gap-1 mt-0.5 truncate">
                  <CheckCircle2 className="w-3 h-3 text-teal-400 flex-shrink-0" />
                  <span>Printing · Typing · Training · Design</span>
                </p>
              </div>
            </div>
          </motion.div>

          {/* Subtle decorative floating tech micro-badge on right */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.9 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
            transition={{
              duration: 0.5,
              delay: shouldReduceMotion ? 0 : 0.6,
              ease: 'easeOut',
            }}
            className="hidden sm:flex absolute -top-4 -right-3 z-20 items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 backdrop-blur-md border border-teal-500/40 shadow-lg text-[11px] font-semibold text-slate-200"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Fast Turnaround</span>
          </motion.div>
        </motion.div>
      </div>

      {/* Fullscreen Lightbox Modal for Hero Image */}
      {isFullscreenModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-lg animate-in fade-in duration-200"
          onClick={() => setIsFullscreenModalOpen(false)}
        >
          <div
            className="relative max-w-4xl w-full bg-slate-900 border border-teal-500/40 rounded-2xl overflow-hidden shadow-2xl p-4 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-teal-500/20 text-teal-400">
                  <ImageIcon className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white">
                    {activeView === 'hero'
                      ? 'HogTech Official Hero Image (Hogetech_hero_images.jpeg)'
                      : 'HogTech Workstation Workspace'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    High-resolution official business asset
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsFullscreenModalOpen(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-teal-400"
              >
                Close (ESC)
              </button>
            </div>

            <div className="relative rounded-xl overflow-hidden bg-slate-950 flex items-center justify-center max-h-[70vh]">
              <img
                src={currentImageSrc}
                alt={currentAlt}
                className="max-h-[70vh] w-auto object-contain rounded-lg"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 pt-1">
              <span>HogTech International Ventures · Calabar, Cross River State</span>
              <div className="flex items-center gap-2">
                <a
                  href={currentImageSrc}
                  download={activeView === 'hero' ? 'Hogtech_hero_image.jpeg' : 'Hogtech_workspace.jpg'}
                  className="px-3 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold transition-all focus:outline-none"
                >
                  Download Image
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
