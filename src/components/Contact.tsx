'use client';

import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Mail, Instagram, Twitter, Facebook, Send, CheckCircle, AlertCircle } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: 'General Inquiry', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSending(true);
    setError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setSent(true);
        setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' });
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to send message');
      }
    } catch {
      setError('Connection error. Please try again.');
    } finally {
      setSending(false);
    }
  }

  return (
    <section id="contact" className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">
          
          <div className="p-10 md:p-16 bg-mint-dark text-white relative overflow-hidden">
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
                      <a href="https://instagram.com/talk2nebiah" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="bg-white/10 p-2 rounded-full hover:bg-white hover:text-mint-dark transition-all">
                        <Instagram size={20} />
                      </a>
                      <a href="https://twitter.com/talk2nebiah" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="bg-white/10 p-2 rounded-full hover:bg-white hover:text-mint-dark transition-all">
                        <Twitter size={20} />
                      </a>
                      <a href="https://facebook.com/talk2nebiah" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="bg-white/10 p-2 rounded-full hover:bg-white hover:text-mint-dark transition-all">
                        <Facebook size={20} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="p-10 md:p-16 bg-white">
            {sent ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                <CheckCircle className="w-16 h-16 text-mint" />
                <h3 className="text-2xl font-bold text-gray-800">Message Sent!</h3>
                <p className="text-gray-500">Thank you for reaching out. We'll get back to you shortly.</p>
                <button onClick={() => setSent(false)} className="text-mint font-semibold hover:underline">Send another message</button>
              </div>
            ) : (
              <motion.form 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-6"
                onSubmit={handleSubmit}
              >
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Send us a Message</h3>
                
                {error && (
                  <div className="bg-rose-50 border border-rose-200 text-rose-600 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" /> {error}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="contact-name" className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input 
                      id="contact-name"
                      type="text" 
                      required
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-mint focus:ring-2 focus:ring-mint/20 transition-all outline-none"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input 
                      id="contact-email"
                      type="email" 
                      required
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-mint focus:ring-2 focus:ring-mint/20 transition-all outline-none"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-subject" className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <select 
                    id="contact-subject"
                    value={formData.subject}
                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-mint focus:ring-2 focus:ring-mint/20 transition-all outline-none bg-white"
                  >
                    <option>General Inquiry</option>
                    <option>Support Session</option>
                    <option>Partnership</option>
                    <option>Feedback</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea 
                    id="contact-message"
                    rows={4}
                    required
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-mint focus:ring-2 focus:ring-mint/20 transition-all outline-none resize-none"
                    placeholder="How can we help you?"
                  ></textarea>
                </div>

                <button 
                  type="submit"
                  disabled={sending}
                  className="w-full bg-mint-dark text-white font-bold py-4 rounded-lg hover:bg-mint transition-colors shadow-lg flex items-center justify-center gap-2 group disabled:opacity-50"
                >
                  {sending ? 'Sending...' : 'Send Message'}
                  <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
