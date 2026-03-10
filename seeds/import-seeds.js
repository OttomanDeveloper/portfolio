#!/usr/bin/env node
// ============================================================
// Ottoman Portfolio — Seed Data Importer
// Usage: npm run seed
// Requires: .env.local with NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
// ============================================================

const { createClient } = require('@supabase/supabase-js')
const path = require('path')
const fs = require('fs')

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('\n❌  Missing environment variables.')
  console.error('    Make sure .env.local contains:')
  console.error('      NEXT_PUBLIC_SUPABASE_URL')
  console.error('      SUPABASE_SERVICE_ROLE_KEY\n')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

function loadSeed(filename) {
  const filePath = path.join(__dirname, filename)
  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

async function seedProfile() {
  console.log('  → Seeding profile...')
  const data = loadSeed('profile.json')
  // Remove top-level comment key if present
  const { _comment, ...profileData } = data
  const { error } = await supabase
    .from('profile')
    .upsert({ id: '00000000-0000-0000-0000-000000000001', ...profileData })
  if (error) throw new Error(`Profile seed failed: ${error.message}`)
  console.log('  ✅  Profile seeded.')
}

async function seedProjects() {
  console.log('  → Seeding projects...')
  const data = loadSeed('projects.json')
  const { error } = await supabase.from('projects').insert(data)
  if (error) throw new Error(`Projects seed failed: ${error.message}`)
  console.log(`  ✅  ${data.length} projects seeded.`)
}

async function seedExperience() {
  console.log('  → Seeding experience...')
  const data = loadSeed('experience.json')
  const { error } = await supabase.from('experience').insert(data)
  if (error) throw new Error(`Experience seed failed: ${error.message}`)
  console.log(`  ✅  ${data.length} experience entries seeded.`)
}

async function seedReviews() {
  console.log('  → Seeding reviews...')
  const data = loadSeed('reviews.json')
  const { error } = await supabase.from('reviews').insert(data)
  if (error) throw new Error(`Reviews seed failed: ${error.message}`)
  console.log(`  ✅  ${data.length} reviews seeded.`)
}

async function seedMessages() {
  console.log('  → Seeding messages...')
  const data = loadSeed('messages.json')
  const { error } = await supabase.from('messages').insert(data)
  if (error) throw new Error(`Messages seed failed: ${error.message}`)
  console.log(`  ✅  ${data.length} messages seeded.`)
}

async function seedSettings() {
  console.log('  → Seeding settings...')
  const settingsData = [
    {
      key: 'experience_config',
      value: { auto_increment: true, start_year: 2018, manual_override: null }
    },
    {
      key: 'site_content',
      value: {
        contact_description: "I'm currently open to new opportunities and freelance projects. Feel free to reach out!",
        projects_tagline: "A curated selection of my recent works, ranging from mobile applications to complex web systems.",
        narrative_tagline: "A specialized window into the vision, metrics, and technological foundation I bring to every project."
      }
    }
  ]
  const { error } = await supabase.from('settings').upsert(settingsData, { onConflict: 'key' })
  if (error) throw new Error(`Settings seed failed: ${error.message}`)
  console.log('  ✅  Settings seeded.')
}

async function run() {
  console.log('\n🌱  Ottoman Portfolio — Seed Importer')
  console.log('    Connecting to:', supabaseUrl)
  console.log('─'.repeat(50))

  try {
    await seedProfile()
    await seedProjects()
    await seedExperience()
    await seedReviews()
    await seedMessages()
    await seedSettings()

    console.log('─'.repeat(50))
    console.log('🎉  All seed data imported successfully!')
    console.log('    Visit http://localhost:3000 to see your portfolio.\n')
  } catch (err) {
    console.error('\n❌  Seed import failed:', err.message)
    console.error('    Tip: Make sure you ran database-schema.sql first.\n')
    process.exit(1)
  }
}

run()
