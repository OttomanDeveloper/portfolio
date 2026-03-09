import { createClient } from './supabase/client'

export async function getSystemHealth() {
  const supabase = createClient()
  if (!supabase) return { status: 'offline', latency: 0 }

  const start = Date.now()
  const { error } = await supabase.from('settings').select('key').limit(1)
  const latency = Date.now() - start

  if (error) return { status: 'error', latency }
  return { status: 'healthy', latency }
}
