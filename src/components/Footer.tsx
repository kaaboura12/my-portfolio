'use client'

import { motion } from 'framer-motion'
import { Github, Linkedin, Mail, Facebook, Instagram, ArrowUp, Heart, Code, Coffee } from 'lucide-react'

const socialLinks = [
  { 
    name: 'GitHub', 
    href: 'https://github.com/kaaboura12', 
    icon: Github,
    color: 'hover:text-white'
  },
  { 
    name: 'LinkedIn', 
    href: 'https://linkedin.com', 
    icon: Linkedin,
    color: 'hover:text-blue-400'
  },
  { 
    name: 'Email', 
    href: 'mailto:mohamedamin.sayari@esprit.tn', 
    icon: Mail,
    color: 'hover:text-primary-400'
  },
  { 
    name: 'Facebook', 
    href: 'https://www.facebook.com/amin.sayari.355/', 
    icon: Facebook,
    color: 'hover:text-blue-400'
  },
  { 
    name: 'Instagram', 
    href: 'https://www.instagram.com/sayari_emin/', 
    icon: Instagram,
    color: 'hover:text-pink-400'
  },
]

const navigationLinks = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Projects', href: '#projects' },
  { name: 'Contact', href: '#contact' },
]

const currentYear = new Date().getFullYear()

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const scrollToSection = (href: string) => {
    const element = document.getElementById(href.substring(1))
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <footer className="relative bg-gradient-to-b from-gray-900 to-black py-16 px-4 sm:px-6 lg:px-8 border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            <div className="flex items-center space-x-3 mb-6">
              <motion.div 
                className="w-14 h-14 rounded-xl overflow-hidden bg-gradient-to-r from-primary-500 to-secondary-500 p-0.5 relative group"
                whileHover={{ rotate: -5, scale: 1.1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="w-full h-full rounded-lg overflow-hidden bg-gray-900 flex items-center justify-center relative">
                  <img 
                    src="/cyber-turtle-logo.jpg" 
                    alt="Cyber Turtle Logo" 
                    className="w-full h-full object-cover rounded-lg transition-all duration-300 group-hover:brightness-125"
                  />
                  {/* Cyber pulse effect */}
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-400/30 to-blue-400/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute inset-0 rounded-lg border border-cyan-400/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
                </div>
              </motion.div>
              <div>
                <h3 className="text-xl font-bold text-white">Sayari Mohamed Amin</h3>
                <p className="text-gray-400 text-sm">Computer Science Engineering Student</p>
              </div>
            </div>
            <p className="text-gray-400 leading-relaxed mb-6 max-w-md">
              I'm a computer engineering student passionate about development, seeking internship opportunities 
              to gain hands-on experience and contribute to innovative projects.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target={social.href.startsWith('http') ? '_blank' : undefined}
                  rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className={`w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-gray-400 transition-colors duration-200 ${social.color}`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Navigation Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="text-lg font-semibold text-white mb-4">Navigation</h4>
            <ul className="space-y-2">
              {navigationLinks.map((link) => (
                <li key={link.name}>
                  <motion.button
                    onClick={() => scrollToSection(link.href)}
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                    whileHover={{ x: 5 }}
                  >
                    {link.name}
                  </motion.button>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h4 className="text-lg font-semibold text-white mb-4">Get in Touch</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a 
                  href="mailto:mohamedamin.sayari@esprit.tn" 
                  className="text-gray-400 hover:text-primary-400 transition-colors duration-200"
                >
                  mohamedamin.sayari@esprit.tn
                </a>
              </li>
              <li>
                <a 
                  href="tel:+21647067463" 
                  className="text-gray-400 hover:text-secondary-400 transition-colors duration-200"
                >
                  +216 47067463
                </a>
              </li>
              <li className="text-gray-400">
                Arianna Soghra, Tunisia
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            {/* Copyright */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="flex items-center space-x-2 text-gray-400 text-sm"
            >
              <span>&copy; {currentYear} Sayari Mohamed Amin. All rights reserved.</span>
              <span className="flex items-center space-x-1">
                <span>Made with</span>
                <Heart className="w-4 h-4 text-red-500 fill-current" />
                <span>and</span>
                <Code className="w-4 h-4 text-primary-400" />
              </span>
            </motion.div>

            {/* Back to Top */}
            <motion.button
              onClick={scrollToTop}
              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-200 text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Back to top</span>
              <ArrowUp className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary-500/50 to-transparent"></div>
      <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-primary-500/10 rounded-full blur-xl"></div>
      <div className="absolute -top-5 right-1/4 w-12 h-12 bg-secondary-500/10 rounded-full blur-lg"></div>
    </footer>
  )
} 