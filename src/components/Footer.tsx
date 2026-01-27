'use client';

import { Instagram, Twitter, Facebook, ArrowUp } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gray-900 text-white pt-20 pb-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start mb-16 gap-10">
          
          <div className="max-w-sm">
            <h3 className="text-2xl font-bold mb-6 text-mint">Talk2Nebiah</h3>
            <p className="text-gray-400 leading-relaxed mb-6">
              A safe space for real conversations about real struggles. Join our community and find your path to healing.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-mint hover:text-white transition-all">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-mint hover:text-white transition-all">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-mint hover:text-white transition-all">
                <Facebook size={18} />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-12 w-full md:w-auto">
            <div>
              <h4 className="text-lg font-bold mb-6 text-white">Company</h4>
              <ul className="space-y-4">
                <li><a href="#about" className="text-gray-400 hover:text-mint transition-colors">About Us</a></li>
                <li><a href="#services" className="text-gray-400 hover:text-mint transition-colors">Services</a></li>
                <li><a href="#pricing" className="text-gray-400 hover:text-mint transition-colors">Pricing</a></li>
                <li><a href="#contact" className="text-gray-400 hover:text-mint transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-6 text-white">Legal</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-gray-400 hover:text-mint transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-mint transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-gray-400 hover:text-mint transition-colors">Disclaimer</a></li>
              </ul>
            </div>
          </div>

        </div>

        <div className="border-t border-gray-800 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-500 text-sm">
            &copy; {currentYear} Talk2Nebiah. All rights reserved.
          </p>
          
          <button 
            onClick={scrollToTop}
            className="flex items-center gap-2 text-gray-400 hover:text-mint transition-colors text-sm"
          >
            Back to top <ArrowUp size={16} />
          </button>
        </div>
      </div>
    </footer>
  );
}
