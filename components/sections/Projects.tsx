'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SectionHeading } from '../ui/SectionHeading'
import { ProjectCard } from '../ui/ProjectCard'
import dynamic from 'next/dynamic'

const CaseStudyModal = dynamic(() => import('../ui/CaseStudyModal').then((mod) => mod.CaseStudyModal), {
  ssr: false
})
import { GitHubRepo } from '@/lib/github'
import { Layers } from 'lucide-react'
import { ProjectData } from '@/data/projects'
import { Profile } from '@/lib/types'

const VIBRANT_COLORS = [
  '#818cf8', // Indigo
  '#c084fc', // Purple
  '#fb7185', // Rose
  '#2dd4bf', // Teal
  '#f472b6', // Pink
  '#fbbf24', // Amber
]

interface ProjectsProps {
  repos: GitHubRepo[]
  dbProjects?: ProjectData[]
  dbProfile?: Profile
}

// ... icons ...

interface DisplayProject {
  id: string
  name: string
  description: string
  fullDescription?: string
  bullets?: string[]
  vibrantColor: string
  image_url?: string
  imageUrl?: string
  live_url?: string
  liveUrl?: string
  github_url?: string
  githubUrl: string
  languages: string[]
  platforms: string[]
  icon: React.ReactNode
  isCurated: boolean
  category: string
}

export function Projects({ repos, dbProjects = [], dbProfile }: ProjectsProps) {
  const [filter, setFilter] = useState('All')
  const [selectedProject, setSelectedProject] = useState<DisplayProject | null>(null)

  const categories = ['All', 'Mobile', 'Web', 'Open Source']
  
  // Use only dynamic projects from database as requested
  const allProjects: DisplayProject[] = dbProjects.map((p, index) => ({
    ...p,
    name: p.name || 'Untitled Project',
    description: p.description || '',
    githubUrl: p.githubUrl || '',
    languages: p.languages || [],
    platforms: p.platforms || [],
    vibrantColor: p.vibrantColor || VIBRANT_COLORS[index % VIBRANT_COLORS.length],
    icon: <Layers size={24} />,
    isCurated: true,
    category: p.languages?.includes('Flutter') || p.languages?.includes('React Native') ? 'Mobile' : 'Web'
  }))

  const filteredProjects = allProjects.filter(p => {
    if (filter === 'All') return true
    return p.category === filter
  })

  return (
    <section id="projects" className="py-32 px-4 relative">
      <div className="container mx-auto max-w-6xl">
        <SectionHeading 
          title="Projects" 
          subtitle={dbProfile?.projectsTagline || "A curated selection of my recent works, ranging from mobile applications to complex web systems."}
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
                  : 'bg-surface/50 text-text-secondary hover:text-text-primary border border-border backdrop-blur-sm'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "200px 0px", amount: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
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
