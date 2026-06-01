import React from 'react';
import { Target, Cpu, HardDrive, Check, Phone, ShieldCheck, HelpCircle } from 'lucide-react';
import { motion } from 'motion/react';

export default function AboutUs() {
  const specialties = [
    'Computer hardware installation',
    'Software installation & troubleshooting',
    'CCTV camera installation',
    'IP camera setup',
    'Networking & structured cabling',
    'Server setup',
    'IT consultancy',
    'Data backup & security'
  ];

  return (
    <section id="about" className="py-24 bg-slate-900 border-t border-b border-slate-850 relative">
      <div className="absolute inset-0 bg-dots-pattern opacity-10 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16" id="about-heading">
          <div className="inline-flex items-center space-x-2 bg-sky-500/10 border border-sky-500/20 px-3 py-1 rounded-full mb-4">
            <span className="text-xs font-mono font-bold tracking-wider text-sky-400 uppercase">
              ABOUT OUR COMPANY
            </span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight uppercase">
            WHO WE ARE
          </h2>
          <div className="h-1.5 w-16 bg-sky-500 mx-auto mt-4 rounded-full" />
          <p className="mt-5 text-slate-300 text-lg font-light leading-relaxed">
            Next Gen Bytes is an IT services company focused on delivering professional, secure, and affordable technology solutions for small, medium, and large environments.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-start" id="about-content">
          {/* Left Column: Story & Mission */}
          <div className="space-y-8" id="about-story-col">
            <div className="bg-slate-950 p-6 sm:p-8 rounded-xl border border-slate-800 shadow-xl space-y-6">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-sky-500/10 text-sky-400 rounded-lg">
                  <Target className="h-6 w-6 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-white">Our Mission</h3>
                  <p className="mt-2 text-slate-300 leading-relaxed font-sans text-sm sm:text-base">
                    Our mission is to help businesses, schools, shops, and homes run smoothly with secure, reliable, and efficient IT systems. We remove the headache of modern technology by planning and maintaining seamless networks, reliable servers, and robust safety cameras.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-950 p-6 sm:p-8 rounded-xl border border-slate-800 shadow-xl space-y-6">
              <h3 className="font-display font-semibold text-lg text-white flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-sky-400" /> Complete IT Peace of Mind
              </h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                We believe in architectural layout clarity. No loose wires, no unexplained routing, and no security shortcuts. We configure proper active directories, install firewalls, lay neat structured cabling, and set up remote secure views.
              </p>
              
              {/* Quick Contact Info Badge */}
              <div className="pt-4 border-t border-slate-850 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="text-xs text-slate-450 uppercase font-mono">Immediate Consultancy</p>
                  <p className="text-sm font-bold text-white mt-0.5">Tell us about your office structure</p>
                </div>
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center px-4 py-2 bg-slate-900 border border-slate-800 hover:border-slate-750 text-sky-400 hover:text-white rounded-lg text-sm font-medium transition-colors cursor-pointer"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  0331-2558324
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Specialties list */}
          <div className="space-y-6" id="about-specialties-col">
            <h3 className="font-display font-bold text-xl text-white tracking-tight uppercase">
              WE SPECIALIZE IN:
            </h3>
            
            <div className="grid sm:grid-cols-2 gap-4">
              {specialties.map((spec, i) => (
                <div
                  key={i}
                  className="p-4 bg-slate-950 border border-slate-850 rounded-xl flex items-start space-x-3 hover:border-sky-500/30 transition-all duration-200 shadow-lg"
                >
                  <div className="p-1.5 bg-sky-500/20 text-sky-400 rounded-md mt-0.5">
                    <Check className="h-4 w-4 stroke-[3]" />
                  </div>
                  <span className="text-slate-200 text-sm font-medium leading-tight">
                    {spec}
                  </span>
                </div>
              ))}
            </div>

            {/* Quick trust metrics banner */}
            <div className="bg-gradient-to-r from-sky-950/40 to-slate-950 border border-sky-900/40 p-5 rounded-xl flex items-center space-x-4">
              <div className="p-3 bg-sky-500/10 text-sky-400 rounded-lg shrink-0">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Full-System Integration</h4>
                <p className="text-xs text-slate-350 mt-1">
                  We maintain, test, and audit all networking components to ensure total standard adherence.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
