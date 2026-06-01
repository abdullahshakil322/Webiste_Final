import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AboutUs from './components/AboutUs';
import Services from './components/Services';
import Projects from './components/Projects';
import AMCSupport from './components/AMCSupport';
import Clients from './components/Clients';
import QuoteRequestForm from './components/QuoteRequestForm';
import ContactUs from './components/ContactUs';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import { Phone, Mail, MapPin, Shield, Check, Heart, Server } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedServiceForQuote, setSelectedServiceForQuote] = useState<string>('');
  const [viewState, setViewState] = useState<'public' | 'admin-login' | 'admin-dashboard'>(() => {
    const savedToken = localStorage.getItem('nextgen_admin_token');
    return savedToken ? 'admin-dashboard' : 'public';
  });

  const triggerQuoteSection = (serviceTitle: string = '') => {
    setSelectedServiceForQuote(serviceTitle);
    const element = document.getElementById('request-quote');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setActiveTab('contact'); // Highlight request category
  };

  const exploreServices = () => {
    const element = document.getElementById('services');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setActiveTab('services');
  };

  if (viewState === 'admin-login') {
    return (
      <AdminLogin
        onLoginSuccess={() => setViewState('admin-dashboard')}
        onBackToWebsite={() => setViewState('public')}
      />
    );
  }

  if (viewState === 'admin-dashboard') {
    return (
      <AdminDashboard
        onLogout={() => {
          localStorage.removeItem('nextgen_admin_token');
          localStorage.removeItem('nextgen_admin_email');
          setViewState('public');
        }}
      />
    );
  }

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 selection:bg-sky-500 selection:text-slate-950 font-sans" id="app-root-container">
      
      {/* Dynamic Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onRequestQuote={() => triggerQuoteSection('')}
        onEnterAdmin={() => {
          const hasToken = localStorage.getItem('nextgen_admin_token');
          setViewState(hasToken ? 'admin-dashboard' : 'admin-login');
        }}
      />

      {/* Main Sections Assembly */}
      <main id="app-main-content">
        
        {/* Hero Banner Section */}
        <Hero
          onExploreServices={exploreServices}
          onRequestQuote={() => triggerQuoteSection('')}
        />

        {/* Detailed About Us Section */}
        <AboutUs />

        {/* Detailed Services Catalog Grid */}
        <Services
          onSelectServiceForQuote={(title) => triggerQuoteSection(title)}
        />

        {/* Dynamic Project Portfolios Grid */}
        <Projects />

        {/* Annual Maintenance Contract Support Module */}
        <AMCSupport
          onQuoteTrigger={(title) => triggerQuoteSection(title)}
        />

        {/* Client Industries & Reviews Section */}
        <Clients />

        {/* Interactive Step Estimator Quote Section */}
        <QuoteRequestForm
          initialService={selectedServiceForQuote}
        />

        {/* Contact info grid & communication form */}
        <ContactUs />

      </main>

      {/* Footer Area */}
      <footer className="bg-slate-950 border-t border-slate-900 py-16 text-slate-450 relative" id="app-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-12 gap-12 text-left" id="footer-g">
            
            {/* Column 1: Logo & Slogan */}
            <div className="md:col-span-4 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-sky-500 rounded-lg text-slate-900">
                  <Server className="h-5 w-5 stroke-[2.5]" />
                </div>
                <span className="font-display font-extrabold text-xl tracking-tight text-white uppercase flex items-center">
                  Next Gen <span className="text-sky-400 font-mono text-sm leading-none bg-sky-950 px-1.5 py-0.5 rounded border border-sky-850 ml-0.5">Bytes</span>
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
                Next Gen Bytes provides client-first IT support, structured networking, physical IP security, Windows AD servers, and custom corporate SLA/AMC planning.
              </p>
              <div className="text-[10px] uppercase tracking-widest text-slate-600 font-mono">
                IT Solutions • Networking • CCTV • Security
              </div>
            </div>

            {/* Column 2: Navigation Links */}
            <div className="md:col-span-3 space-y-3.5">
              <h4 className="font-display font-extrabold text-xs text-white uppercase tracking-wider">
                Quick Navigation
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <a href="#home" className="hover:text-sky-400 transition-colors">Home</a>
                <a href="#about" className="hover:text-sky-400 transition-colors">About Us</a>
                <a href="#services" className="hover:text-sky-400 transition-colors">Services</a>
                <a href="#projects" className="hover:text-sky-400 transition-colors">Projects</a>
                <a href="#amc" className="hover:text-sky-400 transition-colors">AMC Support</a>
                <a href="#clients" className="hover:text-sky-400 transition-colors">Clients</a>
                <a href="#request-quote" className="hover:text-sky-400 transition-colors">Request Quote</a>
                <a href="#contact" className="hover:text-sky-400 transition-colors">Contact Us</a>
              </div>
            </div>

            {/* Column 3: Contacts Coordinate Summaries */}
            <div className="md:col-span-5 space-y-3.5">
              <h4 className="font-display font-extrabold text-xs text-white uppercase tracking-wider">
                Next Gen Bytes Contact Channels
              </h4>
              <div className="space-y-2.5 text-xs text-slate-350">
                <p className="flex items-center gap-2">
                  <span className="text-sky-400">📞</span> 
                  <span className="font-mono">0331-2558324 / 0333-5412666</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-sky-400">📧</span> 
                  <span className="font-mono break-all">abdullahshakil322@gmail.com</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-sky-400">🌐</span> 
                  <span className="font-mono">www.nextgenbytes.com.pk</span>
                </p>
                <p className="flex items-center gap-2 font-mono text-[10px] text-slate-500 uppercase">
                  <span>📍 Service Hub: Karachi, Sindh, Pakistan.</span>
                </p>
              </div>
            </div>

          </div>

          {/* Sub-footer bottom bar */}
          <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
            <p className="text-slate-500">
              © {new Date().getFullYear()} Next Gen Bytes IT & Security Solutions. All rights reserved. Registered trademark PK.
            </p>
            <div className="flex items-center space-x-2 text-slate-650">
              <span>Made with</span>
              <Heart className="h-3 w-3 text-red-500 fill-red-500" />
              <span>for secure enterprise scale.</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
