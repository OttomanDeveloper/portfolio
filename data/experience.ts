// Type definitions only - all data comes from Supabase database.
// Static data arrays have been removed to enforce full dynamic content.

export interface Experience {
  id: string
  company: string
  position: string
  startDate: string
  endDate: string | 'Present'
  location: string
  description: string[]
  technologies: string[]
  achievements?: string[]
}

// Empty fallback for when database is unavailable
export const experiences: Experience[] = []
