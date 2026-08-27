import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { ArrowRight, Phone, CheckCircle2, Megaphone } from 'lucide-react';

interface SchoolDiscountAnnouncementProps {
  onClaimDiscount: () => void;
  onOpenModalPoster?: () => void;
}

export const SchoolDiscountAnnouncement: React.FC<SchoolDiscountAnnouncementProps> = ({
  onClaimDiscount,
}) => {
  const { isKhmer } = useLanguage();

  return (
    <div className="pt-8 text-left">
      {/* Outer Card with Announcement Border & 3-4s Periodic Pulse Motion */}
      <div className="relative rounded-3xl bg-white border-2 border-rose-300 ring-4 ring-rose-100/70 p-6 sm:p-8 lg:p-10 shadow-sm hover:border-rose-400 hover:ring-rose-200/80 transition-all duration-300 overflow-hidden animate-periodic-glow">
        
        {/* Top Announcement Highlight Border Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-950 via-rose-600 to-pink-600" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center pt-1">
          
          {/* Left Column: Announcement Details */}
          <div className="lg:col-span-8 space-y-4">
            
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Live Beacon Announcement Badge */}
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100/90 text-rose-950 border border-rose-300 text-xs font-bold shadow-2xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-700" />
                </span>
                <Megaphone className="w-3.5 h-3.5 text-rose-700" />
                <span>{isKhmer ? 'សេចក្តីជូនដំណឹងបញ្ចុះតម្លៃ' : 'Discount Announcement'}</span>
              </span>

              <span className="px-3 py-1 rounded-full bg-zinc-100 text-zinc-800 border border-zinc-200 text-xs font-bold">
                {isKhmer ? 'បវេសនកាល ២០២៦-២០២៧' : 'Academic Year 2026-2027'}
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight font-khmer-title">
              {isKhmer ? (
                <>
                  បញ្ចុះតម្លៃសិក្សា{' '}
                  <span className="text-rose-900 underline decoration-rose-400 decoration-2 underline-offset-4 inline-block animate-periodic-pop">
                    ៥០%
                  </span>{' '}
                  សម្រាប់សិស្សផ្ទេរការសិក្សា
                </>
              ) : (
                <>
                  <span className="text-rose-900 underline decoration-rose-400 decoration-2 underline-offset-4 inline-block animate-periodic-pop">
                    50% Tuition Discount
                  </span>{' '}
                  for Transfer Students
                </>
              )}
            </h3>

            {/* President's Message with Left Announcement Accent Border */}
            <div className="p-4 rounded-2xl bg-rose-50/40 border-l-4 border-l-rose-700 border-y border-r border-rose-200 text-xs sm:text-[13px] text-zinc-800 leading-relaxed font-normal">
              {isKhmer
                ? '«សាលារៀនស៊ី អាយ អាយ អេស (CIIS) សូមស្វាគមន៏។ អបអរសាទរបវេសនកាលឆ្នាំសិក្សា២០២៦-២០២៧ សាលាបញ្ចុះតម្លៃសិក្សា៥០% សម្រាប់សិស្សផ្ទេរការសិក្សាពីសាលាផ្សេងៗ។»'
                : '“CIIS International School warmly welcomes you. In celebration of the Academic Year 2026-2027 enrollment, CIIS offers a 50% tuition fee discount for students transferring from other schools.”'}
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-zinc-700 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-rose-700 shrink-0" />
                <span>{isKhmer ? 'សម្រាប់សិស្សផ្ទេរមកពីគ្រប់សាលា' : 'For all transfer students'}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-rose-700 shrink-0" />
                <span>{isKhmer ? 'គ្រប់កម្រិតថ្នាក់ (មត្តេយ្យ ដល់ ទី១២)' : 'All grades (K-12 & Lab)'}</span>
              </div>
            </div>

          </div>

          {/* Right Column: Clean Action Card with 3-4s Periodic Pointer Highlights */}
          <div className="lg:col-span-4 p-5 rounded-2xl bg-rose-50/60 border-2 border-rose-200/90 text-center space-y-4 shadow-2xs">
            <div className="space-y-1">
              <div className="text-[11px] text-rose-900 font-bold uppercase tracking-wide">
                {isKhmer ? 'ការផ្តល់ជូនពិសេស' : 'SPECIAL PROMO'}
              </div>
              <div className="text-4xl sm:text-5xl font-black text-rose-950 font-sans tracking-tight animate-periodic-pop">
                50% OFF
              </div>
              <div className="text-[11px] text-rose-800 font-medium">
                {isKhmer ? 'ឆ្នាំសិក្សា ២០២៦-២០២៧' : 'Academic Year 2026-2027'}
              </div>
            </div>

            <button
              type="button"
              onClick={onClaimDiscount}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-rose-950 via-rose-900 to-pink-900 hover:from-rose-900 hover:to-pink-800 text-white font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm hover:scale-[1.02] active:scale-[0.98] group"
            >
              <span>{isKhmer ? 'ចុះឈ្មោះចូលរៀន' : 'Enroll Now'}</span>
              <ArrowRight className="w-3.5 h-3.5 animate-periodic-nudge group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="pt-2 border-t border-rose-200/80 flex items-center justify-center gap-2 text-xs text-zinc-700">
              <Phone className="w-3.5 h-3.5 text-rose-700" />
              <span className="font-mono font-bold text-zinc-900">081 505 605</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
export default SchoolDiscountAnnouncement;
