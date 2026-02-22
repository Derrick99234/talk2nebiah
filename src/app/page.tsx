import Header from '@/components/Header';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Founder from '@/components/Founder';
import Services from '@/components/Services';
import Pricing from '@/components/Pricing';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen selection:bg-mint selection:text-white">
      <Header />
      <Hero />
      <About />
      <Founder />
      <Services />
      <Pricing />
      <Contact />
      <Footer />
    </main>
  );
}
