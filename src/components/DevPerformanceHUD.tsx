import React, { useState, useEffect } from 'react';
import {
  Activity,
  Zap,
  Clock,
  Layers,
  ChevronDown,
  ChevronUp,
  X,
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  AlertTriangle,
  Code,
  Image as ImageIcon
} from 'lucide-react';
import { perfLogger, PageTransitionMetric } from '../utils/perfLogger.ts';

interface DevPerformanceHUDProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const DevPerformanceHUD: React.FC<DevPerformanceHUDProps> = ({
  currentPage,
  onNavigate,
}) => {
  const [metrics, setMetrics] = useState<PageTransitionMetric[]>([]);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'transitions' | 'suggestions'>('suggestions');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = perfLogger.subscribe((updated) => {
      setMetrics(updated);
    });
    return unsubscribe;
  }, []);

  // Only render in development mode
  if (!import.meta.env.DEV) {
    return null;
  }

  const latestMetric = metrics[0];

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const getStatusBadge = (status: PageTransitionMetric['status']) => {
    switch (status) {
      case 'optimal':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
            <Zap className="w-2.5 h-2.5" /> ⚡ Optimal (&lt;40ms)
          </span>
        );
      case 'moderate':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-600 border border-amber-500/20">
            <Clock className="w-2.5 h-2.5" /> ⚠️ Moderate (40-100ms)
          </span>
        );
      case 'heavy':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-rose-500/10 text-rose-600 border border-rose-500/20">
            <AlertTriangle className="w-2.5 h-2.5" /> 🐢 Heavy (&gt;100ms)
          </span>
        );
    }
  };

  return (
    <aside
      aria-label="Development Performance HUD"
      className="fixed bottom-3 right-3 z-50 font-sans text-xs select-none max-w-sm sm:max-w-md w-[calc(100vw-24px)]"
    >
      {/* Minimized Pill */}
      {!isExpanded ? (
        <div className="flex items-center justify-end">
          <button
            onClick={() => setIsExpanded(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-full bg-slate-900/95 hover:bg-slate-900 text-white shadow-xl border border-slate-700/80 backdrop-blur-md transition-all hover:scale-105 active:scale-95 group cursor-pointer"
            title="Click to expand Developer Performance Metrics & Lazy-Loading Suggestions"
          >
            <div className="relative flex items-center justify-center">
              <Activity className="w-3.5 h-3.5 text-teal-400 group-hover:rotate-12 transition-transform" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <span className="font-semibold text-slate-200">DevPerf:</span>
            {latestMetric ? (
              <span className="font-mono text-teal-300">
                {latestMetric.durationMs}ms
                <span className="text-slate-400 text-[10px] ml-1">
                  ({latestMetric.toPage})
                </span>
              </span>
            ) : (
              <span className="text-slate-400">Tracking Active</span>
            )}
            <ChevronUp className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-colors" />
          </button>
        </div>
      ) : (
        /* Expanded HUD Drawer */
        <div className="bg-slate-900/95 text-slate-100 rounded-2xl shadow-2xl border border-slate-700/90 backdrop-blur-xl overflow-hidden flex flex-col max-h-[85vh]">
          {/* Header */}
          <div className="px-4 py-3 bg-slate-800/80 border-b border-slate-700/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center border border-teal-500/30">
                <Activity className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                  Dev Performance Monitor
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-teal-500/20 text-teal-300 uppercase">
                    DEV
                  </span>
                </h4>
                <p className="text-[10px] text-slate-400">
                  Current Route:{' '}
                  <span className="text-teal-300 font-mono font-medium">
                    /{currentPage}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => perfLogger.clearMetrics()}
                className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-700/60 transition-colors"
                title="Clear recorded metrics"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsExpanded(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-700/60 transition-colors"
                title="Minimize monitor"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Quick Route Benchmark Bar */}
          <div className="px-4 py-2 bg-slate-800/40 border-b border-slate-700/50 flex items-center gap-2 overflow-x-auto text-[11px] scrollbar-none">
            <span className="text-slate-400 shrink-0 font-medium">Quick Benchmark:</span>
            <button
              onClick={() => onNavigate('portfolio')}
              className={`px-2 py-0.5 rounded font-medium transition-colors shrink-0 ${
                currentPage === 'portfolio'
                  ? 'bg-teal-500 text-slate-950 font-bold'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
              }`}
            >
              Portfolio Gallery
            </button>
            <button
              onClick={() => onNavigate('services')}
              className={`px-2 py-0.5 rounded font-medium transition-colors shrink-0 ${
                currentPage === 'services'
                  ? 'bg-teal-500 text-slate-950 font-bold'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
              }`}
            >
              Services
            </button>
            <button
              onClick={() => onNavigate('home')}
              className={`px-2 py-0.5 rounded font-medium transition-colors shrink-0 ${
                currentPage === 'home'
                  ? 'bg-teal-500 text-slate-950 font-bold'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => onNavigate('about')}
              className={`px-2 py-0.5 rounded font-medium transition-colors shrink-0 ${
                currentPage === 'about'
                  ? 'bg-teal-500 text-slate-950 font-bold'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
              }`}
            >
              About
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-slate-700/80 bg-slate-900/60">
            <button
              onClick={() => setActiveTab('suggestions')}
              className={`flex-1 py-2 px-3 font-semibold text-center transition-colors flex items-center justify-center gap-1.5 border-b-2 ${
                activeTab === 'suggestions'
                  ? 'border-teal-400 text-teal-300 bg-slate-800/40'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Lazy-Loading & Insights
              <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-teal-500/20 text-teal-300">
                {latestMetric?.suggestions.length ?? 3}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('transitions')}
              className={`flex-1 py-2 px-3 font-semibold text-center transition-colors flex items-center justify-center gap-1.5 border-b-2 ${
                activeTab === 'transitions'
                  ? 'border-teal-400 text-teal-300 bg-slate-800/40'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              Transition History
              <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-slate-700 text-slate-300">
                {metrics.length}
              </span>
            </button>
          </div>

          {/* Content Area */}
          <div className="p-3 overflow-y-auto space-y-3 max-h-96">
            {activeTab === 'suggestions' ? (
              <div className="space-y-3">
                {/* Specific Portfolio Gallery Lazy Loading Banner */}
                <div className="p-3 rounded-xl bg-gradient-to-r from-teal-950/40 to-slate-800/80 border border-teal-500/30">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0">
                        <Layers className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider">
                          Heavy Component Analysis
                        </span>
                        <h5 className="font-bold text-white text-xs">
                          Portfolio Gallery Lazy-Loading
                        </h5>
                      </div>
                    </div>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      High Impact
                    </span>
                  </div>

                  <p className="mt-2 text-[11px] text-slate-300 leading-relaxed">
                    The <strong>Portfolio gallery</strong> renders comprehensive client showcases, image lightbox triggers, and project tags. Dynamically loading it via <code className="text-teal-300 bg-slate-800 px-1 py-0.5 rounded">React.lazy</code> decouples heavy assets from initial page load.
                  </p>

                  <div className="mt-2.5 p-2 rounded-lg bg-slate-950/80 border border-slate-800 font-mono text-[10px] text-slate-300 relative group">
                    <div className="flex justify-between items-center pb-1 mb-1 border-b border-slate-800 text-slate-400 text-[9px]">
                      <span>Code Splitting Snippet</span>
                      <button
                        onClick={() =>
                          handleCopy(
                            `// Code-splitting PortfolioPage with Suspense\nconst PortfolioPage = React.lazy(() => import('./pages/PortfolioPage.tsx'));\n\n<React.Suspense fallback={<div className="p-12 text-center text-slate-500">Loading gallery...</div>}>\n  {currentPage === 'portfolio' && <PortfolioPage {...props} />}\n</React.Suspense>`,
                            'portfolio-lazy'
                          )
                        }
                        className="flex items-center gap-1 hover:text-white"
                      >
                        {copiedCode === 'portfolio-lazy' ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" /> Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" /> Copy
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="overflow-x-auto text-teal-300 scrollbar-none whitespace-pre">
{`const PortfolioPage = React.lazy(() => import('./pages/PortfolioPage.tsx'));`}
                    </pre>
                  </div>
                </div>

                {/* Additional Suggestions from Latest Metric */}
                {latestMetric?.suggestions.map((sugg, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Code className="w-3.5 h-3.5 text-teal-400" />
                        <span className="font-semibold text-slate-200 text-[11px]">
                          {sugg.title}
                        </span>
                      </div>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                          sugg.impact === 'High'
                            ? 'bg-rose-500/20 text-rose-300'
                            : sugg.impact === 'Medium'
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-blue-500/20 text-blue-300'
                        }`}
                      >
                        {sugg.impact}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-normal">
                      {sugg.recommendation}
                    </p>
                    {sugg.codeSnippet && (
                      <div className="p-2 rounded bg-slate-950/70 border border-slate-800 font-mono text-[10px] text-teal-300 overflow-x-auto relative group">
                        <button
                          onClick={() => handleCopy(sugg.codeSnippet!, `sugg-${idx}`)}
                          className="absolute top-1.5 right-1.5 text-slate-400 hover:text-white"
                          title="Copy snippet"
                        >
                          {copiedCode === `sugg-${idx}` ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                        <pre className="whitespace-pre">{sugg.codeSnippet}</pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              /* Transitions History List */
              <div className="space-y-2">
                {metrics.length === 0 ? (
                  <div className="py-8 text-center text-slate-400">
                    <p className="text-xs">No page transitions recorded yet.</p>
                    <p className="text-[10px] text-slate-500 mt-1">
                      Navigate between pages or use the benchmark buttons above.
                    </p>
                  </div>
                ) : (
                  metrics.map((m) => (
                    <div
                      key={m.id}
                      className="p-2.5 rounded-lg bg-slate-800/70 border border-slate-700/60 flex items-center justify-between"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-white text-[11px]">
                            {m.fromPage}
                          </span>
                          <span className="text-slate-500">➔</span>
                          <span className="font-bold text-teal-300 text-[11px]">
                            {m.toPage}
                          </span>
                          {getStatusBadge(m.status)}
                        </div>
                        <div className="flex items-center gap-3 text-[10px] text-slate-400">
                          <span>⏱️ {m.durationMs}ms</span>
                          <span>🎨 Paint: {m.renderPhaseMs}ms</span>
                          <span>🌐 {m.domNodes} nodes</span>
                          {m.memoryUsageMb && <span>🧠 {m.memoryUsageMb}MB</span>}
                        </div>
                      </div>
                      <span className="text-[9px] font-mono text-slate-500 shrink-0">
                        {m.timestamp}
                      </span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Footer status */}
          <div className="px-3 py-2 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
            <span>Dev Console: check [Hogtech DevPerf] logs</span>
            <button
              onClick={() => {
                const report = JSON.stringify(metrics, null, 2);
                navigator.clipboard.writeText(report);
                handleCopy(report, 'full-report');
              }}
              className="text-teal-400 hover:text-teal-300 flex items-center gap-1 font-medium cursor-pointer"
            >
              {copiedCode === 'full-report' ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" /> Report Copied
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" /> Export JSON
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};
