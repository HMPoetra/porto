import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Skills from '@/components/Skills';
import Experience from '@/components/Experience';
import Projects from '@/components/Projects';
import Certifications from '@/components/Certifications';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import BackgroundParticles from '@/components/BackgroundParticles';

export default function Home() {
  return (
    <main id="main-content" className="relative min-h-screen bg-brut-bg">
      <div id="home" className="absolute top-0 left-0 h-1 w-1 pointer-events-none" />
      <BackgroundParticles />
      <Navbar />
      <div className="relative z-10 pt-28">
        <Hero />
        <Skills />
        <Experience />
        <Projects />
        <Certifications />
        <Contact />
        <Footer />
      </div>
    </main>
  );
}
