import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  MessageSquare,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  Loader2
} from 'lucide-react';
import { CompanySettings } from '../types/index.ts';
import { LiveOfficeStatus } from '../components/LiveOfficeStatus.tsx';

interface ContactPageProps {
  settings: CompanySettings;
}

export const ContactPage: React.FC<ContactPageProps> = ({ settings }) => {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [serviceInterest, setServiceInterest] = useState('Printing & Document Services');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [consent, setConsent] = useState(true);

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const cleanWaNumber = settings.whatsappNumber.replace(/[^0-9]/g, '');
  const directWaUrl = `https://wa.me/${cleanWaNumber}?text=${encodeURIComponent(
    'Hello Hogtech Int’l Ventures. I would like to enquire about your services at 76 Ekpo Abasi Street, Calabar.'
  )}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !contact.trim() || !message.trim()) {
      setError('Please fill in your name, contact details, and message.');
      return;
    }
    if (!consent) {
      setError('Please acknowledge the privacy consent notice to continue.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/submissions/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          contact,
          serviceInterest,
          subject,
          message,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send message');

      setSubmitted(true);
      setName('');
      setContact('');
      setSubject('');
      setMessage('');
    } catch (err: any) {
      setError(err.message || 'Unable to submit your message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-16 pb-20 transition-colors">
      {/* Header Banner */}
      <section className="bg-gradient-to-b from-[#081426] to-[#0c1c36] text-white py-16 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <span className="text-xs font-semibold text-teal-400 uppercase tracking-widest">
            Contact & Location
          </span>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-white max-w-3xl">
            Get in Touch with HogTech International Ventures
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
            Reach out to our customer support desk, phone our representative lines, or submit an inquiry for prompt administrative and digital assistance.
          </p>
        </div>
      </section>

      {/* Main Grid: Contact Details + Form */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Verified Location & Contacts (5 cols) */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                Official Business Channels
              </span>
              <h2 className="font-display font-bold text-2xl text-slate-900 dark:text-white mt-1">
                Direct Contact & Support Desk
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                Inquiries, quotes, document formatting, and project consultation.
              </p>
            </div>

            {/* Address Box */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-lg bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-400 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    HogTech International Ventures
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    {settings.address}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3.5 pt-2 border-t border-slate-100">
                <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 font-medium block">
                    Official Telephone
                  </span>
                  <span className="text-xs font-semibold text-slate-900">
                    {settings.phone}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3.5 pt-2 border-t border-slate-100">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <span className="text-[11px] text-slate-500 font-medium block">
                    WhatsApp Desk
                  </span>
                  <a
                    href={directWaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                  >
                    <span>+234 903 502 9081 (or 0814 219 5668)</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3.5 pt-2 border-t border-slate-100">
                <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 font-medium block">
                    Email Address
                  </span>
                  <span className="text-xs font-semibold text-slate-900 break-all">
                    {settings.email}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3.5 pt-2 border-t border-slate-100">
                <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="flex-1 space-y-2">
                  <div>
                    <span className="text-[11px] text-slate-500 font-medium block">
                      Opening Hours
                    </span>
                    <span className="text-xs text-slate-700">
                      {settings.openingHours}
                    </span>
                  </div>
                  <LiveOfficeStatus
                    openingHours={settings.openingHours}
                    whatsappNumber={settings.whatsappNumber}
                    variant="compact"
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Quick WhatsApp Action Banner */}
            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-xs text-emerald-800">
                <MessageSquare className="w-4 h-4" />
                <span>Fastest Response Channel</span>
              </div>
              <p className="text-xs text-emerald-900 leading-relaxed">
                Need quick quotation for printing or immediate advice? Our staff responds promptly on WhatsApp during business hours.
              </p>
              <a
                href={directWaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors"
              >
                <span>Open WhatsApp Now</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Right Column: Working Contact Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 sm:p-10 shadow-sm space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                  Online Inquiry
                </span>
                <h3 className="font-display font-bold text-2xl text-slate-900 dark:text-white mt-1">
                  Send Us a Direct Message
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  We reply via phone or email within working hours.
                </p>
              </div>

              {submitted ? (
                <div className="py-10 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="font-display font-bold text-xl text-slate-900 dark:text-white">
                    Thank You! Message Received.
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
                    Your inquiry has been successfully transmitted to the HogTech International Ventures desk. We will review your request and get back to you shortly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-5 py-2.5 rounded-lg bg-slate-900 dark:bg-teal-500 text-white dark:text-slate-950 text-xs font-semibold hover:bg-slate-800 dark:hover:bg-teal-400 transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  {error && (
                    <div className="p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 rounded-lg flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Samuel Archibong"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Email Address or Phone Number *
                      </label>
                      <input
                        type="text"
                        required
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        placeholder="e.g. 09035029081 or name@mail.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Service of Interest
                      </label>
                      <select
                        value={serviceInterest}
                        onChange={(e) => setServiceInterest(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                      >
                        <option value="Data Entry and Data Management">Data Entry and Data Management</option>
                        <option value="Administrative and Virtual Assistance">Administrative and Virtual Assistance</option>
                        <option value="Document Formatting and PDF Support">Document Formatting and PDF Support</option>
                        <option value="Online and Market Research">Online and Market Research</option>
                        <option value="Microsoft Excel and Office Tasks">Microsoft Excel and Office Tasks</option>
                        <option value="Lead Generation and Web Research">Lead Generation and Web Research</option>
                        <option value="Graphic Design and Digital Content">Graphic Design and Digital Content</option>
                        <option value="AI-Assisted Business Support">AI-Assisted Business Support</option>
                        <option value="Stationery Sales & Printing Supplies">Stationery Sales & Printing Supplies</option>
                        <option value="Other Business Enquiries">Other Business Enquiries</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Subject Line
                      </label>
                      <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="e.g. Data Management Project"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Your Message or Project Details *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Please explain what you need (quantity, specifications, questions, or deadlines)..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  {/* Consent Notice */}
                  <div className="flex items-start gap-2.5 pt-1">
                    <input
                      type="checkbox"
                      id="consent"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      className="mt-0.5 rounded text-teal-600 focus:ring-teal-500"
                    />
                    <label htmlFor="consent" className="text-[11px] text-slate-500 leading-snug">
                      I agree that Hogtech Int’l Ventures may process my contact details to reply to this message and provide quotations.
                    </label>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full sm:w-auto px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-600 disabled:opacity-50 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-sm"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Sending Message...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Submit Message to Hogtech Desk</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Verified Map Location View */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h4 className="font-display font-bold text-base text-slate-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-teal-600" />
                <span>Location Map: Ekpo Abasi Street, Calabar</span>
              </h4>
              <p className="text-xs text-slate-500">
                Easily accessible from Calabar South and surrounding educational and business institutions.
              </p>
            </div>
            <a
              href="https://www.google.com/maps/search/Ekpo+Abasi+Street+Calabar+Nigeria"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-teal-600 hover:text-teal-800 flex items-center gap-1"
            >
              <span>Open in Google Maps</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Interactive OpenStreetMap Embed centered directly on Ekpo Abasi Street, Calabar */}
          <div className="h-80 w-full bg-slate-100 relative">
            <iframe
              title="Hogtech Location Map - 76 Ekpo Abasi Street, Calabar"
              src="https://www.openstreetmap.org/export/embed.html?bbox=8.318%2C4.945%2C8.345%2C4.965&layer=mapnik&marker=4.9546%2C8.3312"
              className="w-full h-full border-0"
              loading="lazy"
            />
          </div>
        </div>
      </section>
    </div>
  );
};
