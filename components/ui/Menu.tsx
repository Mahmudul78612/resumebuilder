"use client";

import { useEffect, useRef, useState } from "react";
import { Icon, type IconName } from "./Icon";
import { IconButton } from "./controls";

export interface MenuItem {
  label: string;
  icon: IconName;
  onSelect: () => void;
  divider?: boolean;
}

export function Menu({ items, label }: { items: MenuItem[]; label: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="menu-anchor" ref={ref}>
      <IconButton icon="more" label={label} aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen((o) => !o)} />
      {open && (
        <ul className="menu" role="menu">
          {items.map((item) => (
            <li key={item.label} role="none" className={item.divider ? "menu-divider-before" : undefined}>
              <button
                type="button"
                role="menuitem"
                className="menu-item"
                onClick={() => {
                  setOpen(false);
                  item.onSelect();
                }}
              >
                <Icon name={item.icon} size={20} />
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
