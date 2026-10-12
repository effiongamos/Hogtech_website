import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, ArrowUpRight } from 'lucide-react';
import { Navbar } from './components/Navbar.tsx';
import { Footer } from './components/Footer.tsx';
import { HomePage } from './pages/HomePage.tsx';
import { AboutPage } from './pages/AboutPage.tsx';
import { ServicesPage } from './pages/ServicesPage.tsx';
import { PortfolioPage } from './pages/PortfolioPage.tsx';
import { ContactPage } from './pages/ContactPage.tsx';
import { AdminPage } from './pages/AdminPage.tsx';
import { AIAssistantModal } from './components/AIAssistantModal.tsx';
import { ServiceRequestModal } from './components/ServiceRequestModal.tsx';
import { TrainingModal } from './components/TrainingModal.tsx';
import { LogoViewerModal } from './components/LogoViewerModal.tsx';
import { EstimatorModal } from './components/EstimatorModal.tsx';
import { CompanySettings, Announcement, ServiceItem, PortfolioItem, TeamMember, PollData, Testimonial } from './types/index.ts';
import { Breadcrumbs } from './components/Breadcrumbs.tsx';
import { perfLogger } from './utils/perfLogger.ts';
import { DevPerformanceHUD } from './components/DevPerformanceHUD.tsx';

// Initial fallback data to guarantee immediate zero-latency rendering
const defaultSettings: CompanySettings = {
  businessName: "Hogtech Int'l Ventures",
  tagline: 'Innovation · Print · Tech · Solutions',
  slogan: 'Your Vision, Our Priority',
  address: '76 Ekpo Abasi Street, Calabar, Cross River State, Nigeria',
  phone: '+234 903 502 9081 / +234 814 219 5668',
  whatsappNumber: '2349035029081',
  email: 'info@hogtechventures.com',
  openingHours: 'Monday – Friday: 8:00 AM – 8:00 PM · Saturday: 10:00 AM – 7:00 PM (WAT)',
  facebookUrl: 'https://facebook.com/hogtechventures',
  instagramUrl: 'https://instagram.com/hogtechventures',
  tiktokUrl: 'https://tiktok.com/@hogtechventures',
  linkedinUrl: 'https://linkedin.com/company/hogtech-ventures',
  whatsappCommunityUrl: 'https://wa.me/2349035029081',
};

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [settings, setSettings] = useState<CompanySettings>(defaultSettings);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [poll, setPoll] = useState<PollData>({
    id: 'poll-skills-2026',
    question: 'Which computer skill or digital service would you like Hogtech to offer next?',
    description: 'Help us expand our service catalog and training workshops.',
    options: [
      { id: 'opt-1', text: 'Advanced Excel & Data Analytics', votes: 42 },
      { id: 'opt-2', text: 'Graphic Design & Flyer Masterclass', votes: 38 },
      { id: 'opt-3', text: 'Practical AI Productivity for Work', votes: 55 },
      { id: 'opt-4', text: 'Online Business Portal Setup & CV Clinic', votes: 29 },
    ],
  });

  // Modals state
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [selectedServiceForModal, setSelectedServiceForModal] = useState<ServiceItem | null>(null);
  const [modalInitialDetails, setModalInitialDetails] = useState<string>('');
  const [modalInitialCategory, setModalInitialCategory] = useState<string>('');
  const [modalInitialItem, setModalInitialItem] = useState<string>('');
  const [trainingModalOpen, setTrainingModalOpen] = useState(false);
  const [logoModalOpen, setLogoModalOpen] = useState(false);
  const [estimatorModalOpen, setEstimatorModalOpen] = useState(false);

  // Load site data from server
  const loadSiteData = async () => {
    try {
      const res = await fetch('/api/site-data');
      if (res.ok) {
        const data = await res.json();
        if (data.settings) setSettings(data.settings);
        if (data.announcements) setAnnouncements(data.announcements);
        if (data.services) setServices(data.services);
        if (data.portfolio) setPortfolio(data.portfolio);
        if (data.team) setTeam(data.team);
        if (data.poll) setPoll(data.poll);
        if (data.testimonials) setTestimonials(data.testimonials);
      }
    } catch (err) {
      console.warn('Could not load /api/site-data, using local fallback:', err);
    }
  };

  useEffect(() => {
    loadSiteData();
  }, []);

  // Performance tracking refs for dev transition metrics
  const previousPageRef = useRef<string>('(initial-load)');
  const navigationStartRef = useRef<number | null>(performance.now());

  // Track page transition performance metrics in development
  useEffect(() => {
    const fromPage = previousPageRef.current;
    const toPage = currentPage;
    const startTime = navigationStartRef.current ?? performance.now();

    // Measure render and commit via double RAF
    const rafId = requestAnimationFrame(() => {
      const renderPhaseMs = performance.now() - startTime;
      requestAnimationFrame(() => {
        const totalDuration = performance.now() - startTime;
        perfLogger.recordTransition(fromPage, toPage, totalDuration, renderPhaseMs);
      });
    });

    previousPageRef.current = currentPage;
    navigationStartRef.current = null;

    return () => cancelAnimationFrame(rafId);
  }, [currentPage]);

  const handleNavigate = (page: string) => {
    if (page !== currentPage) {
      navigationStartRef.current = performance.now();
    }
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRequestService = (category?: string, item?: string, details?: string) => {
    if (category) {
      const found = services.find((s) => s.category === category);
      setSelectedServiceForModal(found || null);
      setModalInitialCategory(category);
    } else {
      setSelectedServiceForModal(null);
      setModalInitialCategory('');
    }
    setModalInitialItem(item || '');
    setModalInitialDetails(details || '');
    setServiceModalOpen(true);
  };

  const handleVotePoll = async (optionId: string) => {
    try {
      const res = await fetch('/api/surveys/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ optionId }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.poll) setPoll(data.poll);
      }
    } catch (err) {
      console.error('Failed to submit vote:', err);
    }
  };

  const cleanWaNumber = settings.whatsappNumber.replace(/[^0-9]/g, '');
  const floatingWaUrl = `https://wa.me/${cleanWaNumber}?text=${encodeURIComponent(
    `Hello Hogtech Int’l Ventures. I am browsing your ${currentPage} page and would like to ask a question.`
  )}`;

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#071324] text-slate-900 dark:text-slate-100 font-sans selection:bg-teal-500 selection:text-white transition-colors duration-200">
      {/* Top Navigation */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        settings={settings}
        services={services}
        portfolio={portfolio}
        onRequestService={handleRequestService}
        onOpenTraining={() => setTrainingModalOpen(true)}
        onOpenLogoModal={() => setLogoModalOpen(true)}
        onOpenEstimator={() => setEstimatorModalOpen(true)}
      />

      {/* Breadcrumb Navigation on Inner Pages */}
      <Breadcrumbs
        currentPage={currentPage}
        onNavigate={handleNavigate}
      />

      {/* Main Page Body */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            settings={settings}
            announcements={announcements}
            services={services}
            portfolio={portfolio}
            testimonials={testimonials}
            poll={poll}
            onNavigate={handleNavigate}
            onRequestService={handleRequestService}
            onOpenTraining={() => setTrainingModalOpen(true)}
            onVotePoll={handleVotePoll}
            onOpenLogoModal={() => setLogoModalOpen(true)}
            onOpenEstimator={() => setEstimatorModalOpen(true)}
          />
        )}

        {currentPage === 'about' && (
          <AboutPage
            settings={settings}
            team={team}
            onNavigate={handleNavigate}
            onRequestService={() => handleRequestService()}
          />
        )}

        {currentPage === 'services' && (
          <ServicesPage
            services={services}
            settings={settings}
            onRequestService={handleRequestService}
            onOpenTraining={() => setTrainingModalOpen(true)}
          />
        )}

        {currentPage === 'portfolio' && (
          <PortfolioPage
            portfolio={portfolio}
            settings={settings}
            onRequestService={handleRequestService}
          />
        )}

        {currentPage === 'contact' && (
          <ContactPage settings={settings} />
        )}

        {currentPage === 'admin' && (
          <AdminPage onDataUpdated={loadSiteData} />
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
        settings={settings}
        onOpenLogoModal={() => setLogoModalOpen(true)}
      />

      {/* Floating WhatsApp Quick Link on Bottom-Left */}
      <div className="fixed bottom-6 left-6 z-40">
        <a
          href={floatingWaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-xl active:scale-95 transition-all"
          aria-label="Direct WhatsApp Contact"
        >
          <MessageSquare className="w-4 h-4 fill-white/20" />
          <span className="hidden sm:inline">WhatsApp Us</span>
          <ArrowUpRight className="w-3.5 h-3.5 opacity-80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </a>
      </div>

      {/* AI Assistant Modal & Trigger on Bottom-Right */}
      <AIAssistantModal
        settings={settings}
        onNavigate={handleNavigate}
        onRequestService={handleRequestService}
      />

      {/* Modals */}
      <ServiceRequestModal
        isOpen={serviceModalOpen}
        onClose={() => setServiceModalOpen(false)}
        selectedService={selectedServiceForModal}
        services={services}
        initialDetails={modalInitialDetails}
        initialCategory={modalInitialCategory}
        initialItem={modalInitialItem}
      />

      <TrainingModal
        isOpen={trainingModalOpen}
        onClose={() => setTrainingModalOpen(false)}
      />

      <LogoViewerModal
        isOpen={logoModalOpen}
        onClose={() => setLogoModalOpen(false)}
      />

      <EstimatorModal
        isOpen={estimatorModalOpen}
        onClose={() => setEstimatorModalOpen(false)}
        settings={settings}
        onRequestQuoteWithDetails={(details, category, item) => {
          handleRequestService(category, item, details);
        }}
      />

      {/* Development Performance & Lazy-Loading Suggestion HUD */}
      <DevPerformanceHUD
        currentPage={currentPage}
        onNavigate={handleNavigate}
      />
    </div>
  );
}
