import type { CSSProperties, ReactNode } from "react";
import { SECTION_META, SIDEBAR_SECTIONS } from "@/lib/sections";
import type { ListItem, Resume, SectionKey } from "@/lib/types";

const lines = (text: string | undefined) =>
  (text ?? "")
    .split("\n")
    .map((l) => l.replace(/^\s*[-•*]\s*/, "").trim())
    .filter(Boolean);

const range = (start?: string, end?: string) => [start, end].filter(Boolean).join(" – ");

const href = (value: string) => (/^https?:\/\//i.test(value) ? value : `https://${value}`);

function Section({ id, title, children }: { id: SectionKey; title: string; children: ReactNode }) {
  return (
    <section className={`r-section r-section-${id}`}>
      <h2 className="r-heading">{title}</h2>
      {children}
    </section>
  );
}

function Entry({
  title,
  org,
  date,
  location,
  children,
}: {
  title?: string;
  org?: string;
  date?: string;
  location?: string;
  children?: ReactNode;
}) {
  return (
    <div className="r-entry">
      <div className="r-entry-head">
        <div className="r-entry-title">
          {title && <strong>{title}</strong>}
          {title && org && <span className="r-sep">,</span>}
          {org && <span className="r-org"> {org}</span>}
        </div>
        {date && <div className="r-date">{date}</div>}
      </div>
      {location && <div className="r-location">{location}</div>}
      {children}
    </div>
  );
}

function Bullets({ text }: { text?: string }) {
  const items = lines(text);
  if (!items.length) return null;
  return (
    <ul className="r-bullets">
      {items.map((b, i) => (
        <li key={i}>{b}</li>
      ))}
    </ul>
  );
}

function renderSection(key: SectionKey, r: Resume, narrow: boolean): ReactNode {
  const title = SECTION_META[key].label;
  const has = (list: ListItem[]) => list.length > 0;

  switch (key) {
    case "summary":
      return r.summary.trim() ? (
        <Section id={key} title={title}>
          <p className="r-summary">{r.summary}</p>
        </Section>
      ) : null;

    case "experience":
      return has(r.experience) ? (
        <Section id={key} title={title}>
          {r.experience.map((e) => (
            <Entry key={e.id} title={e.role} org={e.company} date={range(e.start, e.end)} location={e.location}>
              <Bullets text={e.bullets} />
            </Entry>
          ))}
        </Section>
      ) : null;

    case "education":
      return has(r.education) ? (
        <Section id={key} title={title}>
          {r.education.map((e) =>
            narrow ? (
              <div key={e.id} className="r-stack">
                <strong>{e.degree}</strong>
                <div>{e.school}</div>
                <div className="r-muted">{[range(e.start, e.end), e.location].filter(Boolean).join(" · ")}</div>
                {e.details && <div className="r-muted">{e.details}</div>}
              </div>
            ) : (
              <Entry key={e.id} title={e.degree} org={e.school} date={range(e.start, e.end)} location={e.location}>
                {e.details && <p className="r-details">{e.details}</p>}
              </Entry>
            ),
          )}
        </Section>
      ) : null;

    case "skills":
      return has(r.skills) ? (
        <Section id={key} title={title}>
          {narrow ? (
            r.skills.map((s) => (
              <div key={s.id} className="r-stack">
                {s.name && <strong>{s.name}</strong>}
                <div>{s.items}</div>
              </div>
            ))
          ) : (
            <dl className="r-skills">
              {r.skills.map((s) => (
                <div key={s.id} className="r-skill-row">
                  <dt>{s.name}</dt>
                  <dd>{s.items}</dd>
                </div>
              ))}
            </dl>
          )}
        </Section>
      ) : null;

    case "projects":
      return has(r.projects) ? (
        <Section id={key} title={title}>
          {r.projects.map((p) => (
            <div key={p.id} className="r-entry">
              <div className="r-entry-head">
                <div className="r-entry-title">
                  <strong>{p.name}</strong>
                </div>
                {p.link && (
                  <a className="r-date r-link" href={href(p.link)}>
                    {p.link}
                  </a>
                )}
              </div>
              {p.description && <p className="r-details">{p.description}</p>}
            </div>
          ))}
        </Section>
      ) : null;

    case "certifications":
      return has(r.certifications) ? (
        <Section id={key} title={title}>
          {r.certifications.map((c) =>
            narrow ? (
              <div key={c.id} className="r-stack">
                <strong>{c.name}</strong>
                <div className="r-muted">{[c.issuer, c.date].filter(Boolean).join(" · ")}</div>
              </div>
            ) : (
              <Entry key={c.id} title={c.name} org={c.issuer} date={c.date} />
            ),
          )}
        </Section>
      ) : null;

    case "languages":
      return has(r.languages) ? (
        <Section id={key} title={title}>
          <ul className="r-inline">
            {r.languages.map((l) => (
              <li key={l.id}>
                <strong>{l.name}</strong>
                {l.level && <span className="r-muted"> — {l.level}</span>}
              </li>
            ))}
          </ul>
        </Section>
      ) : null;
  }
}

export function ResumeDocument({ resume }: { resume: Resume }) {
  const { basics, settings } = resume;
  const visible = settings.order.filter((k) => !settings.hidden.includes(k));
  const sidebar = settings.template === "sidebar";
  const main = sidebar ? visible.filter((k) => !SIDEBAR_SECTIONS.includes(k)) : visible;
  const side = sidebar ? visible.filter((k) => SIDEBAR_SECTIONS.includes(k)) : [];

  const contacts: ReactNode[] = [];
  if (basics.email) contacts.push(<a href={`mailto:${basics.email}`}>{basics.email}</a>);
  if (basics.phone) contacts.push(<a href={`tel:${basics.phone.replace(/[^+\d]/g, "")}`}>{basics.phone}</a>);
  if (basics.location) contacts.push(<span>{basics.location}</span>);
  if (basics.website) contacts.push(<a href={href(basics.website)}>{basics.website}</a>);
  if (basics.linkedin) contacts.push(<a href={href(basics.linkedin)}>{basics.linkedin}</a>);

  const style = { "--accent": settings.accent } as CSSProperties;

  return (
    <article
      className={`resume r-${settings.template} r-${settings.density} r-font-${settings.font}`}
      style={style}
      aria-label="Resume preview"
    >
      <header className="r-header">
        <h1 className="r-name">{basics.name || "Your Name"}</h1>
        {basics.title && <div className="r-title">{basics.title}</div>}
        {contacts.length > 0 && (
          <ul className="r-contacts">
            {contacts.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        )}
      </header>

      {sidebar ? (
        <div className="r-columns">
          <div className="r-main">{main.map((k) => <div key={k}>{renderSection(k, resume, false)}</div>)}</div>
          <aside className="r-side">{side.map((k) => <div key={k}>{renderSection(k, resume, true)}</div>)}</aside>
        </div>
      ) : (
        main.map((k) => <div key={k}>{renderSection(k, resume, false)}</div>)
      )}
    </article>
  );
}
