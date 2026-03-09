import { createClient } from '@supabase/supabase-js'
import { curatedProjects } from '../data/projects'
import { experiences } from '../data/experience'
import { config } from 'dotenv'

// Load environment variables from .env.local
config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY // Use service role for migration

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials for migration')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function migrate() {
  console.log('🚀 Starting Migration...')

  // Migrate Projects
  console.log('📦 Migrating Projects...')
  for (const project of curatedProjects) {
    const { error } = await supabase.from('projects').upsert({
      name: project.name,
      description: project.description,
      full_description: project.fullDescription,
      languages: project.languages,
      platforms: project.platforms,
      github_url: project.githubUrl,
      vibrant_color: project.vibrantColor,
      bullets: project.bullets || [],
      stats: project.stats || []
    })
    if (error) console.error(`Error migrating project ${project.name}:`, error)
  }

  // Migrate Experience
  console.log('💼 Migrating Experience...')
  for (const exp of experiences) {
    const { error } = await supabase.from('experience').upsert({
      company: exp.company,
      position: exp.position,
      start_date: exp.startDate,
      end_date: exp.endDate,
      location: exp.location,
      description: exp.description,
      technologies: exp.technologies,
      achievements: exp.achievements || []
    })
    if (error) console.error(`Error migrating experience ${exp.company}:`, error)
  }

  console.log('✅ Migration Complete!')
}

migrate()
