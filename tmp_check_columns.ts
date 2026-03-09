import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

async function check() {
  const { data: p } = await supabase.from('projects').select('*').limit(1)
  console.log('Projects keys:', p ? Object.keys(p[0] || {}) : 'no data')
  
  const { data: e } = await supabase.from('experience').select('*').limit(1)
  console.log('Experience keys:', e ? Object.keys(e[0] || {}) : 'no data')
}

check()
