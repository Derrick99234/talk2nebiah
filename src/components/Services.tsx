'use client';

import { motion } from 'framer-motion';
import { Ear, Users, BookOpen } from 'lucide-react';

export default function Services() {
  const services = [
    {
      icon: <Ear className="w-8 h-8" />,
      title: "One-on-One Peer Support",
      description: "Connect with a trained peer support listener who can offer a compassionate ear and share their own experiences.",
      color: "bg-blue-50 text-blue-600"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Group Support Sessions",
      description: "Join themed group discussions on managing anxiety, coping with burnout, and navigating life transitions.",
      color: "bg-purple-50 text-purple-600"
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Workshops & Resources",
      description: "Access workshops and a library of resources on mindfulness, stress-reduction techniques, and building healthy habits.",
      color: "bg-orange-50 text-orange-600"
    }
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
            Practical support and guidance designed for your unique mental wellness journey.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
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
          <p className="text-gray-600 text-sm">
            <strong>Please note:</strong> Our services are designed for peer support and are not a substitute for professional medical advice, diagnosis, or treatment. If you are in crisis, please contact a mental health professional or a crisis hotline.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
