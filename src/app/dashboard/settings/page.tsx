'use client';

import React, { useState } from 'react';
import { useDashboard } from '@/context/DashboardContext';
import { 
  Settings, 
  Key, 
  MapPin, 
  Save, 
  ShieldCheck, 
  Bell, 
  Laptop 
} from 'lucide-react';

export default function SettingsConsole() {
  const { whatsappConfig, updateWhatsAppConfig } = useDashboard();
  
  // WhatsApp settings state
  const [phoneNumberId, setPhoneNumberId] = useState<string>(whatsappConfig.phoneNumberId);
  const [accessToken, setAccessToken] = useState<string>(whatsappConfig.accessToken);
  const [webhookUrl, setWebhookUrl] = useState<string>(whatsappConfig.webhookUrl);
  
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  const handleSaveWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    updateWhatsAppConfig({
      phoneNumberId,
      accessToken,
      webhookUrl
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl pb-12">
      
      {/* WHATSAPP API GATEWAY KEYS */}
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-8 shadow-xl">
        <div className="space-y-6">
          
          <div className="flex items-center gap-3 text-white font-bold text-xl border-b border-slate-800 pb-5">
            <div className="p-2 bg-mint/10 rounded-lg">
              <Key className="w-6 h-6 text-mint" />
            </div>
            <span>WhatsApp Business API Configuration</span>
          </div>

          <form onSubmit={handleSaveWhatsApp} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="space-y-2 md:col-span-1">
              <label className="text-xs text-slate-400 font-bold uppercase tracking-widest block ml-1">Phone Number ID</label>
              <input 
                type="text" 
                value={phoneNumberId}
                onChange={(e) => setPhoneNumberId(e.target.value)}
                placeholder="e.g. 109283746592834"
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-sm text-slate-200 font-mono focus:outline-none focus:border-mint focus:ring-4 focus:ring-mint/5 transition-all"
              />
            </div>

            <div className="space-y-2 md:col-span-1">
              <label className="text-xs text-slate-400 font-bold uppercase tracking-widest block ml-1">Webhook Verification URL</label>
              <input 
                type="text" 
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://talk2nebiah.com/api/whatsapp/webhook"
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-sm text-slate-200 font-mono focus:outline-none focus:border-mint focus:ring-4 focus:ring-mint/5 transition-all"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs text-slate-400 font-bold uppercase tracking-widest block ml-1">System Access Token</label>
              <input 
                type="password" 
                value={accessToken}
                onChange={(e) => setAccessToken(e.target.value)}
                placeholder="EAAG3k0ZA2n...WHATSAPP_SECRET_TOKEN"
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-sm text-slate-200 font-mono focus:outline-none focus:border-mint focus:ring-4 focus:ring-mint/5 transition-all"
              />
            </div>

            <div className="md:col-span-2 pt-2">
              <button 
                type="submit"
                className="w-full md:w-auto bg-mint hover:bg-mint-dark text-white font-bold px-10 py-4 rounded-2xl text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-mint/20 active:scale-[0.98]"
              >
                {saveSuccess ? 'Configuration Saved!' : 'Save Production Credentials'}
                <Save className="w-4 h-4" />
              </button>
            </div>

          </form>

        </div>

        <div className="flex gap-4 p-5 bg-slate-950/50 rounded-2xl border border-slate-800/50">
          <ShieldCheck className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
          <p className="text-xs text-slate-500 leading-relaxed">
            These credentials grant access to your WhatsApp Business API. They are used for processing incoming patient messages and dispatching AI responses. Ensure they are kept secure and updated in your production environment variables.
          </p>
        </div>
      </div>

    </div>
  );
}
