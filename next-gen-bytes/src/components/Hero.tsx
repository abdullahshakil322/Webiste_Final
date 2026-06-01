import React from 'react';
import { ArrowRight, Shield, RefreshCw, Server, Wifi, Eye, Activity, Terminal } from 'lucide-react';
import { motion } from 'motion/react';

interface HeroProps {
  onExploreServices: () => void;
  onRequestQuote: () => void;
}

export default function Hero({ onExploreServices, onRequestQuote }: HeroProps) {
  return (
    <section
      id="home"
      className="relative min-h-screen pt-20 flex items-center justify-center bg-slate-950 overflow-hidden"
    >
      {/* Background Decorative Tech Grids */}
      <div className="absolute inset-0 bg-dots-pattern opacity-40 mix-blend-color-dodge pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 -translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-y-1/2 translate-x-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Hero Outer Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10 w-full">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Text Column */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left" id="hero-text-container">
            <motion.div
              id="hero-badge-container"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center space-x-2 bg-sky-500/10 border border-sky-500/20 px-3.5 py-1.5 rounded-full"
            >
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
              </span>
              <span className="text-xs font-mono font-semibold tracking-wider text-sky-400 uppercase">
                COMPLETE IT & SECURITY INFRASTRUCTURE
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-4"
            >
              <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-white leading-tight tracking-tight">
                Reliable <span className="text-sky-400">IT Support</span> &{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">
                  Security Solutions
                </span>{' '}
                for Homes & Businesses
              </h1>
              <p className="text-slate-350 text-base sm:text-lg lg:text-xl max-w-2xl mx-auto lg:mx-0 font-sans font-light leading-relaxed">
                At <strong className="font-medium text-white">Next Gen Bytes</strong>, we design, install, maintain, and secure top-tier technology systems including structured networking, Windows servers, surveillance setups, and routine hardware supply.
              </p>
            </motion.div>

            {/* Sub-tag pillbox */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-wrap justify-center lg:justify-start gap-2.5"
            >
              <span className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <Server className="h-3.5 w-3.5 text-sky-400" /> Windows Server
              </span>
              <span className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <Wifi className="h-3.5 w-3.5 text-sky-400" /> Web & Networking
              </span>
              <span className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <Eye className="h-3.5 w-3.5 text-sky-400" /> CCTV surveillance
              </span>
              <span className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-sky-400" /> Data Protection
              </span>
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row justify-center lg:justify-start items-center gap-4 pt-2"
              id="hero-ctas"
            >
              <button
                id="btn-hero-quote"
                onClick={onRequestQuote}
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-lg transition-all active:scale-95 cursor-pointer shadow-lg shadow-sky-500/10"
              >
                Get a Free Quote
                <ArrowRight className="ml-2 h-5 w-5 stroke-[2.5]" />
              </button>
              <button
                id="btn-hero-explore"
                onClick={onExploreServices}
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 bg-slate-900 hover:bg-slate-850 text-white font-semibold rounded-lg border border-slate-800 hover:border-slate-750 transition-colors cursor-pointer"
              >
                Our Services
              </button>
            </motion.div>

            {/* Quick trust metrics */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="border-t border-slate-900 pt-6 grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0 text-left"
              id="hero-metrics"
            >
              <div>
                <p className="text-2xl font-display font-bold text-white leading-none">24/7</p>
                <p className="text-xs text-slate-450 mt-1 uppercase tracking-wider">Support Readiness</p>
              </div>
              <div className="border-l border-slate-900 pl-4">
                <p className="text-2xl font-display font-bold text-sky-400 leading-none">100%</p>
                <p className="text-xs text-slate-450 mt-1 uppercase tracking-wider">Reliability SLA</p>
              </div>
              <div className="border-l border-slate-900 pl-4">
                <p className="text-2xl font-display font-bold text-white leading-none">AMC</p>
                <p className="text-xs text-slate-450 mt-1 uppercase tracking-wider">Support Plans</p>
              </div>
            </motion.div>
          </div>

          {/* Interactive Graphic Column */}
          <div className="lg:col-span-5 relative" id="hero-graphic-container">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="w-full relative mx-auto max-w-sm lg:max-w-none"
            >
              {/* Main "Server Hub Dashboard" card Mockup */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl relative">
                {/* Header controls bar */}
                <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center space-x-1.5">
                    <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block" />
                  </div>
                  <div className="text-[10px] font-mono text-slate-450 bg-slate-900 px-3 py-1 rounded border border-slate-800/40 select-none">
                    TERMINAL :: NEXT-GEN-BYTES
                  </div>
                  <Terminal className="h-3.5 w-3.5 text-slate-500" />
                </div>

                {/* Console contents */}
                <div className="p-5 space-y-4 font-mono text-xs text-slate-300">
                  {/* Console Line */}
                  <div className="flex items-center justify-between border-b border-slate-850 pb-2.5">
                    <div className="flex items-center space-x-2">
                      <Server className="h-4 w-4 text-sky-400" />
                      <span className="text-slate-400 font-medium">Windows Server Core:</span>
                    </div>
                    <span className="bg-emerald-950 text-emerald-400 border border-emerald-900 px-2 py-0.5 rounded text-[10px] font-bold">
                      ACTIVE AD
                    </span>
                  </div>

                  {/* Network node */}
                  <div className="flex items-center justify-between border-b border-slate-850 pb-2.5">
                    <div className="flex items-center space-x-2">
                      <Wifi className="h-4 w-4 text-sky-400" />
                      <span className="text-slate-400 font-medium">Core Router / LAN Hub:</span>
                    </div>
                    <span className="bg-sky-950 text-sky-400 border border-sky-900 px-2 py-0.5 rounded text-[10px] uppercase font-bold">
                      Gigabit Online
                    </span>
                  </div>

                  {/* CCTV Monitor */}
                  <div className="flex items-center justify-between border-b border-slate-850 pb-2.5">
                    <div className="flex items-center space-x-2">
                      <Eye className="h-4 w-4 text-sky-400" />
                      <span className="text-slate-400 font-medium">CCTV NVR System:</span>
                    </div>
                    <span className="bg-emerald-950 text-emerald-400 border border-emerald-900 px-2 py-0.5 rounded text-[10px] uppercase font-bold text-right flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" /> 32/32 REC
                    </span>
                  </div>

                  {/* Encryption / Security check */}
                  <div className="flex items-center justify-between pb-1">
                    <div className="flex items-center space-x-2">
                      <Shield className="h-4 w-4 text-sky-400" />
                      <span className="text-slate-400 font-medium">NAS & Cloud Backup Status:</span>
                    </div>
                    <span className="text-slate-450 text-[10px]">100% SECURE</span>
                  </div>

                  {/* Visualization of data throughput / Sine Wave */}
                  <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-850 relative overflow-hidden">
                    <div className="flex justify-between items-center text-[10px] text-slate-450 mb-2">
                      <span>DATAPATH ROUTING SLA</span>
                      <Activity className="h-3 w-3 text-sky-400 animate-pulse" />
                    </div>
                    <div className="flex items-end justify-between h-14 pt-1 space-x-0.5">
                      <div className="w-full bg-slate-800 h-8 rounded-sm hover:bg-sky-500 transition-colors" />
                      <div className="w-full bg-slate-850 h-10 rounded-sm hover:bg-sky-500 transition-colors" />
                      <div className="w-full bg-slate-800 h-6 rounded-sm hover:bg-sky-500 transition-colors" />
                      <div className="w-full bg-sky-950/60 h-12 rounded-sm border-t border-sky-500" />
                      <div className="w-full bg-sky-950/65 h-16 rounded-sm border-t border-sky-500 animate-pulse" />
                      <div className="w-full bg-slate-850 h-9 rounded-sm hover:bg-sky-500 transition-colors" />
                      <div className="w-full bg-slate-800 h-11 rounded-sm hover:bg-sky-500 transition-colors" />
                      <div className="w-full bg-slate-800 h-5 rounded-sm hover:bg-sky-500 transition-colors" />
                      <div className="w-full bg-sky-950/60 h-13 rounded-sm border-t border-sky-500" />
                      <div className="w-full bg-sky-950/65 h-14 rounded-sm border-t border-sky-500" />
                    </div>
                    <div className="flex justify-between mt-2 text-[9px] text-slate-500">
                      <span>0331-2558324</span>
                      <span>0333-5412666</span>
                    </div>
                  </div>

                  {/* Interactive mock terminal status lines */}
                  <div className="bg-slate-950 text-[11px] font-mono p-3.5 rounded-lg border border-slate-850 text-slate-400 space-y-1">
                    <p className="text-sky-400 font-bold">$ nextgen --status</p>
                    <p className="text-slate-400">&gt; Windows Domain AD config verified [OK]</p>
                    <p className="text-slate-400">&gt; Gigabit structured optical connection: STABLE</p>
                    <p className="text-slate-400">&gt; 24h backup snapshot timestamp sync [SUCCESS]</p>
                  </div>
                </div>
              </div>

              {/* Floating secondary decorative card */}
              <div className="absolute -bottom-6 -left-6 bg-slate-900 border border-slate-850 p-4 rounded-xl shadow-xl hidden sm:flex items-center space-x-3 max-w-[200px]">
                <div className="p-2.5 bg-emerald-950 text-emerald-400 rounded-lg">
                  <RefreshCw className="h-5 w-5 animate-spin" style={{ animationDuration: '6s' }} />
                </div>
                <div>
                  <p className="text-xs font-mono text-slate-400">AMC Maintenance</p>
                  <p className="text-sm font-display font-extrabold text-white">ACTIVE SLA</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
