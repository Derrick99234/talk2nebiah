'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

// Type Definitions
export interface Patient {
  id: string;
  name: string;
  whatsappNumber: string;
  activeStruggle: string;
  status: 'AI_RESPONDING' | 'HUMAN_OPERATOR';
  avatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unread?: boolean;
}

export interface Message {
  id: string;
  patientId: string;
  content: string;
  senderType: 'PATIENT' | 'AI' | 'HUMAN';
  timestamp: string;
}

export interface Session {
  id: string;
  patientId: string;
  patientName: string;
  struggleCategory: string;
  status: 'ONGOING' | 'RESOLVED';
  feedbackRating?: number;
  notes?: string;
  startDate: string;
  resolvedDate?: string;
}

export interface Payment {
  id: string;
  patientId: string;
  patientName: string;
  planName: string;
  amount: number;
  currency: 'NGN' | 'USD';
  status: 'PENDING' | 'SUCCESSFUL' | 'FAILED';
  date: string;
  geoCountry: string;
}

export interface PricingConfig {
  singleNaira: number;
  singleUsd: number;
  weeklyNaira: number;
  weeklyUsd: number;
  monthlyNaira: number;
  monthlyUsd: number;
}

export interface AiBehaviorConfig {
  prompt: string;
  tone: 'compassionate' | 'honest' | 'hopeful' | 'practical';
  safetyThreshold: 'low' | 'medium' | 'high';
  crisisEscalation: boolean;
}

interface DashboardContextType {
  // Geolocation / Currency State
  currency: 'NGN' | 'USD';
  detectedCountry: string;
  setCurrency: (c: 'NGN' | 'USD') => void;
  detectLocation: () => void;
  
  // Data Lists
  patients: Patient[];
  messages: Message[];
  sessions: Session[];
  payments: Payment[];
  
  // Loading / Error
  loading: boolean;
  error: string | null;

  // Configurations
  pricing: PricingConfig;
  aiBehavior: AiBehaviorConfig;

  // Actions
  sendMessage: (patientId: string, content: string, senderType: 'HUMAN' | 'AI') => void;
  togglePatientStatus: (patientId: string) => void;
  updatePatientNotes: (sessionId: string, notes: string) => void;
  toggleSessionStatus: (sessionId: string) => void;
  updatePricing: (config: Partial<PricingConfig>) => void;
  updateAiBehavior: (config: Partial<AiBehaviorConfig>) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<'NGN' | 'USD'>('USD');
  const [detectedCountry, setDetectedCountry] = useState<string>('Global');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [pricing, setPricing] = useState<PricingConfig>({
    singleNaira: 20000,
    singleUsd: 20,
    weeklyNaira: 59000,
    weeklyUsd: 49.3,
    monthlyNaira: 120000,
    monthlyUsd: 100
  });

  const [aiBehavior, setAiBehavior] = useState<AiBehaviorConfig>({
    prompt: '',
    tone: 'compassionate',
    safetyThreshold: 'high',
    crisisEscalation: true
  });

  // Fetch data from API
  const fetchData = async () => {
    try {
      setLoading(true);
      const [paymentsRes, convosRes, configRes] = await Promise.all([
        fetch('/api/dashboard/payments'),
        fetch('/api/dashboard/conversations'),
        fetch('/api/dashboard/config')
      ]);

      if (configRes.ok) {
        const configData = await configRes.json();
        setPricing(configData.pricing);
        setAiBehavior(configData.aiBehavior);
      }

      if (paymentsRes.ok) {
        const paymentsData = await paymentsRes.json();
        setPayments(paymentsData.data || paymentsData);
      }

      if (convosRes.ok) {
        const convosData = await convosRes.json();
        const sessionsData = convosData.data || convosData;
        setSessions(sessionsData);
        
        // Extract patients and messages from sessions
        const extractedPatients: Patient[] = [];
        const extractedMessages: Message[] = [];
        const patientMap = new Map<string, Patient>();

        sessionsData.forEach((session: any) => {
          if (!patientMap.has(session.patientId)) {
            const lastMsg = session.messages[session.messages.length - 1];
            const patient: Patient = {
              id: session.patientId,
              name: session.patientName,
              whatsappNumber: '', // Would need to fetch separately or include in API
              activeStruggle: session.struggleCategory,
              status: 'AI_RESPONDING', // Default
              avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(session.patientName)}&background=random`,
              lastMessage: lastMsg?.content || 'No messages',
              lastMessageTime: lastMsg ? new Date(lastMsg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
            };
            patientMap.set(session.patientId, patient);
            extractedPatients.push(patient);
          }
          
          session.messages.forEach((msg: any) => {
            extractedMessages.push({
              id: msg.id,
              patientId: session.patientId,
              content: msg.content,
              senderType: msg.senderType,
              timestamp: msg.timestamp
            });
          });
        });

        setPatients(extractedPatients);
        setMessages(extractedMessages);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    detectLocation();
  }, []);

  const setCurrency = (c: 'NGN' | 'USD') => {
    setCurrencyState(c);
  };

  const detectLocation = async () => {
    try {
      const res = await fetch('https://ipapi.co/json/');
      if (res.ok) {
        const data = await res.json();
        setDetectedCountry(data.country_name || 'Nigeria');
        if (data.country_code === 'NG') {
          setCurrency('NGN');
        } else {
          setCurrency('USD');
        }
      }
    } catch (e) {
      setDetectedCountry('Global');
      setCurrency('USD');
    }
  };

  const sendMessage = async (patientId: string, content: string, senderType: 'HUMAN' | 'AI') => {
    try {
      // Find the active session for this patient
      const session = sessions.find(s => s.patientId === patientId && s.status === 'ONGOING');
      if (!session) {
        console.error('No active session found for patient', patientId);
        return;
      }
      const res = await fetch('/api/dashboard/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: session.id, content, senderType }),
      });
      if (res.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      setError('Failed to send message');
    }
  };

  const togglePatientStatus = async (patientId: string) => {
    const newStatus = patients.find(p => p.id === patientId)?.status === 'AI_RESPONDING' ? 'HUMAN_OPERATOR' : 'AI_RESPONDING';
    setPatients(prev => prev.map(p => p.id === patientId ? { ...p, status: newStatus } : p));
  };

  const updatePatientNotes = async (sessionId: string, notes: string) => {
    setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, notes } : s));
    try {
      await fetch(`/api/dashboard/sessions/${sessionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes }),
      });
    } catch (error) {
      console.error('Failed to update notes:', error);
      setError('Failed to save notes');
    }
  };

  const toggleSessionStatus = async (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    const newStatus = session?.status === 'ONGOING' ? 'RESOLVED' : 'ONGOING';
    setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, status: newStatus } : s));
    try {
      await fetch(`/api/dashboard/sessions/${sessionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (error) {
      console.error('Failed to toggle session status:', error);
      setError('Failed to update session status');
    }
  };

  const updatePricing = async (config: Partial<PricingConfig>) => {
    const newPricing = { ...pricing, ...config };
    setPricing(newPricing);
    try {
      await fetch('/api/dashboard/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pricing: newPricing, aiBehavior })
      });
    } catch (error) {
      console.error('Failed to update pricing on server:', error);
    }
  };

  const updateAiBehavior = async (config: Partial<AiBehaviorConfig>) => {
    const newAiBehavior = { ...aiBehavior, ...config };
    setAiBehavior(newAiBehavior);
    try {
      await fetch('/api/dashboard/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pricing, aiBehavior: newAiBehavior })
      });
    } catch (error) {
      console.error('Failed to update AI behavior on server:', error);
    }
  };

  return (
    <DashboardContext.Provider value={{
      currency,
      detectedCountry,
      setCurrency,
      detectLocation,
      patients,
      messages,
      sessions,
      payments,
      loading,
      error,
      pricing,
      aiBehavior,
      sendMessage,
      togglePatientStatus,
      updatePatientNotes,
      toggleSessionStatus,
      updatePricing,
      updateAiBehavior,
    }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};
