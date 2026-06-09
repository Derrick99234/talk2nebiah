import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <section className="py-24 bg-gradient-to-b from-mint-light/30 to-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-gray-500 mb-12">Last updated: June 2026</p>

          <div className="prose prose-lg max-w-none text-gray-700 space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">1. Information We Collect</h2>
              <p>When you use Talk2Nebiah, we may collect the following information:</p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li><strong>Personal Information:</strong> Your name, email address, and phone number when you make a payment or contact us.</li>
                <li><strong>Conversation Data:</strong> Messages you exchange with Nebiah, our AI mental health assistant, including text and any media you share.</li>
                <li><strong>Usage Data:</strong> Information about how you interact with our platform, including session duration and feature usage.</li>
                <li><strong>Payment Data:</strong> Payment processing is handled securely by Paystack. We do not store your credit card details.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">2. How We Use Your Information</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>To provide and maintain our AI-powered mental health support services.</li>
                <li>To process payments and authenticate your access via WhatsApp.</li>
                <li>To improve our AI responses and platform experience.</li>
                <li>To communicate with you regarding your account, payments, and support.</li>
                <li>To comply with legal obligations and protect our rights.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">3. Data Storage and Security</h2>
              <p>Your data is stored securely using industry-standard encryption. We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">4. Data Sharing</h2>
              <p>We do not sell your personal information. We may share data with trusted third parties who assist us in operating our platform (e.g., Paystack for payment processing, Google Cloud for AI services), subject to strict confidentiality agreements.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">5. Your Rights</h2>
              <p>You have the right to access, correct, or delete your personal data. To exercise these rights, contact us at <a href="mailto:info@talk2nebiah.com" className="text-mint hover:underline">info@talk2nebiah.com</a>.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">6. Changes to This Policy</h2>
              <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page.</p>
            </section>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
