'use server'

import { createClient } from '@supabase/supabase-js'
import { Project, Experience } from '@/lib/types'

// Helper to get service role client directly on the server
function getAdminSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function adminSaveProject(project: Partial<Project> & { fullDescription?: string; vibrantColor?: string; githubUrl?: string; liveUrl?: string }) {
  const supabase = getAdminSupabase()
  
  const projectData = {
    name: project.name,
    description: project.description,
    full_description: project.fullDescription,
    vibrant_color: project.vibrantColor,
    github_url: project.githubUrl,
    live_url: project.liveUrl,
    languages: project.languages || [],
    platforms: project.platforms || [],
    bullets: project.bullets || [],
    stats: project.stats || []
  }

  if (project.id && !project.id.toString().startsWith('new-')) {
    const { data, error } = await supabase.from('projects').update(projectData).eq('id', project.id).select()
    return { data, error: error ? error.message : null }
  } else {
    const { data, error } = await supabase.from('projects').insert(projectData).select()
    return { data, error: error ? error.message : null }
  }
}

export async function adminDeleteProject(id: string) {
  const supabase = getAdminSupabase()
  const { error } = await supabase.from('projects').delete().eq('id', id)
  return { error: error ? error.message : null }
}

export async function adminSaveExperience(experience: Partial<Experience> & { startDate?: string; endDate?: string }) {
  const supabase = getAdminSupabase()

  const expData = {
    company: experience.company,
    position: experience.position,
    location: experience.location,
    start_date: experience.startDate,
    end_date: experience.endDate,
    description: experience.description || [],
    achievements: experience.achievements || [],
    technologies: experience.technologies || []
  }

  if (experience.id && !experience.id.toString().startsWith('new-')) {
    const { data, error } = await supabase.from('experience').update(expData).eq('id', experience.id).select()
    return { data, error: error ? error.message : null }
  } else {
    const { data, error } = await supabase.from('experience').insert(expData).select()
    return { data, error: error ? error.message : null }
  }
}

export async function adminDeleteExperience(id: string) {
  const supabase = getAdminSupabase()
  const { error } = await supabase.from('experience').delete().eq('id', id)
  return { error: error ? error.message : null }
}
