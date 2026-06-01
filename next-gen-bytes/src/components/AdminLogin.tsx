import React, { useState } from "react";
import { Server, Lock, Mail, Eye, EyeOff, AlertCircle, ArrowLeft } from "lucide-react";
import { motion } from "motion/react";

interface AdminLoginProps {
  onLoginSuccess: (token: string) => void;
  onBackToWebsite: () => void;
}

export default function AdminLogin({ onLoginSuccess, onBackToWebsite }: AdminLoginProps) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage("Please complete all credentials fields prior to logging in.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Credentials authorization failed.");
      }

      const resData = await response.json();
      const sessionToken = resData.token;

      if (!sessionToken) {
        throw new Error("Invalid response format: Missing authorization session token.");
      }

      // Save token in browser storage
      localStorage.setItem("nextgen_admin_token", sessionToken);
      localStorage.setItem("nextgen_admin_email", email);

      // Trigger login callback in root component
      onLoginSuccess(sessionToken);
    } catch (err: any) {
      console.error("Login authorization error:", err);
      setErrorMessage(err.message || "Failed to establish a secure administrative session.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 relative font-sans select-none" id="admin-login-layout">
      
      {/* Background Dots Grid */}
      <div className="absolute inset-0 bg-dots-pattern opacity-10 pointer-events-none" />

      {/* Back link */}
      <button
        onClick={onBackToWebsite}
        className="absolute top-6 left-6 inline-flex items-center space-x-2 text-xs text-slate-400 hover:text-sky-400 cursor-pointer font-semibold font-mono transition-colors"
        id="btn-back-to-site"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>RETURN TO WEBSITE</span>
      </button>

      <div className="w-full max-w-md relative z-10" id="login-container">
        
        {/* Company Header Card */}
        <div className="text-center mb-8 space-y-3">
          <div className="inline-flex items-center justify-center p-3 bg-sky-500 rounded-2xl text-slate-950 mx-auto shadow-md shadow-sky-500/10">
            <Server className="h-7 w-7 stroke-[2.5]" />
          </div>
          <div>
            <h2 className="font-display font-black text-2xl tracking-tight text-white uppercase sm:text-3xl">
              NEXT GEN BYTES
            </h2>
            <p className="text-xs font-mono text-slate-450 tracking-wider">SYSTEMS ADMINISTRATION GATEWAY</p>
          </div>
          <div className="h-1 w-12 bg-sky-500 mx-auto rounded-full" />
        </div>

        {/* Login Form Box */}
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl relative" id="login-card-panel">
          
          <h3 className="font-display font-bold text-lg text-white mb-6 uppercase tracking-wider text-center">
             Console Authentication
          </h3>

          <form onSubmit={handleLoginSubmit} className="space-y-5" id="admin-login-form">
            
            {/* Display validation or authorization errors */}
            {errorMessage && (
              <div className="p-3.5 bg-red-500/10 border border-red-500/25 text-red-400 rounded-xl flex items-start gap-2.5 text-xs sm:text-sm leading-relaxed" id="login-err-alert">
                <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Email field */}
            <div className="space-y-2">
              <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                Administrator Identifier (Email)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-3.5 text-slate-500">
                  <Mail className="h-4.5 w-4.5" />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  disabled={loading}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@nextgenbytes.com"
                  className="w-full bg-slate-950 border border-slate-850 hover:border-slate-800 focus:border-sky-500 rounded-xl pl-11 pr-4 py-3.5 text-sm text-white placeholder-slate-600 outline-none focus:ring-1 focus:ring-sky-500 transition-all font-sans"
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-2">
              <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                Authorized Entry Password Token
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-3.5 text-slate-500">
                  <Lock className="h-4.5 w-4.5" />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  disabled={loading}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-950 border border-slate-850 hover:border-slate-800 focus:border-sky-500 rounded-xl pl-11 pr-11 py-3.5 text-sm text-white placeholder-slate-650 outline-none focus:ring-1 focus:ring-sky-500 transition-all font-mono"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 p-0.5 text-slate-500 hover:text-white transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                </button>
              </div>
            </div>

            {/* Submit handle */}
            <button
              type="submit"
              disabled={loading}
              id="btn-login-submit"
              className="w-full inline-flex items-center justify-center px-6 py-4 bg-sky-500 hover:bg-sky-400 disabled:bg-sky-500/50 disabled:cursor-not-allowed text-slate-950 font-extrabold rounded-xl transition-all active:scale-[0.98] cursor-pointer text-sm shadow-lg shadow-sky-500/10 uppercase tracking-wider"
            >
              {loading ? "Establishing SLA Session..." : "Authorize Portal Access"}
            </button>

          </form>

        </div>

        {/* Informative Security Guideline footprint */}
        <p className="text-[10px] text-center text-slate-500 font-mono mt-8 leading-relaxed max-w-xs mx-auto">
          ⚠️ NOTICE: Unauthorized access attempts are monitored and recorded onto native container logs. Standard admin email default is admin@nextgenbytes.com.
        </p>

      </div>
    </div>
  );
}
