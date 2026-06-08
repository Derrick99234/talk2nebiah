'use client';

import React, { useState } from 'react';
import { useDashboard } from '@/context/DashboardContext';
import { 
  Compass, 
  CheckCircle, 
  HelpCircle, 
  Star, 
  PlusCircle, 
  FileEdit,
  Eye,
  AlertCircle
} from 'lucide-react';

export default function InsightsTracker() {
  const { sessions, toggleSessionStatus, updatePatientNotes } = useDashboard();
  const [filter, setFilter] = useState<'ALL' | 'ONGOING' | 'RESOLVED'>('ALL');
  
  // Selected note edit details
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [editNotes, setEditNotes] = useState<string>('');

  const filteredSessions = sessions.filter(s => {
    if (filter === 'ALL') return true;
    return s.status === filter;
  });

  const activeSessionToEdit = sessions.find(s => s.id === selectedSessionId);

  const handleOpenEdit = (sessionId: string, currentNotes?: string) => {
    setSelectedSessionId(sessionId);
    setEditNotes(currentNotes || '');
  };

  const handleSaveNotes = () => {
    if (!selectedSessionId) return;
    updatePatientNotes(selectedSessionId, editNotes);
    setSelectedSessionId(null);
  };

  // Helper to render star rating
  const renderStars = (rating?: number) => {
    if (!rating) return <span className="text-slate-600">-</span>;
    return (
      <div className="flex gap-0.5 text-amber-400">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`w-3.5 h-3.5 ${i < rating ? 'fill-amber-400' : 'text-slate-700'}`} 
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-12 relative">
      
      {/* HEADER SECTION */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Insights & Feedback</h1>
          <p className="text-slate-400 text-xs mt-1">Track active peer support sessions, feedback, and resolution states.</p>
        </div>

        {/* Tab Filters */}
        <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl">
          {(['ALL', 'ONGOING', 'RESOLVED'] as const).map((opt) => (
            <button
              key={opt}
              onClick={() => setFilter(opt)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                filter === opt 
                  ? 'bg-mint text-white shadow-md' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* SESSIONS TABLE */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-x-auto shadow-xl">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-850/50 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              <th className="p-4 pl-6">Start Date</th>
              <th className="p-4">Patient</th>
              <th className="p-4">Struggle Category</th>
              <th className="p-4">Feedback Rating</th>
              <th className="p-4">Session Notes</th>
              <th className="p-4">Status</th>
              <th className="p-4 pr-6 text-right">Actions</th>
            </tr>
          </thead>
          
          <tbody className="divide-y divide-slate-800/60">
            {filteredSessions.map((session) => (
              <tr key={session.id} className="hover:bg-slate-800/20 text-sm text-slate-300">
                <td className="p-4 pl-6 font-mono text-xs text-slate-500">{session.startDate}</td>
                <td className="p-4 font-semibold text-slate-200">{session.patientName}</td>
                <td className="p-4 text-xs font-medium text-slate-400">
                  <span className="bg-slate-950 px-2.5 py-1 rounded-md border border-slate-850">
                    {session.struggleCategory}
                  </span>
                </td>
                <td className="p-4">{renderStars(session.feedbackRating)}</td>
                <td className="p-4 max-w-xs truncate text-xs text-slate-500">
                  {session.notes || 'No summary notes added.'}
                </td>
                <td className="p-4">
                  <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    session.status === 'RESOLVED' 
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/10' 
                      : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/10'
                  }`}>
                    {session.status === 'RESOLVED' ? <CheckCircle className="w-3 h-3" /> : <HelpCircle className="w-3 h-3" />}
                    {session.status === 'RESOLVED' ? 'Resolved' : 'Ongoing'}
                  </span>
                </td>
                <td className="p-4 pr-6 text-right space-x-2">
                  
                  {/* Note edit trigger */}
                  <button 
                    onClick={() => handleOpenEdit(session.id, session.notes)}
                    className="p-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-400 hover:text-slate-100 transition-all"
                    title="Edit Notes"
                  >
                    <FileEdit className="w-4 h-4" />
                  </button>

                  {/* Resolve / Reopen toggle button */}
                  <button 
                    onClick={() => toggleSessionStatus(session.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      session.status === 'RESOLVED'
                        ? 'bg-slate-950 border border-slate-800 text-slate-400 hover:bg-slate-850 hover:text-slate-200'
                        : 'bg-mint text-white hover:bg-mint-dark shadow-md shadow-mint/10'
                    }`}
                  >
                    {session.status === 'RESOLVED' ? 'Reopen Session' : 'Resolve Session'}
                  </button>

                </td>
              </tr>
            ))}

            {filteredSessions.length === 0 && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-500 text-sm">
                  No session records match the active filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* EDIT NOTES MODAL DIALOG */}
      {selectedSessionId && activeSessionToEdit && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-md w-full shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base">
                Edit Notes for {activeSessionToEdit.patientName}
              </h3>
              <button 
                onClick={() => setSelectedSessionId(null)}
                className="text-slate-400 hover:text-white text-sm"
              >
                Cancel
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Session Summary / Resolution Notes</label>
              <textarea 
                rows={5}
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                placeholder="Enter counseling summary, coping techniques recommended, or notes for next follow-ups..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 leading-relaxed outline-none focus:border-mint resize-none"
              />
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <button 
                onClick={() => setSelectedSessionId(null)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold px-4 py-2 rounded-xl text-xs transition-colors"
              >
                Discard
              </button>
              <button 
                onClick={handleSaveNotes}
                className="bg-mint hover:bg-mint-dark text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors shadow-lg shadow-mint/15"
              >
                Save Notes
              </button>
            </div>

          </div>
        </div>
      )}

      {/* STATS HIGHLIGHT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-900/40 p-4 border border-slate-800 rounded-2xl text-xs text-slate-400 items-center">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-mint shrink-0" />
          <p>Resolving a session automatically assigns a random mockup star rating from the patient to simulate feedback loops.</p>
        </div>
        <div className="text-left md:text-right font-semibold">
          Total Session Records: <span className="text-white font-mono text-sm">{sessions.length}</span>
        </div>
      </div>

    </div>
  );
}
