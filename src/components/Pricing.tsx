"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useDashboard } from "@/context/DashboardContext";
import { useState, useEffect } from "react";
import { X, User, Mail, CreditCard } from "lucide-react";

declare global {
  interface Window {
    PaystackPop: any;
  }
}

interface PricingData {
  singleNaira: number;
  singleUsd: number;
  monthlyNaira: number;
  monthlyUsd: number;
}

export default function Pricing() {
  const { currency } = useDashboard();
  const [pricing, setPricing] = useState<PricingData>({
    singleNaira: 15000,
    singleUsd: 20,
    monthlyNaira: 120000,
    monthlyUsd: 150,
  });
  const [loading, setLoading] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{name: string, amount: number} | null>(null);
  const [userData, setUserData] = useState({ name: "", email: "" });

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    fetch('/api/pricing')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) setPricing(data);
      })
      .catch(() => {});
  }, []);

  const plans = [
    {
      name: "One Session",
      price: currency === "NGN" 
        ? `₦${pricing.singleNaira.toLocaleString()}` 
        : `$${pricing.singleUsd}`,
      amountVal: currency === "NGN" ? pricing.singleNaira : pricing.singleUsd,
      popular: false,
    },
    {
      name: "Monthly Plan",
      price: currency === "NGN" 
        ? `₦${pricing.monthlyNaira.toLocaleString()}` 
        : `$${pricing.monthlyUsd}`,
      amountVal: currency === "NGN" ? pricing.monthlyNaira : pricing.monthlyUsd,
      popular: true,
    },
  ];

  const handleSubscribeClick = (planName: string, amount: number) => {
    setSelectedPlan({ name: planName, amount });
    setShowModal(true);
  };

  const handlePaystack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan || !userData.email || !userData.name) return;

    setShowModal(false);
    setLoading(selectedPlan.name);

    const handler = window.PaystackPop.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
      email: userData.email,
      amount: selectedPlan.amount * 100, // in kobo/cents
      currency: currency,
      metadata: {
        plan_name: selectedPlan.name,
        custom_fields: [
          {
            display_name: "Full Name",
            variable_name: "full_name",
            value: userData.name
          }
        ]
      },
      callback: function(response: any) {
        setLoading(null);
        alert('Payment successful! Reference: ' + response.reference + '. Check your email for your WhatsApp access token.');
      },
      onClose: function() {
        setLoading(null);
      }
    });
    handler.openIframe();
  };

  return (
    <section id="pricing" className="py-24 bg-white relative">
      <div className="absolute inset-0 bg-mint-light/30 skew-y-3 transform origin-top-left -z-10 h-3/4"></div>

      <div className="container mx-auto px-4">
        {/* MODAL */}
        <AnimatePresence>
          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden"
              >
                <button 
                  onClick={() => setShowModal(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>

                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-mint/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <CreditCard className="w-8 h-8 text-mint" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Finalize Subscription</h3>
                  <p className="text-gray-500 text-sm mt-1">You're subscribing to the <span className="text-mint font-semibold">{selectedPlan?.name}</span></p>
                </div>

                <form onSubmit={handlePaystack} className="space-y-4">
                  <div className="space-y-1">
                    <label htmlFor="pricing-name" className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input 
                        id="pricing-name"
                        required
                        type="text" 
                        value={userData.name}
                        onChange={(e) => setUserData({...userData, name: e.target.value})}
                        placeholder="John Doe"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-mint focus:ring-4 focus:ring-mint/5 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="pricing-email" className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input 
                        id="pricing-email"
                        required
                        type="email" 
                        value={userData.email}
                        onChange={(e) => setUserData({...userData, email: e.target.value})}
                        placeholder="john@example.com"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-mint focus:ring-4 focus:ring-mint/5 transition-all"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-mint text-white font-bold py-4 rounded-xl mt-4 hover:bg-mint-dark transition-all shadow-lg shadow-mint/20 active:scale-[0.98]"
                  >
                    Proceed to Payment
                  </button>

                  <p className="text-[10px] text-center text-gray-400 leading-relaxed px-4">
                    By clicking the button above, you agree to our terms of service and will be redirected to Paystack's secure payment gateway.
                  </p>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <div className="text-center mb-16 max-w-2xl mx-auto">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-mint-dark font-bold uppercase tracking-wider text-sm"
          >
            Invest In Yourself
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold text-gray-900 mt-2 mb-4"
          >
            What does it <span className="text-gradient">Cost ?</span>
          </motion.h2>
          <p className="text-xl text-gray-600">
            Choose a plan and subscribe to start your support journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -10 }}
              className={`relative bg-white rounded-2xl p-8 border ${plan.popular ? "border-mint shadow-xl ring-4 ring-mint/10" : "border-gray-200 shadow-lg"} flex flex-col`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-mint text-white px-4 py-1 rounded-full text-sm font-bold shadow-md">
                  Most Popular
                </div>
              )}

              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {plan.name}
              </h3>
              <div className="flex items-baseline mb-8">
                <span className="text-4xl font-extrabold text-gray-900">
                  {plan.price}
                </span>
                <span className="text-gray-500 ml-1">
                  {plan.name === "Monthly Plan" ? "/month" : "/session"}
                </span>
              </div>

              <button
                disabled={loading !== null}
                onClick={() => handleSubscribeClick(plan.name, plan.amountVal)}
                className={`w-full py-4 rounded-xl font-bold transition-all shadow-md hover:shadow-lg ${
                  loading === plan.name ? "opacity-50 cursor-not-allowed" : ""
                } ${
                  plan.popular
                    ? "bg-mint text-white hover:bg-mint-dark"
                    : "bg-gray-50 text-gray-900 hover:bg-gray-100"
                }`}
              >
                {loading === plan.name ? "Processing..." : "Subscribe"}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

