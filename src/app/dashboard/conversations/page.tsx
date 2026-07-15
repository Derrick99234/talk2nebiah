'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useDashboard } from '@/context/DashboardContext';
import { 
  Send, 
  Bot, 
  User, 
  Phone, 
  Tag, 
  FileText, 
  RotateCcw,
  Sparkles,
  Zap,
  AlertCircle,
  Search,
  Check,
  Loader,
  ArrowLeft,
} from 'lucide-react';

export default function WhatsAppInbox() {
  const { 
    patients, 
    messages, 
    sendMessage, 
    togglePatientStatus,
    refresh,
  } = useDashboard();

  const [activePatientId, setActivePatientId] = useState<string>('');
  const [inputText, setInputText] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'AI' | 'HUMAN'>('ALL');
  const [mobileChatOpen, setMobileChatOpen] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const filteredPatients = patients
    .filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           p.whatsappNumber.includes(searchQuery);
      const matchesFilter = filterStatus === 'ALL' || 
                           (filterStatus === 'AI' && p.status === 'AI_RESPONDING') ||
                           (filterStatus === 'HUMAN' && p.status === 'HUMAN_OPERATOR');
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime());

  // Get active patient details
  const activePatient = patients.find(p => p.id === activePatientId) || patients[0] || null;

  // Get messages for active patient
  const chatMessages = messages.filter(m => m.patientId === activePatientId);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Scroll to bottom when opening chat on mobile
  useEffect(() => {
    if (mobileChatOpen) {
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  }, [mobileChatOpen]);

  const handleSendHuman = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activePatientId) return;
    sendMessage(activePatientId, inputText.trim(), 'HUMAN');
    setInputText('');
  };

  // Helper to format date label
  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return '';
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-8rem)] bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      
      {/* 1. CHAT LIST SIDEBAR */}
      <div className={`w-full lg:w-80 border-b lg:border-b-0 lg:border-r border-slate-800 flex flex-col bg-slate-900/60 shrink-0 lg:flex h-full ${mobileChatOpen ? 'hidden' : 'flex'}`}>
        <div className="p-4 border-b border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-base">WhatsApp Chats</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={refresh}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
                title="Refresh conversations"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <span className="text-xs bg-slate-850 px-2 py-0.5 rounded text-slate-400 font-semibold">
                {filteredPatients.length} active
              </span>
            </div>
          </div>
          
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
            <input 
              type="text"
              placeholder="Search patients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-mint"
            />
          </div>

          {/* Mini filters */}
          <div className="flex gap-2">
            {(['ALL', 'AI', 'HUMAN'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`flex-1 text-[10px] font-bold py-1 rounded border transition-all ${
                  filterStatus === s 
                    ? 'bg-mint/10 border-mint/30 text-mint' 
                    : 'bg-slate-850 border-slate-800 text-slate-500 hover:text-slate-300'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-850">
          {filteredPatients.map((patient) => {
            const isSelected = patient.id === activePatientId;
            return (
              <button
                key={patient.id}
                onClick={() => { setActivePatientId(patient.id); setMobileChatOpen(true); }}
                className={`w-full p-4 text-left transition-all flex gap-3 hover:bg-slate-800/40 ${
                  isSelected ? 'bg-slate-800/80' : ''
                }`}
              >
                {/* Avatar */}
                <div className="relative shrink-0">
                  <img 
                    src={patient.avatar} 
                    alt={patient.name} 
                    className="w-11 h-11 rounded-full object-cover border border-slate-700" 
                  />
                  {patient.unread && (
                    <span className="absolute top-0 right-0 w-3 h-3 bg-mint rounded-full border-2 border-slate-900"></span>
                  )}
                </div>

                {/* Patient Summary */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold text-sm text-slate-200 truncate">{patient.name}</h4>
                    <span className="text-[10px] text-slate-500 whitespace-nowrap">{patient.lastMessageTime}</span>
                  </div>
                  <p className="text-xs text-slate-400 truncate mt-0.5">{patient.lastMessage}</p>
                  
                  {/* Status Badges */}
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 ${
                      patient.status === 'AI_RESPONDING' 
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/10' 
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/10'
                    }`}>
                      {patient.status === 'AI_RESPONDING' ? <Bot className="w-2.5 h-2.5" /> : <User className="w-2.5 h-2.5" />}
                      {patient.status === 'AI_RESPONDING' ? 'AI Responder' : 'Human Handover'}
                    </span>
                    <span className="text-[9px] font-medium text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded truncate max-w-[120px]">
                      {patient.activeStruggle}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. MAIN CHAT WINDOW */}
      <div className={`flex-1 flex-col justify-between bg-slate-950 lg:flex min-h-0 ${mobileChatOpen ? 'flex' : 'hidden'}`}>
        {!activePatient ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500 space-y-4">
            <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center border border-slate-800">
              <Bot className="w-10 h-10 text-slate-700" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold text-slate-300">No active conversations</h3>
              <p className="text-sm max-w-xs mx-auto">When patients message your WhatsApp number, they will appear here in real-time.</p>
            </div>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="h-16 border-b border-slate-800 flex items-center justify-between px-3 md:px-6 bg-slate-900/40 gap-2">
              <div className="flex items-center gap-2 md:gap-3 min-w-0">
                <button
                  onClick={() => setMobileChatOpen(false)}
                  className="lg:hidden p-1.5 -ml-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
                  title="Back to conversations"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <img 
                  src={activePatient.avatar} 
                  alt={activePatient.name} 
                  className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover border border-slate-700 shrink-0" 
                />
                <div className="min-w-0">
                  <h4 className="font-bold text-white text-sm truncate">{activePatient.name}</h4>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5 font-mono truncate">
                    <Phone className="w-3 h-3 text-slate-500 shrink-0" /> {activePatient.whatsappNumber}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 md:gap-3 shrink-0">
                <button
                  onClick={refresh}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
                  title="Refresh conversations"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <span className="text-[10px] md:text-xs bg-slate-800 text-slate-400 px-2 md:px-3 py-1 md:py-1.5 rounded-xl border border-slate-700 font-semibold">
                  Live
                </span>
              </div>
            </div>

            {/* Messaging Box Area */}
            <div className="flex-1 overflow-y-auto p-3 md:p-6 space-y-4 relative">
              {/* Messages Loop */}
              {chatMessages.map((msg) => {
                const isPatient = msg.senderType === 'PATIENT';
                const isAi = msg.senderType === 'AI';
                
                return (
                  <div 
                    key={msg.id} 
                    className={`flex flex-col ${isPatient ? 'items-start' : 'items-end'}`}
                  >
                    <div className={`max-w-[85%] md:max-w-[70%] rounded-2xl px-3 md:px-4 py-2.5 md:py-3 text-sm ${
                      isPatient 
                        ? 'bg-slate-800 text-slate-100 rounded-tl-none' 
                        : isAi 
                          ? 'bg-purple-600/30 text-purple-100 border border-purple-500/20 rounded-tr-none'
                          : 'bg-mint text-white rounded-tr-none shadow-md shadow-mint/10'
                    }`}>
                      <p className="leading-relaxed">{msg.content}</p>
                    </div>
                    
                    {/* Meta details */}
                    <div className="flex items-center gap-1.5 mt-1 text-[10px] text-slate-500 font-medium">
                      {isAi && (
                        <span className="text-purple-400 flex items-center gap-0.5 font-bold uppercase tracking-wider text-[8px]">
                          <Bot className="w-3 h-3" /> AI
                        </span>
                      )}
                      {!isPatient && !isAi && (
                        <span className="text-mint flex items-center gap-0.5 font-bold uppercase tracking-wider text-[8px]">
                          <User className="w-3 h-3" /> Operator (You)
                        </span>
                      )}
                      <span>{formatTime(msg.timestamp)}</span>
                      {/* Status indicator for operator messages */}
                      {!isPatient && !isAi && msg.status === 'sending' && (
                        <Loader className="w-3 h-3 text-yellow-400 animate-spin" />
                      )}
                      {!isPatient && !isAi && msg.status === 'sent' && (
                        <Check className="w-3 h-3 text-slate-500" />
                      )}
                      {!isPatient && !isAi && msg.status === 'failed' && (
                        <AlertCircle className="w-3 h-3 text-red-400" />
                      )}
                    </div>
                  </div>
                );
              })}

              {chatMessages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-2">
                  <AlertCircle className="w-8 h-8 text-slate-600" />
                  <p className="text-sm">No message records for this patient.</p>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar Form */}
            <form onSubmit={handleSendHuman} className="p-3 md:p-4 bg-slate-900/40 border-t border-slate-800 flex gap-2 md:gap-3 items-center">
              <input 
                type="text" 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Type a message to reply as operator...`}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 md:px-4 py-3 md:py-3.5 text-sm text-slate-200 focus:outline-none focus:border-mint transition-all"
              />
              <button 
                type="submit"
                className="bg-mint text-white p-3 md:p-3.5 rounded-xl hover:bg-mint-dark transition-all shadow-lg shadow-mint/10 shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </>
        )}
      </div>

      {/* 3. PATIENT DETAIL SIDEBAR */}
      <div className="hidden xl:flex w-80 border-l border-slate-800 p-6 flex-col justify-between bg-slate-900/60 shrink-0 overflow-y-auto">
        {!activePatient ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-600 text-center space-y-2">
            <FileText className="w-8 h-8 opacity-20" />
            <p className="text-[10px] uppercase font-bold tracking-widest opacity-40">No Profile Selected</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Header/Title */}
            <div className="flex items-center gap-2 text-slate-400 font-semibold uppercase tracking-wider text-xs border-b border-slate-800 pb-3">
              <FileText className="w-4 h-4 text-mint" />
              <span>Patient Profile</span>
            </div>

            {/* Quick Info */}
            <div className="text-center py-4 border-b border-slate-800/60">
              <img 
                src={activePatient.avatar} 
                alt={activePatient.name} 
                className="w-20 h-20 rounded-full object-cover border border-slate-700 mx-auto shadow-md" 
              />
              <h4 className="font-bold text-white text-base mt-3">{activePatient.name}</h4>
              <span className="inline-block mt-2 text-xs bg-slate-800 text-slate-400 px-3 py-1 rounded-full font-medium">
                {activePatient.activeStruggle}
              </span>
            </div>

            {/* Controls: AI Status Toggles */}
            <div className="space-y-3">
              <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider">AI Automated Responder</label>
              <div className="bg-slate-950 border border-slate-850 p-4 rounded-2xl space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-300 font-medium">Auto-AI Replies</span>
                  
                  {/* Toggle switch */}
                  <button
                    type="button"
                    onClick={() => togglePatientStatus(activePatient.id)}
                    className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none ${
                      activePatient.status === 'AI_RESPONDING' ? 'bg-mint' : 'bg-slate-800'
                    }`}
                  >
                    <span className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                      activePatient.status === 'AI_RESPONDING' ? 'right-1' : 'left-1'
                    }`} />
                  </button>
                </div>
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  When activated, AI will automatically answer incoming WhatsApp messages using the behavior specifications. Typing a manual message automatically overrides this to human operation.
                </p>
              </div>
            </div>

            {/* Quick Category Tag */}
            <div className="space-y-2">
              <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Crisis Escalation Status</label>
              <div className="flex items-center gap-2 text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-800/80 bg-slate-950 text-slate-400">
                <Tag className="w-3.5 h-3.5 text-mint shrink-0" />
                <span>Priority: Normal (No self-harm flagged)</span>
              </div>
            </div>
            
            <div className="text-[10px] bg-slate-950 p-3 rounded-xl border border-slate-800/60 text-slate-500 mt-6 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-slate-400 mt-0.5" />
              <p>You can toggle manual response. Remember to check on active chats regularly to keep up engagement levels.</p>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
