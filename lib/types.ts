export type SectionKey =
  | "summary"
  | "experience"
  | "education"
  | "skills"
  | "projects"
  | "certifications"
  | "languages";

export type ListSectionKey = Exclude<SectionKey, "summary">;

export interface Basics {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
}

export type ListItem = { id: string } & Record<string, string>;

export type TemplateId = "classic" | "sidebar";
export type Density = "compact" | "normal" | "relaxed";
export type FontFamily = "sans" | "serif";

export interface Settings {
  template: TemplateId;
  accent: string;
  density: Density;
  font: FontFamily;
  order: SectionKey[];
  hidden: SectionKey[];
}

export interface Resume {
  basics: Basics;
  summary: string;
  experience: ListItem[];
  education: ListItem[];
  skills: ListItem[];
  projects: ListItem[];
  certifications: ListItem[];
  languages: ListItem[];
  settings: Settings;
}

export type View = "basics" | SectionKey | "layout";
