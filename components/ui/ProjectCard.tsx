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
  githubUrl?: string
  liveUrl?: string
  vibrantColor: string
  stats?: { label: string; value: string }[]
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
  vibrantColor,
  stats = [],
  onViewCaseStudy
}: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  
  // Tilt values
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [5, -5]), { damping: 25, stiffness: 150 })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-5, 5]), { damping: 25, stiffness: 150 })

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const relX = event.clientX - rect.left
    const relY = event.clientY - rect.top
    x.set(relX / rect.width - 0.5)
    y.set(relY / rect.height - 0.5)
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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative h-full"
    >
      <Card className="h-full overflow-hidden border-[var(--card-border)] bg-[var(--card-bg)] backdrop-blur-[40px] backdrop-saturate-[180%] transition-all duration-500 hover:border-accent/30 p-6 sm:p-8 flex flex-col relative shadow-[var(--card-shadow)]">
        
        {/* Glass Edge Highlight (Simulating iOS depth) */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none opacity-50 dark:opacity-20" />
        <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent pointer-events-none opacity-50 dark:opacity-10" />

        {/* Subtle Glow Background */}
        <div 
            className="absolute -top-24 -right-24 w-64 h-64 rounded-full blur-[120px] opacity-[0.1] pointer-events-none group-hover:opacity-[0.2] transition-opacity duration-700"
            style={{ backgroundColor: vibrantColor }}
        />

        {/* Header: Icon + Title */}
        <div className="flex items-start gap-5 mb-6">
            <div 
                className="w-16 h-16 shrink-0 rounded-[1.4rem] bg-surface flex items-center justify-center text-text-primary shadow-lg dark:shadow-2xl relative z-10 overflow-hidden group/icon"
                style={{ 
                    border: `1.5px solid ${vibrantColor}30`,
                }}
            >
                <div 
                    className="absolute inset-0 opacity-0 group-hover/icon:opacity-20 transition-opacity duration-500"
                    style={{ backgroundColor: vibrantColor }}
                />
                <div className="relative" style={{ color: vibrantColor }}>
                    {icon}
                </div>
            </div>

            <div className="flex-1 pt-1.5">
                <h3 className="text-xl font-extrabold text-text-primary tracking-tight leading-none mb-2">{name}</h3>
                <p className="text-sm font-medium text-text-secondary line-clamp-1 opacity-80">{description}</p>
            </div>
        </div>

        {/* Tech Stack Tags */}
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 mb-6">
            {languages.map((lang) => (
                <span key={lang} className="text-[11px] font-bold text-text-secondary uppercase tracking-widest">
                    {lang}
                </span>
            ))}
        </div>

        {/* Platform Pills */}
        <div className="flex flex-wrap gap-2.5 mb-8">
            {platforms.map((platform) => (
                <span 
                    key={platform} 
                    className="px-3.5 py-1.5 rounded-full text-[10px] font-black bg-surface/50 dark:bg-white/5 border border-[var(--card-border)] text-text-primary uppercase tracking-[0.1em] shadow-sm backdrop-blur-md"
                >
                    {platform}
                </span>
            ))}
        </div>

        {/* Stats Grid - Premium Contrast Card */}
        <div className="grid grid-cols-3 gap-3 mb-8">
            {(stats.length > 0 ? stats : [
                { label: 'Price', value: 'Free' },
                { label: 'Rating', value: '5.0★' },
                { label: 'Type', value: 'OSS' }
            ]).map((stat, i) => (
                <div key={i} className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-surface/50 dark:bg-white/5 border border-[var(--card-border)] text-center transition-all hover:bg-surface dark:hover:bg-white/10">
                    <span className="text-sm font-black text-text-primary mb-1 tracking-tight" style={{ color: i === 0 ? vibrantColor : undefined }}>
                        {stat.value}
                    </span>
                    <span className="text-[9px] font-black text-text-secondary/60 uppercase tracking-widest leading-none">
                        {stat.label}
                    </span>
                </div>
            ))}
        </div>

        {/* Actions Row */}
        <div className="mt-auto flex gap-3">
            <Button 
                onClick={(e) => {
                    e.preventDefault();
                    onViewCaseStudy();
                }}
                style={{ backgroundColor: vibrantColor }}
                className="flex-1 py-6 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-xl hover:brightness-110 active:scale-95 transition-all"
            >
                Case Study
            </Button>
            
            <div className="flex gap-2">
                {liveUrl && (
                  <a 
                      href={liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Live Preview"
                      className="flex items-center justify-center w-12 rounded-2xl bg-accent/10 border border-accent/20 text-accent hover:bg-accent/20 transition-all"
                  >
                      <ExternalLink size={18} />
                  </a>
                )}

                {githubUrl && (
                  <a 
                      href={githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Source Code"
                      className="flex items-center justify-center w-12 rounded-2xl bg-surface/50 dark:bg-white/10 border border-[var(--card-border)] text-text-primary hover:bg-surface dark:hover:bg-white/20 transition-all"
                  >
                      <Github size={18} />
                  </a>
                )}
            </div>
        </div>
      </Card>
    </motion.div>
  )
}
