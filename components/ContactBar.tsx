'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import { getSiteContent } from '@/lib/data'

export default function ContactBar() {
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
    <div className="relative z-[60] bg-white">
      <div className="container-custom">
        <div className="flex items-center justify-center gap-6 sm:gap-8 lg:gap-12 py-3 sm:py-4">
          {/* Logo */}
          <div className="flex items-center">
            <Image
              src="/logo.png"
              alt="LiD-MAR Logo"
              width={220}
              height={81}
              className="h-14 sm:h-16 w-auto object-contain"
              priority
            />
          </div>
          
          {/* Contact Info */}
          <div className="hidden sm:flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm text-gray-700">
            {/* Phone */}
            {contact.phone && (
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href={`tel:${contact.phone}`} className="hover:text-red-600 transition-colors">
                  {contact.phone}
                </a>
              </div>
            )}
            
            {/* Address */}
            {contact.address && (
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{contact.address}</span>
              </div>
            )}
            
            {/* Email */}
            {contact.email && (
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href={`mailto:${contact.email}`} className="hover:text-red-600 transition-colors">
                  {contact.email}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

