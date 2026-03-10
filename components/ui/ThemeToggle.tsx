'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../providers/ThemeProvider'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    requestAnimationFrame(() => {
      setMounted(true)
    })
  }, [])

  if (!mounted) return <div className="p-2 w-9 h-9" />

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-surface border border-border text-text-primary hover:bg-surface/80 transition-colors shadow-sm"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <Moon size={20} className="text-accent" />
      ) : (
        <Sun size={20} className="text-accent" />
      )}
    </motion.button>
  )
}
