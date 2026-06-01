import React, { useState } from 'react';
import { Phone, Mail, Globe, MapPin, Send, Clock, Check, HeartHandshake, ShieldAlert } from 'lucide-react';
import { motion } from 'motion/react';

export default function ContactUs() {
  const [msgData, setMsgData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });

  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!msgData.name || !msgData.email || !msgData.message) {
      alert('Please fill out all fields before sending!');
      return;
    }
    
    setLoading(true);
    setErrorMsg('');
    
    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fullName: msgData.name,
          email: msgData.email,
          service: msgData.subject,
          message: msgData.message,
          companyName: '',
          phone: '',
        })
      });

      if (!response.ok) {
        const errJson = await response.json();
        throw new Error(errJson.error || 'Failed to dispatch secure message.');
      }

      setSent(true);
      setMsgData({ name: '', email: '', subject: 'General Inquiry', message: '' });
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Network error: Failed to connect to server backend.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-slate-900 border-t border-slate-850 relative scroll-mt-20">
      <div className="absolute inset-0 bg-dots-pattern opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16" id="contact-heading">
          <div className="inline-flex items-center space-x-2 bg-sky-500/10 border border-sky-500/20 px-3 py-1 rounded-full mb-4">
            <span className="text-xs font-mono font-bold tracking-wider text-sky-400 uppercase">
              REACH OUR TEAM
            </span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight uppercase">
            CONTACT US
          </h2>
          <div className="h-1.5 w-16 bg-sky-500 mx-auto mt-4 rounded-full" />
          <p className="mt-5 text-slate-300 text-lg font-light leading-relaxed">
            Have questions about Wi-Fi cabling, IP security cameras, Active Directory setups, or our Monthly AMC plans? Get in touch today.
          </p>
        </div>

        {/* Content Split: Coordinates on Left, Contact/Message box on Right */}
        <div className="grid lg:grid-cols-12 gap-12 items-start" id="contact-split-grid">
          
          {/* Coordinates (5 columns) */}
          <div className="lg:col-span-5 space-y-6" id="contact-coordinates">
            
            <h3 className="font-display font-bold text-xl text-white uppercase tracking-tight">
              DIRECT CHANNELS:
            </h3>

            {/* Phone Card */}
            <div className="bg-slate-950 p-6 rounded-xl border border-slate-850 space-y-4 hover:border-slate-800 transition-all duration-200">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-sky-500/10 text-sky-400 rounded-lg">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white font-display uppercase tracking-wider">
                    CALL OR WHATSAPP
                  </h4>
                  <p className="text-xs text-slate-450 font-mono mt-0.5">Quick support lines</p>
                </div>
              </div>
              <div className="space-y-2 pt-2 border-t border-slate-900 font-mono">
                <a
                  href="tel:03312558324"
                  className="block text-slate-200 hover:text-sky-400 transition-colors font-semibold text-sm sm:text-base flex items-center justify-between"
                  id="link-phone-primary"
                >
                  <span>📞 0331-2558324</span>
                  <span className="text-[10px] bg-slate-900 border border-slate-850 text-slate-450 px-2 py-0.5 rounded font-bold uppercase">Primary</span>
                </a>
                <a
                  href="tel:03335412666"
                  className="block text-slate-200 hover:text-sky-400 transition-colors font-semibold text-sm sm:text-base flex items-center justify-between"
                  id="link-phone-secondary"
                >
                  <span>📞 0333-5412666</span>
                  <span className="text-[10px] bg-slate-900 border border-slate-850 text-slate-450 px-2 py-0.5 rounded font-bold uppercase">Hotline</span>
                </a>
              </div>
            </div>

            {/* Email Card */}
            <div className="bg-slate-950 p-6 rounded-xl border border-slate-850 space-y-4 hover:border-slate-800 transition-all duration-200">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-sky-500/10 text-sky-400 rounded-lg">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white font-display uppercase tracking-wider">
                    EMAIL INQUIRIES
                  </h4>
                  <p className="text-xs text-slate-450 font-mono mt-0.5">For formal client RFPs</p>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-900 font-mono">
                <a
                  href="mailto:abdullahshakil322@gmail.com"
                  className="text-slate-200 hover:text-sky-400 transition-colors font-semibold text-xs sm:text-sm break-all flex items-center justify-between"
                  id="link-email"
                >
                  <span>📧 abdullahshakil322@gmail.com</span>
                </a>
              </div>
            </div>

            {/* Web Card */}
            <div className="bg-slate-950 p-6 rounded-xl border border-slate-850 space-y-4 hover:border-slate-800 transition-all duration-200">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-sky-500/10 text-sky-400 rounded-lg">
                  <Globe className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white font-display uppercase tracking-wider">
                    OFFICIAL WEBSITE
                  </h4>
                  <p className="text-xs text-slate-450 font-mono mt-0.5">Online domain register</p>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-900 font-mono">
                <a
                  href="http://www.nextgenbytes.com.pk"
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-200 hover:text-sky-400 transition-colors font-semibold text-sm flex items-center justify-between"
                  id="link-website"
                >
                  <span>🌐 www.nextgenbytes.com.pk</span>
                </a>
              </div>
            </div>

            {/* Operational hours */}
            <div className="p-4 bg-slate-950/50 rounded-lg border border-slate-850/60 flex items-center space-x-3.5">
              <Clock className="h-5 w-5 text-sky-450 shrink-0" />
              <div className="text-xs text-slate-400 font-sans leading-relaxed">
                <p><strong>Business Operational Hours:</strong></p>
                <p className="mt-0.5">Monday to Saturday: 9:00 AM – 7:00 PM PST. On-call AMC emergency support available 24/7/365.</p>
              </div>
            </div>

          </div>

          {/* Quick Message Box (7 columns) */}
          <div className="lg:col-span-7" id="contact-message-col">
            <div className="bg-slate-950 border border-slate-850 p-6 sm:p-8 rounded-2xl shadow-xl">
              <h3 className="font-display font-bold text-lg text-white mb-6 uppercase tracking-wider flex items-center gap-2">
                <HeartHandshake className="h-5 w-5 text-sky-400" /> SEND US A MESSAGE
              </h3>

              {!sent ? (
                <form onSubmit={handleSubmit} className="space-y-4.5" id="contact-form">
                  <div>
                    <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={msgData.name}
                      onChange={(e) => setMsgData({ ...msgData, name: e.target.value })}
                      placeholder="e.g. Abdullah Shakil"
                      className="w-full bg-slate-900 border border-slate-800 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-600 outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={msgData.email}
                      onChange={(e) => setMsgData({ ...msgData, email: e.target.value })}
                      placeholder="e.g. yourname@gmail.com"
                      className="w-full bg-slate-900 border border-slate-800 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-600 outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Topic Priority
                    </label>
                    <select
                      value={msgData.subject}
                      onChange={(e) => setMsgData({ ...msgData, subject: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 rounded-lg px-4 py-3 text-sm text-white outline-none cursor-pointer"
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Server Installation">Windows Server Setup</option>
                      <option value="CCTV Security">CCTV installation Setup</option>
                      <option value="AMC Maintenance">Annual Maintenance Plan (AMC)</option>
                      <option value="Structured Cabling">Networking & Cabling</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Write your Message
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={msgData.message}
                      onChange={(e) => setMsgData({ ...msgData, message: e.target.value })}
                      placeholder="Describe what hardware or assistance you need..."
                      className="w-full bg-slate-900 border border-slate-800 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-650 outline-none transition-colors resize-none"
                    />
                  </div>

                  {errorMsg && (
                    <div className="p-3.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-xs leading-relaxed" id="contact-err-msg">
                       ⚠️ {errorMsg}
                    </div>
                  )}

                  <button
                    type="submit"
                    id="btn-contact-submit"
                    disabled={loading}
                    className="w-full inline-flex items-center justify-center px-6 py-3.5 bg-sky-500 hover:bg-sky-400 disabled:bg-sky-500/50 disabled:cursor-not-allowed text-slate-950 font-bold rounded-lg transition-transform active:scale-95 cursor-pointer text-sm shadow-md shadow-sky-500/10"
                  >
                    <Send className="mr-2 h-4 w-4" />
                    {loading ? "Dispatching Message..." : "Dispatch Secure Message"}
                  </button>
                </form>
              ) : (
                <div className="text-center py-10 space-y-4" id="contact-success">
                  <div className="w-12 h-12 bg-emerald-500/15 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-emerald-400">
                    <Check className="h-6 w-6 stroke-[3]" />
                  </div>
                  <h4 className="font-display font-extrabold text-lg text-white">Message Dispatched!</h4>
                  <p className="text-slate-300 text-xs sm:text-sm max-w-sm mx-auto leading-relaxed">
                    Thank you. Your message has been sent successfully. An engineer from Next Gen Bytes will respond via email or call you shortly.
                  </p>
                  <button
                    id="btn-send-another-message"
                    onClick={() => setSent(false)}
                    className="px-4 py-2 bg-slate-900 border border-slate-800 text-slate-300 hover:text-white rounded-lg text-xs font-semibold cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
