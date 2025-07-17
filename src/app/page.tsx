import DynamicBackground from '@/components/DynamicBackground'
import Navigation from '@/components/Navigation'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Projects from '@/components/Projects'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="relative min-h-screen z-0">
      {/* Dynamic Background */}
      <DynamicBackground />
      
      {/* Navigation */}
      <div className="relative z-20">
        <Navigation />
      </div>
      
      {/* Hero Section */}
      <div className="relative z-10">
        <Hero />
      </div>
      
      {/* About Section */}
      <div className="relative z-10">
        <About />
      </div>
      
      {/* Projects Section */}
      <div className="relative z-10">
        <Projects />
      </div>
      
      {/* Contact Section */}
      <div className="relative z-10">
        <Contact />
      </div>
      
      {/* Footer */}
      <div className="relative z-10">
        <Footer />
      </div>
    </main>
  )
}
