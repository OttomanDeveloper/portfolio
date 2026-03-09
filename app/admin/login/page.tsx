'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { motion } from 'framer-motion'
import { Lock, Mail, Loader2 } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/admin/dashboard')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-background">
      {/* Background Decorative Elements */}
      <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-accent opacity-10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-accent-secondary opacity-10 blur-[120px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="p-8 border-white/10 bg-surface/50 backdrop-blur-3xl shadow-2xl space-y-8">
          <div className="text-center space-y-2">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent mb-4">
              <Lock size={24} />
            </div>
            <h1 className="text-2xl font-black text-text-primary tracking-tight">Admin Portal</h1>
            <p className="text-sm text-text-secondary">Secure access for authorized users only.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-text-secondary ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary opacity-50" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-surface border border-border focus:border-accent/40 outline-none transition-all text-sm font-medium"
                  placeholder="admin@pawan.dev"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-text-secondary ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary opacity-50" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-surface border border-border focus:border-accent/40 outline-none transition-all text-sm font-medium"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && (
              <p className="text-xs font-bold text-rose-500 bg-rose-500/10 p-4 rounded-xl border border-rose-500/20 text-center animate-shake">
                {error}
              </p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full py-6 rounded-2xl bg-accent hover:bg-accent-secondary text-sm font-black uppercase tracking-[0.2em] shadow-xl transition-all"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : 'Authenticate'}
            </Button>
          </form>
        </Card>
      </motion.div>
    </div>
  )
}
