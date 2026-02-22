'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

export default function Founder() {
  return (
    <section id="founder" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl shadow-xl">
              <Image
                src="/Emmanuella%20Okorodudu.jpeg"
                alt="Portrait of Emmanuella Okorodudu, Founder of Talk2Nebiah"
                fill
                sizes="(max-width: 1024px) 100vw, 520px"
                className="object-cover"
                priority={false}
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/30 via-black/0 to-black/0" />
            </div>

            <div className="absolute -bottom-6 -right-6 hidden md:block">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 max-w-xs">
                <div className="flex items-start gap-3">
                  <div className="shrink-0 rounded-xl bg-mint-light p-3">
                    <Quote className="h-5 w-5 text-mint-dark" />
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Vulnerability is not weakness. Conversations can spark transformation.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="lg:pl-6"
          >
            <span className="text-mint-dark font-bold uppercase tracking-wider text-sm">
              Meet The Founder
            </span>
            <h2 className="mt-2 text-3xl md:text-5xl font-bold text-gray-900">
              Emmanuella Okorodudu
            </h2>
            <p className="mt-4 text-lg text-gray-600 leading-relaxed">
              Emmanuella Okorodudu is the Founder of TalktoNebiah, a people-centered platform committed
              to creating safe, honest conversations around mental well-being, personal growth, and
              emotional healing.
            </p>

            <div className="mt-8 space-y-6 text-gray-600 leading-relaxed">
              <p>
                Driven by a deep passion for people, Emmanuella has always believed that no one
                should have to suffer in silence. Having personally battled seasons of depression,
                experienced bullying, and witnessed the damaging effects of abuse in the lives of
                others, she made a firm resolve to be part of the solution. Rather than allowing
                those experiences to harden her, she allowed them to shape her purpose.
              </p>
              <p>
                She believes that people are largely a product of how their minds are shaped. When
                the mind is strengthened, healed, and renewed, individuals can rise above their
                circumstances and become the best versions of themselves. For Emmanuella, situations
                do not define identity — growth does.
              </p>
              <p>
                Through TalktoNebiah, she is building a community where vulnerability is not
                weakness, conversations spark transformation, and every individual is reminded that
                their story is not over. Her mission is simple but profound: to see people live life
                to the fullest of their capacity and never be cut short — emotionally, mentally, or
                purposefully — before fully becoming who they were created to be.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
                <p className="text-sm font-semibold text-gray-900">Safe Space</p>
                <p className="mt-1 text-sm text-gray-600">Judgment-free support</p>
              </div>
              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
                <p className="text-sm font-semibold text-gray-900">Honest Talks</p>
                <p className="mt-1 text-sm text-gray-600">Real conversations</p>
              </div>
              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
                <p className="text-sm font-semibold text-gray-900">Growth</p>
                <p className="mt-1 text-sm text-gray-600">Healing and renewal</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

