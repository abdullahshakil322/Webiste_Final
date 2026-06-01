import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Inbox,
  Briefcase,
  Users,
  Settings as SettingsIcon,
  LogOut,
  Search,
  Filter,
  CheckCircle,
  Clock,
  Trash2,
  X,
  FileSpreadsheet,
  Mail,
  Phone,
  Building,
  Calendar,
  Lock,
  ArrowUpDown,
  Server,
  Terminal,
  RefreshCw,
  AlertCircle,
  TrendingUp
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { InquiryData } from "../types";

interface AdminDashboardProps {
  onLogout: () => void;
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [inquiries, setInquiries] = useState<InquiryData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"dashboard" | "inquiries" | "services" | "clients" | "settings">("dashboard");

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [serviceFilter, setServiceFilter] = useState<string>("All");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

  // Selected details modal
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryData| null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Custom modal & toast states for popup-free iframe compliance
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; isError?: boolean } | null>(null);

  const showToast = (text: string, isError = false) => {
    setToastMessage({ text, isError });
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Load inquiries from token-authorized API
  const fetchInquiries = async () => {
    setLoading(true);
    setErrorMsg("");
    const token = localStorage.getItem("nextgen_admin_token");
    if (!token) {
      setErrorMsg("Administrator authorization session expired. Please log in again.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/admin/inquiries", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          onLogout();
          return;
        }
        throw new Error("Failed to load inquiries database archive.");
      }

      const data = await response.json();
      setInquiries(data.inquiries || []);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed to load database contents.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  // Update Status action on backend
  const handleUpdateStatus = async (id: string, newStatus: "New" | "Pending" | "Completed") => {
    setActionLoadingId(id);
    const token = localStorage.getItem("nextgen_admin_token");
    try {
      const response = await fetch(`/api/admin/inquiries/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error("Failed to change status record.");
      }

      const resData = await response.json();
      const updatedInquiry = resData.inquiry;

      setInquiries((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
      );

      if (selectedInquiry?.id === id) {
        setSelectedInquiry((prev) => prev ? { ...prev, status: newStatus } : null);
      }
      showToast(`Status updated successfully to [${newStatus}]`, false);
    } catch (err: any) {
      showToast(err.message || "Failed to update inquiry status.", true);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Delete Action triggered by clicking delete button
  const handleDeleteInquiry = (id: string) => {
    setDeleteConfirmId(id); // Opens custom confirmation dialog
  };

  // Actual backend delete execution logic
  const executeDeleteInquiry = async (id: string) => {
    setDeleteConfirmId(null);
    setActionLoadingId(id);
    const token = localStorage.getItem("nextgen_admin_token");
    try {
      const response = await fetch(`/api/admin/inquiries/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error("Failed to delete record.");
      }

      setInquiries((prev) => prev.filter((item) => item.id !== id));
      if (selectedInquiry?.id === id) {
        setSelectedInquiry(null);
      }
      showToast("Inquiry record permanently deleted successfully.", false);
    } catch (err: any) {
      showToast(err.message || "Failed to delete inquiry record.", true);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Export Filtered Table to CSV Download
  const handleExportCSV = () => {
    if (filteredInquiries.length === 0) {
      showToast("No matching inquiries found to export.", true);
      return;
    }

    const headers = ["ID", "Full Name", "Company Name", "Phone", "Email", "Selected Service", "Message", "Submission Date", "Status"];
    const rows = filteredInquiries.map((inq) => [
      inq.id,
      `"${inq.fullName.replace(/"/g, '""')}"`,
      `"${(inq.companyName || "").replace(/"/g, '""')}"`,
      `"${inq.phone || ""}"`,
      `"${inq.email}"`,
      `"${inq.service.replace(/"/g, '""')}"`,
      `"${inq.message.replace(/"/g, '""').replace(/\n/g, " ")}"`,
      inq.createdAt,
      inq.status
    ]);

    const csvContent = "data:text/csv;charset=utf-8,"
      + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `next_gen_bytes_inquiries_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Fetch unique service list for filter option drop-down
  const servicesList = Array.from(new Set(inquiries.map((iq) => iq.service))).filter(Boolean);

  // Compute stats metrics dynamically
  const totalCount = inquiries.length;
  const newCount = inquiries.filter((x) => x.status === "New").length;
  const pendingCount = inquiries.filter((x) => x.status === "Pending").length;
  const completedCount = inquiries.filter((x) => x.status === "Completed").length;

  const todayStr = new Date().toISOString().split("T")[0];
  const newToday = inquiries.filter((x) => x.createdAt.startsWith(todayStr)).length;

  // Filter and Sort implementation
  const filteredInquiries = inquiries
    .filter((inq) => {
      const matchSearch =
        inq.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (inq.companyName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        inq.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (inq.phone || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        inq.message.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus = statusFilter === "All" || inq.status === statusFilter;
      const matchService = serviceFilter === "All" || inq.service === serviceFilter;

      return matchSearch && matchStatus && matchService;
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });

  // CRM Client extraction helper
  const clientIndex = inquiries.reduce((acc: any[], current) => {
    const existing = acc.find((c) => c.email.toLowerCase() === current.email.toLowerCase());
    if (existing) {
      existing.submissionsCount += 1;
      if (new Date(current.createdAt).getTime() > new Date(existing.lastActive).getTime()) {
        existing.lastActive = current.createdAt;
      }
    } else {
      acc.push({
        fullName: current.fullName,
        companyName: current.companyName || "Private Residence",
        phone: current.phone || "Not Listed",
        email: current.email,
        submissionsCount: 1,
        lastActive: current.createdAt
      });
    }
    return acc;
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans" id="admin-workspace">
      
      {/* HEADER BAR */}
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-40 shadow-md">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-sky-500 rounded-lg text-slate-950">
            <Server className="h-5 w-5 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="font-display font-black text-lg tracking-tight text-white uppercase flex items-center">
              Next Gen <span className="text-sky-400 font-mono text-xs ml-1 bg-sky-950 px-1.5 py-0.5 rounded border border-sky-850">Console</span>
            </h1>
            <p className="text-[10px] font-mono text-slate-400 tracking-wider">SECURE IT ADMINISTRATION GATEWAY</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={fetchInquiries}
            title="Refresh active database"
            className="p-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-350 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin text-sky-400" : ""}`} />
          </button>
          <div className="hidden md:flex flex-col items-end text-xs justify-center font-mono">
            <span className="text-slate-300 font-semibold">Authorized Session</span>
            <span className="text-[10px] text-sky-450">Role: System Administrator</span>
          </div>
          <button
            onClick={onLogout}
            id="btn-admin-logout"
            className="inline-flex items-center space-x-1.5 px-4.5 py-2 hover:bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-xs font-semibold hover:border-red-500/30 transition-all cursor-pointer shadow-sm"
          >
            <LogOut className="h-4.5 w-4.5" />
            <span>Terminate Console</span>
          </button>
        </div>
      </header>

      {/* CORE WORKSPACE PORTAL */}
      <div className="flex flex-1 flex-col lg:flex-row" id="core-split-workspace">
        
        {/* SIDE BAR WINDOW */}
        <aside className="w-full lg:w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between py-6">
          <div className="space-y-6 px-4">
            <p className="text-[10px] font-mono font-bold tracking-widest text-slate-500 uppercase px-3">
              CONSOLE CATEGORIES
            </p>

            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm text-left font-medium transition-all cursor-pointer ${
                  activeTab === "dashboard"
                    ? "bg-sky-500/15 border-l-4 border-sky-500 text-sky-400"
                    : "text-slate-400 hover:text-white hover:bg-slate-950"
                }`}
              >
                <LayoutDashboard className="h-4.5 w-4.5" />
                <span>Executive Dashboard</span>
              </button>

              <button
                onClick={() => setActiveTab("inquiries")}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm text-left font-medium transition-all cursor-pointer ${
                  activeTab === "inquiries"
                    ? "bg-sky-500/15 border-l-4 border-sky-500 text-sky-400"
                    : "text-slate-400 hover:text-white hover:bg-slate-950"
                }`}
              >
                <Inbox className="h-4.5 w-4.5" />
                <div className="flex justify-between items-center w-full">
                  <span>Customer Inquiries</span>
                  {newCount > 0 && (
                    <span className="bg-sky-500 text-slate-950 font-sans font-extrabold text-[10px] px-1.5 py-0.5 rounded-full scale-90">
                      {newCount}
                    </span>
                  )}
                </div>
              </button>

              <button
                onClick={() => setActiveTab("services")}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm text-left font-medium transition-all cursor-pointer ${
                  activeTab === "services"
                    ? "bg-sky-500/15 border-l-4 border-sky-500 text-sky-400"
                    : "text-slate-400 hover:text-white hover:bg-slate-950"
                }`}
              >
                <Briefcase className="h-4.5 w-4.5" />
                <span>Systems Catalogue</span>
              </button>

              <button
                onClick={() => setActiveTab("clients")}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm text-left font-medium transition-all cursor-pointer ${
                  activeTab === "clients"
                    ? "bg-sky-500/15 border-l-4 border-sky-500 text-sky-400"
                    : "text-slate-400 hover:text-white hover:bg-slate-950"
                }`}
              >
                <Users className="h-4.5 w-4.5" />
                <span>Client Registry</span>
              </button>

              <button
                onClick={() => setActiveTab("settings")}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm text-left font-medium transition-all cursor-pointer ${
                  activeTab === "settings"
                    ? "bg-sky-500/15 border-l-4 border-sky-500 text-sky-400"
                    : "text-slate-400 hover:text-white hover:bg-slate-950"
                }`}
              >
                <SettingsIcon className="h-4.5 w-4.5" />
                <span>SMTP & Credentials</span>
              </button>
            </nav>
          </div>

          {/* SYSTEM FOOTPRINT ACCENT */}
          <div className="px-7 py-3 border-t border-slate-850 text-[10px] text-slate-500 font-mono space-y-1">
            <p>🛰️ host.container: 3000</p>
            <p>🔒 DB Status: ONLINE</p>
            <p>⏱️ timestamp: {new Date().toLocaleTimeString()}</p>
          </div>
        </aside>

        {/* WORKSPACE AREA CONTAINER */}
        <main className="flex-1 p-6 md:p-8 space-y-8 overflow-y-auto max-w-[100vw] lg:max-w-[calc(100vw-256px)]" id="workbench-area">
          
          {errorMsg && (
            <div className="p-4 bg-red-500/10 border border-red-500/25 text-red-300 text-sm rounded-xl flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* STATS MATRIX MODULE */}
          {activeTab === "dashboard" && (
            <div className="space-y-8 animate-fade-in">
              
              <div className="flex md:flex-row flex-col items-start md:items-center justify-between gap-4">
                <div>
                  <h2 className="font-display font-black text-2xl tracking-tight text-white uppercase sm:text-3xl">
                    EXECUTIVE METRICS BOARD
                  </h2>
                  <p className="text-slate-400 text-xs sm:text-sm font-light mt-1">
                    Synchronized telemetry indices representing customer outreach and active service installations.
                  </p>
                </div>
                <div className="text-[10px] bg-slate-900 border border-slate-800 text-slate-400 py-1.5 px-3 rounded-full font-mono">
                  🟢 BACKEND SERVER POLLING: ACTIVE
                </div>
              </div>

              {/* CARD BLOCK SHELVES */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" id="metrics-grid">
                
                {/* Total Leads */}
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform text-white">
                    <Inbox className="h-16 w-16" />
                  </div>
                  <p className="text-[10px] font-mono tracking-widest text-slate-400 uppercase font-bold">TOTAL LEADS INCOMING</p>
                  <p className="h-1 bg-sky-500 w-12 rounded mt-1 mb-3" />
                  <h3 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight">{totalCount}</h3>
                  <p className="text-[10px] text-sky-400 font-mono mt-2 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" /> Cumulative archival index
                  </p>
                </div>

                {/* Today's Entries */}
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform text-white">
                    <Calendar className="h-16 w-16" />
                  </div>
                  <p className="text-[10px] font-mono tracking-widest text-slate-400 uppercase font-bold">ENTRIES SUBMITTED TODAY</p>
                  <p className="h-1 bg-amber-500 w-12 rounded mt-1 mb-3" />
                  <h3 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight">{newToday}</h3>
                  <p className="text-[10px] text-amber-400 font-mono mt-2">
                    ⏱️ Active UTC calendar date
                  </p>
                </div>

                {/* Pending response */}
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform text-white">
                    <Clock className="h-16 w-16" />
                  </div>
                  <p className="text-[10px] font-mono tracking-widest text-slate-400 uppercase font-bold">PENDING SLA INQUIRIES</p>
                  <p className="h-1 bg-red-500 w-12 rounded mt-1 mb-3" />
                  <h3 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight">{newCount + pendingCount}</h3>
                  <p className="text-[10px] text-red-400 font-mono mt-2">
                     🛠️ Action requested immediately
                  </p>
                </div>

                {/* SLA Completed */}
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform text-white">
                    <CheckCircle className="h-16 w-16" />
                  </div>
                  <p className="text-[10px] font-mono tracking-widest text-slate-400 uppercase font-bold">COMPLETED ARCHIVES</p>
                  <p className="h-1 bg-emerald-500 w-12 rounded mt-1 mb-3" />
                  <h3 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight">{completedCount}</h3>
                  <p className="text-[10px] text-emerald-400 font-mono mt-2">
                    ✅ Resolved Client Accounts
                  </p>
                </div>

              </div>

              {/* QUICK RECENT SUBMISSIONS TABLES */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h4 className="font-display font-black text-sm text-white uppercase tracking-wider">
                     INCOMING WEB TRANSMISSIONS
                  </h4>
                  <button
                    onClick={() => setActiveTab("inquiries")}
                    className="text-xs text-sky-450 hover:text-sky-300 font-bold transition-all cursor-pointer uppercase font-mono"
                  >
                    Load Master Table →
                  </button>
                </div>

                {loading ? (
                  <div className="text-center py-10 text-slate-500 font-mono text-xs">
                     Spinning console database pipelines...
                  </div>
                ) : inquiries.length === 0 ? (
                  <div className="text-center py-12 space-y-2 text-xs">
                    <p className="text-slate-450 font-bold">No Records Managed</p>
                    <p className="text-slate-500">Inquiry logs will be rendered here upon customer submissions.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-850">
                    {inquiries.slice(0, 5).map((iq) => (
                      <div
                        key={iq.id}
                        onClick={() => {
                          setSelectedInquiry(iq);
                          setActiveTab("inquiries");
                        }}
                        className="py-4 hover:bg-slate-950/40 px-3 rounded-xl transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-3 text-slate-300"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-mono text-[10px] text-sky-400 font-bold">{iq.id}</span>
                            <span className="text-slate-650">•</span>
                            <span className="font-display font-black text-xs text-white uppercase">{iq.fullName}</span>
                            {iq.companyName && (
                              <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800 font-mono text-[9px] text-slate-400">
                                {iq.companyName}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 line-clamp-1">{iq.service} — Message: <span className="italic">{iq.message}</span></p>
                        </div>

                        <div className="flex items-center space-x-3 text-xs shrink-0 self-end md:self-center">
                          <span className="font-mono text-[10px] text-slate-500">
                            {new Date(iq.createdAt).toLocaleString()}
                          </span>
                          <span
                            className={`px-2.5 py-0.5 text-[9px] font-mono font-bold rounded uppercase border ${
                              iq.status === "New"
                                ? "bg-sky-950 text-sky-400 border-sky-850"
                                : iq.status === "Pending"
                                ? "bg-amber-950 text-amber-400 border-amber-900"
                                : "bg-emerald-950 text-emerald-400 border-emerald-900"
                            }`}
                          >
                            {iq.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* MASTER INQUIRIES WORKBENCH */}
          {activeTab === "inquiries" && (
            <div className="space-y-6 animate-fade-in" id="master-inquiries-tab">
              
              <div>
                <h2 className="font-display font-black text-2xl tracking-tight text-white uppercase sm:text-3xl">
                   INQUIRY RECORD ARCHIVE
                </h2>
                <p className="text-slate-400 text-xs sm:text-sm font-light mt-1">
                  Manage lead records, change deployment status updates, examine custom structural requirements, or export datasets directly as CSV strings.
                </p>
              </div>

              {/* CONTROLS BAR: SEARCH & FILTERS */}
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col xl:flex-row xl:items-center justify-between gap-4">
                
                {/* Search Text Box */}
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search name, phone, company, message, email..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all font-sans"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="absolute right-3.5 top-3.5 text-slate-450 hover:text-white"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* Filter Options */}
                <div className="flex flex-wrap items-center gap-3">
                  
                  {/* Status Drop Filter */}
                  <div className="flex items-center space-x-1.5 min-w-[130px]" id="filter-status-wrapper">
                    <Filter className="h-3.5 w-3.5 text-slate-400" />
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-lg py-2.5 px-3 outline-none cursor-pointer focus:border-sky-500 appearance-none flex-1 font-mono"
                    >
                      <option value="All">All Statuses</option>
                      <option value="New">New</option>
                      <option value="Pending">Pending</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>

                  {/* Service Drop Filter */}
                  <div className="flex items-center space-x-1.5 min-w-[160px]" id="filter-service-wrapper">
                    <Briefcase className="h-3.5 w-3.5 text-slate-400" />
                    <select
                      value={serviceFilter}
                      onChange={(e) => setServiceFilter(e.target.value)}
                      className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-lg py-2.5 px-3 outline-none cursor-pointer focus:border-sky-500 appearance-none flex-1 max-w-[180px] truncate font-mono"
                    >
                      <option value="All">All Services</option>
                      {servicesList.map((srv) => (
                        <option key={srv} value={srv}>{srv}</option>
                      ))}
                    </select>
                  </div>

                  {/* Date Sort Order Toggle */}
                  <button
                    onClick={() => setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"))}
                    className="p-2.5 bg-slate-950 hover:bg-slate-905 border border-slate-800 text-slate-350 hover:text-white rounded-lg transition-colors cursor-pointer text-xs font-mono flex items-center space-x-1.5"
                    title="Change calendar sorting order"
                  >
                    <ArrowUpDown className="h-3.5 w-3.5" />
                    <span>{sortOrder === "desc" ? "Newest First" : "Oldest First"}</span>
                  </button>

                  {/* CSV Export Click */}
                  <button
                    onClick={handleExportCSV}
                    id="btn-export-csv"
                    className="p-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 hover:text-black rounded-lg transition-colors cursor-pointer text-xs font-bold font-mono flex items-center space-x-1.5"
                    title="Compile and download spreadsheet dataset"
                  >
                    <FileSpreadsheet className="h-4 w-4" />
                    <span>Export CSV ({filteredInquiries.length})</span>
                  </button>

                </div>

              </div>

              {/* MAIN RECORDS TABLE WORKBOARD */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                
                {loading ? (
                  <div className="text-center py-20 text-slate-500 font-mono text-sm">
                    🔄 Synchronizing system database catalogs...
                  </div>
                ) : filteredInquiries.length === 0 ? (
                  <div className="text-center py-24 space-y-4 rounded-xl font-mono text-xs">
                    <Inbox className="h-8 w-8 text-slate-500 mx-auto" />
                    <div className="space-y-1">
                      <p className="text-slate-400 font-bold">No Matching Records Found</p>
                      <p className="text-slate-500 max-w-sm mx-auto">Try refining your search keyword filters or expanding your category selectors.</p>
                    </div>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse" id="inquiries-master-table">
                      <thead>
                        <tr className="bg-slate-950 font-mono text-[10px] uppercase text-slate-400 tracking-wider border-b border-slate-800">
                          <th className="py-4 px-5 font-bold">Inquiry ID</th>
                          <th className="py-4 px-5 font-bold">Customer Client</th>
                          <th className="py-4 px-5 font-bold">Service Category</th>
                          <th className="py-4 px-5 font-bold">Submission Date</th>
                          <th className="py-4 px-5 font-bold">Status</th>
                          <th className="py-4 px-5 font-bold text-right">Administrative Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-850 text-slate-350 text-xs sm:text-sm">
                        {filteredInquiries.map((iq) => {
                          const isSelDetail = selectedInquiry?.id === iq.id;
                          return (
                            <React.Fragment key={iq.id}>
                              <tr
                                onClick={() => setSelectedInquiry(iq === selectedInquiry ? null : iq)}
                                className={`group hover:bg-slate-950/50 cursor-pointer transition-colors ${
                                  isSelDetail ? "bg-slate-950/60" : ""
                                }`}
                              >
                                <td className="py-4.5 px-5 font-mono text-[11px] text-sky-400 font-bold">
                                  {iq.id}
                                </td>
                                <td className="py-4.5 px-5">
                                  <div className="space-y-0.5">
                                    <p className="font-display font-black text-white uppercase text-xs sm:text-sm">{iq.fullName}</p>
                                    <p className="text-xs text-slate-400">
                                      {iq.companyName || "Private Household"}
                                    </p>
                                  </div>
                                </td>
                                <td className="py-4.5 px-5 max-w-[120px] truncate">
                                  <span className="font-semibold text-slate-200">{iq.service}</span>
                                </td>
                                <td className="py-4.5 px-5 font-mono text-[10px] text-slate-450">
                                  {new Date(iq.createdAt).toLocaleString()}
                                </td>
                                <td className="py-4.5 px-5">
                                  <span
                                    className={`px-2.5 py-0.5 text-[9px] font-mono font-bold rounded uppercase border ${
                                      iq.status === "New"
                                        ? "bg-sky-950 text-sky-400 border-sky-850"
                                        : iq.status === "Pending"
                                        ? "bg-amber-950 text-amber-400 border-amber-900"
                                        : "bg-emerald-950 text-emerald-400 border-emerald-950"
                                    }`}
                                  >
                                    {iq.status}
                                  </span>
                                </td>
                                <td className="py-4.5 px-5 text-right font-mono" onClick={(e) => e.stopPropagation()}>
                                  <div className="flex items-center justify-end space-x-1.5">
                                    
                                    {iq.status !== "Completed" ? (
                                      <button
                                        onClick={() => handleUpdateStatus(iq.id, "Completed")}
                                        disabled={actionLoadingId === iq.id}
                                        id={`btn-complete-iq-${iq.id}`}
                                        className="p-1 px-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-450 rounded-lg border border-emerald-500/10 text-[9px] font-bold uppercase transition-all cursor-pointer"
                                        title="Mark Inquiry as Completed/Resolved"
                                      >
                                        Resolve
                                      </button>
                                    ) : (
                                      <button
                                        onClick={() => handleUpdateStatus(iq.id, "Pending")}
                                        disabled={actionLoadingId === iq.id}
                                        id={`btn-reopen-iq-${iq.id}`}
                                        className="p-1 px-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-450 rounded-lg border border-amber-500/10 text-[9px] font-bold uppercase transition-all cursor-pointer"
                                        title="Reopen Inquiry to Pending state"
                                      >
                                        Reopen
                                      </button>
                                    )}

                                    {iq.status === "New" && (
                                      <button
                                        onClick={() => handleUpdateStatus(iq.id, "Pending")}
                                        disabled={actionLoadingId === iq.id}
                                        id={`btn-pending-iq-${iq.id}`}
                                        className="p-1 px-1.5 bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 rounded-lg border border-sky-500/10 text-[9px] font-bold uppercase transition-all cursor-pointer"
                                        title="Change context ticket response pipeline to Pending status"
                                      >
                                        Pending
                                      </button>
                                    )}

                                    <button
                                      onClick={() => handleDeleteInquiry(iq.id)}
                                      disabled={actionLoadingId === iq.id}
                                      id={`btn-delete-iq-${iq.id}`}
                                      className="p-1.5 bg-slate-950 hover:bg-red-500/15 border border-slate-850 hover:border-red-500/20 text-slate-400 hover:text-red-400 rounded-lg transition-all cursor-pointer"
                                      title="Delete record from active database"
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </button>

                                  </div>
                                </td>
                              </tr>

                              {/* DETAILED EXPANDED DRAWER INLINE PANEL */}
                              <AnimatePresence>
                                {isSelDetail && (
                                  <tr className="bg-slate-950/30">
                                    <td colSpan={6} className="p-0 border-t border-b border-slate-800">
                                      <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="p-6 md:p-8 space-y-6 text-slate-300"
                                      >
                                        <div className="grid md:grid-cols-12 gap-8">
                                          
                                          {/* Message description body */}
                                          <div className="md:col-span-7 space-y-3">
                                            <h5 className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-500">
                                               TRANSMITTED MESSAGE LOG
                                            </h5>
                                            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-850/80 text-xs sm:text-sm font-sans italic leading-relaxed text-slate-200 whitespace-pre-wrap">
                                              {iq.message || "Customer left no specific notes."}
                                            </div>
                                          </div>

                                          {/* Full Contact Coordinates profile */}
                                          <div className="md:col-span-5 space-y-4">
                                            <h5 className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-500">
                                               CONTACTS PROFILE SUMMARY
                                            </h5>

                                            <div className="bg-slate-900 border border-slate-850 p-4 rounded-xl space-y-3 font-sans text-xs">
                                              <p className="flex items-center gap-2.5">
                                                <Building className="h-4 w-4 text-sky-400 shrink-0" />
                                                <span className="text-slate-450 uppercase font-mono text-[10px]">Company:</span>
                                                <strong className="text-white">{iq.companyName || "Home/Personal Setup"}</strong>
                                              </p>

                                              <p className="flex items-center gap-2.5">
                                                <Mail className="h-4 w-4 text-sky-400 shrink-0" />
                                                <span className="text-slate-450 uppercase font-mono text-[10px]">Email:</span>
                                                <a href={`mailto:${iq.email}`} className="text-sky-400 hover:underline">{iq.email}</a>
                                              </p>

                                              <p className="flex items-center gap-2.5">
                                                <Phone className="h-4 w-4 text-sky-400 shrink-0" />
                                                <span className="text-slate-450 uppercase font-mono text-[10px]">Phone:</span>
                                                <a href={`tel:${iq.phone}`} className="text-white hover:underline">{iq.phone || "Not specified"}</a>
                                              </p>

                                              <p className="flex items-center gap-2.5">
                                                <Calendar className="h-4 w-4 text-sky-400 shrink-0" />
                                                <span className="text-slate-450 uppercase font-mono text-[10px]">Timestamp:</span>
                                                <span className="font-mono text-[11px] text-slate-200">{new Date(iq.createdAt).toLocaleString()}</span>
                                              </p>
                                            </div>

                                            <div className="flex gap-2">
                                              {iq.status !== "Completed" && (
                                                <button
                                                  onClick={() => handleUpdateStatus(iq.id, "Completed")}
                                                  className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-emerald-500 text-slate-900 font-bold hover:bg-emerald-400 text-xs rounded-lg transition-colors cursor-pointer"
                                                >
                                                  <CheckCircle className="mr-1.5 h-4 w-4" /> Mark Completed
                                                </button>
                                              )}
                                              <button
                                                onClick={() => handleDeleteInquiry(iq.id)}
                                                className="inline-flex items-center justify-center px-4 py-2 bg-slate-900 hover:bg-red-500/10 text-slate-400 hover:text-red-400 border border-slate-850 hover:border-red-500/20 text-xs rounded-lg transition-colors cursor-pointer"
                                              >
                                                <Trash2 className="mr-1.5 h-4 w-4" /> Delete Lead entry
                                              </button>
                                            </div>

                                          </div>

                                        </div>
                                      </motion.div>
                                    </td>
                                  </tr>
                                )}
                              </AnimatePresence>
                            </React.Fragment>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}

              </div>

            </div>
          )}

          {/* CATALOGUE INVENTORY PANEL */}
          {activeTab === "services" && (
            <div className="space-y-6 animate-fade-in" id="services-catalogue-tab">
              <div>
                <h2 className="font-display font-black text-2xl tracking-tight text-white uppercase sm:text-3xl">
                   COMPANY SERVICES INVENTORY
                </h2>
                <p className="text-slate-400 text-xs sm:text-sm font-light mt-1">
                  Active directory catalogs, structured wiring limits, custom server templates, and network security profiles offered by Next Gen Bytes.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6" id="services-list-grid">
                
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="font-mono text-xs text-sky-450 font-bold">🛠️ CORE SERVICE A</span>
                    <span className="bg-emerald-920 text-emerald-400 font-mono text-[9px] px-2 py-0.5 rounded border border-emerald-900 font-bold">ACTIVE</span>
                  </div>
                  <h4 className="font-display font-black text-lg text-white uppercase">Windows Server Setup</h4>
                  <p className="text-xs text-slate-400 font-sans leading-relaxed">
                     Setup of Windows Server hardware, Active Directory Domain controllers, Group Policy, and shared folder access controls for local networks.
                  </p>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="font-mono text-xs text-sky-450 font-bold">🛠️ CORE SERVICE B</span>
                    <span className="bg-emerald-920 text-emerald-400 font-mono text-[9px] px-2 py-0.5 rounded border border-emerald-900 font-bold">ACTIVE</span>
                  </div>
                  <h4 className="font-display font-black text-lg text-white uppercase">IT Infrastructure Consultation</h4>
                  <p className="text-xs text-slate-400 font-sans leading-relaxed">
                     Hardware specification calculations, office setup planning, and professional recommendations on router capacity requirements.
                  </p>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="font-mono text-xs text-sky-450 font-bold">🛠️ CORE SERVICE C</span>
                    <span className="bg-emerald-920 text-emerald-400 font-mono text-[9px] px-2 py-0.5 rounded border border-emerald-900 font-bold">ACTIVE</span>
                  </div>
                  <h4 className="font-display font-black text-lg text-white uppercase">Internet Structure Design & Cabling</h4>
                  <p className="text-xs text-slate-400 font-sans leading-relaxed">
                     CAT-6 Structured building cabling, LAN planning, switch layout architectures, and redundant backup fiber/broadband routes.
                  </p>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="font-mono text-xs text-sky-450 font-bold">🛠️ CORE SERVICE D</span>
                    <span className="bg-emerald-920 text-emerald-400 font-mono text-[9px] px-2 py-0.5 rounded border border-emerald-900 font-bold">ACTIVE</span>
                  </div>
                  <h4 className="font-display font-black text-lg text-white uppercase">Computer & Equipment Supply</h4>
                  <p className="text-xs text-slate-450 font-sans leading-relaxed">
                    Corporate computer bulk acquisitions, brand switches, custom routers, firewalls, and server rack sourcing.
                  </p>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="font-mono text-xs text-sky-450 font-bold">🛠️ CORE SERVICE E</span>
                    <span className="bg-emerald-920 text-emerald-400 font-mono text-[9px] px-2 py-0.5 rounded border border-emerald-900 font-bold">ACTIVE</span>
                  </div>
                  <h4 className="font-display font-black text-lg text-white uppercase">CCTV Installation Setup</h4>
                  <p className="text-xs text-slate-400 font-sans leading-relaxed">
                    IP CCTV Camera systems, Analog surveillance routers, DVR setup, remote security monitoring feeds, and central NVR configuration schemas.
                  </p>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="font-mono text-xs text-sky-450 font-bold">🛠️ CORE SERVICE F</span>
                    <span className="bg-emerald-920 text-emerald-400 font-mono text-[9px] px-2 py-0.5 rounded border border-emerald-900 font-bold">ACTIVE</span>
                  </div>
                  <h4 className="font-display font-black text-lg text-white uppercase">Data Backup & Security Solutions</h4>
                  <p className="text-xs text-slate-400 font-sans leading-relaxed">
                    Offsite server cloud replication backups, local NAS server configurations, cybersecurity audit reviews, and endpoint antivirus fireproofing.
                  </p>
                </div>

              </div>
            </div>
          )}

          {/* CLIENT REGISTRY TOOL PANEL (CRM) */}
          {activeTab === "clients" && (
            <div className="space-y-6 animate-fade-in" id="clients-registry-tab">
              <div>
                <h2 className="font-display font-black text-2xl tracking-tight text-white uppercase sm:text-3xl">
                   CRM CLIENT INDEX REGISTRY
                </h2>
                <p className="text-slate-400 text-xs sm:text-sm font-light mt-1">
                   Extracted registry profiles of customers and enterprises who filed quote requests or submitted secure message transmissions of cabling schemes.
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                {clientIndex.length === 0 ? (
                  <div className="py-20 text-center font-mono text-xs text-slate-500">
                     Registry queue empty. No clients logged currently.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse" id="clients-index-table">
                      <thead>
                        <tr className="bg-slate-950 font-mono text-[10px] uppercase text-slate-400 tracking-wider border-b border-slate-800">
                          <th className="py-4 px-5 font-bold">Client Account</th>
                          <th className="py-4 px-5 font-bold">Associated Enterprise</th>
                          <th className="py-4 px-5 font-bold">Email</th>
                          <th className="py-4 px-5 font-bold">Phone Number</th>
                          <th className="py-4 px-5 font-bold">Inquiry Submissions</th>
                          <th className="py-4 px-5 font-bold">Last Communication</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-850 text-slate-350 text-xs sm:text-sm font-sans">
                        {clientIndex.map((cli, ix) => (
                          <tr key={cli.email + ix} className="hover:bg-slate-950/35 transition-colors">
                            <td className="py-4.5 px-5 font-display font-black text-xs text-white uppercase">
                              {cli.fullName}
                            </td>
                            <td className="py-4.5 px-5 text-slate-400 font-semibold">
                              {cli.companyName}
                            </td>
                            <td className="py-4.5 px-5 font-mono text-sky-400">
                              <a href={`mailto:${cli.email}`} className="hover:underline">{cli.email}</a>
                            </td>
                            <td className="py-4.5 px-5 font-mono text-slate-300">
                              <a href={`tel:${cli.phone}`} className="hover:underline">{cli.phone}</a>
                            </td>
                            <td className="py-4.5 px-5 font-mono text-center">
                              <span className="bg-sky-500/15 border border-sky-500/20 text-sky-400 px-2 py-0.5 rounded text-[11px] font-bold">
                                {cli.submissionsCount} {cli.submissionsCount === 1 ? "Inquiry" : "Inquiries"}
                              </span>
                            </td>
                            <td className="py-4.5 px-5 font-mono text-[10px] text-slate-450">
                              {new Date(cli.lastActive).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SMTP AND SERVER ENVIRONMENT SETTINGS SCREEN */}
          {activeTab === "settings" && (
            <div className="space-y-6 animate-fade-in" id="settings-credentials-tab">
              <div>
                <h2 className="font-display font-black text-2xl tracking-tight text-white uppercase sm:text-3xl">
                   SMTP & SECURITY CREDENTIALS
                </h2>
                <p className="text-slate-400 text-xs sm:text-sm font-light mt-1">
                   View SMTP configurations, email setups, and administrative access profile indices.
                </p>
              </div>

              <div className="grid md:grid-cols-12 gap-8 items-start">
                
                {/* Credentials overview panel */}
                <div className="md:col-span-6 space-y-6">
                  
                  <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
                    <h3 className="font-display font-bold text-base text-white uppercase tracking-wider flex items-center gap-2">
                       <Lock className="h-4.5 w-4.5 text-sky-400" /> Administrative Access
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed font-sans">
                       Console credential verification maps parameters declared in the `.env` configuration file inside your container runtime space.
                    </p>

                    <div className="bg-slate-950 p-4.5 rounded-xl border border-slate-850 space-y-3 text-xs font-mono">
                      <p className="flex justify-between">
                        <span className="text-slate-500">ADMIN PROFILE:</span>
                        <span className="text-slate-300">SYSTEM LOCALHOST</span>
                      </p>
                      <p className="flex justify-between">
                        <span className="text-slate-500">ENV EMAIL KEY:</span>
                        <span className="text-slate-300 text-right font-bold text-sky-400">ADMIN_EMAIL</span>
                      </p>
                      <p className="flex justify-between">
                        <span className="text-slate-500">ENV PASSWORD KEY:</span>
                        <span className="text-slate-300 text-right font-bold text-sky-400">ADMIN_PASSWORD</span>
                      </p>
                      <p className="flex justify-between">
                        <span className="text-slate-500">SECURITY METHOD:</span>
                        <span className="text-emerald-400">HMAC-SHA256 JWT Token</span>
                      </p>
                    </div>

                    <div className="p-4 bg-slate-950/40 rounded-xl border border-slate-850/60 flex items-start gap-3">
                      <AlertCircle className="h-4.5 w-4.5 text-amber-500 shrink-0 mt-0.5" />
                      <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                        To update the login identifier email address or change your secure login secret token code, update the correspond variables `ADMIN_EMAIL` and `ADMIN_PASSWORD` inside your workspace `.env` environment block and trigger server restarting.
                      </p>
                    </div>

                  </div>

                </div>

                {/* Nodemailer instructions list */}
                <div className="md:col-span-6 space-y-6">
                  
                  <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
                    <h3 className="font-display font-bold text-base text-white uppercase tracking-wider flex items-center gap-2">
                       <Mail className="h-4.5 w-4.5 text-sky-400" /> SMTP Mailer Module
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed font-sans">
                       Nodemailer requires standard mail server connectivity attributes. If left empty, the server safely triggers simulation mode, outputting outbound customer messages directly to the node stdout stream.
                    </p>

                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-2 text-[11px] font-mono leading-relaxed">
                      <p className="text-slate-500">// Configure Gmail App Password or custom SMTP</p>
                      <p><span className="text-sky-400">SMTP_HOST</span>=<span className="text-amber-400">"smtp.gmail.com"</span></p>
                      <p><span className="text-sky-400">SMTP_PORT</span>=<span className="text-slate-400">587</span></p>
                      <p><span className="text-sky-400">SMTP_USER</span>=<span className="text-amber-400">"your-email@gmail.com"</span></p>
                      <p><span className="text-sky-400">SMTP_PASS</span>=<span className="text-amber-400">"your-16-char-app-password"</span></p>
                      <p><span className="text-sky-400">SMTP_FROM</span>=<span className="text-amber-400">"Next Gen Bytes &lt;no-reply@nextgenbytes.com&gt;"</span></p>
                    </div>

                    <div className="p-4 bg-sky-950/15 rounded-xl border border-sky-900/30 flex items-start gap-3">
                      <Terminal className="h-4.5 w-4.5 text-sky-405 shrink-0 mt-0.5" />
                      <div className="text-[11px] text-slate-400 leading-relaxed font-sans">
                        <strong className="text-white">Active Mail Auto-Response Config:</strong>
                        <ul className="list-disc pl-4 mt-1.5 space-y-1 font-mono text-[10px]">
                          <li>Customer Subject: Thank you for contacting Next Gen Bytes</li>
                          <li>Administrative ALERT Dispatcher destination: abdullahshakil322@gmail.com</li>
                        </ul>
                      </div>
                    </div>

                  </div>

                </div>

              </div>
            </div>
          )}

        </main>
      </div>

      {/* TOAST NOTIFIER BOX */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`fixed bottom-6 right-6 z-50 p-4 rounded-xl border shadow-2xl flex items-center gap-3 font-sans text-xs ${
              toastMessage.isError
                ? "bg-red-950/95 text-red-200 border-red-800/80"
                : "bg-emerald-950/95 text-emerald-200 border-emerald-800/80"
            }`}
          >
            {toastMessage.isError ? (
              <AlertCircle className="h-5 w-5 text-red-400 shrink-0" />
            ) : (
              <CheckCircle className="h-5 w-5 text-emerald-450 shrink-0" />
            )}
            <p className="font-semibold">{toastMessage.text}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CUSTOM POPUP CONFIRMATION MODAL OVERLAY */}
      <AnimatePresence>
        {deleteConfirmId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-6 shadow-2xl"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-red-500/10 rounded-xl text-red-400 shrink-0">
                  <Trash2 className="h-6 w-6 stroke-[2]" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-display font-black text-white text-base uppercase tracking-wider">
                    Confirm Deletion
                  </h3>
                  <p className="text-slate-400 text-xs sm:text-sm font-sans leading-relaxed">
                    Are you absolutely sure you want to permanently delete customer inquiry record <span className="font-mono text-sky-400 font-bold">{deleteConfirmId}</span> from the database? This action is completely irreversible.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-2 font-sans text-xs">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="px-4 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-805 text-slate-350 hover:text-white rounded-lg transition-colors cursor-pointer font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={() => executeDeleteInquiry(deleteConfirmId)}
                  className="px-4 py-2 bg-red-500 hover:bg-red-400 text-white rounded-lg transition-colors cursor-pointer font-bold inline-flex items-center"
                >
                  Confirm Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
