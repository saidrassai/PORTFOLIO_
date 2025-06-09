import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ReCAPTCHA from 'react-google-recaptcha'
import { Send, Mail, MapPin, Phone, Github, Linkedin, Shield, Clock, AlertTriangle, CheckCircle } from 'lucide-react'
import { trackFormSubmission, trackUserAction } from '../../utils/monitoring'

gsap.registerPlugin(ScrollTrigger)

// Enhanced security utilities
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) && email.length <= 254
}

const validateName = (name: string): boolean => {
  // Only allow letters, spaces, hyphens, apostrophes, and some international characters
  const nameRegex = /^[a-zA-ZÀ-ÿ\s\-'.]+$/
  return nameRegex.test(name) && name.length >= 2 && name.length <= 50
}

const containsSpam = (text: string): boolean => {
  const spamWords = [
    'viagra', 'casino', 'lottery', 'winner', 'click here', 'buy now', 
    'free money', 'investment opportunity', 'get rich quick', 'make money fast',
    'guaranteed income', 'no experience required', 'work from home',
    'bitcoin', 'crypto', 'forex', 'trading', 'loan', 'debt', 'credit repair',
    'seo services', 'cheap pills', 'weight loss', 'enlargement'
  ]
  const lowerText = text.toLowerCase()
  return spamWords.some(word => lowerText.includes(word))
}

const containsSuspiciousPatterns = (text: string): boolean => {
  // Check for suspicious patterns
  const patterns = [
    /https?:\/\/[^\s]+/g, // URLs
    /\b\d{10,}\b/g, // Long numbers (phone/credit card)
    /[A-Z]{5,}/g, // Too many consecutive capitals
    /(.)\1{4,}/g // Repeated characters (aaaaa)
  ]
  
  return patterns.some(pattern => pattern.test(text))
}

interface SubmissionState {
  isSubmitting: boolean
  isSuccess: boolean
  message: string
}

// reCAPTCHA configuration
const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY || '6LcT9FYrAAAAAGiEnqygkW7t5oxGmJnshJfeVctu'

const Contact = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const infoRef = useRef<HTMLDivElement>(null)
  const recaptchaRef = useRef<ReCAPTCHA>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    honeypot: '' // Invisible field to catch bots
  })

  const [submissionState, setSubmissionState] = useState<SubmissionState>({
    isSubmitting: false,
    isSuccess: false,
    message: ''
  })

  const [submitAttempts, setSubmitAttempts] = useState(0)
  const [lastSubmitTime, setLastSubmitTime] = useState(0)
  const [errors, setErrors] = useState<{[key: string]: string}>({})
  const [startTime] = useState(Date.now())
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null)

  // Enhanced rate limiting - max 3 submissions per 15 minutes
  const RATE_LIMIT = 3
  const RATE_WINDOW = 15 * 60 * 1000 // 15 minutes
  const MIN_FORM_TIME = 3000 // Minimum 3 seconds to fill form (anti-bot)
  const MAX_FORM_TIME = 30 * 60 * 1000 // Maximum 30 minutes (session timeout)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(titleRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 90%",
            toggleActions: "play none none reverse"
          }
        }
      )

      gsap.fromTo([formRef.current, infoRef.current],
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.2,
          scrollTrigger: {
            trigger: formRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    
    // Clear errors and success state on input change
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
    
    if (submissionState.isSuccess) {
      setSubmissionState(prev => ({ ...prev, isSuccess: false, message: '' }))
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleRecaptchaChange = (token: string | null) => {
    setRecaptchaToken(token)
    
    // Clear reCAPTCHA error if user completes it
    if (token && errors.recaptcha) {
      setErrors(prev => ({ ...prev, recaptcha: '' }))
    }
  }

  const handleRecaptchaExpired = () => {
    setRecaptchaToken(null)
    setErrors(prev => ({ ...prev, recaptcha: 'reCAPTCHA expired. Please complete it again.' }))
  }

  const handleRecaptchaError = () => {
    setRecaptchaToken(null)
    setErrors(prev => ({ ...prev, recaptcha: 'reCAPTCHA failed to load. Please refresh and try again.' }))
  }

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {}

    // Honeypot check (bot detection)
    if (formData.honeypot) {
      newErrors.general = 'Suspicious activity detected. Please refresh and try again.'
      setErrors(newErrors)
      return false
    }

    // Time-based validation (too fast = bot, too slow = session timeout)
    const timeTaken = Date.now() - startTime
    if (timeTaken < MIN_FORM_TIME) {
      newErrors.general = 'Please take a moment to review your message before submitting.'
      setErrors(newErrors)
      return false
    }
    
    if (timeTaken > MAX_FORM_TIME) {
      newErrors.general = 'Session expired. Please refresh the page and try again.'
      setErrors(newErrors)
      return false
    }

    // Rate limiting check
    const now = Date.now()
    if (submitAttempts >= RATE_LIMIT && (now - lastSubmitTime) < RATE_WINDOW) {
      const waitTime = Math.ceil((RATE_WINDOW - (now - lastSubmitTime)) / 60000)
      newErrors.general = `Too many submissions. Please wait ${waitTime} minutes before trying again.`
      setErrors(newErrors)
      return false
    }

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    } else if (!validateName(formData.name)) {
      newErrors.name = 'Please enter a valid name (2-50 characters, letters and spaces only)'
    } else if (containsSpam(formData.name)) {
      newErrors.name = 'Name contains prohibited content'
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required'
    } else if (formData.message.length < 10) {
      newErrors.message = 'Message must be at least 10 characters long'
    } else if (formData.message.length > 1000) {
      newErrors.message = 'Message must be less than 1000 characters'
    } else if (containsSpam(formData.message)) {
      newErrors.message = 'Message contains prohibited content. Please keep it professional.'    } else if (containsSuspiciousPatterns(formData.message)) {
      newErrors.message = 'Message contains suspicious content. Please avoid URLs and excessive formatting.'
    }

    // reCAPTCHA validation
    if (!recaptchaToken) {
      newErrors.recaptcha = 'Please complete the reCAPTCHA verification'
    }    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
      // Track form submission attempt
    trackUserAction('form_submit_attempt', {
      form_name: 'contact',
      has_recaptcha: !!recaptchaToken
    })
    
    if (!validateForm()) {
      trackUserAction('form_validation_failed', {
        form_name: 'contact',
        error_count: Object.keys(errors).length
      })
      return
    }

    setSubmissionState(prev => ({ ...prev, isSubmitting: true, message: '', isSuccess: false }))
    
    try {
      // Update rate limiting
      setSubmitAttempts(prev => prev + 1)
      setLastSubmitTime(Date.now())
        // Submit to Netlify Forms - Use proper encoding
      const formBody = new URLSearchParams()
      formBody.append('form-name', 'contact') // Must match the form name attribute
      formBody.append('name', formData.name)
      formBody.append('email', formData.email)
      formBody.append('message', formData.message)
      formBody.append('g-recaptcha-response', recaptchaToken || '')
      
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formBody.toString()
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
        // Track successful submission
      trackFormSubmission('contact', true)
      trackUserAction('form_submit_success', {
        form_name: 'contact',
        response_status: response.status
      })
      
      // Reset form on success
      setFormData({ name: '', email: '', message: '', honeypot: '' })
      setRecaptchaToken(null)
      
      // Reset reCAPTCHA
      if (recaptchaRef.current) {
        recaptchaRef.current.reset()
      }
      
      // Show success message
      setSubmissionState({
        isSubmitting: false,
        isSuccess: true,
        message: 'Thank you! Your message has been sent successfully. I\'ll get back to you soon.'
      })    } catch (error) {
      console.error('Form submission error:', error)
      
      // Track failed submission
      trackFormSubmission('contact', false)
      trackUserAction('form_submit_error', {
        form_name: 'contact',
        error_message: error instanceof Error ? error.message : 'Unknown error'
      })
      
      // Reset reCAPTCHA on error
      setRecaptchaToken(null)
      if (recaptchaRef.current) {
        recaptchaRef.current.reset()
      }
      
      setSubmissionState({
        isSubmitting: false,
        isSuccess: false,
        message: 'Failed to send message. Please try again or contact me directly via email.'
      })
    }
  }

  const contactInfo = [
    {
      icon: Mail,
      label: 'Email',
      value: 'rassai.said@ensi.ma',
      href: 'mailto:rassai.said@ensi.ma'
    },
    {
      icon: Phone,
      label: 'Phone',
      value: '+212 6-04-18-65-86',
      href: 'tel:+212604186586'
    },
    {
      icon: MapPin,
      label: 'Location',
      value: 'Tangier, MA',
      href: '#'
    },
    {
      icon: Github,
      label: 'GitHub',
      value: 'saidrassai',
      href: 'https://github.com/saidrassai'
    },
    {
      icon: Linkedin,
      label: 'LinkedIn',
      value: 'Connect with me',
      href: 'https://www.linkedin.com/'
    }
  ]

  return (
    <section 
      id="contact" 
      ref={sectionRef}
      className="pt-12 pb-20 px-4 sm:px-6 bg-white"
      data-theme="light"
    >
      <div className="max-w-6xl mx-auto">        <h2 
          ref={titleRef}
          className="text-[3rem] sm:text-[4rem] md:text-[5rem] lg:text-[3.5rem] font-black uppercase tracking-[-0.02em] mb-6 sm:mb-8 pointer-events-none whitespace-nowrap font-['Arial_Black','Arial_Bold',Arial,sans-serif] text-gray-900 text-center"
        >
          GET IN{' '}
          <span className="px-1 rounded" style={{ backgroundColor: '#FFEB3B', color: '#333446', paddingTop: '1px', paddingBottom: '1px' }}>
            TOUCH
          </span>
        </h2>

        {/* Descriptive Text - Moved here from sidebar */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <h3 className="font-medium text-xl sm:text-2xl mb-3 sm:mb-4 text-gray-900">Let's work together</h3>
          <p className="text-neutral-600 leading-relaxed text-base sm:text-lg">
            I'm always interested in hearing about new projects and opportunities.
            Whether you're a company looking to hire, or you're looking for a collaborator
            on your next project, I'd love to hear from you.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12">          {/* Contact Form */}
          <form 
            ref={formRef} 
            onSubmit={handleSubmit} 
            className="space-y-4 sm:space-y-6"
            name="contact"
            method="POST"
            data-netlify="true"
            data-netlify-recaptcha="true"          >
            {/* Hidden input for Netlify Forms */}
            <input type="hidden" name="form-name" value="contact" />
            
            {/* Security Notice */}
            <div className="flex items-center gap-2 text-sm text-neutral-600 bg-neutral-50 p-3 rounded-lg border">
              <Shield className="h-4 w-4 text-green-600" />
              <span>This form is protected against spam and abuse</span>
            </div>

            {/* Success Message */}
            {submissionState.isSuccess && (
              <div className="flex items-start gap-2 text-sm text-green-700 bg-green-50 p-3 rounded-lg border border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>{submissionState.message}</span>
              </div>
            )}

            {/* Error Messages */}
            {errors.general && (
              <div className="flex items-start gap-2 text-sm text-red-700 bg-red-50 p-3 rounded-lg border border-red-200">
                <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                <span>{errors.general}</span>
              </div>
            )}

            {submissionState.message && !submissionState.isSuccess && !errors.general && (
              <div className="flex items-start gap-2 text-sm text-red-700 bg-red-50 p-3 rounded-lg border border-red-200">
                <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                <span>{submissionState.message}</span>
              </div>
            )}

            {/* Honeypot field (hidden from humans, visible to bots) */}
            <input
              type="text"
              name="honeypot"
              value={formData.honeypot}
              onChange={handleInputChange}
              style={{ 
                position: 'absolute',
                left: '-9999px',
                width: '1px',
                height: '1px',
                opacity: 0
              }}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />
            
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-2">
                Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                maxLength={50}
                disabled={submissionState.isSubmitting}
                className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm sm:text-base bg-white text-neutral-900 disabled:opacity-50 disabled:cursor-not-allowed ${
                  errors.name ? 'border-red-300 bg-red-50' : 'border-neutral-300'
                }`}
                placeholder="Your full name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                maxLength={254}
                disabled={submissionState.isSubmitting}
                className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm sm:text-base bg-white text-neutral-900 disabled:opacity-50 disabled:cursor-not-allowed ${
                  errors.email ? 'border-red-300 bg-red-50' : 'border-neutral-300'
                }`}
                placeholder="your.email@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-neutral-700 mb-2">
                Message *
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows={5}
                maxLength={1000}
                disabled={submissionState.isSubmitting}
                className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm sm:text-base bg-white text-neutral-900 resize-none disabled:opacity-50 disabled:cursor-not-allowed ${
                  errors.message ? 'border-red-300 bg-red-50' : 'border-neutral-300'
                }`}
                placeholder="Your message (minimum 10 characters)..."
              />
              <div className="flex justify-between items-center mt-1">
                {errors.message ? (
                  <p className="text-sm text-red-600">{errors.message}</p>
                ) : (
                  <span></span>
                )}
                <span className={`text-xs ${formData.message.length > 900 ? 'text-orange-500' : 'text-neutral-500'}`}>
                  {formData.message.length}/1000
                </span>
              </div>            </div>

            {/* reCAPTCHA */}
            <div className="space-y-2">
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={RECAPTCHA_SITE_KEY}
                onChange={handleRecaptchaChange}
                onExpired={handleRecaptchaExpired}
                onError={handleRecaptchaError}
                size="normal"
                theme="light"
                className="flex justify-start"
              />
              {errors.recaptcha && (
                <p className="text-sm text-red-600">{errors.recaptcha}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={submissionState.isSubmitting || submissionState.isSuccess}
              className="w-full sm:w-auto px-6 sm:px-8 py-2 sm:py-3 bg-neutral-900 text-white font-medium rounded-lg hover:bg-neutral-800 focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              {submissionState.isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Sending...
                </>
              ) : submissionState.isSuccess ? (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Message Sent
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Send Message
                </>
              )}
            </button>            {/* Security Info */}
            <div className="text-xs text-neutral-500 space-y-1 bg-neutral-50 p-3 rounded-lg">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>Rate limited to prevent abuse (max 3 submissions per 15 minutes)</span>
              </div>
              <p>• Protected by Google reCAPTCHA v2</p>
              <p>• All messages are automatically screened for spam</p>
              <p>• Your information is never shared with third parties</p>
              <p>• Form submissions are logged for security purposes</p>
            </div>
          </form>          {/* Contact Info */}
          <div ref={infoRef} className="space-y-6 sm:space-y-8">
            <div className="space-y-3 sm:space-y-4">
              {contactInfo.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className="flex items-center gap-3 sm:gap-4 p-1.5 rounded-lg hover:bg-neutral-50 transition-colors group"
                >
                  <div className="p-2 bg-neutral-100 rounded-lg group-hover:bg-neutral-200 transition-colors">
                    <item.icon size={18} className="text-neutral-600 sm:w-5 sm:h-5" />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm text-neutral-500">{item.label}</div>
                    <div className="font-medium text-sm sm:text-base">{item.value}</div>
                  </div>
                </a>
              ))}
            </div>

            {/* Response Time Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <Clock className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-700">
                  <p className="font-medium">Response Time</p>
                  <p>I typically respond within 24-48 hours during business days.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact
