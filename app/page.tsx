import { fetchGitHubProfile, fetchGitHubRepos } from "@/lib/github";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { Hero } from "@/components/sections/Hero";

const About = dynamic(() => import("@/components/sections/About").then((mod) => mod.About));
const Experience = dynamic(() => import("@/components/sections/Experience").then((mod) => mod.Experience));
const Projects = dynamic(() => import("@/components/sections/Projects").then((mod) => mod.Projects));
const Contact = dynamic(() => import("@/components/sections/Contact").then((mod) => mod.Contact));

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
