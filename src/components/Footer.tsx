import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  MessageSquare,
  ArrowUpRight,
  Shield,
  FileText,
  ShieldAlert
} from 'lucide-react';
import { HogtechLogo } from './HogtechLogo.tsx';
import { LiveOfficeStatus } from './LiveOfficeStatus.tsx';
import { CompanySettings } from '../types/index.ts';

interface FooterProps {
  onNavigate: (page: string) => void;
  settings: CompanySettings;
  onOpenLogoModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, settings, onOpenLogoModal }) => {
  const [modalOpen, setModalOpen] = useState<'privacy' | 'terms' | 'prohibited' | null>(null);

  const cleanWaNumber = settings.whatsappNumber.replace(/[^0-9]/g, '');
  const waUrl = `https://wa.me/${cleanWaNumber}?text=${encodeURIComponent(
    'Hello HogTech International Ventures. I visited your website and would like to enquire about your services.'
  )}`;

  return (
    <footer className="bg-[#060e1a] text-slate-300 border-t border-slate-800/80 transition-colors">
      {/* Main Footer Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Col 1: Brand & Bio (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            <div className="flex items-center gap-3">
              <HogtechLogo size="md" variant="horizontal" theme="dark" />
              {onOpenLogoModal && (
                <button
                  type="button"
                  onClick={onOpenLogoModal}
                  className="text-[10px] bg-slate-800 hover:bg-slate-700 text-teal-300 px-2.5 py-1 rounded-lg border border-slate-700 transition-colors focus:outline-none focus:ring-1 focus:ring-teal-400"
                  title="View Exact Logo & Download Assets"
                >
                  Download SVG
                </button>
              )}
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              HogTech International Ventures provides professional administrative, digital, data management, and business support services empowering businesses, professionals, and organizations in Nigeria and internationally.
            </p>
            <div className="flex items-center gap-2.5 pt-2">
              {/* WhatsApp direct */}
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-teal-400"
                aria-label="WhatsApp"
                title="Chat on WhatsApp"
              >
                <MessageSquare className="w-4 h-4" />
              </a>
              {/* Facebook */}
              <a
                href={settings.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors text-xs font-bold focus:outline-none"
                aria-label="Facebook"
                title="Facebook"
              >
                FB
              </a>
              {/* Instagram */}
              <a
                href={settings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors text-xs font-bold focus:outline-none"
                aria-label="Instagram"
                title="Instagram"
              >
                IG
              </a>
              {/* TikTok */}
              <a
                href={settings.tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors text-xs font-bold focus:outline-none"
                aria-label="TikTok"
                title="TikTok"
              >
                TT
              </a>
              {/* LinkedIn */}
              <a
                href={settings.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors text-xs font-bold focus:outline-none"
                aria-label="LinkedIn"
                title="LinkedIn"
              >
                IN
              </a>
            </div>
          </div>

          {/* Col 2: Useful Navigation Links (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('home')}
                  className="hover:text-teal-300 transition-colors focus:outline-none"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('about')}
                  className="hover:text-teal-300 transition-colors focus:outline-none"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('services')}
                  className="hover:text-teal-300 transition-colors focus:outline-none"
                >
                  Our Services
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('portfolio')}
                  className="hover:text-teal-300 transition-colors focus:outline-none"
                >
                  Work Portfolio
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('contact')}
                  className="hover:text-teal-300 transition-colors focus:outline-none"
                >
                  Contact Us
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('admin')}
                  className="text-xs text-slate-500 hover:text-teal-400 flex items-center gap-1 transition-colors pt-1 focus:outline-none"
                >
                  <Shield className="w-3 h-3" />
                  <span>Admin Portal</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Key Services (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Core Capabilities
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('services')}
                  className="hover:text-teal-300 transition-colors text-left focus:outline-none"
                >
                  Data Entry & Data Management
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('services')}
                  className="hover:text-teal-300 transition-colors text-left focus:outline-none"
                >
                  Administrative & Virtual Assistance
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('services')}
                  className="hover:text-teal-300 transition-colors text-left focus:outline-none"
                >
                  Document Formatting & PDF Support
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('services')}
                  className="hover:text-teal-300 transition-colors text-left focus:outline-none"
                >
                  Online & Market Research
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('services')}
                  className="hover:text-teal-300 transition-colors text-left focus:outline-none"
                >
                  Microsoft Excel & Office Tasks
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('services')}
                  className="hover:text-teal-300 transition-colors text-left focus:outline-none"
                >
                  Graphic Design & Digital Content
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Live Office Status (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Contact & Hours
            </h4>
            <div className="space-y-3 text-sm text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span className="leading-snug">{settings.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-teal-400 shrink-0" />
                <span>+234 903 502 9081 / +234 814 219 5668</span>
              </div>
              <div className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4 text-teal-400 shrink-0" />
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-teal-300 transition-colors underline decoration-slate-700"
                >
                  WhatsApp: 09035029081
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-teal-400 shrink-0" />
                <span className="break-all">{settings.email}</span>
              </div>
              <div className="text-xs text-slate-500 pt-1">
                {settings.openingHours}
              </div>

              {/* Dynamic Live Status Indicator in footer */}
              <div className="pt-2">
                <LiveOfficeStatus
                  openingHours={settings.openingHours}
                  whatsappNumber={settings.whatsappNumber}
                  variant="detailed"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-center sm:text-left">
            <p>© 2026 HogTech International Ventures. All rights reserved.</p>
            <span className="hidden sm:inline text-slate-700" aria-hidden="true">•</span>
            <button
              type="button"
              onClick={() => setModalOpen('prohibited')}
              className="text-[11px] text-amber-400 hover:text-amber-300 font-medium bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/25 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-1 focus:ring-amber-400"
              title="View Reserved Rights & Prohibited Terms Policy"
            >
              <ShieldAlert className="w-3 h-3 text-amber-400 shrink-0" />
              <span>Reserved &amp; Prohibited Terms</span>
            </button>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-5">
            <button
              type="button"
              onClick={() => setModalOpen('privacy')}
              className="hover:text-slate-300 transition-colors focus:outline-none"
            >
              Privacy Policy
            </button>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <button
              type="button"
              onClick={() => setModalOpen('terms')}
              className="hover:text-slate-300 transition-colors focus:outline-none"
            >
              Terms of Use
            </button>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <button
              type="button"
              onClick={() => setModalOpen('prohibited')}
              className="hover:text-amber-300 text-slate-400 transition-colors focus:outline-none font-medium"
            >
              Prohibited Terms
            </button>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-400 hover:text-teal-300 inline-flex items-center gap-1 focus:outline-none"
            >
              WhatsApp Support <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Privacy / Terms / Prohibited Terms Modal */}
      {modalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
        >
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-xl w-full p-6 text-slate-300 space-y-4 max-h-[85vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 id="modal-title" className="font-display font-bold text-lg text-white flex items-center gap-2">
                {modalOpen === 'prohibited' ? (
                  <>
                    <ShieldAlert className="w-5 h-5 text-amber-400" />
                    Reserved Rights &amp; Prohibited Terms
                  </>
                ) : (
                  <>
                    <FileText className="w-5 h-5 text-teal-400" />
                    {modalOpen === 'privacy' ? 'Privacy Policy' : 'Terms of Use'}
                  </>
                )}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(null)}
                className="text-slate-400 hover:text-white text-sm px-2.5 py-1 rounded-lg bg-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-400"
              >
                Close
              </button>
            </div>

            {modalOpen === 'privacy' && (
              <div className="space-y-3 text-xs leading-relaxed text-slate-400">
                <p>
                  <strong>HogTech International Ventures</strong> respects your privacy. When you submit service requests, project briefs, or contact inquiries through our website or WhatsApp channel, we collect only the necessary details to fulfill your service order.
                </p>
                <p>
                  We never sell, rent, or publicly disclose customer data, spreadsheets, business documents, or private files. All digital records handled for administrative, research, and documentation services are treated with strict confidentiality.
                </p>
                <p>
                  For any privacy inquiries, reach us at {settings.address} or via email at {settings.email}.
                </p>
              </div>
            )}

            {modalOpen === 'terms' && (
              <div className="space-y-3 text-xs leading-relaxed text-slate-400">
                <p>
                  <strong>Terms of Service:</strong> By commissioning administrative, data management, design, or documentation services from HogTech International Ventures, clients agree to supply accurate requirements and review draft deliverables before sign-off.
                </p>
                <p>
                  Custom quotes and delivery schedules provided via our online inquiry form or WhatsApp are confirmed upon review of exact job specifications.
                </p>
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-300/90 text-xs space-y-1">
                  <p className="font-semibold text-amber-300">Reserved &amp; Prohibited Terms Policy:</p>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    All client orders are strictly conditioned upon our zero-tolerance policy against fraudulent documentation, counterfeit printing, and unauthorized intellectual property infringement. See our full Prohibited Terms clause for details.
                  </p>
                </div>
              </div>
            )}

            {modalOpen === 'prohibited' && (
              <div className="space-y-4 text-xs leading-relaxed text-slate-400">
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-slate-300">
                  <p className="font-semibold text-amber-300 text-xs mb-1 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-amber-400" />
                    Official Compliance &amp; Prohibited Activities Notice
                  </p>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    HogTech International Ventures operates in strict conformity with Nigerian commercial laws, the Cybercrimes (Prohibition, Prevention, etc.) Act, and international intellectual property conventions.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-white font-semibold text-xs uppercase tracking-wider">
                    1. All Rights Reserved (Intellectual Property)
                  </h4>
                  <p>
                    All brand logos, graphic marks, digital designs, training manuals, website source code, layouts, and proprietary content produced by HogTech International Ventures are protected by copyright and intellectual property legislation.
                  </p>
                  <p className="text-slate-400">
                    <strong>All rights are explicitly reserved.</strong> No client or third party may reproduce, duplicate, copy, reverse engineer, scrape, resell, or exploit any portion of our brand assets or proprietary materials without express prior written permission.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-white font-semibold text-xs uppercase tracking-wider">
                    2. Strictly Prohibited Terms &amp; Unlawful Services
                  </h4>
                  <p>
                    HogTech International Ventures maintains an absolute zero-tolerance policy. Under no circumstances will our equipment, business center computers, printing facilities, or personnel be engaged for:
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
                    <li>
                      <strong>Document Forgery &amp; Falsification:</strong> Creation, editing, scanning, or printing of fake academic certificates, university degrees, counterfeit national identity cards, driver’s licenses, international passports, government stamps, legal seals, or banking instruments.
                    </li>
                    <li>
                      <strong>Cybercrime &amp; Internet Fraud:</strong> Using workstations, internet connections, or design services for online fraud, "advance-fee" scams, phishing templates, unauthorized credential interception, or malicious software.
                    </li>
                    <li>
                      <strong>Copyright Infringement &amp; Piracy:</strong> Unauthorized bulk reproduction or commercial printing of copyrighted textbooks, software discs, proprietary exam questions, or trademarked merchandise without proven rights.
                    </li>
                    <li>
                      <strong>Defamatory, Obscene, or Harmful Content:</strong> Printing or disseminating hate speech, pornography, defamatory character assassination documents, or materials promoting violence or illegal substances.
                    </li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="text-white font-semibold text-xs uppercase tracking-wider">
                    3. Unconditional Right of Refusal &amp; Law Enforcement Reporting
                  </h4>
                  <p>
                    HogTech reserves the immediate and unilateral right to inspect digital files before processing, decline or terminate any order containing prohibited terms or illicit elements, and refer relevant suspicious activities to appropriate law enforcement authorities without prior notice.
                  </p>
                </div>
              </div>
            )}

            <div className="pt-2 text-right">
              <button
                type="button"
                onClick={() => setModalOpen(null)}
                className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-900 font-semibold text-xs rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-teal-400"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
