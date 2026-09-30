import { DEFAULT_ORDER, SAMPLE_RESUME } from "./sample";
import type { ListItem, Resume, SectionKey } from "./types";

const KEY = "resumebuilder:v1";

const SECTIONS = new Set<SectionKey>(DEFAULT_ORDER);

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function toItems(v: unknown): ListItem[] {
  if (!Array.isArray(v)) return [];
  return v.filter(isRecord).map((raw, i) => {
    const item: ListItem = { id: typeof raw.id === "string" && raw.id ? raw.id : `item-${i}-${Date.now()}` };
    for (const [k, val] of Object.entries(raw)) {
      if (k !== "id" && typeof val === "string") item[k] = val;
    }
    return item;
  });
}

/** Validates untrusted JSON (localStorage or an imported file) into a well-formed Resume. */
export function normalizeResume(input: unknown): Resume {
  if (!isRecord(input)) throw new Error("Invalid resume file");
  const base = structuredClone(SAMPLE_RESUME);
  const basics = isRecord(input.basics) ? input.basics : {};
  const settings = isRecord(input.settings) ? input.settings : {};

  const order = Array.isArray(settings.order)
    ? (settings.order.filter((s) => SECTIONS.has(s as SectionKey)) as SectionKey[])
    : [];
  for (const s of DEFAULT_ORDER) if (!order.includes(s)) order.push(s);

  const resume: Resume = {
    basics: { ...base.basics },
    summary: typeof input.summary === "string" ? input.summary : "",
    experience: toItems(input.experience),
    education: toItems(input.education),
    skills: toItems(input.skills),
    projects: toItems(input.projects),
    certifications: toItems(input.certifications),
    languages: toItems(input.languages),
    settings: {
      template: settings.template === "sidebar" ? "sidebar" : "classic",
      accent:
        typeof settings.accent === "string" && /^#[0-9a-f]{6}$/i.test(settings.accent)
          ? settings.accent
          : base.settings.accent,
      density: ["compact", "normal", "relaxed"].includes(settings.density as string)
        ? (settings.density as Resume["settings"]["density"])
        : "normal",
      font: settings.font === "serif" ? "serif" : "sans",
      order: [...new Set(order)],
      hidden: Array.isArray(settings.hidden)
        ? (settings.hidden.filter((s) => SECTIONS.has(s as SectionKey)) as SectionKey[])
        : [],
    },
  };
  for (const k of Object.keys(resume.basics) as (keyof Resume["basics"])[]) {
    resume.basics[k] = typeof basics[k] === "string" ? (basics[k] as string) : "";
  }
  return resume;
}

export function loadResume(): Resume {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) return normalizeResume(JSON.parse(raw));
  } catch {
    /* fall through to sample */
  }
  return structuredClone(SAMPLE_RESUME);
}

export function saveResume(resume: Resume): boolean {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(resume));
    return true;
  } catch {
    return false;
  }
}

export function fileName(resume: Resume, ext: string): string {
  const slug = resume.basics.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return `${slug || "resume"}${ext}`;
}
