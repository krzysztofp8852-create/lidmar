'use client'

import { FormEvent, useState, useEffect } from 'react'
import { getSiteContent } from '@/lib/data'

function ContactInfo() {
  const [contact, setContact] = useState({ phone: '', email: '', address: '' })

  useEffect(() => {
    const siteContent = getSiteContent()
    setContact(siteContent.contact)
    
    const handleStorageChange = () => {
      setContact(getSiteContent().contact)
    }
    window.addEventListener('storage', handleStorageChange)
    
    const interval = setInterval(() => {
      const newContact = getSiteContent().contact
      if (JSON.stringify(newContact) !== JSON.stringify(contact)) {
        setContact(newContact)
      }
    }, 500)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [contact])

  return (
    <div className="space-y-3 text-gray-700">
      <p>
        <span className="font-semibold">Telefon:</span> {contact.phone || '[Numer telefonu]'}
      </p>
      <p>
        <span className="font-semibold">Email:</span> {contact.email || '[Adres email]'}
      </p>
      <p>
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
                className="w-full sm:w-auto px-8 py-4 bg-accent hover:bg-accent-dark text-white font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
                Zapraszamy do kontaktu w sprawie współpracy B2B, wyceny zamówień hurtowych 
                oraz indywidualnych warunków współpracy.
              </p>
            </div>
          </div>
        </div>
        </div>
      </div>
    </section>
  )
}

