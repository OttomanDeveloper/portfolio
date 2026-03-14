'use client'

import { motion } from 'framer-motion'
import { SectionHeading } from '../ui/SectionHeading'
import { staggerContainer } from '@/lib/animations'
import { Profile } from '@/lib/types'
import { useIsMobile } from '@/hooks/use-mobile'
import { 
  Rocket, 
  Target, 
  Lightbulb, 
  Code2, 
  Cpu, 
  Zap,
  CheckCircle2,
  Users
} from 'lucide-react'
import { Card } from '../ui/Card'
import { calculateExperienceYears } from '@/lib/utils/experience'

interface AboutProps {
  dbProfile?: Profile
}

export function About({ dbProfile }: AboutProps) {
  const isMobile = useIsMobile()
  const yearsExp = calculateExperienceYears(
    dbProfile?.experience_start_date || dbProfile?.experienceStartDate || '', 
    dbProfile?.manual_years_experience ?? dbProfile?.manualYearsExperience ?? null
  )
  
  const stats = [
    { label: 'Apps Delivered', value: dbProfile?.apps_delivered || dbProfile?.apps_delivered || '—', icon: Rocket },
    { label: 'Years Experience', value: `${yearsExp}+`, icon: Zap },
    { label: 'Happy Clients', value: dbProfile?.happy_clients || dbProfile?.happy_clients || '—', icon: Users },
    { label: 'Tech Stack', value: Object.values(dbProfile?.tech_stacks || {}).flat().length || '—', icon: Cpu },
  ]

  const coreValues = [
    {
      title: 'Precision Engineering',
      desc: "I believe in code that isn't just functional, but high-performance and future-proof.",
      icon: Target
    },
    {
      title: 'Design Intuition',
      desc: 'Bridging the gap between complex logic and human-centered, aesthetic interfaces.',
      icon: Lightbulb
    },
    {
      title: 'Technical Strategy',
      desc: 'Architecting modular systems that scale and endure the test of rapidly evolving tech.',
      icon: Cpu
    }
  ]

  const techStackCategories = [
    { key: 'mobile', label: 'Mobile' },
    { key: 'frontend', label: 'Frontend' },
    { key: 'backend', label: 'Backend' },
    { key: 'tools', label: 'Tools' }
  ]

  // Support both camelCase (mapped) and snake_case (raw DB) tech stacks
  const getTechStack = (key: string): string[] => {
    const mapped = dbProfile?.techStacks?.[key]
    const raw = dbProfile?.tech_stacks?.[key]
    return mapped || raw || []
  }

  return (
    <section id="about" className="py-16 md:py-24 px-4 relative overflow-hidden">
      <div className="container mx-auto max-w-6xl">
        <SectionHeading 
          title="Narrative & Expertise" 
          subtitle={dbProfile?.narrativeTagline || dbProfile?.tagline || "A specialized window into the vision, metrics, and technological foundation I bring to every project."}
        />

        <div className="mt-12 md:mt-20 grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10">
          
          {/* Narrative Column */}
          <motion.div 
            variants={staggerContainer}
            initial={isMobile ? false : "initial"}
            whileInView={isMobile ? undefined : "animate"}
            animate={isMobile ? { opacity: 1, y: 0 } : undefined}
            viewport={{ once: true, margin: "200px 0px", amount: 0 }}
            className="lg:col-span-12 space-y-10"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {coreValues.map((value, i) => (
                <Card key={i} className="p-6 md:p-8 border-border bg-surface dark:bg-surface/20 hover:border-accent/30 transition-all group overflow-hidden relative">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <value.icon size={120} strokeWidth={1} />
                  </div>
                  <div className="relative z-10">
                    <div className="p-3 rounded-2xl bg-accent/10 w-fit mb-6 text-accent">
                      <value.icon size={24} />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-text-primary">{value.title}</h3>
                    <p className="text-sm text-text-secondary leading-relaxed">{value.desc}</p>
                  </div>
                </Card>
              ))}
            </div>

            {/* Metrics Marquee/Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, i) => (
                <div key={i} className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-border/40 bg-background dark:bg-surface/20 flex flex-col items-center text-center group hover:border-accent/20 transition-all">
                  <div className="p-2 rounded-xl text-accent/40 group-hover:text-accent group-hover:bg-accent/5 transition-all mb-2">
                    <stat.icon size={20} />
                  </div>
                  <span className="block text-3xl font-black text-text-primary tracking-tighter">{stat.value}</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-text-secondary/60">{stat.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Skill Clusters */}
          <div className="lg:col-span-12 mt-10">
             <div className="rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-10 bg-surface dark:bg-surface/10 border border-border">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                   <div>
                      <h3 className="text-2xl font-black tracking-tight text-text-primary mb-2">Technological Arsenal</h3>
                      <p className="text-sm text-text-secondary">A comprehensive look at the modern stack I utilize to build pixel-perfect ecosystems.</p>
                   </div>
                   <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-accent/20 bg-accent/5 text-accent text-xs font-bold uppercase tracking-widest">
                      <Code2 size={14} />
                      {new Date().getFullYear()}
                   </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                   {techStackCategories.map((cat) => {
                     const techList = getTechStack(cat.key)
                     return (
                       <div key={cat.key} className="space-y-6">
                          <div className="flex items-center gap-2 mb-4">
                             <div className="w-1.5 h-1.5 rounded-full bg-accent pr-1" />
                             <span className="text-xs font-black uppercase tracking-[0.2em] text-text-primary/70">{cat.label}</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                             {techList.length > 0
                               ? techList.map((skillName: string) => (
                                 <div
                                    key={skillName}
                                    className="px-4 py-2 rounded-xl bg-background dark:bg-surface/30 border border-border/40 hover:border-accent/30 hover:bg-accent/[0.02] transition-all flex items-center justify-center text-[11px] font-bold text-text-secondary hover:text-accent shadow-sm"
                                 >
                                    {skillName}
                                 </div>
                               ))
                               : <span className="text-xs text-text-secondary/40 italic">Set in Admin → About Me</span>
                             }
                          </div>
                       </div>
                     )
                   })}
                </div>
             </div>
          </div>

          {/* Philosophy Statement */}
          <div className="lg:col-span-12 mt-16 md:mt-24">
             <div className="relative p-10 md:p-16 rounded-[2.5rem] bg-surface dark:bg-surface/10 border border-border/40 text-center space-y-8 overflow-hidden">
                {/* Subtle Background Glow - Desktop Only */}
                {!isMobile && <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-accent/20 to-transparent" />}
                
                <div className="relative z-10 max-w-4xl mx-auto">
                   <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/5 border border-accent/10 mb-8">
                      <Zap size={14} className="text-accent" />
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-accent">Strategic Vision</span>
                   </div>

                   <h4 className="text-xl sm:text-2xl md:text-3xl font-bold text-text-primary tracking-tight leading-relaxed">
                      {dbProfile?.philosophy || "Engineering digital products with a focus on performance, scalability, and user-centric architecture."}
                   </h4>
                </div>

                <div className="flex flex-wrap justify-center gap-6 relative z-10 pt-4">
                   <div className="flex items-center gap-2.5 text-[10px] md:text-xs font-bold text-text-secondary/60 uppercase tracking-[0.2em]">
                      <CheckCircle2 size={14} className="text-accent" />
                      Scalable Architecture
                   </div>
                   <div className="flex items-center gap-2.5 text-[10px] md:text-xs font-bold text-text-secondary/60 uppercase tracking-[0.2em]">
                      <CheckCircle2 size={14} className="text-accent" />
                      Pixel Perfection
                   </div>
                   <div className="flex items-center gap-2.5 text-[10px] md:text-xs font-bold text-text-secondary/60 uppercase tracking-[0.2em]">
                      <CheckCircle2 size={14} className="text-accent" />
                      Product Strategy
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  )
}
