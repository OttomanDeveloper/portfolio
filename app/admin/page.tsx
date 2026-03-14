'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Loader2 } from 'lucide-react'

/**
 * /admin ROOT PAGE
 * Handles intelligent redirection:
 * - If authenticated: Dashboard
 * - If not: Login
 */
export default function AdminRoot() {
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session) {
        router.replace('/admin/dashboard')
      } else {
        router.replace('/admin/login')
      }
    }

    checkAuth()
  }, [router, supabase])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="animate-spin text-accent" size={32} />
        <p className="text-xs font-black uppercase tracking-[0.2em] text-text-secondary animate-pulse">
          Authenticating Session
        </p>
      </div>
    </div>
  )
}
