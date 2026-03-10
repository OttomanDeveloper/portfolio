import { Suspense } from 'react';
import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Experience } from '@/components/sections/Experience';
import { Projects } from '@/components/sections/Projects';
import { Contact } from '@/components/sections/Contact';
import { fetchGitHubProfile, fetchGitHubRepos } from '@/lib/github';
import { getProjects, getExperiences, getProfile, getReviews } from '@/lib/api-server';
import { FloatingNav } from '@/components/ui/FloatingNav';
import { ConnectivityError } from '@/components/ui/ConnectivityError';
import { Reviews } from '@/components/sections/Reviews';

export const dynamic = 'force-dynamic';

export default async function Home() {
  // Parallel data fetching for performance
  const [
    githubProfile,
    repos,
    dbProjects,
    dbExperiences,
    dbProfile,
    initialReviews
  ] = await Promise.all([
    fetchGitHubProfile(),
    fetchGitHubRepos(),
    getProjects(),
    getExperiences(),
    getProfile(),
    getReviews(6, 0)
  ]);
  
  // Premium Connection Fallback
  if (!dbProfile) {
    return <ConnectivityError />;
  }
  
  // Use DB profile or fallback to GitHub
  const avatarUrl = dbProfile?.avatarUrl || githubProfile?.avatar_url;
  const bio = dbProfile?.bio || githubProfile?.bio;
  
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": dbProfile.full_name || dbProfile.name,
    "jobTitle": dbProfile.siteTitle || "Software Engineer",
    "url": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    "image": avatarUrl,
    "sameAs": [
      dbProfile.githubUrl,
      dbProfile.linkedinUrl,
      dbProfile.twitterUrl,
      dbProfile.youtubeUrl
    ].filter(Boolean),
    "description": bio
  };

  return (
    <div className="flex flex-col w-full">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <FloatingNav dbProfile={dbProfile} />
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
        <Hero 
            dbProfile={dbProfile} 
        />
      </Suspense>

      <Suspense fallback={<div className="py-20 text-center">Loading projects...</div>}>
        <Projects repos={repos} dbProjects={dbProjects} dbProfile={dbProfile} />
      </Suspense>
            <About 
          dbProfile={dbProfile} 
        />
      
      <Experience experiences={dbExperiences} />
      
      <Reviews initialReviews={initialReviews} />
      
      <Contact dbProfile={dbProfile} />
    </div>
  );
}
