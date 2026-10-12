import React, { useState } from 'react';
import { X, GraduationCap, CheckCircle2, MessageSquare, ArrowUpRight, AlertCircle, Loader2 } from 'lucide-react';

interface TrainingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TrainingModal: React.FC<TrainingModalProps> = ({ isOpen, onClose }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [program, setProgram] = useState('Fundamental Computer Literacy');
  const [schedule, setSchedule] = useState('Morning (9:00 AM – 11:30 AM)');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ id: string; whatsappUrl: string } | null>(null);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const programs = [
    'Fundamental Computer Literacy & Typing Speed',
    'Microsoft Office Masterclass (Word, Excel, PowerPoint)',
    'Practical Digital Productivity & Internet Workflow',
    'AI Tools for Work & Creative Business Productivity',
    'Executive Computer Literacy & Document Archiving'
  ];

  const schedules = [
    'Morning (9:00 AM – 11:30 AM)',
    'Afternoon (1:00 PM – 3:30 PM)',
    'Evening (4:00 PM – 6:00 PM)',
    'Weekend Intensive (Saturdays only)'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim() || !phone.trim()) {
      setError('Please provide your name and phone number.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/submissions/training', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          program,
          preferredSchedule: schedule,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to register');

      setResult({
        id: data.id,
        whatsappUrl: data.whatsappUrl,
      });
    } catch (err: any) {
      setError(err.message || 'Unable to submit registration. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setFullName('');
    setEmail('');
    setPhone('');
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
            <div className="w-14 h-14 bg-teal-500/15 border border-teal-500/30 text-teal-400 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-display font-bold text-xl text-white">
                Registration Received!
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Candidate Ref: <span className="font-mono text-teal-400">{result.id}</span>
              </p>
              <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                Welcome to Hogtech Computer Training! Our instructor will reach out with cohort commencement details and station allocation. You can also confirm immediately via WhatsApp.
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
                <span>Confirm on WhatsApp</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
              <button
                onClick={handleReset}
                className="px-5 py-3 rounded-lg bg-slate-800 text-slate-300 text-sm hover:bg-slate-700 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <div className="w-10 h-10 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-white">
                  Computer Training Enrollment
                </h3>
                <p className="text-xs text-slate-400">
                  Practical hands-on ICT skills at 76 Ekpo Abasi Street, Calabar
                </p>
              </div>
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
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Mary Edem"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Phone Number (WhatsApp Active) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="080 1234 5678"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@example.com"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Training Course / Skill Track *
                </label>
                <select
                  value={program}
                  onChange={(e) => setProgram(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-teal-500"
                >
                  {programs.map((p, i) => (
                    <option key={i} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Preferred Time Slot / Schedule
                </label>
                <select
                  value={schedule}
                  onChange={(e) => setSchedule(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-teal-500"
                >
                  {schedules.map((s, i) => (
                    <option key={i} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

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
                    <span>Registering...</span>
                  </>
                ) : (
                  <>
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>Submit Course Application</span>
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
