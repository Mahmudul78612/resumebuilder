import type { Resume } from "./types";

export const DEFAULT_ORDER: Resume["settings"]["order"] = [
  "summary",
  "experience",
  "projects",
  "skills",
  "education",
  "certifications",
  "languages",
];

export const SAMPLE_RESUME: Resume = {
  basics: {
    name: "Alex Morgan",
    title: "Senior Software Engineer",
    email: "alex.morgan@example.com",
    phone: "+1 (415) 555-0142",
    location: "San Francisco, CA",
    website: "alexmorgan.dev",
    linkedin: "linkedin.com/in/alexmorgan",
  },
  summary:
    "Software engineer with 8+ years building reliable, high-traffic web platforms. Experienced in leading cross-functional teams, designing distributed systems, and shipping product features used by millions. Focused on clean architecture, measurable outcomes, and mentoring engineers.",
  experience: [
    {
      id: "exp1",
      role: "Senior Software Engineer",
      company: "Northwind Cloud",
      start: "Mar 2021",
      end: "Present",
      location: "San Francisco, CA",
      bullets:
        "Led a team of 6 engineers to rebuild the billing platform, reducing invoice errors by 92%\nDesigned an event-driven architecture on Kafka processing 40M events/day with 99.99% availability\nCut page load time by 48% through server rendering, code splitting, and caching strategy\nIntroduced RFC process and on-call playbooks adopted across 5 product teams",
    },
    {
      id: "exp2",
      role: "Software Engineer",
      company: "Contoso Analytics",
      start: "Jun 2018",
      end: "Feb 2021",
      location: "Seattle, WA",
      bullets:
        "Built self-serve reporting dashboards used by 3,000+ enterprise customers\nMigrated legacy monolith services to containerised microservices on Kubernetes\nImproved CI pipeline speed by 60% via test parallelisation and build caching",
    },
    {
      id: "exp3",
      role: "Junior Developer",
      company: "Fabrikam Labs",
      start: "Jul 2016",
      end: "May 2018",
      location: "Austin, TX",
      bullets:
        "Delivered customer-facing features in React and Node.js across 12 releases\nWrote integration tests that raised coverage from 45% to 80%",
    },
  ],
  education: [
    {
      id: "edu1",
      degree: "B.Sc. Computer Science",
      school: "University of Texas at Austin",
      start: "2012",
      end: "2016",
      location: "Austin, TX",
      details: "Graduated with honours",
    },
  ],
  skills: [
    { id: "sk1", name: "Languages", items: "TypeScript, Go, Python, SQL" },
    { id: "sk2", name: "Frontend", items: "React, Next.js, Web Performance, Accessibility" },
    { id: "sk3", name: "Backend", items: "Node.js, PostgreSQL, Kafka, Redis, gRPC" },
    { id: "sk4", name: "Cloud & Tools", items: "AWS, Kubernetes, Terraform, GitHub Actions" },
  ],
  projects: [
    {
      id: "pr1",
      name: "OpenLedger",
      link: "github.com/alexmorgan/openledger",
      description: "Open-source double-entry accounting library for Go with 2.1k GitHub stars.",
    },
  ],
  certifications: [
    { id: "ce1", name: "AWS Certified Solutions Architect – Associate", issuer: "Amazon Web Services", date: "2023" },
  ],
  languages: [
    { id: "la1", name: "English", level: "Native" },
    { id: "la2", name: "Spanish", level: "Professional" },
  ],
  settings: {
    template: "classic",
    accent: "#1f3a5f",
    density: "normal",
    font: "sans",
    order: DEFAULT_ORDER,
    hidden: [],
  },
};

export const BLANK_RESUME: Resume = {
  basics: { name: "", title: "", email: "", phone: "", location: "", website: "", linkedin: "" },
  summary: "",
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  languages: [],
  settings: { ...SAMPLE_RESUME.settings },
};
