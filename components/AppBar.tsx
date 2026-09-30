"use client";

import { Button, IconButton } from "@/components/ui/controls";
import { Icon } from "@/components/ui/Icon";
import { Menu, type MenuItem } from "@/components/ui/Menu";

export function AppBar({
  onMenu,
  saved,
  docName,
  onDownload,
  onImport,
  onExport,
  menuItems,
}: {
  onMenu: () => void;
  saved: boolean;
  docName: string;
  onDownload: () => void;
  onImport: () => void;
  onExport: () => void;
  menuItems: MenuItem[];
}) {
  return (
    <header className="appbar">
      <div className="appbar-start">
        <IconButton icon="menu" label="Main menu" onClick={onMenu} />
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">
            <Icon name="doc" size={20} />
          </span>
          <span className="brand-name">
            Resume<span className="brand-light"> Builder</span>
          </span>
        </div>
      </div>

      <div className="appbar-center">
        <div className="doc-pill">
          <Icon name="note" size={20} />
          <span className="doc-name">{docName}</span>
          <span className="doc-status">
            <Icon name={saved ? "check" : "refresh"} size={16} />
            {saved ? "Saved to this device" : "Saving…"}
          </span>
        </div>
      </div>

      <div className="appbar-end">
        <IconButton icon="upload" label="Import JSON" onClick={onImport} className="hide-sm" />
        <IconButton icon="download" label="Export JSON" onClick={onExport} className="hide-sm" />
        <Menu label="More options" items={menuItems} />
        <Button variant="contained" icon="print" onClick={onDownload} className="appbar-cta">
          Download PDF
        </Button>
      </div>
    </header>
  );
}
