'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, User, Briefcase, Mail, Github, Twitter, Linkedin, Menu, X, Instagram, Youtube, MessageSquare, Cpu } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'
import { cn } from '@/lib/utils'
import { Profile } from '@/lib/types'

interface FloatingNavProps {
  dbProfile?: Profile
}

export function FloatingNav({ dbProfile }: FloatingNavProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const navItems = [
    { name: 'Home', href: '#home', icon: <Home size={20} /> },
    { name: 'Projects', href: '#projects', icon: <Briefcase size={20} /> },
    { name: 'Experience', href: '#experience', icon: <Cpu size={20} /> },
    { name: 'About', href: '#about', icon: <User size={20} /> },
    { name: 'Reviews', href: '#reviews', icon: <MessageSquare size={20} /> },
    { name: 'Contact', href: '#contact', icon: <Mail size={20} /> },
  ]

  const socialData = dbProfile?.social_links || {}
  const socials = [
    ...(socialData.github ? [{ icon: <Github size={18} />, url: socialData.github }] : []),
    ...(socialData.linkedin ? [{ icon: <Linkedin size={18} />, url: socialData.linkedin }] : []),
    ...(socialData.twitter ? [{ icon: <Twitter size={18} />, url: socialData.twitter }] : []),
    ...(socialData.instagram ? [{ icon: <Instagram size={18} />, url: socialData.instagram }] : []),
    ...(dbProfile?.social_links?.youtube ? [{ icon: <Youtube size={18} />, url: dbProfile.social_links.youtube }] : []),
  ]

  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100]">
      {/* Desktop Nav - Floating Dock */}
      <motion.nav 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="hidden md:flex items-center gap-2 p-2 rounded-3xl bg-surface/40 backdrop-blur-md border border-border shadow-2xl"
      >
        <div className="flex items-center gap-1 px-2 border-r border-border/10">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              aria-label={`Scroll to ${item.name}`}
              className="p-3 rounded-2xl text-text-secondary hover:text-accent hover:bg-accent/5 transition-all relative group"
            >
              {item.icon}
              <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md bg-surface border border-border text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {item.name}
              </span>
            </a>
          ))}
        </div>

        <div className="flex items-center gap-1 px-2 border-r border-border/10">
           {socials.map((social, i) => (
             <a
               key={i}
               href={social.url}
               target="_blank"
               rel="noopener noreferrer"
               aria-label="Social Link"
               className="p-3 rounded-2xl text-text-secondary hover:text-accent hover:bg-white/5 transition-all"
             >
               {social.icon}
             </a>
           ))}
        </div>

        <div className="px-2">
           <ThemeToggle />
        </div>
      </motion.nav>

      {/* Mobile Nav - Expandable FAB */}
      <div className="md:hidden flex flex-col items-center gap-4">
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.1, ease: "linear" }}
              className="flex flex-col gap-2 p-2 rounded-3xl bg-surface border border-border shadow-2xl"
            >
              {navItems.map((item) => (
                 <a
                   key={item.name}
                   href={item.href}
                   aria-label={`Scroll to ${item.name}`}
                   onClick={() => setIsExpanded(false)}
                   className="p-4 rounded-2xl flex items-center gap-4 text-text-secondary hover:text-accent hover:bg-white/5 active:bg-white/5 transition-colors"
                 >
                   {item.icon}
                   <span className="text-sm font-bold uppercase tracking-widest">{item.name}</span>
                 </a>
              ))}
              <div className="h-px bg-border/10 my-2 mx-4" />
              <div className="flex items-center justify-center gap-2 p-2">
                {socials.map((social, i) => (
                   <a
                     key={i}
                     href={social.url}
                     target="_blank"
                     rel="noopener noreferrer"
                     aria-label="Social Link"
                     className="p-3 rounded-2xl text-text-secondary hover:text-accent hover:bg-white/5 transition-all"
                   >
                     {social.icon}
                   </a>
                ))}
              </div>
              <div className="h-px bg-border/10 my-2 mx-4" />
              <div className="flex justify-center p-2">
                 <ThemeToggle />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-5 rounded-full bg-accent text-white shadow-2xl hover:scale-110 active:scale-95 transition-all"
        >
          {isExpanded ? <X /> : <Menu />}
        </button>
      </div>
    </div>
  )
}
