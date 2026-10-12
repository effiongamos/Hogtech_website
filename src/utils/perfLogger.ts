/**
 * Development Logging & Performance Utility
 * Tracks client-side page transition latencies, memory footprint,
 * and generates actionable code-splitting & lazy-loading optimization suggestions
 * for heavy components (e.g. Portfolio gallery, Admin portal).
 */

export interface OptimizationSuggestion {
  type: 'lazy-load' | 'image-optimization' | 'code-splitting' | 'prefetch';
  targetComponent: string;
  title: string;
  recommendation: string;
  impact: 'High' | 'Medium' | 'Low';
  codeSnippet?: string;
}

export interface PageTransitionMetric {
  id: string;
  timestamp: string;
  fromPage: string;
  toPage: string;
  durationMs: number;
  renderPhaseMs: number;
  status: 'optimal' | 'moderate' | 'heavy';
  domNodes: number;
  memoryUsageMb?: number;
  suggestions: OptimizationSuggestion[];
}

type MetricsListener = (metrics: PageTransitionMetric[]) => void;

class PerformanceLogger {
  private metrics: PageTransitionMetric[] = [];
  private listeners: Set<MetricsListener> = new Set();
  private maxHistory = 30;

  constructor() {
    // Load persisted history if available in development session storage
    if (typeof window !== 'undefined' && window.sessionStorage) {
      try {
        const saved = sessionStorage.getItem('hogtech_perf_metrics');
        if (saved) {
          this.metrics = JSON.parse(saved);
        }
      } catch {
        // Ignore storage read errors
      }
    }
  }

  /**
   * Evaluates contextual performance heuristics and suggests optimizations
   * especially for heavy components like Portfolio gallery, Admin suite, etc.
   */
  private generateSuggestions(toPage: string, durationMs: number): OptimizationSuggestion[] {
    const suggestions: OptimizationSuggestion[] = [];

    if (toPage === 'portfolio') {
      suggestions.push({
        type: 'lazy-load',
        targetComponent: 'PortfolioPage (Gallery)',
        title: 'Lazy-Load Portfolio Gallery with React.lazy & Suspense',
        recommendation:
          'The Portfolio gallery contains high-resolution project photography, modal zoom overlays, and client work filters. Dynamically lazy-loading this component eliminates ~50KB from the initial JavaScript bundle.',
        impact: 'High',
        codeSnippet: `// In src/App.tsx:
const PortfolioPage = React.lazy(() => import('./pages/PortfolioPage.tsx'));

// Inside <main>:
<Suspense fallback={<PortfolioSkeletonLoader />}>
  {currentPage === 'portfolio' && <PortfolioPage ... />}
</Suspense>`,
      });

      suggestions.push({
        type: 'image-optimization',
        targetComponent: 'Portfolio & Service Images',
        title: 'Intersection-Observer Lazy Loading (Active)',
        recommendation:
          'IntersectionObserver image deferral is active with <LazyImage />. Offscreen portfolio and service images are deferred until within 150px of the viewport, reducing initial image payload and eliminating layout shifts with skeleton placeholders.',
        impact: 'High',
        codeSnippet: `<LazyImage
  src={item.image}
  alt={item.title}
  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
  containerClassName="w-full h-full"
/>`,
      });

      suggestions.push({
        type: 'prefetch',
        targetComponent: 'Navbar Portfolio Link',
        title: 'Prefetch Portfolio Chunk on Hover / Intent',
        recommendation:
          'Preload the Portfolio bundle when a user hovers over the navigation link, rendering transitions instantaneous upon click.',
        impact: 'Medium',
        codeSnippet: `<button
  onClick={() => onNavigate('portfolio')}
  onMouseEnter={() => import('./pages/PortfolioPage.tsx')}
>
  Portfolio
</button>`,
      });
    }

    if (toPage === 'admin') {
      suggestions.push({
        type: 'code-splitting',
        targetComponent: 'AdminPage & Management Forms',
        title: 'Code-Split Administrative Dashboard',
        recommendation:
          'Admin interfaces contain extensive form validation and data management trees that everyday visitors never require. Isolating it behind React.lazy keeps the consumer bundle lean.',
        impact: 'High',
        codeSnippet: `const AdminPage = React.lazy(() => import('./pages/AdminPage.tsx'));`,
      });
    }

    if (toPage === 'services') {
      suggestions.push({
        type: 'lazy-load',
        targetComponent: 'ServicesPage Catalog',
        title: 'Memoize Filtered Service Categories',
        recommendation:
          'Use React.useMemo for service catalog category filtering to avoid redundant array allocations on re-renders.',
        impact: 'Low',
      });
    }

    if (durationMs > 80 && !suggestions.some((s) => s.type === 'lazy-load')) {
      suggestions.push({
        type: 'lazy-load',
        targetComponent: `${toPage.charAt(0).toUpperCase() + toPage.slice(1)}Page`,
        title: 'Elevate Component Code-Splitting',
        recommendation: `Transition latency exceeded 80ms (${durationMs.toFixed(1)}ms). Consider lazy-loading this view to improve First Input Delay (FID) and interaction responsiveness.`,
        impact: 'Medium',
      });
    }

    return suggestions;
  }

  /**
   * Tracks and logs a page transition in dev mode with performance timing
   */
  public recordTransition(
    fromPage: string,
    toPage: string,
    durationMs: number,
    renderPhaseMs: number
  ): PageTransitionMetric {
    const isDev = import.meta.env.DEV;
    const now = new Date();
    const timeFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    // Status classification
    let status: 'optimal' | 'moderate' | 'heavy' = 'optimal';
    if (durationMs > 100) {
      status = 'heavy';
    } else if (durationMs > 40) {
      status = 'moderate';
    }

    // Heuristics & suggestions
    const suggestions = this.generateSuggestions(toPage, durationMs);

    // DOM & memory metrics
    const domNodes = typeof document !== 'undefined' ? document.querySelectorAll('*').length : 0;
    let memoryUsageMb: number | undefined;
    if (typeof performance !== 'undefined' && 'memory' in performance) {
      const memory = (performance as unknown as { memory: { usedJSHeapSize: number } }).memory;
      if (memory?.usedJSHeapSize) {
        memoryUsageMb = +(memory.usedJSHeapSize / (1024 * 1024)).toFixed(1);
      }
    }

    const metric: PageTransitionMetric = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: timeFormatted,
      fromPage,
      toPage,
      durationMs: +durationMs.toFixed(2),
      renderPhaseMs: +renderPhaseMs.toFixed(2),
      status,
      domNodes,
      memoryUsageMb,
      suggestions,
    };

    // Store in history
    this.metrics.unshift(metric);
    if (this.metrics.length > this.maxHistory) {
      this.metrics.pop();
    }

    // Persist to session
    if (typeof window !== 'undefined' && window.sessionStorage) {
      try {
        sessionStorage.setItem('hogtech_perf_metrics', JSON.stringify(this.metrics));
      } catch {
        // ignore
      }
    }

    // Notify subscribers
    this.notify();

    // Dev environment console output
    if (isDev) {
      this.logToConsole(metric);
    }

    return metric;
  }

  /**
   * Outputs a beautifully formatted console summary in development
   */
  private logToConsole(metric: PageTransitionMetric) {
    const badgeColor =
      metric.status === 'optimal'
        ? 'background: #059669; color: #fff;'
        : metric.status === 'moderate'
        ? 'background: #d97706; color: #fff;'
        : 'background: #dc2626; color: #fff;';

    const statusIcon = metric.status === 'optimal' ? '⚡' : metric.status === 'moderate' ? '⚠️' : '🐢';

    // Collapsed console group for developer inspection
    console.groupCollapsed(
      `%c[Hogtech DevPerf]%c ${statusIcon} Transition: %c${metric.fromPage}%c ➔ %c${metric.toPage}%c %c${metric.durationMs}ms%c`,
      'background: #0f172a; color: #38bdf8; font-weight: bold; border-radius: 4px; padding: 2px 6px;',
      'color: #64748b; font-weight: normal;',
      'color: #0f172a; font-weight: bold;',
      'color: #94a3b8;',
      'color: #0f172a; font-weight: bold;',
      'color: #64748b;',
      `${badgeColor} font-weight: bold; border-radius: 3px; padding: 1px 5px;`,
      'color: #94a3b8; font-size: 11px;'
    );

    console.table([
      {
        'Metric': 'Total Transition Duration',
        'Value': `${metric.durationMs} ms`,
        'Evaluation': metric.status.toUpperCase(),
      },
      {
        'Metric': 'Render Phase (DOM Paint)',
        'Value': `${metric.renderPhaseMs} ms`,
        'Evaluation': metric.renderPhaseMs < 20 ? 'FAST' : 'NOTICEABLE',
      },
      {
        'Metric': 'Active DOM Elements',
        'Value': `${metric.domNodes} nodes`,
        'Evaluation': metric.domNodes < 1500 ? 'HEALTHY' : 'DENSE',
      },
      ...(metric.memoryUsageMb
        ? [
            {
              'Metric': 'JS Heap Memory',
              'Value': `${metric.memoryUsageMb} MB`,
              'Evaluation': 'MEASURED',
            },
          ]
        : []),
    ]);

    if (metric.suggestions.length > 0) {
      console.log(
        '%c💡 Optimization Suggestions (%c' + metric.suggestions.length + '%c):',
        'font-weight: bold; color: #0284c7;',
        'font-weight: bold; color: #f59e0b;',
        'font-weight: bold; color: #0284c7;'
      );

      metric.suggestions.forEach((sugg, i) => {
        console.log(
          `%c#${i + 1} [${sugg.impact.toUpperCase()} IMPACT] ${sugg.title}%c\n${sugg.recommendation}`,
          'color: #0d9488; font-weight: bold;',
          'color: #475569; font-weight: normal;'
        );
        if (sugg.codeSnippet) {
          console.log(`%c${sugg.codeSnippet}`, 'color: #334155; background: #f8fafc; padding: 4px; font-family: monospace;');
        }
      });
    }

    console.groupEnd();
  }

  public getMetrics(): PageTransitionMetric[] {
    return [...this.metrics];
  }

  public clearMetrics(): void {
    this.metrics = [];
    if (typeof window !== 'undefined' && window.sessionStorage) {
      try {
        sessionStorage.removeItem('hogtech_perf_metrics');
      } catch {
        // ignore
      }
    }
    this.notify();
    if (import.meta.env.DEV) {
      console.log('%c[Hogtech DevPerf]%c Performance metrics cleared.', 'background: #0f172a; color: #38bdf8; font-weight: bold; padding: 2px 6px; border-radius: 4px;', 'color: #64748b;');
    }
  }

  public subscribe(listener: MetricsListener): () => void {
    this.listeners.add(listener);
    listener([...this.metrics]);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    const copy = [...this.metrics];
    this.listeners.forEach((listener) => {
      try {
        listener(copy);
      } catch (err) {
        console.error('Error in DevPerf listener:', err);
      }
    });
  }
}

export const perfLogger = new PerformanceLogger();
