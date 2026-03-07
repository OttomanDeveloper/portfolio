import { fetchGitHubProfile, fetchGitHubRepos } from "@/lib/github";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Experience } from "@/components/sections/Experience";
import { Projects } from "@/components/sections/Projects";
import { Contact } from "@/components/sections/Contact";
import { Suspense } from "react";

export default async function Home() {
  const profile = await fetchGitHubProfile();
  const repos = await fetchGitHubRepos();

  return (
    <div className="flex flex-col w-full">
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
        <Hero profile={profile} />
      </Suspense>
      
      <About />
      
      <Experience />
      
      <Suspense fallback={<div className="py-20 text-center">Loading projects...</div>}>
        <Projects repos={repos} />
      </Suspense>
      
      <Contact />
    </div>
  );
}
