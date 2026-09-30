"use client";

import { Icon, type IconName } from "@/components/ui/Icon";
import { SECTION_META } from "@/lib/sections";
import type { Resume, View } from "@/lib/types";

interface NavItem {
  view: View;
  label: string;
  icon: IconName;
  count?: number;
  hidden?: boolean;
}

export function NavDrawer({
  resume,
  view,
  onSelect,
  collapsed,
  mobileOpen,
  onCloseMobile,
}: {
  resume: Resume;
  view: View;
  onSelect: (v: View) => void;
  collapsed: boolean;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}) {
  const sections: NavItem[] = resume.settings.order.map((key) => ({
    view: key,
    label: SECTION_META[key].label,
    icon: SECTION_META[key].icon,
    count: key === "summary" ? undefined : resume[key].length,
    hidden: resume.settings.hidden.includes(key),
  }));

  const render = (item: NavItem) => (
    <li key={item.view}>
      <button
        type="button"
        className={`nav-item${view === item.view ? " is-active" : ""}${item.hidden ? " is-muted" : ""}`}
        aria-current={view === item.view ? "page" : undefined}
        title={item.label}
        onClick={() => {
          onSelect(item.view);
          onCloseMobile();
        }}
      >
        <Icon name={item.icon} size={20} />
        <span className="nav-label">{item.label}</span>
        {item.hidden ? (
          <Icon name="visibilityOff" size={16} className="nav-meta" />
        ) : (
          item.count !== undefined && <span className="nav-count">{item.count}</span>
        )}
      </button>
    </li>
  );

  return (
    <>
      <div className={`scrim${mobileOpen ? " is-visible" : ""}`} onClick={onCloseMobile} aria-hidden="true" />
      <nav className={`drawer${collapsed ? " is-collapsed" : ""}${mobileOpen ? " is-mobile-open" : ""}`} aria-label="Resume sections">
        <ul className="nav-list">
          {render({ view: "basics", label: "Contact", icon: "person" })}
        </ul>
        <div className="nav-subheader">Sections</div>
        <ul className="nav-list">{sections.map(render)}</ul>
        <div className="nav-divider" />
        <ul className="nav-list">{render({ view: "layout", label: "Layout & design", icon: "tune" })}</ul>
      </nav>
    </>
  );
}
