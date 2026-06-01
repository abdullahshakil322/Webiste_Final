import React, { useState } from 'react';
import { SERVICES_DATA } from '../data/itServices';
import { Server, LayoutGrid, Network, Cpu, Eye, Shield, CheckCircle2, ArrowUpRight, HelpCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface ServicesProps {
  onSelectServiceForQuote: (serviceTitle: string) => void;
}

export default function Services({ onSelectServiceForQuote }: ServicesProps) {
  const [selectedId, setSelectedId] = useState<string>('server-setup');

  // Map string icon key to Lucide components safely
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Server':
        return <Server className="h-6 w-6 stroke-[2]" />;
      case 'LayoutGrid':
        return <LayoutGrid className="h-6 w-6 stroke-[2]" />;
      case 'Network':
        return <Network className="h-6 w-6 stroke-[2]" />;
      case 'Cpu':
        return <Cpu className="h-6 w-6 stroke-[2]" />;
      case 'Eye':
        return <Eye className="h-6 w-6 stroke-[2]" />;
      case 'ShieldAlert':
        return <Shield className="h-6 w-6 stroke-[2]" />;
      default:
        return <HelpCircle className="h-6 w-6 stroke-[2]" />;
    }
  };

  const selectedService = SERVICES_DATA.find((s) => s.id === selectedId) || SERVICES_DATA[0];

  return (
    <section id="services" className="py-24 bg-slate-950 relative">
      <div className="absolute inset-0 bg-dots-pattern opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16" id="services-heading">
          <div className="inline-flex items-center space-x-2 bg-sky-500/10 border border-sky-500/20 px-3 py-1 rounded-full mb-4">
            <span className="text-xs font-mono font-bold tracking-wider text-sky-400 uppercase">
              PROFESSIONAL CAPABILITIES
            </span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight uppercase">
            OUR SERVICES
          </h2>
          <div className="h-1.5 w-16 bg-sky-500 mx-auto mt-4 rounded-full" />
          <p className="mt-5 text-slate-350 text-lg font-light leading-relaxed">
            We offer turnkey technical implementation: Active Directory setup, structured network grids, high-definition IP camera matrices, and emergency maintenance.
          </p>
        </div>

        {/* Dual Layout: Interactive service pills on left, detailed preview card on right (desktop-only) */}
        <div className="grid lg:grid-cols-12 gap-8 items-start" id="services-interactive-grid">
          {/* Services Selection Board */}
          <div className="lg:col-span-5 space-y-3.5" id="services-selector-cards">
            {SERVICES_DATA.map((service) => {
              const isActive = service.id === selectedId;
              return (
                <button
                  key={service.id}
                  id={`btn-service-select-${service.id}`}
                  onClick={() => setSelectedId(service.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer flex items-center justify-between ${
                    isActive
                      ? 'bg-slate-900 border-sky-500 shadow-lg shadow-sky-500/5 text-white'
                      : 'bg-slate-950 border-slate-900 hover:border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`p-2.5 rounded-lg transition-transform duration-200 ${
                        isActive ? 'bg-sky-500 text-slate-950 scale-105' : 'bg-slate-900 text-sky-400'
                      }`}
                    >
                      {getIcon(service.icon)}
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-sm sm:text-base leading-tight">
                        {service.title}
                      </h3>
                      <p className="text-xs text-slate-450 mt-0.5 line-clamp-1">{service.subtitle}</p>
                    </div>
                  </div>
                  <ArrowUpRight
                    className={`h-4.5 w-4.5 transition-transform ${
                      isActive ? 'text-sky-400 rotate-45 scale-110' : 'text-slate-600'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Service Detailed Preview Panel */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 lg:p-10 shadow-xl min-h-[480px] flex flex-col justify-between" id="services-details-pane">
            <div className="space-y-6">
              {/* Badge & Title */}
              <div className="flex items-center space-x-3.5">
                <div className="p-3.5 bg-sky-500/10 text-sky-400 rounded-xl" id="service-detail-icon">
                  {getIcon(selectedService.icon)}
                </div>
                <div>
                  <span className="text-xs font-mono text-sky-400 uppercase tracking-widest leading-none">
                    {selectedService.subtitle}
                  </span>
                  <h3 className="font-display font-extrabold text-xl sm:text-2xl text-white mt-1 leading-tight uppercase">
                    {selectedService.title}
                  </h3>
                </div>
              </div>

              {/* Description */}
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-light">
                {selectedService.description}
              </p>

              {/* Nested Bullets */}
              <div className="space-y-4 pt-2">
                <p className="text-xs font-mono text-slate-450 uppercase tracking-wider">
                  Technical Deliverables Included:
                </p>
                <div className="grid sm:grid-cols-2 gap-3.5" id="service-features-list">
                  {selectedService.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-start space-x-2.5 text-slate-200"
                    >
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm font-medium leading-tight">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick action triggers */}
            <div className="mt-8 pt-6 border-t border-slate-850 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="text-slate-400 text-xs font-sans">
                Planning an office or building installation? We configure everything custom.
              </div>
              <button
                id="btn-service-quote-direct"
                onClick={() => onSelectServiceForQuote(selectedService.title)}
                className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs sm:text-sm font-bold rounded-lg transition-colors cursor-pointer"
              >
                Inquire About {selectedService.title}
                <ArrowUpRight className="ml-1.5 h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
