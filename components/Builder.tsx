"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AppBar } from "./AppBar";
import { NavDrawer } from "./NavDrawer";
import { BasicsEditor } from "./editor/BasicsEditor";
import { LayoutEditor } from "./editor/LayoutEditor";
import { ListEditor } from "./editor/ListEditor";
import { SummaryEditor } from "./editor/SummaryEditor";
import { PreviewPane } from "./preview/PreviewPane";
import { Icon } from "./ui/Icon";
import { Snackbar, type Toast } from "./ui/Snackbar";
import { BLANK_RESUME, SAMPLE_RESUME } from "@/lib/sample";
import { fileName, loadResume, normalizeResume, saveResume } from "@/lib/storage";
import type { ListItem, ListSectionKey, Resume, SectionKey, View } from "@/lib/types";

type MobilePane = "edit" | "preview";

export function Builder() {
  const [resume, setResume] = useState<Resume | null>(null);
  const [view, setView] = useState<View>("basics");
  const [saved, setSaved] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [pane, setPane] = useState<MobilePane>("edit");
  const [toast, setToast] = useState<Toast | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setResume(loadResume());
  }, []);

  // Debounced autosave to localStorage.
  useEffect(() => {
    if (!resume) return;
    setSaved(false);
    const t = window.setTimeout(() => setSaved(saveResume(resume)), 400);
    return () => window.clearTimeout(t);
  }, [resume]);

  const notify = useCallback((message: string, action?: Toast["action"]) => {
    setToast({ id: Date.now(), message, action });
  }, []);
  const closeToast = useCallback(() => setToast(null), []);

  const print = useCallback(() => {
    if (!resume) return;
    const title = document.title;
    document.title = fileName(resume, "").replace(/-/g, "_") || "resume";
    window.print();
    document.title = title;
  }, [resume]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        notify("All changes are saved automatically");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [notify]);

  if (!resume) {
    return (
      <div className="boot">
        <div className="progress" role="progressbar" aria-label="Loading" />
      </div>
    );
  }

  const replaceWithUndo = (next: Resume, message: string) => {
    const snapshot = resume;
    setResume(next);
    notify(message, { label: "Undo", onClick: () => setResume(snapshot) });
  };

  const update = <K extends keyof Resume>(key: K, value: Resume[K]) =>
    setResume((r) => (r ? { ...r, [key]: value } : r));

  const toggleHidden = (key: SectionKey) => {
    const hidden = resume.settings.hidden.includes(key)
      ? resume.settings.hidden.filter((h) => h !== key)
      : [...resume.settings.hidden, key];
    update("settings", { ...resume.settings, hidden });
  };

  const removeItem = (section: ListSectionKey) => (item: ListItem, index: number) => {
    update(section, resume[section].filter((i) => i.id !== item.id));
    notify("Entry deleted", {
      label: "Undo",
      onClick: () =>
        setResume((r) => {
          if (!r) return r;
          const list = [...r[section]];
          list.splice(index, 0, item);
          return { ...r, [section]: list };
        }),
    });
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(resume, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName(resume, ".json");
    a.click();
    URL.revokeObjectURL(url);
    notify("Resume exported as JSON");
  };

  const importJson = async (file: File) => {
    try {
      const next = normalizeResume(JSON.parse(await file.text()));
      replaceWithUndo(next, `Imported ${file.name}`);
    } catch {
      notify("That file is not a valid resume export");
    }
  };

  const editor = (() => {
    switch (view) {
      case "basics":
        return <BasicsEditor basics={resume.basics} onChange={(b) => update("basics", b)} />;
      case "layout":
        return <LayoutEditor settings={resume.settings} onChange={(s) => update("settings", s)} />;
      case "summary":
        return (
          <SummaryEditor
            value={resume.summary}
            onChange={(v) => update("summary", v)}
            hidden={resume.settings.hidden.includes("summary")}
            onToggleHidden={() => toggleHidden("summary")}
          />
        );
      default:
        return (
          <ListEditor
            key={view}
            section={view}
            items={resume[view]}
            onChange={(items) => update(view, items)}
            hidden={resume.settings.hidden.includes(view)}
            onToggleHidden={() => toggleHidden(view)}
            onRemove={removeItem(view)}
          />
        );
    }
  })();

  return (
    <div className={`shell pane-${pane}`}>
      <AppBar
        onMenu={() => {
          if (window.matchMedia("(max-width: 899px)").matches) setMobileNav((o) => !o);
          else setCollapsed((c) => !c);
        }}
        saved={saved}
        docName={resume.basics.name ? `${resume.basics.name} — Resume` : "Untitled resume"}
        onDownload={print}
        onImport={() => fileInput.current?.click()}
        onExport={exportJson}
        menuItems={[
          { label: "Import JSON", icon: "upload", onSelect: () => fileInput.current?.click() },
          { label: "Export JSON", icon: "download", onSelect: exportJson },
          {
            label: "Start blank resume",
            icon: "note",
            divider: true,
            onSelect: () => replaceWithUndo(structuredClone(BLANK_RESUME), "Started a blank resume"),
          },
          {
            label: "Load sample resume",
            icon: "refresh",
            onSelect: () => replaceWithUndo(structuredClone(SAMPLE_RESUME), "Sample resume loaded"),
          },
        ]}
      />

      <input
        ref={fileInput}
        type="file"
        accept="application/json,.json"
        hidden
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void importJson(f);
          e.target.value = "";
        }}
      />

      <div className="body">
        <NavDrawer
          resume={resume}
          view={view}
          onSelect={(v) => {
            setView(v);
            setPane("edit");
          }}
          collapsed={collapsed}
          mobileOpen={mobileNav}
          onCloseMobile={() => setMobileNav(false)}
        />

        <main className="workspace">
          <div className="editor-pane">
            <div className="editor-inner">{editor}</div>
          </div>
          <div className="preview-pane">
            <PreviewPane resume={resume} onPrint={print} />
          </div>
        </main>
      </div>

      <nav className="bottom-nav" aria-label="View">
        {(["edit", "preview"] as const).map((p) => (
          <button
            key={p}
            type="button"
            className={`bottom-nav-item${pane === p ? " is-active" : ""}`}
            aria-pressed={pane === p}
            onClick={() => setPane(p)}
          >
            <Icon name={p === "edit" ? "edit" : "visibility"} size={22} />
            <span>{p === "edit" ? "Edit" : "Preview"}</span>
          </button>
        ))}
      </nav>

      <Snackbar toast={toast} onClose={closeToast} />
    </div>
  );
}
