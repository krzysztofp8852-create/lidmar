'use client'

import { useState, useEffect, useRef } from 'react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      // Zmień tło po zescrollowaniu o 100px
      setIsScrolled(scrollPosition > 100)
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const navItems = [
    { label: 'O firmie', href: '#o-firmie' },
    { label: 'Produkty', href: '#produkty' },
    { label: 'Zastosowania', href: '#zastosowania' },
    { label: 'Dlaczego LiD-MAR', href: '#dlaczego-lidmar' },
    { label: 'Współpraca', href: '#wspolpraca' },
    { label: 'Kontakt', href: '#kontakt' },
  ]

  const handleNavClick = (href: string) => {
    setIsMenuOpen(false)
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <header 
      className={`sticky top-0 left-0 right-0 z-50 will-change-[background-color,border-color] transition-[background-color,border-color] duration-200 ease-out ${
        isScrolled 
          ? 'bg-primary-dark border-b border-primary/50' 
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="container-custom">
        <div className="flex justify-center items-center h-10 sm:h-12 lg:h-14">
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => handleNavClick(item.href)}
                className={`px-4 py-2 text-sm font-medium text-white hover:text-red-600 transition-colors duration-200 focus:outline-none rounded ${
                  !isScrolled ? 'drop-shadow-lg [text-shadow:_1px_1px_3px_rgb(0_0_0_/_0.8)]' : ''
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`lg:hidden p-2 text-white hover:text-red-600 focus:outline-none rounded ${
              !isScrolled ? 'drop-shadow-lg [text-shadow:_1px_1px_3px_rgb(0_0_0_/_0.8)]' : ''
            }`}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className={`lg:hidden pb-4 mt-2 pt-4 ${
            isScrolled 
              ? 'border-t border-primary' 
              : 'border-t border-white/30'
          }`}>
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => handleNavClick(item.href)}
                  className="px-4 py-2 text-left text-sm font-medium text-white hover:text-red-600 hover:bg-primary transition-colors duration-200 focus:outline-none rounded"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}

