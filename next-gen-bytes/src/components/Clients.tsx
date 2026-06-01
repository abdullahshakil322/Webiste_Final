import React from 'react';
import { INDUSTRIES_DATA, WHY_CHOOSE_DATA, TESTIMONIALS_DATA } from '../data/itServices';
import { Building2, ShoppingBag, Hammer, GraduationCap, Database, Factory, Activity, Home, TrendingUp, Briefcase, Star, CheckCircle, Quote } from 'lucide-react';

export default function Clients() {

  const getIndustryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Building2':
        return <Building2 className="h-5 w-5 stroke-[2] text-sky-400" />;
      case 'ShoppingBag':
        return <ShoppingBag className="h-5 w-5 stroke-[2] text-sky-400" />;
      case 'Hammer':
        return <Hammer className="h-5 w-5 stroke-[2] text-sky-400" />;
      case 'GraduationCap':
        return <GraduationCap className="h-5 w-5 stroke-[2] text-sky-400" />;
      case 'Database':
        return <Database className="h-5 w-5 stroke-[2] text-sky-400" />;
      case 'Factory':
        return <Factory className="h-5 w-5 stroke-[2] text-sky-400" />;
      case 'Home':
        return <Home className="h-5 w-5 stroke-[2] text-sky-400" />;
      case 'TrendingUp':
        return <TrendingUp className="h-5 w-5 stroke-[2] text-sky-400" />;
      case 'Briefcase':
        return <Briefcase className="h-5 w-5 stroke-[2] text-sky-400" />;
      default:
        return <Activity className="h-5 w-5 stroke-[2] text-sky-400" />;
    }
  };

  return (
    <section id="clients" className="py-24 bg-slate-900 relative">
      <div className="absolute inset-0 bg-dots-pattern opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16" id="clients-heading">
          <div className="inline-flex items-center space-x-2 bg-sky-500/10 border border-sky-500/20 px-3 py-1 rounded-full mb-4">
            <span className="text-xs font-mono font-bold tracking-wider text-sky-400 uppercase">
              SECTORS & EXPERTISE
            </span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight uppercase">
            WHO WE SERVE & WHY CHOOSE US
          </h2>
          <div className="h-1.5 w-16 bg-sky-500 mx-auto mt-4 rounded-full" />
          <p className="mt-5 text-slate-300 text-lg font-light leading-relaxed">
            From temporary internet setups at dynamic construction sites to complex secure Active Directory structures for clinics.
          </p>
        </div>

        {/* Industries Served Section */}
        <div className="mb-24" id="industries-block">
          <h3 className="font-display font-extrabold text-lg sm:text-xl text-white text-center mb-8 uppercase tracking-wide">
            INDUSTRIES WE SERVE:
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4" id="industries-grid">
            {INDUSTRIES_DATA.map((ind, i) => (
              <div
                key={i}
                className="bg-slate-950 border border-slate-850 p-5 rounded-xl hover:border-sky-500/30 transition-all duration-200 shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="p-2 bg-slate-900 border border-slate-800 rounded-lg inline-block mb-3.5">
                    {getIndustryIcon(ind.icon)}
                  </div>
                  <h4 className="font-display font-bold text-sm sm:text-base text-white tracking-tight leading-tight">
                    {ind.name}
                  </h4>
                  <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                    {ind.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Why Choose Us & Reviews Split View */}
        <div className="grid lg:grid-cols-12 gap-12 items-start" id="why-and-testimonials-grid">
          
          {/* Why Choose Us Column (7 cols) */}
          <div className="lg:col-span-7 space-y-6" id="why-choose-col">
            <h3 className="font-display font-bold text-xl text-white uppercase tracking-tight">
              WHY CHOOSE NEXT GEN BYTES:
            </h3>
            
            <div className="grid sm:grid-cols-2 gap-4" id="why-choose-bullets">
              {WHY_CHOOSE_DATA.map((reason, idx) => (
                <div
                  key={idx}
                  className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-2 hover:border-slate-800 transition-colors"
                >
                  <div className="flex items-center space-x-2.5">
                    <CheckCircle className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                    <h4 className="font-display font-bold text-xs sm:text-sm text-slate-100 leading-tight">
                      {reason.title}
                    </h4>
                  </div>
                  <p className="text-slate-400 text-xs leading-relaxed pl-7">
                    {reason.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonials Column (5 cols) */}
          <div className="lg:col-span-5 space-y-6" id="testimonials-col">
            <h3 className="font-display font-bold text-xl text-white tracking-tight uppercase">
              CLIENT TESTIMONIALS:
            </h3>

            <div className="space-y-4" id="testimonials-list">
              {TESTIMONIALS_DATA.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-950 border border-slate-850 p-5 rounded-xl shadow-lg hover:border-slate-800 transition-all duration-200 relative"
                >
                  <Quote className="absolute top-4 right-4 h-8 w-8 text-slate-900 stroke-[1.5]" />
                  
                  {/* Rating stars */}
                  <div className="flex items-center space-x-1 mb-3">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                    ))}
                  </div>

                  <p className="text-slate-300 text-xs sm:text-sm italic leading-relaxed relative z-10 font-light">
                    "{item.review}"
                  </p>

                  <div className="mt-4 pt-3.5 border-t border-slate-900 flex justify-between items-center text-xs">
                    <div>
                      <p className="font-bold text-white">{item.name}</p>
                      <p className="text-[10px] text-slate-450 mt-0.5">{item.company}</p>
                    </div>
                    <span className="bg-slate-900 px-2.5 py-1 rounded text-[10px] font-mono text-slate-400 uppercase border border-slate-850">
                      {item.industry}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
