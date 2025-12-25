'use client'

import { FormEvent, useState, useEffect } from 'react'
import { useSiteContent } from '@/lib/useSiteData'

function ContactInfo() {
  const siteContent = useSiteContent()
  const contact = siteContent.contact

  return (
    <div className="space-y-3 text-gray-700">
      <p className="flex items-center gap-2">
        <svg className="w-5 h-5 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
        <span className="font-semibold">Telefon:</span> {contact.phone || '[Numer telefonu]'}
      </p>
      <p className="flex items-center gap-2">
        <svg className="w-5 h-5 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        <span className="font-semibold">Email:</span> {contact.email || '[Adres email]'}
      </p>
      <p className="flex items-center gap-2">
        <svg className="w-5 h-5 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span className="font-semibold">Adres:</span> {contact.address || '[Adres firmy]'}
      </p>
    </div>
  )
}

export default function Contact() {
  const [formData, setFormData] = useState({
    company: '',
    email: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const siteContent = useSiteContent()
  const contact = siteContent.contact

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Form submission logic would go here
    setTimeout(() => {
      setIsSubmitting(false)
      alert('Dziękujemy za wiadomość. Skontaktujemy się wkrótce.')
      setFormData({ company: '', email: '', message: '' })
    }, 1000)
  }

  return (
    <section id="kontakt" className="py-16 sm:py-20 lg:py-24 bg-gray-50 flex items-center justify-center">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-4 mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-primary-dark text-center">
              Kontakt
            </h2>
            <img 
              src="/kontakt.gif" 
              alt="Kontakt" 
              className="h-6 w-6 sm:h-8 sm:w-8"
            />
          </div>
          
          {/* Mapa Google */}
          <div className="mb-12 rounded-lg overflow-hidden shadow-lg bg-gray-200" style={{ minHeight: '450px' }}>
            {isMounted && (
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1501.9599610069984!2d17.447930587919775!3d51.818624593926636!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47053952a3ab6a81%3A0xa908758804f9b10c!2sPWHU%20LiD-MAR!5e1!3m2!1spl!2spl!4v1766693041705!5m2!1spl!2spl"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full"
              />
            )}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="company" className="block text-sm font-semibold text-gray-900 mb-2">
                  Nazwa firmy
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-gray-900 mb-2">
                  Wiadomość
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Wysyłanie...' : 'Wyślij wiadomość'}
              </button>
            </form>
          </div>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-primary-dark mb-4">
                Dane kontaktowe
              </h3>
              <ContactInfo />
            </div>
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <p className="text-gray-700">
                {contact.message || 'Zapraszamy do kontaktu w sprawie współpracy B2B, wyceny zamówień hurtowych oraz indywidualnych warunków współpracy.'}
              </p>
            </div>
          </div>
        </div>
        </div>
      </div>
    </section>
  )
}

