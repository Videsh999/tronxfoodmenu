import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock, Users, CheckCircle, ArrowLeft, ArrowRight,
  User, Mail, Phone, ChevronLeft, ChevronRight, Sparkles, Shield, Check, Info
} from 'lucide-react';
import { MetaTags } from '@shared/components/MetaTags';
import { SEATING_SECTIONS, RESTAURANT_BRAND } from '@shared/config/constants';
import { useAuth } from '@shared/hooks/useAuth';
import { ReservationService, ALL_TIME_SLOTS } from '@shared/services/reservationService';
import type { SeatingSection, Reservation } from '@shared/types/reservation';

interface TableOption {
  id: string;
  number: string;
  name: string;
  capacity: number;
  section: SeatingSection;
  zoneName: string;
  description: string;
}

const AURA_TABLES: TableOption[] = [
  // MAIN DINING SANCTUARY
  { id: 'tbl-1', number: 'Table 01', name: 'Window Garden Alcove', capacity: 2, section: 'MAIN_DINING', zoneName: 'Main Dining Sanctuary', description: 'Intimate setting beside panoramic botanical glass' },
  { id: 'tbl-2', number: 'Table 02', name: 'Hearthside Table', capacity: 2, section: 'MAIN_DINING', zoneName: 'Main Dining Sanctuary', description: 'Cozy warmth beside our stone hearth' },
  { id: 'tbl-3', number: 'Table 03', name: 'Central Chandelier Table', capacity: 4, section: 'MAIN_DINING', zoneName: 'Main Dining Sanctuary', description: 'Spacious dining under bespoke brass fixtures' },
  { id: 'tbl-4', number: 'Table 04', name: 'Sanctuary Booth', capacity: 4, section: 'MAIN_DINING', zoneName: 'Main Dining Sanctuary', description: 'Plush velvet booth for friends and family' },
  { id: 'tbl-5', number: 'Table 05', name: 'Heritage Long Table', capacity: 6, section: 'MAIN_DINING', zoneName: 'Main Dining Sanctuary', description: 'Solid oak banquette for festive dinners' },
  { id: 'tbl-6', number: 'Table 06', name: 'Grand Feast Table', capacity: 8, section: 'MAIN_DINING', zoneName: 'Main Dining Sanctuary', description: 'Spacious centerpiece table for large gatherings' },

  // CHEF'S ARTISANAL COUNTER
  { id: 'tbl-7', number: 'Counter 01', name: 'Artisanal Hearth Counter', capacity: 2, section: 'CHEFS_COUNTER', zoneName: "Chef's Counter", description: 'Front-row view of live flame and saute artistry' },
  { id: 'tbl-8', number: 'Counter 02', name: 'Plating & Garnish Bar', capacity: 2, section: 'CHEFS_COUNTER', zoneName: "Chef's Counter", description: 'Direct interaction with our master sauciers' },
  { id: 'tbl-9', number: 'Counter 03', name: 'Sommelier Tasting Perch', capacity: 4, section: 'CHEFS_COUNTER', zoneName: "Chef's Counter", description: 'Curated craft pairings and tasting portions' },

  // BOTANICAL COURTYARD (TERRACE)
  { id: 'tbl-10', number: 'Terrace 01', name: 'Lantern Arbor', capacity: 2, section: 'TERRACE', zoneName: 'Botanical Courtyard', description: 'Romantic open-air pavilion under warm lanterns' },
  { id: 'tbl-11', number: 'Terrace 02', name: 'Olive Pergola', capacity: 4, section: 'TERRACE', zoneName: 'Botanical Courtyard', description: 'Surrounded by fragrant herb beds and olive trees' },
  { id: 'tbl-12', number: 'Terrace 03', name: 'Courtyard Veranda', capacity: 4, section: 'TERRACE', zoneName: 'Botanical Courtyard', description: 'Heated open veranda overlooking central fountain' },
  { id: 'tbl-13', number: 'Terrace 04', name: 'Garden Pavilion', capacity: 6, section: 'TERRACE', zoneName: 'Botanical Courtyard', description: 'Canopied dining shelter for groups' },

  // FOUNDER'S PRIVATE SUITE (PRIVATE VAULT)
  { id: 'tbl-14', number: 'VIP Suite 01', name: "Founder's Wine Salon", capacity: 8, section: 'PRIVATE_VAULT', zoneName: "Founder's Private Suite", description: 'Secluded luxury lounge with personal sommelier' },
  { id: 'tbl-15', number: 'VIP Suite 02', name: 'The Executive Vault', capacity: 12, section: 'PRIVATE_VAULT', zoneName: "Founder's Private Suite", description: 'Our most prestigious dining chamber for up to 12 guests' },
];

export const ReservationPage: React.FC = () => {
  const { user } = useAuth();

  const today = useMemo(() => new Date(), []);
  const todayStr = useMemo(() => today.toISOString().split('T')[0], [today]);

  // Reservation Steps: 1: DATE -> 2: TIME -> 3: GUESTS -> 4: TABLE -> 5: DETAILS
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Form State
  const [reservationDate, setReservationDate] = useState<string>(todayStr);
  const [reservationTime, setReservationTime] = useState<string>('19:00');
  const [partySize, setPartySize] = useState<number>(2);
  const [selectedTableId, setSelectedTableId] = useState<string>('tbl-2');
  const [tableFilterSection, setTableFilterSection] = useState<string>('ALL');

  // Contact State
  const [guestName, setGuestName] = useState<string>(user?.fullName || '');
  const [guestEmail, setGuestEmail] = useState<string>(user?.email || '');
  const [guestPhone, setGuestPhone] = useState<string>('');
  const [specialRequests, setSpecialRequests] = useState<string>('');

  // Calendar State
  const [currentMonthDate, setCurrentMonthDate] = useState<Date>(new Date(today.getFullYear(), today.getMonth(), 1));

  // Availability & Loading States
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [isCheckingSlots, setIsCheckingSlots] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Success Confirmation State
  const [confirmedReservation, setConfirmedReservation] = useState<Reservation | null>(null);

  // Derive selected table object
  const selectedTable = useMemo(() => {
    return AURA_TABLES.find((t) => t.id === selectedTableId) || AURA_TABLES[1];
  }, [selectedTableId]);

  // Sync seating section with selected table
  const seatingSection = selectedTable.section;

  // Auto-adjust selected table if party size exceeds current table capacity
  useEffect(() => {
    if (selectedTable.capacity < partySize) {
      const suitable = AURA_TABLES.find((t) => t.capacity >= partySize);
      if (suitable) {
        setSelectedTableId(suitable.id);
      }
    }
  }, [partySize, selectedTable]);

  // Fetch available slots from ReservationService
  useEffect(() => {
    let isMounted = true;
    const fetchSlots = async () => {
      setIsCheckingSlots(true);
      setErrorMsg(null);
      try {
        const slots = await ReservationService.checkAvailability(
          reservationDate,
          partySize,
          seatingSection
        );
        if (isMounted) {
          setAvailableSlots(slots);
          if (slots.length > 0 && !slots.includes(reservationTime)) {
            setReservationTime(slots[0]);
          }
        }
      } catch {
        if (isMounted) {
          setErrorMsg('Failed to verify table availability. Please pick another date or section.');
        }
      } finally {
        if (isMounted) setIsCheckingSlots(false);
      }
    };

    fetchSlots();
    return () => {
      isMounted = false;
    };
  }, [reservationDate, partySize, seatingSection]);

  // Calendar Generator Logic
  const calendarDays = useMemo(() => {
    const year = currentMonthDate.getFullYear();
    const month = currentMonthDate.getMonth();
    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days: { dateStr: string; dayNumber: number; isCurrentMonth: boolean; isPast: boolean; isToday: boolean }[] = [];

    // Prefix empty slots
    for (let i = 0; i < firstDayIndex; i++) {
      days.push({
        dateStr: '',
        dayNumber: 0,
        isCurrentMonth: false,
        isPast: true,
        isToday: false,
      });
    }

    // Days in current month
    for (let d = 1; d <= daysInMonth; d++) {
      const dStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const isPast = dStr < todayStr;
      const isToday = dStr === todayStr;
      days.push({
        dateStr: dStr,
        dayNumber: d,
        isCurrentMonth: true,
        isPast,
        isToday,
      });
    }

    return days;
  }, [currentMonthDate, todayStr]);

  const handlePrevMonth = () => {
    const prev = new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() - 1, 1);
    const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    if (prev >= thisMonthStart) {
      setCurrentMonthDate(prev);
    }
  };

  const handleNextMonth = () => {
    const next = new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + 1, 1);
    setCurrentMonthDate(next);
  };

  // Time Slot Grouping (Lunch vs Evening)
  const timeSlotGroups = useMemo(() => {
    const afternoonSlots = ALL_TIME_SLOTS.filter((s) => s < '17:00');
    const eveningSlots = ALL_TIME_SLOTS.filter((s) => s >= '17:00');

    return [
      ...(afternoonSlots.length > 0 ? [{ label: 'AFTERNOON & HIGH TEA', slots: afternoonSlots }] : []),
      { label: 'EVENING DINING & HEARTH', slots: eveningSlots },
    ];
  }, []);

  // Validation for Step 5
  const validateGuestDetails = (): boolean => {
    setErrorMsg(null);
    if (!guestName.trim()) {
      setErrorMsg('Please enter your full name for the booking ticket.');
      return false;
    }
    if (!guestEmail.trim() || !guestEmail.includes('@')) {
      setErrorMsg('Please provide a valid email address for confirmation.');
      return false;
    }
    if (!guestPhone.trim() || guestPhone.trim().length < 6) {
      setErrorMsg('Please enter a valid telephone contact number.');
      return false;
    }
    return true;
  };

  // Step Navigation
  const handleNext = () => {
    setErrorMsg(null);
    if (step === 1) {
      if (!reservationDate) {
        setErrorMsg('Please choose your reservation date.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!reservationTime) {
        setErrorMsg('Please select an available dining time slot.');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      if (partySize < 1) {
        setErrorMsg('Party size must be at least 1 guest.');
        return;
      }
      setStep(4);
    } else if (step === 4) {
      if (!selectedTableId) {
        setErrorMsg('Please select your preferred dining table.');
        return;
      }
      setStep(5);
    }
  };

  // Final Submission
  const handleConfirmReservation = async () => {
    if (!validateGuestDetails()) return;

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const enrichedRequests = specialRequests.trim()
        ? `[Assigned: ${selectedTable.number} - ${selectedTable.name}] ${specialRequests.trim()}`
        : `[Assigned: ${selectedTable.number} - ${selectedTable.name}]`;

      const res = await ReservationService.createReservation({
        reservationDate,
        reservationTime,
        partySize,
        seatingSection: selectedTable.section,
        guestName: guestName.trim(),
        guestEmail: guestEmail.trim(),
        guestPhone: guestPhone.trim(),
        specialRequests: enrichedRequests,
        customerId: user?.id,
      });

      setConfirmedReservation(res);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to confirm table reservation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepsList = [
    { num: '01', key: 1, label: 'DATE' },
    { num: '02', key: 2, label: 'TIME' },
    { num: '03', key: 3, label: 'GUESTS' },
    { num: '04', key: 4, label: 'TABLE' },
    { num: '05', key: 5, label: 'DETAILS' },
  ];

  const formattedSelectedDate = useMemo(() => {
    try {
      const [y, m, d] = reservationDate.split('-').map(Number);
      const dateObj = new Date(y, m - 1, d);
      return dateObj.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return reservationDate;
    }
  }, [reservationDate]);

  // CONFIRMATION VIEW
  if (confirmedReservation) {
    return (
      <div className="min-h-screen bg-[#241416] text-[#FFF5EC] py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden flex items-center justify-center">
        <MetaTags title="Reservation Confirmed | Tronx" description="Your culinary table sanctuary is booked at Tronx." />

        {/* Ambient background glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#C2674F]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 right-10 w-80 h-80 bg-[#C2674F]/10 rounded-full blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 max-w-xl w-full bg-[#3A181A] border border-white/15 rounded-3xl p-8 sm:p-12 shadow-2xl text-center space-y-8"
        >
          {/* Confirmation Emblem */}
          <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border border-[#C2674F]/40 animate-ping opacity-25" />
            <div className="w-16 h-16 rounded-full bg-[#602E31] border border-[#C2674F] flex items-center justify-center shadow-lg text-[#FFF5EC]">
              <Check className="w-8 h-8 stroke-[2.5]" />
            </div>
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <span className="text-xs font-sans uppercase tracking-[0.3em] text-[#C2674F] font-bold block">
              Reservation Confirmed
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#FFF5EC]">
              Your Table Awaits
            </h1>
            <p className="text-xs sm:text-sm text-[#E8D9CC]/80 font-sans max-w-md mx-auto leading-relaxed">
              Your table is secured. We look forward to welcoming you to an unforgettable culinary experience at Tronx.
            </p>
          </div>

          {/* Reservation Ticket Details */}
          <div className="bg-[#241416]/80 rounded-2xl border border-white/10 p-6 text-left space-y-4 font-sans text-xs">
            <div className="flex justify-between items-center pb-3 border-b border-white/10">
              <span className="text-[#E8D9CC]/70 uppercase tracking-widest text-[10px]">Booking Reference</span>
              <span className="font-mono font-bold text-sm text-[#C2674F]">{confirmedReservation.bookingReference}</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[#DDD9CB]/60 block text-[10px] uppercase tracking-wider">Date</span>
                <span className="font-semibold text-[#F7F4EC] text-xs">{formattedSelectedDate}</span>
              </div>
              <div>
                <span className="text-[#DDD9CB]/60 block text-[10px] uppercase tracking-wider">Time</span>
                <span className="font-semibold text-[#78956A] text-xs">{confirmedReservation.reservationTime}</span>
              </div>
              <div>
                <span className="text-[#DDD9CB]/60 block text-[10px] uppercase tracking-wider">Party Size</span>
                <span className="font-semibold text-[#F7F4EC] text-xs">{confirmedReservation.partySize} Guests</span>
              </div>
              <div>
                <span className="text-[#DDD9CB]/60 block text-[10px] uppercase tracking-wider">Table Sanctuary</span>
                <span className="font-semibold text-[#F7F4EC] text-xs">{selectedTable.number} • {selectedTable.name}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 text-[11px] text-[#E8D9CC]/80 space-y-1">
              <div className="flex justify-between">
                <span>Guest Name:</span>
                <span className="text-[#FFF5EC] font-semibold">{confirmedReservation.guestName}</span>
              </div>
              <div className="flex justify-between">
                <span>Confirmation Dispatch:</span>
                <span className="text-[#C2674F] font-semibold">{confirmedReservation.guestEmail}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              to="/"
              className="flex-1 py-3.5 rounded-xl bg-[#602E31] hover:bg-[#4D2326] active:scale-[0.97] text-[#FFF5EC] font-sans font-bold text-xs uppercase tracking-wider transition-all duration-200 border border-[#B86268]/40 shadow-md text-center"
            >
              Return to Homepage
            </Link>
            <Link
              to="/menu"
              className="flex-1 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 active:scale-[0.97] text-[#FFF5EC] font-sans font-bold text-xs uppercase tracking-wider transition-all duration-200 border border-white/15 text-center"
            >
              Explore Harvest Menu
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF5EC] text-[#241416] relative overflow-hidden pb-24">
      <MetaTags
        title="Table Reservations | Tronx"
        description="Book your bespoke culinary journey at Tronx. Select your date, time, party size, and preferred dining sanctuary."
      />

      {/* Decorative Subtle Floating Background Rings */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
        <div className="absolute -top-32 right-1/4 w-96 h-96 rounded-full border border-[#C2674F]/20 opacity-40 animate-pulse" />
        <div className="absolute top-1/2 -left-24 w-80 h-80 rounded-full border border-[#C2674F]/20 opacity-30" />
        <div className="absolute bottom-20 right-10 w-64 h-64 rounded-full border border-[#602E31]/15 opacity-40" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 space-y-10">

        {/* ── 1. CINEMATIC RESERVATION STEPPER ───────────────────────────── */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-[#E8D9CC] p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between gap-1 sm:gap-2">
            {stepsList.map((st, index) => {
              const isCompleted = step > st.key;
              const isCurrent = step === st.key;

              return (
                <React.Fragment key={st.key}>
                  <button
                    type="button"
                    onClick={() => {
                      if (isCompleted) setStep(st.key as any);
                    }}
                    disabled={!isCompleted && !isCurrent}
                    className={`flex items-center gap-1.5 sm:gap-2 text-left transition-all group ${
                      isCompleted ? 'cursor-pointer' : isCurrent ? 'cursor-default' : 'cursor-not-allowed opacity-40'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-mono font-bold transition-all ${
                        isCompleted
                          ? 'bg-[#602E31] text-white'
                          : isCurrent
                          ? 'bg-[#241416] text-[#FFF5EC] ring-2 ring-[#C2674F] shadow-sm'
                          : 'bg-[#FAF2EA] text-[#7E6568] border border-[#E8D9CC]'
                      }`}
                    >
                      {isCompleted ? <Check className="w-3.5 h-3.5" /> : st.num}
                    </div>

                    <div className="hidden sm:flex flex-col">
                      <span
                        className={`text-[11px] font-sans font-bold tracking-wider uppercase ${
                          isCurrent ? 'text-[#241416]' : isCompleted ? 'text-[#602E31]' : 'text-[#7E6568]'
                        }`}
                      >
                        {st.label}
                      </span>
                      <span className="text-[9px] text-[#7E6568]/80">
                        {isCompleted ? 'Completed' : isCurrent ? 'Active' : 'Upcoming'}
                      </span>
                    </div>
                  </button>

                  {index < stepsList.length - 1 && (
                    <div
                      className={`flex-1 h-[1.5px] mx-1 sm:mx-2 transition-all ${
                        step > st.key ? 'bg-[#602E31]' : 'bg-[#E8D9CC]'
                      }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Global Error Notice */}
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-[#A8382B]/10 border border-[#A8382B]/20 text-[#A8382B] text-xs font-sans flex items-center gap-2"
          >
            <Info className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </motion.div>
        )}

        {/* ── 2. STEP CONTENTS WITH SMOOTH ANIMATION ──────────────────────── */}
        <AnimatePresence mode="wait">

          {/* ========================================================================= */}
          {/* STEP 1: DATE SELECTION */}
          {/* ========================================================================= */}
          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="bg-white border border-[#E8D9CC] p-6 sm:p-10 rounded-3xl space-y-8 max-w-2xl mx-auto shadow-sm"
            >
              <div className="text-center space-y-2">
                <span className="text-xs font-sans uppercase tracking-[0.25em] text-[#602E31] font-bold block">
                  When will you join us?
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#241416]">
                  Select Date
                </h2>
                <p className="text-xs sm:text-sm text-[#7E6568] max-w-md mx-auto font-sans">
                  Reservations can be booked up to 90 days in advance. Please select your ideal dining date.
                </p>
              </div>

              {/* Custom Elegant Calendar */}
              <div className="bg-[#FAF2EA] border border-[#E8D9CC] rounded-2xl p-5 sm:p-6 space-y-5">
                {/* Month Navigator */}
                <div className="flex items-center justify-between">
                  <h3 className="font-serif font-bold text-base sm:text-lg text-[#241416]">
                    {currentMonthDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </h3>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handlePrevMonth}
                      className="w-8 h-8 rounded-full border border-[#E8D9CC] bg-white flex items-center justify-center text-[#241416] hover:bg-[#602E31] hover:text-white transition-colors cursor-pointer active:scale-[0.97]"
                      aria-label="Previous Month"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNextMonth}
                      className="w-8 h-8 rounded-full border border-[#E8D9CC] bg-white flex items-center justify-center text-[#241416] hover:bg-[#602E31] hover:text-white transition-colors cursor-pointer active:scale-[0.97]"
                      aria-label="Next Month"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Day of Week Headers */}
                <div className="grid grid-cols-7 text-center text-[10px] font-sans font-bold uppercase tracking-wider text-[#7E6568]">
                  <span>Sun</span>
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                </div>

                {/* Days Grid */}
                <div className="grid grid-cols-7 gap-1.5 text-center">
                  {calendarDays.map((day, idx) => {
                    if (!day.isCurrentMonth) {
                      return <div key={`empty-${idx}`} className="h-10 sm:h-12" />;
                    }

                    const isSelected = day.dateStr === reservationDate;

                    return (
                      <button
                        key={day.dateStr}
                        type="button"
                        disabled={day.isPast}
                        onClick={() => setReservationDate(day.dateStr)}
                        className={`h-10 sm:h-12 rounded-xl flex flex-col items-center justify-center text-xs font-mono font-bold transition-all ${
                          isSelected
                            ? 'bg-[#241416] text-[#FFF5EC] ring-2 ring-[#C2674F] shadow-sm cursor-pointer'
                            : day.isPast
                            ? 'text-[#E8D9CC] cursor-not-allowed opacity-40'
                            : 'bg-white text-[#241416] hover:border-[#602E31] border border-transparent hover:text-[#602E31] cursor-pointer'
                        }`}
                      >
                        <span>{day.dayNumber}</span>
                        {day.isToday && !isSelected && (
                          <span className="w-1 h-1 rounded-full bg-[#C2674F] mt-0.5" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action Bar */}
              <div className="pt-2 flex items-center justify-between border-t border-[#E8D9CC]">
                <span className="text-xs text-[#7E6568] font-sans">
                  Selected: <strong className="text-[#241416]">{formattedSelectedDate}</strong>
                </span>
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-8 py-3.5 rounded-xl bg-[#241416] hover:bg-[#4D2326] active:scale-[0.97] text-[#FFF5EC] font-sans font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-sm transition-all"
                >
                  <span>Select Time</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* ========================================================================= */}
          {/* STEP 2: TIME SELECTION */}
          {/* ========================================================================= */}
          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="bg-white border border-[#E8D9CC] p-6 sm:p-10 rounded-3xl space-y-8 max-w-2xl mx-auto shadow-sm"
            >
              <div className="text-center space-y-2">
                <span className="text-xs font-sans uppercase tracking-[0.25em] text-[#602E31] font-bold block">
                  FOR {formattedSelectedDate.toUpperCase()}
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#241416]">
                  Select Time
                </h2>
                <p className="text-xs sm:text-sm text-[#7E6568] max-w-md mx-auto font-sans">
                  Choose your preferred seating window. Available slots reflect real-time table commitments.
                </p>
              </div>

              {isCheckingSlots ? (
                <div className="text-center py-12 space-y-3">
                  <div className="w-8 h-8 border-2 border-[#602E31] border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xs text-[#7E6568] font-sans">Verifying live table availability...</p>
                </div>
              ) : availableSlots.length === 0 ? (
                <div className="bg-[#A8382B]/10 p-6 rounded-2xl text-center space-y-2 border border-[#A8382B]/20 text-[#A8382B]">
                  <p className="font-bold text-sm">All Slots Fully Booked</p>
                  <p className="text-xs text-[#7E6568]">
                    Our tables are fully committed for this date. Please select another dining date.
                  </p>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="mt-2 inline-flex items-center gap-1.5 text-xs text-[#602E31] underline font-bold"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Return to Calendar
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {timeSlotGroups.map((group) => (
                    <div key={group.label} className="space-y-3">
                      <div className="flex items-center gap-2 text-xs font-sans font-bold uppercase tracking-wider text-[#602E31]">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{group.label}</span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        {group.slots.map((slot) => {
                          const isAvailable = availableSlots.includes(slot);
                          const isSelected = reservationTime === slot;

                          return (
                            <button
                              key={slot}
                              type="button"
                              disabled={!isAvailable}
                              onClick={() => setReservationTime(slot)}
                              className={`py-3.5 px-3 rounded-xl border text-xs font-mono font-bold transition-all ${
                                isSelected
                                  ? 'bg-[#241416] border-[#241416] text-[#FFF5EC] ring-2 ring-[#C2674F] shadow-sm cursor-pointer'
                                  : isAvailable
                                  ? 'bg-[#FAF2EA] border-[#E8D9CC] text-[#241416] hover:border-[#602E31] hover:bg-white cursor-pointer active:scale-[0.97]'
                                  : 'bg-stone-100 border-stone-200 text-stone-400 cursor-not-allowed line-through'
                              }`}
                            >
                              {slot}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Action Bar */}
              <div className="pt-4 flex items-center justify-between border-t border-[#E8D9CC]">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-[#7E6568] hover:text-[#241416] flex items-center gap-1.5 font-sans font-semibold transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to Date
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  disabled={availableSlots.length === 0}
                  className="px-8 py-3.5 rounded-xl bg-[#241416] hover:bg-[#4D2326] active:scale-[0.97] text-[#FFF5EC] font-sans font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-sm transition-all disabled:opacity-40"
                >
                  <span>Select Party Size</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* ========================================================================= */}
          {/* STEP 3: PARTY SIZE */}
          {/* ========================================================================= */}
          {step === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="bg-white border border-[#E8D9CC] p-6 sm:p-10 rounded-3xl space-y-8 max-w-2xl mx-auto shadow-sm"
            >
              <div className="text-center space-y-2">
                <span className="text-xs font-sans uppercase tracking-[0.25em] text-[#602E31] font-bold block">
                  Select the Total Number of Guests
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#241416]">
                  Party Size
                </h2>
                <p className="text-xs sm:text-sm text-[#7E6568] max-w-md mx-auto font-sans">
                  Please let us know how many guests will be dining at your sanctuary table.
                </p>
              </div>

              {/* Editorial Large Stepper Counter */}
              <div className="bg-[#FAF2EA] border border-[#E8D9CC] rounded-3xl p-8 text-center space-y-6">
                <div className="w-12 h-12 rounded-full bg-[#602E31]/10 text-[#602E31] flex items-center justify-center mx-auto border border-[#602E31]/20">
                  <Users className="w-6 h-6" />
                </div>

                <div className="flex items-center justify-center gap-8 sm:gap-12">
                  <button
                    type="button"
                    disabled={partySize <= 1}
                    onClick={() => setPartySize(Math.max(1, partySize - 1))}
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-[#E8D9CC] bg-white flex items-center justify-center text-[#241416] text-2xl font-mono font-bold hover:border-[#602E31] hover:bg-[#602E31] hover:text-white transition-all cursor-pointer active:scale-[0.97] disabled:opacity-30 disabled:cursor-not-allowed shadow-xs"
                    aria-label="Decrease Guest Count"
                  >
                    −
                  </button>

                  <div className="flex flex-col items-center">
                    <span className="font-serif text-6xl sm:text-7xl font-bold text-[#241416] leading-none tracking-tight">
                      {partySize}
                    </span>
                    <span className="text-xs uppercase font-sans tracking-widest text-[#7E6568] mt-2 font-semibold">
                      {partySize === 1 ? 'Guest' : 'Guests'}
                    </span>
                  </div>

                  <button
                    type="button"
                    disabled={partySize >= 12}
                    onClick={() => setPartySize(Math.min(12, partySize + 1))}
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-[#E8D9CC] bg-white flex items-center justify-center text-[#241416] text-2xl font-mono font-bold hover:border-[#602E31] hover:bg-[#602E31] hover:text-white transition-all cursor-pointer active:scale-[0.97] disabled:opacity-30 disabled:cursor-not-allowed shadow-xs"
                    aria-label="Increase Guest Count"
                  >
                    +
                  </button>
                </div>

                {/* Quick Pick Presets */}
                <div className="flex items-center justify-center gap-2 flex-wrap pt-2">
                  {[1, 2, 4, 6, 8, 10, 12].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setPartySize(num)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-bold border transition-all cursor-pointer ${
                        partySize === num
                          ? 'bg-[#241416] border-[#241416] text-white shadow-xs'
                          : 'bg-white border-[#E8D9CC] text-[#3A453C] hover:border-[#602E31]'
                      }`}
                    >
                      {num} {num === 1 ? 'Guest' : 'Guests'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Large Party Notice */}
              <div className="bg-[#FAF2EA] border border-[#E8D9CC] p-4 rounded-xl flex items-start gap-3 text-xs text-[#7E6568] font-sans">
                <Info className="w-4 h-4 text-[#602E31] shrink-0 mt-0.5" />
                <span>
                  For exclusive parties larger than 12 guests, kindly contact our Private Vault concierge at{' '}
                  <strong className="text-[#241416]">{RESTAURANT_BRAND.phone}</strong>.
                </span>
              </div>

              {/* Action Bar */}
              <div className="pt-4 flex items-center justify-between border-t border-[#E8D9CC]">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="text-xs text-[#7E6568] hover:text-[#241416] flex items-center gap-1.5 font-sans font-semibold transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to Time
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  className="px-8 py-3.5 rounded-xl bg-[#241416] hover:bg-[#4D2326] active:scale-[0.97] text-[#FFF5EC] font-sans font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-sm transition-all"
                >
                  <span>Select Table</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* ========================================================================= */}
          {/* STEP 4: VISUAL TABLE SELECTION */}
          {/* ========================================================================= */}
          {step === 4 && (
            <motion.div
              key="step-4"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="bg-white border border-[#E8D9CC] p-6 sm:p-10 rounded-3xl space-y-8 max-w-4xl mx-auto shadow-sm"
            >
              <div className="text-center space-y-2">
                <span className="text-xs font-sans uppercase tracking-[0.25em] text-[#602E31] font-bold block">
                  Choose Your Sanctuary
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#241416]">
                  Select Table
                </h2>
                <p className="text-xs sm:text-sm text-[#7E6568] max-w-lg mx-auto font-sans">
                  Every table is crafted for ambiance, comfort, and culinary immersion. Choose your preferred dining position.
                </p>
              </div>

              {/* Section Filter Pills */}
              <div className="flex items-center justify-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                <button
                  type="button"
                  onClick={() => setTableFilterSection('ALL')}
                  className={`px-4 py-2 rounded-xl text-xs font-sans font-bold tracking-wider uppercase whitespace-nowrap transition-all cursor-pointer ${
                    tableFilterSection === 'ALL'
                      ? 'bg-[#241416] text-white shadow-xs'
                      : 'bg-[#FAF2EA] border border-[#E8D9CC] text-[#3A453C] hover:border-[#602E31]'
                  }`}
                >
                  All Sanctuaries ({AURA_TABLES.length})
                </button>
                {SEATING_SECTIONS.map((sec) => (
                  <button
                    key={sec.id}
                    type="button"
                    onClick={() => setTableFilterSection(sec.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-sans font-bold tracking-wider uppercase whitespace-nowrap transition-all cursor-pointer ${
                      tableFilterSection === sec.id
                        ? 'bg-[#241416] text-white shadow-xs'
                        : 'bg-[#FAF2EA] border border-[#E8D9CC] text-[#3A453C] hover:border-[#602E31]'
                    }`}
                  >
                    {sec.name}
                  </button>
                ))}
              </div>

              {/* Table Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {AURA_TABLES.filter(
                  (tbl) => tableFilterSection === 'ALL' || tbl.section === tableFilterSection
                ).map((tbl) => {
                  const isSelected = selectedTableId === tbl.id;
                  const isCapacityFit = tbl.capacity >= partySize;

                  return (
                    <div
                      key={tbl.id}
                      onClick={() => {
                        if (isCapacityFit) setSelectedTableId(tbl.id);
                      }}
                      className={`relative p-5 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between space-y-3 ${
                        isSelected
                          ? 'bg-[#241416] border-[#C2674F] text-white shadow-lg ring-2 ring-[#C2674F] cursor-pointer'
                          : isCapacityFit
                          ? 'bg-[#FAF2EA] border-[#E8D9CC] text-[#241416] hover:border-[#602E31] hover:bg-white cursor-pointer hover:shadow-xs active:scale-[0.98]'
                          : 'bg-stone-100/70 border-stone-200 text-stone-400 cursor-not-allowed opacity-50'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between pb-2 border-b border-inherit">
                          <span
                            className={`font-mono text-xs font-bold uppercase tracking-wider ${
                              isSelected ? 'text-[#C2674F]' : 'text-[#602E31]'
                            }`}
                          >
                            {tbl.number}
                          </span>
                          <span
                            className={`inline-flex items-center gap-1 text-[11px] font-sans font-bold ${
                              isSelected ? 'text-white' : 'text-[#241416]'
                            }`}
                          >
                            <Users className="w-3.5 h-3.5" />
                            <span>{tbl.capacity} Seats</span>
                          </span>
                        </div>

                        <h4 className="font-serif font-bold text-base mt-2.5 leading-snug">
                          {tbl.name}
                        </h4>
                        <p
                          className={`text-xs mt-1 font-sans line-clamp-2 leading-relaxed ${
                            isSelected ? 'text-[#E8D9CC]/80' : 'text-[#7E6568]'
                          }`}
                        >
                          {tbl.description}
                        </p>
                      </div>

                      <div className="pt-2 flex items-center justify-between">
                        <span
                          className={`text-[10px] uppercase font-sans font-semibold tracking-wider ${
                            isSelected ? 'text-[#B86268]' : 'text-[#7E6568]'
                          }`}
                        >
                          {tbl.zoneName}
                        </span>

                        {isSelected ? (
                          <span className="px-2 py-0.5 rounded-md bg-[#C2674F] text-white text-[9px] font-sans font-bold uppercase tracking-widest shadow-xs">
                            Selected
                          </span>
                        ) : !isCapacityFit ? (
                          <span className="text-[10px] text-rose-700 font-sans font-semibold">
                            Max {tbl.capacity}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Requirement Summary Footnote */}
              <div className="bg-[#FAF2EA] border border-[#E8D9CC] rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-sans">
                <div className="flex items-center gap-6">
                  <div>
                    <span className="text-[#7E6568] block text-[10px] uppercase tracking-wider">Required Capacity</span>
                    <span className="font-bold text-[#241416]">{partySize} Seats</span>
                  </div>
                  <div className="h-6 w-[1px] bg-[#E8D9CC]" />
                  <div>
                    <span className="text-[#7E6568] block text-[10px] uppercase tracking-wider">Selected Table</span>
                    <span className="font-bold text-[#602E31]">
                      {selectedTable.number} • {selectedTable.name} ({selectedTable.capacity} Seats)
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#602E31]" />
                  <span className="text-[#241416] font-medium">Ready for Guest Verification</span>
                </div>
              </div>

              {/* Action Bar */}
              <div className="pt-4 flex items-center justify-between border-t border-[#E8D9CC]">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="text-xs text-[#7E6568] hover:text-[#241416] flex items-center gap-1.5 font-sans font-semibold transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to Guests
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  className="px-8 py-3.5 rounded-xl bg-[#241416] hover:bg-[#4D2326] active:scale-[0.97] text-[#FFF5EC] font-sans font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-sm transition-all"
                >
                  <span>Proceed to Details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* ========================================================================= */}
          {/* STEP 5: GUEST DETAILS & SUMMARY */}
          {/* ========================================================================= */}
          {step === 5 && (
            <motion.div
              key="step-5"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
            >
              {/* Left Column: Guest Details Form */}
              <div className="lg:col-span-7 bg-white border border-[#E8D9CC] p-6 sm:p-10 rounded-3xl space-y-6 shadow-sm">
                <div className="space-y-1 pb-4 border-b border-[#E8D9CC]">
                  <span className="text-xs font-sans uppercase tracking-[0.25em] text-[#602E31] font-bold block">
                    Concierge Registry
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#241416]">
                    Guest Details
                  </h2>
                  <p className="text-xs text-[#7E6568] font-sans">
                    Please provide your contact details for reservation confirmation and table arrival SMS.
                  </p>
                </div>

                {user && (
                  <div className="bg-[#FAF2EA] border border-[#602E31]/30 p-3.5 rounded-xl text-xs text-[#602E31] flex items-center gap-2.5 font-sans">
                    <Shield className="w-4 h-4 shrink-0" />
                    <span>Logged in as <strong>{user.fullName}</strong>. Profile information pre-filled below.</span>
                  </div>
                )}

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-[#241416] font-semibold flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-[#602E31]" /> Full Name <span className="text-[#602E31]">*</span>
                    </label>
                    <input
                      type="text"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="e.g. Julian Montgomery"
                      className="w-full bg-[#FAF2EA] border border-[#E8D9CC] rounded-xl px-4 py-3 text-xs sm:text-sm text-[#241416] placeholder-[#7E6568]/50 focus:outline-none focus:border-[#602E31] focus:bg-white transition-all font-sans"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs text-[#241416] font-semibold flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-[#602E31]" /> Phone Number <span className="text-[#602E31]">*</span>
                      </label>
                      <input
                        type="tel"
                        value={guestPhone}
                        onChange={(e) => setGuestPhone(e.target.value)}
                        placeholder="+1 (555) 321-4567"
                        className="w-full bg-[#FAF2EA] border border-[#E8D9CC] rounded-xl px-4 py-3 text-xs sm:text-sm text-[#241416] placeholder-[#7E6568]/50 focus:outline-none focus:border-[#602E31] focus:bg-white transition-all font-sans"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs text-[#241416] font-semibold flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5 text-[#602E31]" /> Email Address <span className="text-[#602E31]">*</span>
                      </label>
                      <input
                        type="email"
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        placeholder="julian@example.com"
                        className="w-full bg-[#FAF2EA] border border-[#E8D9CC] rounded-xl px-4 py-3 text-xs sm:text-sm text-[#241416] placeholder-[#7E6568]/50 focus:outline-none focus:border-[#602E31] focus:bg-white transition-all font-sans"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-[#241416] font-semibold">
                      Special Requests & Dietary Requirements (Optional)
                    </label>
                    <textarea
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      placeholder="e.g. Anniversary celebration, quiet seating, gluten-free accommodations..."
                      rows={3}
                      className="w-full bg-[#FAF2EA] border border-[#E8D9CC] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#241416] placeholder-[#7E6568]/50 focus:outline-none focus:border-[#602E31] focus:bg-white transition-all font-sans"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(4)}
                    className="text-xs text-[#7E6568] hover:text-[#241416] flex items-center gap-1.5 font-sans font-semibold transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back to Table Selection
                  </button>
                </div>
              </div>

              {/* Right Column: Reservation Summary Card */}
              <div className="lg:col-span-5 bg-[#241416] border border-white/10 text-[#FFF5EC] p-6 sm:p-8 rounded-3xl space-y-6 shadow-xl sticky top-24">
                <div className="space-y-1 pb-4 border-b border-white/10">
                  <span className="text-[10px] font-sans uppercase tracking-[0.3em] text-[#C2674F] font-bold block">
                    Sanctuary Booking
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-[#FFF5EC]">
                    Reservation Summary
                  </h3>
                </div>

                <div className="space-y-3 font-sans text-xs">
                  <div className="flex justify-between items-center py-1.5 border-b border-white/10">
                    <span className="text-[#E8D9CC]/70">Date:</span>
                    <span className="font-semibold text-white">{formattedSelectedDate}</span>
                  </div>

                  <div className="flex justify-between items-center py-1.5 border-b border-white/10">
                    <span className="text-[#E8D9CC]/70">Time Window:</span>
                    <span className="font-semibold text-[#C2674F] font-mono text-sm">{reservationTime}</span>
                  </div>

                  <div className="flex justify-between items-center py-1.5 border-b border-white/10">
                    <span className="text-[#E8D9CC]/70">Party Size:</span>
                    <span className="font-semibold text-white">{partySize} Guests</span>
                  </div>

                  <div className="flex justify-between items-center py-1.5 border-b border-white/10">
                    <span className="text-[#E8D9CC]/70">Selected Table:</span>
                    <span className="font-semibold text-[#C2674F]">{selectedTable.number}</span>
                  </div>

                  <div className="flex justify-between items-center py-1.5 border-b border-white/10">
                    <span className="text-[#E8D9CC]/70">Sanctuary Zone:</span>
                    <span className="font-semibold text-white">{selectedTable.zoneName}</span>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-[11px] text-[#E8D9CC]/80 font-sans space-y-1">
                  <div className="flex items-center gap-1.5 text-[#C2674F] font-bold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Complimentary Concierge Privileges</span>
                  </div>
                  <p>Flexible cancellation up to 2 hours prior to reservation time with zero deposit fee.</p>
                </div>

                <button
                  type="button"
                  onClick={handleConfirmReservation}
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl bg-[#602E31] hover:bg-[#4D2326] active:scale-[0.97] text-[#FFF5EC] font-sans font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg border border-[#B86268]/40 transition-all duration-200 disabled:opacity-50 min-h-[48px]"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Securing Your Table...
                    </span>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 text-[#C2674F]" />
                      <span>Confirm Reservation</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>

      </div>
    </div>
  );
};
