'use client';

import React, { useState } from 'react';
import { useDashboard } from '@/context/DashboardContext';
import { 
  Lock, 
  Unlock, 
  Brain, 
  Save, 
  Sparkles,
  Send,
  MessageSquare,
  Bot,
  AlertCircle
} from 'lucide-react';

interface SandboxMessage {
  id: string;
  sender: 'user' | 'ai';
  content: string;
}

export default function BehaviorSettings() {
  const { aiBehavior, updateAiBehavior } = useDashboard();
  
  // Gate states
  const [passcode, setPasscode] = useState<string>('');
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Form states
  const [prompt, setPrompt] = useState<string>(aiBehavior.prompt);
  const [tone, setTone] = useState<typeof aiBehavior.tone>(aiBehavior.tone);
  const [safetyThreshold, setSafetyThreshold] = useState<typeof aiBehavior.safetyThreshold>(aiBehavior.safetyThreshold);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Playground states
  const [sandboxMessages, setSandboxMessages] = useState<SandboxMessage[]>([
    { id: '1', sender: 'ai', content: 'Hello! I am the sandboxed AI agent running with your current settings. Type a question or struggle to test how I respond.' }
  ]);
  const [sandboxInput, setSandboxInput] = useState<string>('');

  const handlePasscodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === 'admin123') {
      setIsUnlocked(true);
      setErrorMsg('');
    } else {
      setErrorMsg('Incorrect passcode. Please try again.');
      setPasscode('');
    }
  };

  const handleSaveConfig = () => {
    updateAiBehavior({
      prompt,
      tone,
      safetyThreshold
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handlePlaygroundSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sandboxInput.trim()) return;

    const userMsg: SandboxMessage = {
      id: `u_${Date.now()}`,
      sender: 'user',
      content: sandboxInput.trim()
    };

    setSandboxMessages(prev => [...prev, userMsg]);
    setSandboxInput('');

    // Trigger mock AI reaction based on the configured tone
    setTimeout(() => {
      let responseText = '';
      const input = userMsg.content.toLowerCase();

      // Crisis safety threshold trigger mock
      if (safetyThreshold === 'high' && (input.includes('kill') || input.includes('suicide') || input.includes('hurt myself'))) {
        responseText = "⚠️ [CRISIS SAFETY FLAGGED] I hear you and want you to know you are valued. Because your safety is most important, I must urge you to speak to a professional. You can call the emergency hotline immediately. I am handing this chat to a human operator right now.";
        setSandboxMessages(prev => [...prev, {
          id: `ai_${Date.now()}`,
          sender: 'ai',
          content: responseText
        }]);
        return;
      }

      // Generate response style based on Tone selection
      if (tone === 'compassionate') {
        if (input.includes('stress') || input.includes('burnout')) {
          responseText = "I feel your stress, and it's completely okay to feel exhausted. You've been carrying so much weight. Let's take a slow breath together. What is one small boundary you can set today to protect your peace?";
        } else {
          responseText = "Thank you for sharing that with me. Your feelings are entirely valid, and you are not alone in this. I'm here to support you in whatever way you need, without any judgment. Let's talk through it.";
        }
      } else if (tone === 'honest') {
        responseText = "I hear you, and we have to be real: this struggle won't change overnight, but admitting it is the first step. You are dealing with a heavy load, and it takes deliberate effort to start healing. Let's work out why this is happening.";
      } else if (tone === 'hopeful') {
        responseText = "Even in the darkest moments, there is a path forward. You are stronger than this temporary wave of anxiety, and I believe you will rediscover your peace and clarity. Let's look towards a brighter step tomorrow.";
      } else { // practical
        responseText = "Let's break this down into action items. To help with what you're facing, here are two immediate steps we can try: 1. Let's write down the top three stressors. 2. Dedicate 5 minutes to closing your eyes. Let's start with step 1.";
      }

      setSandboxMessages(prev => [...prev, {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        content: responseText
      }]);
    }, 1500);
  };

  // 1. LOCKED VIEW
  if (!isUnlocked) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-12rem)]">
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl max-w-md w-full shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-full flex items-center justify-center mx-auto animate-pulse">
            <Lock className="w-6 h-6" />
          </div>
          
          <div className="space-y-1">
            <h1 className="text-xl font-bold text-white">Admin Lock</h1>
            <p className="text-slate-400 text-xs leading-relaxed">
              This page contains sensitive AI system behaviors. Please enter the administrator passcode to view or modify AI configurations.
            </p>
          </div>

          <form onSubmit={handlePasscodeSubmit} className="space-y-4">
            <input 
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="Enter Admin Passcode (admin123)"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-center text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-rose-500"
            />
            {errorMsg && (
              <p className="text-rose-400 text-xs font-semibold flex items-center justify-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {errorMsg}
              </p>
            )}
            <button 
              type="submit"
              className="w-full bg-rose-600 text-white font-bold py-3 rounded-xl hover:bg-rose-700 transition-colors shadow-lg shadow-rose-600/10 flex items-center justify-center gap-2"
            >
              Verify Passcode <Unlock className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 2. UNLOCKED VIEW
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-12">
      
      {/* LEFT COLUMN: AI PARAMETERS FORM */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between space-y-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-white font-bold text-lg">
              <Brain className="w-5 h-5 text-mint" />
              <span>AI System Behavior</span>
            </div>
            <span className="text-[10px] uppercase font-bold text-mint bg-mint/10 border border-mint/20 px-2 py-0.5 rounded flex items-center gap-1">
              <Unlock className="w-2.5 h-2.5" /> Admin Access
            </span>
          </div>

          {/* System Instruction Prompt Textarea */}
          <div className="space-y-2">
            <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">System Instructions (System Prompt)</label>
            <textarea 
              rows={10}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-slate-200 leading-relaxed font-mono resize-none focus:outline-none focus:border-mint"
              placeholder="Enter system prompt for therapy AI agent..."
            />
          </div>

          {/* Tone Selector */}
          <div className="space-y-2">
            <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">AI Conversation Tone</label>
            <div className="grid grid-cols-2 gap-3">
              {(['compassionate', 'honest', 'hopeful', 'practical'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTone(t)}
                  className={`py-3 px-4 rounded-xl text-xs font-semibold border capitalize transition-all ${
                    tone === t 
                      ? 'bg-mint/10 border-mint text-mint shadow-md shadow-mint/5' 
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-850/50'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Safety Safeguards */}
          <div className="space-y-2">
            <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Crisis Safety Safeguards</label>
            <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-200">Auto Handover to Human Operator</h4>
                <p className="text-[10px] text-slate-500 mt-1">Triggers automatically on severe keywords.</p>
              </div>
              <select 
                value={safetyThreshold}
                onChange={(e) => setSafetyThreshold(e.target.value as any)}
                className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-300 font-medium focus:outline-none focus:border-mint"
              >
                <option value="low">Low (Logs only)</option>
                <option value="medium">Medium</option>
                <option value="high">High (Immediate handover)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="border-t border-slate-800/60 pt-4 flex items-center justify-between gap-4">
          <p className="text-[10px] text-slate-500">
            Changing behavioral settings immediately impacts all active AI conversations.
          </p>
          <button 
            onClick={handleSaveConfig}
            className="bg-mint hover:bg-mint-dark text-white font-bold px-6 py-3 rounded-xl text-xs transition-all flex items-center gap-1.5 shadow-lg shadow-mint/15 shrink-0"
          >
            {saveSuccess ? 'Changes Saved!' : 'Save System Prompt'}
            <Save className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* RIGHT COLUMN: SANDBOX INTERACTIVE PLAYGROUND */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between h-[calc(100vh-12rem)] shadow-lg">
        
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-white font-bold text-lg">
            <MessageSquare className="w-5 h-5 text-purple-400" />
            <span>Behavior Sandbox</span>
          </div>
          <span className="text-[9px] uppercase font-bold text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5 animate-pulse" /> Sandbox
          </span>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto my-4 space-y-3 pr-2 scrollbar-thin">
          {sandboxMessages.map((msg) => (
            <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-slate-800 text-slate-200 rounded-tr-none'
                  : msg.content.includes('SAFETY')
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-tl-none font-medium'
                    : 'bg-purple-600/30 text-purple-100 border border-purple-500/20 rounded-tl-none'
              }`}>
                {msg.content}
              </div>
              <span className="text-[9px] text-slate-500 font-semibold mt-1">
                {msg.sender === 'user' ? 'User Tester' : 'Behavior AI'}
              </span>
            </div>
          ))}
        </div>

        {/* Input Form */}
        <form onSubmit={handlePlaygroundSend} className="bg-slate-950 border border-slate-850 rounded-xl p-2 flex items-center gap-2">
          <input 
            type="text" 
            value={sandboxInput}
            onChange={(e) => setSandboxInput(e.target.value)}
            placeholder="Type a message to test behavior (e.g. I feel stressed)"
            className="flex-1 bg-transparent px-3 py-2 text-xs text-slate-200 outline-none placeholder:text-slate-600"
          />
          <button 
            type="submit"
            className="bg-purple-600 text-white p-2.5 rounded-lg hover:bg-purple-700 transition-colors shadow-md shadow-purple-600/10 shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

      </div>

    </div>
  );
}
