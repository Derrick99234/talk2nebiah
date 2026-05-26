'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useDashboard } from '@/context/DashboardContext';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Settings, 
  Brain, 
  CreditCard, 
  Compass, 
  LogOut,
  MapPin,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { currency, setCurrency, detectedCountry } = useDashboard();

  const navigation = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Conversations', href: '/dashboard/conversations', icon: MessageSquare },
    { name: 'Behavior (AI)', href: '/dashboard/behavior', icon: Brain },
    { name: 'Insights', href: '/dashboard/insights', icon: Compass },
    { name: 'Payments', href: '/dashboard/payments', icon: CreditCard },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  // Helper to determine the header page title
  const getPageTitle = () => {
    const item = navigation.find(n => n.href === pathname);
    return item ? item.name : 'Dashboard';
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0">
        <div>
          {/* Logo */}
          <div className="p-6 border-b border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-mint-dark to-mint flex items-center justify-center shadow-lg shadow-mint/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight leading-none">Talk2Nebiah</h1>
              <span className="text-xs text-mint font-medium tracking-wide">ADMIN CONSOLE</span>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="p-4 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive 
                      ? 'bg-mint text-white shadow-md shadow-mint/10' 
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-100'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:bg-slate-800/60 hover:text-slate-100 transition-all"
          >
            <ExternalLink className="w-5 h-5" />
            Public Website
          </Link>
          <div className="flex items-center justify-between px-4 py-3 text-xs text-slate-500 border-t border-slate-800/60 pt-4">
            <span className="font-mono">v1.0.0 (Beta)</span>
            <button className="flex items-center gap-1 hover:text-rose-400 transition-colors">
              <LogOut className="w-3.5 h-3.5" /> Log out
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* TOP HEADER */}
        <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-8 shrink-0">
          <div>
            <h2 className="text-xl font-bold text-white">{getPageTitle()}</h2>
          </div>

          <div className="flex items-center gap-6">
            
            {/* Geolocation Currency Switcher */}
            <div className="flex items-center gap-3 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-full text-xs">
              <div className="flex items-center gap-1.5 text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-mint" />
                <span>Detected: <strong className="text-slate-200">{detectedCountry}</strong></span>
              </div>
              
              <div className="h-3 w-px bg-slate-850"></div>
              
              <div className="flex items-center gap-1">
                <span className="text-slate-500 mr-1">Currency Override:</span>
                <button 
                  onClick={() => setCurrency('NGN')}
                  className={`px-2 py-0.5 rounded-md font-bold transition-all ${
                    currency === 'NGN' 
                      ? 'bg-mint text-white' 
                      : 'text-slate-400 hover:text-slate-100'
                  }`}
                >
                  ₦ NGN
                </button>
                <button 
                  onClick={() => setCurrency('USD')}
                  className={`px-2 py-0.5 rounded-md font-bold transition-all ${
                    currency === 'USD' 
                      ? 'bg-mint text-white' 
                      : 'text-slate-400 hover:text-slate-100'
                  }`}
                >
                  $ USD
                </button>
              </div>
            </div>

            {/* Admin Profile */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-semibold text-white">E. Okorodudu</p>
                <p className="text-[10px] text-slate-500">Chief Executive / Admin</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center">
                {/* Fallback image / Avatar */}
                <span className="text-sm font-bold text-mint">EO</span>
              </div>
            </div>
            
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto bg-slate-950 p-8">
          <div className="max-w-7xl mx-auto h-full">
            {children}
          </div>
        </main>
      </div>

    </div>
  );
}
