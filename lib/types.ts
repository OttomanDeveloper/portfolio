export interface Project {
  id: string
  name: string
  description: string
  full_description: string
  fullDescription?: string
  vibrant_color: string
  vibrantColor?: string
  github_url: string
  githubUrl?: string
  live_url: string
  liveUrl?: string
  languages: string[]
  platforms: string[]
  bullets: string[]
  stats: Array<{ label: string; value: string }>
  created_at?: string
  updated_at?: string
}

export interface Experience {
  id: string | number
  company: string
  position: string
  location: string
  start_date: string
  startDate?: string
  end_date: string
  endDate?: string
  description: string[]
  achievements: string[]
  technologies: string[]
  created_at?: string
  updated_at?: string
}

export interface TechMetric {
  label: string;
  value: string;
}

export interface Profile {
  id: string
  name: string
  fullName?: string | null
  full_name?: string | null
  tagline: string
  avatar_url: string
  avatarUrl?: string | null
  github_avatar_url?: string | null
  resume_url: string
  resumeUrl?: string
  contact_email: string
  contactEmail?: string
  whatsapp_number: string
  whatsappNumber?: string
  youtube_url: string
  youtubeUrl?: string
  github_url?: string
  linkedin_url?: string
  experience_start_date: string
  experienceStartDate?: string
  manual_years_experience: number | null
  tech_stacks: Record<string, string[]>
  techStacks?: Record<string, string[]>
  bio?: string
  core_values?: string[]
  metrics?: TechMetric[]
  philosophy?: string
  apps_delivered?: string
  happy_clients?: string
  site_title?: string
  siteTitle?: string
  social_links: {
    github?: string
    linkedin?: string
    twitter?: string
    instagram?: string
    [key: string]: string | undefined
  }
  contact_description?: string
  contactDescription?: string
  projects_tagline?: string
  projectsTagline?: string
  narrative_tagline?: string
  narrativeTagline?: string
  favicon_url?: string
  faviconUrl?: string
  created_at?: string
  updated_at?: string
}

export interface Review {
  id: string
  customer_name: string
  customerName?: string
  customer_photo: string | null
  review_text: string
  reviewText?: string
  status: 'pending' | 'published' | 'rejected' | 'archived'
  is_verified: boolean
  created_at?: string
  updated_at?: string
}

export interface Message {
  id: string
  name: string
  email: string
  subject: string
  message: string
  is_read?: boolean
  created_at?: string
}
