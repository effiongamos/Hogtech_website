import React, { useState } from 'react';
import {
  Maximize2,
  X,
  Calendar,
  Layers,
  ArrowRight,
  MessageSquare,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { PortfolioItem, CompanySettings } from '../types/index.ts';
import { LazyImage } from '../components/LazyImage.tsx';
import { AnimatedCard } from '../components/AnimatedCard.tsx';

interface PortfolioPageProps {
  portfolio: PortfolioItem[];
  settings: CompanySettings;
  onRequestService: (category: string, item: string) => void;
}

export const PortfolioPage: React.FC<PortfolioPageProps> = ({
  portfolio,
  settings,
  onRequestService,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [enlargedItem, setEnlargedItem] = useState<PortfolioItem | null>(null);

  const categories = ['All', 'Printing & Editorial', 'Custom Stationery', 'Branding & Graphics', 'Computer Training'];

  const filteredItems = portfolio.filter((item) => {
    if (selectedFilter === 'All') return true;
    return item.category === selectedFilter;
  });

  const cleanWaNumber = settings.whatsappNumber.replace(/[^0-9]/g, '');

  return (
    <div className="space-y-16 pb-20">
      {/* Header Banner */}
      <section className="bg-gradient-to-b from-[#081426] to-[#0c1c36] text-white py-16 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <span className="text-xs font-semibold text-teal-400 uppercase tracking-widest">
            Delivered Work & Case Studies
          </span>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-white max-w-3xl">
            Our Work Portfolio & Client Projects
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
            A showcase of actual printing production, custom event jotters, editorial formatting, corporate brand collateral, and computer training delivered by Hogtech Int’l Ventures.
          </p>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const active = selectedFilter === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedFilter(cat)}
                className={`px-4 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors shrink-0 ${
                  active
                    ? 'bg-slate-900 dark:bg-teal-500 text-white dark:text-slate-950 shadow-sm'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {filteredItems.map((item, idx) => {
            const waProjectUrl = `https://wa.me/${cleanWaNumber}?text=${encodeURIComponent(
              `Hello Hogtech Int’l Ventures. I saw your portfolio project "${item.title}" on your website and would like to request a similar project.`
            )}`;

            return (
              <AnimatedCard key={item.id} index={idx} className="h-full">
                <div
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md transition-all group h-full"
                >
                  {/* Image Container with Zoom Trigger */}
                  <div
                    className="relative h-72 sm:h-80 overflow-hidden bg-slate-100 dark:bg-slate-800 cursor-pointer"
                    onClick={() => setEnlargedItem(item)}
                  >
                    <LazyImage
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      containerClassName="w-full h-full"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity pointer-events-none" />

                    {/* Top Category Badge */}
                    <div className="absolute top-4 left-4 pointer-events-none">
                      <span className="text-[11px] font-semibold bg-slate-900/90 text-white px-3 py-1 rounded-md backdrop-blur-sm">
                        {item.category}
                      </span>
                    </div>

                    {/* Enlarge Icon Button */}
                    <div className="absolute top-4 right-4 z-10">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEnlargedItem(item);
                        }}
                        className="p-2 rounded-lg bg-slate-900/80 hover:bg-slate-900 text-white transition-colors"
                        title="Enlarge Image"
                        aria-label="Enlarge Image"
                      >
                        <Maximize2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Bottom Image Overlay Text */}
                    <div className="absolute bottom-4 left-4 right-4 text-white pointer-events-none">
                      <h3 className="font-display font-bold text-lg sm:text-xl">
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-slate-300 mt-1">
                        {item.clientType && <span>{item.clientType}</span>}
                        {item.clientType && item.completionDate && <span aria-hidden="true">·</span>}
                        {item.completionDate && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{item.completionDate}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Description & Action */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                      <button
                        onClick={() => onRequestService(item.category, item.title)}
                        className="px-4 py-2.5 rounded-lg bg-teal-500 hover:bg-teal-600 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      >
                        <span>Request a Similar Project</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                      <a
                        href={waProjectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors focus:outline-none"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span>Inquire via WhatsApp</span>
                      </a>
                    </div>
                  </div>
                </div>
              </AnimatedCard>
            );
          })}
        </div>
      </section>

      {/* Image Enlargement Modal */}
      {enlargedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-3xl w-full overflow-hidden text-white shadow-2xl relative">
            <button
              onClick={() => setEnlargedItem(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-950/80 hover:bg-slate-950 text-white"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="max-h-[65vh] overflow-hidden bg-black flex items-center justify-center">
              <img
                src={enlargedItem.image}
                alt={enlargedItem.title}
                className="w-full h-full object-contain max-h-[65vh]"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="p-6 bg-slate-900 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-teal-400 font-semibold uppercase tracking-wider">
                  {enlargedItem.category}
                </span>
                {enlargedItem.completionDate && (
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{enlargedItem.completionDate}</span>
                  </span>
                )}
              </div>
              <h3 className="font-display font-bold text-xl text-white">
                {enlargedItem.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {enlargedItem.description}
              </p>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  onClick={() => setEnlargedItem(null)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    const item = enlargedItem;
                    setEnlargedItem(null);
                    onRequestService(item.category, item.title);
                  }}
                  className="px-5 py-2.5 rounded-lg bg-teal-400 text-slate-950 text-xs font-bold hover:bg-teal-300 transition-colors"
                >
                  Request a Similar Project
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
