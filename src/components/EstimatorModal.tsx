import React, { useEffect } from 'react';
import { X, Calculator } from 'lucide-react';
import { PrintEstimator } from './PrintEstimator.tsx';
import { CompanySettings } from '../types/index.ts';

interface EstimatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: CompanySettings;
  onRequestQuoteWithDetails?: (details: string, category: string, item: string) => void;
}

export const EstimatorModal: React.FC<EstimatorModalProps> = ({
  isOpen,
  onClose,
  settings,
  onRequestQuoteWithDetails,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="estimator-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-4xl my-auto max-h-[92vh] overflow-y-auto rounded-3xl shadow-2xl focus:outline-none">
        {/* Floating Close Button */}
        <button
          onClick={onClose}
          type="button"
          aria-label="Close Estimator Modal"
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-900/80 text-white hover:bg-slate-800 border border-slate-700/80 transition-transform active:scale-90"
        >
          <X className="w-5 h-5" />
        </button>

        <PrintEstimator
          settings={settings}
          onRequestQuoteWithDetails={(details, category, item) => {
            onClose();
            if (onRequestQuoteWithDetails) {
              onRequestQuoteWithDetails(details, category, item);
            }
          }}
        />
      </div>
    </div>
  );
};
