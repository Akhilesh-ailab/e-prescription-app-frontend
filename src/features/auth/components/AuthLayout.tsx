import { memo, type ReactNode } from 'react';
import { CaduceusIcon, ShieldIcon, StethoscopeIcon, SparklesIcon } from './icons';

const PARTICLES = [
  { top: '15%', left: '20%', size: 5, delay: '0s' },
  { top: '30%', left: '75%', size: 4, delay: '1.2s' },
  { top: '55%', left: '35%', size: 6, delay: '2.4s' },
  { top: '70%', left: '65%', size: 4, delay: '0.6s' },
  { top: '25%', left: '50%', size: 3, delay: '3s' },
  { top: '80%', left: '25%', size: 5, delay: '1.8s' },
] as const;

const FEATURES = [
  { icon: StethoscopeIcon, label: 'AI Voice Dictation' },
  { icon: SparklesIcon, label: 'Auto-Filled Prescriptions' },
  { icon: ShieldIcon, label: 'Secure Patient Records' },
] as const;

function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen min-h-[100dvh] w-full bg-slate-100 flex flex-col lg:flex-row items-stretch overflow-hidden">

      {/* ===== Left panel — prescription-themed, brand color, big curved edge ===== */}
      <div className="hidden lg:flex lg:w-[46%] xl:w-[44%] relative bg-gradient-to-br from-brand-500 via-brand-600 to-brand-700 flex-col justify-between px-10 xl:px-14 py-10 xl:py-12 overflow-hidden shrink-0">

        {/* Slowly drifting wave layers */}
        <svg className="absolute inset-0 w-full h-full opacity-20 animate-drift-slow" viewBox="0 0 400 900" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0,150 C120,100 280,220 400,140 L400,0 L0,0 Z" fill="white" />
          <path d="M0,900 C140,780 260,880 400,780 L400,900 Z" fill="white" />
        </svg>
        <svg className="absolute inset-0 w-full h-full opacity-10 animate-drift-slower" viewBox="0 0 400 900" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0,220 C150,160 250,280 400,200 L400,0 L0,0 Z" fill="white" />
        </svg>

        {/* Floating particle dots */}
        {PARTICLES.map((p, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/40 animate-float-particle"
            style={{ top: p.top, left: p.left, width: p.size, height: p.size, animationDelay: p.delay }}
            aria-hidden="true"
          />
        ))}

        {/* Large decorative Rx symbol, faint */}
        <div className="absolute top-1/2 -translate-y-1/2 -left-6 text-[220px] xl:text-[260px] font-serif font-bold text-white/[0.06] leading-none pointer-events-none select-none" aria-hidden="true">
          ℞
        </div>

        {/* Faded caduceus watermark, bottom-right, gently pulsing */}
        <div className="absolute -bottom-6 -right-10 w-56 h-72 text-white opacity-[0.08] pointer-events-none animate-pulse-glow" aria-hidden="true">
          <CaduceusIcon />
        </div>

        {/* Logo + brand name */}
        <div className="flex items-center gap-3 relative z-20">
          <div className="bg-white p-2 rounded-full shadow-md shrink-0">
            <img src="/aiims-logo.png" alt="AIIMS Logo" className="h-10 w-10 object-contain" />
          </div>
          <span className="text-white font-bold text-sm tracking-wide">AIIMS E-Prescription</span>
        </div>

        {/* Headline + feature chips */}
        <div className="relative z-20">
          <h1 className="text-white text-3xl xl:text-4xl font-bold leading-tight">
            Welcome to the<br />AI Voice Prescription<br />System
          </h1>
          <p className="text-blue-100/80 text-sm mt-4 max-w-xs">
            All India Institute of Medical Sciences, Raipur — dictate, review, and issue prescriptions faster.
          </p>

          <ul className="mt-7 space-y-3">
            {FEATURES.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2.5 text-white/90 text-xs font-medium">
                <span className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center shrink-0">
                  <Icon className="w-3.5 h-3.5" />
                </span>
                {label}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-blue-100/60 text-[11px] relative z-20">
          Authorized Medical Personnel Only
        </p>
      </div>

      {/* ===== Prominent curved divider — sits between the two panels ===== */}
      <svg
        className="hidden lg:block absolute top-0 h-full w-28 xl:w-36 z-20 pointer-events-none"
        style={{ left: 'calc(46% - 3.5rem)' }}
        viewBox="0 0 140 900"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0,0 H60 C120,120 20,260 70,380 C130,500 10,620 65,740 C110,830 30,880 60,900 H0 Z"
          fill="#f1f5f9"
        />
      </svg>

      {/* ===== Right panel — light, form card, responsive ===== */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12 relative overflow-y-auto min-h-0">

        {/* Pulsing brand-colored glow behind the card */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center" aria-hidden="true">
          <div className="w-[340px] sm:w-[520px] h-[340px] sm:h-[520px] rounded-full bg-brand-400/10 blur-3xl animate-pulse-glow"></div>
        </div>

        {/* AIIMS watermark */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.04]" aria-hidden="true">
          <img src="/aiims-logo.png" alt="" className="w-[260px] sm:w-[380px] object-contain" />
        </div>

        {/* Faint decorative caduceus, desktop only */}
        <div className="hidden lg:block absolute top-10 right-10 w-24 h-32 text-brand-600 opacity-[0.06] pointer-events-none animate-drift-slow" aria-hidden="true">
          <CaduceusIcon />
        </div>

        {/* Floating particles, light side */}
        <div className="hidden sm:block absolute top-1/4 left-1/5 w-2 h-2 rounded-full bg-brand-400/30 animate-float-particle" style={{ animationDelay: '0.5s' }} aria-hidden="true" />
        <div className="hidden sm:block absolute bottom-1/3 right-1/4 w-1.5 h-1.5 rounded-full bg-accent-500/20 animate-float-particle" style={{ animationDelay: '2s' }} aria-hidden="true" />

        <div className="w-full max-w-sm relative z-30 bg-white rounded-2xl shadow-[0_10px_45px_rgba(15,23,42,0.1)] ring-1 ring-slate-200 px-6 sm:px-8 py-8 sm:py-9 my-auto">
          <div className="flex lg:hidden items-center gap-3 mb-6 sm:mb-7 justify-center">
            <div className="bg-brand-700 p-1.5 rounded-full shadow-md shrink-0">
              <img src="/aiims-logo.png" alt="AIIMS Logo" className="h-9 w-9 object-contain bg-white rounded-full p-0.5" />
            </div>
            <span className="text-slate-800 font-bold text-sm tracking-wide">AIIMS E-Prescription</span>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}

export default memo(AuthLayout);