'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { Code, Database, Palette, Globe, Award, Target, Zap, BookOpen, Monitor, Star, CheckCircle, TrendingUp, Heart, GraduationCap, Briefcase } from 'lucide-react'

const skills = [
  {
    category: 'Programming Languages',
    icon: Code,
    color: 'primary',
    skills: [
      { name: 'C++', proficiency: 'Advanced' },
      { name: 'Python', proficiency: 'Advanced' },
      { name: 'JavaScript', proficiency: 'Intermediate' },
      { name: 'PHP', proficiency: 'Intermediate' },
      { name: 'Java', proficiency: 'Intermediate' },
      { name: 'C', proficiency: 'Advanced' }
    ]
  },
  {
    category: 'Web Development',
    icon: Globe,
    color: 'secondary',
    skills: [
      { name: 'HTML', proficiency: 'Expert' },
      { name: 'CSS', proficiency: 'Advanced' },
      { name: 'Bootstrap', proficiency: 'Advanced' },
      { name: 'Symfony', proficiency: 'Intermediate' },
      { name: 'API Integration', proficiency: 'Intermediate' },
      { name: 'RESTful APIs', proficiency: 'Intermediate' }
    ]
  },
  {
    category: 'Mobile & Desktop Development',
    icon: Monitor,
    color: 'accent',
    skills: [
      { name: 'Flutter', proficiency: 'Intermediate' },
      { name: 'JavaFX', proficiency: 'Intermediate' },
      { name: 'QtCreator', proficiency: 'Beginner' },
      { name: 'Cross-platform', proficiency: 'Intermediate' }
    ]
  },
  {
    category: 'Database Management',
    icon: Database,
    color: 'primary',
    skills: [
      { name: 'Oracle Database', proficiency: 'Advanced' },
      { name: 'MySQL', proficiency: 'Advanced' },
      { name: 'MongoDB', proficiency: 'Intermediate' },
      { name: 'SQL Developer', proficiency: 'Intermediate' },
      { name: 'JDBC', proficiency: 'Intermediate' },
      { name: 'Doctrine ORM', proficiency: 'Beginner' }
    ]
  },
  {
    category: 'Frameworks & Tools',
    icon: Zap,
    color: 'secondary',
    skills: [
      { name: 'Express.js', proficiency: 'Intermediate' },
      { name: 'SDL1', proficiency: 'Beginner' },
      { name: 'XAMPP', proficiency: 'Advanced' },
      { name: 'Arduino', proficiency: 'Intermediate' },
      { name: 'Shapr3D', proficiency: 'Intermediate' },
      { name: 'Git', proficiency: 'Advanced' }
    ]
  },
  {
    category: 'Design & Graphics',
    icon: Palette,
    color: 'accent',
    skills: [
      { name: 'Adobe Photoshop', proficiency: 'Intermediate' },
      { name: 'Illustrator', proficiency: 'Intermediate' },
      { name: 'After Effects', proficiency: 'Beginner' },
      { name: 'UI/UX Design', proficiency: 'Intermediate' }
    ]
  }
]

const experiences = [
  {
    role: 'Summer Intern',
    organization: 'Tarek Labhib Agricultural Agency',
    period: 'Jun 2023 - Jul 2023',
    description: 'Developed a website to manage equipment and inventory. Gained hands-on experience with Symfony and focused on creating both the application code and user interface.',
    icon: Target,
    color: 'primary',
    highlights: ['Symfony Framework', 'Full-stack Development', 'UI/UX Design']
  }
]

const achievements = [
  {
    title: '2nd Place - Code It Up 5.0 Hackathon',
    organization: 'IEEE Computer Society ISETB SBC & IEEE CIS ISETB SBC',
    period: 'April 2025',
    description: 'Participated in a 24-hour hackathon as part of a 3-member team ("BooRaa"). Developed a web platform featuring a custom-trained YOLO-based computer vision model.',
    icon: Award,
    color: 'accent',
    highlights: ['YOLO Model', 'Computer Vision', 'Team Leadership']
  }
]

const stats = [
  { label: 'Projects Completed', value: '6+', icon: Code, color: 'primary' },
  { label: 'Technologies Mastered', value: '20+', icon: Zap, color: 'secondary' },
  { label: 'Hackathon Awards', value: '1', icon: Award, color: 'accent' },
  { label: 'Years of Learning', value: '3+', icon: BookOpen, color: 'primary' }
]

const languages = [
  { name: 'English', proficiency: 'Advanced', flag: '🇺🇸' },
  { name: 'Arabic', proficiency: 'Native', flag: '🇹🇳' },
  { name: 'French', proficiency: 'Intermediate', flag: '🇫🇷' },
  { name: 'Italian', proficiency: 'Beginner', flag: '🇮🇹' }
]

const interests = [
  { name: 'Cars Tuning', icon: '🚗', color: 'primary' },
  { name: 'Art', icon: '🎨', color: 'secondary' },
  { name: 'Gaming', icon: '🎮', color: 'accent' },
  { name: 'Offroading', icon: '🏔️', color: 'primary' },
  { name: 'Design & Graphics', icon: '🎨', color: 'accent' }
]

export default function About() {
  const ref = useRef(null)
  // More aggressive mobile-friendly intersection observer
  const isInView = useInView(ref, { once: true, amount: 0.1, margin: "-10% 0px" })
  const [, setHoveredSkill] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [forceVisible, setForceVisible] = useState(false)

  // Detect mobile and force visibility after timeout
  useEffect(() => {
    const mobile = window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    setIsMobile(mobile)
    
    // Force visibility on mobile after 2 seconds if not detected
    if (mobile) {
      const timer = setTimeout(() => {
        setForceVisible(true)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [])

  const shouldAnimate = isInView || forceVisible
  
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

  const getProficiencyColor = (proficiency: string) => {
    const colors = {
      'Expert': 'bg-green-500/20 text-green-400 border-green-500/30',
      'Advanced': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'Intermediate': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      'Beginner': 'bg-gray-500/20 text-gray-400 border-gray-500/30',
      'Native': 'bg-purple-500/20 text-purple-400 border-purple-500/30'
    }
    return colors[proficiency as keyof typeof colors] || colors.Beginner
  }

  const getProficiencyIcon = (proficiency: string) => {
    const icons = {
      'Expert': '🌟',
      'Advanced': '⭐',
      'Intermediate': '✨',
      'Beginner': '💫',
      'Native': '🏆'
    }
    return icons[proficiency as keyof typeof icons] || '💫'
  }

  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8" ref={ref}>
      <div className="max-w-7xl mx-auto">
        {/* Section Header - Always visible on mobile */}
        <motion.div
          initial={isMobile ? false : { opacity: 0, y: 20 }}
          animate={shouldAnimate ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-primary-500/20 to-secondary-500/20 border border-primary-500/30 text-primary-400 text-sm font-medium mb-4"
            whileHover={{ scale: isMobile ? 1 : 1.05 }}
          >
            <GraduationCap className="w-4 h-4 mr-2" />
            About Me
          </motion.div>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Know <span className="gradient-text">Who I Am</span>
          </h2>
          <div className="max-w-4xl mx-auto space-y-6">
            <p className="text-xl text-gray-300 leading-relaxed">
              I&apos;m a passionate Computer Engineering student with a strong foundation in software development and a keen interest in emerging technologies. Currently pursuing my degree while actively seeking internship opportunities to apply my skills in real-world projects.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <motion.div 
                className="glass-dark p-6 rounded-xl border border-white/10"
                whileHover={isMobile ? {} : { scale: 1.02, y: -2 }}
                initial={isMobile ? false : { opacity: 0, y: 20 }}
                animate={shouldAnimate ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Target className="w-8 h-8 text-primary-400 mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Goal-Oriented</h3>
                <p className="text-gray-400 text-sm">Focused on delivering high-quality solutions and continuous learning in the field of technology.</p>
              </motion.div>
              
              <motion.div 
                className="glass-dark p-6 rounded-xl border border-white/10"
                whileHover={isMobile ? {} : { scale: 1.02, y: -2 }}
                initial={isMobile ? false : { opacity: 0, y: 20 }}
                animate={shouldAnimate ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Zap className="w-8 h-8 text-secondary-400 mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Quick Learner</h3>
                <p className="text-gray-400 text-sm">Adaptable to new technologies and frameworks, always eager to expand my technical expertise.</p>
              </motion.div>
              
              <motion.div 
                className="glass-dark p-6 rounded-xl border border-white/10"
                whileHover={isMobile ? {} : { scale: 1.02, y: -2 }}
                initial={isMobile ? false : { opacity: 0, y: 20 }}
                animate={shouldAnimate ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Heart className="w-8 h-8 text-accent-400 mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Team Player</h3>
                <p className="text-gray-400 text-sm">Excellent communication skills and collaborative approach to problem-solving.</p>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Stats Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={shouldAnimate ? "visible" : "hidden"}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="glass-dark p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 text-center group"
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <div className={`w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br ${getColorClasses(stat.color).split(' ')[0]} ${getColorClasses(stat.color).split(' ')[1]} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-white mb-2 group-hover:text-primary-400 transition-colors duration-300">
                {stat.value}
              </div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Enhanced Two-Column Layout */}
        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          {/* Enhanced Personal Info & Languages */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={shouldAnimate ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-white mb-2 flex items-center">
                <GraduationCap className="w-6 h-6 mr-3 text-primary-400" />
                Personal Info
              </h3>
              <p className="text-gray-400">A glimpse into my background and languages</p>
            </div>

            {/* Enhanced Personal Details */}
            <div className="glass-dark p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300">
              <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Briefcase className="w-5 h-5 mr-2 text-primary-400" />
                Background
              </h4>
              <div className="space-y-3 text-gray-300">
                <p>I'm a computer engineering student passionate about innovative development. As a self-driven learner, I'm seeking opportunities to gain hands-on experience, enhance my skills, and contribute to cutting-edge projects within collaborative environments.</p>
                <div className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                  <span>Currently pursuing Computer Science Engineering</span>
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                  <span>Passionate about full-stack development</span>
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                  <span>Active in hackathons and coding competitions</span>
                </div>
              </div>
            </div>

            {/* Enhanced Languages */}
            <div className="glass-dark p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300">
              <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Globe className="w-5 h-5 mr-2 text-primary-400" />
                Languages
              </h4>
              <div className="grid grid-cols-1 gap-3">
                {languages.map((lang, index) => (
                  <motion.div 
                    key={index} 
                    className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300"
                    initial={{ opacity: 0, x: -20 }}
                    animate={shouldAnimate ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, x: 5 }}
                  >
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{lang.flag}</span>
                      <span className="text-gray-300 font-medium">{lang.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getProficiencyIcon(lang.proficiency)}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getProficiencyColor(lang.proficiency)}`}>
                        {lang.proficiency}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Enhanced Interests */}
            <div className="glass-dark p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300">
              <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Heart className="w-5 h-5 mr-2 text-primary-400" />
                Interests
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {interests.map((interest, index) => (
                  <motion.div
                    key={index}
                    className={`p-3 rounded-lg bg-gradient-to-r ${getColorClasses(interest.color).split(' ')[0]} ${getColorClasses(interest.color).split(' ')[1]} bg-opacity-20 border border-white/10 hover:border-white/20 transition-all duration-300 text-center`}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="text-2xl mb-1">{interest.icon}</div>
                    <span className="text-sm text-gray-300">{interest.name}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Enhanced Skills */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={shouldAnimate ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6"
          >
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-white mb-2 flex items-center">
                <TrendingUp className="w-6 h-6 mr-3 text-primary-400" />
                Skills & Expertise
              </h3>
              <p className="text-gray-400">My technical skills and areas of expertise</p>
            </div>

            {skills.map((skillGroup, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={shouldAnimate ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="glass-dark p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300"
                whileHover={{ y: -2 }}
              >
                <div className="flex items-center mb-4">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${getColorClasses(skillGroup.color).split(' ')[0]} ${getColorClasses(skillGroup.color).split(' ')[1]} flex items-center justify-center mr-3`}>
                    <skillGroup.icon className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="text-lg font-semibold text-white">{skillGroup.category}</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skillGroup.skills.map((skill, skillIndex) => (
                    <motion.div
                      key={skillIndex}
                      className={`px-3 py-2 rounded-lg border transition-all duration-300 cursor-pointer ${getProficiencyColor(skill.proficiency)}`}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onMouseEnter={() => setHoveredSkill(`${index}-${skillIndex}`)}
                      onMouseLeave={() => setHoveredSkill(null)}
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">{skill.name}</span>
                        <span className="text-xs opacity-75">{getProficiencyIcon(skill.proficiency)}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Enhanced Experience & Achievements Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={shouldAnimate ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <motion.div
              className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-accent-500/20 to-primary-500/20 border border-accent-500/30 text-accent-400 text-sm font-medium mb-4"
              whileHover={{ scale: 1.05 }}
            >
              <Award className="w-4 h-4 mr-2" />
              Professional Journey
            </motion.div>
            <h3 className="text-3xl font-bold text-white mb-4">
              Experience & <span className="gradient-text">Achievements</span>
            </h3>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Professional experience and notable achievements in competitive programming and development.
            </p>
          </div>

          <div className="space-y-6">
            {/* Enhanced Professional Experience */}
            {experiences.map((exp, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={shouldAnimate ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 * index }}
                className="glass-dark p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 group"
                whileHover={{ y: -3, scale: 1.01 }}
              >
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getColorClasses(exp.color).split(' ')[0]} ${getColorClasses(exp.color).split(' ')[1]} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                    <exp.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                      <h4 className="text-xl font-bold text-white group-hover:text-primary-400 transition-colors duration-300">{exp.role}</h4>
                      <span className="text-sm text-gray-400 mt-1 sm:mt-0">{exp.period}</span>
                    </div>
                    <p className="text-primary-400 font-medium mb-3">{exp.organization}</p>
                    <p className="text-gray-300 leading-relaxed mb-4">{exp.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {exp.highlights.map((highlight, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-primary-500/20 text-primary-400 text-xs rounded-full border border-primary-500/30"
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Enhanced Achievements */}
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={shouldAnimate ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 * (index + 1) }}
                className="glass-dark p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 group"
                whileHover={{ y: -3, scale: 1.01 }}
              >
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getColorClasses(achievement.color).split(' ')[0]} ${getColorClasses(achievement.color).split(' ')[1]} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                    <achievement.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                      <h4 className="text-xl font-bold text-white group-hover:text-yellow-400 transition-colors duration-300">{achievement.title}</h4>
                      <span className="text-sm text-gray-400 mt-1 sm:mt-0">{achievement.period}</span>
                    </div>
                    <p className="text-yellow-400 font-medium mb-3">{achievement.organization}</p>
                    <p className="text-gray-300 leading-relaxed mb-4">{achievement.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {achievement.highlights.map((highlight, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full border border-yellow-500/30"
                        >
                          {highlight}
                        </span>
                      ))}
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