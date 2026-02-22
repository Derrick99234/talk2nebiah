"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-linear-to-br from-mint-light via-white to-mint-light/50 md:p-20 pt-20 p-10">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <motion.div
          animate={{ y: [0, 20, 0], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-20 -right-20 w-96 h-96 bg-mint/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ y: [0, -30, 0], opacity: [0.2, 0.4, 0.2] }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute top-40 -left-20 w-72 h-72 bg-mint-medium/20 rounded-full blur-3xl"
        />
      </div>

      <div className="container mx-auto px-4 z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-left"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-block px-4 py-1 bg-mint/10 rounded-full text-mint-dark font-semibold text-sm mb-6"
          >
            Mental Health & Peer Support
          </motion.div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-gray-900 leading-tight">
            Healing Starts With{" "}
            <span className="text-gradient">Conversation</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed max-w-xl">
            Talk2Nebiah is your safe space for real conversations about
            life&apos;s struggles. Connect, share, and find support for stress,
            anxiety, and burnout in a judgment-free community.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="#pricing"
              className="bg-mint text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-mint-dark transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-center"
            >
              Start Your Journey
            </Link>
            <Link
              href="#about"
              className="bg-white text-gray-700 border border-gray-200 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-50 transition-all shadow-sm hover:shadow-md text-center"
            >
              Learn More
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative h-[400px] md:h-[500px] w-full"
        >
          <div className="relative w-full h-full bg-linear-to-tr from-mint to-mint-medium rounded-4xl overflow-hidden shadow-2xl flex items-center justify-center">
            <div
              className="absolute inset-0 opacity-15"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.55) 1px, transparent 0)',
                backgroundSize: '18px 18px',
              }}
            />
            <div className="text-white text-center p-8">
              <svg
                className="w-32 h-32 mx-auto mb-6 opacity-90"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <p className="text-2xl font-semibold opacity-90">
                &quot;You are not alone.&quot;
              </p>
            </div>

            {/* Floating Elements */}
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-10 left-10 bg-white/20 backdrop-blur-md p-4 rounded-xl border border-white/30"
            >
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-white font-medium">Online Support</span>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 20, 0] }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
              className="absolute top-10 right-10 bg-white/20 backdrop-blur-md p-4 rounded-xl border border-white/30"
            >
              <span className="text-white font-medium">Safe Space</span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
