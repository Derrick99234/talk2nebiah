'use client';

import React, { useState } from 'react';
import { useDashboard } from '@/context/DashboardContext';
import { 
  CreditCard, 
  TrendingUp, 
  DollarSign, 
  MapPin, 
  Save, 
  CheckCircle2, 
  Clock, 
  XCircle,
  Search,
  Download
} from 'lucide-react';

export default function PaymentsConsole() {
  const { payments, pricing, updatePricing } = useDashboard();
  const [filter, setFilter] = useState<'ALL' | 'SUCCESSFUL' | 'PENDING' | 'FAILED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Price form states
  const [singleNaira, setSingleNaira] = useState<number>(pricing.singleNaira);
  const [singleUsd, setSingleUsd] = useState<number>(pricing.singleUsd);
  const [monthlyNaira, setMonthlyNaira] = useState<number>(pricing.monthlyNaira);
  const [monthlyUsd, setMonthlyUsd] = useState<number>(pricing.monthlyUsd);
  
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  const filteredPayments = payments.filter(p => {
    const matchesFilter = filter === 'ALL' || p.status === filter;
    const matchesSearch = p.patientName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         p.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Calculate sum totals
  const totalNgn = payments.filter(p => p.status === 'SUCCESSFUL' && p.currency === 'NGN').reduce((s, p) => s + p.amount, 0);
  const totalUsd = payments.filter(p => p.status === 'SUCCESSFUL' && p.currency === 'USD').reduce((s, p) => s + p.amount, 0);

  const handleExport = () => {
    const csvContent = [
      ['ID', 'Date', 'Patient', 'Plan', 'Amount', 'Currency', 'Country', 'Status'],
      ...filteredPayments.map(p => [p.id, p.date, p.patientName, p.planName, p.amount, p.currency, p.geoCountry, p.status])
    ].map(e => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `payments_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSavePrices = (e: React.FormEvent) => {
    e.preventDefault();
    updatePricing({
      singleNaira: Number(singleNaira),
      singleUsd: Number(singleUsd),
      monthlyNaira: Number(monthlyNaira),
      monthlyUsd: Number(monthlyUsd)
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Helper status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SUCCESSFUL':
        return <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/10"><CheckCircle2 className="w-3 h-3" /> Successful</span>;
      case 'PENDING':
        return <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/10"><Clock className="w-3 h-3 animate-pulse" /> Pending</span>;
      default:
        return <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/10"><XCircle className="w-3 h-3" /> Failed</span>;
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 pb-12">
      
      {/* LEFT & CENTER PANEL: PAYMENTS LIST TABLE */}
      <div className="xl:col-span-2 space-y-6 order-2 xl:order-1">
        
        {/* REVENUE STATS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Naira Revenue (NGN)</span>
              <h3 className="text-2xl font-bold text-white mt-1.5">₦{totalNgn.toLocaleString()}</h3>
            </div>
            <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400">
              <TrendingUp className="w-5.5 h-5.5" />
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">USD Revenue (USD)</span>
              <h3 className="text-2xl font-bold text-white mt-1.5">${totalUsd.toLocaleString()}</h3>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400">
              <DollarSign className="w-5.5 h-5.5" />
            </div>
          </div>
        </div>

        {/* PAYMENTS LIST CONTAINER */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-x-auto shadow-xl">
          
          <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h3 className="font-bold text-white text-base">Transactions Ledger</h3>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-mint w-full sm:w-48"
                />
              </div>

              {/* Export Button */}
              <button
                onClick={handleExport}
                className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border border-slate-700"
              >
                <Download className="w-3.5 h-3.5" />
                Export CSV
              </button>

              {/* Filter Tabs */}
              <div className="flex bg-slate-950 border border-slate-850 p-1 rounded-lg">
                {(['ALL', 'SUCCESSFUL', 'PENDING', 'FAILED'] as const).map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setFilter(opt)}
                    className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${
                      filter === opt 
                        ? 'bg-mint text-white shadow-sm' 
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-850/50 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                <th className="p-3 md:p-4 md:pl-6 text-xs">Date</th>
                <th className="p-3 md:p-4 text-xs">Patient</th>
                <th className="p-3 md:p-4 text-xs hidden sm:table-cell">Plan</th>
                <th className="p-3 md:p-4 text-xs">Amount</th>
                <th className="p-3 md:p-4 text-xs hidden md:table-cell">Billing Origin</th>
                <th className="p-3 md:p-4 md:pr-6 text-xs">Status</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-slate-800/60">
              {filteredPayments.map((pay) => (
                <tr key={pay.id} className="hover:bg-slate-800/10 text-sm text-slate-300">
                  <td className="p-3 md:p-4 md:pl-6 font-mono text-xs text-slate-500">
                    {new Date(pay.date).toLocaleDateString()}
                  </td>
                  <td className="p-3 md:p-4 font-semibold text-slate-200">{pay.patientName}</td>
                  <td className="p-3 md:p-4 text-xs font-semibold text-slate-400 hidden sm:table-cell">{pay.planName}</td>
                  <td className="p-3 md:p-4 font-mono font-bold text-slate-200">
                    {pay.currency === 'NGN' ? `₦${pay.amount.toLocaleString()}` : `$${pay.amount.toLocaleString()}`}
                  </td>
                  <td className="p-3 md:p-4 text-xs text-slate-400 hidden md:table-cell">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-mint" /> {pay.geoCountry}
                    </span>
                  </td>
                  <td className="p-3 md:p-4 md:pr-6">{getStatusIcon(pay.status)}</td>
                </tr>
              ))}

              {filteredPayments.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500 text-sm">
                    No transactions ledger recorded.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* RIGHT PANEL: PRICE CONTROLS */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col justify-between h-full order-1 xl:order-2">
        
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-white font-bold text-lg border-b border-slate-800 pb-3">
            <CreditCard className="w-5 h-5 text-mint" />
            <span>Pricing Configurator</span>
          </div>

          <form onSubmit={handleSavePrices} className="space-y-6">
            
            {/* 1. Single Session Pricing */}
            <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-850">
              <span className="text-xs text-slate-300 font-bold uppercase tracking-wider">Single Session Price</span>
              
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <label className="text-[10px] text-slate-500 uppercase font-semibold">Naira (₦)</label>
                  <input 
                    type="number"
                    value={singleNaira}
                    onChange={(e) => setSingleNaira(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-sm text-slate-100 font-mono mt-1 focus:outline-none focus:border-mint"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 uppercase font-semibold">USD ($)</label>
                  <input 
                    type="number"
                    value={singleUsd}
                    onChange={(e) => setSingleUsd(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-sm text-slate-100 font-mono mt-1 focus:outline-none focus:border-mint"
                  />
                </div>
              </div>
            </div>

            {/* 2. Monthly Subscription Pricing */}
            <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-850">
              <span className="text-xs text-slate-300 font-bold uppercase tracking-wider">Monthly Plan Price</span>
              
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <label className="text-[10px] text-slate-500 uppercase font-semibold">Naira (₦)</label>
                  <input 
                    type="number"
                    value={monthlyNaira}
                    onChange={(e) => setMonthlyNaira(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-sm text-slate-100 font-mono mt-1 focus:outline-none focus:border-mint"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 uppercase font-semibold">USD ($)</label>
                  <input 
                    type="number"
                    value={monthlyUsd}
                    onChange={(e) => setMonthlyUsd(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-sm text-slate-100 font-mono mt-1 focus:outline-none focus:border-mint"
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-mint hover:bg-mint-dark text-white font-bold py-3.5 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-mint/15"
            >
              {saveSuccess ? 'Pricing Updated!' : 'Apply Price Changes'}
              <Save className="w-3.5 h-3.5" />
            </button>

          </form>

        </div>

        <div className="text-[10px] text-slate-500 bg-slate-950 p-3 rounded-lg border border-slate-800/60 leading-relaxed mt-6">
          Prices are geolocation-dependent. Patients visiting the homepage from Nigerian IP addresses will be presented with Naira pricing, while global visitors will see USD equivalent.
        </div>

      </div>

    </div>
  );
}
