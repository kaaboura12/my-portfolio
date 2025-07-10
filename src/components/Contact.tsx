'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { Mail, Phone, MapPin, Send, Github, Linkedin, Facebook, Instagram, MessageSquare, CheckCircle, AlertCircle, Clock, Sparkles, Heart } from 'lucide-react'

const contactInfo = [
  {
    icon: Mail,
    label: 'Email',
    value: 'mohamedamin.sayari@esprit.tn',
    href: 'mailto:mohamedamin.sayari@esprit.tn',
    color: 'primary',
    description: 'Send me an email anytime'
  },
  {
    icon: Phone,
    label: 'Phone',
    value: '+216 47067463',
    href: 'tel:+21647067463',
    color: 'secondary',
    description: 'Call me for immediate response'
  },
  {
    icon: MapPin,
    label: 'Location',
    value: 'Arianna Soghra, Tunisia',
    href: 'https://maps.google.com/?q=Arianna,Tunisia',
    color: 'accent',
    description: 'Available for local opportunities'
  }
]

const socialLinks = [
  {
    icon: Github,
    label: 'GitHub',
    href: 'https://github.com/kaaboura12',
    color: 'hover:text-white',
    username: '@kaaboura12'
  },
  {
    icon: Linkedin,
    label: 'LinkedIn',
    href: 'https://linkedin.com',
    color: 'hover:text-blue-400',
    username: 'Mohamed Amin Sayari'
  },
  {
    icon: Facebook,
    label: 'Facebook',
    href: 'https://www.facebook.com/amin.sayari.355/',
    color: 'hover:text-blue-400',
    username: 'Amin Sayari'
  },
  {
    icon: Instagram,
    label: 'Instagram',
    href: 'https://www.instagram.com/sayari_emin/',
    color: 'hover:text-pink-400',
    username: '@sayari_emin'
  }
]

export default function Contact() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const validateField = (name: string, value: string) => {
    switch (name) {
      case 'name':
        return value.length < 2 ? 'Name must be at least 2 characters' : ''
      case 'email':
        return !/\S+@\S+\.\S+/.test(value) ? 'Invalid email address' : ''
      case 'subject':
        return value.length < 3 ? 'Subject must be at least 3 characters' : ''
      case 'message':
        return value.length < 10 ? 'Message must be at least 10 characters' : ''
      default:
        return ''
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear field error on change
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    const error = validateField(name, value)
    if (error) {
      setFieldErrors(prev => ({ ...prev, [name]: error }))
    }
    setFocusedField(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate all fields
    const errors: Record<string, string> = {}
    Object.entries(formData).forEach(([name, value]) => {
      const error = validateField(name, value)
      if (error) errors[name] = error
    })

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    setIsSubmitting(true)
    
    try {
      // Send form data to n8n webhook
      const response = await fetch('https://kaaber12.app.n8n.cloud/webhook/47ac35a0-6f64-447c-be11-2f8b3d30ed50', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          timestamp: new Date().toISOString(),
          source: 'Portfolio Contact Form'
        })
      })

      if (response.ok) {
        setSubmitStatus('success')
        setFormData({ name: '', email: '', subject: '', message: '' })
        setFieldErrors({})
      } else {
        throw new Error('Failed to send message')
      }
    } catch (error) {
      console.error('Error sending message:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
      
      // Reset status after 5 seconds
      setTimeout(() => setSubmitStatus('idle'), 5000)
    }
  }

  const getColorClasses = (color: string) => {
    const colors = {
      primary: 'from-primary-500 to-primary-600 text-primary-400 border-primary-500/20',
      secondary: 'from-secondary-500 to-secondary-600 text-secondary-400 border-secondary-500/20',
      accent: 'from-accent-500 to-accent-600 text-accent-400 border-accent-500/20'
    }
    return colors[color as keyof typeof colors] || colors.primary
  }

  return (
    <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8" ref={ref}>
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-primary-500/20 to-secondary-500/20 border border-primary-500/30 text-primary-400 text-sm font-medium mb-4"
            whileHover={{ scale: 1.05 }}
          >
            <Heart className="w-4 h-4 mr-2" />
            Let's Work Together
          </motion.div>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Get In <span className="gradient-text">Touch</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Looking for internship opportunities or want to collaborate on a project? Let's connect and create something amazing together.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Enhanced Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1 space-y-8"
          >
            <div className="glass-dark p-8 rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                <MessageSquare className="w-6 h-6 mr-3 text-primary-400" />
                Let's Connect
              </h3>
              <div className="space-y-4 mb-8">
                <div className="flex items-center text-gray-300">
                  <Clock className="w-4 h-4 mr-2 text-primary-400" />
                  <span className="text-sm">Usually responds within 24 hours</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                  <span className="text-sm">Available for internships</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <Sparkles className="w-4 h-4 mr-2 text-yellow-400" />
                  <span className="text-sm">Open to collaborations</span>
                </div>
              </div>
              <p className="text-gray-300 mb-8 leading-relaxed">
                I'm actively seeking internship opportunities and exciting projects to work on. 
                As a computer engineering student passionate about development, I'm eager to contribute 
                to innovative solutions and learn from experienced professionals.
              </p>
              
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <motion.a
                    key={index}
                    href={info.href}
                    target={info.href.startsWith('http') ? '_blank' : undefined}
                    rel={info.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                    className="block p-4 rounded-xl hover:bg-white/5 transition-all duration-300 group border border-transparent hover:border-white/10"
                    whileHover={{ x: 5, scale: 1.02 }}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getColorClasses(info.color).split(' ')[0]} ${getColorClasses(info.color).split(' ')[1]} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <info.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-400 mb-1">{info.label}</p>
                        <p className="text-white font-medium mb-1">{info.value}</p>
                        <p className="text-xs text-gray-500">{info.description}</p>
                      </div>
                    </div>
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Enhanced Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-2"
          >
            <div className="glass-dark p-8 rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Send className="w-6 h-6 mr-3 text-primary-400" />
                Send a Message
              </h3>
              
              {submitStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-xl text-green-400 flex items-center"
                >
                  <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Message sent successfully!</p>
                    <p className="text-sm text-green-300">I'll get back to you within 24 hours.</p>
                  </div>
                </motion.div>
              )}
              
              {submitStatus === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 flex items-center"
                >
                  <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Failed to send message</p>
                    <p className="text-sm text-red-300">Please try again or contact me directly.</p>
                  </div>
                </motion.div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Name Field */}
                  <div className="relative">
                    <label 
                      htmlFor="name" 
                      className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                        focusedField === 'name' || formData.name
                          ? 'top-2 text-xs text-primary-400 transform -translate-y-1'
                          : 'top-1/2 text-gray-400 transform -translate-y-1/2'
                      }`}
                    >
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('name')}
                      onBlur={handleBlur}
                      required
                      className={`w-full px-4 pt-6 pb-2 bg-white/10 border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 ${
                        fieldErrors.name ? 'border-red-500/50' : 'border-white/20'
                      }`}
                    />
                    {fieldErrors.name && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-1 text-xs text-red-400 flex items-center"
                      >
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {fieldErrors.name}
                      </motion.p>
                    )}
                  </div>

                  {/* Email Field */}
                  <div className="relative">
                    <label 
                      htmlFor="email" 
                      className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                        focusedField === 'email' || formData.email
                          ? 'top-2 text-xs text-primary-400 transform -translate-y-1'
                          : 'top-1/2 text-gray-400 transform -translate-y-1/2'
                      }`}
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('email')}
                      onBlur={handleBlur}
                      required
                      className={`w-full px-4 pt-6 pb-2 bg-white/10 border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 ${
                        fieldErrors.email ? 'border-red-500/50' : 'border-white/20'
                      }`}
                    />
                    {fieldErrors.email && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-1 text-xs text-red-400 flex items-center"
                      >
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {fieldErrors.email}
                      </motion.p>
                    )}
                  </div>
                </div>
                
                {/* Subject Field */}
                <div className="relative">
                  <label 
                    htmlFor="subject" 
                    className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                      focusedField === 'subject' || formData.subject
                        ? 'top-2 text-xs text-primary-400 transform -translate-y-1'
                        : 'top-1/2 text-gray-400 transform -translate-y-1/2'
                    }`}
                  >
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('subject')}
                    onBlur={handleBlur}
                    required
                    className={`w-full px-4 pt-6 pb-2 bg-white/10 border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 ${
                      fieldErrors.subject ? 'border-red-500/50' : 'border-white/20'
                    }`}
                  />
                  {fieldErrors.subject && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-1 text-xs text-red-400 flex items-center"
                    >
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {fieldErrors.subject}
                    </motion.p>
                  )}
                </div>
                
                {/* Message Field */}
                <div className="relative">
                  <label 
                    htmlFor="message" 
                    className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                      focusedField === 'message' || formData.message
                        ? 'top-3 text-xs text-primary-400'
                        : 'top-6 text-gray-400'
                    }`}
                  >
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('message')}
                    onBlur={handleBlur}
                    required
                    rows={6}
                    className={`w-full px-4 pt-8 pb-3 bg-white/10 border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 resize-none ${
                      fieldErrors.message ? 'border-red-500/50' : 'border-white/20'
                    }`}
                  />
                  {fieldErrors.message && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-1 text-xs text-red-400 flex items-center"
                    >
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {fieldErrors.message}
                    </motion.p>
                  )}
                  <div className="absolute bottom-3 right-4 text-xs text-gray-500">
                    {formData.message.length}/500
                  </div>
                </div>
                
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-secondary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 relative overflow-hidden"
                  whileHover={{ scale: isSubmitting ? 1 : 1.02, y: -2 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <motion.div 
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      <span>Sending...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Send className="w-5 h-5" />
                      <span>Send Message</span>
                    </div>
                  )}
                  <motion.div
                    className="absolute inset-0 bg-white/20 transform -translate-x-full"
                    whileHover={{
                      translateX: "100%",
                      transition: { duration: 0.6 }
                    }}
                  />
                </motion.button>
              </form>
              
              {/* Follow My Journey - Positioned right under Send Message */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="mt-8 pt-6 border-t border-white/10"
              >
                <h4 className="text-xl font-bold text-white mb-6 text-center flex items-center justify-center">
                  <Heart className="w-5 h-5 mr-3 text-pink-400" />
                  Follow My Journey
                </h4>
                <div className="flex justify-center gap-6">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center p-3 rounded-xl hover:bg-white/5 transition-all duration-300 group text-center"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                    >
                      <div className={`w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-gray-400 transition-colors duration-200 ${social.color} group-hover:scale-110 mb-2`}>
                        <social.icon className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-white font-semibold text-sm">{social.label}</p>
                        <p className="text-gray-400 text-xs">{social.username}</p>
                      </div>
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
} 