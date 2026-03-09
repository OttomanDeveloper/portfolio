'use client'

import React, { useEffect, useRef } from 'react'
import { useTheme } from '@/components/providers/ThemeProvider'

interface Particle {
  x: number
  y: number
  size: number
  vx: number
  vy: number
  alpha: number
  baseAlpha: number
}

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()
  const mouseRef = useRef({ x: 0, y: 0 })
  const lastTimeRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    let animationFrameId: number
    let particles: Particle[] = []
    
    // Config
    const isMobile = window.innerWidth < 768
    const particleCount = isMobile ? 120 : 250 // Adaptive density
    const connectionDist = 100
    const gridSize = 120 
    
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initParticles()
    }

    const initParticles = () => {
      particles = []
      for (let i = 0; i < particleCount; i++) {
        const baseAlpha = Math.random() * 0.4 + 0.1
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 1.5 + 0.5,
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() - 0.5) * 0.8,
          alpha: baseAlpha,
          baseAlpha: baseAlpha
        })
      }
    }

    const drawParticles = (time: number) => {
      // Calculate delta time for smooth physics regardless of refresh rate
      const dt = lastTimeRef.current ? (time - lastTimeRef.current) / 16.66 : 1
      lastTimeRef.current = time

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      const themeColor = theme === 'dark' ? '255, 255, 255' : '99, 102, 241'
      const rows = Math.ceil(canvas.height / gridSize)
      const cols = Math.ceil(canvas.width / gridSize)
      
      const grid: Particle[][][] = Array.from({ length: rows }, () => 
        Array.from({ length: cols }, () => [])
      )

      particles.forEach(p => {
        // Delta-time physics
        p.x += p.vx * dt
        p.y += p.vy * dt

        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0

        // Interaction
        const mdx = mouseRef.current.x - p.x
        const mdy = mouseRef.current.y - p.y
        const mdistSq = mdx * mdx + mdy * mdy
        const maxMdistSq = 200 * 200

        if (mdistSq < maxMdistSq) {
          const mdist = Math.sqrt(mdistSq)
          const force = (200 - mdist) / 200
          p.x -= mdx * force * 0.04 * dt
          p.y -= mdy * force * 0.04 * dt
          p.alpha = Math.min(1, p.baseAlpha + force * 0.5)
        } else {
          p.alpha = p.baseAlpha
        }

        const r = Math.floor(p.y / gridSize)
        const c = Math.floor(p.x / gridSize)
        if (r >= 0 && r < rows && c >= 0 && c < cols) {
          grid[r][c].push(p)
        }

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${themeColor}, ${p.alpha})`
        ctx.fill()
      })

      // Optimized Connections
      ctx.lineWidth = 0.5
      const neighbors = [[0, 0], [0, 1], [1, -1], [1, 0], [1, 1]]

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const cellParticles = grid[r][c]
          if (cellParticles.length === 0) continue

          cellParticles.forEach((p1, i) => {
            neighbors.forEach(([dr, dc]) => {
              const nr = r + dr
              const nc = c + dc
              if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                const targetCell = grid[nr][nc]
                const startIdx = (dr === 0 && dc === 0) ? i + 1 : 0
                
                for (let j = startIdx; j < targetCell.length; j++) {
                  const p2 = targetCell[j]
                  const dx = p1.x - p2.x
                  const dy = p1.y - p2.y
                  const distSq = dx * dx + dy * dy
                  
                  if (distSq < connectionDist * connectionDist) {
                    const dist = Math.sqrt(distSq)
                    const opacity = (1 - dist / connectionDist) * 0.15
                    ctx.beginPath()
                    ctx.strokeStyle = `rgba(${themeColor}, ${opacity})`
                    ctx.moveTo(p1.x, p1.y)
                    ctx.lineTo(p2.x, p2.y)
                    ctx.stroke()
                  }
                }
              }
            })
          })
        }
      }

      animationFrameId = requestAnimationFrame(drawParticles)
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }

    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', handleMouseMove)
    
    resize()
    animationFrameId = requestAnimationFrame(drawParticles)

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(animationFrameId)
    }
  }, [theme])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[1]"
      style={{ opacity: theme === 'dark' ? 0.8 : 1.0 }}
    />
  )
}
