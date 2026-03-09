import { createClient } from './supabase/server'
import { curatedProjects } from '../data/projects'
import { experiences } from '../data/experience'

/**
 * SERVER-ONLY API FUNCTIONS
 * These use the SSR server client and can only be called from Server Components.
 */

export async function getProjects() {
  const supabase = await createClient()
  if (!supabase) return curatedProjects

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: true })
  
  if (error) {
    console.error('SERVER_API: Error fetching projects:', error.message)
    return curatedProjects
  }
  
  return data.map((p: any) => ({
    ...p,
    fullDescription: p.full_description,
    vibrantColor: p.vibrant_color,
    githubUrl: p.github_url,
    liveUrl: p.live_url,
    languages: p.languages || [],
    platforms: p.platforms || []
  }))
}

export async function getExperiences() {
  const supabase = await createClient()
  if (!supabase) return experiences

  const { data, error } = await supabase
    .from('experience')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('SERVER_API: Error fetching experience:', error.message)
    return experiences
  }
  
  return data.map((e: any) => ({
    ...e,
    startDate: e.start_date,
    endDate: e.end_date,
    description: e.description || [],
    technologies: e.technologies || [],
    achievements: e.achievements || []
  }))
}

export async function getProfile() {
  const supabase = await createClient()
  if (!supabase) return null

  // Use maybeSingle() and limit(1) to avoid PGRST116 errors if multiple rows exist
  // or if no rows exist (returns null instead of error)
  const { data, error } = await supabase
    .from('profile')
    .select('*')
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  
  if (error) {
    console.error('Error fetching profile from Supabase (Server):', error.message || error)
    return null
  }

  // Fetch dynamic taglines and contact description safely stored in settings
  const { data: settingsData } = await supabase.from('settings').select('value').eq('key', 'site_content').maybeSingle()
  const content = settingsData?.value || {}
  
  return {
    ...data,
    appsDelivered: data.apps_delivered,
    happyClients: data.happy_clients,
    techStacks: data.tech_stacks,
    socialLinks: data.social_links,
    avatarUrl: data.avatar_url,
    resumeUrl: data.resume_url,
    contactEmail: data.contact_email,
    whatsappNumber: data.whatsapp_number,
    youtubeUrl: data.youtube_url,
    experienceStartDate: data.experience_start_date,
    manualYearsExperience: data.manual_years_experience,
    // Taglines and dynamic content merged from settings
    contactDescription: content.contact_description || data.contact_description,
    tagline: data.tagline, // Exists in DB
    projectsTagline: content.projects_tagline,
    narrativeTagline: content.narrative_tagline,
  }
}

export async function getReviews(limit = 6, offset = 0) {
  const supabase = await createClient()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)
  
  if (error) {
    if (error.code === 'PGRST103') {
      return []
    }
    console.error('SERVER_API: Error fetching reviews:', error.message)
    return []
  }
  
  return data
}
