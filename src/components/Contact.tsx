  'use client';

import { motion } from 'framer-motion';
import { Mail, Instagram, Twitter, Facebook, Send } from 'lucide-react';

export default function Contact() {
  return (
    <section id="contact" className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">
          
          <div className="p-10 md:p-16 bg-mint-dark text-white relative overflow-hidden">
             {/* Abstract circles */}
             <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
             <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Get in Touch</h2>
              <p className="text-mint-light text-lg mb-12 leading-relaxed">
                We're here for you. Whether you have a question, need someone to talk to, or want to learn more about our services.
              </p>

              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white/10 rounded-lg">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Email Us</h3>
                    <a href="mailto:hello@talk2nebiah.com" className="text-mint-light hover:text-white transition-colors block">
                      hello@talk2nebiah.com
                    </a>
                    <a href="mailto:partnerships@talk2nebiah.com" className="text-mint-light hover:text-white transition-colors block mt-1 text-sm">
                      partnerships@talk2nebiah.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white/10 rounded-lg">
                    <Instagram className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Social Media</h3>
                    <div className="flex gap-4 mt-2">
                      <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-white hover:text-mint-dark transition-all">
                        <Instagram size={20} />
                      </a>
                      <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-white hover:text-mint-dark transition-all">
                        <Twitter size={20} />
                      </a>
                      <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-white hover:text-mint-dark transition-all">
                        <Facebook size={20} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="p-10 md:p-16 bg-white">
            <motion.form 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
              onSubmit={(e) => e.preventDefault()}
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Send us a Message</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-mint focus:ring-2 focus:ring-mint/20 transition-all outline-none"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input 
                    type="email" 
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-mint focus:ring-2 focus:ring-mint/20 transition-all outline-none"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <select className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-mint focus:ring-2 focus:ring-mint/20 transition-all outline-none bg-white">
                  <option>General Inquiry</option>
                  <option>Support Session</option>
                  <option>Partnership</option>
                  <option>Feedback</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea 
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-mint focus:ring-2 focus:ring-mint/20 transition-all outline-none resize-none"
                  placeholder="How can we help you?"
                ></textarea>
              </div>

              <button 
                type="submit"
                className="w-full bg-mint-dark text-white font-bold py-4 rounded-lg hover:bg-mint transition-colors shadow-lg flex items-center justify-center gap-2 group"
              >
                Send Message
                <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.form>
          </div>

        </div>
      </div>
    </section>
  );
}
