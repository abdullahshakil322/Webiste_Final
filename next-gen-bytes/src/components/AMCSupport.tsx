import React from 'react';
import { AMC_FEATURES } from '../data/itServices';
import { CalendarDays, Wrench, Network, Eye, Server, Activity, RefreshCw, AlertTriangle, FileText, ArrowRight, ShieldAlert } from 'lucide-react';

interface AMCSupportProps {
  onQuoteTrigger: (serviceKey: string) => void;
}

export default function AMCSupport({ onQuoteTrigger }: AMCSupportProps) {
  
  const getFeatureIcon = (iconName: string) => {
    switch (iconName) {
      case 'CalendarDays':
        return <CalendarDays className="h-6 w-6 stroke-[2]" />;
      case 'Wrench':
        return <Wrench className="h-6 w-6 stroke-[2]" />;
      case 'Network':
        return <Network className="h-6 w-6 stroke-[2]" />;
      case 'Eye':
        return <Eye className="h-6 w-6 stroke-[2]" />;
      case 'Server':
        return <Server className="h-6 w-6 stroke-[2]" />;
      case 'Activity':
        return <Activity className="h-6 w-6 stroke-[2]" />;
      case 'RefreshCw':
        return <RefreshCw className="h-6 w-6 stroke-[2]" />;
      default:
        return <AlertTriangle className="h-6 w-6 stroke-[2]" />;
    }
  };

  return (
    <section id="amc" className="py-24 bg-slate-950 relative border-t border-b border-slate-850">
      <div className="absolute inset-0 bg-dots-pattern opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16" id="amc-heading">
          <div className="inline-flex items-center space-x-2 bg-sky-500/10 border border-sky-500/20 px-3 py-1 rounded-full mb-4">
            <span className="text-xs font-mono font-bold tracking-wider text-sky-400 uppercase">
              REDUCE DOWNTIME
            </span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight uppercase">
            ANNUAL MAINTENANCE CONTRACT (AMC)
          </h2>
          <div className="h-1.5 w-16 bg-sky-500 mx-auto mt-4 rounded-full" />
          <p className="mt-5 text-slate-300 text-lg font-light leading-relaxed">
            Protect your business from technology outages. We provide fully managed AMC & Maintenance Services for companies, offices, buildings, and school systems.
          </p>
        </div>

        {/* Highlight Banner / SLA Details */}
        <div className="bg-slate-905 border border-slate-800 rounded-2xl p-6 sm:p-8 mb-12 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-xl" id="amc-banner">
          <div className="space-y-4 max-w-2xl text-left" id="amc-banner-text">
            <div className="inline-flex items-center bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 text-[11px] font-mono uppercase font-semibold rounded px-2.5 py-1">
              PROACTIVE BUSINESS SAFETY COV
            </div>
            <h3 className="font-display font-extrabold text-xl text-white">
              Why Your Enterprise Needs Next Gen Bytes AMC:
            </h3>
            <p className="text-slate-350 text-sm font-light leading-relaxed">
              Hardware fails and networks slow down without routine cleaning or diagnostic tests. Our corporate AMC guarantees monthly health inspects, cable diagnostics, and emergency support slots, ensuring your cameras run, domain controllers synchronize, and file servers stay secure.
            </p>
          </div>
          <button
            id="btn-amc-inquire"
            onClick={() => onQuoteTrigger('Corporate AMC Plan')}
            className="w-full lg:w-auto inline-flex items-center justify-center px-6 lg:px-8 py-4 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-xl transition-all cursor-pointer shadow-lg shadow-sky-500/5 hover:shadow-sky-500/15 shrink-0"
          >
            Setup AMC Contract
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </div>

        {/* Key Features Board */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6" id="amc-features-grid">
          {AMC_FEATURES.map((feature, i) => (
            <div
              key={i}
              className="bg-slate-900 border border-slate-850 p-6 rounded-xl hover:border-slate-800 transition-all duration-200 shadow-lg flex flex-col justify-between h-56"
            >
              <div className="space-y-4">
                <div className="p-2.5 bg-sky-500/10 text-sky-400 rounded-lg inline-block">
                  {getFeatureIcon(feature.icon)}
                </div>
                <h4 className="font-display font-semibold text-sm sm:text-base text-white tracking-tight uppercase">
                  {feature.title}
                </h4>
                <p className="text-slate-350 text-xs sm:text-sm font-light leading-relaxed line-clamp-3">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* SLA Disclaimer */}
        <div className="mt-12 bg-slate-900/40 rounded-xl p-4.5 border border-slate-850 flex items-center space-x-3 max-w-2xl mx-auto">
          <ShieldAlert className="h-5 w-5 text-sky-400 shrink-0" />
          <p className="text-xs text-slate-400 font-sans leading-relaxed">
            <strong>SLA Commitment:</strong> Emergency support requests are queued with top priority, ensuring an onsite tech deployment inside of 2 to 4 business hours within Karachi.
          </p>
        </div>

      </div>
    </section>
  );
}
