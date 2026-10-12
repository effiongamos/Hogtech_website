import React, { useState } from 'react';
import { Menu, X, Sparkles, Calculator, Search } from 'lucide-react';
import { HogtechLogo } from './HogtechLogo.tsx';
import { ThemeToggle } from './ThemeToggle.tsx';
import { VoiceReader } from './VoiceReader.tsx';
import { HeaderSearch } from './HeaderSearch.tsx';
import { CompanySettings, ServiceItem, PortfolioItem } from '../types/index.ts';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  settings: CompanySettings;
  services?: ServiceItem[];
  portfolio?: PortfolioItem[];
  onRequestService?: (category?: string, item?: string, details?: string) => void;
  onOpenTraining?: () => void;
  onOpenLogoModal?: () => void;
  onOpenEstimator?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  settings,
  services,
  portfolio,
  onRequestService,
  onOpenTraining,
  onOpenLogoModal,
  onOpenEstimator,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchModalOpen, setMobileSearchModalOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'services', label: 'Services' },
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'contact', label: 'Contact Us' },
  ];

  const handleNavClick = (pageId: string) => {
    onNavigate(pageId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#081426]/95 dark:bg-[#060e1a]/95 backdrop-blur-md border-b border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 sm:gap-6 h-20">
          {/* Zone 1: Brand Wordmark with Official Logo */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 sm:gap-3 text-left focus:outline-none focus:ring-2 focus:ring-teal-400 rounded-lg group shrink-0"
            aria-label="HogTech International Ventures Home"
          >
            <HogtechLogo size="sm" variant="emblem" />
            <span className="font-display font-bold text-white tracking-tight text-base sm:text-lg leading-tight group-hover:text-teal-300 transition-colors">
              HogTech Int’l <span className="text-teal-400 font-medium">Ventures</span>
            </span>
          </button>

          {/* Zone 2: Navigation Links (Desktop) */}
          <nav
            aria-label="Main Navigation"
            className="navbar-nav-menu hidden md:flex items-center justify-center gap-5 lg:gap-8 text-sm font-medium text-slate-300"
          >
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative py-1.5 px-1 whitespace-nowrap shrink-0 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-400 rounded ${
                    isActive
                      ? 'text-teal-300 font-semibold'
                      : 'text-slate-300 hover:text-white'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-teal-400 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 2.5: Header Search Bar (Desktop & Tablet) */}
          <div className="hidden md:block w-44 lg:w-60 xl:w-72 shrink-0">
            <HeaderSearch
              currentPage={currentPage}
              onNavigate={handleNavClick}
              settings={settings}
              services={services}
              portfolio={portfolio}
              onRequestService={onRequestService}
              onOpenTraining={onOpenTraining}
              onOpenLogoModal={onOpenLogoModal}
              onOpenEstimator={onOpenEstimator}
            />
          </div>

          {/* Zone 3: Utilities & Mobile Menu Toggle */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Mobile Search Button */}
            <button
              type="button"
              onClick={() => setMobileSearchModalOpen(true)}
              className="md:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-400"
              aria-label="Search services, portfolio, and contact information"
              title="Search"
            >
              <Search className="w-5 h-5 text-teal-400" />
            </button>

            {/* Interactive Print Estimator quick button */}
            {onOpenEstimator && (
              <button
                type="button"
                onClick={onOpenEstimator}
                className="hidden xl:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-teal-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-teal-500/30 transition-all focus:outline-none focus:ring-2 focus:ring-teal-400"
                title="Interactive Printing Cost Estimator"
              >
                <Calculator className="w-3.5 h-3.5 text-teal-400" />
                <span>Estimator</span>
              </button>
            )}

            {/* Official Logo Modal trigger button */}
            {onOpenLogoModal && (
              <button
                type="button"
                onClick={onOpenLogoModal}
                className="hidden 2xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-teal-300 hover:bg-slate-800/60 transition-colors border border-slate-700/60 focus:outline-none"
                title="View Exact HogTech Logo & Assets"
              >
                <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                <span>Logo</span>
              </button>
            )}

            {/* Voice Accessibility: Read Page Aloud */}
            <div className="hidden lg:block">
              <VoiceReader />
            </div>

            {/* Dark Mode Toggle */}
            <ThemeToggle />

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-400"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Quick Search Overlay Modal */}
      {mobileSearchModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md p-4 flex flex-col items-center justify-start pt-16 animate-in fade-in duration-150 md:hidden"
        >
          <div className="w-full max-w-lg bg-[#081528] border border-slate-700/90 rounded-2xl p-4 shadow-2xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-semibold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5" />
                Quick Search
              </span>
              <button
                type="button"
                onClick={() => setMobileSearchModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                aria-label="Close search modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <HeaderSearch
              currentPage={currentPage}
              onNavigate={(page) => {
                handleNavClick(page);
                setMobileSearchModalOpen(false);
              }}
              settings={settings}
              services={services}
              portfolio={portfolio}
              onRequestService={(cat, it, det) => {
                setMobileSearchModalOpen(false);
                if (onRequestService) onRequestService(cat, it, det);
              }}
              onOpenTraining={() => {
                setMobileSearchModalOpen(false);
                if (onOpenTraining) onOpenTraining();
              }}
              onOpenLogoModal={() => {
                setMobileSearchModalOpen(false);
                if (onOpenLogoModal) onOpenLogoModal();
              }}
              onOpenEstimator={() => {
                setMobileSearchModalOpen(false);
                if (onOpenEstimator) onOpenEstimator();
              }}
              onItemSelect={() => setMobileSearchModalOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation"
          role="region"
          aria-label="Mobile Navigation Menu"
          className="md:hidden bg-[#0a192f] dark:bg-[#071324] border-b border-slate-800 px-4 pt-3 pb-6 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200"
        >
          {/* Mobile Search Bar inside Drawer */}
          <div className="pb-3 border-b border-slate-800/80">
            <HeaderSearch
              currentPage={currentPage}
              onNavigate={(page) => {
                handleNavClick(page);
                setMobileMenuOpen(false);
              }}
              settings={settings}
              services={services}
              portfolio={portfolio}
              onRequestService={(cat, it, det) => {
                setMobileMenuOpen(false);
                if (onRequestService) onRequestService(cat, it, det);
              }}
              onOpenTraining={() => {
                setMobileMenuOpen(false);
                if (onOpenTraining) onOpenTraining();
              }}
              onOpenLogoModal={() => {
                setMobileMenuOpen(false);
                if (onOpenLogoModal) onOpenLogoModal();
              }}
              onOpenEstimator={() => {
                setMobileMenuOpen(false);
                if (onOpenEstimator) onOpenEstimator();
              }}
              isMobileDrawer={true}
              onItemSelect={() => setMobileMenuOpen(false)}
            />
          </div>

          {/* Mobile Voice Accessibility */}
          <div className="pb-3 border-b border-slate-800/80 flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Accessibility:</span>
            <VoiceReader />
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-teal-500/15 text-teal-300 font-semibold border-l-4 border-teal-400'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {onOpenEstimator && (
            <div className="pt-3 border-t border-slate-800/80">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenEstimator();
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-teal-300 bg-slate-800/90 border border-teal-500/40 hover:bg-slate-800 transition-colors"
              >
                <Calculator className="w-4 h-4 text-teal-400" />
                <span>Interactive Print Estimator</span>
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
