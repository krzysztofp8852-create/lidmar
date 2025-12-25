'use client'

export default function Footer() {
  return (
    <footer className="bg-primary-dark text-white py-12">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4">LiD-MAR</h3>
            <p className="text-gray-300">
              Producent pasty BHP do mycia rąk
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Kontakt</h4>
            <div className="space-y-2 text-gray-300 text-sm">
              <p>Telefon: [Numer telefonu]</p>
              <p>Email: [Adres email]</p>
              <p>Adres: [Adres firmy]</p>
            </div>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Informacje</h4>
            <nav className="space-y-2">
              <a href="#o-firmie" className="block text-gray-300 hover:text-white transition-colors text-sm">
                O firmie
              </a>
              <a href="#produkty" className="block text-gray-300 hover:text-white transition-colors text-sm">
                Produkty
              </a>
              <a href="#wspolpraca" className="block text-gray-300 hover:text-white transition-colors text-sm">
                Współpraca
              </a>
              <a href="#kontakt" className="block text-gray-300 hover:text-white transition-colors text-sm">
                Kontakt
              </a>
            </nav>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-8 text-center text-gray-400 text-sm">
          <p>
            &copy; {new Date().getFullYear()} Made by{' '}
            <a
              href="https://krzysztofp.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-white transition-colors underline"
            >
              Krzysztof Pabich
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}

