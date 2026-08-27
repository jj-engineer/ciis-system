import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useLanguage } from '../../context/LanguageContext';
import { X, ArrowRight, Phone, CheckCircle2, Megaphone } from 'lucide-react';

interface SchoolDiscountModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  onClaimDiscount: () => void;
}

const STORAGE_KEY = 'ciis_promo_discount_last_dismissed';
const COOLDOWN_MS = 60 * 60 * 1000; // 1 hour

export const SchoolDiscountModal: React.FC<SchoolDiscountModalProps> = ({
  isOpen: controlledIsOpen,
  onClose: controlledOnClose,
  onClaimDiscount,
}) => {
  const { isKhmer } = useLanguage();
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 1-hour auto cooldown detection
  useEffect(() => {
    if (controlledIsOpen !== undefined) return;

    try {
      const lastDismissed = localStorage.getItem(STORAGE_KEY);
      const now = Date.now();

      if (!lastDismissed || now - parseInt(lastDismissed, 10) > COOLDOWN_MS) {
        const timer = setTimeout(() => {
          setInternalIsOpen(true);
        }, 700);
        return () => clearTimeout(timer);
      }
    } catch {
      const timer = setTimeout(() => setInternalIsOpen(true), 700);
      return () => clearTimeout(timer);
    }
  }, [controlledIsOpen]);

  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;

  const handleClose = () => {
    try {
      localStorage.setItem(STORAGE_KEY, Date.now().toString());
    } catch {
      // ignore
    }
    if (controlledOnClose) {
      controlledOnClose();
    } else {
      setInternalIsOpen(false);
    }
  };

  const handleClaim = () => {
    handleClose();
    onClaimDiscount();
  };

  // Body scroll lock & Escape key
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow || '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] w-screen h-screen overflow-y-auto bg-zinc-950/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
      onClick={handleClose}
      style={{ margin: 0, left: 0, top: 0, right: 0, bottom: 0 }}
    >
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border-2 border-rose-300 ring-4 ring-rose-100/60 overflow-hidden transform transition-all my-auto text-left animate-periodic-glow"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Announcement Gradient Strip */}
        <div className="h-1.5 bg-gradient-to-r from-rose-950 via-rose-600 to-pink-600" />

        {/* Clean Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-rose-100 bg-rose-50/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white p-1 border border-rose-200 flex items-center justify-center shadow-2xs">
              <img src="/ciis-logo.svg" alt="CIIS" className="w-full h-full object-contain" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-zinc-900 font-khmer-title flex items-center gap-1.5">
                <span>{isKhmer ? 'សាលារៀន ស៊ី អាយ អាយ អេស (CIIS)' : 'CIIS International School'}</span>
              </h4>
              <p className="text-[10.5px] text-rose-900 font-semibold">
                {isKhmer ? 'ដំណឹងបវេសនកាលឆ្នាំសិក្សា ២០២៦-២០២៧' : 'Academic Year 2026-2027'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-rose-100/60 rounded-xl transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-7 space-y-5">
          
          {/* Tag & Offer */}
          <div className="space-y-3">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100/90 text-rose-950 border border-rose-300 text-xs font-bold shadow-2xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-700" />
              </span>
              <Megaphone className="w-3.5 h-3.5 text-rose-700" />
              <span>{isKhmer ? 'សេចក្តីជូនដំណឹងបញ្ចុះតម្លៃ ៥០%' : 'Special 50% Discount Announcement'}</span>
            </span>

            <div className="space-y-1">
              <h3 className="text-2xl sm:text-3xl font-black text-zinc-950 leading-tight font-khmer-title">
                {isKhmer ? (
                  <>
                    បញ្ចុះតម្លៃសិក្សា{' '}
                    <span className="text-rose-900 underline decoration-rose-400 decoration-2 underline-offset-4 inline-block animate-periodic-pop">
                      ៥០%
                    </span>{' '}
                    <br />
                    <span className="text-lg sm:text-xl font-bold text-zinc-700">សម្រាប់សិស្សផ្ទេរការសិក្សា</span>
                  </>
                ) : (
                  <>
                    <span className="text-rose-900 underline decoration-rose-400 decoration-2 underline-offset-4 inline-block animate-periodic-pop">
                      50% Tuition Discount
                    </span>{' '}
                    <br />
                    <span className="text-lg sm:text-xl font-bold text-zinc-700">For Transfer Students</span>
                  </>
                )}
              </h3>
            </div>
          </div>

          {/* Official Statement Box with Left Announcement Border */}
          <div className="p-4 rounded-2xl bg-rose-50/40 border-l-4 border-l-rose-700 border-y border-r border-rose-200 text-xs sm:text-[13px] text-zinc-800 leading-relaxed font-normal">
            {isKhmer
              ? '«សាលារៀនស៊ី អាយ អាយ អេស (CIIS) សូមស្វាគមន៏។ អបអរសាទរបវេសនកាលឆ្នាំសិក្សា២០២៦-២០២៧ សាលាបញ្ចុះតម្លៃសិក្សា៥០% សម្រាប់សិស្សផ្ទេរការសិក្សាពីសាលាផ្សេងៗ។»'
              : '“CIIS International School warmly welcomes you. In celebration of the Academic Year 2026-2027 enrollment, CIIS offers a 50% tuition fee discount for students transferring from other schools.”'}
          </div>

          {/* Key Eligibility Details */}
          <div className="space-y-2 text-xs text-zinc-700 font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-rose-700 shrink-0" />
              <span>{isKhmer ? 'ផ្តល់ជូនសម្រាប់សិស្សផ្ទេរការសិក្សាពីគ្រប់សាលា' : 'Eligible for all transfer students from other schools'}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-rose-700 shrink-0" />
              <span>{isKhmer ? 'អនុវត្តលើថ្នាក់មត្តេយ្យ បឋមសិក្សា វិទ្យាល័យ និងកុំព្យូទ័រ' : 'Valid across Kindergarten, Grades 1-12, Computer Tech & IELTS'}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 space-y-2.5">
            <button
              type="button"
              onClick={handleClaim}
              className="w-full py-3 px-5 rounded-xl bg-gradient-to-r from-rose-950 via-rose-900 to-pink-900 hover:from-rose-900 hover:to-pink-800 text-white text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm hover:scale-[1.01] active:scale-[0.99] group"
            >
              <span>{isKhmer ? 'ចុះឈ្មោះចូលរៀនឥឡូវនេះ' : 'Apply for Enrollment'}</span>
              <ArrowRight className="w-4 h-4 animate-periodic-nudge group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="flex items-center justify-between text-xs text-zinc-500 pt-2 border-t border-rose-100">
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-rose-700" />
                <span className="font-mono text-zinc-900 font-bold">081 505 605</span>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="text-zinc-500 hover:text-zinc-800 transition-colors cursor-pointer text-[11px]"
              >
                {isKhmer ? 'បិទការជូនដំណឹង' : 'Dismiss'}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
export default SchoolDiscountModal;
