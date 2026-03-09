'use client'

import { getGithubAvatarUrl } from '@/lib/github-utils'
import { motion } from 'framer-motion'
import { Button } from '../ui/Button'
import { fadeInUp, staggerContainer } from '@/lib/animations'
import Image from 'next/image'
import { Download, Github, Linkedin, Twitter, Instagram, Zap } from 'lucide-react'

interface HeroProps {
  dbProfile?: any
}

export function Hero({ dbProfile }: HeroProps) {
  const scrollToContact = () => {
    const contact = document.getElementById('contact')
    if (contact) contact.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center py-24 overflow-hidden bg-background">
      {/* Premium Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[120px] animate-pulse pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-accent-secondary/10 rounded-full blur-[120px] pointer-events-none" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-24">
          {/* Left Content */}
          <motion.div 
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="flex-1 text-center lg:text-left space-y-10"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-md shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500">Status: Available for Work</span>
            </motion.div>

            <div className="space-y-6">
              <motion.h1 
                variants={fadeInUp}
                className="text-6xl sm:text-7xl lg:text-9xl font-black text-text-primary tracking-tighter leading-[0.85] filter drop-shadow-sm"
              >
                {dbProfile?.name?.split(' ')[0] || "Creative"}<br />
                <span className="text-accent inline-block mt-2">{dbProfile?.name?.split(' ').slice(1).join(' ') || "Developer"}</span>
              </motion.h1>
              
              <motion.div variants={fadeInUp} className="space-y-4">
                <p className="text-xl md:text-2xl text-text-secondary max-w-2xl font-medium leading-relaxed">
                  {dbProfile?.tagline || "Architecting premium digital ecosystems through code and strategic design."}
                </p>
                <div className="w-20 h-1 bg-accent/20 rounded-full mx-auto lg:mx-0" />
                <p className="text-[10px] sm:text-xs text-text-secondary/40 font-black tracking-[0.4em] uppercase">
                  {dbProfile?.tagline || "Specializing in High-Performance Modern Solutions"}
                </p>
              </motion.div>
            </div>

            <motion.div variants={fadeInUp} className="flex flex-wrap items-center justify-center lg:justify-start gap-5">
              <Button onClick={scrollToContact} className="px-10 py-5 text-sm uppercase tracking-widest bg-accent hover:bg-accent/90 text-white rounded-[2rem] shadow-2xl shadow-accent/20 transition-all hover:scale-105 active:scale-95 font-black">
                Start Conversation
              </Button>
              {dbProfile?.resume_url && (
                <a 
                  href={dbProfile.resume_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-10 py-5 text-sm uppercase tracking-widest bg-surface/50 backdrop-blur-md border border-border hover:border-accent/40 text-text-primary rounded-[2rem] shadow-lg transition-all hover:scale-105 active:scale-95 font-black flex items-center gap-2"
                >
                  <Download size={18} />
                  Resume.pdf
                </a>
              )}
            </motion.div>

            {/* Social Links */}
            <motion.div variants={fadeInUp} className="flex items-center justify-center lg:justify-start gap-4">
              {[
                { icon: <Github size={20} />, url: dbProfile?.social_links?.github },
                { icon: <Linkedin size={20} />, url: dbProfile?.social_links?.linkedin },
                { icon: <Twitter size={20} />, url: dbProfile?.social_links?.twitter },
                { icon: <Instagram size={20} />, url: dbProfile?.social_links?.instagram },
              ].map((social, i) => social.url && (
                <a 
                  key={i} 
                  href={social.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="p-4 bg-surface/40 hover:bg-surface border border-border rounded-2xl text-text-secondary hover:text-accent hover:border-accent/40 transition-all hover:-translate-y-1 shadow-sm backdrop-blur-sm"
                >
                  {social.icon}
                </a>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Image / Visualization */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1 relative group"
          >
            <div className="relative w-72 h-72 sm:w-96 sm:h-96 lg:w-[32rem] lg:h-[32rem] mx-auto">
              {/* Complex decorative layers */}
              <div className="absolute inset-0 bg-accent/30 rounded-[3rem] rotate-6 group-hover:rotate-0 transition-all duration-1000 blur-3xl opacity-50" />
              <div className="absolute -inset-8 border border-accent/5 rounded-[4rem] animate-[spin_30s_linear_infinite]" />
              <div className="absolute -inset-16 border border-accent/5 rounded-[5rem] animate-[spin_45s_linear_infinite_reverse]" />
              
              <div className="relative w-full h-full rounded-[3rem] overflow-hidden bg-surface-secondary/30 backdrop-blur-md border border-border group-hover:border-accent/40 transition-all duration-700 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] dark:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.7)] p-2">
                <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden">
                  <Image
                    src={getGithubAvatarUrl(dbProfile?.avatar_url) || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop"}
                    alt={dbProfile?.name || "Owner"}
                    fill
                    sizes="(max-width: 768px) 300px, 600px"
                    className="object-cover transition-all duration-1000 group-hover:scale-105"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                </div>
              </div>

              {/* Floaties */}
              <motion.div 
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-6 -right-6 p-4 rounded-3xl bg-surface/80 backdrop-blur-xl border border-border shadow-2xl z-20"
              >
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                    <Zap size={16} />
                </div>
              </motion.div>
              
              <motion.div 
                animate={{ y: [0, 20, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-10 -left-10 p-5 rounded-3xl bg-surface/80 backdrop-blur-xl border border-border shadow-2xl z-20"
              >
                <div className="flex flex-col gap-1">
                    <span className="text-[8px] font-black text-text-secondary uppercase tracking-widest">Global Reach</span>
                    <span className="text-sm font-black text-text-primary">100% Remote</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
