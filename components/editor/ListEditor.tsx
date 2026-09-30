"use client";

import { useState } from "react";
import { Button, Card, IconButton, TextField } from "@/components/ui/controls";
import { Icon } from "@/components/ui/Icon";
import { LIST_SECTIONS, SECTION_META, emptyItem } from "@/lib/sections";
import type { ListItem, ListSectionKey } from "@/lib/types";

export function ListEditor({
  section,
  items,
  onChange,
  hidden,
  onToggleHidden,
  onRemove,
}: {
  section: ListSectionKey;
  items: ListItem[];
  onChange: (items: ListItem[]) => void;
  hidden: boolean;
  onToggleHidden: () => void;
  onRemove: (item: ListItem, index: number) => void;
}) {
  const def = LIST_SECTIONS[section];
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  const update = (id: string, key: string, value: string) =>
    onChange(items.map((it) => (it.id === id ? { ...it, [key]: value } : it)));

  const move = (index: number, delta: number) => {
    const next = [...items];
    const [it] = next.splice(index, 1);
    next.splice(index + delta, 0, it);
    onChange(next);
  };

  const add = () => {
    const item = emptyItem(section);
    onChange([...items, item]);
    setOpenId(item.id);
  };

  return (
    <Card
      title={SECTION_META[section].label}
      subtitle={`${items.length} ${items.length === 1 ? "entry" : "entries"}`}
      actions={
        <IconButton
          icon={hidden ? "visibilityOff" : "visibility"}
          label={hidden ? "Show section on resume" : "Hide section from resume"}
          onClick={onToggleHidden}
        />
      }
    >
      {items.length === 0 && (
        <div className="empty-state">
          <Icon name={SECTION_META[section].icon} size={40} />
          <p>No {def.itemLabel} entries yet.</p>
        </div>
      )}

      <ul className="panels">
        {items.map((item, index) => {
          const open = openId === item.id;
          return (
            <li key={item.id} className={`panel${open ? " is-open" : ""}`}>
              <div className="panel-header">
                <button
                  type="button"
                  className="panel-toggle"
                  aria-expanded={open}
                  onClick={() => setOpenId(open ? null : item.id)}
                >
                  <span className="panel-text">
                    <span className="panel-title">{def.title(item)}</span>
                    {def.subtitle(item) && <span className="panel-subtitle">{def.subtitle(item)}</span>}
                  </span>
                  <Icon name="expand" className="panel-chevron" />
                </button>
                <div className="panel-actions">
                  <IconButton icon="up" size="sm" label="Move up" disabled={index === 0} onClick={() => move(index, -1)} />
                  <IconButton
                    icon="down"
                    size="sm"
                    label="Move down"
                    disabled={index === items.length - 1}
                    onClick={() => move(index, 1)}
                  />
                  <IconButton icon="delete" size="sm" label="Delete" onClick={() => onRemove(item, index)} />
                </div>
              </div>
              {open && (
                <div className="panel-body form-grid">
                  {def.fields.map((f) => (
                    <div key={f.key} className={f.half ? "col-half" : "col-full"}>
                      <TextField
                        label={f.label}
                        value={item[f.key] ?? ""}
                        placeholder={f.placeholder}
                        helper={f.helper}
                        multiline={f.multiline}
                        rows={f.key === "bullets" ? 6 : 3}
                        onChange={(v) => update(item.id, f.key, v)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </li>
          );
        })}
      </ul>

      <div className="card-footer">
        <Button variant="outlined" icon="add" onClick={add}>
          Add {def.itemLabel}
        </Button>
      </div>
    </Card>
  );
}
