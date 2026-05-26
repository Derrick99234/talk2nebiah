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
  AlertTriangle
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardOverview() {
  const { patients, sessions, payments, currency } = useDashboard();

  // 1. Calculate Statistics
  const activeChats = patients.length;
  const ongoingSessions = sessions.filter(s => s.status === 'ONGOING').length;
  const resolvedSessions = sessions.filter(s => s.status === 'RESOLVED').length;
  
  // Calculate average rating
  const ratings = sessions.filter(s => s.status === 'RESOLVED' && s.feedbackRating).map(s => s.feedbackRating as number);
  const avgRating = ratings.length > 0 ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : '4.8';

  // Calculate Revenue based on selected currency
  const receivedPayments = payments.filter(p => p.status === 'SUCCESSFUL');
  const revenueNgn = receivedPayments.filter(p => p.currency === 'NGN').reduce((sum, p) => sum + p.amount, 0);
  const revenueUsd = receivedPayments.filter(p => p.currency === 'USD').reduce((sum, p) => sum + p.amount, 0);

  // Format currency value based on current view
  const formattedRevenue = currency === 'NGN' 
    ? `₦${(revenueNgn + revenueUsd * 1500).toLocaleString()}` // Mock conversion for USD -> NGN at 1500 rate
    : `$${(revenueUsd + revenueNgn / 1500).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

  // Struggle distribution counter
  const struggles = sessions.reduce((acc: Record<string, number>, s) => {
    acc[s.struggleCategory] = (acc[s.struggleCategory] || 0) + 1;
    return acc;
  }, {});

  const totalStrugglesCount = Object.values(struggles).reduce((a, b) => a + b, 0) || 1;

  // Static Daily Conversations Chart Data (Represented visually in SVGs)
  const chartData = [
    { day: 'Mon', count: 12 },
    { day: 'Tue', count: 19 },
    { day: 'Wed', count: 15 },
    { day: 'Thu', count: 24 },
    { day: 'Fri', count: 22 },
    { day: 'Sat', count: 30 },
    { day: 'Sun', count: 28 }
  ];

  const maxChartCount = Math.max(...chartData.map(d => d.count));

  // Activity Log
  const activities = [
    { type: 'message', text: 'WhatsApp message received from Blessing Okon', time: '10 mins ago', badgeColor: 'bg-indigo-500/20 text-indigo-300' },
    { type: 'payment', text: 'Subscription payment received from David Alao', time: '1 hour ago', badgeColor: 'bg-emerald-500/20 text-emerald-300' },
    { type: 'ai', text: 'AI answered generalized anxiety query for Amara Okafor', time: 'Yesterday', badgeColor: 'bg-purple-500/20 text-purple-300' },
    { type: 'status', text: 'Session s4 was resolved by Operator', time: 'Yesterday', badgeColor: 'bg-amber-500/20 text-amber-300' }
  ];

  return (
    <div className="space-y-8 pb-12">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">Welcome back, Emmanuella!</h1>
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
              <span className="text-xs text-indigo-400 font-mono">SIMULATED</span>
            </div>

          </div>

          <div className="flex items-center gap-2 text-xs bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl text-amber-300">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
            <p>Make sure to review WhatsApp logs daily for human handovers.</p>
          </div>
        </div>

      </div>

    </div>
  );
}
