import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle2, MessageSquare, AlertCircle } from 'lucide-react';

interface LiveOfficeStatusProps {
  openingHours?: string;
  whatsappNumber?: string;
  variant?: 'compact' | 'detailed' | 'badge' | 'minimal';
  className?: string;
}

export interface StatusState {
  isOpen: boolean;
  statusLabel: string;
  detailLabel: string;
  watTimeFormatted: string;
  currentDay: string;
  hoursSummary: string;
}

/**
 * Computes live office open/closed status dynamically based on current West Africa Time (Africa/Lagos)
 * and the configured openingHours setting string.
 */
export function computeOfficeStatus(hoursText?: string): StatusState {
  try {
    const now = new Date();

    // 1. Get current time in West Africa Time (WAT: Africa/Lagos, UTC+1)
    const options: Intl.DateTimeFormatOptions = {
      timeZone: 'Africa/Lagos',
      weekday: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    };

    const parts = new Intl.DateTimeFormat('en-US', options).formatToParts(now);
    const partMap: Record<string, string> = {};
    for (const p of parts) {
      partMap[p.type] = p.value;
    }

    const weekday = partMap.weekday || 'Mon'; // Mon, Tue, Wed, Thu, Fri, Sat, Sun
    const hour = parseInt(partMap.hour || '0', 10);
    const minute = parseInt(partMap.minute || '0', 10);
    const currentMinutes = hour * 60 + minute;

    // Formatted 12-hour display with AM/PM
    const displayTime = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Africa/Lagos',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(now);

    // Helper to parse time string like "8am - 8pm" or "10:00 AM – 7:00 PM" into minutes
    const parseTimeRange = (timeStr: string): { start: number; end: number } | null => {
      const match = timeStr.match(
        /(\d{1,2})(?::(\d{2}))?\s*(am|pm)?\s*(?:[-–—]|to)\s*(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i
      );
      if (!match) return null;
      let startH = parseInt(match[1], 10);
      const startM = match[2] ? parseInt(match[2], 10) : 0;
      let startMeridiem = match[3]?.toUpperCase();

      let endH = parseInt(match[4], 10);
      const endM = match[5] ? parseInt(match[5], 10) : 0;
      let endMeridiem = match[6]?.toUpperCase();

      if (!startMeridiem && endMeridiem) {
        if (endMeridiem === 'PM' && startH < 12 && startH >= 6) {
          startMeridiem = 'AM';
        }
      }

      if (startMeridiem === 'PM' && startH < 12) startH += 12;
      if (startMeridiem === 'AM' && startH === 12) startH = 0;
      if (endMeridiem === 'PM' && endH < 12) endH += 12;
      if (endMeridiem === 'AM' && endH === 12) endH = 0;

      if (!isNaN(startH) && !isNaN(endH) && startH * 60 + startM < endH * 60 + endM) {
        return { start: startH * 60 + startM, end: endH * 60 + endM };
      }
      return null;
    };

    // Helper for formatting minutes to 12h time string
    const formatMinutes = (mins: number) => {
      const h = Math.floor(mins / 60);
      const m = mins % 60;
      const meridiem = h >= 12 ? 'PM' : 'AM';
      const h12 = h % 12 === 0 ? 12 : h % 12;
      const mStr = m === 0 ? '' : `:${m < 10 ? '0' : ''}${m}`;
      return `${h12}${mStr} ${meridiem}`;
    };

    // 2. Default standard Hogtech hours: Mon–Fri 8:00 AM – 8:00 PM, Sat 10:00 AM – 7:00 PM
    let weekdayOpenMin = 8 * 60; // 08:00 AM
    let weekdayCloseMin = 20 * 60; // 08:00 PM
    let satOpenMin = 10 * 60; // 10:00 AM
    let satCloseMin = 19 * 60; // 07:00 PM
    let openDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const rawText = (hoursText || 'Monday – Friday: 8:00 AM – 8:00 PM · Saturday: 10:00 AM – 7:00 PM').trim();
    const lowerText = rawText.toLowerCase();

    // Check for Saturday-specific segment: e.g. "sat from 10 am -7pm" or "sat: 10:00 am - 7:00 pm"
    const satSegment = lowerText.match(/sat(?:urday)?[:\s]*(?:from\s*)?([0-9:apm\s–—to-]+)/i);
    if (satSegment) {
      const parsedSat = parseTimeRange(satSegment[1]);
      if (parsedSat) {
        satOpenMin = parsedSat.start;
        satCloseMin = parsedSat.end;
      }
    }

    // Check for Mon-Fri specific segment
    const monFriSegment = lowerText.match(/mon(?:day)?\s*[-–—to]+\s*fri(?:day)?[:\s]*(?:from\s*)?([0-9:apm\s–—to-]+)/i);
    if (monFriSegment) {
      const parsedMonFri = parseTimeRange(monFriSegment[1]);
      if (parsedMonFri) {
        weekdayOpenMin = parsedMonFri.start;
        weekdayCloseMin = parsedMonFri.end;
      }
    } else {
      // General single time range if no mon-fri split
      const generalRange = parseTimeRange(rawText);
      if (generalRange) {
        weekdayOpenMin = generalRange.start;
        weekdayCloseMin = generalRange.end;
        if (!satSegment) {
          satOpenMin = generalRange.start;
          satCloseMin = generalRange.end;
        }
      }
    }

    if (lowerText.includes('sunday') && (lowerText.includes('closed') || lowerText.includes('off'))) {
      openDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    }

    // Determine current day's open and close times
    const isSaturday = weekday === 'Sat';
    const isSunday = weekday === 'Sun';
    const isWeekday = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].includes(weekday);

    const openMin = isSaturday ? satOpenMin : weekdayOpenMin;
    const closeMin = isSaturday ? satCloseMin : weekdayCloseMin;

    const isTodayOpenDay = isSunday ? false : openDays.includes(weekday);
    const isWithinHours = currentMinutes >= openMin && currentMinutes < closeMin;
    const isOpen = isTodayOpenDay && isWithinHours;

    const openTimeStr = formatMinutes(openMin);
    const closeTimeStr = formatMinutes(closeMin);
    const weekdayOpenTimeStr = formatMinutes(weekdayOpenMin);
    const satOpenTimeStr = formatMinutes(satOpenMin);

    let detailLabel = '';
    if (isOpen) {
      detailLabel = `Closes at ${closeTimeStr} WAT`;
    } else if (!isTodayOpenDay) {
      detailLabel = `Closed today · Opens Mon ${weekdayOpenTimeStr} WAT`;
    } else if (currentMinutes < openMin) {
      detailLabel = `Opens today at ${openTimeStr} WAT`;
    } else {
      if (weekday === 'Fri') {
        detailLabel = `Opens tomorrow (Sat) at ${satOpenTimeStr} WAT`;
      } else if (weekday === 'Sat') {
        detailLabel = `Closed for weekend · Opens Mon ${weekdayOpenTimeStr} WAT`;
      } else {
        detailLabel = `Opens tomorrow at ${weekdayOpenTimeStr} WAT`;
      }
    }

    return {
      isOpen,
      statusLabel: isOpen ? 'Office Open Now' : 'Office Closed Now',
      detailLabel,
      watTimeFormatted: `${displayTime} WAT`,
      currentDay: weekday,
      hoursSummary: isSaturday
        ? `Sat: ${openTimeStr} – ${closeTimeStr}`
        : `Mon–Fri: ${formatMinutes(weekdayOpenMin)} – ${formatMinutes(weekdayCloseMin)}`,
    };
  } catch (err) {
    return {
      isOpen: true,
      statusLabel: 'Open for Inquiries',
      detailLabel: 'Mon–Fri: 8am–8pm · Sat: 10am–7pm',
      watTimeFormatted: 'West Africa Time',
      currentDay: 'Mon',
      hoursSummary: 'Mon–Fri 8am–8pm · Sat 10am–7pm',
    };
  }
}

export const LiveOfficeStatus: React.FC<LiveOfficeStatusProps> = ({
  openingHours,
  whatsappNumber,
  variant = 'compact',
  className = '',
}) => {
  const [status, setStatus] = useState<StatusState>(() => computeOfficeStatus(openingHours));
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    // Immediate compute on mount and when setting changes
    setStatus(computeOfficeStatus(openingHours));

    // Live continuous heartbeat tick every 20 seconds
    const interval = setInterval(() => {
      setStatus(computeOfficeStatus(openingHours));
    }, 20000);

    return () => clearInterval(interval);
  }, [openingHours]);

  const cleanWa = (whatsappNumber || '2349035029081').replace(/[^0-9]/g, '');

  // 1. Badge variant (for Navbar desktop & mobile header)
  if (variant === 'badge') {
    return (
      <div className="relative inline-block" onMouseLeave={() => setShowTooltip(false)}>
        <button
          type="button"
          onClick={() => setShowTooltip(!showTooltip)}
          onMouseEnter={() => setShowTooltip(true)}
          className={`group inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer select-none ${
            status.isOpen
              ? 'bg-emerald-950/70 hover:bg-emerald-950/90 text-emerald-300 border-emerald-700/60 shadow-sm shadow-emerald-900/20'
              : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-slate-700/70'
          } ${className}`}
          aria-label={`Office status: ${status.statusLabel}. ${status.detailLabel}`}
        >
          {/* Animated Pulsing Beacon Dot */}
          <span className="relative flex h-2 w-2 shrink-0">
            {status.isOpen ? (
              <>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </>
            ) : (
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400/80" />
            )}
          </span>

          <span className="font-semibold text-[11px] whitespace-nowrap">
            {status.statusLabel}
          </span>

          <span className="hidden xl:inline text-[10px] text-slate-400 border-l border-slate-700/60 pl-1.5 font-mono">
            {status.watTimeFormatted}
          </span>
        </button>

        {/* Hover / Tap Tooltip */}
        {showTooltip && (
          <div className="absolute right-0 top-full mt-2 w-64 p-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
              <span className="font-bold text-white flex items-center gap-1.5">
                {status.isOpen ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                )}
                {status.statusLabel}
              </span>
              <span className="font-mono text-[10px] text-teal-300 bg-slate-800 px-1.5 py-0.5 rounded">
                {status.watTimeFormatted}
              </span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed mb-2">
              {status.detailLabel}
            </p>
            <div className="text-[10px] text-slate-400 pt-1.5 border-t border-slate-800/80">
              {openingHours || 'Monday – Friday: 8:00 AM – 8:00 PM · Saturday: 10:00 AM – 7:00 PM'}
            </div>
          </div>
        )}
      </div>
    );
  }

  // 2. Compact variant (for cards, banners, and mobile menu)
  if (variant === 'compact') {
    return (
      <div
        className={`inline-flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs border transition-colors ${
          status.isOpen
            ? 'bg-emerald-950/40 text-emerald-200 border-emerald-800/60'
            : 'bg-slate-900/80 text-slate-300 border-slate-800'
        } ${className}`}
      >
        <span className="relative flex h-2 w-2 shrink-0">
          {status.isOpen ? (
            <>
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </>
          ) : (
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400/80" />
          )}
        </span>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-white">{status.statusLabel}</span>
          <span aria-hidden="true" className="text-slate-600 hidden sm:inline">·</span>
          <span className="text-[11px] text-slate-300">{status.detailLabel}</span>
          <span className="text-[10px] font-mono text-teal-300 bg-slate-800 px-1.5 py-0.5 rounded ml-auto">
            {status.watTimeFormatted}
          </span>
        </div>
      </div>
    );
  }

  // 3. Minimal pill variant
  if (variant === 'minimal') {
    return (
      <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${className}`}>
        <span className="relative flex h-2 w-2 shrink-0">
          {status.isOpen ? (
            <>
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </>
          ) : (
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400/80" />
          )}
        </span>
        <span className={status.isOpen ? 'text-emerald-400 font-semibold' : 'text-slate-400'}>
          {status.isOpen ? 'Open Now' : 'Closed'}
        </span>
      </span>
    );
  }

  // 4. Detailed variant (ideal for Footer & Contact section)
  return (
    <div
      className={`p-3.5 rounded-xl border transition-colors ${
        status.isOpen
          ? 'bg-emerald-950/20 border-emerald-800/60 text-emerald-100'
          : 'bg-slate-900/90 border-slate-800 text-slate-300'
      } ${className}`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          {/* Animated beacon icon container */}
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
              status.isOpen
                ? 'bg-emerald-500/20 text-emerald-400'
                : 'bg-slate-800 text-amber-400'
            }`}
          >
            {status.isOpen ? (
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
              </span>
            ) : (
              <Clock className="w-3.5 h-3.5" />
            )}
          </div>

          <div>
            <div className="font-semibold text-xs text-white flex items-center gap-2">
              <span>{status.statusLabel}</span>
              <span className="text-[10px] font-mono text-teal-300 bg-slate-800/90 px-1.5 py-0.5 rounded border border-slate-700/60">
                {status.watTimeFormatted}
              </span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              {status.detailLabel}
            </div>
          </div>
        </div>

        {/* WhatsApp message link */}
        <a
          href={`https://wa.me/${cleanWa}?text=${encodeURIComponent(
            status.isOpen
              ? 'Hello Hogtech Int’l Ventures. I see your office is open right now and would like to ask a question.'
              : 'Hello Hogtech Int’l Ventures. I notice your office is currently closed, but I am leaving a message for your team.'
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`text-[10px] font-semibold px-2.5 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 border ${
            status.isOpen
              ? 'text-emerald-300 hover:text-white bg-emerald-950/60 hover:bg-emerald-900/80 border-emerald-700/50'
              : 'text-teal-300 hover:text-white bg-slate-800 hover:bg-slate-700 border-slate-700'
          }`}
          title={status.isOpen ? 'Direct WhatsApp Chat' : 'Leave an offline message on WhatsApp'}
        >
          <MessageSquare className="w-3 h-3 text-emerald-400" />
          <span>{status.isOpen ? 'Live Chat' : 'Leave Note'}</span>
        </a>
      </div>
    </div>
  );
};
