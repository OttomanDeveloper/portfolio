#!/usr/bin/env node
// ============================================================
// Ottoman Portfolio — Seed Data Reset
// Usage: npm run seed:reset
// WARNING: This deletes all data from all tables.
// ============================================================

import { createClient } from '@supabase/supabase-js'
import path from 'path'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.join(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('\n❌  Missing environment variables in .env.local\n')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function reset() {
  console.log('\n♻️   Ottoman Portfolio — Seed Data Reset')
  console.log('    ⚠️  This will DELETE all data from all tables.')
  console.log('─'.repeat(50))

  const tables = ['messages', 'reviews', 'experience', 'projects', 'settings', 'profile']

  for (const table of tables) {
    console.log(`  → Clearing ${table}...`)
    const { error } = await supabase.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000')
    if (table === 'settings') {
      // Settings uses text PK
      await supabase.from('settings').delete().neq('key', '__never__')
    }
    if (error && table !== 'settings') {
      console.error(`  ❌ Failed to clear ${table}: ${error.message}`)
    } else {
      console.log(`  ✅  ${table} cleared.`)
    }
  }

  console.log('─'.repeat(50))
  console.log('✅  Reset complete. Run `npm run seed` to reimport demo data.\n')
}

reset()
