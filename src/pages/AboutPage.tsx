import React from 'react';
import {
  ShieldCheck,
  Target,
  Compass,
  CheckCircle2,
  Users,
  MapPin,
  Building2,
  Phone,
  MessageSquare,
  Award
} from 'lucide-react';
import { CompanySettings, TeamMember } from '../types/index.ts';
import { LazyImage } from '../components/LazyImage.tsx';

interface AboutPageProps {
  settings: CompanySettings;
  team: TeamMember[];
  onNavigate: (page: string) => void;
  onRequestService: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({
  settings,
  team,
  onNavigate,
  onRequestService,
}) => {
  const values = [
    {
      title: 'Professionalism',
      description: 'Delivering precision, clean formatting, accurate printing, and dependable standards for every document and project.',
    },
    {
      title: 'Reliability',
      description: 'Honoring client timelines, deadlines, and project specifications with consistent quality you can trust.',
    },
    {
      title: 'Innovation',
      description: 'Adopting contemporary digital tools, modern printing techniques, and practical AI workflow practices to solve everyday challenges.',
    },
    {
      title: 'Continuous Learning',
      description: 'Constantly upgrading our training curriculum, software proficiency, and print techniques to serve our community better.',
    },
    {
      title: 'Customer Service',
      description: 'Attentive, friendly, and respectful communication from consultation to order delivery.',
    },
    {
      title: 'Integrity',
      description: 'Confidential handling of client manuscripts, CVs, and business documents with honest and transparent dealings.',
    },
    {
      title: 'Accessibility',
      description: 'Fair, community-friendly pricing and readily reachable walk-in services in Calabar for students and enterprises alike.',
    },
  ];

  const cleanWaNumber = settings.whatsappNumber.replace(/[^0-9]/g, '');

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Header */}
      <section className="bg-gradient-to-b from-[#081426] to-[#0d1e38] text-white py-16 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-teal-400 uppercase tracking-widest">
            <Building2 className="w-4 h-4" />
            <span>About Hogtech Int’l Ventures</span>
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-white max-w-3xl">
            Empowering Calabar and Beyond Through Digital Skills & Quality Print Solutions
          </h1>
          <p className="text-slate-300 text-base max-w-2xl leading-relaxed">
            A technology-enabled Nigerian enterprise committed to bridging digital skill gaps and delivering top-tier printing, document preparation, and business support.
          </p>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* WHO WE ARE */}
      {/* ------------------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-5">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
              Who We Are
            </span>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 leading-tight">
              A Complete Hub for Digital Services, Quality Printing & Business Solutions
            </h2>
            <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
              <p>
                <strong>Hogtech Int’l Ventures</strong> is a Nigerian business providing professional document services, printing, computer training, digital skills, administrative support, graphics, stationery, and technology-enabled services.
              </p>
              <p>
                Conveniently situated at <strong>76 Ekpo Abasi Street, Calabar, Cross River State</strong>, Hogtech was founded to eliminate the frustration of low-quality printouts, delayed documents, and outdated computer training.
              </p>
              <p>
                Whether you are a student formatting an undergraduate or postgraduate project, an event planner printing 500 souvenir jotters and programmes, a business seeking official identity stationery, or a job seeker seeking practical digital proficiency, Hogtech is equipped to deliver with precision and punctuality.
              </p>
            </div>

            <div className="pt-2 flex flex-wrap gap-4">
              <button
                onClick={() => onNavigate('services')}
                className="px-5 py-2.5 rounded-lg bg-teal-500 hover:bg-teal-600 text-white font-semibold text-xs transition-colors"
              >
                Explore Services Catalog
              </button>
              <a
                href={`https://wa.me/${cleanWaNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-2 transition-colors"
              >
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <span>Chat with Office</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md bg-white dark:bg-slate-900">
              <div className="w-full h-80 overflow-hidden relative">
                <LazyImage
                  src="/src/assets/images/hero_hogtech_workspace_1791613498907.jpg"
                  alt="Hogtech Int’l Ventures Office in Calabar"
                  className="w-full h-full object-cover"
                  containerClassName="w-full h-full"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-5 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                  <MapPin className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  <span>Physical Address: 76 Ekpo Abasi Street, Calabar</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Cross River State, Nigeria · Walk-in document intake and consultation available daily.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* MISSION & GOAL */}
      {/* ------------------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Mission Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 space-y-4 shadow-sm hover:border-teal-300 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 text-teal-600 flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
              Our Mission
            </span>
            <blockquote className="text-base sm:text-lg text-slate-800 font-medium leading-relaxed italic border-l-2 border-teal-500 pl-4">
              "To provide accessible, reliable, and professional digital, printing, document, and technology-enabled services that empower individuals, schools, businesses, and organisations to achieve their goals."
            </blockquote>
          </div>

          {/* Goal Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 space-y-4 shadow-sm hover:border-cyan-300 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-cyan-50 border border-cyan-200 text-cyan-600 flex items-center justify-center">
              <Compass className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-700">
              Our Goal
            </span>
            <blockquote className="text-base sm:text-lg text-slate-800 font-medium leading-relaxed italic border-l-2 border-cyan-500 pl-4">
              "To become a trusted provider of digital services and skills development, helping people and organisations improve productivity, develop practical technology skills, and access innovative business solutions."
            </blockquote>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* OUR CORE VALUES */}
      {/* ------------------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
            Principles We Uphold
          </span>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-slate-900">
            Our Core Values
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Every job, from a single photocopied page to a 1,000-copy event programme, is guided by these principles.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map((val, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200 p-6 space-y-2.5 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-teal-600">0{idx + 1}.</span>
                <h3 className="font-display font-bold text-base text-slate-900">
                  {val.title}
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {val.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* OUR TEAM SECTION */}
      {/* ------------------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
              Leadership & Personnel
            </span>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 mt-1">
              Our Dedicated Team
            </h2>
            <p className="text-sm text-slate-600 max-w-xl">
              Meet the management, trainers, and print specialists at Hogtech Int’l Ventures.
            </p>
          </div>
          <div className="text-xs text-slate-500">
            Official Hogtech Staff & Technical Desks
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col hover:shadow-sm transition-shadow"
            >
              <div className="h-44 bg-slate-100 flex items-center justify-center relative overflow-hidden">
                {/* Clean placeholder / executive avatar without fake stock photos */}
                <div className="w-16 h-16 rounded-full bg-slate-200 border-2 border-slate-300 flex items-center justify-center text-slate-600">
                  <Users className="w-8 h-8" />
                </div>
                {member.isPlaceholder && (
                  <span className="absolute bottom-2 right-2 text-[10px] bg-slate-900/80 text-slate-300 px-2 py-0.5 rounded font-mono">
                    Staff Desk
                  </span>
                )}
                {!member.isPlaceholder && (
                  <span className="absolute bottom-2 right-2 text-[10px] bg-teal-900 text-teal-200 px-2 py-0.5 rounded font-mono">
                    Executive
                  </span>
                )}
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-teal-700 font-semibold block">
                    {member.department}
                  </span>
                  <h3 className="font-display font-bold text-base text-slate-900 mt-1">
                    {member.name}
                  </h3>
                  <div className="text-xs text-slate-500 font-medium">
                    {member.role}
                  </div>
                  <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
