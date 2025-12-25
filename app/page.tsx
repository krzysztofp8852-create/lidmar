import ContactBar from '@/components/ContactBar'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import ProductCarousel from '@/components/ProductCarousel'
import AboutCooperation from '@/components/AboutCooperation'
import Applications from '@/components/Applications'
import Why from '@/components/Why'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
import ScrollReveal from '@/components/ScrollReveal'

export default function Home() {
  return (
    <main className="min-h-screen">
      <ContactBar />
      <Header />
      <Hero />
      <ProductCarousel />
      <ScrollReveal>
        <AboutCooperation />
      </ScrollReveal>
      <ScrollReveal>
        <Applications />
      </ScrollReveal>
      <ScrollReveal>
        <Why />
      </ScrollReveal>
      <ScrollReveal>
        <Contact />
      </ScrollReveal>
      <Footer />
    </main>
  )
}
