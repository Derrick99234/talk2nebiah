'use client';

import React from 'react';
import { useDashboard } from '@/context/DashboardContext';
import { 
  Users, 
  MessageSquare, 
  TrendingUp, 
  Smile, 
  ArrowUpRight,
  Heart,
  ChevronRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';

function getTimeAgo(date: Date): string {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
}

export default function DashboardOverview() {
  const { patients, sessions, payments, currency, loading, error } = useDashboard();

  // 1. Calculate Statistics
  const activeChats = patients.length;
  const ongoingSessions = sessions.filter(s => s.status === 'ONGOING').length;
  const resolvedSessions = sessions.filter(s => s.status === 'RESOLVED').length;
  
  // Calculate average rating
  const ratings = sessions.filter(s => s.status === 'RESOLVED' && s.feedbackRating).map(s => s.feedbackRating as number);
  const avgRating = ratings.length > 0 ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : null;

  // Calculate Revenue based on selected currency
  const receivedPayments = payments.filter(p => p.status === 'SUCCESSFUL');
  const revenueNgn = receivedPayments.filter(p => p.currency === 'NGN').reduce((sum, p) => sum + p.amount, 0);
  const revenueUsd = receivedPayments.filter(p => p.currency === 'USD').reduce((sum, p) => sum + p.amount, 0);

  // Format currency value based on current view
  const formattedRevenue = currency === 'NGN' 
    ? `₦${revenueNgn.toLocaleString()}`
    : `$${revenueUsd.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

  // Struggle distribution counter
  const struggles = sessions.reduce((acc: Record<string, number>, s) => {
    acc[s.struggleCategory] = (acc[s.struggleCategory] || 0) + 1;
    return acc;
  }, {});

  const totalStrugglesCount = Object.values(struggles).reduce((a, b) => a + b, 0) || 1;

  // Compute chart data from sessions by day of week
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const chartData = dayNames.map(day => {
    const count = sessions.filter(s => {
      const d = dayNames[new Date(s.startDate).getDay()];
      return d === day;
    }).length;
    return { day, count };
  });

  const maxChartCount = Math.max(...chartData.map(d => d.count), 1);

  // Generate activity log from real data
  const activities: { type: string; text: string; time: string; badgeColor: string }[] = [];
  
  sessions.slice(0, 5).forEach(s => {
    const timeAgo = getTimeAgo(new Date(s.startDate));
    activities.push({
      type: 'session',
      text: `${s.status === 'RESOLVED' ? 'Resolved' : 'Started'} session for ${s.patientName} (${s.struggleCategory})`,
      time: timeAgo,
      badgeColor: s.status === 'RESOLVED' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-indigo-500/20 text-indigo-300',
    });
  });

  payments.slice(0, 3).forEach(p => {
    activities.push({
      type: 'payment',
      text: `${p.planName} payment ${p.status.toLowerCase()} from ${p.patientName}`,
      time: getTimeAgo(new Date(p.date)),
      badgeColor: p.status === 'SUCCESSFUL' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300',
    });
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-12rem)]">
        <div className="animate-spin w-8 h-8 border-2 border-mint border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-12rem)]">
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-6 py-4 rounded-2xl text-sm max-w-md text-center">
          <AlertCircle className="w-8 h-8 mx-auto mb-2" />
          <p className="font-semibold">Failed to load dashboard</p>
          <p className="text-rose-400/80 mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">Dashboard Overview</h1>
          <p className="text-slate-400 text-sm mt-1">Here is a quick look at what is happening with Talk2Nebiah today.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard/conversations" className="bg-mint text-white px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-mint-dark transition-all flex items-center gap-2 shadow-lg shadow-mint/10">
            Open WhatsApp Inbox
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Metric 1 */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden flex flex-col justify-between h-36">
          <div className="flex justify-between items-start">
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Active Conversations</span>
            <div className="p-2 bg-mint/10 rounded-lg text-mint">
              <MessageSquare className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-white mt-2">{activeChats}</h3>
            <p className="text-slate-500 text-xs mt-1">Conversations on WhatsApp</p>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-mint"></div>
        </div>

        {/* Metric 2 */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden flex flex-col justify-between h-36">
          <div className="flex justify-between items-start">
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Ongoing Sessions</span>
            <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
              <Heart className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-white mt-2">{ongoingSessions}</h3>
            <p className="text-slate-500 text-xs mt-1">{resolvedSessions} sessions resolved</p>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-indigo-500"></div>
        </div>

        {/* Metric 3 */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden flex flex-col justify-between h-36">
          <div className="flex justify-between items-start">
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Average Rating</span>
            <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400">
              <Smile className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-white mt-2">{avgRating} / 5.0</h3>
            <p className="text-slate-500 text-xs mt-1">Based on resolved session feedback</p>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-amber-500"></div>
        </div>

        {/* Metric 4 */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden flex flex-col justify-between h-36">
          <div className="flex justify-between items-start">
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Total Revenue</span>
            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-white mt-2">{formattedRevenue}</h3>
            <p className="text-slate-500 text-xs mt-1">Includes converted payments</p>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-emerald-500"></div>
        </div>

      </div>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Weekly Trend Chart */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-white text-lg">Daily Conversations Trend</h3>
              <p className="text-slate-500 text-xs mt-0.5">Total WhatsApp messages exchanged daily</p>
            </div>
            <span className="text-[10px] uppercase font-semibold tracking-wider bg-slate-800 text-slate-300 px-2.5 py-1 rounded-full">
              Last 7 Days
            </span>
          </div>

          {/* SVG / CSS bar chart layout */}
          <div className="h-64 flex items-end gap-3 pt-6 border-b border-slate-800 pb-2">
            {chartData.map((d) => {
              const heightPercentage = `${(d.count / maxChartCount) * 80}%`;
              return (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  <div className="text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 px-1.5 py-0.5 rounded font-mono mb-1">
                    {d.count}
                  </div>
                  <div 
                    className="w-full bg-gradient-to-t from-mint/40 to-mint rounded-t-lg transition-all duration-500 group-hover:brightness-110 group-hover:shadow-lg group-hover:shadow-mint/20"
                    style={{ height: heightPercentage }}
                  />
                  <span className="text-xs text-slate-500 mt-1">{d.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Struggle Categories Card */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between">
          <div className="space-y-1">
            <h3 className="font-bold text-white text-lg">Struggle Distribution</h3>
            <p className="text-slate-500 text-xs">Categories flag recorded during counseling sessions</p>
          </div>

          <div className="space-y-4 my-6">
            {Object.entries(struggles).map(([category, count]) => {
              const percent = Math.round((count / totalStrugglesCount) * 100);
              return (
                <div key={category} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-300">{category}</span>
                    <span className="text-slate-400">{count} ({percent}%)</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-mint h-full rounded-full transition-all duration-700" 
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
            
            {Object.keys(struggles).length === 0 && (
              <div className="text-center py-6 text-slate-500 text-sm">
                No session categories recorded yet.
              </div>
            )}
          </div>

          <div className="border-t border-slate-800/60 pt-4 flex items-center justify-between text-xs text-slate-400">
            <span>Primary Focus: <strong>Depression / Stress</strong></span>
            <Link href="/dashboard/insights" className="text-mint font-semibold hover:underline flex items-center gap-0.5">
              View Insights <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>

      {/* LOWER ROW: SYSTEM STATS & ACTIVITY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Activity Log */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl lg:col-span-2 space-y-4">
          <h3 className="font-bold text-white text-lg">Recent Activities</h3>
          
          <div className="divide-y divide-slate-800/60">
            {activities.map((act, i) => (
              <div key={i} className="py-3.5 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${act.badgeColor}`}>
                    {act.type}
                  </span>
                  <p className="text-sm text-slate-300 font-medium">{act.text}</p>
                </div>
                <span className="text-xs text-slate-500 whitespace-nowrap">{act.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Integration Status Card */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between h-full">
          <div className="space-y-1">
            <h3 className="font-bold text-white text-lg">Integration Health</h3>
            <p className="text-slate-500 text-xs">Live API connections state</p>
          </div>

          <div className="space-y-4 my-6">
            
            {/* Status Item 1 */}
            <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-850">
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-sm font-semibold text-slate-200">WhatsApp API Gateway</span>
              </div>
              <span className="text-xs text-emerald-400 font-mono">ONLINE</span>
            </div>

            {/* Status Item 2 */}
            <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-850">
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-sm font-semibold text-slate-200">AI Support Agent (Gemini)</span>
              </div>
              <span className="text-xs text-emerald-400 font-mono">ACTIVE</span>
            </div>

            {/* Status Item 3 */}
            <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-850">
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                <span className="text-sm font-semibold text-slate-200">PostgreSQL Database</span>
              </div>
              <span className="text-xs text-emerald-400 font-mono">CONNECTED</span>
            </div>

          </div>

          <div className="flex items-center gap-2 text-xs bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl text-amber-300">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
            <p>Make sure to review WhatsApp logs daily for human handovers.</p>
          </div>
        </div>

      </div>

    </div>
  );
}
