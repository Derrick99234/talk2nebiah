'use client';

import { motion } from 'framer-motion';
import { MessageCircle, Clock, HeartHandshake, Users, BookOpen } from 'lucide-react';

export default function Services() {
  const services = [
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: 'One-on-One Peer Support',
      description:
        'We connect you with a trained mental health professional who is available to chat with you 24/7. Through confidential conversations, you can openly share what you’re going through and receive thoughtful guidance and support.',
      color: 'bg-mint-light text-mint-dark',
    },
    {
      icon: <HeartHandshake className="w-8 h-8" />,
      title: 'Chat-Based Counseling & Therapy',
      description:
        'All our counseling and therapy sessions take place via chat. During these conversations, the professional may:',
      bullets: [
        'Offer supportive counseling',
        'Share practical coping techniques',
        'Help you navigate emotional challenges',
        'Recommend escalation to appropriate professional services when needed',
      ],
      color: 'bg-blue-50 text-blue-600',
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Family Counseling (Chat-Based)',
      description:
        'We also offer family counseling sessions, conducted through chat. These sessions are designed to help families communicate better and work through challenges together. Talk2Nebiah does not operate a physical therapy platform—sessions are conducted online via chat.',
      color: 'bg-purple-50 text-purple-600',
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: 'Resource Recommendations',
      description:
        'Where helpful, we may recommend trusted resources, tools, or materials that can further support your mental and emotional well-being.',
      color: 'bg-orange-50 text-orange-600',
    },
  ];

  return (
    <section id="services" className="bg-gray-50 py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold text-gray-900 mb-4"
          >
            How We <span className="text-gradient">Support You</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600"
          >
            At Talk2Nebiah, we provide supportive and accessible mental health assistance through private chat-based sessions.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -10 }}
              className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all border border-gray-100"
            >
              <div className={`w-16 h-16 ${service.color} rounded-2xl flex items-center justify-center mb-6`}>
                {service.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">{service.title}</h3>
              <p className="text-gray-600 leading-relaxed mb-6">{service.description}</p>
              {'bullets' in service && Array.isArray(service.bullets) && (
                <ul className="space-y-2 mb-6">
                  {service.bullets.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-gray-600">
                      <span className="mt-2 h-2 w-2 rounded-full bg-mint shrink-0" />
                      <span className="text-sm leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              )}
              <a href="#contact" className="text-mint-dark font-semibold hover:text-mint transition-colors flex items-center gap-2 group">
                Learn more
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </a>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center max-w-3xl mx-auto bg-mint-light/50 p-6 rounded-xl border border-mint/10"
        >
          <div className="flex items-start gap-3 text-left">
            <div className="mt-0.5 rounded-lg bg-white p-2 border border-gray-100">
              <Clock className="h-5 w-5 text-mint-dark" />
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              Talk2Nebiah does not operate a physical therapy platform. All sessions are conducted online via private chat.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
