'use client'

import { motion } from 'framer-motion'
import { Button } from '../ui/Button'
import { fadeInUp, staggerContainer } from '@/lib/animations'
import { GitHubProfile } from '@/lib/github'
import { Github, Linkedin, Twitter, ArrowRight, Download } from 'lucide-react'
import Image from 'next/image'

interface HeroProps {
  profile: GitHubProfile
}

export function Hero({ profile }: HeroProps) {
  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  const scrollToProjects = () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="home" className="relative flex min-h-screen items-center justify-center overflow-hidden py-20 md:py-32 px-4">
      <div className="container mx-auto max-w-6xl relative z-10">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="flex flex-col items-center text-center space-y-12"
        >
          {/* Profile Image - Smaller & Elite */}
          <motion.div 
            variants={fadeInUp}
            className="relative"
          >
            <div className="relative h-32 w-32 md:h-40 md:w-40 overflow-hidden rounded-3xl border border-white/10 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500 bg-surface">
              <Image
                src={profile.avatar_url}
                alt={profile.name}
                fill
                priority
                className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
            </div>
            <div 
              className="absolute -inset-4 -z-10 rounded-full blur-2xl opacity-20" 
              style={{ backgroundColor: 'var(--accent)' }}
            />
          </motion.div>

          {/* Text Content - High Impact */}
          <div className="space-y-8 max-w-4xl">
            <motion.div variants={fadeInUp} className="space-y-6">
              <h2 className="text-[10px] sm:text-xs md:text-sm font-bold text-accent uppercase tracking-[0.2em] sm:tracking-[0.4em] opacity-80">
                Architecting Seamless Digital Ecosystems
              </h2>
              <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter text-text-primary leading-[0.95] sm:leading-[0.9]">
                I build <span className="text-transparent bg-clip-text bg-gradient-to-br from-text-primary via-accent to-accent-secondary">Apps</span> that users love.
              </h1>
              <p className="text-lg md:text-xl lg:text-2xl text-text-secondary max-w-2xl mx-auto leading-relaxed opacity-70">
                Hi, I&apos;m <span className="text-text-primary font-bold">{profile.name}</span>. A specialized developer pushing the boundaries of <span className="text-text-primary">Mobile & Web</span> architecture.
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row flex-wrap gap-4 md:gap-6 justify-center pt-4">
              <Button onClick={scrollToProjects} className="px-6 sm:px-8 py-4 sm:py-6 rounded-2xl text-base sm:text-lg font-bold shadow-2xl bg-accent hover:bg-accent-secondary transition-all w-full sm:w-auto">
                The Lab
                <ArrowRight className="ml-3 h-5 w-5" />
              </Button>
              <Button variant="outline" onClick={scrollToContact} className="px-6 sm:px-8 py-4 sm:py-6 rounded-2xl text-base sm:text-lg font-medium border-border hover:bg-surface/50 dark:border-white/10 dark:hover:bg-white/5 transition-all shadow-sm w-full sm:w-auto">
                Start a Conversation
              </Button>
              <Button variant="outline" className="px-6 sm:px-8 py-4 sm:py-6 rounded-2xl text-base sm:text-lg font-medium border-border hover:bg-surface/50 dark:border-white/10 dark:hover:bg-white/5 transition-all shadow-sm flex items-center justify-center gap-2 group/cv w-full sm:w-auto">
                <Download size={18} className="group-hover/cv:translate-y-0.5 transition-transform" />
                Resume / CV
              </Button>
            </motion.div>

            <motion.div variants={fadeInUp} className="flex items-center gap-8 justify-center pt-8">
              {[
                { icon: <Github size={22} />, url: profile.html_url },
                { icon: <Linkedin size={22} />, url: "https://linkedin.com" },
                { icon: <Twitter size={22} />, url: "https://twitter.com" },
              ].map((social, i) => (
                <a 
                  key={i}
                  href={social.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="p-3 rounded-full border border-white/5 bg-white/5 text-text-secondary hover:text-accent hover:border-accent/40 transition-all"
                >
                  {social.icon}
                </a>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
