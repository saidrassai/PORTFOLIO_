import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Search, Calendar, GraduationCap } from 'lucide-react'

interface AnnouncementBarProps {
  className?: string
  onVisibilityChange?: (isVisible: boolean) => void
}

const AnnouncementBar: React.FC<AnnouncementBarProps> = ({ className = '', onVisibilityChange }) => {
  const [isVisible, setIsVisible] = useState(true)
  const [currentLang, setCurrentLang] = useState<'en' | 'fr'>('en')

  const handleClose = () => {
    setIsVisible(false)
    onVisibilityChange?.(false)
  }

  const messages = {
    en: {
      text: "I'm searching for 'PFA' traineeship program this summer",
      action: "Contact me"
    },
    fr: {
      text: "Je recherche un stage 'PFA' pour cet été",
      action: "Me contacter"
    }
  }

  const currentMessage = messages[currentLang]
  if (!isVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={`fixed top-[60px] sm:top-[50px] left-0 right-0 z-40 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg overflow-hidden ${className}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3">
            {/* Message Content */}
            <div className="flex items-center space-x-3 flex-1">
              <div className="flex items-center space-x-2">
                <GraduationCap className="w-5 h-5 text-white/90" />
                <Search className="w-4 h-4 text-white/70" />
              </div>
              <span className="text-sm sm:text-base font-medium">
                {currentMessage.text}
              </span>
              <Calendar className="w-4 h-4 text-white/70 ml-2" />
              <span className="hidden sm:inline text-xs bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full font-semibold">
                SUMMER 2025
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-3">
              {/* Language Toggle */}
              <button
                onClick={() => setCurrentLang(currentLang === 'en' ? 'fr' : 'en')}
                className="text-xs px-3 py-1.5 bg-white/20 rounded-full hover:bg-white/30 transition-all duration-200 font-medium border border-white/20"
              >
                {currentLang === 'en' ? 'FR' : 'EN'}
              </button>

              {/* Contact Button */}
              <button
                onClick={() => {
                  const contactSection = document.getElementById('contact')
                  contactSection?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="hidden sm:block text-sm px-4 py-1.5 bg-white text-blue-600 rounded-full hover:bg-white/90 transition-all duration-200 font-medium shadow-sm"
              >
                {currentMessage.action}
              </button>

              {/* Close Button */}              <button
                onClick={handleClose}
                className="p-1.5 hover:bg-white/20 rounded-full transition-colors duration-200"
                aria-label="Close announcement"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Animated progress bar */}
        <motion.div
          className="h-1 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 2, delay: 0.5 }}
          style={{ transformOrigin: 'left' }}
        />
      </motion.div>
    </AnimatePresence>
  )
}

export default AnnouncementBar
