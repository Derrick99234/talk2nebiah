'use client';

import React, { useEffect, useState } from 'react';
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
  ExternalLink,
  X
} from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { currency, setCurrency, detectedCountry } = useDashboard();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'include' })
      .then(r => r.json())
      .then(data => {
        if (data.authenticated) {
          setAdminEmail(data.admin.email);
        } else {
          window.location.href = '/login';
        }
      })
      .catch(() => { window.location.href = '/login'; })
      .finally(() => setChecking(false));
  }, []);

  async function handleLogout() {
    await fetch('/api/auth/login', { method: 'DELETE' });
    window.location.href = '/login';
  }

  const navigation = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Conversations', href: '/dashboard/conversations', icon: MessageSquare },
    { name: 'Behavior (AI)', href: '/dashboard/behavior', icon: Brain },
    { name: 'Insights', href: '/dashboard/insights', icon: Compass },
    { name: 'Payments', href: '/dashboard/payments', icon: CreditCard },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  const getPageTitle = () => {
    const item = navigation.find(n => n.href === pathname);
    return item ? item.name : 'Dashboard';
  };

  if (checking) {
    return (
      <div className="flex h-screen bg-slate-950 items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-mint border-t-transparent rounded-full" />
      </div>
    );
  }

  const initials = adminEmail
    ? adminEmail.split('@')[0].split('.').map(s => s[0]).join('').toUpperCase().slice(0, 2)
    : 'AD';

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      
      {/* SIDEBAR - Desktop */}
      <aside className="hidden lg:flex w-64 bg-slate-900 border-r border-slate-800 flex-col justify-between shrink-0">
        <div>
          <div className="p-6 border-b border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-mint-dark to-mint flex items-center justify-center shadow-lg shadow-mint/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight leading-none">Talk2Nebiah</h1>
              <span className="text-xs text-mint font-medium tracking-wide">ADMIN CONSOLE</span>
            </div>
          </div>

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

        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:bg-slate-800/60 hover:text-slate-100 transition-all"
          >
            <ExternalLink className="w-5 h-5" />
            Public Website
          </Link>
          <div className="flex items-center justify-between px-4 py-3 text-xs text-slate-500 border-t border-slate-800/60 pt-4">
            <span className="font-mono">v1.0.0</span>
            <button onClick={handleLogout} className="flex items-center gap-1 hover:text-rose-400 transition-colors cursor-pointer">
              <LogOut className="w-3.5 h-3.5" /> Log out
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* TOP HEADER */}
        <header className="h-16 border-b border-slate-800 bg-slate-900/40 flex items-center justify-between px-3 md:px-6 shrink-0 gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden p-2 bg-slate-800 rounded-lg shrink-0 cursor-pointer">
              <Sparkles className="w-5 h-5 text-mint" />
            </button>
            <h2 className="text-base md:text-lg font-bold text-white tracking-tight truncate">{getPageTitle()}</h2>
          </div>

          <div className="flex items-center gap-2 md:gap-6 shrink-0">
            
            <div className="hidden md:flex items-center gap-3 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-full text-xs">
              <div className="flex items-center gap-1.5 text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-mint" />
                <span className="hidden lg:inline">Detected: </span><strong className="text-slate-200">{detectedCountry}</strong>
              </div>
              
              <div className="h-3 w-px bg-slate-850"></div>
              
              <div className="flex items-center gap-1">
                <span className="text-slate-500 mr-1 hidden lg:inline">Currency:</span>
                <button 
                  onClick={() => setCurrency('NGN')}
                  className={`px-2 py-0.5 rounded-md font-bold transition-all ${
                    currency === 'NGN' 
                      ? 'bg-mint text-white' 
                      : 'text-slate-400 hover:text-slate-100'
                  }`}
                >
                  ₦
                </button>
                <button 
                  onClick={() => setCurrency('USD')}
                  className={`px-2 py-0.5 rounded-md font-bold transition-all ${
                    currency === 'USD' 
                      ? 'bg-mint text-white' 
                      : 'text-slate-400 hover:text-slate-100'
                  }`}
                >
                  $
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-white">{adminEmail?.split('@')[0] || 'Admin'}</p>
                <p className="text-[10px] text-slate-500">Administrator</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center shrink-0">
                <span className="text-sm font-bold text-mint">{initials}</span>
              </div>
            </div>
            
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-slate-950 p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto h-full">
            {children}
          </div>
        </main>
      </main>

      {/* MOBILE DRAWER OVERLAY */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* MOBILE DRAWER */}
      <aside className={`fixed top-0 left-0 h-full w-72 bg-slate-900 border-r border-slate-800 z-50 flex flex-col justify-between transform transition-transform duration-300 lg:hidden ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div>
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-mint-dark to-mint flex items-center justify-center shadow-lg shadow-mint/20">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white tracking-tight leading-none">Talk2Nebiah</h1>
                <span className="text-xs text-mint font-medium tracking-wide">ADMIN CONSOLE</span>
              </div>
            </div>
            <button onClick={() => setMobileMenuOpen(false)} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all">
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="p-4 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
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

        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:bg-slate-800/60 hover:text-slate-100 transition-all"
          >
            <ExternalLink className="w-5 h-5" />
            Public Website
          </Link>
          <div className="flex items-center justify-between px-4 py-3 text-xs text-slate-500 border-t border-slate-800/60 pt-4">
            <span className="font-mono">v1.0.0</span>
            <button onClick={handleLogout} className="flex items-center gap-1 hover:text-rose-400 transition-colors cursor-pointer">
              <LogOut className="w-3.5 h-3.5" /> Log out
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}
