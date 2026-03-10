"use client";

import { motion } from "framer-motion";
import { Heart, MessageCircle, Sparkles } from "lucide-react";

export default function About() {
  const features = [
    {
      icon: <Heart className="w-6 h-6 text-mint" />,
      title: "Compassionate Care",
      description:
        "We listen without judgment, offering a safe harbor for your thoughts.",
    },
    {
      icon: <MessageCircle className="w-6 h-6 text-mint" />,
      title: "Chat-Based Support",
      description:
        "Private, text-based sessions designed to help you talk through what you’re facing and receive supportive guidance.",
    },
    {
      icon: <Sparkles className="w-6 h-6 text-mint" />,
      title: "Growth & Healing",
      description:
        "Find the tools and support you need to rediscover your inner resilience.",
    },
  ];

  return (
    <section
      id="about"
      className="md:p-24 p-10 bg-white relative overflow-hidden"
    >
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:w-1/2"
          >
            <span className="text-mint font-bold uppercase tracking-wider text-sm">
              About Us
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mt-2 mb-6">
              More Than Just a <br />
              <span className="text-gradient">Listening Ear</span>
            </h2>
            <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
              <p>
                Talk2Nebiah was founded on a simple but powerful belief: no one
                should have to suffer in silence. Mental health is a universal
                human experience that touches everyone—from children to adults,
                from parents to young people finding their way in life.
              </p>
              <p>
                Our mission is to break the stigma surrounding mental health by
                creating a safe space for honest, judgment-free conversations.
                Talk2Nebiah is not a platform for clinical diagnosis or medical
                prescriptions. Instead, it is a supportive space where people
                can learn practical coping techniques, talk through real-life
                challenges, and receive thoughtful guidance in difficult
                moments.
              </p>
              <p>
                Whether you are going through anxiety, postpartum depression,
                emotional stress, or simply need someone to talk to, you are not
                alone. Through our 24/7 one-on-one chat support, you can speak
                privately with someone who will listen, offer encouragement, and
                share practical tools that may help you navigate what you’re
                experiencing.
              </p>
              <p>
                Sometimes, what people need most is a safe space to be heard,
                understood, and supported without judgment—and that is the heart
                of Talk2Nebiah.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <p className="text-3xl font-bold text-mint-dark">100%</p>
                <p className="text-sm text-gray-500">Confidential & Safe</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <p className="text-3xl font-bold text-mint-dark">24/7</p>
                <p className="text-sm text-gray-500">Chat Support</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:w-1/2 w-full"
          >
            <div className="grid gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2, duration: 0.5 }}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex items-start gap-4 group"
                >
                  <div className="p-3 bg-mint-light rounded-xl group-hover:bg-mint group-hover:text-white transition-colors">
                    <div className="group-hover:text-white transition-colors">
                      {feature.icon}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
