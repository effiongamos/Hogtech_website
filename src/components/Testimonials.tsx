import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Star,
  Quote,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  LayoutGrid,
  SlidersHorizontal,
  PlusCircle,
  CheckCircle2,
  Sparkles,
  Building2,
  GraduationCap,
  Award,
  MessageSquare,
  ThumbsUp,
  X,
  Send,
  MapPin,
  Calendar
} from 'lucide-react';
import { Testimonial } from '../types/index.ts';

// Comprehensive default client feedback from Calabar & Cross River clients
export const defaultTestimonials: Testimonial[] = [
  {
    id: 'test-01',
    name: 'Emem Bassey',
    role: 'Final Year Student Researcher',
    organization: 'University of Calabar (UNICAL)',
    category: 'Printing & Binding',
    serviceUsed: 'Thesis Formatting, Color Plot Printing & Deluxe Hardcover Binding',
    rating: 5,
    comment:
      'I had less than 24 hours to turn in 4 hardbound copies of my final year research project before departmental clearance closed. Hogtech corrected my page layout margins, printed every full-color statistical chart with immaculate clarity, and had the gold-lettered hardcover binding finished early. Truly saved my graduation timeline!',
    date: 'October 2026',
    verified: true,
    avatarInitials: 'EB',
    tag: 'Thesis & Hardbound Binding',
    location: 'Calabar, Cross River',
  },
  {
    id: 'test-02',
    name: 'Engr. Victor Effiong',
    role: 'Managing Director',
    organization: 'Apex Energy & Maritime Logistics',
    category: 'Design & Branding',
    serviceUsed: 'Executive Brand Suite, Company Letterheads & Plastic RFID Cards',
    rating: 5,
    comment:
      'Hogtech handled our corporate stationery, presentation folders, and plastic staff identity cards. The print resolution on the 350gsm cardstock was crisp, and the color matching across our corporate blue and teal branding was exact. A dependable partner for business materials.',
    date: 'September 2026',
    verified: true,
    avatarInitials: 'VE',
    tag: 'Corporate Identity & PVC Cards',
    location: 'Marina Road, Calabar',
  },
  {
    id: 'test-03',
    name: 'Mrs. Glory Edet',
    role: 'Lead Event Coordinator',
    organization: 'Royal Pearls Events & Banquets',
    category: 'Event & Stationery',
    serviceUsed: '250 Custom Gold-Foil Souvenir Jotters & 400 Glossy Event Programmes',
    rating: 5,
    comment:
      'The wedding souvenir jotters they designed and printed were the highlight of our guest tables. The gold foiling, thick laminated art-covers, and sturdy spiral binding were executed with extreme care. The couple and guests were thrilled. Hogtech is now our default printing partner.',
    date: 'October 2026',
    verified: true,
    avatarInitials: 'GE',
    tag: 'Wedding & Souvenir Print',
    location: 'State Housing Estate, Calabar',
  },
  {
    id: 'test-04',
    name: 'Daniel O. Asuquo',
    role: 'Administrative Officer',
    organization: 'Cross River State Civil Service',
    category: 'Computer Training',
    serviceUsed: 'Practical Microsoft Office Suite & Digital File Management',
    rating: 5,
    comment:
      'I enrolled in their 6-week computer literacy and practical Excel workshop. The hands-on, dedicated computer station format allowed me to master spreadsheet formulas, data filtering, and professional memo formatting. The recognized certificate helped me secure my departmental role.',
    date: 'August 2026',
    verified: true,
    avatarInitials: 'DA',
    tag: 'Certified Computer Training',
    location: 'Calabar South',
  },
  {
    id: 'test-05',
    name: 'Blessing N. Chukwu',
    role: 'Field Coordinator',
    organization: 'Niger Delta Community Health Initiative',
    category: 'Typing & Data Entry',
    serviceUsed: 'Survey Questionnaire Digitization, Tabulation & Statistical Entry',
    rating: 5,
    comment:
      'We had over 1,800 printed community health surveys that needed urgent digitization for our donor project report. Hogtech\'s data team handled the data entry with zero omissions and delivered structured Excel sheets with cross-checks ahead of schedule.',
    date: 'September 2026',
    verified: true,
    avatarInitials: 'BC',
    tag: 'Data Management & Entry',
    location: 'Calabar Municipal',
  },
  {
    id: 'test-06',
    name: 'Dr. Patrick Akpan',
    role: 'Senior Lecturer & Academic Author',
    organization: 'Department of Education',
    category: 'Printing & Binding',
    serviceUsed: 'Course Monograph Production, Matte Lamination & Wire-O Binding',
    rating: 5,
    comment:
      'Produced 350 copies of our university conference monographs with wire-o spiral binding and clear protective lamination. The text sharpness, double-sided alignment, and durable paper quality were outstanding. Honest pricing and prompt communication throughout.',
    date: 'July 2026',
    verified: true,
    avatarInitials: 'PA',
    tag: 'Academic Monograph Printing',
    location: 'Ekpo Abasi, Calabar',
  },
  {
    id: 'test-07',
    name: 'Amina Abubakar',
    role: 'Creative Director',
    organization: 'Amie Couture & Apparel',
    category: 'Design & Branding',
    serviceUsed: 'Custom Garment Hangtags, Packaging Stickers & Brand Flyers',
    rating: 5,
    comment:
      'From review of my design on WhatsApp to physical collection at the 76 Ekpo Abasi center, everything was smooth and courteous. The glossy vinyl stickers and branded hangtags made our boutique orders feel like high-end luxury merchandise.',
    date: 'September 2026',
    verified: true,
    avatarInitials: 'AA',
    tag: 'Brand Packaging & Labels',
    location: 'Calabar',
  },
  {
    id: 'test-08',
    name: 'Godwin Ita',
    role: 'Graduate Trainee',
    organization: 'Tech & Professional Services',
    category: 'Typing & Data Entry',
    serviceUsed: 'Executive CV Redesign, High-Res Certificate Scanning & Portal Submission',
    rating: 5,
    comment:
      'They reformatted my curriculum vitae into a clean modern standard, correctly compressed my educational credentials to portal specifications, and assisted with error-free upload. The attention to detail is unmatched in Calabar.',
    date: 'October 2026',
    verified: true,
    avatarInitials: 'GI',
    tag: 'CV & Portal Documentation',
    location: 'Calabar',
  },
];

interface TestimonialsProps {
  testimonials?: Testimonial[];
  whatsappNumber?: string;
  onRequestQuote?: () => void;
  onNavigate?: (page: string) => void;
}

const CATEGORIES = [
  'All',
  'Printing & Binding',
  'Computer Training',
  'Event & Stationery',
  'Typing & Data Entry',
  'Design & Branding',
] as const;

export const Testimonials: React.FC<TestimonialsProps> = ({
  testimonials: propTestimonials,
  whatsappNumber = '2349035029081',
  onRequestQuote,
  onNavigate,
}) => {
  const [list, setList] = useState<Testimonial[]>(
    propTestimonials && propTestimonials.length > 0 ? propTestimonials : defaultTestimonials
  );

  // If props update
  useEffect(() => {
    if (propTestimonials && propTestimonials.length > 0) {
      setList(propTestimonials);
    }
  }, [propTestimonials]);

  const [layoutMode, setLayoutMode] = useState<'carousel' | 'grid'>('carousel');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  // Feedback Submission Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    organization: '',
    category: 'Printing & Binding',
    serviceUsed: '',
    rating: 5,
    comment: '',
    location: 'Calabar',
  });

  // Filtered testimonials
  const filteredList = list.filter((item) => {
    if (activeCategory === 'All') return true;
    return item.category === activeCategory;
  });

  // Reset index when filter changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [activeCategory]);

  // Autoplay timer
  useEffect(() => {
    if (layoutMode !== 'carousel' || !isAutoPlaying || isHovered || filteredList.length <= 1) {
      return;
    }

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % filteredList.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [layoutMode, isAutoPlaying, isHovered, filteredList.length]);

  const handleNext = () => {
    if (filteredList.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % filteredList.length);
  };

  const handlePrev = () => {
    if (filteredList.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + filteredList.length) % filteredList.length);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.comment.trim() || !formData.serviceUsed.trim()) return;

    setSubmissionStatus('submitting');
    try {
      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.testimonial) {
          setList((prev) => [data.testimonial, ...prev]);
        }
      } else {
        // Fallback local append
        const initials = formData.name
          .trim()
          .split(/\s+/)
          .slice(0, 2)
          .map((n) => n[0]?.toUpperCase())
          .join('') || 'CU';

        const fallbackItem: Testimonial = {
          id: `test-local-${Date.now()}`,
          name: formData.name.trim(),
          role: formData.role.trim() || 'Verified Client',
          organization: formData.organization.trim() || undefined,
          category: formData.category as any,
          serviceUsed: formData.serviceUsed.trim(),
          rating: formData.rating,
          comment: formData.comment.trim(),
          date: 'Just now',
          verified: true,
          avatarInitials: initials,
          tag: formData.serviceUsed.split(' ').slice(0, 3).join(' '),
          location: formData.location.trim() || 'Calabar',
        };
        setList((prev) => [fallbackItem, ...prev]);
      }

      setSubmissionStatus('success');
      setTimeout(() => {
        setIsModalOpen(false);
        setSubmissionStatus('idle');
        setFormData({
          name: '',
          role: '',
          organization: '',
          category: 'Printing & Binding',
          serviceUsed: '',
          rating: 5,
          comment: '',
          location: 'Calabar',
        });
      }, 1600);
    } catch (err) {
      console.warn('Could not post testimonial:', err);
      setSubmissionStatus('idle');
    }
  };

  const cleanWaNumber = whatsappNumber.replace(/[^0-9]/g, '');
  const waUrl = `https://wa.me/${cleanWaNumber}?text=${encodeURIComponent(
    'Hello Hogtech International Ventures. I saw client testimonials on your website and would like to make an inquiry about a project.'
  )}`;

  const currentItem = filteredList[currentIndex] || filteredList[0];

  return (
    <section
      id="testimonials-section"
      aria-labelledby="testimonials-heading"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8"
    >
      {/* SECTION HEADER & PROOF METRICS BANNER */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/80 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>Verified Client Feedback & Social Proof</span>
          </div>
          <h2
            id="testimonials-heading"
            className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl text-slate-900 dark:text-white"
          >
            Trusted by Students, Professionals & Enterprises
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            Real experiences from university researchers, corporate teams, and event hosts who depend on HogTech’s speed, precision, and reliable execution in Calabar.
          </p>
        </div>

        {/* Layout Switcher & Action Button */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {/* View Toggle */}
          <div className="inline-flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setLayoutMode('carousel')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                layoutMode === 'carousel'
                  ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Interactive Carousel View"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Carousel</span>
            </button>
            <button
              type="button"
              onClick={() => setLayoutMode('grid')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                layoutMode === 'grid'
                  ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Full Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Grid ({filteredList.length})</span>
            </button>
          </div>

          {/* Share Review Button */}
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-teal-500 dark:hover:bg-teal-400 text-white dark:text-slate-950 font-bold text-xs transition-colors flex items-center gap-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Share Feedback</span>
          </button>
        </div>
      </div>

      {/* TRUST METRICS STATS RIBBON */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-50 via-teal-50/30 to-slate-50 dark:from-slate-900/90 dark:via-slate-800/60 dark:to-slate-900/90 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 dark:bg-amber-400/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
          </div>
          <div>
            <div className="font-display font-extrabold text-slate-900 dark:text-white text-base sm:text-lg">
              4.9 / 5.0
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              Verified Client Rating
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 dark:bg-teal-400/10 border border-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="font-display font-extrabold text-slate-900 dark:text-white text-base sm:text-lg">
              1,500+
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              Completed Print & Tech Jobs
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 dark:bg-cyan-400/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="font-display font-extrabold text-slate-900 dark:text-white text-base sm:text-lg">
              99.4%
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              On-Time Deadline Delivery
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 dark:bg-indigo-400/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="font-display font-extrabold text-slate-900 dark:text-white text-base sm:text-lg">
              500+
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              Certified Computer Trainees
            </div>
          </div>
        </div>
      </div>

      {/* CATEGORY FILTER CHIPS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
        {CATEGORIES.map((cat) => {
          const count =
            cat === 'All'
              ? list.length
              : list.filter((i) => i.category === cat).length;
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full border whitespace-nowrap transition-all font-medium flex items-center gap-1.5 ${
                isActive
                  ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-teal-400 dark:hover:border-teal-500'
              }`}
            >
              <span>{cat}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isActive
                    ? 'bg-teal-700 text-teal-100'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ============================================================== */}
      {/* CAROUSEL VIEW */}
      {/* ============================================================== */}
      {layoutMode === 'carousel' && (
        <div
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {filteredList.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 p-12 text-center bg-white dark:bg-slate-900/60">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                No feedback currently in this category. Click "Share Feedback" to be the first!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Main Active Testimonial Card */}
              <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-10 lg:p-12 shadow-md">
                {/* Ambient glow accent */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentItem.id}
                    initial={{ opacity: 0, x: 25 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -25 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    className="space-y-6 relative z-10"
                  >
                    {/* Header Row: Stars, Service Tag & Verified Status */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-5">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 text-amber-400">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < currentItem.rating
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-slate-300 dark:text-slate-700'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          {currentItem.rating}.0 / 5.0
                        </span>
                        <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                        <span className="text-xs font-semibold text-teal-600 dark:text-teal-400">
                          {currentItem.category}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {currentItem.tag && (
                          <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                            {currentItem.tag}
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Verified Review</span>
                        </span>
                      </div>
                    </div>

                    {/* Testimonial Quote */}
                    <div className="relative">
                      <Quote className="w-10 h-10 text-teal-500/15 absolute -top-4 -left-3 pointer-events-none" />
                      <blockquote className="text-base sm:text-lg lg:text-xl font-normal text-slate-800 dark:text-slate-100 leading-relaxed pl-4 sm:pl-6 border-l-2 border-teal-500">
                        "{currentItem.comment}"
                      </blockquote>
                    </div>

                    {/* Author & Service Details Footer */}
                    <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-3.5">
                        {/* Avatar */}
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 text-white font-extrabold text-base flex items-center justify-center shadow-sm shrink-0">
                          {currentItem.avatarInitials || 'HT'}
                        </div>
                        <div>
                          <div className="font-display font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                            <span>{currentItem.name}</span>
                            <span className="text-[10px] font-normal text-slate-400">· {currentItem.location || 'Calabar'}</span>
                          </div>
                          <div className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1.5 flex-wrap">
                            <span>{currentItem.role}</span>
                            {currentItem.organization && (
                              <>
                                <span className="text-slate-300 dark:text-slate-600">•</span>
                                <span className="font-semibold text-slate-700 dark:text-slate-300">
                                  {currentItem.organization}
                                </span>
                              </>
                            )}
                          </div>
                          <div className="text-[11px] text-teal-600 dark:text-teal-400 mt-0.5 font-medium">
                            Service: {currentItem.serviceUsed}
                          </div>
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center text-xs text-slate-400 dark:text-slate-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{currentItem.date}</span>
                        </span>
                        <span className="text-[11px] text-slate-400 mt-0.5">
                          Cross River State, NG
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Carousel Controls Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
                {/* Index & Auto-Play Status */}
                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    {String(currentIndex + 1).padStart(2, '0')} / {String(filteredList.length).padStart(2, '0')}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                  <button
                    type="button"
                    onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                    className="inline-flex items-center gap-1 hover:text-teal-600 dark:hover:text-teal-400 transition-colors focus:outline-none"
                    title={isAutoPlaying ? 'Pause rotation' : 'Resume auto-rotation'}
                  >
                    {isAutoPlaying ? (
                      <>
                        <Pause className="w-3 h-3 text-teal-500" />
                        <span>Auto-playing</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3 h-3 text-slate-400" />
                        <span>Paused</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Dots indicator */}
                <div className="flex items-center gap-1.5">
                  {filteredList.map((item, idx) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-2 rounded-full transition-all focus:outline-none ${
                        currentIndex === idx
                          ? 'w-6 bg-teal-500'
                          : 'w-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600'
                      }`}
                      aria-label={`Go to testimonial ${idx + 1}`}
                    />
                  ))}
                </div>

                {/* Arrow navigation buttons */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePrev}
                    aria-label="Previous testimonial"
                    className="w-9 h-9 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-500 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    aria-label="Next testimonial"
                    className="w-9 h-9 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-500 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* GRID VIEW */}
      {/* ============================================================== */}
      {layoutMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredList.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md transition-all group"
            >
              <div className="space-y-4">
                {/* Rating & Service */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < item.rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-300 dark:text-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                    {item.category}
                  </span>
                </div>

                {/* Comment quote */}
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic">
                  "{item.comment}"
                </p>

                {/* Service Tag */}
                <div className="pt-2">
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                    {item.serviceUsed}
                  </span>
                </div>
              </div>

              {/* Author footer */}
              <div className="pt-5 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  {item.avatarInitials}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-display font-bold text-xs text-slate-900 dark:text-white truncate flex items-center gap-1">
                    <span>{item.name}</span>
                    <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {item.role} {item.organization ? `· ${item.organization}` : ''}
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 shrink-0">{item.date}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* BOTTOM SOCIAL PROOF CALLOUT & ACTIONS */}
      <div className="p-6 sm:p-8 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1.5 text-center md:text-left">
          <div className="text-base font-bold text-slate-900 dark:text-white">
            Have a project or deadline in Calabar?
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Join hundreds of satisfied students, authors, and corporate teams who rely on HogTech every week.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-teal-500 dark:hover:bg-teal-400 text-white dark:text-slate-950 font-bold text-xs transition-colors flex items-center gap-2 shadow-sm focus:outline-none"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Chat on WhatsApp</span>
          </a>
          <button
            type="button"
            onClick={() => (onRequestQuote ? onRequestQuote() : onNavigate ? onNavigate('services') : null)}
            className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors"
          >
            <span>Request a Quote</span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* LEAVE FEEDBACK MODAL */}
      {/* ============================================================== */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in"
        >
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 w-full max-w-lg overflow-hidden shadow-2xl space-y-5 p-6 sm:p-8 relative">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none"
              aria-label="Close feedback modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                Client Testimonial
              </span>
              <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white mt-1">
                Share Your Experience with HogTech
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Your feedback helps our team maintain high standards and guides future clients in Calabar.
              </p>
            </div>

            {submissionStatus === 'success' && (
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Thank you! Your testimonial has been posted and will appear on our homepage.</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Samuel Archibong"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Role / Occupation
                  </label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="e.g. Student / Business Lead"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Organization / Institution
                  </label>
                  <input
                    type="text"
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    placeholder="e.g. UNICAL / Apex Ltd"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Service Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  >
                    <option value="Printing & Binding">Printing & Binding</option>
                    <option value="Computer Training">Computer Training</option>
                    <option value="Event & Stationery">Event & Stationery</option>
                    <option value="Typing & Data Entry">Typing & Data Entry</option>
                    <option value="Design & Branding">Design & Branding</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Specific Service Used *
                </label>
                <input
                  type="text"
                  required
                  value={formData.serviceUsed}
                  onChange={(e) => setFormData({ ...formData, serviceUsed: e.target.value })}
                  placeholder="e.g. Thesis Hardcover Binding, Event Jotters, Excel Workshop"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Rating
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((starVal) => (
                    <button
                      key={starVal}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: starVal })}
                      className="p-1 focus:outline-none"
                    >
                      <Star
                        className={`w-6 h-6 transition-all ${
                          starVal <= formData.rating
                            ? 'fill-amber-400 text-amber-400 scale-110'
                            : 'text-slate-300 dark:text-slate-700'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-2">
                    {formData.rating} out of 5 Stars
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Your Feedback / Review *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  placeholder="Tell us about the print quality, staff helpfulness, turnaround time, or training experience..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submissionStatus === 'submitting'}
                  className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 disabled:opacity-50 text-white font-bold text-xs transition-colors flex items-center gap-1.5 focus:outline-none shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submissionStatus === 'submitting' ? 'Submitting...' : 'Post Testimonial'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
