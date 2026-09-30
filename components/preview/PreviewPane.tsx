"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { IconButton } from "@/components/ui/controls";
import type { Resume } from "@/lib/types";
import { ResumeDocument } from "./ResumeDocument";

/** A4 at 96 CSS px per inch. */
const PAGE_W = 794;
const PAGE_H = 1123;
const ZOOMS = [0.5, 0.75, 1, 1.25];

export function PreviewPane({ resume, onPrint }: { resume: Resume; onPrint: () => void }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const [fit, setFit] = useState(0.75);
  const [zoom, setZoom] = useState<number | null>(null);
  const [height, setHeight] = useState(PAGE_H);

  useLayoutEffect(() => {
    const host = hostRef.current;
    const page = pageRef.current;
    if (!host || !page) return;
    const measure = () => {
      setFit(Math.min(1.25, Math.max(0.3, (host.clientWidth - 48) / PAGE_W)));
      setHeight(page.scrollHeight);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(host);
    ro.observe(page);
    return () => ro.disconnect();
  }, []);

  const scale = zoom ?? fit;
  const overflow = height > PAGE_H + 1;
  const pct = Math.round(scale * 100);

  const step = (dir: 1 | -1) => {
    const next = dir > 0 ? ZOOMS.find((z) => z > scale + 0.01) : [...ZOOMS].reverse().find((z) => z < scale - 0.01);
    if (next) setZoom(next);
  };

  return (
    <div className="preview">
      <div className="preview-toolbar">
        <span className="preview-title">Preview</span>
        <span className={`chip${overflow ? " chip-warn" : ""}`} role="status">
          <Icon name={overflow ? "warning" : "check"} size={16} />
          {overflow ? "Exceeds one page" : "Fits on one page"}
        </span>
        <span className="spacer" />
        <IconButton icon="refresh" size="sm" label="Fit to width" onClick={() => setZoom(null)} disabled={zoom === null} />
        <button type="button" className="zoom-step" onClick={() => step(-1)} aria-label="Zoom out" title="Zoom out">
          −
        </button>
        <span className="zoom-value">{pct}%</span>
        <button type="button" className="zoom-step" onClick={() => step(1)} aria-label="Zoom in" title="Zoom in">
          +
        </button>
        <IconButton icon="print" size="sm" label="Print or save as PDF" onClick={onPrint} />
      </div>

      <div className="preview-scroll" ref={hostRef}>
        <div className="page-frame" style={{ width: PAGE_W * scale, height: Math.max(height, PAGE_H) * scale }}>
          <div className="page-scale" style={{ transform: `scale(${scale})` }}>
            <div className="page" ref={pageRef} id="resume-print-root">
              <ResumeDocument resume={resume} />
              {overflow && (
                <div className="page-break" style={{ top: PAGE_H }} aria-hidden="true">
                  <span>Page 1 ends here</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
