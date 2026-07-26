import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import LogoMarquee from './components/LogoMarquee.jsx'
import Services from './components/Services.jsx'
import Industries from './components/Industries.jsx'
import WhyAdsmith from './components/WhyAdsmith.jsx'
import Process from './components/Process.jsx'
import Testimonials from './components/Testimonials.jsx'
import AutomationSpotlight from './components/AutomationSpotlight.jsx'
import Faq from './components/Faq.jsx'
import Contact from './components/Contact.jsx'
import Footer from './components/Footer.jsx'

export default function App() {
  return (
    <>
      <Navbar />
      <main id="main" tabIndex={-1} className="focus:outline-none">
        <Hero />
        <LogoMarquee />
        <Services />
        <Industries />
        <WhyAdsmith />
        <Process />
        <Testimonials />
        <AutomationSpotlight />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
