import React, { useState } from 'react';
import {
  Printer,
  FileCheck,
  GraduationCap,
  Sparkles,
  ArrowRight,
  MessageSquare,
  CheckCircle2,
  Calendar,
  Vote,
  ExternalLink,
  MapPin,
  Clock,
  Layers,
  FileSpreadsheet,
  Palette,
  PackageOpen,
  ShieldCheck,
  Shield,
  Search,
  FileText,
  Briefcase,
  HelpCircle,
  Database,
  Target,
  Send,
  Calculator
} from 'lucide-react';
import { HogtechLogo } from '../components/HogtechLogo.tsx';
import { CompanySettings, Announcement, ServiceItem, PollData, PortfolioItem, Testimonial } from '../types/index.ts';
import { AnimatedCard } from '../components/AnimatedCard.tsx';
import { AnimatedHeroImage } from '../components/AnimatedHeroImage.tsx';
import { LiveOfficeStatus } from '../components/LiveOfficeStatus.tsx';
import { LazyImage } from '../components/LazyImage.tsx';
import { Testimonials } from '../components/Testimonials.tsx';
import hogtechHeroBgImage from '../assets/images/Hogetech_hero_images.jpeg';

interface HomePageProps {
  settings: CompanySettings;
  announcements: Announcement[];
  services: ServiceItem[];
  portfolio?: PortfolioItem[];
  testimonials?: Testimonial[];
  poll: PollData;
  onNavigate: (page: string) => void;
  onRequestService: (category?: string, item?: string) => void;
  onOpenTraining: () => void;
  onVotePoll: (optionId: string) => void;
  onOpenLogoModal?: () => void;
  onOpenEstimator?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  settings,
  announcements,
  services,
  portfolio = [],
  testimonials = [],
  poll,
  onNavigate,
  onRequestService,
  onOpenTraining,
  onVotePoll,
  onOpenLogoModal,
  onOpenEstimator,
}) => {
  const [votedOption, setVotedOption] = useState<string | null>(null);
  const [contactFormStatus, setContactFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [contactFormData, setContactFormData] = useState({
    name: '',
    emailOrPhone: '',
    serviceInterest: 'Data Entry and Data Management',
    message: '',
  });

  const cleanWaNumber = settings.whatsappNumber.replace(/[^0-9]/g, '');
  const heroWaUrl = `https://wa.me/${cleanWaNumber}?text=${encodeURIComponent(
    'Hello HogTech International Ventures. I visited your website and would like to make an enquiry.'
  )}`;

  const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);

  const handleVote = (optId: string) => {
    if (votedOption) return;
    setVotedOption(optId);
    onVotePoll(optId);
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactFormStatus('submitting');
    try {
      await fetch('/api/submissions/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: contactFormData.name,
          contact: contactFormData.emailOrPhone,
          serviceInterest: contactFormData.serviceInterest,
          subject: `Enquiry from Home Contact Section: ${contactFormData.serviceInterest}`,
          message: contactFormData.message,
        }),
      });
      setContactFormStatus('success');
      setContactFormData({
        name: '',
        emailOrPhone: '',
        serviceInterest: 'Data Entry and Data Management',
        message: '',
      });
      setTimeout(() => setContactFormStatus('idle'), 6000);
    } catch (err) {
      console.error('Contact submission error:', err);
      setContactFormStatus('idle');
    }
  };

  // Curate HogTech's 11 exact service cards ensuring match with Section 4 specifications
  const structuredServices = [
    {
      id: 'srv-data-mgmt',
      title: 'Data Entry and Data Management',
      category: 'Data Management',
      description: 'Accurate high-speed data entry, database updating, record digitization, verification, and structured data cleansing.',
      icon: <Database className="w-5 h-5 text-teal-600 dark:text-teal-400" />,
      items: ['Data Capturing & Verification', 'Records Digitization & Cleansing', 'Database Formatting & Migration'],
    },
    {
      id: 'srv-admin-va',
      title: 'Administrative and Virtual Assistance',
      category: 'Virtual Assistance',
      description: 'Reliable virtual administrative support, correspondence handling, scheduling, email organization, and task delegation.',
      icon: <Briefcase className="w-5 h-5 text-teal-600 dark:text-teal-400" />,
      items: ['Executive Calendar & Email Support', 'Meeting Scheduling & Notes', 'Client Follow-Up & Support'],
    },
    {
      id: 'srv-doc-formatting',
      title: 'Document Formatting and PDF Support',
      category: 'Document Preparation',
      description: 'Pristine document structuring, corporate styling, PDF conversions, form creation, and publication-ready formatting.',
      icon: <FileText className="w-5 h-5 text-teal-600 dark:text-teal-400" />,
      items: ['Word to PDF & OCR Conversions', 'Corporate Layout & Styling', 'Fillable Forms & Contracts'],
    },
    {
      id: 'srv-research',
      title: 'Online and Market Research',
      category: 'Research & Intelligence',
      description: 'In-depth secondary research, competitor benchmarking, industry insights, and structured summary reporting.',
      icon: <Search className="w-5 h-5 text-teal-600 dark:text-teal-400" />,
      items: ['Competitor & Market Analysis', 'Data Aggregation & Synthesis', 'Actionable Executive Summaries'],
    },
    {
      id: 'srv-excel-office',
      title: 'Microsoft Excel and Office Tasks',
      category: 'Office Automation',
      description: 'Custom spreadsheet modeling, complex formulas, pivot tables, presentation design, and routine automation.',
      icon: <FileSpreadsheet className="w-5 h-5 text-teal-600 dark:text-teal-400" />,
      items: ['Formulas, Lookups & Pivot Tables', 'Visual Reporting & Dashboards', 'PowerPoint & Word Templates'],
    },
    {
      id: 'srv-lead-gen',
      title: 'Lead Generation and Web Research',
      category: 'Sales Support',
      description: 'Targeted business prospect lists, contact information verification, LinkedIn research, and pipeline preparation.',
      icon: <Target className="w-5 h-5 text-teal-600 dark:text-teal-400" />,
      items: ['B2B Prospect List Building', 'Contact Verification & Scoring', 'Industry Directory Mining'],
    },
    {
      id: 'srv-graphic-design',
      title: 'Graphic Design and Digital Content',
      category: 'Creative Design',
      description: 'Eye-catching social media banners, brand stationery, business cards, event flyers, and visual marketing assets.',
      icon: <Palette className="w-5 h-5 text-teal-600 dark:text-teal-400" />,
      items: ['Brand Identity & Stationery', 'Social Media & Marketing Graphics', 'Commercial Flyers & Banners'],
    },
    {
      id: 'srv-ai-support',
      title: 'AI-Assisted Business Support',
      category: 'Digital Innovation',
      description: 'Applying pragmatic AI workflows for accelerated drafting, workflow optimization, content refinement, and research.',
      icon: <Sparkles className="w-5 h-5 text-teal-600 dark:text-teal-400" />,
      items: ['Smart Workflow Automation', 'AI-Assisted Content Structuring', 'Productivity Optimization'],
    },
    {
      id: 'srv-data-workflow',
      title: 'Data Organization and Workflow Support',
      category: 'Operations',
      description: 'Organizing complex folders, digital filing systems, standard operating guidelines, and business process tracking.',
      icon: <Layers className="w-5 h-5 text-teal-600 dark:text-teal-400" />,
      items: ['Cloud Drive File Structuring', 'Process Documentation (SOPs)', 'Workflow Streamlining'],
    },
    {
      id: 'srv-project-ops',
      title: 'Project and Operational Assistance',
      category: 'Project Operations',
      description: 'Hands-on operational coordination, milestone tracking, logistics communication, and task monitoring.',
      icon: <CheckCircle2 className="w-5 h-5 text-teal-600 dark:text-teal-400" />,
      items: ['Timeline & Deliverable Tracking', 'Resource Coordination', 'Status Reporting'],
    },
    {
      id: 'srv-stationery-sales',
      title: 'Stationery Sales & Printing Supplies',
      category: 'Office Supplies',
      description: 'Office paper reams, durable document files, binding combs, customized memo pads, and general supplies.',
      icon: <PackageOpen className="w-5 h-5 text-teal-600 dark:text-teal-400" />,
      items: ['Quality Bond & Art Paper Reams', 'Filing Folders & Binding Covers', 'Customized Branded Jotters'],
    },
  ];

  const workSteps = [
    {
      step: '01',
      title: 'Customer Inquiry',
      desc: 'You reach out via WhatsApp, phone, email, or our contact form with your service requirements, timeline, and scope.',
    },
    {
      step: '02',
      title: 'Understanding Requirements',
      desc: 'We review your project specs, clarify questions, agree on clear deliverables, and provide a transparent, competitive quote.',
    },
    {
      step: '03',
      title: 'Executing & Delivering Service',
      desc: 'Our experienced specialists complete your work with rigorous quality checks, meticulous formatting, and prompt turnaround.',
    },
    {
      step: '04',
      title: 'Follow-Up & Ongoing Support',
      desc: 'We deliver your final files or products, ensure your complete satisfaction, and provide continuous operational assistance.',
    },
  ];

  const benefits = [
    {
      title: 'Meticulous Organization',
      desc: 'Systematic workflows and structured filing ensure your documents, spreadsheets, and data are always neatly organized and instantly accessible.',
      icon: <Layers className="w-6 h-6 text-teal-600 dark:text-teal-400" />,
    },
    {
      title: 'High Accuracy & Precision',
      desc: 'Double-verified data entry, professional proofreading, and exact document formatting to eliminate costly errors and maintain executive standards.',
      icon: <CheckCircle2 className="w-6 h-6 text-teal-600 dark:text-teal-400" />,
    },
    {
      title: 'Reliable & Prompt Support',
      desc: 'Dependable service delivery respecting agreed deadlines, with fast customer service and direct WhatsApp communication during business hours.',
      icon: <Clock className="w-6 h-6 text-teal-600 dark:text-teal-400" />,
    },
    {
      title: 'Improved Business Productivity',
      desc: 'Free up valuable hours for your leadership team by delegating administrative, documentation, and digital support tasks to trusted specialists.',
      icon: <Briefcase className="w-6 h-6 text-teal-600 dark:text-teal-400" />,
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-16 transition-colors">
      {/* ============================================================= */}
      {/* SECTION 1: HERO SECTION */}
      {/* Requirements: */}
      {/* - Display HogTech International Ventures identity and existing logo */}
      {/* - Clear, professional headline explaining how HogTech helps businesses */}
      {/* - Concise description of company's services */}
      {/* - Prominent buttons: "Explore Our Services" and "Contact Us" */}
      {/* - Keep layout uncluttered, responsive, visually attractive */}
      {/* - DO NOT SHOW physical office address in this section */}
      {/* ============================================================= */}
      <section
        id="hero-section"
        aria-labelledby="hero-heading"
        className="relative overflow-hidden bg-gradient-to-b from-[#081426] via-[#0b1b33] to-slate-900 text-white pt-10 pb-16 sm:pt-14 sm:pb-20 lg:pt-16 lg:pb-24 border-b border-slate-800"
      >
        {/* Animated Hero Background with Hogetech_hero_images.jpeg */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
          {/* Animated image layer with smooth Ken Burns scale and drift */}
          <div
            className="absolute inset-0 bg-cover bg-center animate-hero-kenburns transition-transform duration-1000 will-change-transform"
            style={{
              backgroundImage: `url(${hogtechHeroBgImage})`,
              filter: 'brightness(0.24) saturate(1.3) contrast(1.15)',
            }}
          />

          {/* High-contrast multi-stop gradient overlays to ensure text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#081426] via-[#081426]/90 to-[#081426]/75" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#081426] via-transparent to-[#081426]/85" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#081426]/70 via-transparent to-[#081426]" />

          {/* Ambient high-tech glowing radial meshes */}
          <div className="absolute -top-32 -left-20 w-[28rem] h-[28rem] bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/3 -right-20 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-10 left-1/3 w-80 h-80 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />

          {/* Subtle tech dot matrix overlay */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`,
              backgroundSize: '24px 24px',
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Left Column (7 cols): Selected element with modern attractive styling */}
            <div className="lg:col-span-7 space-y-6 relative rounded-3xl p-6 sm:p-8 lg:p-9 bg-slate-950/50 backdrop-blur-xl border border-teal-500/25 shadow-2xl shadow-slate-950/80 transition-all hover:border-teal-500/40">
              {/* Subtle top ambient glowing accent line */}
              <div className="absolute top-0 inset-x-8 h-px bg-gradient-to-r from-transparent via-teal-400/60 to-transparent pointer-events-none" />

              {/* Status and Welcome Intro Badges */}
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                {/* Office Live Status */}
                <LiveOfficeStatus
                  openingHours={settings.openingHours}
                  variant="badge"
                  className="shadow-sm"
                />

                {/* Small introductory text with tech glow */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/15 border border-teal-400/40 text-xs text-teal-300 font-semibold tracking-wider uppercase shadow-sm shadow-teal-950/50">
                  <Sparkles className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
                  <span>WELCOME TO HOGTECH INT’L VENTURES</span>
                </div>
              </div>

              {/* Main heading */}
              <h1
                id="hero-heading"
                className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] leading-[1.14] tracking-tight text-white text-balance drop-shadow-sm"
              >
                Empowering Businesses Through{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-cyan-200 to-teal-100 drop-shadow-sm">
                  Digital Solutions
                </span>
              </h1>

              {/* Supporting text */}
              <p className="text-base sm:text-lg text-slate-200 leading-relaxed max-w-2xl font-normal drop-shadow-sm">
                We provide professional printing, typing, computer training, graphics design, data entry, online services, and technology-enabled business solutions.
              </p>

              {/* Primary & Secondary Action Buttons (including visible Admin portal access) */}
              <div className="pt-2 flex flex-wrap items-center gap-3.5">
                <button
                  type="button"
                  onClick={() => onRequestService()}
                  className="px-6 py-3.5 rounded-xl bg-teal-400 hover:bg-teal-300 active:scale-[0.98] text-slate-950 font-bold text-sm transition-all shadow-lg shadow-teal-950/60 flex items-center gap-2 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-teal-400"
                >
                  <span>Request a Service</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Admin Portal Button */}
                <button
                  type="button"
                  onClick={() => onNavigate('admin')}
                  className="px-5 py-3.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 active:scale-[0.98] text-teal-300 hover:text-white font-semibold text-sm border border-teal-500/35 hover:border-teal-400/70 transition-all flex items-center gap-2 whitespace-nowrap shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                  title="Admin Portal"
                >
                  <Shield className="w-4 h-4 text-teal-400" />
                  <span>Admin</span>
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('services')}
                  className="px-6 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 active:scale-[0.98] text-slate-200 hover:text-white font-semibold text-sm border border-slate-700 transition-all flex items-center gap-2 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-slate-400"
                >
                  <span>Explore Our Services</span>
                </button>

                <a
                  href={heroWaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3.5 rounded-xl bg-emerald-600/25 hover:bg-emerald-600/35 text-emerald-300 border border-emerald-500/40 text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-emerald-400"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp Chat</span>
                </a>
              </div>

              {/* Proof Points Highlights */}
              <div className="pt-6 grid grid-cols-3 gap-3 sm:gap-4 border-t border-slate-800/80 text-xs">
                <div>
                  <div className="font-bold text-white text-sm sm:text-base">Printing & Typing</div>
                  <div className="text-slate-400">High-speed & Precise</div>
                </div>
                <div>
                  <div className="font-bold text-teal-300 text-sm sm:text-base">Training & Design</div>
                  <div className="text-slate-400">Practical & Certified</div>
                </div>
                <div>
                  <div className="font-bold text-cyan-300 text-sm sm:text-base">Data & Online</div>
                  <div className="text-slate-400">Reliable Execution</div>
                </div>
              </div>
            </div>

            {/* Right Column (5 cols): Animated Hero Image with modern frame and floating card */}
            <div className="lg:col-span-5 relative mt-6 lg:mt-0">
              <AnimatedHeroImage onOpenLogoModal={onOpenLogoModal} />
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================= */}
      {/* SECTION 2: LATEST NEWS AND ANNOUNCEMENTS */}
      {/* Placed immediately after hero section before all other sections */}
      {/* ============================================================= */}
      <section
        id="news-section"
        aria-labelledby="news-heading"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
              Company Updates & Bulletins
            </span>
            <h2
              id="news-heading"
              className="font-display font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white mt-1"
            >
              Latest News & Announcements
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Verified company announcements, service updates, and development schedules from HogTech International Ventures.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('admin')}
            className="text-xs text-slate-500 hover:text-teal-600 dark:text-slate-400 dark:hover:text-teal-400 flex items-center gap-1 focus:outline-none"
          >
            Manage Announcements (Admin)
          </button>
        </div>

        {announcements.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 p-12 text-center bg-white dark:bg-slate-900/60">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No announcements yet. Check back soon.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {announcements.map((ann, idx) => (
              <AnimatedCard key={ann.id} index={idx} className="h-full">
                <article
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all h-full"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span className="font-semibold text-teal-700 dark:text-teal-400">{ann.category}</span>
                      <div className="flex items-center gap-1 text-[11px]">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{ann.date}</span>
                      </div>
                    </div>
                    <h3 className="font-display font-bold text-base text-slate-900 dark:text-white leading-snug">
                      {ann.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {ann.summary}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        if (ann.category.includes('Training')) {
                          onOpenTraining();
                        } else {
                          onRequestService('General', ann.title);
                        }
                      }}
                      className="text-xs font-semibold text-teal-700 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-300 flex items-center gap-1 focus:outline-none"
                    >
                      <span>{ann.category.includes('Training') ? 'Apply for Training' : 'Enquire Now'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    {ann.badge && (
                      <span className="text-[10px] bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 font-medium px-2 py-0.5 rounded border border-teal-200 dark:border-teal-800/60">
                        {ann.badge}
                      </span>
                    )}
                  </div>
                </article>
              </AnimatedCard>
            ))}
          </div>
        )}
      </section>

      {/* ============================================================= */}
      {/* SECTION 3: ABOUT HOGTECH INTERNATIONAL VENTURES */}
      {/* ============================================================= */}
      <section
        id="about-section"
        aria-labelledby="about-heading"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-sm transition-colors">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-3.5">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                About Us
              </span>
              <h2
                id="about-heading"
                className="font-display font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white"
              >
                Empowering Businesses Through Digital & Administrative Solutions
              </h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
                HogTech International Ventures provides professional printing, certified computer training, typing, data management, and digital services with speed, precision, and strict confidentiality.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-xs text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                  <span>High-speed printing & binding</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                  <span>Certified computer training programs</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                  <span>Accurate typing & data entry</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                  <span>Strict privacy & fast turnaround</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col items-start lg:items-end justify-center gap-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 w-full text-center space-y-1.5">
                <div className="text-base font-extrabold text-slate-900 dark:text-white">
                  Hogtech Int'l Ventures
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Calabar, Cross River State
                </div>
                <div className="text-[11px] text-teal-600 dark:text-teal-400 font-semibold pt-0.5">
                  Operating Hours: Mon–Fri 8:00 AM – 8:00 PM · Sat 10:00 AM – 7:00 PM
                </div>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('about')}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-teal-500 dark:hover:bg-teal-400 text-white dark:text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"
              >
                <span>Learn More</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================= */}
      {/* SECTION 4: OUR SERVICES */}
      {/* Organized into 11 clear responsive cards as specified */}
      {/* ============================================================= */}
      {/* ============================================================= */}
      {/* SECTION 4: OUR SERVICES */}
      {/* Short concise overview with Learn More action leading to Services Page */}
      {/* ============================================================= */}
      <section
        id="services-section"
        aria-labelledby="services-heading"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-sm transition-colors">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-3.5">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                Our Services
              </span>
              <h2
                id="services-heading"
                className="font-display font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white"
              >
                Digital, Printing & Business Solutions
              </h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
                High-speed printing, thesis and project binding, certified computer training, typing, data management, and operational tech support.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-xs text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                  <span>Commercial printing, color copying & binding</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                  <span>Certified computer training & digital skills</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                  <span>Accurate document typing & project formatting</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                  <span>Branding, stationery, data entry & IT consultation</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col items-stretch sm:items-end justify-center gap-3">
              <button
                type="button"
                onClick={() => onNavigate('services')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-teal-500 dark:hover:bg-teal-400 text-white dark:text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"
              >
                <span>Learn More</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              {onOpenEstimator ? (
                <button
                  type="button"
                  onClick={onOpenEstimator}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 font-bold text-xs hover:bg-teal-100 dark:hover:bg-teal-900 transition-colors flex items-center justify-center gap-2 focus:outline-none"
                >
                  <Calculator className="w-4 h-4" />
                  <span>Instant Cost Estimator</span>
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => onRequestService()}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors text-center focus:outline-none"
              >
                Request a Service
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================= */}
      {/* SECTION: PORTFOLIO & RECENT WORK */}
      {/* ============================================================= */}
      <section
        id="portfolio-section"
        aria-labelledby="portfolio-heading"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
              Portfolio
            </span>
            <h2
              id="portfolio-heading"
              className="font-display font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white mt-1"
            >
              Our Work & Projects
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl mt-1">
              A showcase of recent print production, branded stationery, event programs, and computer training.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('portfolio')}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-teal-500 dark:hover:bg-teal-400 text-white dark:text-slate-950 font-bold text-xs transition-colors flex items-center gap-1.5 shrink-0 focus:outline-none shadow-sm"
          >
            <span>Learn More</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 3 Featured Portfolio Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(portfolio && portfolio.length > 0 ? portfolio.slice(0, 3) : [
            {
              id: "port-01",
              title: "Summit Programme & Materials",
              category: "Printing & Editorial",
              description: "Booklet design layout, full-color printing, and delegate binding.",
              image: "/src/assets/images/hero_hogtech_workspace_1791613498907.jpg",
              clientType: "Corporate Conference",
              completionDate: "September 2026",
            },
            {
              id: "port-02",
              title: "Deluxe Event Jotters & Invitations",
              category: "Custom Stationery",
              description: "Gold-accented hardbound souvenir jotters and banquet order of events.",
              image: "/src/assets/images/portfolio_event_programs_1791613507577.jpg",
              clientType: "Special Event",
              completionDate: "August 2026",
            },
            {
              id: "port-03",
              title: "Executive Stationery & Brand Suite",
              category: "Branding & Graphics",
              description: "Corporate stationery, custom business cards, and presentation folders.",
              image: "/src/assets/images/portfolio_branding_suite_1791613516522.jpg",
              clientType: "Business Client",
              completionDate: "October 2026",
            },
          ]).map((item, idx) => (
            <AnimatedCard key={item.id} index={idx} className="h-full">
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md transition-all group h-full">
                <div className="relative h-48 overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <LazyImage
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    containerClassName="w-full h-full"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 pointer-events-none">
                    <span className="text-[10px] font-bold bg-slate-900/90 text-teal-300 px-2.5 py-1 rounded-md backdrop-blur-sm">
                      {item.category}
                    </span>
                  </div>
                </div>

                <div className="p-5 flex flex-col justify-between flex-1 space-y-3">
                  <div>
                    <h3 className="font-display font-bold text-base text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                      {item.clientType || 'Completed Project'}
                    </span>
                    <button
                      type="button"
                      onClick={() => onNavigate('portfolio')}
                      className="font-bold text-xs text-teal-700 hover:text-teal-900 dark:text-teal-400 dark:hover:text-teal-300 flex items-center gap-1 focus:outline-none"
                    >
                      <span>Learn More</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </AnimatedCard>
          ))}
        </div>

        {/* Action to Learn More about all portfolio work */}
        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => onNavigate('portfolio')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors shadow-sm"
          >
            <span>Learn More — View Full Portfolio</span>
            <ArrowRight className="w-4 h-4 text-teal-500" />
          </button>
        </div>
      </section>

      {/* ============================================================= */}
      {/* TESTIMONIALS & CLIENT FEEDBACK (CAROUSEL & GRID MODES) */}
      {/* Building trust and social proof with verified reviews and metrics */}
      {/* ============================================================= */}
      <Testimonials
        testimonials={testimonials}
        whatsappNumber={settings.whatsappNumber}
        onRequestQuote={() => onRequestService()}
        onNavigate={onNavigate}
      />

      {/* ============================================================= */}
      {/* SECTION 5: WHY CHOOSE HOGTECH */}
      {/* Genuine benefits: organization, accuracy, reliable support, productivity */}
      {/* ============================================================= */}
      <section
        id="why-choose-section"
        aria-labelledby="why-choose-heading"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8"
      >
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
            Proven Value
          </span>
          <h2
            id="why-choose-heading"
            className="font-display font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white"
          >
            Why Choose HogTech
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            We focus on genuine, practical benefits that streamline operations and elevate business performance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((b, idx) => (
            <AnimatedCard key={idx} index={idx} className="h-full">
              <div
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-3 hover:shadow-md transition-shadow h-full"
              >
                <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800/60 flex items-center justify-center">
                  {b.icon}
                </div>
                <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
                  {b.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {b.desc}
                </p>
              </div>
            </AnimatedCard>
          ))}
        </div>
      </section>

      {/* ============================================================= */}
      {/* SECTION 6: HOW WE WORK */}
      {/* Inquiry -> Requirements -> Delivering -> Follow-up */}
      {/* ============================================================= */}
      <section
        id="how-we-work-section"
        aria-labelledby="how-we-work-heading"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8"
      >
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
            Transparent Workflow
          </span>
          <h2
            id="how-we-work-heading"
            className="font-display font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white"
          >
            How We Work
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            From initial consultation to final delivery, our step-by-step process keeps you in control every step of the way.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {workSteps.map((ws, idx) => (
            <AnimatedCard key={idx} index={idx} className="h-full">
              <div
                className="relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-3 h-full"
              >
                <div className="font-mono text-2xl font-extrabold text-teal-600 dark:text-teal-400">
                  {ws.step}
                </div>
                <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
                  {ws.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {ws.desc}
                </p>
              </div>
            </AnimatedCard>
          ))}
        </div>
      </section>

      {/* ============================================================= */}
      {/* SECTION 7: CALL TO ACTION */}
      {/* Encourage inquiries, request quotation, contact company */}
      {/* ============================================================= */}
      <section
        id="cta-section"
        aria-labelledby="cta-heading"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="rounded-2xl bg-gradient-to-r from-[#081426] via-[#0c1c36] to-slate-900 border border-slate-800 text-white p-8 sm:p-14 text-center space-y-6 shadow-xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-semibold text-teal-400 uppercase tracking-widest">
              Ready to Upgrade Your Operations?
            </span>
            <h2
              id="cta-heading"
              className="font-display font-bold text-2xl sm:text-4xl text-white text-balance"
            >
              Let’s Discuss How HogTech Can Support Your Next Project
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Inquire about our digital support and administrative services, request a tailored quotation, or start a direct conversation with our team right now.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => onOpenEstimator ? onOpenEstimator() : onNavigate('services')}
              className="px-6 py-3.5 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold text-sm transition-all shadow-md active:scale-95 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
            >
              <Calculator className="w-4 h-4" />
              <span>Instant Print Estimator</span>
            </button>
            <button
              type="button"
              onClick={() => onRequestService()}
              className="px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm border border-slate-700 transition-colors flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-slate-400"
            >
              <span>Request a Quotation</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href={heroWaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-white font-semibold text-sm border border-slate-700 transition-colors flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-slate-400"
            >
              <MessageSquare className="w-4 h-4 text-teal-400" />
              <span>Chat on WhatsApp</span>
            </a>
            <button
              type="button"
              onClick={() => onNavigate('contact')}
              className="px-6 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-white font-semibold text-sm border border-slate-700 transition-colors flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-slate-400"
            >
              <span>Learn More — Contact Us</span>
              <ArrowRight className="w-4 h-4 text-teal-400" />
            </button>
          </div>
        </div>
      </section>

      {/* ============================================================= */}
      {/* SECTION 8: CONTACT SECTION */}
      {/* Display existing contact details and working contact methods */}
      {/* Easy to find and use on mobile devices */}
      {/* ============================================================= */}
      <section
        id="contact-section"
        aria-labelledby="contact-heading"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
              Contact Us
            </span>
            <h2
              id="contact-heading"
              className="font-display font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white mt-1"
            >
              Get In Touch
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl mt-1">
              Reach our team for service requests, quotes, or office visits at 76 Ekpo Abasi Street, Calabar.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('contact')}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-teal-500 dark:hover:bg-teal-400 text-white dark:text-slate-950 font-bold text-xs transition-colors flex items-center gap-1.5 shrink-0 focus:outline-none shadow-sm"
          >
            <span>Learn More</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="max-w-3xl mx-auto w-full">
          {/* Quick Inquiry Form */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-5 shadow-sm">
            <div>
              <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                Send an Online Inquiry
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Fill out the quick form below and our team will get in touch with you promptly.
              </p>
            </div>

            {contactFormStatus === 'success' && (
              <div className="p-4 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-200 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                <span>
                  Thank you! Your message has been received. Our team will review your inquiry and follow up shortly.
                </span>
              </div>
            )}

            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
                  >
                    Your Full Name *
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={contactFormData.name}
                    onChange={(e) => setContactFormData({ ...contactFormData, name: e.target.value })}
                    placeholder="e.g. Samuel Okon"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-phone"
                    className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
                  >
                    Phone Number or Email *
                  </label>
                  <input
                    id="contact-phone"
                    type="text"
                    required
                    value={contactFormData.emailOrPhone}
                    onChange={(e) => setContactFormData({ ...contactFormData, emailOrPhone: e.target.value })}
                    placeholder="090... or you@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="contact-service"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
                >
                  Service of Interest
                </label>
                <select
                  id="contact-service"
                  value={contactFormData.serviceInterest}
                  onChange={(e) => setContactFormData({ ...contactFormData, serviceInterest: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                >
                  {structuredServices.map((s) => (
                    <option key={s.id} value={s.title}>
                      {s.title}
                    </option>
                  ))}
                  <option value="General Support">General Support & Consultation</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="contact-message"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
                >
                  Project Details / Message *
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={4}
                  value={contactFormData.message}
                  onChange={(e) => setContactFormData({ ...contactFormData, message: e.target.value })}
                  placeholder="Tell us about your project requirements, timeline, or questions..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={contactFormStatus === 'submitting'}
                className="w-full py-3.5 px-4 rounded-xl bg-teal-500 hover:bg-teal-600 disabled:opacity-50 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <Send className="w-4 h-4" />
                <span>
                  {contactFormStatus === 'submitting' ? 'Submitting Inquiry...' : 'Submit Inquiry'}
                </span>
              </button>
            </form>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
              <button
                type="button"
                onClick={() => onNavigate('contact')}
                className="text-xs text-slate-500 hover:text-teal-600 dark:text-slate-400 dark:hover:text-teal-400 font-medium inline-flex items-center gap-1.5 transition-colors focus:outline-none"
              >
                <span>Need phone numbers, WhatsApp, or office directions?</span>
                <span className="font-bold text-teal-600 dark:text-teal-400 inline-flex items-center gap-1">
                  Learn More <ArrowRight className="w-3 h-3" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================= */}
      {/* SECTION 9: FOOTER */}
      {/* Note: The Footer component itself handles Section 9 in App.tsx */}
      {/* ============================================================= */}
    </div>
  );
};
