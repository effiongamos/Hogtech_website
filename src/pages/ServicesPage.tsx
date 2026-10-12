import React, { useState } from 'react';
import {
  Printer,
  FileText,
  GraduationCap,
  Database,
  Palette,
  Package,
  Search,
  MessageSquare,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Calculator
} from 'lucide-react';
import { ServiceItem, CompanySettings } from '../types/index.ts';
import { LazyImage } from '../components/LazyImage.tsx';
import { AnimatedCard } from '../components/AnimatedCard.tsx';
import { PrintEstimator } from '../components/PrintEstimator.tsx';

interface ServicesPageProps {
  services: ServiceItem[];
  settings: CompanySettings;
  onRequestService: (category?: string, item?: string, details?: string) => void;
  onOpenTraining: () => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({
  services,
  settings,
  onRequestService,
  onOpenTraining,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const cleanWaNumber = settings.whatsappNumber.replace(/[^0-9]/g, '');

  const categories = [
    'All',
    'Printing & Document Services',
    'Typing & Document Preparation',
    'Computer Training & Digital Skills',
    'Data Entry & Administrative Support',
    'Graphics & Creative Design',
    'Stationery & Office Supplies',
  ];

  const filteredServices = services.filter((srv) => {
    const matchesCat = selectedCategory === 'All' || srv.category === selectedCategory;
    const matchesQuery =
      srv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      srv.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      srv.items.some((it) => it.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesQuery;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Printing & Document Services':
        return <Printer className="w-5 h-5 text-teal-600" />;
      case 'Typing & Document Preparation':
        return <FileText className="w-5 h-5 text-teal-600" />;
      case 'Computer Training & Digital Skills':
        return <GraduationCap className="w-5 h-5 text-teal-600" />;
      case 'Data Entry & Administrative Support':
        return <Database className="w-5 h-5 text-teal-600" />;
      case 'Graphics & Creative Design':
        return <Palette className="w-5 h-5 text-teal-600" />;
      case 'Stationery & Office Supplies':
        return <Package className="w-5 h-5 text-teal-600" />;
      default:
        return <Printer className="w-5 h-5 text-teal-600" />;
    }
  };

  return (
    <div className="space-y-16 pb-20">
      {/* Header Banner */}
      <section className="bg-gradient-to-b from-[#081426] to-[#0c1c36] text-white py-16 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <span className="text-xs font-semibold text-teal-400 uppercase tracking-widest">
            Complete Service Directory
          </span>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-white max-w-3xl">
            Reliable Printing, Document Engineering & Digital Solutions
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
            From single page walk-in copies at 76 Ekpo Abasi Street to bulk corporate programs, custom jotters, online registrations, and intensive computer courses.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <a
              href="#printing-estimator"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-400 text-slate-950 font-bold text-xs hover:bg-teal-300 transition-colors shadow-md"
            >
              <Calculator className="w-4 h-4" />
              <span>Use Instant Print Estimator</span>
            </a>
            <span className="text-xs text-slate-400">
              Select page counts, paper weight & binding to get instant quote ranges.
            </span>
          </div>
        </div>
      </section>

      {/* Interactive Service Estimation Tool */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PrintEstimator
          settings={settings}
          onRequestQuoteWithDetails={(details, cat, it) => onRequestService(cat, it, details)}
        />
      </section>

      {/* Filter and Search Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors shrink-0 ${
                    active
                      ? 'bg-slate-900 dark:bg-teal-500 text-white dark:text-slate-950 shadow-sm'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  {cat === 'All' ? 'All Services' : cat.split('&')[0]}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search services or items..."
              className="w-full pl-10 pr-4 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-teal-500"
            />
          </div>
        </div>
      </section>

      {/* Services Detailed List */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredServices.map((service, idx) => {
            const isTraining = service.category.includes('Training');

            return (
              <AnimatedCard key={service.id} index={idx} className="h-full">
                <div
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col justify-between hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all group h-full"
                >
                  <div>
                    {/* Image header with category tag and IntersectionObserver lazy loading */}
                    <div className="relative h-56 bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <LazyImage
                        src={service.image}
                        alt={service.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        containerClassName="w-full h-full"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
                      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white pointer-events-none">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-slate-900/90 flex items-center justify-center">
                            {getCategoryIcon(service.category)}
                          </div>
                          <span className="text-xs font-semibold">{service.category}</span>
                        </div>
                        {service.popular && (
                          <span className="text-[10px] font-bold bg-teal-400 text-slate-950 px-2 py-0.5 rounded uppercase tracking-wider">
                            High Demand
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Body */}
                    <div className="p-6 space-y-4">
                      <div>
                        <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white">
                          {service.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                          {service.description}
                        </p>
                      </div>

                      {/* Breakdown of specific capabilities */}
                      <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                          Included Offerings & Capabilities:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 dark:text-slate-300">
                          {service.items.map((subItem, itemIdx) => (
                            <div
                              key={itemIdx}
                              className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                              <span className="truncate">{subItem}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Working Functional Buttons with WhatsApp Integration */}
                  <div className="p-6 bg-slate-50/70 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-3">
                    {isTraining ? (
                      <button
                        onClick={onOpenTraining}
                        className="flex-1 py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      >
                        <GraduationCap className="w-4 h-4" />
                        <span>Register for Training Cohort</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => onRequestService(service.category, service.items[0])}
                        className="flex-1 py-3 px-4 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      >
                        <span>Request This Service</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}

                    <a
                      href={`https://wa.me/${cleanWaNumber}?text=${encodeURIComponent(
                        `Hello Hogtech Int’l Ventures. I am enquiring about "${service.title}" (${service.category}). Please provide quotation details.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-3 px-4 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-semibold flex items-center justify-center gap-2 transition-colors focus:outline-none"
                    >
                      <MessageSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>WhatsApp Quote</span>
                    </a>
                  </div>
                </div>
              </AnimatedCard>
            );
          })}
        </div>

        {filteredServices.length === 0 && (
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <p className="text-base text-slate-600 dark:text-slate-400">No services found matching your search.</p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline"
            >
              Reset filters
            </button>
          </div>
        )}
      </section>

      {/* Facility Assurance */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div className="space-y-1.5">
            <h4 className="font-display font-bold text-base text-slate-900 dark:text-white">
              Commercial Print Quality
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              High-definition digital color separation, premium cardstock, art paper, and crisp toner density.
            </p>
          </div>
          <div className="space-y-1.5">
            <h4 className="font-display font-bold text-base text-slate-900 dark:text-white">
              Strict Document Privacy
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Confidential academic theses, personal CVs, legal agreements, and corporate financial data.
            </p>
          </div>
          <div className="space-y-1.5">
            <h4 className="font-display font-bold text-base text-slate-900 dark:text-white">
              Hands-On Computer Lab
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Modern workstations, steady power setup, and certified syllabus for career and school success.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
