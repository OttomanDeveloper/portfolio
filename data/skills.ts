export interface Skill {
  name: string
  category: 'Frontend' | 'Mobile' | 'Backend' | 'Tools'
  icon?: string // Lucide icon name
  proficiency: number // 0 to 100
}

export const skills: Skill[] = [
  { name: 'Flutter', category: 'Mobile', proficiency: 95 },
  { name: 'React Native', category: 'Mobile', proficiency: 90 },
  { name: 'Swift/SwiftUI', category: 'Mobile', proficiency: 80 },
  { name: 'TypeScript', category: 'Frontend', proficiency: 90 },
  { name: 'Next.js', category: 'Frontend', proficiency: 85 },
  { name: 'React', category: 'Frontend', proficiency: 92 },
  { name: 'Node.js', category: 'Backend', proficiency: 85 },
  { name: 'Supabase', category: 'Backend', proficiency: 80 },
  { name: 'Firebase', category: 'Backend', proficiency: 88 },
  { name: 'PostgreSQL', category: 'Backend', proficiency: 75 },
  { name: 'Git', category: 'Tools', proficiency: 95 },
  { name: 'Docker', category: 'Tools', proficiency: 70 },
  { name: 'Figma', category: 'Tools', proficiency: 80 },
  { name: 'CI/CD', category: 'Tools', proficiency: 75 },
]
