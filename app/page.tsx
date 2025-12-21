import Header from '@/components/Header'
import Hero from '@/components/Hero'
import ProductCarousel from '@/components/ProductCarousel'
import About from '@/components/About'
import Products from '@/components/Products'
import Applications from '@/components/Applications'
import Why from '@/components/Why'
import Cooperation from '@/components/Cooperation'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
import ScrollReveal from '@/components/ScrollReveal'
import ScrollToTop from '@/components/ScrollToTop'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <ProductCarousel />
      <ScrollReveal>
        <About />
      </ScrollReveal>
      <ScrollReveal>
        <Products />
      </ScrollReveal>
      <ScrollReveal>
        <Applications />
      </ScrollReveal>
      <ScrollReveal>
        <Why />
      </ScrollReveal>
      <ScrollReveal>
        <Cooperation />
      </ScrollReveal>
      <ScrollReveal>
        <Contact />
      </ScrollReveal>
      <Footer />
      <ScrollToTop />
    </main>
  )
}
