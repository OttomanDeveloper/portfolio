'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { motion } from 'framer-motion'
import { FolderKanban, Briefcase, Zap, MessageSquare, Loader2, TrendingUp, Star, Clock } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export const dynamic = 'force-dynamic'

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<any[]>([])
  const [recentProjects, setRecentProjects] = useState<any[]>([])
  const [recentMessages, setRecentMessages] = useState<any[]>([])
  const [recentReviews, setRecentReviews] = useState<any[]>([])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    const supabase = createClient()
    
    // Fetch project count and recent projects
    const { data: projects, count: projectCount } = await supabase
      .from('projects')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })

    // Fetch profile for years calculation
    const { data: profile } = await supabase
      .from('profile')
      .select('experience_start_date, manual_years_experience')
      .limit(1)
      .maybeSingle()

    // Fetch message stats
    const { data: messages, count: totalMessages } = await supabase
      .from('messages')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })

    const unreadCount = messages?.filter((m: any) => !m.is_read).length || 0

    // Fetch review stats
    const { data: reviews, count: totalReviews } = await supabase
      .from('reviews')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })

    const pendingReviews = reviews?.filter((r: any) => r.status === 'pending').length || 0

    // Calculate years of experience
    let yearsOfExp = '0'
    if (profile) {
      if (profile.manual_years_experience) {
        yearsOfExp = profile.manual_years_experience
      } else if (profile.experience_start_date) {
        const start = new Date(profile.experience_start_date)
        const now = new Date()
        const diff = now.getFullYear() - start.getFullYear()
        yearsOfExp = diff.toString()
      }
    }

    setStats([
      { label: 'Total Projects', value: projectCount || 0, icon: <FolderKanban size={24} />, color: '#818cf8' },
      { label: 'Pending Reviews', value: pendingReviews, icon: <Star size={24} />, color: '#fbbf24' },
      { label: 'Unread Inquiries', value: unreadCount, icon: <MessageSquare size={24} />, color: '#fb7185' },
      { label: 'Total Inquiries', value: totalMessages || 0, icon: <Zap size={24} />, color: '#2dd4bf' },
    ])

    setRecentProjects((projects || []).slice(0, 3))
    setRecentMessages((messages || []).slice(0, 3))
    setRecentReviews((reviews || []).filter((r: any) => r.status === 'pending').slice(0, 3))
    setLoading(false)
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader2 className="animate-spin text-accent" size={32} />
    </div>
  )

  return (
    <div className="space-y-12">
      <header>
        <h1 className="text-4xl font-black tracking-tight text-text-primary mb-2">Portfolio Overlook</h1>
        <p className="text-text-secondary font-medium">Streamlined professional management and dynamic ecosystem monitoring.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="p-6 border-border bg-surface/50 backdrop-blur-xl relative overflow-hidden group hover:border-accent/30 transition-all shadow-sm">
              <div className="absolute -top-12 -right-12 w-24 h-24 blur-3xl opacity-10 group-hover:opacity-20 transition-opacity" style={{ backgroundColor: stat.color }} />
              
              <div className="flex flex-col gap-4 relative z-10">
                <div 
                  className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{ backgroundColor: `${stat.color}15`, color: stat.color }}
                >
                  {stat.icon}
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-text-secondary/60 leading-none mb-2">{stat.label}</p>
                  <h3 className="text-3xl font-black text-text-primary">{stat.value}</h3>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Activity Feed */}
        <Card className="lg:col-span-2 p-8 border-border bg-surface/50 backdrop-blur-xl space-y-8 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-text-primary">Recent Ecosystem Updates</h2>
            <TrendingUp size={20} className="text-accent" />
          </div>
          
          <div className="space-y-4">
            {recentProjects.length > 0 ? recentProjects.map((project) => (
              <div key={project.id} className="flex items-center gap-4 p-4 rounded-2xl bg-surface/30 border border-border hover:border-accent/20 transition-all group">
                <div 
                   className="w-12 h-12 rounded-xl flex items-center justify-center text-accent"
                   style={{ background: `${project.vibrantColor}10`, color: project.vibrantColor }}
                >
                  <FolderKanban size={20} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-text-primary text-sm">{project.name}</h4>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-text-secondary opacity-50">{(project.languages as string[])?.slice(0, 3).join(' • ') || 'Core Tech'}</p>
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-accent bg-accent/10 px-3 py-1 rounded-full border border-accent/20">Synced</span>
              </div>
            )) : (
              <div className="py-12 text-center text-text-secondary">
                <p className="font-bold">No projects found.</p>
                <p className="text-xs">Start by adding one in the Projects section.</p>
              </div>
            )}
          </div>
        </Card>

        {/* Review Queue */}
        <Card className="p-8 border-border bg-surface/50 backdrop-blur-xl space-y-8 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-text-primary">Review Queue</h2>
            <Star size={20} className="text-amber-500" />
          </div>
          <div className="space-y-4">
            {recentReviews.length > 0 ? recentReviews.map((review) => (
              <div key={review.id} className="p-4 rounded-xl bg-surface/30 border border-border flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
                  <Clock size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-text-primary text-xs truncate uppercase tracking-tight">{review.customer_name}</h4>
                  <p className="text-[10px] text-text-secondary truncate mt-0.5 tracking-tighter italic">"{review.review_text}"</p>
                </div>
              </div>
            )) : (
              <div className="py-6 text-center text-text-secondary">
                <p className="text-xs font-bold uppercase tracking-widest opacity-40">Queue Clear</p>
              </div>
            )}
            <Button 
                onClick={() => window.location.href = '/admin/reviews'}
                variant="outline" 
                className="w-full py-3 rounded-xl border-border text-[10px] font-black uppercase tracking-widest"
            >
              Moderation Desk
            </Button>
          </div>
        </Card>
      </div>

      {/* Inquiries Snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 p-8 border-border bg-surface/50 backdrop-blur-xl shadow-sm">
           <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black text-text-primary">Recent Inquiries</h2>
            <MessageSquare size={20} className="text-rose-500" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentMessages.length > 0 ? recentMessages.map((msg) => (
              <div key={msg.id} className="p-4 rounded-xl bg-surface/30 border border-border transition-all hover:border-accent/30 group">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-text-primary truncate max-w-[120px]">{msg.name}</span>
                  {!msg.is_read && (
                    <span className="w-2 h-2 rounded-full bg-accent animate-pulse shadow-[0_0_10px_rgba(251,113,133,1)]" />
                  )}
                </div>
                <p className="text-xs text-text-secondary/80 line-clamp-1 mb-4 font-medium">{msg.subject || 'No Subject'}</p>
                <div className="flex items-center justify-between pt-2 border-t border-border/50">
                   <span className="text-[9px] text-text-secondary/40 font-bold">{new Date(msg.created_at).toLocaleDateString()}</span>
                   <button onClick={() => window.location.href = '/admin/messages'} className="text-[9px] font-black uppercase tracking-widest text-accent hover:underline">Open Portal</button>
                </div>
              </div>
            )) : (
              <div className="col-span-2 py-8 text-center text-text-secondary/40">
                <p className="text-xs font-bold uppercase tracking-widest">Inbox Empty</p>
              </div>
            )}
          </div>
          {recentMessages.length > 0 && (
             <Button onClick={() => window.location.href = '/admin/messages'} variant="outline" className="w-full mt-6 text-[10px] font-black uppercase tracking-widest py-4 border-border hover:border-accent/40 rounded-xl">
               Enter Inquiry Center
             </Button>
          )}
        </Card>
      </div>
    </div>
  )
}
