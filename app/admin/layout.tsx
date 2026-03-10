'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { motion, AnimatePresence } from 'framer-motion'
import { LayoutDashboard, FolderKanban, User, Briefcase, Settings, LogOut, ExternalLink, MessageSquare, Mail, Menu, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { useState } from 'react'
import { useIsMobile } from '@/hooks/use-mobile'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const isMobile = useIsMobile()

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
      {/* Mobile Header */}
      <header className={`fixed top-0 left-0 right-0 h-16 border-b border-border bg-surface/80 z-[60] flex items-center justify-between px-6 md:hidden ${!isMobile && 'backdrop-blur-xl'}`}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-white font-black text-xs">A</div>
          <span className="font-black tracking-tighter text-lg">Command</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-xl bg-surface-secondary border border-border text-text-primary"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="fixed inset-0 z-[55] bg-background md:hidden pt-24 px-6 overflow-y-auto"
          >
            <nav className="space-y-2 mb-8">
              {navItems.map((item) => (
                <Link 
                  key={item.href} 
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-4 rounded-xl text-sm font-bold transition-all ${
                    pathname === item.href 
                      ? 'bg-accent text-white shadow-lg' 
                      : 'text-text-secondary hover:text-text-primary hover:bg-surface/50 border border-transparent'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </nav>
            
            <div className="pt-6 border-t border-border space-y-4">
              <div className="flex items-center justify-between p-4 bg-surface/50 rounded-xl">
                 <span className="text-[10px] font-black uppercase tracking-widest text-text-secondary">Theme</span>
                 <ThemeToggle />
              </div>
              <Link 
                href="/"
                className="flex items-center gap-3 px-4 py-4 rounded-xl text-sm font-bold text-text-secondary hover:text-text-primary"
              >
                <ExternalLink size={20} />
                Live Site
              </Link>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-4 rounded-xl text-sm font-bold text-rose-500"
              >
                <LogOut size={20} />
                Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar (Desktop) */}
      <aside className={`w-64 border-r border-border bg-surface/30 hidden md:flex flex-col p-6 fixed inset-y-0 z-50 ${!isMobile && 'backdrop-blur-xl'}`}>
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
      <main className="flex-1 lg:ml-64 p-6 pt-24 md:p-12 relative">
         {/* Background Decorative Element */}
         {!isMobile && <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-accent/5 blur-[120px] rounded-full -z-10 pointer-events-none" />}
         
         <div className="container mx-auto max-w-5xl">
            {children}
         </div>
      </main>
    </div>
  )
}
