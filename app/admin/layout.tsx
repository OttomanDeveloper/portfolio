'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { motion } from 'framer-motion'
import { LayoutDashboard, FolderKanban, User, Briefcase, Settings, LogOut, ExternalLink, MessageSquare, Mail } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  if (pathname === '/admin/login') return children

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  const navItems = [
    { label: 'Overview', icon: <LayoutDashboard size={20} />, href: '/admin/dashboard' },
    { label: 'Projects', icon: <FolderKanban size={20} />, href: '/admin/projects' },
    { label: 'Experience', icon: <Briefcase size={20} />, href: '/admin/experience' },
    { label: 'Reviews', icon: <MessageSquare size={20} />, href: '/admin/reviews' },
    { label: 'Inquiries', icon: <Mail size={20} />, href: '/admin/messages' },
    { label: 'About Me', icon: <User size={20} />, href: '/admin/about' },
    { label: 'Settings', icon: <Settings size={20} />, href: '/admin/settings' },
  ]

  return (
    <div className="flex min-h-screen bg-background text-text-primary">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-surface/30 backdrop-blur-xl hidden md:flex flex-col p-6 fixed inset-y-0 z-50">
        <div className="flex items-center gap-3 mb-12 px-2">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-white font-black text-xs">A</div>
          <span className="font-black tracking-tighter text-xl">Command</span>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                pathname === item.href 
                  ? 'bg-accent text-white shadow-lg' 
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface/50'
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="pt-6 border-t border-border space-y-2">
          <div className="px-4 py-2 flex items-center justify-between bg-surface/50 rounded-xl mb-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-text-secondary">System Theme</span>
            <ThemeToggle />
          </div>
          <Link 
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-text-secondary hover:text-text-primary hover:bg-surface/50 transition-all"
          >
            <ExternalLink size={20} />
            Live Site
          </Link>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-rose-500 hover:bg-rose-500/10 transition-all"
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-6 md:p-12 relative">
         {/* Background Decorative Element */}
         <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-accent/5 blur-[120px] rounded-full -z-10 pointer-events-none" />
         
         <div className="container mx-auto max-w-5xl">
            {children}
         </div>
      </main>
    </div>
  )
}
