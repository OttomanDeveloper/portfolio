'use client'

import { useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Button } from './Button'
import { Card } from './Card'
import { Github, ExternalLink, Smartphone, Globe, Layers, Code2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ProjectCardProps {
  name: string
  description: string
  icon?: React.ReactNode
  languages: string[]
  platforms: string[]
  githubUrl: string
  liveUrl?: string
  caseStudyUrl?: string
  vibrantColor: string
  onViewCaseStudy: () => void
}

export function ProjectCard({
  name,
  description,
  icon,
  languages,
  platforms,
  githubUrl,
  liveUrl,
  caseStudyUrl,
  vibrantColor,
  onViewCaseStudy
}: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  
  // Tilt values
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), { damping: 20, stiffness: 200 })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), { damping: 20, stiffness: 200 })

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    
    // Relative position
    const relX = event.clientX - rect.left
    const relY = event.clientY - rect.top
    
    // Tilt calculation
    x.set(relX / rect.width - 0.5)
    y.set(relY / rect.height - 0.5)

    // Spotlight calculation
    mouseX.set(relX)
    mouseY.set(relY)
  }

  function handleMouseLeave() {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      className="group relative h-full perspective-1000"
    >
      <Card className="h-full flex flex-col p-0 overflow-hidden border-border/50 dark:border-white/5 bg-surface/80 dark:bg-surface/40 backdrop-blur-md shadow-xl dark:shadow-2xl group-hover:border-accent/40 transition-all duration-500 relative">
        {/* Cursor Spotlight */}
        <motion.div
          className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: useTransform(
              [mouseX, mouseY],
              ([mx, my]) => `radial-gradient(600px circle at ${mx}px ${my}px, ${vibrantColor}20, transparent 40%)`
            ),
          }}
        />

        <div className="p-8 flex flex-col h-full relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="p-3 rounded-2xl bg-background dark:bg-surface shadow-lg dark:shadow-xl text-accent border border-border/20 dark:border-border/10">
              {icon}
            </div>
            <div className="flex gap-4">
              <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-accent transition-colors">
                <Github size={20} />
              </a>
              {liveUrl && (
                <a href={liveUrl} target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-accent transition-colors">
                  <ExternalLink size={20} />
                </a>
              )}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-2xl font-black text-text-primary tracking-tight mb-2 group-hover:translate-x-1 transition-transform dark:text-white">{name}</h3>
            <p className="text-sm text-text-secondary leading-relaxed line-clamp-2 opacity-80 dark:opacity-70">
              {description}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 mb-8 mt-auto">
            {languages.map((lang) => (
              <span key={lang} className="text-[10px] font-bold text-text-secondary/60 uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-accent/40" />
                {lang}
              </span>
            ))}
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap gap-3">
              {platforms.map((platform) => (
                <span 
                  key={platform} 
                  className="px-3 py-1 rounded-full text-[9px] font-bold bg-accent/5 text-accent border border-accent/20 uppercase tracking-widest"
                >
                  {platform}
                </span>
              ))}
            </div>

            <Button 
              onClick={(e) => {
                e.preventDefault();
                onViewCaseStudy();
              }}
              style={{ backgroundColor: vibrantColor }}
              className="w-full py-6 text-xs font-black uppercase tracking-widest text-white shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              View Case Study
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
