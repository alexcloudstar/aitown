"use client";

import { useRef, useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface UploadZoneProps {
  onFile: (file: File) => void;
  disabled?: boolean;
}

export function UploadZone({ onFile, disabled }: UploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      if (disabled) return;
      const file = e.dataTransfer.files[0];
      if (file && file.name.endsWith(".zip")) {
        onFile(file);
      }
    },
    [onFile, disabled]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) onFile(file);
    },
    [onFile]
  );

  return (
    <Card
      className={`border-2 border-dashed transition-colors cursor-pointer ${
        isDragOver
          ? "border-[color:var(--color-amber)] bg-[color:var(--color-amber)]/5"
          : "border-[color:var(--border)] hover:border-[color:var(--color-amber)]/50"
      } ${disabled ? "opacity-50 pointer-events-none" : ""}`}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
    >
      <CardContent className="flex flex-col items-center justify-center py-12 gap-3">
        <div className="text-4xl mb-2">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <rect x="12" y="8" width="24" height="32" rx="0" fill="var(--color-surface)" stroke="var(--color-amber)" strokeWidth="2"/>
            <path d="M20 24L24 20L28 24" stroke="var(--color-amber)" strokeWidth="2"/>
            <path d="M24 20V32" stroke="var(--color-amber)" strokeWidth="2"/>
          </svg>
        </div>
        <p
          className="text-sm font-medium text-[color:var(--color-amber)]"
          style={{ fontFamily: "var(--font-display)", fontSize: "10px" }}
        >
          Drop your ZIP here
        </p>
        <p className="text-xs text-muted-foreground">
          or click to browse. Accepts .zip files from Claude export.
        </p>
        <input
          ref={inputRef}
          type="file"
          accept=".zip"
          className="hidden"
          onChange={handleChange}
        />
      </CardContent>
    </Card>
  );
}
