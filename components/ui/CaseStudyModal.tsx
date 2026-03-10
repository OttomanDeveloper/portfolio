'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, ExternalLink, Check } from 'lucide-react'
import { Button } from './Button'
import { IPhoneMockup } from './IPhoneMockup'
import { cn } from '@/lib/utils'
import ReactMarkdown from 'react-markdown'

interface CaseStudyModalProps {
  isOpen: boolean
  onClose: () => void
  project: {
    name: string
    description: string
    icon: React.ReactNode
    languages: string[]
    platforms: string[]
    githubUrl: string
    vibrantColor: string
    fullDescription?: string
    features?: { icon: React.ReactNode; text: string }[]
    bullets?: string[]
  } | null
}

export function CaseStudyModal({ isOpen, onClose, project }: CaseStudyModalProps) {
  if (!project) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center md:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/90 backdrop-blur-2xl"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            transition={{ type: 'spring', damping: 30, stiffness: 400 }}
            className="relative w-full max-w-5xl h-full md:h-auto max-h-[100vh] md:max-h-[90vh] overflow-hidden rounded-none md:rounded-3xl bg-surface border-0 md:border border-border shadow-2xl flex flex-col md:flex-row"
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-background/80 md:bg-background/50 backdrop-blur-md hover:bg-surface transition-colors shadow-lg border border-border/20"
            >
              <X size={18} />
            </button>

            {/* Left Column: Phone Mockup */}
            <div className="w-full md:w-2/5 p-8 md:p-8 flex items-center justify-center bg-gradient-to-b from-surface to-background/50 overflow-hidden shrink-0 border-b md:border-b-0 md:border-r border-border/10">
              <div className="scale-[0.85] sm:scale-100 transition-transform origin-center py-4">
                <IPhoneMockup>
                <div className="flex flex-col h-full">
                  <div className="flex flex-col items-center gap-4 pt-10 pb-8 relative">
                    {/* Background Glow */}
                    <div 
                      className="absolute top-10 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full blur-3xl opacity-20"
                      style={{ backgroundColor: project.vibrantColor }}
                    />
                    
                    <div className="p-5 rounded-[2rem] bg-surface shadow-2xl text-accent border border-border/10 relative z-10 scale-110">
                      {project.icon}
                    </div>
                    
                    <div className="relative z-10 text-center space-y-2 mt-2">
                        <h4 className="text-2xl font-black text-text-primary tracking-tight">{project.name}</h4>
                        <p className="text-[12px] text-text-secondary px-6 leading-relaxed opacity-80">
                        {project.description}
                        </p>
                    </div>
                  </div>

                  <div className="flex-1 space-y-2.5 px-2">
                    {project.bullets?.map((bullet, i) => (
                      <div key={i} className="py-2.5 px-5 rounded-full border border-border/80 bg-surface/50 text-[11px] font-medium leading-none flex items-center gap-3 transition-all cursor-default shadow-sm hover:border-accent/40">
                         <div 
                          className="w-1.5 h-1.5 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.1)]" 
                          style={{ backgroundColor: project.vibrantColor }}
                        />
                         <span className="opacity-90">{bullet}</span>
                      </div>
                    ))}
                  </div>

                  {/* Stats Row */}
                  <div className="pt-8 pb-4 flex justify-between px-4 border-t border-border/10 mt-auto">
                     <div className="text-center">
                        <span className="block text-[13px] font-bold text-text-primary">1M+</span>
                        <span className="block text-[9px] text-text-secondary uppercase tracking-widest opacity-60">Downloads</span>
                     </div>
                     <div className="text-center">
                        <span className="block text-[13px] font-bold text-text-primary">4.8★</span>
                        <span className="block text-[9px] text-text-secondary uppercase tracking-widest opacity-60">Rating</span>
                     </div>
                     <div className="text-center">
                        <span className="block text-[13px] font-bold text-text-primary">2.4K</span>
                        <span className="block text-[9px] text-text-secondary uppercase tracking-widest opacity-60">Reviews</span>
                     </div>
                  </div>
                </div>
              </IPhoneMockup>
              </div>
            </div>

            {/* Right Column: Details */}
            <div className="w-full md:w-3/5 p-8 sm:p-10 md:p-14 overflow-y-auto bg-surface text-text-primary scrollbar-hide">
              <div className="max-w-xl mx-auto md:mx-0 space-y-8 md:space-y-10">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <span className="block text-[10px] font-bold uppercase tracking-[0.3em] text-accent">PRODUCT LAUNCH</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-text-primary leading-tight">
                        {project.name}
                    </h2>
                    <p className="text-lg md:text-xl font-medium" style={{ color: project.vibrantColor }}>
                        {project.description}
                    </p>
                    <div className="flex items-center gap-2 text-text-secondary text-xs font-medium pt-1">
                        {project.languages.map((lang, i) => (
                            <div key={lang} className="flex items-center gap-2">
                                <span>{lang}</span>
                                {i < project.languages.length - 1 && <div className="w-1 h-1 rounded-full bg-current" />}
                            </div>
                        ))}
                    </div>
                  </div>
                  
                  <div className="pt-6 space-y-8">
                    <div className="markdown-content">
                      <ReactMarkdown>
                        {project.fullDescription || `Tailored digital solution built with ${project.languages[0]}. Focused on seamless performance and user-centric architecture.`}
                      </ReactMarkdown>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        {project.platforms.map(p => (
                             <span key={p} className="px-4 py-1.5 rounded-full border border-border bg-surface text-[10px] font-bold uppercase tracking-widest text-text-secondary/80">
                            {p}
                            </span>
                        ))}
                    </div>

                    <div className="space-y-5">
                        <ul className="space-y-4">
                           {project.bullets?.map((bullet, i) => (
                             <li key={i} className="text-text-secondary/90 flex gap-4 items-center font-medium">
                               <div className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" style={{ backgroundColor: project.vibrantColor }} />
                               {bullet}
                             </li>
                           ))}
                           <li className="text-text-secondary/90 flex gap-4 items-center font-medium">
                               <div className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" style={{ backgroundColor: project.vibrantColor }} />
                               Available in 120+ countries
                           </li>
                        </ul>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                   <Button asChild style={{ backgroundColor: project.vibrantColor }} className="text-white px-8 py-5 rounded-2xl text-base font-bold shadow-xl hover:scale-105 transition-all">
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                        Visit Interface <ExternalLink className="ml-3 h-4 w-4" />
                      </a>
                   </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
