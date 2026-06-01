import React, { useState, useEffect } from 'react';
import { QuoteRequest } from '../types';
import { Check, Send, Sparkles, ClipboardCheck, Trash2, Calendar, Phone, Mail, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface QuoteRequestFormProps {
  initialService?: string;
  onClose?: () => void;
}

export default function QuoteRequestForm({ initialService, onClose }: QuoteRequestFormProps) {
  const [formData, setFormData] = useState<QuoteRequest>({
    fullName: '',
    companyName: '',
    phone: '',
    email: '',
    services: initialService ? [initialService] : [],
    scale: 'Small Office (1-16 nodes)',
    notes: '',
  });

  const [submitted, setSubmitted] = useState<boolean>(false);
  const [historicalQuotes, setHistoricalQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Load existing quotes submitted in this local browser session
  useEffect(() => {
    const saved = localStorage.getItem('nextgen_bytes_quotes');
    if (saved) {
      try {
        setHistoricalQuotes(JSON.parse(saved));
      } catch (e) {
        setHistoricalQuotes([]);
      }
    }
  }, []);

  // Update selected services array
  useEffect(() => {
    if (initialService) {
      setFormData((prev) => {
        if (!prev.services.includes(initialService)) {
          return { ...prev, services: [...prev.services, initialService] };
        }
        return prev;
      });
    }
  }, [initialService]);

  const serviceOptions = [
    'Windows Server Setup',
    'IT Infrastructure Consultation',
    'Internet Structure Design & Networking',
    'Computer & Equipment Supply',
    'CCTV Installation',
    'Data Backup & Security Solutions',
    'Corporate AMC Plan',
  ];

  const scaleOptions = [
    'Home / Shop / Residential Villa (1-8 nodes)',
    'Small Office / Clinic / Unit (8-24 nodes)',
    'Medium Building / School / Warehouse (24-64 nodes)',
    'Large Factory / Corporate Offices (64+ nodes)',
  ];

  const handleServiceToggle = (srv: string) => {
    setFormData((prev) => {
      const exists = prev.services.includes(srv);
      if (exists) {
        return { ...prev, services: prev.services.filter((s) => s !== srv) };
      } else {
        return { ...prev, services: [...prev.services, srv] };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.email) {
      alert('Please fill out your Name, Phone Number, and Email Address so we can reply!');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const selectedServicesStr = formData.services.length > 0 ? formData.services.join(', ') : 'IT Infrastructure Consultation';
      const compositeMessage = `Project/Installation Scale:\n${formData.scale}\n\nClient Requirements:\n${formData.notes || 'No specific layouts structured.'}`;

      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          companyName: formData.companyName,
          phone: formData.phone,
          email: formData.email,
          service: selectedServicesStr,
          message: compositeMessage
        })
      });

      if (!response.ok) {
        const errJson = await response.json();
        throw new Error(errJson.error || 'Failed to submit quote request.');
      }

      const resData = await response.json();
      const payload = {
        ...formData,
        id: resData.inquiry?.id || 'QT-' + Math.floor(Math.random() * 900000 + 100000),
        timestamp: resData.inquiry?.createdAt || new Date().toISOString(),
        status: 'Awaiting Expert Review',
      };

      const updated = [payload, ...historicalQuotes];
      setHistoricalQuotes(updated);
      localStorage.setItem('nextgen_bytes_quotes', JSON.stringify(updated));
      setSubmitted(true);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Network error: Failed to dispatch quote request.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuote = (id: string) => {
    const updated = historicalQuotes.filter((q) => q.id !== id);
    setHistoricalQuotes(updated);
    localStorage.setItem('nextgen_bytes_quotes', JSON.stringify(updated));
  };

  const handleReset = () => {
    setFormData({
      fullName: '',
      companyName: '',
      phone: '',
      email: '',
      services: [],
      scale: 'Small Office (1-16 nodes)',
      notes: '',
    });
    setSubmitted(false);
  };

  return (
    <div id="request-quote" className="py-24 bg-slate-950 relative scroll-mt-20">
      <div className="absolute inset-0 bg-dots-pattern opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16" id="quote-heading">
          <div className="inline-flex items-center space-x-2 bg-sky-500/10 border border-sky-500/20 px-3 py-1 rounded-full mb-4">
            <span className="text-xs font-mono font-bold tracking-wider text-sky-400 uppercase">
              FAST PRICING ESTIMATE
            </span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight uppercase">
            REQUEST A QUOTE
          </h2>
          <div className="h-1.5 w-16 bg-sky-500 mx-auto mt-4 rounded-full" />
          <p className="mt-5 text-slate-300 text-lg font-light leading-relaxed">
            Fill out our interactive form to calculate system complexity. Our IT engineers will review your specs and contact you with accurate pricing options.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-start" id="quote-forms-board">
          
          {/* Left Column: Form itself (7 cols) */}
          <div className="lg:col-span-12 xl:col-span-7" id="quote-form-left-col">
            <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-2xl shadow-xl">
              
              <AnimatePresence mode="wait">
                {!submitted ? (
                  <motion.form
                    key="quote-form-main"
                    onSubmit={handleSubmit}
                    className="space-y-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="grid sm:grid-cols-2 gap-6">
                      {/* Name */}
                      <div>
                        <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-350 mb-2">
                          Your Full Name <span className="text-sky-400">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          placeholder="e.g. Abdullah Shakil"
                          className="w-full bg-slate-950 border border-slate-850 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-600 outline-none transition-colors"
                        />
                      </div>

                      {/* Company Name */}
                      <div>
                        <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-350 mb-2">
                          Company / Organization
                        </label>
                        <input
                          type="text"
                          value={formData.companyName}
                          onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                          placeholder="e.g. NextGen Retail Outlet"
                          className="w-full bg-slate-950 border border-slate-850 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-600 outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                      {/* Phone */}
                      <div>
                        <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-350 mb-2">
                          Contact Phone Number <span className="text-sky-400">*</span>
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="e.g. 0331-2558324"
                          className="w-full bg-slate-950 border border-slate-850 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-600 outline-none transition-colors"
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-350 mb-2">
                          Email Address <span className="text-sky-400">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="e.g. abdullahshakil322@gmail.com"
                          className="w-full bg-slate-950 border border-slate-850 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-600 outline-none transition-colors"
                        />
                      </div>
                    </div>

                    {/* Services Selector Pills */}
                    <div>
                      <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-350 mb-2.5">
                        Select Requested Services <span className="text-[10px] text-slate-500 font-normal">(Select multiple if needed)</span>
                      </label>
                      <div className="grid sm:grid-cols-2 gap-2.5" id="quote-services-selection">
                        {serviceOptions.map((srv) => {
                          const isSelected = formData.services.includes(srv);
                          return (
                            <button
                              type="button"
                              key={srv}
                              id={`btn-quote-service-${srv.replace(/\s+/g, '-').toLowerCase()}`}
                              onClick={() => handleServiceToggle(srv)}
                              className={`text-left p-3.5 rounded-lg border text-xs sm:text-sm font-medium flex items-center justify-between cursor-pointer transition-colors ${
                                isSelected
                                  ? 'bg-sky-950/40 border-sky-500 text-white'
                                  : 'bg-slate-950 border-slate-850 hover:bg-slate-900 text-slate-450 hover:text-slate-300'
                              }`}
                            >
                              <span>{srv}</span>
                              <div
                                className={`w-4 h-4 rounded-full flex items-center justify-center border transition-all ${
                                  isSelected ? 'bg-sky-500 border-sky-400' : 'border-slate-800'
                                }`}
                              >
                                {isSelected && <Check className="h-3 w-3 text-slate-950 stroke-[3.5]" />}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Installation Scale Selector */}
                    <div>
                      <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-350 mb-2">
                        System Scale / Location Terminals Node Volume
                      </label>
                      <div className="relative">
                        <select
                          value={formData.scale}
                          onChange={(e) => setFormData({ ...formData, scale: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-850 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 rounded-lg px-4 py-3 text-sm text-white outline-none cursor-pointer appearance-none"
                        >
                          {scaleOptions.map((opt) => (
                            <option key={opt} value={opt} className="bg-slate-950 text-slate-300">
                              {opt}
                            </option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
                          ▼
                        </div>
                      </div>
                    </div>

                    {/* Custom Requirements Notes */}
                    <div>
                      <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-350 mb-2">
                        Outline Your Requirements or Specific Layout (Optional)
                      </label>
                      <textarea
                        rows={4}
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="Please tell us about your physical layout, cameras needed, or server backup size..."
                        className="w-full bg-slate-950 border border-slate-850 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-650 outline-none transition-colors resize-none"
                      />
                    </div>

                    {errorMsg && (
                      <div className="p-3.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-xs leading-relaxed" id="quote-err-msg">
                        ⚠️ {errorMsg}
                      </div>
                    )}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      id="btn-quote-submit"
                      disabled={loading}
                      className="w-full inline-flex items-center justify-center px-6 py-4 bg-sky-500 hover:bg-sky-400 disabled:bg-sky-500/50 disabled:cursor-not-allowed text-slate-950 font-bold rounded-lg transition-transform active:scale-95 cursor-pointer shadow-lg shadow-sky-500/10"
                    >
                      <Send className="mr-2.5 h-4.5 w-4.5 stroke-[2.5]" />
                      {loading ? "Registering Inquiry..." : "Calculate & Submit Quote Request"}
                    </button>
                  </motion.form>
                ) : (
                  <motion.div
                    key="quote-success"
                    className="text-center py-12 space-y-6"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="w-16 h-16 bg-emerald-500/15 border border-emerald-500/25 rounded-full flex items-center justify-center mx-auto text-emerald-400">
                      <ClipboardCheck className="h-8 w-8 stroke-[2.5]" />
                    </div>

                    <div className="space-y-3">
                      <h3 className="font-display font-extrabold text-2xl text-white">
                        Quote Submitted!
                      </h3>
                      <p className="text-slate-300 text-sm max-w-md mx-auto leading-relaxed">
                        Thank you for contacting Next Gen Bytes. Your inquiry has been registered locally and queued for review. Our engineers will reach out to you within 24 hours.
                      </p>
                    </div>

                    <div className="bg-slate-950 border border-slate-850 p-4.5 rounded-lg text-left max-w-sm mx-auto space-y-2">
                      <p className="text-xs text-slate-450 font-mono">ESTIMATION SUMMARY:</p>
                      <p className="text-xs text-slate-200">👤 User: {formData.fullName}</p>
                      <p className="text-xs text-slate-200">🛠️ Services: {formData.services.join(', ')}</p>
                      <p className="text-xs text-slate-200">⚙️ Project Structure: {formData.scale}</p>
                    </div>

                    <div className="flex justify-center gap-3">
                      <button
                        id="btn-quote-submit-another"
                        onClick={handleReset}
                        className="px-5 py-2.5 bg-slate-950 hover:bg-slate-905 border border-slate-800 text-slate-300 hover:text-white rounded-lg text-xs font-semibold cursor-pointer"
                      >
                        File Another Request
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </div>

          {/* Right Column: Local Submission History Logs (5 cols) */}
          <div className="lg:col-span-12 xl:col-span-5" id="quote-history-col">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl h-full space-y-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-850">
                  <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
                    <Sparkles className="h-4.5 w-4.5 text-sky-400" /> Active Web Inquiries
                  </h3>
                  <span className="bg-sky-500/10 text-sky-400 font-mono text-[10px] px-2 py-0.5 rounded border border-sky-850">
                    {historicalQuotes.length} REQUESTS
                  </span>
                </div>

                <AnimatePresence>
                  {historicalQuotes.length === 0 ? (
                    <div className="text-center py-16 space-y-2.5" id="history-empty">
                      <p className="text-sm font-semibold text-slate-450">No Submissions Logged Yet</p>
                      <p className="text-xs text-slate-500 max-w-xs mx-auto">
                        Inquire about server installation, CCTV monitoring network structures above to trigger interactive tracking logs.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1" id="history-items">
                      {historicalQuotes.map((q) => (
                        <div
                          key={q.id}
                          className="bg-slate-950 p-4 border border-slate-850 rounded-xl space-y-2 relative"
                        >
                          <button
                            id={`btn-delete-quote-${q.id}`}
                            onClick={() => handleDeleteQuote(q.id)}
                            className="absolute top-4 right-4 text-slate-600 hover:text-red-400 transition-colors cursor-pointer"
                            title="Remove log entry"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>

                          <div className="flex items-center space-x-1.5 font-mono text-[10px]">
                            <span className="text-sky-400 font-bold">{q.id}</span>
                            <span className="text-slate-650">•</span>
                            <span className="text-slate-450 uppercase flex items-center gap-0.5">
                              <Calendar className="h-3 w-3" /> {new Date(q.timestamp).toLocaleDateString()}
                            </span>
                          </div>

                          <h4 className="font-display font-bold text-sm text-white">
                            {q.fullName}
                          </h4>
                          <p className="text-[11px] text-slate-400 line-clamp-1">
                            🏢 {q.companyName || 'Private Residence'} • {q.scale}
                          </p>
                          <p className="text-xs text-sky-400/85">
                            ⚙️ Requested: {q.services.join(', ')}
                          </p>

                          <div className="pt-2 border-t border-slate-900 flex justify-between items-center text-[10px] font-mono">
                            <span className="bg-emerald-950 text-emerald-400 border border-emerald-900 px-2 py-0.5 rounded font-bold uppercase tracking-wider flex items-center gap-1">
                              <Clock className="h-3 w-3 inline" /> {q.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </AnimatePresence>
              </div>

              {/* Secure client guidelines */}
              <div className="pt-6 border-t border-slate-850 space-y-2 text-xs text-slate-400 font-sans leading-relaxed">
                <p><strong>🔒 Information Safety Assurance:</strong></p>
                <p>Your inputs are managed securely and processed via local memory. Active quote states will trigger immediate notifications to next-gen estimators.</p>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
