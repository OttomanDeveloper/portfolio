'use client'

import { useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Button } from './Button'
import { Card } from './Card'
import { Github, ExternalLink, Smartphone, Globe, Layers, Code2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useIsMobile } from '@/hooks/use-mobile'

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
  const isMobile = useIsMobile()
  const cardRef = useRef<HTMLDivElement>(null)
  
  // Tilt values
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [5, -5]), { damping: 25, stiffness: 150 })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-5, 5]), { damping: 25, stiffness: 150 })

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    if (!cardRef.current || isMobile) return
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
      initial={isMobile ? false : { opacity: 0, y: 20 }}
      animate={isMobile ? { opacity: 1, y: 0 } : undefined}
      whileInView={isMobile ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative h-full"
      style={{
        rotateX: isMobile ? 0 : rotateX,
        rotateY: isMobile ? 0 : rotateY,
        transformStyle: 'preserve-3d',
        willChange: isMobile ? 'auto' : 'transform'
      }}
    >
      <Card 
        className={`h-full overflow-hidden border-[var(--card-border)] bg-[var(--card-bg)] transition-all duration-500 p-6 sm:p-8 flex flex-col relative ${!isMobile ? 'backdrop-blur-[40px] backdrop-saturate-[180%] shadow-[var(--card-shadow)]' : 'shadow-sm'}`}
        onMouseEnter={(e) => {
          if (!isMobile) {
            e.currentTarget.style.borderColor = `${vibrantColor}40`;
            e.currentTarget.style.boxShadow = `0 20px 40px -15px ${vibrantColor}20`;
          }
        }}
        onMouseLeave={(e) => {
          if (!isMobile) {
            e.currentTarget.style.borderColor = '';
            e.currentTarget.style.boxShadow = '';
          }
        }}
      >
        
        {/* Glass Edge Highlight */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none opacity-50 dark:opacity-20" />

        {/* Inner Glow Overlay - Disabled on mobile for performance */}
        {!isMobile && (
            <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none"
                style={{ 
                    background: `radial-gradient(circle at center, ${vibrantColor}, transparent 70%)` 
                }}
            />
        )}

        {/* Subtle Glow Background */}
        <div 
            className="absolute -top-24 -right-24 w-64 h-64 rounded-full blur-[120px] opacity-[0.05] pointer-events-none group-hover:opacity-[0.15] transition-opacity duration-700"
            style={{ backgroundColor: vibrantColor }}
        />

        {/* Header: Icon + Title + Platforms */}
        <div className="flex items-center gap-5 mb-8">
            <div 
                className="w-14 h-14 shrink-0 rounded-2xl bg-surface flex items-center justify-center text-text-primary shadow-lg relative z-10 overflow-hidden group/icon"
                style={{ border: `1px solid ${vibrantColor}30` }}
            >
                <div 
                    className="absolute inset-0 opacity-0 group-hover/icon:opacity-20 transition-opacity duration-500"
                    style={{ backgroundColor: vibrantColor }}
                />
                <div className="relative" style={{ color: vibrantColor }}>
                    {icon}
                </div>
            </div>

            <div className="flex-1 min-w-0">
                <h3 className="text-xl font-black text-text-primary tracking-tight leading-none mb-3 truncate">{name}</h3>
                <div className="flex flex-wrap gap-2">
                    {platforms.map((platform) => (
                        <span key={platform} className="px-2 py-0.5 rounded-md border border-accent/30 text-[9px] font-black text-accent uppercase tracking-widest flex items-center gap-1.5 opacity-90 transition-colors hover:bg-accent/5">
                            {platform.toLowerCase().includes('android') && <Smartphone size={10} />}
                            {platform.toLowerCase().includes('ios') && <Smartphone size={10} />}
                            {platform.toLowerCase().includes('web') && <Globe size={10} />}
                            {platform}
                        </span>
                    ))}
                </div>
            </div>
        </div>

        {/* Info Area: Description + Stack */}
        <div className="flex-1 flex flex-col mb-8">
            <p className="text-sm font-medium text-text-secondary leading-relaxed opacity-90 mb-6">{description}</p>
            
            <div className="mt-auto flex flex-wrap gap-2">
                {languages.map((lang) => (
                    <span key={lang} className="px-2.5 py-1 rounded-lg border border-dashed border-text-secondary/20 text-[10px] font-bold text-text-secondary/60 uppercase tracking-[0.1em] hover:border-text-secondary/40 transition-colors">
                        {lang}
                    </span>
                ))}
            </div>
        </div>

        {/* Stats Grid - Limited to 3 */}
        <div className="grid grid-cols-3 gap-3 mb-8">
            {(stats && stats.length > 0 ? stats : [
                { label: 'Status', value: 'Active' },
                { label: 'Rating', value: '5.0★' },
                { label: 'Type', value: 'Public' }
            ]).slice(0, 3).map((stat, i) => (
                <div key={i} className="flex flex-col items-center justify-center p-3 rounded-xl bg-surface/40 dark:bg-white/[0.02] border border-border/40 text-center transition-all hover:bg-surface dark:hover:bg-white/[0.05] group/stat hover:scale-[1.02] backdrop-blur-sm">
                    <span className="text-[12px] font-black text-text-primary mb-0.5 tracking-tight" style={{ color: i === 0 ? vibrantColor : undefined }}>
                        {stat.value}
                    </span>
                    <span className="text-[8px] font-black text-text-secondary/40 uppercase tracking-[0.1em] leading-none">
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
