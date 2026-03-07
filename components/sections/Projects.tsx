'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SectionHeading } from '../ui/SectionHeading'
import { ProjectCard } from '../ui/ProjectCard'
import { CaseStudyModal } from '../ui/CaseStudyModal'
import { GitHubRepo } from '@/lib/github'
import { Smartphone, Globe, Layers, Code2, Rocket, Zap, Shield, Cpu } from 'lucide-react'
import { curatedProjects } from '@/data/projects'

interface ProjectsProps {
  repos: GitHubRepo[]
}

const VIBRANT_COLORS = [
  '#818cf8', // Indigo
  '#c084fc', // Purple
  '#fb7185', // Rose
  '#2dd4bf', // Teal
  '#f472b6', // Pink
  '#fbbf24', // Amber
]

const TEMP_ICONS = [
  <Rocket key="rocket" size={24} />,
  <Zap key="zap" size={24} />,
  <Shield key="shield" size={24} />,
  <Cpu key="cpu" size={24} />,
  <Layers key="layers" size={24} />,
  <Code2 key="code" size={24} />,
]

export function Projects({ repos }: ProjectsProps) {
  const [filter, setFilter] = useState('All')
  const [selectedProject, setSelectedProject] = useState<any>(null)

  const categories = ['All', 'Mobile', 'Web', 'Open Source']
  
  // Mix curated projects with github repos as fallback/extra
  const allProjects = [
    ...curatedProjects.map((p, i) => ({
      ...p,
      icon: TEMP_ICONS[i % TEMP_ICONS.length],
      isCurated: true,
      category: p.languages.includes('Flutter') || p.languages.includes('React Native') ? 'Mobile' : 'Web'
    })),
    ...repos.slice(0, 6).map((repo, i) => ({
      id: `repo-${repo.id}`,
      name: repo.name.replace(/-/g, ' '),
      description: repo.description || 'Open source contribution and technical exploration.',
      fullDescription: repo.description || 'A technical deep-dive into this specific repository, exploring modern patterns and efficient implementation.',
      languages: repo.language ? [repo.language] : repo.topics.slice(0, 2),
      platforms: ['Web'],
      githubUrl: repo.html_url,
      vibrantColor: VIBRANT_COLORS[(i + curatedProjects.length) % VIBRANT_COLORS.length],
      bullets: ['Clean architecture', 'Modern tech stack', 'Continuous integration'],
      icon: <Layers size={24} />,
      isCurated: false,
      category: 'Open Source'
    }))
  ]

  const filteredProjects = allProjects.filter(p => {
    if (filter === 'All') return true
    return p.category === filter
  })

  return (
    <section id="projects" className="py-32 px-4 relative">
      <div className="container mx-auto max-w-6xl">
        <SectionHeading 
          title="Projects" 
          subtitle="A curated selection of my recent works, ranging from mobile applications to complex web systems."
        />

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-16">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all ${
                filter === cat
                  ? 'bg-accent text-white shadow-xl scale-105'
                  : 'bg-surface/50 text-text-secondary hover:text-text-primary border border-white/5 backdrop-blur-sm'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, type: 'spring', damping: 20 }}
              >
                <ProjectCard 
                  {...project} 
                  onViewCaseStudy={() => setSelectedProject(project)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <CaseStudyModal 
        isOpen={!!selectedProject} 
        onClose={() => setSelectedProject(null)} 
        project={selectedProject}
      />
    </section>
  )
}
