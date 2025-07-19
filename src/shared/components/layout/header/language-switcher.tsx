'use client'

import { useState } from 'react'
import { Globe, ChevronDown } from 'lucide-react'

const languages = [
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
]

export function LanguageSwitcher() {
  const [currentLanguage, setCurrentLanguage] = useState(languages[0])
  const [isOpen, setIsOpen] = useState(false)

  const handleLanguageChange = (language: typeof languages[0]) => {
    setCurrentLanguage(language)
    setIsOpen(false)
    // In real app, this would update the locale
    console.log('Language changed to:', language.code)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 text-sm text-gray-600 hover:text-primary-600 transition-colors"
      >
        <Globe className="h-4 w-4" />
        <span>{currentLanguage.flag}</span>
        <ChevronDown className="h-3 w-3" />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 w-36 bg-white shadow-lg rounded-lg border border-gray-100 z-50">
          <div className="py-1">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language)}
                className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-gray-700 hover:text-primary-600 hover:bg-primary-50 transition-colors"
              >
                <span>{language.flag}</span>
                <span>{language.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Overlay to close dropdown */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
} 