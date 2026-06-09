'use client';

import React from 'react';
import { useDashboard } from '@/context/DashboardContext';
import { 
  Key, 
  Save, 
  ShieldCheck 
} from 'lucide-react';

export default function SettingsConsole() {
  const { pricing, updatePricing } = useDashboard();

  const [singleNaira, setSingleNaira] = React.useState(pricing.singleNaira);
  const [singleUsd, setSingleUsd] = React.useState(pricing.singleUsd);
  const [monthlyNaira, setMonthlyNaira] = React.useState(pricing.monthlyNaira);
  const [monthlyUsd, setMonthlyUsd] = React.useState(pricing.monthlyUsd);
  const [saveSuccess, setSaveSuccess] = React.useState(false);

  const handleSavePricing = (e: React.FormEvent) => {
    e.preventDefault();
    updatePricing({
      singleNaira,
      singleUsd,
      monthlyNaira,
      monthlyUsd,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl pb-12 space-y-8">

      {/* WHATSAPP API — read only notice */}
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-xl">
        <div className="flex items-center gap-3 text-white font-bold text-xl border-b border-slate-800 pb-5 mb-6">
          <div className="p-2 bg-mint/10 rounded-lg">
            <Key className="w-6 h-6 text-mint" />
          </div>
          <span>WhatsApp Business API</span>
        </div>

        <div className="flex gap-4 p-5 bg-slate-950/50 rounded-2xl border border-slate-800/50">
          <ShieldCheck className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-400 leading-relaxed space-y-2">
            <p>WhatsApp credentials are managed through environment variables for security.</p>
            <p className="font-mono text-[11px] text-slate-500">
              WHATSAPP_PHONE_NUMBER_ID, WHATSAPP_ACCESS_TOKEN, WHATSAPP_WEBHOOK_VERIFY_TOKEN
            </p>
            <p>To update them, modify your production environment variables and restart the server.</p>
          </div>
        </div>
      </div>

      {/* PRICING */}
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-xl">
        <div className="flex items-center gap-3 text-white font-bold text-xl border-b border-slate-800 pb-5 mb-6">
          <div className="p-2 bg-mint/10 rounded-lg">
            <Save className="w-6 h-6 text-mint" />
          </div>
          <span>Pricing Configuration</span>
        </div>

        <form onSubmit={handleSavePricing} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs text-slate-400 font-bold uppercase tracking-widest block ml-1">Single Session (NGN)</label>
            <input type="number" value={singleNaira} onChange={e => setSingleNaira(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-sm text-slate-200 font-mono focus:outline-none focus:border-mint focus:ring-4 focus:ring-mint/5 transition-all" />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-slate-400 font-bold uppercase tracking-widest block ml-1">Single Session (USD)</label>
            <input type="number" value={singleUsd} onChange={e => setSingleUsd(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-sm text-slate-200 font-mono focus:outline-none focus:border-mint focus:ring-4 focus:ring-mint/5 transition-all" />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-slate-400 font-bold uppercase tracking-widest block ml-1">Monthly Plan (NGN)</label>
            <input type="number" value={monthlyNaira} onChange={e => setMonthlyNaira(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-sm text-slate-200 font-mono focus:outline-none focus:border-mint focus:ring-4 focus:ring-mint/5 transition-all" />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-slate-400 font-bold uppercase tracking-widest block ml-1">Monthly Plan (USD)</label>
            <input type="number" value={monthlyUsd} onChange={e => setMonthlyUsd(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-sm text-slate-200 font-mono focus:outline-none focus:border-mint focus:ring-4 focus:ring-mint/5 transition-all" />
          </div>
          <div className="md:col-span-2 pt-2">
            <button type="submit"
              className="w-full md:w-auto bg-mint hover:bg-mint-dark text-white font-bold px-10 py-4 rounded-2xl text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-mint/20 active:scale-[0.98]">
              {saveSuccess ? 'Pricing Saved!' : 'Save Pricing'}
              <Save className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}
