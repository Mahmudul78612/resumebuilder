import type { IconName } from "@/components/ui/Icon";
import type { ListItem, ListSectionKey, SectionKey } from "./types";

export interface FieldDef {
  key: string;
  label: string;
  multiline?: boolean;
  half?: boolean;
  placeholder?: string;
  helper?: string;
}

export interface ListSectionDef {
  itemLabel: string;
  fields: FieldDef[];
  title: (item: ListItem) => string;
  subtitle: (item: ListItem) => string;
}

export const SECTION_META: Record<SectionKey, { label: string; icon: IconName }> = {
  summary: { label: "Summary", icon: "subject" },
  experience: { label: "Experience", icon: "work" },
  education: { label: "Education", icon: "school" },
  skills: { label: "Skills", icon: "build" },
  projects: { label: "Projects", icon: "code" },
  certifications: { label: "Certifications", icon: "verified" },
  languages: { label: "Languages", icon: "translate" },
};

const join = (...parts: (string | undefined)[]) => parts.filter(Boolean).join(" · ");

export const LIST_SECTIONS: Record<ListSectionKey, ListSectionDef> = {
  experience: {
    itemLabel: "position",
    fields: [
      { key: "role", label: "Job title", half: true },
      { key: "company", label: "Company", half: true },
      { key: "start", label: "Start date", half: true, placeholder: "Jan 2022" },
      { key: "end", label: "End date", half: true, placeholder: "Present" },
      { key: "location", label: "Location" },
      {
        key: "bullets",
        label: "Achievements",
        multiline: true,
        helper: "One achievement per line. Lead with impact and quantify results.",
      },
    ],
    title: (i) => i.role || "Untitled position",
    subtitle: (i) => join(i.company, [i.start, i.end].filter(Boolean).join(" – ")),
  },
  education: {
    itemLabel: "education",
    fields: [
      { key: "degree", label: "Degree", half: true },
      { key: "school", label: "Institution", half: true },
      { key: "start", label: "Start date", half: true },
      { key: "end", label: "End date", half: true },
      { key: "location", label: "Location" },
      { key: "details", label: "Details", multiline: true, helper: "Optional — honours, GPA, coursework." },
    ],
    title: (i) => i.degree || "Untitled degree",
    subtitle: (i) => join(i.school, i.end),
  },
  skills: {
    itemLabel: "skill group",
    fields: [
      { key: "name", label: "Category", placeholder: "Languages" },
      { key: "items", label: "Skills", helper: "Comma separated.", placeholder: "TypeScript, Go, SQL" },
    ],
    title: (i) => i.name || "Untitled group",
    subtitle: (i) => i.items,
  },
  projects: {
    itemLabel: "project",
    fields: [
      { key: "name", label: "Project name", half: true },
      { key: "link", label: "Link", half: true, placeholder: "github.com/you/project" },
      { key: "description", label: "Description", multiline: true },
    ],
    title: (i) => i.name || "Untitled project",
    subtitle: (i) => i.link,
  },
  certifications: {
    itemLabel: "certification",
    fields: [
      { key: "name", label: "Certification" },
      { key: "issuer", label: "Issuer", half: true },
      { key: "date", label: "Date", half: true },
    ],
    title: (i) => i.name || "Untitled certification",
    subtitle: (i) => join(i.issuer, i.date),
  },
  languages: {
    itemLabel: "language",
    fields: [
      { key: "name", label: "Language", half: true },
      { key: "level", label: "Proficiency", half: true, placeholder: "Native, Fluent, B2…" },
    ],
    title: (i) => i.name || "Untitled language",
    subtitle: (i) => i.level,
  },
};

export const ACCENTS = [
  { value: "#1a73e8", label: "Blue" },
  { value: "#1f3a5f", label: "Navy" },
  { value: "#00695c", label: "Teal" },
  { value: "#8e2432", label: "Burgundy" },
  { value: "#5f6368", label: "Graphite" },
  { value: "#202124", label: "Black" },
];

/** Sections rendered in the narrow column of the sidebar template. */
export const SIDEBAR_SECTIONS: SectionKey[] = ["skills", "education", "certifications", "languages"];

export function uid(): string {
  return Math.random().toString(36).slice(2, 10);
}

export function emptyItem(section: ListSectionKey): ListItem {
  const item: ListItem = { id: uid() };
  for (const f of LIST_SECTIONS[section].fields) item[f.key] = "";
  return item;
}
