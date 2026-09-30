"use client";

import { Card, IconButton, TextField } from "@/components/ui/controls";

const TARGET = 450;

export function SummaryEditor({
  value,
  onChange,
  hidden,
  onToggleHidden,
}: {
  value: string;
  onChange: (v: string) => void;
  hidden: boolean;
  onToggleHidden: () => void;
}) {
  const over = value.length > TARGET;
  return (
    <Card
      title="Summary"
      subtitle="Two to four sentences describing your experience and focus."
      actions={
        <IconButton
          icon={hidden ? "visibilityOff" : "visibility"}
          label={hidden ? "Show section on resume" : "Hide section from resume"}
          onClick={onToggleHidden}
        />
      }
    >
      <TextField label="Professional summary" value={value} onChange={onChange} multiline rows={7} />
      <div className={`counter${over ? " counter-warn" : ""}`}>
        {value.length} / {TARGET} recommended characters
      </div>
    </Card>
  );
}
