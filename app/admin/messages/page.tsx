'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { 
  Mail, 
  User, 
  Clock, 
  Trash2, 
  Loader2, 
  Search,
  RefreshCcw,
  ExternalLink
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { useIsMobile } from '@/hooks/use-mobile'

interface Message {
  id: string
  name: string
  email: string
  subject: string
  message: string
  is_read: boolean
  created_at: string
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all')
  const [mounted, setMounted] = useState(false)
  const isMobile = useIsMobile()

  const fetchMessages = async () => {
    setLoading(true)
    const supabase = createClient()
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      toast.error('Failed to fetch messages')
    } else {
      setMessages(data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    requestAnimationFrame(() => {
      setMounted(true)
      fetchMessages()
    })
  }, [])

  const markAsRead = async (id: string) => {
    const supabase = createClient()
    const { error } = await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('id', id)

    if (error) {
      toast.error('Failed to update message')
    } else {
      setMessages(messages.map(m => m.id === id ? { ...m, is_read: true } : m))
      if (selectedMessage?.id === id) {
        setSelectedMessage({ ...selectedMessage, is_read: true })
      }
    }
  }

  const deleteMessage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return

    const supabase = createClient()
    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('id', id)

    if (error) {
      toast.error('Failed to delete message')
    } else {
      toast.success('Message deleted')
      setMessages(messages.filter(m => m.id !== id))
      if (selectedMessage?.id === id) setSelectedMessage(null)
    }
  }

  const filteredMessages = messages.filter(m => {
    const matchesSearch = 
      m.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      m.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email?.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesFilter = 
      filter === 'all' ? true : 
      filter === 'unread' ? !m.is_read : m.is_read

    return matchesSearch && matchesFilter
  })

  if (!mounted) return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="animate-spin text-accent" size={32} />
    </div>
  )
 
  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-text-primary mb-2">Inquiry Center</h1>
          <p className="text-text-secondary font-medium">Manage and respond to user communications.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={fetchMessages}
            variant="outline"
            className={`rounded-xl border-border bg-surface/50 hover:border-accent/40 font-bold flex items-center gap-2 ${!isMobile && 'backdrop-blur-sm'}`}
          >
            <RefreshCcw size={16} className={loading ? 'animate-spin' : ''} />
            Refresh
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-[600px]">
        {/* Sidebar: Message List */}
        <Card className={`lg:col-span-5 border-border bg-surface/50 h-full flex flex-col overflow-hidden shadow-sm ${!isMobile && 'backdrop-blur-xl'}`}>
          <div className="p-4 border-b border-border space-y-4 bg-surface/30">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary/50" size={16} />
              <input 
                type="text"
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface/50 border border-border focus:border-accent/40 outline-none text-sm font-medium transition-all"
              />
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setFilter('all')}
                className={`flex-1 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${filter === 'all' ? 'bg-accent text-white shadow-lg' : 'bg-surface/50 text-text-secondary border border-border hover:border-accent/20'}`}
              >
                All
              </button>
              <button 
                onClick={() => setFilter('unread')}
                className={`flex-1 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${filter === 'unread' ? 'bg-accent text-white shadow-lg' : 'bg-surface/50 text-text-secondary border border-border hover:border-accent/20'}`}
              >
                Unread
              </button>
              <button 
                onClick={() => setFilter('read')}
                className={`flex-1 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${filter === 'read' ? 'bg-accent text-white shadow-lg' : 'bg-surface/50 text-text-secondary border border-border hover:border-accent/20'}`}
              >
                Read
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {loading ? (
              <div className="flex items-center justify-center p-12">
                <Loader2 className="animate-spin text-accent" size={32} />
              </div>
            ) : filteredMessages.length > 0 ? (
              <div className="divide-y divide-border/50">
                {filteredMessages.map((msg) => (
                  <button
                    key={msg.id}
                    onClick={() => {
                      setSelectedMessage(msg)
                      if (!msg.is_read) markAsRead(msg.id)
                    }}
                    className={`w-full p-6 text-left transition-all hover:bg-accent/5 flex items-start gap-4 relative group ${selectedMessage?.id === msg.id ? 'bg-accent/5 ring-1 ring-inset ring-accent/20' : ''}`}
                  >
                    {!msg.is_read && (
                      <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_10px_rgba(251,113,133,0.5)]" />
                    )}
                    <div className={`p-3 rounded-xl ${msg.is_read ? 'bg-surface-secondary text-text-secondary' : 'bg-accent/10 text-accent'} shrink-0`}>
                      <Mail size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-sm font-bold truncate ${msg.is_read ? 'text-text-secondary' : 'text-text-primary'}`}>
                          {msg.name}
                        </span>
                        <span className="text-[10px] text-text-secondary/40 font-bold shrink-0">
                          {new Date(msg.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className={`text-xs truncate ${msg.is_read ? 'text-text-secondary/60' : 'text-text-secondary font-medium'}`}>
                        {msg.subject || 'No subject'}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center text-text-secondary/40">
                <Mail size={48} className="mx-auto mb-4 opacity-10" />
                <p className="text-sm font-bold uppercase tracking-widest">No inquiries found</p>
              </div>
            )}
          </div>
        </Card>

        {/* Content: Selected Message Detail */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {selectedMessage ? (
              <motion.div
                key={selectedMessage.id}
                initial={isMobile ? false : { opacity: 0, x: 20 }}
                animate={isMobile ? { opacity: 1, x: 0 } : { opacity: 1, x: 0 }}
                exit={isMobile ? { opacity: 0 } : { opacity: 0, x: -20 }}
              >
                <Card className={`border-border bg-surface/50 h-full flex flex-col shadow-sm ${!isMobile && 'backdrop-blur-xl'}`}>
                  <div className="p-8 border-b border-border flex items-start justify-between bg-surface/30">
                    <div className="flex gap-4">
                      <div className="p-4 rounded-2xl bg-accent/10 text-accent h-fit">
                        <Mail size={32} />
                      </div>
                      <div>
                        <h2 className="text-2xl font-black text-text-primary mb-1">{selectedMessage.subject || 'Inquiry from ' + selectedMessage.name}</h2>
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-text-secondary font-medium">
                          <span className="flex items-center gap-2">
                            <User size={14} className="text-accent" />
                            {selectedMessage.name}
                          </span>
                          <span className="flex items-center gap-2">
                            <Mail size={14} className="text-accent" />
                            {selectedMessage.email}
                          </span>
                          <span className="flex items-center gap-2">
                            <Clock size={14} className="text-accent" />
                            {new Date(selectedMessage.created_at).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => deleteMessage(selectedMessage.id)}
                        variant="outline"
                        className="p-3 text-rose-500 border-rose-500/20 hover:bg-rose-500/10 hover:border-rose-500/40 rounded-xl"
                      >
                        <Trash2 size={20} />
                      </Button>
                    </div>
                  </div>

                  <div className="p-8 flex-1">
                    <div className="bg-surface/30 rounded-2xl p-8 border border-border min-h-[300px] text-text-primary leading-relaxed whitespace-pre-wrap font-medium">
                      {selectedMessage.message}
                    </div>
                  </div>

                  <div className="p-8 border-t border-border bg-surface/30 flex justify-end gap-4">
                     <Button 
                        variant="secondary"
                        onClick={() => window.location.href = `mailto:${selectedMessage.email}`}
                        className="px-8 py-4 rounded-xl bg-accent hover:bg-accent/90 text-white font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-xl shadow-accent/20"
                     >
                       <ExternalLink size={18} />
                       Reply via Email
                     </Button>
                  </div>
                </Card>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-12 text-center text-text-secondary/30 bg-surface/20 rounded-3xl border-2 border-dashed border-border">
                <div className="p-8 rounded-full bg-surface/50 mb-6">
                  <Mail size={64} strokeWidth={1} />
                </div>
                <h3 className="text-xl font-black text-text-secondary/60 mb-2">Select a message</h3>
                <p className="text-sm font-medium max-w-xs">Pick an inquiry from the inbox to view details and respond.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
