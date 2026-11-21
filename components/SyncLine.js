"use client";

import { useSyncExternalStore } from "react";
import { cloudEnabled, statusSnapshot, subscribeStatus } from "@/lib/cloud";

const COPY = {
  local: "Held on this device. The code is the only key.",
  syncing: "Reaching the room.",
  synced: "Shared live between your seats.",
  error: "Not reaching the room. Changes are kept here.",
};

export default function SyncLine({ className = "", note = true }) {
  const status = useSyncExternalStore(subscribeStatus, statusSnapshot, statusSnapshot);

  if (!cloudEnabled()) {
    return (
      <p className={`sync-line ${className}`}>
        <span className="sync-dot" aria-hidden="true" />
        <span>{COPY.local}</span>
      </p>
    );
  }

  const label = COPY[status.mode] || COPY.syncing;
  const dot = status.mode === "synced" ? " on" : status.mode === "error" ? " off" : "";

  return (
    <div className={className}>
      <p className="sync-line">
        <span className={`sync-dot${dot}`} aria-hidden="true" />
        <span>{label}</span>
      </p>
      {note && status.mode === "error" && status.note ? (
        <p className="sync-note">{status.note}</p>
      ) : null}
    </div>
  );
}
