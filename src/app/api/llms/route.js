import { NextResponse } from "next/server";
import { PROFILE } from "@/lib/profile";

export async function GET() {
  return NextResponse.json({
    name: PROFILE.name,
    title: PROFILE.title,
    ...(PROFILE.email ? { email: PROFILE.email } : {}),
    ...(PROFILE.github ? { github: PROFILE.github } : {}),
    ...(PROFILE.linkedin ? { linkedin: PROFILE.linkedin } : {}),
    ...(PROFILE.resume ? { resume: PROFILE.resume } : {}),
    summary: "B.Tech Robotics student building toward AI Product Engineering, with interests in generative AI, retrieval, backend systems, and robotics.",
    hands_on_in_this_portfolio: ["Next.js", "React", "JavaScript", "Tailwind CSS", "GSAP", "Three.js", "React Three Fiber"],
    areas_of_interest: ["Generative AI", "Retrieval systems", "Agentic workflows", "Backend engineering", "Robotics"],
    projects: [{ name: "Niramaya AI", type: "Concept", description: "An early concept for making personal health records easier to organize and search." }],
  }, { headers: { "Cache-Control": "public, max-age=3600" } });
}
