import React, { useState, useMemo } from 'react';
import {
  Calculator,
  Printer,
  FileText,
  Layers,
  Sparkles,
  Clock,
  Check,
  Copy,
  MessageSquare,
  ArrowRight,
  RotateCcw,
  Info,
  Zap,
  Tag,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  FileCheck,
  CreditCard,
  Flame
} from 'lucide-react';
import { CompanySettings } from '../types/index.ts';

export type TaskType =
  | 'bw-print'
  | 'color-print'
  | 'photocopy'
  | 'thesis-project'
  | 'flyers-brochures'
  | 'plastic-id'
  | 'business-cards';

export type PaperQuality = '70gsm' | '80gsm' | '100gsm' | '250gsm';
export type PaperSize = 'a4' | 'a3' | 'a5';
export type PrintSides = 'simplex' | 'duplex';
export type FinishingType = 'none' | 'staple' | 'spiral' | 'hardcover' | 'lamination';
export type UrgencyType = 'standard' | 'express';

interface PrintEstimatorProps {
  settings: CompanySettings;
  onRequestQuoteWithDetails?: (details: string, category: string, item: string) => void;
  className?: string;
  isCompact?: boolean;
}

interface PresetConfig {
  id: string;
  label: string;
  icon: string;
  task: TaskType;
  pages: number;
  quality: PaperQuality;
  size: PaperSize;
  sides: PrintSides;
  finishing: FinishingType;
  urgency: UrgencyType;
}

const PRESETS: PresetConfig[] = [
  {
    id: 'student-project',
    label: 'University Project',
    icon: '🎓',
    task: 'thesis-project',
    pages: 65,
    quality: '80gsm',
    size: 'a4',
    sides: 'simplex',
    finishing: 'spiral',
    urgency: 'standard',
  },
  {
    id: 'office-report',
    label: 'Corporate Duplex Report',
    icon: '🏢',
    task: 'bw-print',
    pages: 120,
    quality: '80gsm',
    size: 'a4',
    sides: 'duplex',
    finishing: 'staple',
    urgency: 'standard',
  },
  {
    id: 'color-flyers',
    label: 'A5 Event Flyers',
    icon: '🎨',
    task: 'flyers-brochures',
    pages: 200,
    quality: '250gsm',
    size: 'a5',
    sides: 'simplex',
    finishing: 'none',
    urgency: 'standard',
  },
  {
    id: 'staff-id',
    label: 'PVC Staff ID Cards',
    icon: '💳',
    task: 'plastic-id',
    pages: 20,
    quality: '250gsm',
    size: 'a4',
    sides: 'simplex',
    finishing: 'none',
    urgency: 'standard',
  },
  {
    id: 'fast-handouts',
    label: 'Lecture Handouts',
    icon: '📄',
    task: 'photocopy',
    pages: 250,
    quality: '70gsm',
    size: 'a4',
    sides: 'duplex',
    finishing: 'staple',
    urgency: 'standard',
  },
];

export const PrintEstimator: React.FC<PrintEstimatorProps> = ({
  settings,
  onRequestQuoteWithDetails,
  className = '',
  isCompact = false,
}) => {
  // Config state
  const [task, setTask] = useState<TaskType>('bw-print');
  const [pages, setPages] = useState<number>(50);
  const [quality, setQuality] = useState<PaperQuality>('80gsm');
  const [size, setSize] = useState<PaperSize>('a4');
  const [sides, setSides] = useState<PrintSides>('simplex');
  const [finishing, setFinishing] = useState<FinishingType>('none');
  const [urgency, setUrgency] = useState<UrgencyType>('standard');
  const [currency, setCurrency] = useState<'NGN' | 'USD'>('NGN');
  const [showBreakdown, setShowBreakdown] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Conversion rate for USD reference (~1,500 NGN = 1 USD)
  const NGN_TO_USD_RATE = 1500;

  // Handler for loading presets
  const applyPreset = (preset: PresetConfig) => {
    setTask(preset.task);
    setPages(preset.pages);
    setQuality(preset.quality);
    setSize(preset.size);
    setSides(preset.sides);
    setFinishing(preset.finishing);
    setUrgency(preset.urgency);
  };

  // Reset to clean default
  const handleReset = () => {
    setTask('bw-print');
    setPages(50);
    setQuality('80gsm');
    setSize('a4');
    setSides('simplex');
    setFinishing('none');
    setUrgency('standard');
  };

  // Pricing engine calculation
  const quoteCalculation = useMemo(() => {
    // 1. Base unit rate per page/item (Low and High range) in NGN
    let baseRateLow = 40;
    let baseRateHigh = 60;

    switch (task) {
      case 'bw-print':
        baseRateLow = 45;
        baseRateHigh = 65;
        break;
      case 'color-print':
        baseRateLow = 140;
        baseRateHigh = 190;
        break;
      case 'photocopy':
        baseRateLow = 25;
        baseRateHigh = 35;
        break;
      case 'thesis-project':
        baseRateLow = 50;
        baseRateHigh = 75;
        break;
      case 'flyers-brochures':
        baseRateLow = 110;
        baseRateHigh = 160;
        break;
      case 'plastic-id':
        baseRateLow = 1200;
        baseRateHigh = 1700;
        break;
      case 'business-cards':
        // priced per pack of 100
        baseRateLow = 45;
        baseRateHigh = 65;
        break;
    }

    // 2. Paper Quality modifier (for paper-based tasks)
    if (task !== 'plastic-id') {
      switch (quality) {
        case '70gsm':
          // Standard economy bond
          baseRateLow *= 0.9;
          baseRateHigh *= 0.9;
          break;
        case '80gsm':
          // Baseline premium bond
          baseRateLow *= 1.0;
          baseRateHigh *= 1.0;
          break;
        case '100gsm':
          // Smooth heavy bond
          baseRateLow *= 1.35;
          baseRateHigh *= 1.35;
          break;
        case '250gsm':
          // Thick cardstock / art board
          baseRateLow *= 2.1;
          baseRateHigh *= 2.1;
          break;
      }
    }

    // 3. Paper Size multiplier
    if (task !== 'plastic-id') {
      switch (size) {
        case 'a4':
          // baseline standard
          break;
        case 'a3':
          baseRateLow *= 1.9;
          baseRateHigh *= 1.9;
          break;
        case 'a5':
          baseRateLow *= 0.65;
          baseRateHigh *= 0.65;
          break;
      }
    }

    // 4. Print Sides (Duplex saves paper sheets, ink charged for 2 sides with slight discount)
    let effectiveUnits = pages;
    let paperPrintCostLow = 0;
    let paperPrintCostHigh = 0;

    if (task === 'plastic-id') {
      paperPrintCostLow = pages * baseRateLow;
      paperPrintCostHigh = pages * baseRateHigh;
    } else if (sides === 'duplex') {
      // Duplex: pages printed on pages/2 sheets. Ink is 2 sides (0.85x each side = 1.7x total)
      const duplexMultiplier = 1.65;
      paperPrintCostLow = pages * (baseRateLow * (duplexMultiplier / 2));
      paperPrintCostHigh = pages * (baseRateHigh * (duplexMultiplier / 2));
    } else {
      paperPrintCostLow = pages * baseRateLow;
      paperPrintCostHigh = pages * baseRateHigh;
    }

    // 5. Finishing & Binding costs
    let finishingCostLow = 0;
    let finishingCostHigh = 0;
    let finishingLabel = 'None';

    switch (finishing) {
      case 'none':
        finishingLabel = 'Loose / Unbound';
        break;
      case 'staple':
        finishingLabel = 'Corner Stapling / 2-Hole Punch';
        finishingCostLow = pages > 100 ? 300 : 150;
        finishingCostHigh = pages > 100 ? 500 : 250;
        break;
      case 'spiral':
        finishingLabel = 'Spiral / Comb Binding (Clear Cover & Spine)';
        if (pages <= 80) {
          finishingCostLow = 800;
          finishingCostHigh = 1200;
        } else if (pages <= 200) {
          finishingCostLow = 1400;
          finishingCostHigh = 1800;
        } else {
          finishingCostLow = 2000;
          finishingCostHigh = 2600;
        }
        break;
      case 'hardcover':
        finishingLabel = 'Hardcover Gold-Embossed Thesis Binding';
        finishingCostLow = 4500;
        finishingCostHigh = 6500;
        break;
      case 'lamination':
        finishingLabel = 'Full Heat Pouch Lamination';
        const lamRateLow = size === 'a3' ? 500 : 250;
        const lamRateHigh = size === 'a3' ? 700 : 400;
        const sheetsToLam = sides === 'duplex' ? Math.ceil(pages / 2) : pages;
        finishingCostLow = sheetsToLam * lamRateLow;
        finishingCostHigh = sheetsToLam * lamRateHigh;
        break;
    }

    // 6. Subtotal before volume discount
    const subtotalLow = paperPrintCostLow + finishingCostLow;
    const subtotalHigh = paperPrintCostHigh + finishingCostHigh;

    // 7. Bulk Quantity Discount Tier
    let discountPercent = 0;
    if (task !== 'plastic-id') {
      if (pages >= 500) {
        discountPercent = 25;
      } else if (pages >= 200) {
        discountPercent = 18;
      } else if (pages >= 50) {
        discountPercent = 10;
      }
    } else {
      // for plastic IDs
      if (pages >= 50) discountPercent = 20;
      else if (pages >= 20) discountPercent = 12;
      else if (pages >= 10) discountPercent = 6;
    }

    const discountAmountLow = subtotalLow * (discountPercent / 100);
    const discountAmountHigh = subtotalHigh * (discountPercent / 100);

    const discountedLow = subtotalLow - discountAmountLow;
    const discountedHigh = subtotalHigh - discountAmountHigh;

    // 8. Urgency Multiplier
    const urgencyMultiplier = urgency === 'express' ? 1.25 : 1.0;
    const finalLow = Math.round((discountedLow * urgencyMultiplier) / 50) * 50;
    const finalHigh = Math.round((discountedHigh * urgencyMultiplier) / 50) * 50;

    // Minimum job threshold
    const clampedLow = Math.max(finalLow, task === 'plastic-id' ? 1500 : 200);
    const clampedHigh = Math.max(finalHigh, task === 'plastic-id' ? 2000 : 300);

    const perPageLow = Math.round(clampedLow / pages);
    const perPageHigh = Math.round(clampedHigh / pages);

    // Estimated turnaround
    let estimatedTurnaround = 'Same Day (1–3 hours)';
    if (urgency === 'express') {
      estimatedTurnaround = 'Priority Rush (Under 60 mins)';
    } else if (pages >= 500 || finishing === 'hardcover') {
      estimatedTurnaround = '24 to 48 hours';
    } else if (pages >= 200 || finishing === 'spiral') {
      estimatedTurnaround = 'Same Day (2–5 hours)';
    }

    return {
      finalLow: clampedLow,
      finalHigh: clampedHigh,
      perPageLow,
      perPageHigh,
      discountPercent,
      discountAmountLow,
      discountAmountHigh,
      finishingCostLow,
      finishingCostHigh,
      finishingLabel,
      paperPrintCostLow,
      paperPrintCostHigh,
      estimatedTurnaround,
      effectiveSheets: sides === 'duplex' ? Math.ceil(pages / 2) : pages,
    };
  }, [task, pages, quality, size, sides, finishing, urgency]);

  // Formatter for Currency
  const formatMoney = (amountNgn: number) => {
    if (currency === 'USD') {
      const usdVal = amountNgn / NGN_TO_USD_RATE;
      return `$${usdVal.toFixed(2)}`;
    }
    return `₦${amountNgn.toLocaleString('en-NG')}`;
  };

  // Task human label
  const getTaskLabel = () => {
    switch (task) {
      case 'bw-print':
        return 'Black & White Printing';
      case 'color-print':
        return 'Full Color Laser Printing';
      case 'photocopy':
        return 'High-Speed Photocopying';
      case 'thesis-project':
        return 'Academic Project / Thesis';
      case 'flyers-brochures':
        return 'Flyers & Promotional Materials';
      case 'plastic-id':
        return 'PVC Plastic ID Cards';
      case 'business-cards':
        return 'Business / Complimentary Cards';
    }
  };

  const getQualityLabel = () => {
    switch (quality) {
      case '70gsm':
        return '70 GSM Economy Bond';
      case '80gsm':
        return '80 GSM Premium Bright White';
      case '100gsm':
        return '100–120 GSM Executive Smooth';
      case '250gsm':
        return '250–300 GSM Heavy Cardstock';
    }
  };

  // Summary string for clipboard and WhatsApp
  const generateSummaryText = () => {
    return [
      `*HOGTECH PRINTING & DOCUMENT ESTIMATE*`,
      `• Service: ${getTaskLabel()}`,
      `• Quantity: ${pages} ${task === 'plastic-id' ? 'cards' : 'pages'}`,
      task !== 'plastic-id' ? `• Paper Quality: ${getQualityLabel()}` : '',
      task !== 'plastic-id' ? `• Size: ${size.toUpperCase()}` : '',
      task !== 'plastic-id' ? `• Print Mode: ${sides === 'duplex' ? 'Double-sided (Duplex)' : 'Single-sided (Simplex)'}` : '',
      `• Finishing: ${quoteCalculation.finishingLabel}`,
      `• Turnaround: ${urgency === 'express' ? 'Priority Express Rush' : 'Standard'} (${quoteCalculation.estimatedTurnaround})`,
      quoteCalculation.discountPercent > 0 ? `• Tier Discount: ${quoteCalculation.discountPercent}% bulk savings applied` : '',
      `• Estimated Range: ₦${quoteCalculation.finalLow.toLocaleString()} – ₦${quoteCalculation.finalHigh.toLocaleString()}`,
      `• Average per page: ~₦${quoteCalculation.perPageLow} – ₦${quoteCalculation.perPageHigh}`,
      `_Note: Rough planning estimate. Final price confirmed upon digital file review at 76 Ekpo Abasi Street, Calabar._`,
    ]
      .filter(Boolean)
      .join('\n');
  };

  // Handle Copy
  const handleCopySummary = async () => {
    try {
      await navigator.clipboard.writeText(generateSummaryText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.warn('Clipboard write failed:', err);
    }
  };

  // WhatsApp Click
  const cleanWaNumber = settings.whatsappNumber.replace(/[^0-9]/g, '');
  const waEstimateUrl = `https://wa.me/${cleanWaNumber}?text=${encodeURIComponent(
    `Hello HogTech International Ventures!\n\nI generated an estimate using your website Printing Tool:\n\n${generateSummaryText()}\n\nPlease let me know when I can submit my files or bring my job.`
  )}`;

  // Handle Request Quote Form click
  const handleTransferToModal = () => {
    if (onRequestQuoteWithDetails) {
      onRequestQuoteWithDetails(
        generateSummaryText(),
        'Printing & Document Services',
        getTaskLabel()
      );
    }
  };

  return (
    <div
      id="printing-estimator"
      className={`rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden transition-all ${className}`}
    >
      {/* Header bar */}
      <div className="bg-gradient-to-r from-[#081426] via-[#0c1c36] to-[#0f2444] text-white p-6 sm:p-8 border-b border-slate-800 relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-300 text-xs font-semibold">
              <Calculator className="w-3.5 h-3.5" />
              <span>Interactive Cost Calculator</span>
            </div>
            <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
              Instant Printing & Document Estimator
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Calculate realistic pricing for photocopying, thesis binding, laser colour printing, flyers, and laminating before bringing your documents to 76 Ekpo Abasi Street.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
            {/* Currency selector */}
            <div className="inline-flex p-1 bg-slate-800/80 rounded-xl border border-slate-700/80 text-xs font-medium">
              <button
                type="button"
                onClick={() => setCurrency('NGN')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  currency === 'NGN'
                    ? 'bg-teal-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
                aria-label="Display prices in Nigerian Naira"
              >
                ₦ NGN
              </button>
              <button
                type="button"
                onClick={() => setCurrency('USD')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  currency === 'USD'
                    ? 'bg-teal-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
                aria-label="Display approximate prices in US Dollars"
              >
                $ USD
              </button>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/80 transition-colors"
              title="Reset Estimator"
              aria-label="Reset Estimator to Defaults"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Popular Task Presets */}
        <div className="mt-6 pt-5 border-t border-slate-800/80">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span>Quick Presets:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => applyPreset(p)}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-800/60 hover:bg-slate-700/80 text-xs font-medium text-slate-200 border border-slate-700/60 transition-all hover:scale-105 active:scale-95"
              >
                <span>{p.icon}</span>
                <span>{p.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid: Options on Left, Live Estimate Card on Right */}
      <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Task Selection */}
          <div className="space-y-2.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              1. Select Service / Document Task
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {[
                { id: 'bw-print', label: 'B&W Print', icon: Printer, desc: 'Everyday docs' },
                { id: 'color-print', label: 'Color Laser', icon: Sparkles, desc: 'Crisp vibrant' },
                { id: 'photocopy', label: 'Photocopy', icon: FileText, desc: 'High-speed copies' },
                { id: 'thesis-project', label: 'Thesis / Project', icon: FileCheck, desc: 'Academic format' },
                { id: 'flyers-brochures', label: 'Flyers / Posters', icon: Layers, desc: 'Glossy handbills' },
                { id: 'plastic-id', label: 'Plastic ID Card', icon: CreditCard, desc: 'PVC badge' },
              ].map((t) => {
                const Icon = t.icon;
                const active = task === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTask(t.id as TaskType)}
                    className={`p-3 rounded-2xl text-left border transition-all flex flex-col justify-between ${
                      active
                        ? 'border-teal-500 bg-teal-50/70 dark:bg-teal-950/40 text-teal-950 dark:text-teal-200 ring-2 ring-teal-500/20 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <Icon
                        className={`w-4 h-4 ${
                          active ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400'
                        }`}
                      />
                      {active && <Check className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />}
                    </div>
                    <div className="font-bold text-xs sm:text-sm">{t.label}</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {t.desc}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Page / Quantity Slider & Stepper */}
          <div className="space-y-3 p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <label
                  htmlFor="pages-input"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300"
                >
                  2. {task === 'plastic-id' ? 'Quantity of Cards' : 'Page Count / Copies'}
                </label>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {task === 'plastic-id'
                    ? 'Total number of staff badges to produce'
                    : 'Total document pages to be printed or photocopied'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="pages-input"
                  type="number"
                  min={1}
                  max={2000}
                  value={pages}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    setPages(isNaN(val) ? 1 : Math.max(1, Math.min(val, 2000)));
                  }}
                  className="w-20 px-3 py-1.5 text-center font-bold text-base bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  aria-label="Specific page or quantity count"
                />
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {task === 'plastic-id' ? 'cards' : 'pgs'}
                </span>
              </div>
            </div>

            {/* Slider */}
            <div className="space-y-2 pt-1">
              <input
                type="range"
                min={task === 'plastic-id' ? 1 : 5}
                max={task === 'plastic-id' ? 100 : 500}
                step={task === 'plastic-id' ? 1 : 5}
                value={pages}
                onChange={(e) => setPages(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-500"
                aria-label="Quantity slider"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                <span>{task === 'plastic-id' ? '1 card' : '5 pgs'}</span>
                <span>{task === 'plastic-id' ? '25 cards' : '100 pgs'}</span>
                <span>{task === 'plastic-id' ? '50 cards' : '250 pgs'}</span>
                <span>{task === 'plastic-id' ? '100 cards' : '500+ pgs'}</span>
              </div>
            </div>

            {/* Quick Quantity Buttons */}
            <div className="flex items-center gap-1.5 pt-1 overflow-x-auto">
              {(task === 'plastic-id' ? [5, 10, 25, 50, 100] : [20, 50, 100, 200, 500]).map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setPages(num)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                    pages === num
                      ? 'bg-teal-600 text-white'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-slate-400'
                  }`}
                >
                  {num} {task === 'plastic-id' ? 'cards' : 'pgs'}
                </button>
              ))}
            </div>

            {quoteCalculation.discountPercent > 0 && (
              <div className="flex items-center gap-2 p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
                <Tag className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>
                  Bulk Volume Tier unlocked: <strong>{quoteCalculation.discountPercent}% OFF</strong> standard counter rate!
                </span>
              </div>
            )}
          </div>

          {/* 3. Paper Quality & Grammage (if paper-based) */}
          {task !== 'plastic-id' && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  3. Paper Weight & Quality (GSM)
                </label>
                <span className="text-[11px] text-teal-600 dark:text-teal-400 font-semibold">
                  {getQualityLabel()}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  {
                    id: '70gsm',
                    title: '70 GSM Economy Bond',
                    desc: 'Everyday draft copies, class notes, handouts',
                    tag: 'Most Economical',
                  },
                  {
                    id: '80gsm',
                    title: '80 GSM Premium Bright',
                    desc: 'Standard for academic theses, office reports, CVs',
                    tag: 'Recommended',
                  },
                  {
                    id: '100gsm',
                    title: '100–120 GSM Smooth Heavy',
                    desc: 'Executive proposals, cover letters, contracts',
                    tag: 'High Opacity',
                  },
                  {
                    id: '250gsm',
                    title: '250–300 GSM Heavy Cardstock',
                    desc: 'Rigid covers, event flyers, certificates, cards',
                    tag: 'Rigid Stock',
                  },
                ].map((q) => {
                  const active = quality === q.id;
                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => setQuality(q.id as PaperQuality)}
                      className={`p-3 rounded-2xl text-left border transition-all ${
                        active
                          ? 'border-teal-500 bg-teal-50/70 dark:bg-teal-950/40 text-teal-950 dark:text-teal-100 ring-2 ring-teal-500/20 shadow-sm'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs sm:text-sm">{q.title}</span>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                            active
                              ? 'bg-teal-600 text-white'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          {q.tag}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                        {q.desc}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 4. Paper Size & Print Sides (Simplex / Duplex) */}
          {task !== 'plastic-id' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Paper Size */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Paper Size
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'a4', label: 'A4', sub: 'Standard (210×297)' },
                    { id: 'a3', label: 'A3', sub: 'Large (297×420)' },
                    { id: 'a5', label: 'A5', sub: 'Compact (148×210)' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSize(s.id as PaperSize)}
                      className={`p-2.5 rounded-xl text-center border transition-all ${
                        size === s.id
                          ? 'border-teal-500 bg-teal-50 dark:bg-teal-950/40 text-teal-900 dark:text-teal-200 font-bold'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="text-sm font-extrabold">{s.label}</div>
                      <div className="text-[9px] text-slate-400 leading-none mt-0.5">{s.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Simplex / Duplex */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Printing Sides
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'simplex', label: 'Single-Sided', sub: '1 page per sheet' },
                    { id: 'duplex', label: 'Back-to-Back', sub: 'Duplex (saves paper)' },
                  ].map((mode) => (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setSides(mode.id as PrintSides)}
                      className={`p-2.5 rounded-xl text-center border transition-all ${
                        sides === mode.id
                          ? 'border-teal-500 bg-teal-50 dark:bg-teal-950/40 text-teal-900 dark:text-teal-200 font-bold'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="text-xs sm:text-sm font-bold">{mode.label}</div>
                      <div className="text-[9px] text-slate-400 leading-none mt-0.5">{mode.sub}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 5. Finishing & Binding Options */}
          <div className="space-y-2.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              4. Document Finishing & Binding Add-On
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: 'none', label: 'None (Loose / Pouch)', price: '₦0' },
                { id: 'staple', label: 'Corner Staple / Punch', price: '+₦150 – ₦300' },
                { id: 'spiral', label: 'Spiral / Plastic Comb', price: '+₦800 – ₦2,000' },
                { id: 'hardcover', label: 'Hardcover Gold Stamping', price: '+₦4,500 – ₦6,500' },
                { id: 'lamination', label: 'Full Heat Lamination', price: '+₦250/sheet' },
              ].map((f) => {
                const active = finishing === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFinishing(f.id as FinishingType)}
                    className={`p-2.5 rounded-xl text-left border transition-all ${
                      active
                        ? 'border-teal-500 bg-teal-50 dark:bg-teal-950/40 text-teal-950 dark:text-teal-200 font-bold ring-2 ring-teal-500/20'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="text-xs font-bold">{f.label}</div>
                    <div className="text-[10px] text-teal-600 dark:text-teal-400 font-medium mt-0.5">
                      {f.price}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 6. Urgency & Speed */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              5. Turnaround Urgency
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setUrgency('standard')}
                className={`p-3 rounded-xl text-left border transition-all flex items-center justify-between ${
                  urgency === 'standard'
                    ? 'border-teal-500 bg-teal-50 dark:bg-teal-950/40 text-teal-950 dark:text-teal-200 font-bold'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div>
                  <div className="text-xs sm:text-sm font-bold flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-teal-600" />
                    <span>Standard Queue</span>
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Regular business turnaround
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-400">Normal</span>
              </button>

              <button
                type="button"
                onClick={() => setUrgency('express')}
                className={`p-3 rounded-xl text-left border transition-all flex items-center justify-between ${
                  urgency === 'express'
                    ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-950 dark:text-amber-200 font-bold ring-2 ring-amber-500/20'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div>
                  <div className="text-xs sm:text-sm font-bold flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-amber-500" />
                    <span>Priority Rush</span>
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Immediate queue leapfrog
                  </div>
                </div>
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400">+25%</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Live Estimate Card & Actions (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          <div className="p-6 rounded-3xl bg-gradient-to-b from-slate-900 to-[#081426] text-white border border-slate-800 shadow-2xl relative overflow-hidden space-y-6">
            {/* Top Badge */}
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>Estimated Price Range</span>
              </span>
              <span className="text-[10px] px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
                {quoteCalculation.estimatedTurnaround}
              </span>
            </div>

            {/* Giant Price Box */}
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
                {formatMoney(quoteCalculation.finalLow)} – {formatMoney(quoteCalculation.finalHigh)}
              </div>
              <p className="text-xs text-slate-300 flex items-center gap-1">
                <span>Equivalent to approximately</span>
                <span className="font-bold text-teal-300">
                  {formatMoney(quoteCalculation.perPageLow)} – {formatMoney(quoteCalculation.perPageHigh)}
                </span>
                <span>per {task === 'plastic-id' ? 'card' : 'page'}</span>
              </p>
            </div>

            {/* Selected Spec Pills */}
            <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-2 text-xs">
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Job Task:</span>
                <span className="font-semibold text-white">{getTaskLabel()}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Quantity:</span>
                <span className="font-semibold text-white">
                  {pages} {task === 'plastic-id' ? 'cards' : `pages (${quoteCalculation.effectiveSheets} sheets)`}
                </span>
              </div>
              {task !== 'plastic-id' && (
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Specs:</span>
                  <span className="font-semibold text-white">
                    {size.toUpperCase()} · {quality} · {sides === 'duplex' ? 'Duplex' : 'Simplex'}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Finishing:</span>
                <span className="font-semibold text-teal-300">{quoteCalculation.finishingLabel}</span>
              </div>
              {quoteCalculation.discountPercent > 0 && (
                <div className="flex justify-between text-emerald-400 pt-1 border-t border-slate-700/60">
                  <span>Volume Discount:</span>
                  <span className="font-bold">-{quoteCalculation.discountPercent}% Saved</span>
                </div>
              )}
            </div>

            {/* Interactive Breakdown Toggle */}
            <div className="border-t border-slate-800 pt-3">
              <button
                type="button"
                onClick={() => setShowBreakdown(!showBreakdown)}
                className="w-full flex items-center justify-between text-xs text-slate-400 hover:text-white py-1 focus:outline-none"
              >
                <span className="flex items-center gap-1 font-semibold">
                  <Info className="w-3.5 h-3.5 text-teal-400" />
                  <span>How This Estimate is Calculated</span>
                </span>
                {showBreakdown ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showBreakdown && (
                <div className="mt-3 p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs space-y-2 animate-in fade-in duration-150">
                  <div className="flex justify-between text-slate-400">
                    <span>Base Print & Paper:</span>
                    <span className="font-mono text-slate-200">
                      {formatMoney(quoteCalculation.paperPrintCostLow)} – {formatMoney(quoteCalculation.paperPrintCostHigh)}
                    </span>
                  </div>
                  {quoteCalculation.finishingCostLow > 0 && (
                    <div className="flex justify-between text-slate-400">
                      <span>Finishing / Add-on:</span>
                      <span className="font-mono text-slate-200">
                        {formatMoney(quoteCalculation.finishingCostLow)} – {formatMoney(quoteCalculation.finishingCostHigh)}
                      </span>
                    </div>
                  )}
                  {quoteCalculation.discountPercent > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Volume Discount (-{quoteCalculation.discountPercent}%):</span>
                      <span className="font-mono">
                        -{formatMoney(quoteCalculation.discountAmountLow)} – -{formatMoney(quoteCalculation.discountAmountHigh)}
                      </span>
                    </div>
                  )}
                  {urgency === 'express' && (
                    <div className="flex justify-between text-amber-400">
                      <span>Priority Rush Factor:</span>
                      <span className="font-mono">+25%</span>
                    </div>
                  )}
                  <p className="text-[10px] text-slate-500 pt-1.5 border-t border-slate-800 leading-tight">
                    *Actual counter quote may vary based on exact toner coverage, custom paper grain, or specialized graphic design prep.
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-2">
              <a
                href={waEstimateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold text-sm shadow-lg active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-teal-400"
              >
                <MessageSquare className="w-4 h-4 fill-slate-950/10" />
                <span>Book Job on WhatsApp</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              {onRequestQuoteWithDetails && (
                <button
                  type="button"
                  onClick={handleTransferToModal}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition-colors focus:outline-none"
                >
                  <FileText className="w-4 h-4 text-teal-400" />
                  <span>Submit as Formal Website Request</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleCopySummary}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/40 text-xs transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-semibold">Estimate Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Estimate Summary to Clipboard</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Counter Info */}
          <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800/40 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
            <div className="text-xs text-teal-950 dark:text-teal-200 space-y-0.5">
              <span className="font-bold">Physical Counter Guarantee:</span>
              <p className="text-teal-900/80 dark:text-teal-300/80 leading-relaxed">
                Bring your USB flash drive or send files via WhatsApp/Email to <strong>76 Ekpo Abasi Street, Calabar</strong>. We proof every file before printing!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
