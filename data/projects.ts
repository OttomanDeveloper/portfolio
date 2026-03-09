// Type definitions only - all data comes from Supabase database.
// Static data arrays have been removed to enforce full dynamic content.

export interface ProjectData {
  id: string
  name: string
  description: string
  fullDescription: string
  languages: string[]
  platforms: string[]
  githubUrl?: string
  liveUrl?: string
  vibrantColor: string
  bullets: string[]
  stats?: { label: string; value: string }[]
}

// Empty fallback for when database is unavailable
export const curatedProjects: ProjectData[] = []
