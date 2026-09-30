"use client";

import { Card, TextField } from "@/components/ui/controls";
import type { Basics } from "@/lib/types";

const FIELDS: { key: keyof Basics; label: string; type?: string; half?: boolean }[] = [
  { key: "name", label: "Full name", half: true },
  { key: "title", label: "Professional title", half: true },
  { key: "email", label: "Email", type: "email", half: true },
  { key: "phone", label: "Phone", type: "tel", half: true },
  { key: "location", label: "Location", half: true },
  { key: "website", label: "Website", half: true },
  { key: "linkedin", label: "LinkedIn" },
];

export function BasicsEditor({ basics, onChange }: { basics: Basics; onChange: (b: Basics) => void }) {
  return (
    <Card title="Contact" subtitle="How recruiters will identify and reach you.">
      <div className="form-grid">
        {FIELDS.map((f) => (
          <div key={f.key} className={f.half ? "col-half" : "col-full"}>
            <TextField
              label={f.label}
              type={f.type}
              value={basics[f.key]}
              onChange={(v) => onChange({ ...basics, [f.key]: v })}
            />
          </div>
        ))}
      </div>
    </Card>
  );
}
