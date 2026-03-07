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

export const experiences: Experience[] = [
  {
    id: '1',
    company: 'TechFlow Systems',
    position: 'Senior Mobile Developer',
    startDate: '2022',
    endDate: 'Present',
    location: 'Remote',
    description: [
      'Lead a team of 5 developers in building a cross-platform fintech application.',
      'Optimized app performance reducing load times by 40% using advanced caching strategies.',
      'Implemented automated CI/CD pipelines using GitHub Actions and Fastlane.'
    ],
    technologies: ['Flutter', 'Dart', 'Firebase', 'Google Cloud'],
    achievements: ['Successfully launched the app in 5 new international markets.']
  },
  {
    id: '2',
    company: 'AppInnovate',
    position: 'React Native Developer',
    startDate: '2020',
    endDate: '2022',
    location: 'London, UK',
    description: [
      'Developed and maintained multiple high-traffic e-commerce apps.',
      'Integrated complex third-party APIs for payment processing and analytics.',
      'Successfully migrated legacy codebase to modern React Native architecture.'
    ],
    technologies: ['React Native', 'TypeScript', 'Redux', 'Node.js'],
  },
  {
    id: '3',
    company: 'CreativeApps',
    position: 'Junior App Developer',
    startDate: '2018',
    endDate: '2020',
    location: 'Berlin, Germany',
    description: [
      'Contributed to the development of social networking features.',
      'Collaborated with UI/UX designers to implement responsive designs.',
      'Participated in code reviews and unit testing.'
    ],
    technologies: ['Swift', 'JavaScript', 'Firebase'],
  }
]
