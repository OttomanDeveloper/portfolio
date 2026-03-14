'use client'

import { motion } from 'framer-motion'
import { SectionHeading } from '../ui/SectionHeading'
import { Card } from '../ui/Card'
import { staggerContainer } from '@/lib/animations'
import { Briefcase, Calendar, MapPin } from 'lucide-react'
import { useIsMobile } from '@/hooks/use-mobile'
import { experiences as staticExperiences, Experience as ExperienceType } from '@/data/experience'

interface ExperienceProps {
  experiences?: ExperienceType[]
}

export function Experience({ experiences = staticExperiences }: ExperienceProps) {
  const isMobile = useIsMobile()

  return (
    <section id="experience" className="py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <SectionHeading 
          title="Work Experience" 
          subtitle="A journey through my professional career and the companies I've helped grow."
        />

        <div className="relative mt-12 space-y-8 before:absolute before:inset-0 before:ml-5 md:before:mx-auto before:-translate-x-px md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
          <motion.div
            variants={staggerContainer}
            initial={isMobile ? false : "initial"}
            whileInView={isMobile ? undefined : "animate"}
            animate={isMobile ? { opacity: 1, y: 0 } : undefined}
            viewport={isMobile ? undefined : { once: true, margin: "200px 0px", amount: 0 }}
            className="space-y-8"
          >
            {experiences.map((exp, index) => (
              <div key={exp.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                {/* Dot */}
                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-border bg-background shadow shrink-0 z-10 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 transition-colors group-hover:border-accent group-hover:bg-accent/5">
                  <Briefcase className="w-5 h-5 text-accent" />
                </div>

                {/* Card */}
                <Card className="w-[calc(100%-4rem)] md:w-[45%] p-5 md:p-6 hover:border-accent/30 transition-all duration-300 shadow-sm hover:shadow-md">
                  <div className="flex flex-col space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <h3 className="text-xl font-bold text-text-primary">{exp.position}</h3>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent">
                        <Calendar className="w-3 h-3 mr-1" />
                        {exp.startDate} – {exp.endDate}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-text-secondary">
                      <span className="font-semibold text-text-primary">{exp.company}</span>
                      <span className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {exp.location}
                      </span>
                    </div>

                    <ul className="space-y-2 pt-2">
                      {exp.description.map((item, i) => (
                        <li key={i} className="text-text-secondary text-sm flex items-start">
                          <span className="mr-2 mt-1.5 h-1.5 w-1.5 rounded-full bg-accent shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>

                    <div className="flex flex-wrap gap-2 pt-4">
                      {exp.technologies.map((tech) => (
                        <span key={tech} className="px-2 py-1 rounded-md bg-surface border border-border text-[10px] font-medium uppercase tracking-wider">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
