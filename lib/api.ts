import { createClient } from './supabase/client'
import { curatedProjects } from '../data/projects'
import { experiences } from '../data/experience'

/**
 * CLIENT-SIDE API FUNCTIONS
 * These use the standard Supabase client and are safe for Client Components.
 */

export async function getProjects() {
  const supabase = createClient()
  if (!supabase) return curatedProjects

  const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: true })
  
  if (error) {
    console.error('Error fetching projects from Supabase (Client):', error)
    return curatedProjects
  }
  
  return data.map((p: any) => ({
    ...p,
    fullDescription: p.full_description,
    vibrantColor: p.vibrant_color,
    githubUrl: p.github_url,
    liveUrl: p.live_url
  }))
}

export async function saveProject(project: any) {
  const supabase = createClient()
  if (!supabase) return { error: 'Database connection failed' }

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
    return { data, error }
  } else {
    const { data, error } = await supabase.from('projects').insert(projectData).select()
    return { data, error }
  }
}

export async function deleteProject(id: string) {
  const supabase = createClient()
  if (!supabase) return { error: 'Database connection failed' }
  const { error } = await supabase.from('projects').delete().eq('id', id)
  return { error }
}

export async function getExperiences() {
  const supabase = createClient()
  if (!supabase) return experiences

  const { data, error } = await supabase.from('experience').select('*').order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching experience from Supabase (Client):', error)
    return experiences
  }
  
  return data.map((e: any) => ({
    ...e,
    startDate: e.start_date,
    endDate: e.end_date,
    achievements: e.achievements || []
  }))
}

export async function saveExperience(experience: any) {
  const supabase = createClient()
  if (!supabase) return { error: 'Database connection failed' }

  const expData = {
    company: experience.company,
    position: experience.position,
    location: experience.location,
    start_date: experience.startDate,
    end_date: experience.endDate,
    description: experience.description,
    achievements: experience.achievements || [],
    technologies: experience.technologies || []
  }

  if (experience.id && !experience.id.toString().startsWith('new-')) {
    const { data, error } = await supabase.from('experience').update(expData).eq('id', experience.id).select()
    return { data, error }
  } else {
    const { data, error } = await supabase.from('experience').insert(expData).select()
    return { data, error }
  }
}

export async function deleteExperience(id: string | number) {
  const supabase = createClient()
  if (!supabase) return { error: 'Database connection failed' }
  const { error } = await supabase.from('experience').delete().eq('id', id)
  return { error }
}

export async function getProfile() {
  const supabase = createClient()
  if (!supabase) return null

  const { data, error } = await supabase.from('profile').select('*').single()
  
  if (error) {
    console.error('Error fetching profile from Supabase (Client):', error)
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

export async function submitMessage(messageData: { fullName: string; email: string; subject: string; message: string }) {
  const supabase = createClient()
  if (!supabase) return { error: 'Database connection failed' }

  const { error } = await supabase.from('messages').insert({
    full_name: messageData.fullName,
    email: messageData.email,
    subject: messageData.subject,
    message: messageData.message
  })

  return { error }
}

export async function getSystemHealth() {
  const supabase = createClient()
  if (!supabase) return { status: 'offline', latency: 0 }

  const start = Date.now()
  const { error } = await supabase.from('settings').select('key').limit(1)
  const latency = Date.now() - start

  if (error) return { status: 'error', latency }
  return { status: 'healthy', latency }
}
export async function getReviews(limit = 6, offset = 0) {
  const supabase = createClient()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)
  
  if (error) {
    // Ignore Range Not Satisfiable error, which just means no more rows
    if (error.code === 'PGRST103') {
      return []
    }
    console.error('Error fetching reviews (Client):', error.message || error)
    return []
  }
  
  return data
}

export async function submitReview(review: any, photoFile?: File) {
  const supabase = createClient()
  if (!supabase) return { error: 'Database connection failed' }

  let photoUrl = null

  if (photoFile) {
    const fileExt = photoFile.name.split('.').pop()
    const fileName = `${Math.random()}.${fileExt}`
    const filePath = `${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('customer-photos')
      .upload(filePath, photoFile)

    if (uploadError) {
      console.error('Photo upload error:', uploadError)
    } else {
      const { data: { publicUrl } } = supabase.storage
        .from('customer-photos')
        .getPublicUrl(filePath)
      photoUrl = publicUrl
    }
  }

  const { data, error } = await supabase.from('reviews').insert({
    customer_name: review.customerName,
    customer_photo: photoUrl,
    review_text: review.reviewText,
    status: 'pending' // Always pending for moderation
  }).select()

  return { data, error }
}

export async function getAllReviewsAdmin() {
  const supabase = createClient()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching admin reviews:', error.message || error)
    return []
  }
  
  return data
}

export async function updateReview(id: string, updates: any) {
  const supabase = createClient()
  if (!supabase) return { error: 'Database connection failed' }

  const { data, error } = await supabase
    .from('reviews')
    .update(updates)
    .eq('id', id)
    .select()

  return { data, error }
}

export async function deleteReview(id: string, photoUrl?: string) {
  const supabase = createClient()
  if (!supabase) return { error: 'Database connection failed' }

  // 1. Delete from storage if photo exists
  if (photoUrl) {
    const fileName = photoUrl.split('/').pop()
    if (fileName) {
      await supabase.storage.from('customer-photos').remove([fileName])
    }
  }

  // 2. Delete from database
  const { error } = await supabase.from('reviews').delete().eq('id', id)
  
  return { error }
}

export async function adminCreateReview(review: any, photoFile?: File) {
  const supabase = createClient()
  if (!supabase) return { error: 'Database connection failed' }

  let photoUrl = review.customer_photo || null

  if (photoFile) {
    const fileExt = photoFile.name.split('.').pop()
    const fileName = `${Math.random()}.${fileExt}`
    const filePath = `${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('customer-photos')
      .upload(filePath, photoFile)

    if (uploadError) {
      console.error('Photo upload error:', uploadError)
    } else {
      const { data: { publicUrl } } = supabase.storage
        .from('customer-photos')
        .getPublicUrl(filePath)
      photoUrl = publicUrl
    }
  }

  const { data, error } = await supabase.from('reviews').insert({
    customer_name: review.customer_name,
    customer_photo: photoUrl,
    review_text: review.review_text,
    status: review.status || 'published',
    is_verified: review.is_verified || false
  }).select()

  return { data, error }
}
