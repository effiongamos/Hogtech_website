import React, { useState } from 'react';
import { X, Send, CheckCircle2, MessageSquare, ArrowUpRight, AlertCircle, Loader2 } from 'lucide-react';
import { ServiceItem } from '../types/index.ts';

interface ServiceRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedService?: ServiceItem | null;
  services: ServiceItem[];
  initialDetails?: string;
  initialCategory?: string;
  initialItem?: string;
}

export const ServiceRequestModal: React.FC<ServiceRequestModalProps> = ({
  isOpen,
  onClose,
  selectedService,
  services,
  initialDetails,
  initialCategory,
  initialItem,
}) => {
  const [fullName, setFullName] = useState('');
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [category, setCategory] = useState(
    initialCategory || selectedService?.category || services[0]?.category || 'Printing & Document Services'
  );
  const [item, setItem] = useState(
    initialItem || selectedService?.items?.[0] || 'General Inquiry'
  );
  const [details, setDetails] = useState(initialDetails || '');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ id: string; whatsappUrl: string } | null>(null);
  const [error, setError] = useState('');

  React.useEffect(() => {
    if (initialDetails) setDetails(initialDetails);
    if (initialCategory) setCategory(initialCategory);
    if (initialItem) setItem(initialItem);
  }, [initialDetails, initialCategory, initialItem, isOpen]);

  if (!isOpen) return null;

  const currentCategoryServices = services.find((s) => s.category === category);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim() || !phoneOrEmail.trim()) {
      setError('Please provide your name and phone number or email.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/submissions/service-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          phoneOrEmail,
          serviceCategory: category,
          serviceItem: item,
          details,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit request');

      setResult({
        id: data.id,
        whatsappUrl: data.whatsappUrl,
      });
    } catch (err: any) {
      setError(err.message || 'Unable to submit request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setFullName('');
    setPhoneOrEmail('');
    setDetails('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 text-slate-200 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={handleReset}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {result ? (
          <div className="py-4 space-y-5 text-center">
            <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-display font-bold text-xl text-white">
                Request Recorded Successfully!
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Reference ID: <span className="font-mono text-teal-400">{result.id}</span>
              </p>
              <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                Thank you! Our team has received your enquiry. For the fastest response, you can forward this request directly to our desk on WhatsApp right now.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <a
                href={result.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-teal-400 text-slate-950 font-semibold text-sm hover:bg-teal-300 transition-colors shadow-md"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Open in WhatsApp</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
              <button
                onClick={handleReset}
                className="px-5 py-3 rounded-lg bg-slate-800 text-slate-300 text-sm hover:bg-slate-700 transition-colors font-medium"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <h3 className="font-display font-bold text-xl text-white">
                Request a Service Quote
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Tell us about your printing, document preparation, or training requirements.
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-950/50 border border-red-800 text-red-300 text-xs rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Full Name / Organization *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Bassey Okon or St. John's Academy"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Phone Number or Email Address *
                </label>
                <input
                  type="text"
                  required
                  value={phoneOrEmail}
                  onChange={(e) => setPhoneOrEmail(e.target.value)}
                  placeholder="e.g. 0803 123 4567 or email@domain.com"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Service Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => {
                      setCategory(e.target.value);
                      const s = services.find((serv) => serv.category === e.target.value);
                      if (s && s.items.length > 0) setItem(s.items[0]);
                    }}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-teal-500"
                  >
                    {services.map((s) => (
                      <option key={s.id} value={s.category}>
                        {s.category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Specific Item / Requirement
                  </label>
                  <select
                    value={item}
                    onChange={(e) => setItem(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-teal-500"
                  >
                    {currentCategoryServices?.items.map((sub, i) => (
                      <option key={i} value={sub}>
                        {sub}
                      </option>
                    )) || <option value="General Inquiry">General Inquiry</option>}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Project Details / Specifications (Quantities, Page counts, Urgency)
                </label>
                <textarea
                  rows={3}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="e.g. 250 copies of A5 funeral program, full color cover, stapled, needed before Friday."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            <p className="text-[11px] text-slate-400">
              Your contact details are used solely to prepare your quote and deliver your order with confidentiality.
            </p>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 rounded-lg text-slate-400 hover:text-white text-xs font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2.5 rounded-lg bg-teal-400 text-slate-950 font-semibold text-xs hover:bg-teal-300 transition-colors flex items-center gap-1.5 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit & Proceed to WhatsApp</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
