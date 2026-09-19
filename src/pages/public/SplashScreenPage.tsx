import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';

interface BootStage {
  progress: number;
  text: string;
}

const BOOT_STAGES: BootStage[] = [
  { progress: 0, text: 'Initializing cryptographic circular ledger...' },
  { progress: 25, text: 'Syncing node telemetry across Bengaluru cluster...' },
  { progress: 50, text: 'Verifying CPCB e-waste compliance manifests...' },
  { progress: 75, text: 'Calibrating zero-cost deterministic AI engines...' },
  { progress: 100, text: 'All systems nominal. Ingress verified.' },
];

interface SplashScreenProps {
  onComplete?: () => void;
  targetRoute?: string;
}

export const SplashScreenPage: React.FC<SplashScreenProps> = ({
  onComplete,
  targetRoute = '/marketplace',
}) => {
  const navigate = useNavigate();
  const [secondsLeft, setSecondsLeft] = useState(3);
  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const [telemetryHash, setTelemetryHash] = useState('0x88F-BLR-IND');

  const handleFinish = useCallback(() => {
    if (onComplete) {
      onComplete();
    }
    navigate(targetRoute);
  }, [onComplete, navigate, targetRoute]);

  // 3-Second Countdown & Progress Sync
  useEffect(() => {
    const countdownTimer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(countdownTimer);
          setTimeout(() => handleFinish(), 300);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdownTimer);
  }, [handleFinish]);

  // Stage progress based on 3s countdown
  useEffect(() => {
    const elapsed = 3 - secondsLeft;
    if (elapsed >= 3) setCurrentStageIdx(4);
    else if (elapsed >= 2) setCurrentStageIdx(3);
    else if (elapsed >= 1) setCurrentStageIdx(1);
    else setCurrentStageIdx(0);

    // Random cryptographic hash flicker for realism
    if (Math.random() > 0.3) {
      const randHex = Math.floor(Math.random() * 0xffffff)
        .toString(16)
        .toUpperCase()
        .padStart(6, '0');
      setTelemetryHash(`0x${randHex.slice(0, 3)}-BLR-IND`);
    }
  }, [secondsLeft]);

  const stage = BOOT_STAGES[currentStageIdx];
  const progressPercent = Math.min(100, Math.round(((3 - secondsLeft) / 3) * 100));


  return (
    <div className="fixed inset-0 z-50 w-full h-full min-h-screen flex flex-col justify-between items-center p-4 md:p-8 radial-vignette overflow-hidden bg-[#07130d] text-slate-100 font-sans select-none">
      {/* Micro Particle Matrix & Grid Background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            'radial-gradient(#2de19a 0.75px, transparent 0.75px), radial-gradient(#1b4332 0.75px, #07130d 0.75px)',
          backgroundSize: '32px 32px',
          backgroundPosition: '0 0, 16px 16px',
        }}
      />

      {/* Atmospheric Glow Blurs */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[720px] h-[480px] bg-[#2de19a]/10 rounded-full blur-[140px] pointer-events-none animate-pulse-glow" />
      <div className="absolute -bottom-32 left-1/4 w-[540px] h-[360px] bg-[#1b4332]/30 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Metadata / Node Telemetry Header */}
      <header className="relative z-10 w-full max-w-6xl flex items-center justify-between border-b border-emerald-900/40 pb-4 pt-2 text-xs text-emerald-400/80 font-mono">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/70 border border-emerald-600/30 text-emerald-300 font-medium">
            <span className="w-2 h-2 rounded-full bg-[#2de19a] animate-ping" />
            <span>PROTOCOL v3.4 ACTIVE</span>
          </span>
          <span className="hidden sm:inline-block text-emerald-600/70">|</span>
          <span className="hidden sm:inline-block tracking-wider uppercase text-emerald-500/70">
            ISO 14044 LCA Compliant
          </span>
        </div>

        <div className="flex items-center gap-4 text-emerald-400/60 font-mono text-[11px]">
          <div className="hidden md:flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/40" />
            <span>NODE: AP-SOUTH-1 (BLR)</span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-900/30 border border-emerald-800/40 text-emerald-300 font-mono">
            <span className="text-emerald-500">HASH:</span>
            <span className="tracking-widest">{telemetryHash}</span>
          </div>
        </div>
      </header>

      {/* Centerpiece: Circular Loop Graphic & Brand Identity */}
      <main className="relative z-10 flex flex-col items-center justify-center my-auto w-full max-w-2xl px-4 py-4">
        {/* Interactive Animated Planetary Loop Mark */}
        <div className="relative w-56 h-56 md:w-72 md:h-72 flex items-center justify-center mb-6 animate-float">
          {/* Conic gradient ambient aura */}
          <div className="absolute inset-0 rounded-full glow-conic animate-spin-slow opacity-60 blur-xl" />

          {/* Outer Dashed Orbital Ring */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 320 320"
          >
            <circle
              cx="160"
              cy="160"
              r="148"
              fill="none"
              stroke="rgba(45, 225, 154, 0.22)"
              strokeWidth="1.5"
              className="orbit-stroke"
            />
            <circle
              cx="160"
              cy="160"
              r="124"
              fill="none"
              stroke="rgba(27, 67, 50, 0.45)"
              strokeWidth="1"
            />
          </svg>

          {/* Counter-rotating satellite orbital nodes */}
          <div className="absolute inset-0 animate-spin-reverse pointer-events-none">
            {/* Orbital Satellite A (Material Loop) */}
            <div className="absolute top-1 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#07130d] border border-[#2de19a] flex items-center justify-center shadow-[0_0_12px_rgba(45,225,154,0.6)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2de19a]" />
            </div>
            {/* Orbital Satellite B (Carbon Avoidance) */}
            <div className="absolute bottom-4 right-8 w-3.5 h-3.5 rounded-full bg-[#07130d] border border-emerald-400 flex items-center justify-center shadow-[0_0_8px_rgba(45,225,154,0.4)]">
              <span className="w-1 h-1 rounded-full bg-emerald-300" />
            </div>
            {/* Orbital Satellite C (Reuse Node) */}
            <div className="absolute top-1/2 left-1 -translate-y-1/2 w-3 h-3 rounded-full bg-[#07130d] border border-emerald-500/60 flex items-center justify-center">
              <span className="w-1 h-1 rounded-full bg-emerald-400/80" />
            </div>
          </div>

          {/* Middle Glass Ring Chamber */}
          <div className="absolute w-44 h-44 md:w-52 md:h-52 rounded-full bg-gradient-to-b from-emerald-950/60 to-emerald-900/30 border border-emerald-500/30 backdrop-blur-md shadow-[0_0_40px_rgba(11,45,30,0.8)] flex items-center justify-center">
            {/* Inner pulsating glow orb */}
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-tr from-[#1b4332] via-[#0f291e] to-[#2de19a]/25 flex items-center justify-center border border-emerald-400/20 shadow-inner">
              {/* Central Geometric Möbius / Regenerative Loop SVG Symbol */}
              <svg
                className="w-16 h-16 md:w-20 md:h-20 text-emerald-300 transition-transform duration-700 hover:rotate-180 cursor-pointer"
                viewBox="0 0 100 100"
                fill="none"
              >
                <defs>
                  <linearGradient id="circleGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#2de19a" />
                    <stop offset="100%" stopColor="#1b4332" />
                  </linearGradient>
                  <linearGradient id="circleGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#86efac" />
                    <stop offset="100%" stopColor="#2de19a" />
                  </linearGradient>
                  <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>
                <path
                  d="M 50 15 C 68 15 82 28 85 45 C 77 41 68 40 58 43 C 54 30 44 21 32 20 C 37 17 43 15 50 15 Z"
                  fill="url(#circleGrad1)"
                  opacity="0.9"
                />
                <path
                  d="M 85 55 C 82 72 68 85 50 85 C 43 85 37 83 32 80 C 44 79 54 70 58 57 C 68 60 77 59 85 55 Z"
                  fill="url(#circleGrad2)"
                  opacity="0.9"
                />
                <path
                  d="M 22 36 C 26 24 36 15 48 15 C 44 23 43 32 46 41 C 34 45 25 54 22 66 C 18 57 18 45 22 36 Z"
                  fill="#2de19a"
                  opacity="0.85"
                  filter="url(#softGlow)"
                />
                <circle cx="50" cy="50" r="7" fill="#f0fdf4" className="shadow-lg" />
                <circle cx="50" cy="50" r="3" fill="#0b1d15" />
              </svg>
            </div>
          </div>

          {/* Real-time Status Badge Tag on Ring */}
          <div className="absolute -bottom-2 bg-emerald-950/90 border border-emerald-500/40 rounded-full px-3.5 py-1 text-[11px] font-mono text-emerald-300 shadow-[0_4px_16px_rgba(0,0,0,0.5)] flex items-center gap-1.5">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                secondsLeft === 0 ? 'bg-emerald-400' : 'bg-[#2de19a] animate-pulse'
              }`}
            />
            <span>{secondsLeft === 0 ? 'INGRESS VERIFIED' : `AUTO-REDIRECT IN ${secondsLeft}S`}</span>
          </div>
        </div>

        {/* Typography Brand Lockup */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white flex items-center justify-center gap-1.5">
            <span>Circle</span>
            <span className="text-[#2de19a] font-semibold">Loop</span>
            <span className="text-xs align-top uppercase px-2 py-0.5 rounded-md bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 font-mono font-normal tracking-normal ml-2">
              OS v3
            </span>
          </h1>
          <p className="text-xs md:text-sm text-emerald-200/80 font-light max-w-md mx-auto leading-relaxed">
            Industrial & Institutional Circular Economy Infrastructure
          </p>
        </div>

        {/* Live Initialization Telemetry & Progress Rail */}
        <div className="w-full max-w-md mt-6 space-y-2.5">
          {/* Progress Bar Wrapper */}
          <div className="relative w-full h-2 rounded-full bg-emerald-950/80 border border-emerald-800/50 p-0.5 overflow-hidden shadow-inner">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-600 via-[#2de19a] to-emerald-300 transition-all duration-500 ease-out relative"
              style={{ width: `${progressPercent}%` }}
            >
              {/* Shimmer Highlight Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent w-full h-full animate-[shimmer-sweep_2s_infinite]" />
            </div>
          </div>

          {/* Status Micro-Text & Percentage Counter */}
          <div className="flex items-center justify-between text-xs font-mono text-emerald-400/90 pt-0.5">
            <div className="flex items-center gap-2 overflow-hidden">
              <svg
                className={`w-3.5 h-3.5 text-emerald-400 shrink-0 ${
                  secondsLeft === 0 ? '' : 'animate-spin'
                }`}
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
              <span className="truncate">{stage.text}</span>
            </div>
            <span className="font-semibold text-emerald-300 ml-2">{progressPercent}%</span>
          </div>
        </div>

        {/* Action Button & Shortcuts */}
        <div className="mt-6 flex flex-col items-center gap-4 w-full max-w-md">
          <button
            type="button"
            onClick={handleFinish}
            className={`w-full py-3 px-6 rounded-xl font-mono text-xs font-bold transition-all shadow-lg flex items-center justify-center gap-2 ${
              secondsLeft === 0
                ? 'bg-[#2de19a] hover:bg-emerald-400 text-emerald-950 shadow-[#2de19a]/20 scale-105'
                : 'bg-emerald-900/60 hover:bg-emerald-800/80 border border-emerald-500/30 text-emerald-200'
            }`}
          >
            <span className="flex items-center gap-1.5">
              {secondsLeft === 0 ? (
                <>
                  <span className="material-symbols-outlined text-[16px]">bolt</span>
                  <span>ENTERING PLATFORM...</span>
                </>
              ) : (
                <span>SKIP WAIT ({secondsLeft}s REMAINING)</span>
              )}
            </span>
            <span className="font-mono text-sm">→</span>
          </button>

          <div className="flex flex-wrap items-center justify-center gap-2.5 w-full text-[11px] font-mono">
            <Link
              to="/marketplace"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/70 hover:bg-emerald-900/90 border border-emerald-800/40 text-emerald-300 transition-all"
            >
              <span className="material-symbols-outlined text-[14px]">storefront</span>
              <span>Marketplace</span>
            </Link>
            <Link
              to="/repair-recycle"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/70 hover:bg-emerald-900/90 border border-emerald-800/40 text-emerald-300 transition-all"
            >
              <span className="material-symbols-outlined text-[14px]">build</span>
              <span>Repair Hub</span>
            </Link>
            <Link
              to="/org/dashboard"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/70 hover:bg-emerald-900/90 border border-emerald-800/40 text-emerald-300 transition-all"
            >
              <span className="material-symbols-outlined text-[14px]">corporate_fare</span>
              <span>Org Dashboard</span>
            </Link>
          </div>
        </div>
      </main>

      {/* Minimalist Footer */}
      <footer className="relative z-10 w-full max-w-6xl flex items-center justify-center border-t border-emerald-900/40 py-4 text-xs text-emerald-400/80 font-mono">
        <span>© 2026 CircleLoop OS</span>
      </footer>
    </div>
  );
};

export default SplashScreenPage;
