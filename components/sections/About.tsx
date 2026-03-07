'use client'

import { motion } from 'framer-motion'
import { SectionHeading } from '../ui/SectionHeading'
import { skills } from '@/data/skills'
import { fadeInUp, staggerContainer } from '@/lib/animations'
import { 
  Rocket, 
  Target, 
  Lightbulb, 
  Smartphone, 
  Code2, 
  Cpu, 
  Zap,
  CheckCircle2,
  Trophy,
  Users
} from 'lucide-react'
import { Card } from '../ui/Card'

export function About() {
  const stats = [
    { label: 'Apps Delivered', value: '15+', icon: Rocket },
    { label: 'Years Experience', value: '5+', icon: Zap },
    { label: 'Happy Clients', value: '30+', icon: Users },
    { label: 'Tech Stack', value: '25+', icon: Cpu },
  ]

  const coreValues = [
    {
      title: 'Precision Engineering',
      desc: 'I believe in code that isn\'t just functional, but high-performance and future-proof.',
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

  return (
    <section id="about" className="py-16 md:py-24 px-4 relative overflow-hidden">
      <div className="container mx-auto max-w-6xl">
        <SectionHeading 
          title="Narrative & Expertise" 
          subtitle="A specialized window into the vision, metrics, and technological foundation I bring to every project."
        />

        <div className="mt-12 md:mt-20 grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10">
          
          {/* Narrative Column */}
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
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
                    <h3 className="text-xl font-bold mb-3 text-text-primary dark:text-white">{value.title}</h3>
                    <p className="text-sm text-text-secondary leading-relaxed">{value.desc}</p>
                  </div>
                </Card>
              ))}
            </div>

            {/* Metrics Marquee/Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, i) => (
                <div key={i} className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-border/40 bg-background dark:bg-white/[0.02] flex flex-col items-center text-center group hover:border-accent/20 transition-all">
                  <div className="p-2 rounded-xl text-accent/40 group-hover:text-accent group-hover:bg-accent/5 transition-all mb-2">
                    <stat.icon size={20} />
                  </div>
                  <span className="block text-3xl font-black text-text-primary dark:text-white tracking-tighter">{stat.value}</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-text-secondary/60">{stat.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Skill Clusters */}
          <div className="lg:col-span-12 mt-10">
             <div className="rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-10 bg-surface dark:bg-surface/10 border border-border backdrop-blur-xl">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                   <div>
                      <h3 className="text-2xl font-black tracking-tight text-text-primary dark:text-white mb-2">Technological Arsenal</h3>
                      <p className="text-sm text-text-secondary">A comprehensive look at the modern stack I utilize to build pixel-perfect ecosystems.</p>
                   </div>
                   <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-accent/20 bg-accent/5 text-accent text-xs font-bold uppercase tracking-widest">
                      <Code2 size={14} />
                      Current Version: 2024.1
                   </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                   {['Mobile', 'Frontend', 'Backend', 'Tools'].map((category) => (
                     <div key={category} className="space-y-6">
                        <div className="flex items-center gap-2 mb-4">
                           <div className="w-1.5 h-1.5 rounded-full bg-accent pr-1" />
                           <span className="text-xs font-black uppercase tracking-[0.2em] text-text-primary/70 dark:text-white/60">{category}</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                           {skills.filter(s => s.category === category).map(skill => (
                             <div 
                                key={skill.name}
                                className="px-4 py-2 rounded-xl bg-background dark:bg-white/[0.03] border border-border/40 hover:border-accent/30 hover:bg-accent/[0.02] transition-all flex items-center justify-center text-[11px] font-bold text-text-secondary hover:text-accent shadow-sm"
                             >
                                {skill.name}
                             </div>
                           ))}
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          </div>

          {/* Philosophy Statement */}
          <div className="lg:col-span-12 mt-10 p-0.5 md:p-1 bg-gradient-to-r from-accent/20 via-accent-secondary/20 to-accent/20 rounded-[1.5rem] md:rounded-[2.5rem]">
             <div className="rounded-[1.4rem] md:rounded-[2.4rem] bg-background dark:bg-surface p-8 md:p-12 text-center space-y-6 md:space-y-8 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-accent/5 blur-[100px] rounded-full" />
                <h4 className="text-xl sm:text-3xl md:text-5xl font-black text-text-primary dark:text-white tracking-tighter max-w-3xl mx-auto leading-tight sm:leading-none relative z-10">
                  I don&apos;t just write code. I engineer <span className="text-accent underline decoration-accent/20 underline-offset-4 sm:underline-offset-8">experiences</span> that bridge users and possibilities.
                </h4>
                <div className="flex flex-wrap justify-center gap-4 relative z-10">
                   <div className="flex items-center gap-2 text-xs font-bold text-text-secondary/60 uppercase tracking-widest">
                      <CheckCircle2 size={14} className="text-accent" />
                      Scaleable Architecture
                   </div>
                   <div className="flex items-center gap-2 text-xs font-bold text-text-secondary/60 uppercase tracking-widest">
                      <CheckCircle2 size={14} className="text-accent" />
                      Pixel Perfection
                   </div>
                   <div className="flex items-center gap-2 text-xs font-bold text-text-secondary/60 uppercase tracking-widest">
                      <CheckCircle2 size={14} className="text-accent" />
                      Client Satisfaction
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  )
}
