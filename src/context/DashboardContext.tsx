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
  status: 'PENDING' | 'RECEIVED' | 'DECLINED';
  date: string;
  geoCountry: string;
}

export interface PricingConfig {
  singleNaira: number;
  singleUsd: number;
  monthlyNaira: number;
  monthlyUsd: number;
}

export interface AiBehaviorConfig {
  prompt: string;
  tone: 'compassionate' | 'honest' | 'hopeful' | 'practical';
  safetyThreshold: 'low' | 'medium' | 'high';
  crisisEscalation: boolean;
}

export interface WhatsAppConfig {
  phoneNumberId: string;
  accessToken: string;
  webhookUrl: string;
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
  
  // Configurations
  pricing: PricingConfig;
  aiBehavior: AiBehaviorConfig;
  whatsappConfig: WhatsAppConfig;
  
  // Actions
  sendMessage: (patientId: string, content: string, senderType: 'HUMAN' | 'AI') => void;
  togglePatientStatus: (patientId: string) => void;
  updatePatientNotes: (sessionId: string, notes: string) => void;
  toggleSessionStatus: (sessionId: string) => void;
  updatePricing: (config: Partial<PricingConfig>) => void;
  updateAiBehavior: (config: Partial<AiBehaviorConfig>) => void;
  updateWhatsAppConfig: (config: Partial<WhatsAppConfig>) => void;
  addMockIncomingMessage: (patientId: string, content: string) => void;
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

  const [pricing, setPricing] = useState<PricingConfig>({
    singleNaira: 15000,
    singleUsd: 20,
    monthlyNaira: 120000,
    monthlyUsd: 150
  });

  const [aiBehavior, setAiBehavior] = useState<AiBehaviorConfig>({
    prompt: '',
    tone: 'compassionate',
    safetyThreshold: 'high',
    crisisEscalation: true
  });

  const [whatsappConfig, setWhatsappConfig] = useState<WhatsAppConfig>({
    phoneNumberId: '',
    accessToken: '',
    webhookUrl: ''
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
        setWhatsappConfig(configData.whatsappConfig);
      }

      if (paymentsRes.ok) {
        const paymentsData = await paymentsRes.json();
        setPayments(paymentsData);
      }

      if (convosRes.ok) {
        const convosData = await convosRes.json();
        setSessions(convosData);
        
        // Extract patients and messages from sessions
        const extractedPatients: Patient[] = [];
        const extractedMessages: Message[] = [];
        const patientMap = new Map<string, Patient>();

        convosData.forEach((session: any) => {
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    detectLocation();
  }, []);

  // Save helpers
  const saveToStorage = (key: string, data: any) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(data));
    }
  };

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
    // In production, this would call an API to send via WhatsApp
    console.log(`Sending message to ${patientId}: ${content} as ${senderType}`);
    // Refresh data after sending
    setTimeout(fetchData, 1000);
  };

  const togglePatientStatus = (patientId: string) => {
    setPatients(prev => prev.map(p => p.id === patientId ? { ...p, status: p.status === 'AI_RESPONDING' ? 'HUMAN_OPERATOR' : 'AI_RESPONDING' } : p));
  };

  const updatePatientNotes = async (sessionId: string, notes: string) => {
    setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, notes } : s));
  };

  const toggleSessionStatus = async (sessionId: string) => {
    setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, status: s.status === 'ONGOING' ? 'RESOLVED' : 'ONGOING' } : s));
  };

  const updatePricing = async (config: Partial<PricingConfig>) => {
    const newPricing = { ...pricing, ...config };
    setPricing(newPricing);
    try {
      await fetch('/api/dashboard/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pricing: newPricing, aiBehavior, whatsappConfig })
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
        body: JSON.stringify({ pricing, aiBehavior: newAiBehavior, whatsappConfig })
      });
    } catch (error) {
      console.error('Failed to update AI behavior on server:', error);
    }
  };

  const updateWhatsAppConfig = async (config: Partial<WhatsAppConfig>) => {
    const newWhatsappConfig = { ...whatsappConfig, ...config };
    setWhatsappConfig(newWhatsappConfig);
    try {
      await fetch('/api/dashboard/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pricing, aiBehavior, whatsappConfig: newWhatsappConfig })
      });
    } catch (error) {
      console.error('Failed to update WhatsApp config on server:', error);
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
      pricing,
      aiBehavior,
      whatsappConfig,
      sendMessage,
      togglePatientStatus,
      updatePatientNotes,
      toggleSessionStatus,
      updatePricing,
      updateAiBehavior,
      updateWhatsAppConfig,
      addMockIncomingMessage: () => {} 
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
