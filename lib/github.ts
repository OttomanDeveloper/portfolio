export interface GitHubProfile {
  name: string
  bio: string
  avatar_url: string
  html_url: string
  public_repos: number
  followers: number
  location: string
}

export interface GitHubRepo {
  id: number
  name: string
  description: string
  html_url: string
  homepage: string | null
  topics: string[]
  stargazers_count: number
  language: string
  updated_at: string
}

export async function fetchGitHubProfile(): Promise<GitHubProfile> {
  const res = await fetch('https://api.github.com/users/OttomanDeveloper', {
    next: { revalidate: 3600 } // Cache for 1 hour
  })
  if (!res.ok) throw new Error('Failed to fetch GitHub profile')
  return res.json()
}

export async function fetchGitHubRepos(): Promise<GitHubRepo[]> {
  const res = await fetch('https://api.github.com/users/OttomanDeveloper/repos?sort=updated&per_page=50', {
    next: { revalidate: 3600 }
  })
  if (!res.ok) throw new Error('Failed to fetch GitHub repos')
  const repos = (await res.json()) as GitHubRepo[]
  
  // Filter: Not a fork, has stars >= 0 (as per requirement), and optionally filter by topic "portfolio" if exists
  // For now, let's take the top 6 most starred
  return repos
    .filter(repo => !repo.name.startsWith('.')) // Filter out config repos
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 6)
}
