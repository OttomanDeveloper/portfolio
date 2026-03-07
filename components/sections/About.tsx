'use client'

import { motion } from 'framer-motion'
import { SectionHeading } from '../ui/SectionHeading'
import { skills } from '@/data/skills'
import { fadeInUp } from '@/lib/animations'
import * as Icons from 'lucide-react'
import { BentoGrid, BentoGridItem } from '../ui/BentoGrid'

export function About() {
  const categories = ['Mobile', 'Frontend', 'Backend', 'Tools']

  return (
    <section id="about" className="py-32 px-4 relative">
      <div className="container mx-auto max-w-6xl">
        <SectionHeading 
          title="The Architect" 
          subtitle="A modular look into my philosophy, performance metrics, and technological foundation."
        />

        <BentoGrid className="mt-16">
          {/* Bio Card - Large */}
          <BentoGridItem
            title="Design Vision"
            description="With over 5 years in the ecosystem, I bridge the gap between complex engineering and pixel-perfect design. I don't just write code; I craft systems that endure."
            header={
              <div className="flex-1 w-full h-full min-h-[6rem] rounded-2xl bg-gradient-to-br from-accent/10 to-accent-secondary/10 flex items-center justify-center border border-white/5 overflow-hidden relative">
                 <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550745165-9bc0b252723f?q=80&w=1470&auto=format&fit=crop')] bg-cover opacity-10 grayscale" />
                 <Icons.ShieldCheck size={48} className="text-accent opacity-50 relative z-10" />
              </div>
            }
            className="md:col-span-2 md:row-span-2"
            icon={<Icons.Quote className="text-accent" />}
          />

          {/* Core Stack */}
          <BentoGridItem
            title="Core Engine"
            description="Specializing in Flutter & React Native for seamless cross-platform delivery."
            header={
              <div className="flex-1 flex flex-wrap gap-2 p-4 content-start">
                 {['Flutter', 'React Native', 'Next.js', 'Typescript'].map(tech => (
                   <span key={tech} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-accent">
                     {tech}
                   </span>
                 ))}
              </div>
            }
            className="md:col-span-1"
            icon={<Icons.Cpu className="text-accent" />}
          />

          {/* Stats Card */}
          <BentoGridItem
            title="Delivery Metrics"
            description="Proven track record of high-performance application launches."
            header={
              <div className="flex-1 flex items-center justify-around p-4 text-center">
                 <div>
                    <span className="block text-2xl font-black text-text-primary underline decoration-accent/30 decoration-4">15+</span>
                    <span className="text-[10px] text-text-secondary uppercase font-bold tracking-tighter">Apps</span>
                 </div>
                 <div className="w-px h-8 bg-border/20" />
                 <div>
                    <span className="block text-2xl font-black text-text-primary underline decoration-accent-secondary/30 decoration-4">5+</span>
                    <span className="text-[10px] text-text-secondary uppercase font-bold tracking-tighter">Years</span>
                 </div>
              </div>
            }
            className="md:col-span-1"
            icon={<Icons.Zap className="text-accent" />}
          />

          {/* Detailed Skills - Wide */}
          <BentoGridItem
            title="Technological Foundation"
            description="A comprehensive look at the tools I use to build the future."
            header={
              <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
                 {categories.map(cat => (
                   <div key={cat} className="space-y-2">
                      <span className="text-[8px] font-bold uppercase tracking-widest text-text-secondary/60">{cat}</span>
                      <div className="flex flex-wrap gap-1">
                         {skills.filter(s => s.category === cat).slice(0, 3).map(s => (
                           <div key={s.name} className="w-2 h-2 rounded-full bg-accent/40" title={s.name} />
                         ))}
                      </div>
                   </div>
                 ))}
              </div>
            }
            className="md:col-span-3"
            icon={<Icons.Layers className="text-accent" />}
          />
        </BentoGrid>
      </div>
    </section>
  )
}
