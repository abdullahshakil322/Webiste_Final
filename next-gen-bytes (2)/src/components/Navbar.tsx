import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, Server } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onRequestQuote: () => void;
  onEnterAdmin: () => void;
}

export default function Navbar({ activeTab, setActiveTab, onRequestQuote, onEnterAdmin }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'services', label: 'Services' },
    { id: 'projects', label: 'Projects' },
    { id: 'amc', label: 'AMC Support' },
    { id: 'clients', label: 'Clients' },
    { id: 'contact', label: 'Contact Us' },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setIsOpen(false);
    // Smooth scroll to view
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 50);
  };

  return (
    <header
      id="app-header"
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-slate-900/90 backdrop-blur-md shadow-lg border-b border-slate-800'
          : 'bg-slate-950/60 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center space-x-3 cursor-pointer group"
            id="nav-logo"
          >
            <div className="p-2.5 bg-sky-500 rounded-lg text-slate-900 transition-all duration-300 group-hover:bg-sky-400 group-hover:scale-105">
              <Server className="h-6 w-6 stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-xl tracking-tight text-white group-hover:text-sky-400 transition-colors uppercase">
                Next Gen <span className="text-sky-400 font-mono text-sm leading-none bg-sky-950/80 px-1.5 py-0.5 rounded border border-sky-800/60 ml-0.5 group-hover:bg-sky-900">Bytes</span>
              </span>
              <span className="text-[10px] uppercase tracking-widest text-slate-400 font-mono mt-0.5 leading-none">
                IT & Security Infrastructure
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1" id="nav-desktop">
            {navItems.map((item) => (
              <button
                key={item.id}
                id={`btn-nav-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-250 cursor-pointer ${
                  activeTab === item.id
                    ? 'text-sky-400 bg-slate-900 border-b-2 border-sky-500 rounded-none'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* CTA & Quote */}
          <div className="hidden lg:flex items-center space-x-3.5" id="nav-cta">
            <button
              id="btn-nav-admin"
              onClick={onEnterAdmin}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-750 text-slate-300 hover:text-white text-xs font-mono font-semibold rounded-lg transition-colors cursor-pointer"
            >
              🔐 Admin Console
            </button>
            <button
              id="btn-nav-quote"
              onClick={onRequestQuote}
              className="inline-flex items-center px-4.5 py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 text-sm font-semibold rounded-lg transition-transform active:scale-95 cursor-pointer shadow-md shadow-sky-500/10 hover:shadow-sky-500/25"
            >
              Request a Quote
              <ArrowRight className="ml-2 h-4 w-4 stroke-[2.5]" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center" id="nav-mobile-trigger">
            <button
              id="btn-mobile-menu"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-slate-450 hover:text-white hover:bg-slate-800 focus:outline-none cursor-pointer"
            >
              {isOpen ? <X className="h-6 w-6 text-white" /> : <Menu className="h-6 w-6 text-slate-300" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-drawer"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-slate-900 border-b border-slate-800"
          >
            <div className="px-2 pt-2 pb-6 space-y-1.5 sm:px-3">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  id={`btn-mobile-nav-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`block w-full text-left px-4 py-3 rounded-md text-base font-medium transition-colors cursor-pointer ${
                    activeTab === item.id
                      ? 'text-sky-400 bg-slate-950 font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <div className="pt-4 px-4 space-y-2.5">
                <button
                  id="btn-mobile-admin"
                  onClick={() => {
                    setIsOpen(false);
                    onEnterAdmin();
                  }}
                  className="w-full inline-flex items-center justify-center px-5 py-3 bg-slate-950 border border-slate-850 hover:bg-slate-900 hover:border-slate-800 text-slate-300 font-mono text-sm font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  🔐 Administrator Portal
                </button>
                <button
                  id="btn-mobile-quote"
                  onClick={() => {
                    setIsOpen(false);
                    onRequestQuote();
                  }}
                  className="w-full inline-flex items-center justify-center px-5 py-3 bg-sky-500 hover:bg-sky-400 text-slate-950 text-base font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Request a Quote
                  <ArrowRight className="ml-2 h-5 w-5 stroke-[2.5]" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
