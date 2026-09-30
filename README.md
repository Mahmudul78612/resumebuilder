# Resume Builder

A professional, one-page resume builder built with **Next.js (App Router)**, **React** and **TypeScript**.
The interface follows **Material Design 2** in the style of Google Workspace apps: a compact app bar,
a navigation drawer, outlined text fields, expansion panels and snackbars. It installs as a **PWA** and works offline.

## Features

- **Live A4 preview** with fit-to-width and zoom, plus a "fits on one page" indicator that warns when content overflows
- **Download PDF** through the browser's print dialog, with print CSS that outputs only the resume at true A4 size and keeps links clickable
- **Sections**: contact, summary, experience, education, skills, projects, certifications, languages
- Add, edit, reorder and delete entries, with **Undo** on deletes and bulk actions
- **Layout & design**: classic or two-column template, six accent colours, sans or serif typeface, three density levels, section order and visibility
- **Autosave** to the browser's local storage; **import and export JSON** for backup or moving between devices
- Responsive: rail navigation on tablets, a modal drawer and an Edit/Preview bottom bar on phones
- **PWA**: web app manifest, icons and a service worker for offline use
- No UI framework dependencies; icons are inlined Material icons

## Getting started

```bash
npm install
npm run dev                  # http://localhost:3000
npm run build && npm start   # production (service worker enabled)
npm run typecheck
```

## Project structure

```
app/                 layout, page, globals.css (design tokens + print styles), manifest
components/
  Builder.tsx        app shell and state (autosave, import/export, undo)
  AppBar.tsx, NavDrawer.tsx
  editor/            contact, summary, list sections, layout and design settings
  preview/           PreviewPane (scaling, overflow detection) and ResumeDocument (the resume itself)
  ui/                Material 2 controls: buttons, text field, switch, segmented button, menu, snackbar, icons
lib/                 types, section definitions, sample data, storage and validation
public/              service worker and app icons
scripts/             icon generation (Playwright)
```

## Exporting a PDF

Click **Download PDF**, then choose **Save as PDF** as the destination. For best results, set margins to
**None** or **Default** and enable **Background graphics** if your browser offers it.
