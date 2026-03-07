import { Rocket, Zap, Shield, Cpu, Layers, Code2 } from 'lucide-react'

export interface ProjectData {
  id: string
  name: string
  description: string
  fullDescription: string
  languages: string[]
  platforms: string[]
  githubUrl: string
  vibrantColor: string
  bullets: string[]
}

export const curatedProjects: ProjectData[] = [
  {
    id: '1',
    name: 'Aura AI',
    description: 'Minimalist emotional intelligence companion.',
    fullDescription: 'Aura is an AI-driven emotional intelligence companion that helps users track their mental well-being through subtle interactions. Built with privacy-first architecture and a focus on high-fidelity animations.',
    languages: ['Flutter', 'Dart', 'OpenAI'],
    platforms: ['iOS', 'Android'],
    githubUrl: 'https://github.com',
    vibrantColor: '#818cf8',
    bullets: [
      'Edge-to-edge minimalist design system',
      'Privacy-first on-device AI processing',
      'Seamless 60fps gesture-based navigation'
    ]
  },
  {
    id: '2',
    name: 'Zenith Pay',
    description: 'Next-gen cross-border payments.',
    fullDescription: 'Zenith Pay redefines the fintech experience with a "stealth" UI approach. It simplifies complex blockchain transactions into a single-tap experience for global users.',
    languages: ['React Native', 'TypeScript', 'Solidity'],
    platforms: ['iOS', 'Android', 'Web'],
    githubUrl: 'https://github.com',
    vibrantColor: '#c084fc',
    bullets: [
      'Biometric-first security architecture',
      'Real-time currency conversion engine',
      'Custom dark-mode optimized components'
    ]
  },
  {
    id: '3',
    name: 'Pulse OS',
    description: 'Dynamic fitness tracking ecosystem.',
    fullDescription: 'Pulse OS is more than an app; it is a comprehensive ecosystem that bridges the gap between wearable hardware and deep health analytics. It uses custom ML models to predict recovery times.',
    languages: ['Flutter', 'C++', 'Firebase'],
    platforms: ['iOS', 'WatchOS', 'Android'],
    githubUrl: 'https://github.com',
    vibrantColor: '#fb7185',
    bullets: [
      'Low-latency sensor data processing',
      'Adaptive UI based on activity levels',
      'Community-driven health challenges'
    ]
  },
  {
    id: '4',
    name: 'Lumina',
    description: 'Smart home architectural lighting control.',
    fullDescription: 'Lumina provides professional-grade lighting control for modern architectural spaces. It focuses on the interplay of light and shadow through a highly visual, tactile interface.',
    languages: ['React Native', 'Node.js', 'MQTT'],
    platforms: ['iOS', 'Android', 'iPadOS'],
    githubUrl: 'https://github.com',
    vibrantColor: '#2dd4bf',
    bullets: [
      'Proximity-based light zone activation',
      'Custom color-space interpolation',
      'Multi-user collaborative scenes'
    ]
  }
]
