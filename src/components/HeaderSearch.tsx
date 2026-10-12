import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Search,
  X,
  Printer,
  Briefcase,
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageSquare,
  Calculator,
  GraduationCap,
  ArrowRight,
  Sparkles,
  FileText,
  Palette,
  Layers,
  ExternalLink,
  CornerDownLeft,
  ChevronRight,
  ShieldAlert,
  Star,
} from 'lucide-react';
import { CompanySettings, ServiceItem, PortfolioItem } from '../types/index.ts';

export interface SearchResultItem {
  id: string;
  type: 'service' | 'portfolio' | 'contact' | 'action';
  title: string;
  subtitle: string;
  snippet?: string;
  badge: string;
  badgeColor: string;
  icon: React.ReactNode;
  action: () => void;
  actionLabel?: string;
  category?: string;
}

interface HeaderSearchProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  settings: CompanySettings;
  services?: ServiceItem[];
  portfolio?: PortfolioItem[];
  onRequestService?: (category?: string, item?: string, details?: string) => void;
  onOpenTraining?: () => void;
  onOpenLogoModal?: () => void;
  onOpenEstimator?: () => void;
  className?: string;
  isMobileDrawer?: boolean;
  onItemSelect?: () => void;
}

// Built-in catalog of comprehensive searchable offerings
const fallbackServiceItems = [
  {
    category: 'Printing & Document Services',
    title: 'Commercial & Document Printing',
    description: 'High-volume colour and black-and-white printing, photocopying, scanning, and protective lamination.',
    items: [
      'Colour & Black-and-White Printing',
      'A3 and A4 High-Definition Printing',
      'Fast Photocopying & Digital Scanning',
      'Matte & Gloss Document Laminating',
      'Business & Complimentary Cards',
      'Invitation Cards & Event Flyers',
      'Event Programmes & Booklets',
      'Custom Contribution Cards & Jotters',
      'Plastic ID Cards & Spiral Binding',
    ],
  },
  {
    category: 'Typing & Document Preparation',
    title: 'Professional Typing & Editorial Support',
    description: 'Fast typing, academic formatting, proofreading, CV drafting, and PDF/Word conversion.',
    items: [
      'Rapid Professional Typing',
      'Standard Academic & Project Formatting',
      'Thorough Editing & Proofreading',
      'Professional CV & Résumé Structuring',
      'PDF to Word & Document Conversion',
      'School, Proposal & Research Document Preparation',
    ],
  },
  {
    category: 'Computer Training & Digital Skills',
    title: 'Hands-On Practical ICT Training',
    description: 'Job-ready computer literacy with dedicated workstation computers and personalized tutoring.',
    items: [
      'Fundamental Computer Literacy',
      'Microsoft Office & Google Workspace (Word, Excel, PowerPoint)',
      'Practical Digital Productivity & Internet Research',
      'Introduction to AI Tools for Everyday Workflow',
      'Digital File Management & Data Handling',
    ],
  },
  {
    category: 'Data Entry & Administrative Support',
    title: 'Data Entry & Online Portal Assistance',
    description: 'Fast data processing, spreadsheet compilation, and examination/portal registrations.',
    items: [
      'High-Speed Accurate Data Entry',
      'Spreadsheet Preparation & Formulas',
      'Online Registration Assistance (JAMB, WAEC, NYSC, Job Portals)',
      'Internet Research & Information Gathering',
      'Digital File Sorting & Document Archiving',
      'General Business Administrative Support',
    ],
  },
  {
    category: 'Graphics & Creative Design',
    title: 'Visual Branding & Graphic Design',
    description: 'Bespoke graphic design for flyers, events, business marketing, and social media.',
    items: [
      'Flyers, Posters & Handbills',
      'Promotional & Social Media Graphics',
      'Business Marketing Materials & Banners',
      'Event, Wedding & Celebration Designs',
      'Branded Letterheads & Logo Cleanups',
    ],
  },
  {
    category: 'Stationery & Office Supplies',
    title: 'Office Stationery & Binding Supplies',
    description: 'Quality stationery, files, paper reams, spiral combs, and branded jotters.',
    items: [
      'Office Folders, Files & Envelopes',
      'Spiral Binding Combs & Plastic Covers',
      'Quality Bond & Art Paper Reams',
      'Customized Branded Jotters & Memo Pads',
      'General Office Consumables',
    ],
  },
];

const fallbackPortfolioItems = [
  {
    id: 'port-01',
    title: 'Cross River State Summit Programme & Materials',
    category: 'Printing & Editorial',
    description: 'Complete design layout, high-density color printing, and booklet binding for regional summit delegates.',
  },
  {
    id: 'port-02',
    title: 'Deluxe Celebration Jotters & Event Invitation Set',
    category: 'Custom Stationery',
    description: 'Gold-accented hardbound souvenir jotters, foil-stamped event invitation cards, and banquet order of events.',
  },
  {
    id: 'port-03',
    title: 'Corporate Identity Suite & Executive Stationery',
    category: 'Branding & Graphics',
    description: 'Clean executive stationery design with deep navy and teal brand styling, custom business cards, and presentation folders.',
  },
  {
    id: 'port-04',
    title: 'Practical ICT & Office Productivity Training Cohort',
    category: 'Computer Training',
    description: 'Successful 6-week intensive digital literacy and spreadsheet training for young professionals and university graduates.',
  },
];

const popularSuggestions = [
  'Business Cards',
  'Print Estimator',
  'Computer Training',
  'Office Address',
  'Event Programmes',
  'Plastic ID Cards',
  'CV & Project Typing',
  'WhatsApp Chat',
];

export const HeaderSearch: React.FC<HeaderSearchProps> = ({
  currentPage,
  onNavigate,
  settings,
  services,
  portfolio,
  onRequestService,
  onOpenTraining,
  onOpenLogoModal,
  onOpenEstimator,
  className = '',
  isMobileDrawer = false,
  onItemSelect,
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'service' | 'portfolio' | 'contact' | 'action'>('all');
  const [activeIndex, setActiveIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const cleanWaNumber = settings.whatsappNumber.replace(/[^0-9]/g, '');

  // Global keyboard shortcut to open search (/ or Ctrl+K / Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input/textarea elsewhere, unless it's the search shortcut
      const targetTag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      const isInput = targetTag === 'input' || targetTag === 'textarea' || (e.target as HTMLElement)?.isContentEditable;

      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !isInput)) {
        e.preventDefault();
        setIsOpen(true);
        setTimeout(() => {
          inputRef.current?.focus();
          inputRef.current?.select();
        }, 50);
      } else if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen && !isMobileDrawer) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, isMobileDrawer]);

  // Build searchable database
  const allSearchableItems: SearchResultItem[] = useMemo(() => {
    const results: SearchResultItem[] = [];

    // 1. Interactive Actions & Tools
    if (onOpenEstimator) {
      results.push({
        id: 'action-estimator',
        type: 'action',
        title: 'Interactive Print Estimator',
        subtitle: 'Calculate exact costs for flyers, booklets, business cards & binding',
        snippet: 'Real-time paper weight, page count, and finish calculator with instant quote summary.',
        badge: 'TOOL',
        badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
        icon: <Calculator className="w-4 h-4 text-emerald-400" />,
        action: () => {
          onOpenEstimator();
        },
        actionLabel: 'Open Estimator',
      });
    }

    if (onRequestService) {
      results.push({
        id: 'action-request',
        type: 'action',
        title: 'Request a Service / Get Custom Quote',
        subtitle: 'Submit an online job request with specific requirements',
        snippet: 'Direct submission to Hogtech production desk with quick WhatsApp turnaround.',
        badge: 'ACTION',
        badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
        icon: <Sparkles className="w-4 h-4 text-teal-400" />,
        action: () => {
          onRequestService();
        },
        actionLabel: 'Request Service',
      });
    }

    if (onOpenTraining) {
      results.push({
        id: 'action-training',
        type: 'action',
        title: 'Register for Computer Training & Digital Skills',
        subtitle: 'Sign up for hands-on ICT classes in Microsoft Office & Practical AI',
        snippet: 'Weekend and weekday batches available with individual workstation computers.',
        badge: 'ENROLL',
        badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
        icon: <GraduationCap className="w-4 h-4 text-amber-400" />,
        action: () => {
          onOpenTraining();
        },
        actionLabel: 'Enroll Now',
      });
    }

    if (onOpenLogoModal) {
      results.push({
        id: 'action-logo',
        type: 'action',
        title: 'View Official HogTech Logo & Brand Assets',
        subtitle: 'Official emblem, circular seal, and brand identity guide',
        snippet: 'Official crest, vector SVG geometries, and certified corporate mark.',
        badge: 'BRAND',
        badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
        icon: <Sparkles className="w-4 h-4 text-blue-400" />,
        action: () => {
          onOpenLogoModal();
        },
        actionLabel: 'View Assets',
      });
    }

    results.push({
      id: 'policy-prohibited-terms',
      type: 'action',
      title: 'Reserved Rights & Prohibited Terms Policy',
      subtitle: 'Zero-tolerance policy on forgery, cybercrime & copyright infringement',
      snippet: 'Official compliance terms, intellectual property protection, and prohibited business center activities.',
      badge: 'TERMS',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      icon: <ShieldAlert className="w-4 h-4 text-amber-400" />,
      action: () => {
        const prohibitedBtn = document.querySelector('footer button[title*="Reserved"]') as HTMLButtonElement | null;
        if (prohibitedBtn) {
          prohibitedBtn.click();
        } else {
          window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }
      },
      actionLabel: 'View Policy',
    });

    results.push({
      id: 'action-testimonials',
      type: 'action',
      title: 'Client Testimonials & Verified Reviews',
      subtitle: 'Read genuine feedback from students, authors, event hosts & corporate teams in Calabar',
      snippet: '4.9/5 star average rating across 1,500+ projects with interactive carousel, grid, and review submission.',
      badge: 'REVIEWS',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      icon: <Star className="w-4 h-4 text-amber-400" />,
      action: () => {
        onNavigate('home');
        setTimeout(() => {
          const el = document.getElementById('testimonials-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      },
      actionLabel: 'View Reviews',
    });

    // 2. Contact Information & Office Details
    results.push(
      {
        id: 'contact-phone',
        type: 'contact',
        title: `Call Us: ${settings.phone}`,
        subtitle: 'Direct customer service and order desk hotline',
        snippet: 'Available Monday to Saturday during official business hours.',
        badge: 'PHONE',
        badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
        icon: <Phone className="w-4 h-4 text-cyan-400" />,
        action: () => {
          const firstPhone = settings.phone.split('/')[0].trim().replace(/[^0-9+]/g, '');
          window.location.href = `tel:${firstPhone}`;
        },
        actionLabel: 'Call Now',
      },
      {
        id: 'contact-whatsapp',
        type: 'contact',
        title: `WhatsApp Chat: +${cleanWaNumber}`,
        subtitle: 'Instant messaging for quotes, proof reviews & inquiries',
        snippet: 'Direct chat with Hogtech customer desk on WhatsApp.',
        badge: 'WHATSAPP',
        badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
        icon: <MessageSquare className="w-4 h-4 text-emerald-400" />,
        action: () => {
          window.open(`https://wa.me/${cleanWaNumber}?text=${encodeURIComponent('Hello Hogtech, I would like to inquire about your services.')}`, '_blank');
        },
        actionLabel: 'Open WhatsApp',
      },
      {
        id: 'contact-address',
        type: 'contact',
        title: `Visit Office: ${settings.address}`,
        subtitle: 'Physical office location in Calabar, Cross River State',
        snippet: 'Easily accessible facility with parking and dedicated customer service counters.',
        badge: 'LOCATION',
        badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
        icon: <MapPin className="w-4 h-4 text-rose-400" />,
        action: () => {
          onNavigate('contact');
        },
        actionLabel: 'View Map & Directions',
      },
      {
        id: 'contact-hours',
        type: 'contact',
        title: `Office Hours: ${settings.openingHours}`,
        subtitle: 'Monday through Saturday open for walk-ins and production',
        snippet: 'Closed on Sundays. Online WhatsApp requests accepted 24/7.',
        badge: 'HOURS',
        badgeColor: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
        icon: <Clock className="w-4 h-4 text-slate-400" />,
        action: () => {
          onNavigate('contact');
        },
        actionLabel: 'Contact Page',
      },
      {
        id: 'contact-email',
        type: 'contact',
        title: `Email: ${settings.email}`,
        subtitle: 'Send job briefs, artwork files, and corporate inquiries',
        snippet: 'Official email inbox monitored by client support staff.',
        badge: 'EMAIL',
        badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
        icon: <Mail className="w-4 h-4 text-indigo-400" />,
        action: () => {
          window.location.href = `mailto:${settings.email}`;
        },
        actionLabel: 'Send Email',
      }
    );

    // 3. Services & Specific Items
    const effectiveServices = (services && services.length > 0) ? services : fallbackServiceItems;

    effectiveServices.forEach((srv, sIdx) => {
      // Main service category item
      results.push({
        id: `srv-${sIdx}`,
        type: 'service',
        title: srv.title,
        subtitle: srv.category,
        snippet: srv.description,
        badge: 'SERVICE',
        badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
        icon: <Printer className="w-4 h-4 text-teal-400" />,
        category: srv.category,
        action: () => {
          onNavigate('services');
        },
        actionLabel: 'View in Services',
      });

      // Sub-items of this service
      if (Array.isArray(srv.items)) {
        srv.items.forEach((item, itemIdx) => {
          results.push({
            id: `srv-${sIdx}-item-${itemIdx}`,
            type: 'service',
            title: item,
            subtitle: `${srv.title} · ${srv.category}`,
            snippet: `Professional ${item.toLowerCase()} delivered with quick turnaround and crisp quality.`,
            badge: 'OFFERING',
            badgeColor: 'bg-teal-500/10 text-teal-300 border-teal-500/20',
            icon: item.toLowerCase().includes('training') || item.toLowerCase().includes('literacy')
              ? <GraduationCap className="w-4 h-4 text-amber-400" />
              : item.toLowerCase().includes('design') || item.toLowerCase().includes('graphics') || item.toLowerCase().includes('logo')
              ? <Palette className="w-4 h-4 text-purple-400" />
              : item.toLowerCase().includes('card') || item.toLowerCase().includes('flyer') || item.toLowerCase().includes('print')
              ? <Printer className="w-4 h-4 text-teal-400" />
              : <FileText className="w-4 h-4 text-cyan-400" />,
            category: srv.category,
            action: () => {
              if (onRequestService) {
                onRequestService(srv.category, item);
              } else {
                onNavigate('services');
              }
            },
            actionLabel: 'Request / Details',
          });
        });
      }
    });

    // 4. Portfolio Items
    const effectivePortfolio = (portfolio && portfolio.length > 0) ? portfolio : fallbackPortfolioItems;

    effectivePortfolio.forEach((port) => {
      results.push({
        id: `port-${port.id}`,
        type: 'portfolio',
        title: port.title,
        subtitle: `Portfolio · ${port.category}`,
        snippet: port.description,
        badge: 'PORTFOLIO',
        badgeColor: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
        icon: <Briefcase className="w-4 h-4 text-violet-400" />,
        category: port.category,
        action: () => {
          onNavigate('portfolio');
        },
        actionLabel: 'View Project',
      });
    });

    return results;
  }, [settings, services, portfolio, onNavigate, onRequestService, onOpenTraining, onOpenLogoModal, onOpenEstimator, cleanWaNumber]);

  // Filtered search results based on user query and filter tab
  const filteredResults = useMemo(() => {
    const trimmed = query.trim().toLowerCase();

    let list = allSearchableItems;

    if (selectedFilter !== 'all') {
      list = list.filter((item) => item.type === selectedFilter);
    }

    if (!trimmed) {
      // Default: show a curated selection of top popular items
      return list.slice(0, 8);
    }

    // Split query terms for multi-word fuzzy matching
    const searchTerms = trimmed.split(/\s+/).filter(Boolean);

    return list
      .map((item) => {
        let score = 0;
        const titleLower = item.title.toLowerCase();
        const subtitleLower = item.subtitle.toLowerCase();
        const snippetLower = (item.snippet || '').toLowerCase();

        // Exact match boost
        if (titleLower === trimmed) score += 100;
        else if (titleLower.startsWith(trimmed)) score += 50;
        else if (titleLower.includes(trimmed)) score += 30;

        searchTerms.forEach((term) => {
          if (titleLower.includes(term)) score += 20;
          if (subtitleLower.includes(term)) score += 10;
          if (snippetLower.includes(term)) score += 5;
        });

        return { item, score };
      })
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .map(({ item }) => item)
      .slice(0, 10);
  }, [allSearchableItems, query, selectedFilter]);

  // Adjust active index when results change
  useEffect(() => {
    setActiveIndex(0);
  }, [filteredResults]);

  // Handle keyboard navigation inside search list
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsOpen(true);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % Math.max(1, filteredResults.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + filteredResults.length) % Math.max(1, filteredResults.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const currentItem = filteredResults[activeIndex];
      if (currentItem) {
        handleSelectItem(currentItem);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const handleSelectItem = (item: SearchResultItem) => {
    item.action();
    setIsOpen(false);
    setQuery('');
    if (onItemSelect) onItemSelect();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuickSuggestionClick = (suggestionText: string) => {
    setQuery(suggestionText);
    setIsOpen(true);
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Search Input Container */}
      <div className="relative flex items-center">
        <div className="absolute left-3.5 pointer-events-none flex items-center text-slate-400">
          <Search className="w-4 h-4 text-teal-400" />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleInputKeyDown}
          placeholder="Search services, portfolio, contact..."
          className="w-full pl-10 pr-16 sm:pr-20 py-2 sm:py-2.5 rounded-xl bg-slate-900/90 dark:bg-slate-950/90 text-white placeholder-slate-400 text-xs sm:text-sm border border-slate-700/80 hover:border-slate-600 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 focus:outline-none transition-all shadow-inner"
          aria-label="Search services, portfolio, contact information"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        />

        {/* Right Action / Shortcut Badge */}
        <div className="absolute right-2 sm:right-2.5 flex items-center gap-1">
          {query ? (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Clear search query"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-slate-800 text-slate-400 border border-slate-700/60 shadow-sm pointer-events-none select-none">
              <span>/</span>
            </kbd>
          )}
        </div>
      </div>

      {/* Floating Instant Search Dropdown / Palette */}
      {isOpen && (
        <div
          role="listbox"
          className={`absolute left-0 right-0 z-50 mt-2 bg-[#081528] dark:bg-[#071324] border border-slate-700/90 rounded-2xl shadow-2xl backdrop-blur-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150 ${
            isMobileDrawer ? 'relative mt-3 shadow-none' : 'min-w-[320px] sm:min-w-[420px] md:min-w-[500px] max-w-[580px]'
          }`}
        >
          {/* Header & Filter Pills */}
          <div className="p-3 border-b border-slate-800/80 bg-slate-900/60 flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 scrollbar-none text-xs">
              {(
                [
                  { id: 'all', label: 'All' },
                  { id: 'service', label: 'Services' },
                  { id: 'portfolio', label: 'Portfolio' },
                  { id: 'contact', label: 'Contact' },
                  { id: 'action', label: 'Tools' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedFilter(tab.id)}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                    selectedFilter === tab.id
                      ? 'bg-teal-500 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <span className="text-[11px] text-slate-400">
              {filteredResults.length} {filteredResults.length === 1 ? 'match' : 'matches'}
            </span>
          </div>

          {/* Quick suggestions pills when no query is typed */}
          {!query.trim() && (
            <div className="px-3.5 py-2.5 border-b border-slate-800/50 bg-slate-900/30">
              <div className="text-[11px] font-medium text-slate-400 mb-1.5 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-teal-400" />
                <span>Popular Searches:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {popularSuggestions.map((sug) => (
                  <button
                    key={sug}
                    type="button"
                    onClick={() => handleQuickSuggestionClick(sug)}
                    className="text-xs px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-teal-500/20 text-slate-300 hover:text-teal-200 border border-slate-700/60 transition-colors"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search Results List */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-800/60 p-1.5 scrollbar-thin">
            {filteredResults.length > 0 ? (
              filteredResults.map((item, index) => {
                const isActive = index === activeIndex;
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="option"
                    aria-selected={isActive}
                    onClick={() => handleSelectItem(item)}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={`w-full text-left p-3 rounded-xl flex items-start gap-3 transition-colors ${
                      isActive
                        ? 'bg-teal-500/15 border border-teal-500/30 text-white'
                        : 'hover:bg-slate-800/60 text-slate-200'
                    }`}
                  >
                    <div className="p-2 rounded-lg bg-slate-800 border border-slate-700 shrink-0 mt-0.5">
                      {item.icon}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 justify-between">
                        <span className="font-semibold text-sm truncate text-white">
                          {item.title}
                        </span>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded-full border shrink-0 ${item.badgeColor}`}
                        >
                          {item.badge}
                        </span>
                      </div>

                      <div className="text-xs text-slate-400 truncate mt-0.5 font-medium">
                        {item.subtitle}
                      </div>

                      {item.snippet && (
                        <p className="text-[11px] text-slate-400 line-clamp-1 mt-1 leading-relaxed">
                          {item.snippet}
                        </p>
                      )}
                    </div>

                    <div className="shrink-0 self-center hidden sm:flex items-center text-teal-400 opacity-80">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="py-8 px-4 text-center space-y-2">
                <Search className="w-8 h-8 text-slate-500 mx-auto" />
                <p className="text-sm font-semibold text-slate-300">
                  No matching results for &ldquo;{query}&rdquo;
                </p>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Try searching for keywords like &ldquo;printing&rdquo;, &ldquo;training&rdquo;, &ldquo;address&rdquo;, &ldquo;cards&rdquo;, or &ldquo;pricing&rdquo;.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      onNavigate('services');
                      setIsOpen(false);
                      if (onItemSelect) onItemSelect();
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-teal-300 bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/30 transition-colors"
                  >
                    <span>Browse All Services</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer Shortcuts Info */}
          <div className="px-3.5 py-2 bg-slate-950/80 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <CornerDownLeft className="w-3 h-3 text-teal-400" />
              <span>Press <b>Enter</b> to navigate</span>
            </span>
            <span className="hidden sm:inline">Use ↑ ↓ to browse</span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
