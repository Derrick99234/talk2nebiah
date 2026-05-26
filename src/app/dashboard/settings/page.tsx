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
  const { whatsappConfig, updateWhatsAppConfig, currency, setCurrency } = useDashboard();
  
  // WhatsApp settings state
  const [phoneNumberId, setPhoneNumberId] = useState<string>(whatsappConfig.phoneNumberId);
  const [accessToken, setAccessToken] = useState<string>(whatsappConfig.accessToken);
  const [webhookUrl, setWebhookUrl] = useState<string>(whatsappConfig.webhookUrl);
  
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Preference switches (local state for mock settings)
  const [notifications, setNotifications] = useState<boolean>(true);
  const [emailAlerts, setEmailAlerts] = useState<boolean>(false);

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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-12">
      
      {/* LEFT COLUMN: WHATSAPP API GATEWAY KEYS */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between space-y-6">
        <div className="space-y-6">
          
          <div className="flex items-center gap-2 text-white font-bold text-lg border-b border-slate-800 pb-3">
            <Key className="w-5 h-5 text-mint" />
            <span>WhatsApp Business API Settings</span>
          </div>

          <form onSubmit={handleSaveWhatsApp} className="space-y-4">
            
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Phone Number ID</label>
              <input 
                type="text" 
                value={phoneNumberId}
                onChange={(e) => setPhoneNumberId(e.target.value)}
                placeholder="e.g. 109283746592834"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-200 font-mono focus:outline-none focus:border-mint"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">WhatsApp System Token</label>
              <input 
                type="password" 
                value={accessToken}
                onChange={(e) => setAccessToken(e.target.value)}
                placeholder="EAAG3k0ZA2n...WHATSAPP_SECRET_TOKEN"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-200 font-mono focus:outline-none focus:border-mint"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Webhook Verification URL</label>
              <input 
                type="text" 
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://talk2nebiah.com/api/whatsapp/webhook"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-200 font-mono focus:outline-none focus:border-mint"
              />
            </div>

            <button 
              type="submit"
              className="bg-mint hover:bg-mint-dark text-white font-bold px-6 py-3 rounded-xl text-xs transition-all flex items-center gap-1.5 shadow-lg shadow-mint/15 mt-2"
            >
              {saveSuccess ? 'WhatsApp Credentials Saved!' : 'Save Credentials'}
              <Save className="w-3.5 h-3.5" />
            </button>

          </form>

        </div>

        <div className="text-[10px] text-slate-500 bg-slate-950 p-3 rounded-xl border border-slate-850/60 leading-relaxed mt-6">
          Credentials are referenced by outgoing WhatsApp dispatch services and incoming webhook parsing logic when forwarding client texts to the dashboard inbox.
        </div>
      </div>

      {/* RIGHT COLUMN: SIMULATOR & LOCATIONS */}
      <div className="space-y-6">
        
        {/* Geolocation Tester Card */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-lg">
          
          <div className="flex items-center gap-2 text-white font-bold text-lg border-b border-slate-800 pb-3">
            <MapPin className="w-5 h-5 text-mint" />
            <span>Simulator Location Controls</span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Override the client geolocation manually to preview how the pricing structure, billing calculations, and Naira vs USD currency views update for users globally:
          </p>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <button
              onClick={() => setCurrency('NGN')}
              className={`p-4 rounded-xl border flex flex-col justify-between text-left h-24 transition-all ${
                currency === 'NGN'
                  ? 'bg-mint/10 border-mint text-mint shadow-md'
                  : 'bg-slate-950 border-slate-850 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="text-xs font-bold">Nigeria (Naira view)</span>
              <span className="text-xl font-extrabold font-mono mt-2">₦ NGN</span>
            </button>

            <button
              onClick={() => setCurrency('USD')}
              className={`p-4 rounded-xl border flex flex-col justify-between text-left h-24 transition-all ${
                currency === 'USD'
                  ? 'bg-mint/10 border-mint text-mint shadow-md'
                  : 'bg-slate-950 border-slate-850 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="text-xs font-bold">Global (USD view)</span>
              <span className="text-xl font-extrabold font-mono mt-2">$ USD</span>
            </button>
          </div>
        </div>

        {/* Preference Switches Card */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-lg">
          
          <div className="flex items-center gap-2 text-white font-bold text-lg border-b border-slate-800 pb-3">
            <Settings className="w-5 h-5 text-mint" />
            <span>System Configurations</span>
          </div>

          <div className="space-y-4 text-sm">
            
            {/* Preference 1 */}
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-slate-200 text-xs">Desktop Notifications</h4>
                <p className="text-[10px] text-slate-500 mt-0.5">Show browser notifications when new messages arrive.</p>
              </div>
              <button
                type="button"
                onClick={() => setNotifications(!notifications)}
                className={`w-10 h-5.5 rounded-full transition-colors relative focus:outline-none ${
                  notifications ? 'bg-mint' : 'bg-slate-850'
                }`}
              >
                <span className={`w-3.5 h-3.5 rounded-full bg-white absolute top-1 transition-transform ${
                  notifications ? 'right-1' : 'left-1'
                }`} />
              </button>
            </div>

            {/* Preference 2 */}
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-slate-200 text-xs">Email Daily Digests</h4>
                <p className="text-[10px] text-slate-500 mt-0.5">Send a summary of resolved sessions and billing metrics daily.</p>
              </div>
              <button
                type="button"
                onClick={() => setEmailAlerts(!emailAlerts)}
                className={`w-10 h-5.5 rounded-full transition-colors relative focus:outline-none ${
                  emailAlerts ? 'bg-mint' : 'bg-slate-850'
                }`}
              >
                <span className={`w-3.5 h-3.5 rounded-full bg-white absolute top-1 transition-transform ${
                  emailAlerts ? 'right-1' : 'left-1'
                }`} />
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
