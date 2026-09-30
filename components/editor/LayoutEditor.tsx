"use client";

import { Card, IconButton, Segmented, Switch } from "@/components/ui/controls";
import { Icon } from "@/components/ui/Icon";
import { ACCENTS, SECTION_META } from "@/lib/sections";
import type { Settings } from "@/lib/types";

export function LayoutEditor({ settings, onChange }: { settings: Settings; onChange: (s: Settings) => void }) {
  const set = <K extends keyof Settings>(key: K, value: Settings[K]) => onChange({ ...settings, [key]: value });

  const move = (index: number, delta: number) => {
    const order = [...settings.order];
    const [s] = order.splice(index, 1);
    order.splice(index + delta, 0, s);
    set("order", order);
  };

  return (
    <>
      <Card title="Appearance" subtitle="Applied to the preview and the exported PDF.">
        <div className="setting-row">
          <div className="setting-label">Template</div>
          <div className="template-options" role="radiogroup" aria-label="Template">
            {(["classic", "sidebar"] as const).map((t) => (
              <button
                key={t}
                type="button"
                role="radio"
                aria-checked={settings.template === t}
                className={`template-option${settings.template === t ? " is-active" : ""}`}
                onClick={() => set("template", t)}
              >
                <span className={`template-thumb template-thumb-${t}`} aria-hidden="true">
                  <i />
                  <i />
                  <i />
                  <i />
                </span>
                <span>{t === "classic" ? "Classic" : "Two column"}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="setting-row">
          <div className="setting-label">Accent colour</div>
          <div className="swatches" role="radiogroup" aria-label="Accent colour">
            {ACCENTS.map((a) => (
              <button
                key={a.value}
                type="button"
                role="radio"
                aria-checked={settings.accent === a.value}
                aria-label={a.label}
                title={a.label}
                className={`swatch${settings.accent === a.value ? " is-active" : ""}`}
                style={{ background: a.value }}
                onClick={() => set("accent", a.value)}
              >
                {settings.accent === a.value && <Icon name="check" size={16} />}
              </button>
            ))}
          </div>
        </div>

        <div className="setting-row">
          <div className="setting-label">Typeface</div>
          <Segmented
            label="Typeface"
            value={settings.font}
            onChange={(v) => set("font", v)}
            options={[
              { value: "sans", label: "Sans serif" },
              { value: "serif", label: "Serif" },
            ]}
          />
        </div>

        <div className="setting-row">
          <div className="setting-label">Density</div>
          <Segmented
            label="Density"
            value={settings.density}
            onChange={(v) => set("density", v)}
            options={[
              { value: "compact", label: "Compact" },
              { value: "normal", label: "Default" },
              { value: "relaxed", label: "Relaxed" },
            ]}
          />
        </div>
      </Card>

      <Card title="Sections" subtitle="Reorder sections and choose which appear on the resume.">
        <ul className="order-list">
          {settings.order.map((key, index) => {
            const visible = !settings.hidden.includes(key);
            return (
              <li key={key} className={`order-item${visible ? "" : " is-hidden"}`}>
                <Icon name={SECTION_META[key].icon} size={20} className="order-icon" />
                <span className="order-label">{SECTION_META[key].label}</span>
                <IconButton icon="up" size="sm" label="Move up" disabled={index === 0} onClick={() => move(index, -1)} />
                <IconButton
                  icon="down"
                  size="sm"
                  label="Move down"
                  disabled={index === settings.order.length - 1}
                  onClick={() => move(index, 1)}
                />
                <Switch
                  checked={visible}
                  label={`Show ${SECTION_META[key].label}`}
                  onChange={(on) =>
                    set("hidden", on ? settings.hidden.filter((h) => h !== key) : [...settings.hidden, key])
                  }
                />
              </li>
            );
          })}
        </ul>
      </Card>
    </>
  );
}
