'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { ExternalLink, Github, Award, Code, Zap, Database, Globe, Smartphone, Monitor, Car, Palette, Gamepad2, Calendar, Users, Trophy, Filter, Grid, List, Star } from 'lucide-react'

const projects = [
  {
    id: '01',
    title: 'Sayarti - Car Service Platform',
    description: 'Professional car service platform connecting vehicle owners with service providers. Cross-platform application with Flutter mobile frontend and Symfony backend.',
    tech: ['Flutter', 'Symfony', 'Express.js', 'MySQL', 'JWT', 'RESTful APIs'],
    category: 'Mobile & Web Development',
    icon: Car,
    color: 'primary',
    features: ['Cross-platform mobile app', 'User profiles & favorites', 'Real-time messaging'],
    status: 'In Development',
    period: 'Mar 2025 - Present',
    difficulty: 'Advanced',
    teamSize: 'Solo',
    image: '/projects/sayarti.jpg',
    links: {
      github: 'https://github.com/kaaboura12/sayarti',
      demo: 'https://sayarti-demo.com'
    }
  },
  {
    id: '02',
    title: 'ArtXcape - Crowdfunding Platform',
    description: 'Crowdfunding platform for local artists and artisans with web and desktop clients communicating through shared database.',
    tech: ['Java', 'JavaFX', 'Symfony 6', 'JDBC', 'Doctrine ORM', 'MySQL'],
    category: 'Web & Desktop Development',
    icon: Palette,
    color: 'secondary',
    features: ['Web & Desktop clients', 'Shared database architecture', 'Agile methodologies'],
    status: 'In Development',
    period: 'Jan 2025 - Present',
    difficulty: 'Advanced',
    teamSize: 'Team of 4',
    image: '/projects/artxcape.jpg',
    links: {
      github: 'https://github.com/kaaboura12/artxcape',
      demo: 'https://artxcape-demo.com'
    }
  },
  {
    id: '03',
    title: 'Hayya Explora - Web Application',
    description: 'Responsive web application developed in collaboration with classmates, integrating multiple APIs for advanced functionalities.',
    tech: ['HTML', 'CSS', 'JavaScript', 'PHP', 'XAMPP', 'APIs'],
    category: 'Web Development',
    icon: Globe,
    color: 'accent',
    features: ['Responsive design', 'Multiple API integration', 'Team collaboration'],
    status: 'Completed',
    period: 'Feb 2024 - May 2024',
    difficulty: 'Intermediate',
    teamSize: 'Team of 3',
    image: '/projects/hayya-explora.jpg',
    links: {
      github: 'https://github.com/kaaboura12/hayya-explora',
      demo: 'https://hayya-explora-demo.com'
    }
  },
  {
    id: '04',
    title: 'AuditPro - Desktop Application',
    description: 'Innovative desktop application for audit and control management with RFID-based secure door access system.',
    tech: ['C++', 'QtCreator', 'Oracle Database', 'SQL Developer', 'RFID'],
    category: 'Desktop & IoT',
    icon: Database,
    color: 'primary',
    features: ['RFID integration', 'Secure door access', 'Oracle database'],
    status: 'Completed',
    period: 'Sep 2023 - Dec 2023',
    difficulty: 'Advanced',
    teamSize: 'Team of 2',
    image: '/projects/auditpro.jpg',
    links: {
      github: 'https://github.com/kaaboura12/auditpro'
    }
  },
  {
    id: '05',
    title: 'Neo-Tech - 2D Game',
    description: '2D game developed on Ubuntu with custom posture-based controller using Arduino and 3D-printed components.',
    tech: ['C', 'SDL1', 'Arduino UNO', 'Shapr3D', 'Adobe Creative Suite'],
    category: 'Game Development & Hardware',
    icon: Gamepad2,
    color: 'secondary',
    features: ['Custom game controller', 'Arduino integration', '3D-printed components'],
    status: 'Completed',
    period: 'Feb 2023 - May 2023',
    difficulty: 'Advanced',
    teamSize: 'Solo',
    image: '/projects/neo-tech.jpg',
    links: {
      github: 'https://github.com/kaaboura12/neo-tech'
    }
  },
  {
    id: '06',
    title: 'Agricultural Equipment Management',
    description: 'Website developed during summer internship to manage equipment and inventory using Symfony framework.',
    tech: ['Symfony', 'PHP', 'MySQL', 'HTML', 'CSS', 'JavaScript'],
    category: 'Web Development',
    icon: Monitor,
    color: 'accent',
    features: ['Equipment management', 'Inventory tracking', 'User interface design'],
    status: 'Completed',
    period: 'Jun 2023 - Jul 2023',
    difficulty: 'Intermediate',
    teamSize: 'Solo',
    image: '/projects/agricultural.jpg',
    links: {
      github: 'https://github.com/kaaboura12/agricultural-equipment'
    }
  }
]

const hackathonEntries = [
  {
    title: 'YOLO-based Computer Vision Platform',
    description: 'Web platform featuring a custom-trained YOLO-based computer vision model developed during a 24-hour hackathon.',
    achievement: '2nd Place - Code It Up 5.0 Hackathon',
    tech: ['YOLO', 'Computer Vision', 'Python', 'Web Development', 'Machine Learning'],
    hackathon: 'IEEE Computer Society ISETB SBC & IEEE CIS ISETB SBC - April 2025',
    teamName: 'BooRaa (3-member team)',
    duration: '24 hours',
    image: '/projects/yolo-hackathon.jpg',
    links: {
      github: 'https://github.com/kaaboura12/yolo-platform',
      demo: 'https://yolo-platform-demo.com'
    }
  }
]

const categories = ['All', 'Web Development', 'Mobile & Web Development', 'Desktop & IoT', 'Game Development & Hardware', 'Web & Desktop Development']

export default function Projects() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [hoveredProject, setHoveredProject] = useState<string | null>(null)

  const filteredProjects = selectedCategory === 'All' 
    ? projects 
    : projects.filter(project => project.category === selectedCategory)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
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

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      'Beginner': 'text-green-400 bg-green-500/20 border-green-500/30',
      'Intermediate': 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30',
      'Advanced': 'text-red-400 bg-red-500/20 border-red-500/30'
    }
    return colors[difficulty as keyof typeof colors] || colors['Intermediate']
  }

  const getStatusColor = (status: string) => {
    const colors = {
      'Completed': 'text-green-400 bg-green-500/20 border-green-500/30',
      'In Development': 'text-blue-400 bg-blue-500/20 border-blue-500/30',
      'Planned': 'text-gray-400 bg-gray-500/20 border-gray-500/30'
    }
    return colors[status as keyof typeof colors] || colors['In Development']
  }

  return (
    <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8" ref={ref}>
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
            <Code className="w-4 h-4 mr-2" />
            My Work
          </motion.div>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            A collection of my development projects, from mobile applications to desktop software, 
            showcasing diverse technologies and innovative solutions.
          </p>
        </motion.div>

        {/* Enhanced Filter and View Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col sm:flex-row justify-between items-center mb-12 gap-4"
        >
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <motion.button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-primary-500 text-white shadow-lg'
                    : 'bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category}
              </motion.button>
            ))}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">View:</span>
            <div className="flex bg-white/10 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-all duration-300 ${
                  viewMode === 'grid'
                    ? 'bg-primary-500 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-all duration-300 ${
                  viewMode === 'list'
                    ? 'bg-primary-500 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Projects Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className={`grid gap-8 mb-20 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1'
          }`}
        >
          {filteredProjects.map((project) => (
            <motion.div
              key={project.id}
              variants={itemVariants}
              className={`group project-card glass-dark rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 overflow-hidden ${
                viewMode === 'grid' ? 'p-6' : 'p-6 flex flex-col md:flex-row gap-6'
              }`}
              whileHover={{ y: -5 }}
              onMouseEnter={() => setHoveredProject(project.id)}
              onMouseLeave={() => setHoveredProject(null)}
            >
              {/* Project Image */}
              <div className={`relative overflow-hidden rounded-xl ${
                viewMode === 'grid' ? 'h-48 mb-4' : 'w-full md:w-64 h-48'
              }`}>
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-secondary-500/20 flex items-center justify-center">
                  <project.icon className="w-16 h-16 text-white/60" />
                </div>
                {hoveredProject === project.id && (
                  <motion.div
                    className="absolute inset-0 bg-black/50 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex gap-3">
                      {project.links.github && (
                        <motion.a
                          href={project.links.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors duration-200"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Github className="w-5 h-5 text-white" />
                        </motion.a>
                      )}
                      {project.links.demo && (
                        <motion.a
                          href={project.links.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors duration-200"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <ExternalLink className="w-5 h-5 text-white" />
                        </motion.a>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Project Content */}
              <div className="flex-1">
                {/* Project Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${getColorClasses(project.color).split(' ')[0]} ${getColorClasses(project.color).split(' ')[1]} flex items-center justify-center`}>
                    <project.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-2xl font-bold text-gray-600">{project.id}</span>
                </div>

                {/* Project Title */}
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary-400 transition-colors duration-300">
                  {project.title}
                </h3>

                {/* Project Description */}
                <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                  {project.description}
                </p>

                {/* Project Meta */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getColorClasses(project.color).split(' ')[2]} ${getColorClasses(project.color).split(' ')[3]}`}>
                    {project.category}
                  </span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(project.difficulty)}`}>
                    {project.difficulty}
                  </span>
                </div>

                {/* Project Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-xs text-gray-400">
                    <Calendar className="w-3 h-3 mr-1" />
                    {project.period}
                  </div>
                  <div className="flex items-center text-xs text-gray-400">
                    <Users className="w-3 h-3 mr-1" />
                    {project.teamSize}
                  </div>
                </div>

                {/* Technologies */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {project.tech.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="px-2 py-1 bg-white/10 text-gray-300 text-xs rounded-full border border-white/10 hover:border-white/20 transition-colors duration-200"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Features */}
                <div className="space-y-1 mb-4">
                  {project.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center text-xs text-gray-400">
                      <div className="w-1 h-1 bg-primary-400 rounded-full mr-2"></div>
                      {feature}
                    </div>
                  ))}
                </div>

                {/* Links */}
                <div className="flex gap-2 mt-auto">
                  {project.links.github && (
                    <motion.a
                      href={project.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-3 py-1 bg-white/10 text-gray-300 text-xs rounded-full hover:bg-white/20 transition-colors duration-200"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Github className="w-3 h-3" />
                      Code
                    </motion.a>
                  )}
                  {project.links.demo && (
                    <motion.a
                      href={project.links.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-3 py-1 bg-primary-500/20 text-primary-400 text-xs rounded-full hover:bg-primary-500/30 transition-colors duration-200"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <ExternalLink className="w-3 h-3" />
                      Demo
                    </motion.a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Enhanced Hackathon Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <motion.div
              className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 text-yellow-400 text-sm font-medium mb-4"
              whileHover={{ scale: 1.05 }}
            >
              <Trophy className="w-4 h-4 mr-2" />
              Competition Success
            </motion.div>
            <h3 className="text-3xl font-bold text-white mb-4">
              Hackathon <span className="gradient-text">Achievements</span>
            </h3>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Showcasing innovative solutions developed under pressure in competitive programming events.
            </p>
          </div>

          <div className="space-y-6">
            {hackathonEntries.map((entry, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.4 * index }}
                className="glass-dark p-8 rounded-2xl border border-yellow-500/20 hover:border-yellow-500/40 transition-all duration-300"
                whileHover={{ y: -3 }}
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Achievement Badge */}
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mb-4">
                      <Trophy className="w-10 h-10 text-white" />
                    </div>
                    <div className="text-center">
                      <div className="text-yellow-400 font-bold text-sm mb-1">2nd Place</div>
                      <div className="text-xs text-gray-400">24 Hours</div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h4 className="text-2xl font-bold text-white mb-2">{entry.title}</h4>
                    <p className="text-yellow-400 font-medium mb-3">{entry.achievement}</p>
                    <p className="text-gray-300 mb-4 leading-relaxed">{entry.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <h5 className="text-sm font-semibold text-white mb-2">Event Details</h5>
                        <p className="text-xs text-gray-400 mb-1">{entry.hackathon}</p>
                        <p className="text-xs text-gray-400">Team: {entry.teamName}</p>
                      </div>
                      <div>
                        <h5 className="text-sm font-semibold text-white mb-2">Technologies Used</h5>
                        <div className="flex flex-wrap gap-1">
                          {entry.tech.map((tech, techIndex) => (
                            <span
                              key={techIndex}
                              className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full border border-yellow-500/30"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      {entry.links.github && (
                        <motion.a
                          href={entry.links.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white text-sm rounded-lg hover:bg-white/20 transition-colors duration-200"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Github className="w-4 h-4" />
                          View Code
                        </motion.a>
                      )}
                      {entry.links.demo && (
                        <motion.a
                          href={entry.links.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-yellow-500/20 text-yellow-400 text-sm rounded-lg hover:bg-yellow-500/30 transition-colors duration-200"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <ExternalLink className="w-4 h-4" />
                          Live Demo
                        </motion.a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
} 