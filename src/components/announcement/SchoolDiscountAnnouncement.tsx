import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Phone, Megaphone, CheckCircle2, ArrowRight } from 'lucide-react';

interface SchoolDiscountAnnouncementProps {
  onClaimDiscount: () => void;
  onOpenModalPoster?: () => void;
}

export const SchoolDiscountAnnouncement: React.FC<SchoolDiscountAnnouncementProps> = ({
  onClaimDiscount,
}) => {
  const { isKhmer } = useLanguage();

  return (
    <div id="announcement-discount" className="pt-8 text-left scroll-mt-24">
      {/* Clean & Professional Announcement Container */}
      <div className="relative rounded-3xl bg-white border border-rose-200/90 shadow-sm p-6 sm:p-8 lg:p-10 overflow-hidden animate-periodic-glow">
        
        {/* Subtle Top Accent Stripe */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-950 via-rose-700 to-pink-600" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center pt-1">
          
          {/* Left Column: Clean Announcement Details & Actions (lg:col-span-7) */}
          <div className="lg:col-span-7 space-y-5">
            
            {/* Header Badges */}
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-950 border border-rose-200 text-xs font-bold shadow-2xs">
                <Megaphone className="w-3.5 h-3.5 text-rose-700" />
                <span>{isKhmer ? 'សេចក្តីជូនដំណឹងបញ្ចុះតម្លៃ' : 'Discount Announcement'}</span>
              </span>
              <span className="px-3 py-1 rounded-full bg-zinc-100 text-zinc-800 border border-zinc-200 text-xs font-bold">
                {isKhmer ? 'បវេសនកាល ២០២៦-២០២៧' : 'Academic Year 2026-2027'}
              </span>
            </div>

            {/* Title */}
            <div className="space-y-1">
              <h3 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight font-khmer-title leading-tight">
                {isKhmer ? (
                  <>
                    បញ្ចុះតម្លៃសិក្សា{' '}
                    <span className="text-rose-900 underline decoration-rose-400 decoration-2 underline-offset-4 animate-periodic-pop inline-block">
                      ៥០%
                    </span>{' '}
                    សម្រាប់សិស្សផ្ទេរការសិក្សា
                  </>
                ) : (
                  <>
                    <span className="text-rose-900 underline decoration-rose-400 decoration-2 underline-offset-4 animate-periodic-pop inline-block">
                      50% Tuition Fee Discount
                    </span>{' '}
                    for Transfer Students
                  </>
                )}
              </h3>
            </div>

            {/* Official Message Quote */}
            <div className="p-4 rounded-2xl bg-rose-50/40 border-l-4 border-l-rose-800 border-y border-r border-rose-200/80 text-xs sm:text-[13px] text-zinc-800 leading-relaxed font-normal">
              {isKhmer
                ? '« សាលារៀនស៊ី អាយ អាយ អេស (CIIS) សូមស្វាគមន៏។ អបអរសាទរបវេសនកាលឆ្នាំសិក្សា២០២៦-២០២៧ សាលាបញ្ចុះតម្លៃសិក្សា៥០% សម្រាប់សិស្សផ្ទេរការសិក្សាពីសាលាផ្សេងៗ។ »'
                : '“CIIS International School warmly welcomes you. In celebration of the Academic Year 2026-2027 enrollment, CIIS offers a 50% tuition fee discount for students transferring from other schools.”'}
            </div>

            {/* Feature Checkpoints */}
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

            {/* Action Buttons & 50% Badge Row */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-2">
              
              {/* Clean 50% OFF Pill (with 0.8s pop animation) */}
              <div className="px-4 py-2.5 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-between sm:justify-start gap-3">
                <span className="text-[11px] font-bold text-rose-900 uppercase">
                  {isKhmer ? 'ការផ្តល់ជូន' : 'Promo'}
                </span>
                <span className="text-xl sm:text-2xl font-black text-rose-950 font-sans tracking-tight animate-periodic-pop">
                  50% OFF
                </span>
              </div>

              {/* Enroll CTA */}
              <button
                type="button"
                onClick={onClaimDiscount}
                className="py-3 px-5 rounded-2xl bg-zinc-950 hover:bg-rose-950 text-white font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm hover:scale-[1.02] active:scale-[0.98] group"
              >
                <span>{isKhmer ? 'ចុះឈ្មោះចូលរៀន' : 'Enroll Now'}</span>
                <ArrowRight className="w-4 h-4 text-rose-300 animate-periodic-nudge group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Phone Contact */}
              <a
                href="tel:081505605"
                className="inline-flex items-center justify-center gap-2 text-xs font-bold text-zinc-700 hover:text-rose-900 transition-colors py-2 px-3"
              >
                <Phone className="w-3.5 h-3.5 text-rose-700" />
                <span className="font-mono">081 505 605</span>
              </a>

            </div>

          </div>

          {/* Right Column: Single Clean Image (CIIS Team & Community Walk) (lg:col-span-5) */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-zinc-200 shadow-md bg-zinc-100 group">
              <img
                src="/images/school/ciis-team-walk.jpg"
                alt="CIIS School Staff and Community"
                className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-500"
              />
              
              {/* Subtle Bottom Scrim & Label */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10.5px] font-bold border border-white/20">
                  {isKhmer ? 'សកម្មភាពក្រុមការងារ និងសហគមន៍សាលា CIIS' : 'CIIS Faculty & Community Outreach'}
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default SchoolDiscountAnnouncement;
