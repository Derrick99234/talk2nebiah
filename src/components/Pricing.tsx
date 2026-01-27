'use client';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

export default function Pricing() {
  const handlePaystack = (plan: string) => {
    // This is a placeholder for Paystack integration
    // In a real app, you would initialize Paystack Inline or Redirect here
    alert(`Initiating payment for ${plan}. In a production environment, this would open the Paystack payment gateway.`);
  };

  const plans = [
    {
      name: "Peer Session",
      price: "₦5,000",
      description: "One-on-one session with a trained listener.",
      features: [
        "45-minute confidential chat",
        "Judgment-free environment",
        "Emotional support",
        "Follow-up resources"
      ],
      popular: false,
      buttonText: "Book Session"
    },
    {
      name: "Monthly Support",
      price: "₦15,000",
      description: "Ongoing support for your mental wellness journey.",
      features: [
        "4 sessions per month",
        "Priority scheduling",
        "Access to all workshops",
        "Daily check-ins"
      ],
      popular: true,
      buttonText: "Subscribe Now"
    },
    {
      name: "Community Donation",
      price: "Any Amount",
      description: "Support our mission to keep this space safe and accessible.",
      features: [
        "Help sponsor a session for others",
        "Support platform maintenance",
        "Community outreach",
        "Receive a quarterly impact report"
      ],
      popular: false,
      buttonText: "Donate Now"
    }
  ];

  return (
    <section id="pricing" className="py-24 bg-white relative">
      <div className="absolute inset-0 bg-mint-light/30 skew-y-3 transform origin-top-left -z-10 h-3/4"></div>
      
      <div className="container mx-auto px-4">
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
            Simple, Transparent <span className="text-gradient">Pricing</span>
          </motion.h2>
          <p className="text-xl text-gray-600">
            Choose a plan that works for you, or support our mission with a donation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -10 }}
              className={`relative bg-white rounded-2xl p-8 border ${plan.popular ? 'border-mint shadow-xl ring-4 ring-mint/10' : 'border-gray-200 shadow-lg'} flex flex-col`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-mint text-white px-4 py-1 rounded-full text-sm font-bold shadow-md">
                  Most Popular
                </div>
              )}
              
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
              <div className="flex items-baseline mb-4">
                <span className="text-4xl font-extrabold text-gray-900">{plan.price}</span>
                {plan.price !== "Any Amount" && <span className="text-gray-500 ml-1">/session</span>}
              </div>
              <p className="text-gray-600 mb-6">{plan.description}</p>
              
              <ul className="space-y-4 mb-8 flex-1">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <Check className="w-5 h-5 text-mint mr-3 shrink-0" />
                    <span className="text-gray-600 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button
                onClick={() => handlePaystack(plan.name)}
                className={`w-full py-4 rounded-xl font-bold transition-all shadow-md hover:shadow-lg ${
                  plan.popular 
                    ? 'bg-mint text-white hover:bg-mint-dark' 
                    : 'bg-gray-50 text-gray-900 hover:bg-gray-100'
                }`}
              >
                {plan.buttonText}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
