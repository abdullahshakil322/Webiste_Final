import React, { useState } from 'react';
import { PORTFOLIO_PROJECTS } from '../data/itServices';
import { ShieldCheck, HardDrive, Network, Eye, Wrench, ChevronDown, Check, LayoutGrid, Calendar } from 'lucide-react';

export default function Projects() {
  const [filter, setFilter] = useState<string>('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filterOptions = ['All', 'Windows Server Setup', 'Networking', 'CCTV Installation', 'AMC Support'];

  const filteredProjects = PORTFOLIO_PROJECTS.filter((proj) => {
    if (filter === 'All') return true;
    return proj.category === filter;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Windows Server Setup':
        return <HardDrive className="h-5 w-5 text-sky-400" />;
      case 'Networking':
        return <Network className="h-5 w-5 text-sky-450" />;
      case 'CCTV Installation':
        return <Eye className="h-5 w-5 text-sky-400" />;
      case 'AMC Support':
        return <Wrench className="h-5 w-5 text-sky-400" />;
      default:
        return <LayoutGrid className="h-5 w-5 text-sky-400" />;
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section id="projects" className="py-24 bg-slate-900 relative">
      <div className="absolute inset-0 bg-dots-pattern opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16" id="projects-heading">
          <div className="inline-flex items-center space-x-2 bg-sky-500/10 border border-sky-500/20 px-3 py-1 rounded-full mb-4">
            <span className="text-xs font-mono font-bold tracking-wider text-sky-400 uppercase">
              OUR FOOTPRINT
            </span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight uppercase">
            RECENT PROJECTS
          </h2>
          <div className="h-1.5 w-16 bg-sky-500 mx-auto mt-4 rounded-full" />
          <p className="mt-5 text-slate-350 text-lg font-light leading-relaxed">
            See how Next Gen Bytes designs, secures, and maintains robust computer architectures for corporate clients, builders, and warehousing sites.
          </p>
        </div>

        {/* Filter Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-10" id="projects-filters">
          {filterOptions.map((opt) => (
            <button
              key={opt}
              id={`btn-project-filter-${opt.replace(/\s+/g, '-').toLowerCase()}`}
              onClick={() => {
                setFilter(opt);
                setExpandedId(null);
              }}
              className={`px-4.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                filter === opt
                  ? 'bg-sky-500 text-slate-950 shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-850 hover:bg-slate-900'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>

        {/* Projects Cards Grid */}
        <div className="grid md:grid-cols-2 gap-8" id="projects-cards-grid">
          {filteredProjects.map((project) => {
            const isExpanded = expandedId === project.id;
            return (
              <div
                key={project.id}
                className="bg-slate-950 border border-slate-850 hover:border-slate-800 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                {/* Header & Meta */}
                <div className="p-6 pb-4">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex items-center space-x-2.5">
                      <div className="p-2 bg-slate-900 border border-slate-800 rounded-lg">
                        {getCategoryIcon(project.category)}
                      </div>
                      <span className="text-xs font-mono rgb-text-sky-400 text-sky-400 font-bold uppercase tracking-wider">
                        {project.category}
                      </span>
                    </div>

                    <span
                      className={`text-[10px] font-mono leading-none tracking-wider px-2 py-1 rounded inline-block uppercase font-bold border ${
                        project.badge === 'Completed'
                          ? 'bg-emerald-950 text-emerald-400 border-emerald-900/60'
                          : 'bg-indigo-950 text-indigo-400 border-indigo-900/60'
                      }`}
                    >
                      {project.badge}
                    </span>
                  </div>

                  <h3 className="font-display font-extrabold text-base sm:text-lg text-white mt-4 tracking-tight leading-snug">
                    {project.title}
                  </h3>
                  <p className="text-slate-450 text-xs mt-1.5 flex items-center gap-1.5 font-mono">
                    <span>🏢 Client: {project.client}</span>
                    <span className="text-slate-650">•</span>
                    <span>📍 {project.location}</span>
                  </p>

                  <p className="mt-4 text-slate-300 text-sm leading-relaxed font-light">
                    {project.description}
                  </p>
                </div>

                {/* Scope & Details section */}
                <div className="px-6 pb-6 pt-2">
                  <button
                    id={`btn-project-expand-${project.id}`}
                    onClick={() => toggleExpand(project.id)}
                    className="w-full flex items-center justify-between text-left text-xs font-mono font-bold uppercase tracking-widest text-sky-400 hover:text-sky-300 transition-colors cursor-pointer py-2 border-t border-slate-900 mt-2"
                  >
                    <span>{isExpanded ? 'Hide Technical Scope' : 'Reveal Technical Scope'}</span>
                    <ChevronDown className={`h-4 w-4 transition-transform duration-250 ${isExpanded ? 'rotate-180' : ''}`} />
                  </button>

                  {isExpanded && (
                    <div className="mt-4 space-y-2.5 pt-2 animate-fade-in" id={`expanded-scope-${project.id}`}>
                      {project.scope.map((item, idx) => (
                        <div key={idx} className="flex items-start space-x-2 text-slate-300 text-xs.5">
                          <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span className="font-sans leading-tight">{item}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
