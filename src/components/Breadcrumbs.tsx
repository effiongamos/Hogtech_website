import React from 'react';
import { Home, ChevronRight, ArrowLeft } from 'lucide-react';

interface BreadcrumbsProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  subCategory?: string;
  onClearSubCategory?: () => void;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  currentPage,
  onNavigate,
  subCategory,
  onClearSubCategory,
}) => {
  // Only display on inner pages
  if (currentPage === 'home') {
    return null;
  }

  const pageLabels: Record<string, string> = {
    about: 'About Us',
    services: 'Our Services',
    portfolio: 'Work Portfolio',
    contact: 'Contact & Location',
    admin: 'Admin Portal',
  };

  const currentLabel = pageLabels[currentPage] || currentPage;

  return (
    <nav
      aria-label="Breadcrumb navigation"
      className="bg-[#071120] border-b border-slate-800/80 text-xs py-2.5 px-4 sm:px-6 lg:px-8 transition-colors"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Breadcrumb Path Trail */}
        <ol className="flex items-center gap-1.5 sm:gap-2 text-slate-400 overflow-x-auto whitespace-nowrap scrollbar-none">
          {/* Home Link */}
          <li className="inline-flex items-center">
            <button
              onClick={() => onNavigate('home')}
              className="inline-flex items-center gap-1.5 text-slate-400 hover:text-teal-300 transition-colors focus:outline-none focus:text-teal-300 group"
              title="Return to Home page"
            >
              <Home className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
              <span>Home</span>
            </button>
          </li>

          {/* Separator */}
          <li aria-hidden="true" className="text-slate-600 select-none">
            <ChevronRight className="w-3.5 h-3.5" />
          </li>

          {/* Current Page */}
          <li className="inline-flex items-center">
            {subCategory ? (
              <button
                onClick={() => {
                  if (onClearSubCategory) onClearSubCategory();
                }}
                className="text-slate-400 hover:text-teal-300 transition-colors focus:outline-none"
              >
                {currentLabel}
              </button>
            ) : (
              <span
                className="text-teal-300 font-medium"
                aria-current="page"
              >
                {currentLabel}
              </span>
            )}
          </li>

          {/* Optional Nested Sub-Category / Project */}
          {subCategory && (
            <>
              <li aria-hidden="true" className="text-slate-600 select-none">
                <ChevronRight className="w-3.5 h-3.5" />
              </li>
              <li className="inline-flex items-center">
                <span
                  className="text-teal-300 font-medium"
                  aria-current="page"
                >
                  {subCategory}
                </span>
              </li>
            </>
          )}
        </ol>

        {/* Quick Back to Home Action Button */}
        <button
          onClick={() => onNavigate('home')}
          className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 hover:text-white transition-colors focus:outline-none shrink-0"
        >
          <ArrowLeft className="w-3 h-3" />
          <span>Back to Home</span>
        </button>
      </div>
    </nav>
  );
};
